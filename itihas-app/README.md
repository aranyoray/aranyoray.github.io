# Butterfly: Cold War

The replacement for the former Itihas timeline game at `/itihas/`.

Seven playable countries, eight decision eras each, 168 primary choices, 888 primary ripple effects, eight shared flashpoints, and twenty ending definitions. Historical and counterfactual branches stay separate in the debrief. React 18, TypeScript, Vite, Zustand, Zod, MapLibre, and a Leaflet fallback.

## Run and publish

```sh
npm ci
npm run dev
npm test
npx playwright install chromium
npm run test:browser
npm run build
```

The development URL is `http://127.0.0.1:5173/itihas/`. Browser tests expect the development server to be running. `npm run build` replaces **only `../itihas/`** with the static deployment. The generated output uses relative URLs and can be served at `/itihas/` or at a repository subpath. GitHub Pages serves the committed build; no production Node process is required.

To reproduce the content import:

```sh
python3 scripts/import-spec.py docs/cold-war-sim-spec.md docs/cold-war-sim-spec-part2.md
python3 scripts/enrich-content.py
```

JSON in `public/content/cold-war/` is the published content source. The importer and enrichment script record editorial adjustments. All narrative, endings, vocabulary and scenarios are local data. All content is under 1 MB uncompressed. Country packs are loaded on selection. The map uses bundled Natural Earth coastlines and a local graticule; it makes no tile, font or third-party requests. Source links open only when a reader chooses them. An initial page load still needs the site's assets; this is not a service-worker installation.

## Tests

- Engine/content tests: schema and ID invariants; all seven historical paths in both modes; immediate nuclear hard stops; clamping; duplicate click protection; delayed effects; priority/OR ending rules; seeded save restoration; replay snapshots; hundreds of sample playthroughs.
- Browser tests: a complete game, debrief, saved notes, CSV download, reload/resume, mobile overflow, council voting, invalid imports, keyboard dismissal, map dimensions, and fallback without WebGL.
- `npm run test:matrix` traverses every primary-choice path with two fixed flashpoint policies in both modes. `REACHABILITY.json` records ending counts and witnesses. It prunes paths after a nuclear hard stop; it does not exhaust every random seed or every flashpoint combination.

## Implementation notes

`src/engine.ts` contains pure transitions. A choice applies its immediate meter changes, then its ripple queue resolves each effect exactly once. Seeded randomness is saved with the session. Delayed effects apply on the next scheduled beat. Nuclear escalation interrupts the turn immediately. Every remaining ending evaluates data-driven conditions in priority order after the last flashpoint.

Zustand stores a versioned browser save and a separate cross-game album. Storage failures are visible and JSON export remains available. Imports are size-limited and schema-checked. Replay restores meters, flags, pending effects and random state from the chosen turn; teacher/council sessions disable rewind. Notes save with the session. Skipping ripple animation records consequences in the timeline without claiming unseen cards for the collection badge.

The visual system uses Georgia and Arial already present on the device, paper and ink, muted red, and map greens. No web fonts, gradients, generated artwork or remote scripts. Map information has an equivalent list, dialog focus is native, keyboard controls use semantic buttons, reduced motion is respected, and larger sans-serif text is available in Settings.

## Deliberate adaptations and limits

See [EDITORIAL.md](EDITORIAL.md) for changes from the supplied scripts. This is a decision laboratory with state carried across historical eras, not a general alternate-history world simulator. Major changed assumptions receive variants, while the remaining scenarios revisit their historical setting. Cabinet members and newspaper copy are explicitly reconstructed, not quotations from real people.

The supplied scripts do **not** allow eight distinct endings for every country. US, USSR and China clear that target in the tested matrix; UK, West Germany, Cuba and India have fewer because their flags and meters do not reach all superpower-specific conditions. The report preserves those limits instead of inventing unrelated wars in those countries. All twenty endings have a witness somewhere in the full matrix after the documented Quiet Dividend branch fix.

WWII and side-by-side comparison are the specification's later phases and are not presented as playable features.
