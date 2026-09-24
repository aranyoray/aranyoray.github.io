import {
  type Country,
  type Session,
  type Choice,
  type Condition,
  type Ending,
  type GameEvent,
  type Content,
  type Flashpoint,
  type Meters,
  type Options,
  type Snapshot,
  keys,
} from "./types";
export function currentNode(c: Country, s: Session) {
  const node = c.nodes[s.turn - 1];
  return {
    ...node,
    choices: node.choices.map((ch) => {
      const v = ch.conditional?.find((v) =>
        v.requires.every((f) => s.flags.includes(f)),
      );
      return v
        ? {
            ...ch,
            label: v.label,
            summary: v.summary,
            flags: v.flags,
            effects: v.effects,
          }
        : ch;
    }),
  };
}
export const percent = (s: Session) =>
  s.history.length
    ? Math.round(
        (s.history.filter((h) => h.historical).length / s.history.length) * 100,
      )
    : 100;
export function delta(m: Meters, d: Partial<Meters> = {}): Meters {
  return Object.fromEntries(
    keys.map((k) => [k, Math.max(0, Math.min(100, m[k] + (d[k] || 0)))]),
  ) as Meters;
}
export function distance(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  const r = Math.PI / 180;
  const h =
    Math.sin(((b.lat - a.lat) * r) / 2) ** 2 +
    Math.cos(a.lat * r) *
      Math.cos(b.lat * r) *
      Math.sin(((b.lng - a.lng) * r) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(Math.min(1, h)));
}
export function createSession(
  country: Country,
  options: Options,
  seed = Date.now() >>> 0,
): Session {
  return {
    version: 1,
    countryId: country.id,
    options,
    turn: 1,
    phase: "headline",
    meters: { ...country.startMeters },
    flags: [],
    rng: seed,
    history: [],
    events: [],
    pending: [],
    queue: [],
    queueIndex: 0,
    prediction: null,
    flashChoices: {},
    endingId: null,
    discussion: [],
    notes: {},
  };
}
export function condition(c: Condition, s: Session): boolean {
  if ("any" in c) return c.any.some((x) => condition(x, s));
  if ("all" in c) return c.all.every((x) => condition(x, s));
  if ("flag" in c) return s.flags.includes(c.flag) === c.set;
  if ("country" in c) return s.countryId === c.country;
  if ("notCountry" in c) return s.countryId !== c.notCountry;
  if ("choice" in c) return s.history.some((h) => h.choiceId === c.choice);
  const value = "meter" in c ? s.meters[c.meter] : percent(s);
  const op = "op" in c ? c.op : c.historicalPct;
  return op === ">=" ? value >= c.value : value <= c.value;
}
export function resolveEnding(s: Session, ends: Ending[]): Ending {
  const e = [...ends]
    .sort((a, b) => b.priority - a.priority)
    .find((e) => e.conditions.every((c) => condition(c, s)));
  if (!e) throw Error("No fallback ending");
  return e;
}
function checkStop(s: Session): Session {
  if (
    s.meters.TENSION >= 100 ||
    (s.flags.includes("NUKE_USED") && s.meters.TENSION >= 90)
  ) {
    s.phase = "ending";
    s.endingId = "E01_NUCLEAR_WINTER";
    s.queue = [];
  }
  return s;
}
const copy = (s: Session): Session => structuredClone(s);
const addFlags = (s: Session, fs: string[]) => {
  s.flags = [...new Set([...s.flags, ...fs])];
};
export const snapshot = (s: Session): Snapshot => ({
  meters: { ...s.meters },
  flags: [...s.flags],
  rng: s.rng,
  eventCount: s.events.length,
  pending: structuredClone(s.pending),
});
export function choose(s: Session, ch: Choice, c: Country): Session {
  if (
    s.phase !== "decision" ||
    !c.nodes[s.turn - 1].choices.some((x) => x.id === ch.id) ||
    ch.requires?.some((f) => !s.flags.includes(f))
  )
    return s;
  const n = copy(s);
  const node = c.nodes[n.turn - 1];
  n.history.push({
    turn: n.turn,
    choiceId: ch.id,
    historical: ch.historical,
    before: snapshot(n),
    prediction: n.prediction,
    deescalated: n.meters.TENSION >= 80 && (ch.meterDelta.TENSION || 0) < 0,
    predictionCorrect:
      !!n.prediction &&
      node.advisors.find((a) => a.id === n.prediction)?.recommends ===
        node.choices.find((x) => x.historical)?.id,
  });
  n.meters = delta(n.meters, ch.meterDelta);
  addFlags(n, ch.flags);
  n.queue = ch.effects
    .map((e) => ({
      ...e,
      turn: n.turn,
      year: node.year,
      choiceId: ch.id,
      choiceLabel: ch.label,
      country: c.id,
      historical: ch.historical,
      viewed: false,
    }))
    .sort((a, b) => distance(c, a) - distance(c, b));
  n.queueIndex = 0;
  n.phase = "ripple";
  return checkStop(n);
}
function random(s: Session) {
  s.rng = (Math.imul(1664525, s.rng) + 1013904223) >>> 0;
  return s.rng / 4294967296;
}
export function reveal(s: Session): Session {
  if (
    !["ripple", "flash-ripple"].includes(s.phase) ||
    s.queueIndex >= s.queue.length
  )
    return s;
  const n = copy(s);
  const e = n.queue[n.queueIndex];
  if (e.resolved) return s;
  e.resolved = true;
  e.viewed = true;
  if (e.chance) {
    e.chanceHit = random(n) < e.chance[n.options.difficulty];
    if (e.chanceHit) addFlags(n, [e.chance.flag]);
    e.text =
      (e.chanceHit ? e.chance.successText : e.chance.failureText) || e.text;
  }
  if (e.flag) addFlags(n, [e.flag]);
  if (e.delay) {
    n.pending.push({ ...e, dueTurn: n.turn + e.delay, delay: 0 });
  } else n.meters = delta(n.meters, e.meterDelta);
  n.events.push({ ...e });
  return checkStop(n);
}
export function advanceRipple(s: Session): Session {
  if (!["ripple", "flash-ripple"].includes(s.phase)) return s;
  let n = s.queue[s.queueIndex]?.resolved ? copy(s) : reveal(s);
  if (n.phase === "ending") return n;
  n.queueIndex++;
  return n;
}
export function skipRipples(s: Session): Session {
  let n = copy(s);
  while (n.queueIndex < n.queue.length && n.phase !== "ending") {
    const viewed = !!n.queue[n.queueIndex].resolved;
    const id = n.queue[n.queueIndex].id;
    n = advanceRipple(n);
    if (!viewed) {
      const event = n.events.find((e) => e.id === id);
      if (event) event.viewed = false;
    }
  }
  return n;
}
export function chooseFlash(
  s: Session,
  f: Flashpoint,
  index: number,
  c: Country,
): Session {
  if (
    s.phase !== "flashpoint" ||
    f.afterTurn !== s.turn ||
    s.flashChoices[f.id]
  )
    return s;
  const opt = f.options[index];
  if (!opt) return s;
  const n = copy(s);
  n.flashChoices[f.id] = opt.id;
  let change = { ...opt.meterDelta };
  if (f.id === "FP5" && index === 0) {
    change = ["USSR", "CUB", "CHN"].includes(c.id)
      ? { STABILITY: -3 }
      : ["USA", "UK", "FRG"].includes(c.id)
        ? { INFLUENCE: 4 }
        : { INFLUENCE: 2 };
  }
  n.meters = delta(n.meters, change);
  const e = { ...opt.effect };
  if (e.place === "{capital}") {
    e.place = c.capital;
    e.lat = c.lat;
    e.lng = c.lng;
  }
  n.queue = [
    {
      ...e,
      id: c.id + "_" + e.id,
      turn: n.turn,
      year: f.year,
      choiceId: opt.id,
      choiceLabel: opt.label,
      country: c.id,
      historical: f.cutscene,
      viewed: false,
    },
  ];
  n.queueIndex = 0;
  n.phase = "flash-ripple";
  return checkStop(n);
}
export function finishBeat(s: Session, content: Content): Session {
  const n = copy(s);
  if (n.phase === "ripple" && n.queueIndex >= n.queue.length) {
    n.phase = "flashpoint";
    return n;
  }
  if (n.phase === "flash-ripple" && n.queueIndex >= n.queue.length) {
    n.queue = [];
    n.queueIndex = 0;
    const due = n.pending.filter((e) => (e.dueTurn || 0) <= n.turn + 1);
    n.pending = n.pending.filter((e) => (e.dueTurn || 0) > n.turn + 1);
    for (const e of due) n.meters = delta(n.meters, e.meterDelta);
    const checked = checkStop(n);
    if (checked.phase === "ending") return checked;
    if (n.turn === 8) {
      n.endingId = resolveEnding(n, content.endings).id;
      n.phase = "ending";
    } else {
      n.turn++;
      n.phase = "headline";
      n.prediction = null;
    }
    return n;
  }
  return s;
}
export function replay(s: Session, turn: number): Session {
  if (s.options.teacher || s.options.council) return s;
  const h = s.history.find((h) => h.turn === turn);
  if (!h) return s;
  return {
    ...copy(s),
    ...structuredClone(h.before),
    countryId: s.countryId,
    turn,
    phase: "headline",
    history: s.history.filter((h) => h.turn < turn),
    events: s.events.slice(0, h.before.eventCount),
    flashChoices: Object.fromEntries(
      Object.entries(s.flashChoices).filter(
        ([key]) => Number(key.slice(2)) < turn,
      ),
    ),
    queue: [],
    queueIndex: 0,
    prediction: null,
    endingId: null,
    discussion: [],
    notes: {},
  };
}
export function earnedBadges(s: Session): string[] {
  const ids: string[] = [];
  const finished = s.phase === "ending";
  const full = finished && s.history.length === 8;
  if (s.history.some((h) => h.deescalated)) ids.push("arkhipov");
  if (s.history.filter((h) => h.historical).length >= 7) ids.push("historian");
  if (
    full &&
    !s.history.some((h) => h.historical) &&
    !s.flags.includes("NUKE_USED") &&
    s.meters.TENSION < 100
  )
    ids.push("chaos");
  if (
    full &&
    s.events.length ===
      s.history.length *
        (s.countryId === "USA" || s.countryId === "USSR" ? 6 : 5) +
        8 &&
    s.events.every((e) => e.viewed)
  )
    ids.push("collector");
  if (["E19_HISTORY_AS_IT_WAS", "E13_GRAND_BARGAIN"].includes(s.endingId || ""))
    ids.push("long-game");
  if (s.history.filter((h) => h.predictionCorrect).length >= 6)
    ids.push("cassandra");
  if (finished && s.meters.ECON >= 80) ids.push("treasurer");
  if (finished && s.meters.TENSION <= 20) ids.push("peace");
  if (s.endingId === "E16_NONALIGNED_WORLD") ids.push("nonaligned");
  if (s.discussion.length === 3) ids.push("reader");
  return ids;
}
