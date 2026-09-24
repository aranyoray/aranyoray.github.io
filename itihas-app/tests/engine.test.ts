import { describe, it, expect } from "vitest";
import fs from "node:fs";
import {
  CountrySchema,
  ContentSchema,
  SessionSchema,
  type Country,
  type Session,
  type Content,
} from "../src/types";
import {
  currentNode,
  createSession,
  choose,
  skipRipples,
  finishBeat,
  chooseFlash,
  resolveEnding,
  replay,
  reveal,
  advanceRipple,
  delta,
  percent,
} from "../src/engine";
const get = (n: string) =>
  JSON.parse(
    fs.readFileSync(
      new URL("../public/content/cold-war/" + n + ".json", import.meta.url),
      "utf8",
    ),
  );
const countries = ["USA", "USSR", "CHN", "UK", "FRG", "CUB", "IND"].map((id) =>
  CountrySchema.parse(get(id)),
);
const content = ContentSchema.parse(
  Object.fromEntries(
    ["endings", "flashpoints", "vocabulary", "badges", "sources"].map((n) => [
      n,
      get(n),
    ]),
  ),
);
const opts = {
  difficulty: "student" as const,
  teacher: false,
  council: false,
  readable: false,
  auto: false,
};
function turn(s: Session, c: Country, choice: number, fp = 0) {
  s = { ...s, phase: "decision" };
  s = choose(s, currentNode(c, s).choices[choice], c);
  if (s.phase === "ending") return s;
  s = skipRipples(s);
  if (s.phase === "ending") return s;
  s = finishBeat(s, content);
  s = chooseFlash(s, content.flashpoints[s.turn - 1], fp, c);
  if (s.phase === "ending") return s;
  s = skipRipples(s);
  return s.phase === "ending" ? s : finishBeat(s, content);
}
describe("content and gameplay invariants", () => {
  it("validates 7 countries, 168 unique choices, 888 unique effects, and 20 ordered endings", () => {
    expect(countries).toHaveLength(7);
    const choices = countries.flatMap((c) => c.nodes.flatMap((n) => n.choices));
    expect(choices).toHaveLength(168);
    expect(new Set(choices.map((c) => c.id)).size).toBe(168);
    const effects = choices.flatMap((c) => c.effects);
    expect(effects).toHaveLength(888);
    expect(new Set(effects.map((e) => e.id)).size).toBe(888);
    expect(content.endings).toHaveLength(20);
    expect(content.endings.at(-1)?.conditions).toEqual([]);
    for (const c of countries)
      expect(c.nodes.map((n) => n.turn)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(
      countries.reduce((n, c) => n + JSON.stringify(c).length, 0),
    ).toBeLessThan(2_000_000);
  });
  for (const c of countries)
    for (const difficulty of ["student", "historian"] as const)
      it(
        c.id +
          " / " +
          difficulty +
          " reaches an ending after historical choices",
        () => {
          let s = createSession(c, { ...opts, difficulty }, 123);
          while (s.phase !== "ending") s = turn(s, c, 0);
          expect(s.history).toHaveLength(8);
          expect(s.meters.TENSION).toBeLessThan(100);
          expect(s.endingId).toBeTruthy();
          expect(percent(s)).toBe(100);
          SessionSchema.parse(s);
        },
      );
  it("clamps all meters and stops immediately at 100 tension", () => {
    expect(
      delta(
        { TENSION: 99, ECON: 1, STABILITY: 50, INFLUENCE: 90 },
        { TENSION: 15, ECON: -5, INFLUENCE: 99 },
      ),
    ).toEqual({ TENSION: 100, ECON: 0, STABILITY: 50, INFLUENCE: 100 });
    const c = countries[0];
    let s = {
      ...createSession(c, opts),
      phase: "decision" as const,
      meters: { ...c.startMeters, TENSION: 99 },
    };
    expect(choose(s, c.nodes[0].choices[0], c).endingId).toBe(
      "E01_NUCLEAR_WINTER",
    );
  });
  it("does not let double clicks apply choices or effects twice", () => {
    const c = countries[0];
    const s = { ...createSession(c, opts), phase: "decision" as const };
    const chosen = choose(s, c.nodes[0].choices[0], c);
    expect(choose(chosen, c.nodes[0].choices[0], c)).toEqual(chosen);
    const r = reveal(chosen);
    expect(reveal(r)).toEqual(r);
  });
  it("evaluates OR/AND triggers and higher-priority endings before fallback", () => {
    let s = createSession(countries[1], opts);
    s.flags = ["HUNGARY_FREE"];
    s.meters.TENSION = 30;
    expect(resolveEnding(s, content.endings).id).toBe("E14_EARLY_THAW");
    s.flags.push("NUKE_USED");
    expect(resolveEnding(s, content.endings).id).toBe("E02_LIMITED_EXCHANGE");
    s.meters.TENSION = 95;
    expect(resolveEnding(s, content.endings).id).toBe("E01_NUCLEAR_WINTER");
  });
  it("replay restores the exact earlier meters, flags, random state and pending queue", () => {
    const c = countries[0];
    let s = createSession(c, opts, 123);
    s = turn(s, c, 1);
    const before = structuredClone(s);
    s = turn(s, c, 2);
    const r = replay(s, 2);
    expect(r.meters).toEqual(before.meters);
    expect(r.flags).toEqual(before.flags);
    expect(r.rng).toBe(before.rng);
    expect(r.events).toEqual(before.events);
    expect(r.pending).toEqual(before.pending);
    expect(r.history).toHaveLength(1);
    expect(r.turn).toBe(2);
    expect(
      replay({ ...s, options: { ...s.options, teacher: true } }, 1).history,
    ).toHaveLength(2);
  });
  it("uses seeded chance draws consistently after save/restore", () => {
    const c = countries[1];
    let s = { ...createSession(c, opts, 7), phase: "decision" as const };
    const a = skipRipples(choose(s, c.nodes[0].choices[2], c));
    const b = skipRipples(
      choose(
        SessionSchema.parse(JSON.parse(JSON.stringify(s))),
        c.nodes[0].choices[2],
        c,
      ),
    );
    expect(a).toEqual(b);
  });
  it("applies deferred economy changes on the following beat, exactly once", () => {
    const c = countries[0];
    let s = createSession(c, opts);
    s.turn = 6;
    s.phase = "flashpoint";
    s = chooseFlash(s, content.flashpoints[5], 0, c);
    const econ = s.meters.ECON;
    s = skipRipples(s);
    expect(s.meters.ECON).toBe(econ);
    expect(s.pending).toHaveLength(1);
    s = finishBeat(s, content);
    expect(s.meters.ECON).toBe(econ + 3);
    expect(s.pending).toHaveLength(0);
    expect(finishBeat(s, content).meters.ECON).toBe(econ + 3);
  });
  it("resolves Chernobyl’s disclosure cost before selecting the ending", () => {
    const c = countries[0];
    let s = createSession(c, opts);
    s.turn = 8;
    s.phase = "flashpoint";
    s.meters.STABILITY = 17;
    s = chooseFlash(s, content.flashpoints[7], 1, c);
    expect(s.meters.STABILITY).toBe(19);
    s = skipRipples(s);
    expect(s.meters.STABILITY).toBe(9);
    s = finishBeat(s, content);
    expect(s.endingId).toBe("E06_COUP_AT_HOME");
  });
  it("finishes random paths without NaN, stalls or out-of-range values", () => {
    for (const c of countries)
      for (let seed = 1; seed < 50; seed++) {
        let s = createSession(c, opts, seed);
        let limit = 0;
        while (s.phase !== "ending" && limit++ < 8)
          s = turn(
            s,
            c,
            (seed * 13 + limit * 7) % 3,
            limit === 7 ? 0 : seed % 2,
          );
        expect(s.phase).toBe("ending");
        SessionSchema.parse(s);
      }
  });
});

const matrix = JSON.parse(
  fs.readFileSync(new URL("../REACHABILITY.json", import.meta.url), "utf8"),
);
describe("published ending witnesses", () => {
  for (const [id, w] of Object.entries(matrix.witnesses) as [
    string,
    {
      country: string;
      difficulty: "student" | "historian";
      path: string[];
      flashPolicy: number;
    },
  ][])
    it(id + " is reachable", () => {
      const c = countries.find((c) => c.id === w.country)!;
      let s = createSession(
        c,
        { ...opts, difficulty: w.difficulty },
        w.flashPolicy ? 719 : 431,
      );
      for (const letter of w.path) {
        s = turn(
          s,
          c,
          letter.charCodeAt(0) - 65,
          s.turn === 7 ? 0 : w.flashPolicy,
        );
        if (s.phase === "ending") break;
      }
      expect(s.endingId).toBe(id);
    });
});
