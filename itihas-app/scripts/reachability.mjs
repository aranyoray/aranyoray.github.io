// Run after esbuild bundles src/engine.ts to node_modules/.cache/butterfly-engine.mjs.
import fs from "node:fs";
import * as engine from "../node_modules/.cache/butterfly-engine.mjs";
const read = (n) =>
  JSON.parse(
    fs.readFileSync(
      new URL("../public/content/cold-war/" + n + ".json", import.meta.url),
      "utf8",
    ),
  );
const content = { endings: read("endings"), flashpoints: read("flashpoints") };
const report = {
  method:
    "Exhaustive 3^8 main-decision paths, two fixed flashpoint policies, seeded risk, both difficulties. Early nuclear endings prune later decisions. This is a reachability sample across flashpoint policies, not all possible random draws.",
  countries: {},
  witnesses: {},
};
for (const cid of ["USA", "USSR", "CHN", "UK", "FRG", "CUB", "IND"]) {
  const c = read(cid);
  report.countries[cid] = {};
  for (const difficulty of ["student", "historian"]) {
    const counts = {};
    for (let policy = 0; policy < 2; policy++) {
      const initial = engine.createSession(
        c,
        {
          difficulty,
          teacher: false,
          council: false,
          readable: false,
          auto: false,
        },
        policy ? 719 : 431,
      );
      function walk(s, path) {
        if (s.phase === "ending") {
          counts[s.endingId] = (counts[s.endingId] || 0) + 1;
          report.witnesses[s.endingId] ??= {
            country: cid,
            difficulty,
            path,
            flashPolicy: policy,
          };
          return;
        }
        for (let i = 0; i < 3; i++) {
          let n = engine.choose(
            { ...s, phase: "decision" },
            engine.currentNode(c, s).choices[i],
            c,
          );
          if (n.phase !== "ending") n = engine.skipRipples(n);
          if (n.phase !== "ending") n = engine.finishBeat(n, content);
          if (n.phase !== "ending")
            n = engine.chooseFlash(
              n,
              content.flashpoints[n.turn - 1],
              n.turn === 7 ? 0 : policy,
              c,
            );
          if (n.phase !== "ending") n = engine.skipRipples(n);
          if (n.phase !== "ending") n = engine.finishBeat(n, content);
          n.events = [];
          n.history = n.history.map((h) => ({
            ...h,
            before: { ...h.before, eventCount: 0 },
          }));
          walk(n, [...path, String.fromCharCode(65 + i)]);
        }
      }
      walk(initial, []);
    }
    report.countries[cid][difficulty] = {
      distinct: Object.keys(counts).length,
      endings: counts,
    };
    process.stdout.write(
      `${cid} ${difficulty}: ${Object.keys(counts).length} endings\n`,
    );
  }
}
report.unreached = content.endings
  .map((e) => e.id)
  .filter((id) => !report.witnesses[id]);
fs.writeFileSync(
  new URL("../REACHABILITY.json", import.meta.url),
  JSON.stringify(report, null, 2) + "\n",
);
console.log("Unreached in matrix:", report.unreached);
