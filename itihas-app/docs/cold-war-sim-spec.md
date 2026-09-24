# BUTTERFLY — Interactive History Sim (Claude Code Handoff Spec)

**Working title:** *Butterfly: Cold War* (Scenario 1) · *Butterfly: 1939* (Scenario 2, phase 2)
**Audience:** US middle/high-school & early college students. Reading level ~grade 8. Session length 15–25 min per playthrough.
**One-line pitch:** Play as a nation. Make the call. Watch the ripple hit six places on the map you'd never have guessed. Then learn what really happened.

---

## 0. HOW TO USE THIS DOCUMENT (for Claude Code)

1. Section 1–3 = product + engine spec. Build this first, content-agnostic.
2. Section 4 = complete **USA** script (8 turns × 3 choices × 6 effects). Use as the golden template.
3. Section 5 = complete **USSR** script. Section 6 = compact scripts for **China, UK, West Germany, Cuba, India** (situation, 3 choices, meter deltas, 5 effects each, written tersely — expand tone to match USA when loading into JSON, do NOT change facts).
4. Section 7 = 20 endings + trigger rules. Section 8 = debrief/learning layer. Section 9 = WW2 scenario outline (do not build until Cold War ships).
5. **Historical accuracy rules:** Historical (Choice A) branches must match the record. Counterfactual branches (B/C) must be *plausible inference*, labeled in the debrief as "what historians think could have happened," never presented as fact. Never invent quotes from real people. Every effect includes a one-line `insight` explaining the cause→effect mechanism — this is the educational payload.

---

## 1. PRODUCT BRIEF

### Learning goals
- Cause and effect across geography ("butterfly effects") rather than memorizing dates.
- Multiple perspectives: the same event looks different from Washington, Moscow, Beijing, Havana, Delhi.
- Contingency: history wasn't inevitable; individual decisions mattered.
- Media/source literacy via the debrief ("what actually happened, and how do we know").

### Core loop
1. Pick scenario → pick country → (optional) pick difficulty (Student / Historian).
2. Turn N: read **Situation** (≤120 words), see your 4 meters, pick 1 of 3 choices.
3. Map zooms/pans through 5–6 **Ripple Effects**, each a pin with consequence + insight. Player taps each pin (or "skip"). Meters animate.
4. Repeat for 8 turns. Global state + flags accumulate.
5. **Ending** resolves (1 of 20). Ending card → **Debrief** ("What really happened" / "Where you diverged" / "3 questions to discuss").
6. Replay prompt: "You diverged at Turn 4. Replay from there?"

### Key features
- **Map-first UI:** the map is the main stage, the text panel slides over it.
- **Butterfly timeline:** persistent sidebar listing every ripple triggered this game, filterable by region.
- **Divergence meter:** % of your path that matches real history.
- **Teacher mode:** disable replay, export a class summary (CSV of choices), print the debrief.
- **Compare mode (v1.1):** two students' timelines side-by-side.

---

## 2. TECH SPEC

- **Stack:** React 18 + TypeScript + Vite. State: Zustand. Map: MapLibre GL JS with free vector tiles (OpenFreeMap or Protomaps PMTiles bundled offline for schools). Fallback: Leaflet + OSM raster.
- **Content is data:** all narrative lives in `/content/cold-war/{country}.json` and `/content/cold-war/endings.json`. Engine never hardcodes text.
- **Persistence:** localStorage for saves; optional export/import JSON. No accounts in v1.
- **Accessibility:** all map pins have list equivalents; keyboard navigable; dyslexia-friendly font toggle; text-to-speech via Web Speech API.
- **Performance:** whole Cold War scenario < 2 MB JSON. Lazy-load per country.
- **No external calls at runtime** except map tiles (and none if PMTiles bundled).

### 2.1 Data schema (TypeScript)

```ts
type Meter = "TENSION" | "STABILITY" | "ECON" | "INFLUENCE";
// TENSION is GLOBAL (shared across all countries, 0–100, start 40; 100 = nuclear war).
// STABILITY / ECON / INFLUENCE are the player's country (0–100, start 50).

interface Effect {
  id: string;
  place: string;            // "Berlin, Germany"
  lat: number; lng: number;
  text: string;             // ≤ 30 words. Consequence.
  insight: string;          // ≤ 30 words. WHY this follows. The teaching line.
  delay?: 0 | 1 | 2;        // turns until it "lands" (0 = immediate). Default 0.
  flag?: string;            // sets a global flag, e.g. "CHINA_WAR"
  meterDelta?: Partial<Record<Meter, number>>;
}

interface Choice {
  id: string;               // "USA_T1_A"
  label: string;            // ≤ 8 words
  summary: string;          // ≤ 40 words
  historical: boolean;      // exactly one per node is true
  requires?: string[];      // flags that must be set to show this choice
  meterDelta: Partial<Record<Meter, number>>;
  flags?: string[];
  effects: Effect[];        // 5–6
}

interface Node {
  id: string;               // "USA_T1"
  turn: 1|2|3|4|5|6|7|8;
  year: string;             // "1947–48"
  title: string;
  situation: string;        // ≤ 120 words, 2nd person
  choices: Choice[];        // exactly 3
  variants?: { requires: string[]; situation: string }[]; // optional alt text if a flag is set
}

interface Country {
  id: "USA"|"USSR"|"CHN"|"UK"|"FRG"|"CUB"|"IND";
  name: string; capital: string; lat: number; lng: number;
  intro: string;            // ≤ 80 words
  startMeters: Record<Meter, number>;
  nodes: Node[];            // 8
}

interface Ending {
  id: string; title: string; tagline: string;
  priority: number;         // resolver checks highest priority first
  conditions: Condition[];  // ALL must hold
  card: string;             // ≤ 150 words, 2nd person
  reality: string;          // ≤ 150 words "what actually happened"
  discuss: string[];        // 3 questions
}
type Condition =
  | { flag: string; set: boolean }
  | { meter: Meter; op: ">="|"<="; value: number }
  | { choice: string }                 // choice id was taken
  | { country: Country["id"] }
  | { historicalPct: ">="|"<="; value: number };
```

### 2.2 Ending resolver
After Turn 8: evaluate `endings.json` sorted by `priority` desc; first ending whose conditions all hold wins. `E20_FROZEN_PEACE` has no conditions (fallback). Mid-game hard stops: if `TENSION >= 100` at any point → jump immediately to `E01_NUCLEAR_WINTER`.

### 2.3 Meter feel
- Show meters as four bars with tiny icons. Deltas float up as "+8 Influence" chips.
- TENSION bar changes color: <50 blue, 50–79 amber, 80–94 red, ≥95 pulsing red + "DEFCON 1" label.
- Every choice's meterDelta is applied instantly; effect-level deltas apply as pins are revealed (cinematic).

### 2.4 Map choreography per turn
1. Camera at player capital. Situation panel slides in.
2. Player picks. Panel collapses.
3. For each effect (sorted by distance from capital, farthest last): fly-to (600ms), drop pin, open popup with `text`; second tap reveals `insight` (💡). Auto-advance after 6s on Student difficulty.
4. Pins persist for the whole game, fading to 40% opacity next turn. Clicking an old pin shows which turn/choice caused it.

---

## 3. SHARED TURN STRUCTURE (all countries use the same 8 eras)

| Turn | Years | Global hinge |
|---|---|---|
| 1 | 1947–48 | Marshall Plan, Berlin Blockade, Partition of India |
| 2 | 1949–53 | China goes Red, Korea, NATO, Stalin dies |
| 3 | 1956 | Suez Crisis, Hungarian Uprising |
| 4 | 1961–62 | Berlin Wall, Cuban Missile Crisis, Sino-Indian War |
| 5 | 1965–68 | Vietnam escalation, Cultural Revolution, Prague Spring |
| 6 | 1971–75 | Nixon in China, détente, Bangladesh, oil shock |
| 7 | 1979–83 | Afghanistan, Iran, Euromissiles, Solidarity, Able Archer |
| 8 | 1985–91 | Gorbachev, Wall falls, USSR dissolves |

Flags used across countries (global): `MARSHALL`, `BERLIN_WAR`, `CHINA_WAR`, `NUKE_USED`, `HUNGARY_FREE`, `SUEZ_WEST_WINS`, `CUBA_INVADED`, `CUBA_MISSILES_STAY`, `VIETNAM_NEUTRAL`, `VIETNAM_TOTAL`, `PRAGUE_FREE`, `NO_DETENTE`, `SINO_SOVIET_HEAL`, `US_CHINA_AXIS`, `AFGHAN_SKIPPED`, `POLAND_INVADED`, `GORBY_REFORM`, `GORBY_HARDLINE`, `USSR_CHINESE_PATH`, `WALL_STANDS`, `EARLY_REUNIFICATION`, `NAM_STRONG`, `SPACE_JOINT`, `US_ISOLATION`, `WEST_ECON_COLLAPSE`, `KOREA_SECOND_WAR`.

---

## 4. UNITED STATES — FULL SCRIPT

**Intro (80 words):** It's 1947. You won the war, you have the bomb, and half the world is broke or in ruins. Your generals want to keep the army; your voters want it home. Stalin's armies sit in Berlin, Warsaw, Bucharest. Britain just told you it can't afford Greece anymore. Every choice you make will echo in places you can't see. Your job: keep America safe and prosperous — and, if you can, keep the world from burning.

Start meters: TENSION 40 (global) · STABILITY 65 · ECON 70 · INFLUENCE 60

---

### USA_T1 · 1947–48 · "Europe in Ruins"
**Situation:** Western Europe is starving and its communist parties are polling 25–30%. Britain is withdrawing from Greece and Turkey. Stalin has locked Poland and Romania down. Secretary Marshall proposes a $13 billion reconstruction plan; Congress balks at the cost. Meanwhile Germany's western zones need a new currency — which Moscow says violates the occupation deal.

**A. Marshall Plan + Truman Doctrine** *(historical)* — Fund Europe's recovery, arm Greece and Turkey, and pledge to "support free peoples."
Δ TENSION +8 · ECON −6 · INFLUENCE +15 · flag `MARSHALL`
- Paris, France (48.86, 2.35) — French Communists, expelled from cabinet, lose their shot at power as dollars flow into factories. *Insight:* Full stomachs beat manifestos; the Marshall Plan was designed as anti-communism by prosperity.
- Prague, Czechoslovakia (50.08, 14.44) — Stalin forbids Czech participation; in Feb 1948 communists seize full control. *Insight:* Aid forced neutrals to pick a side — and Stalin picked for them.
- Athens, Greece (37.98, 23.73) — US arms and advisors tip the civil war to the royalists by 1949. *Insight:* Containment's first "win" was a proxy war, not a diplomatic one.
- Berlin, Germany (52.52, 13.40) — Western currency reform in June 1948 triggers the Soviet blockade; the airlift begins. *Insight:* Economic decisions become military crises when a city is split in two.
- Tokyo, Japan (35.68, 139.69) — Occupation policy shifts from punishing Japan to rebuilding it as an Asian anchor. *Insight:* The "reverse course" happened because Europe showed reconstruction beat reparations.
- Buenos Aires, Argentina (−34.60, −58.38) — Perón, denied similar aid, plays East against West and buys Soviet grain deals. *Insight:* Money spent in Europe was money not spent in Latin America — a resentment that lasts decades.

**B. Aid, But No Commitments** — Send food and loans, but refuse military guarantees. Bring the troops home.
Δ TENSION −3 · STABILITY +5 · ECON +2 · INFLUENCE −12 · flag `US_ISOLATION`
- Athens, Greece (37.98, 23.73) — Without arms, the communist ELAS wins by 1949; Greece leaves the Western orbit. *Insight:* Loans don't stop insurgencies; rifles do (for better or worse).
- Rome, Italy (41.90, 12.50) — The Popular Front wins the April 1948 election that the CIA historically helped defeat. *Insight:* Italy's 1948 vote was the first covertly influenced election of the Cold War.
- Ankara, Turkey (39.93, 32.87) — Turkey, alone, negotiates joint control of the Straits with Moscow. *Insight:* The Truman Doctrine was written to stop exactly this.
- London, UK (51.51, −0.13) — Sterling crisis deepens; Britain accelerates imperial withdrawal from Asia and Africa. *Insight:* British decline was cushioned by US backing; remove it and decolonization speeds up.
- Washington, DC (38.90, −77.04) — Isolationist Republicans surge in the 1948 midterms; defense budget slashed. *Insight:* Foreign policy shapes domestic politics as much as the reverse.
- Berlin, Germany (52.52, 13.40) — With no airlift promised, Western commanders quietly evacuate; Berlin unifies under Soviet control by 1949. *Insight:* Deterrence is a promise, and promises only work if you're known to keep them.

**C. Rollback: Aid Plus Covert Offensive** — Fund Europe *and* arm anti-Soviet partisans in Ukraine, Poland and the Baltics.
Δ TENSION +22 · ECON −8 · INFLUENCE +5
- Lviv, Ukraine (49.84, 24.03) — Insurgents fight harder for 3 more years; Soviet deportations rise from ~150k to ~400k. *Insight:* Covert support often prolongs suffering without changing the outcome — historically, the real UPA aid did exactly this.
- Moscow, USSR (55.76, 37.62) — Stalin, convinced invasion is coming, orders the bomb program to double its budget. *Insight:* Aggression signals confirm the enemy's worst fears and accelerate their arms race.
- Berlin, Germany (52.52, 13.40) — Blockade starts 4 months earlier and Soviet fighters harass airlift planes. *Insight:* Pressure in one theater is answered where you're weakest.
- Paris, France (48.86, 2.35) — European intellectuals recoil; "neutralism" becomes a real political movement. *Insight:* Allies fear being the battlefield more than they fear the enemy.
- New York, USA (40.75, −73.97) — Soviet delegation walks out of the UN for a year; the Security Council freezes. *Insight:* The UN only works when the great powers stay in the room.
- Prague, Czechoslovakia (50.08, 14.44) — Communist coup comes in late 1947, bloodier, with purges of the army. *Insight:* When Moscow feels threatened, satellite crackdowns come faster and harder.

---

### USA_T2 · 1950 · "The Yalu"
**Situation:** North Korea invaded in June. MacArthur's Inchon landing shattered the invasion; UN forces have crossed the 38th parallel and are racing toward the Chinese border. Beijing has warned, through India, that it will intervene. MacArthur says they're bluffing and wants to bomb Manchuria if they come. The Soviets tested a bomb last year. Your call.

**A. Limited War — Hold the Line** *(historical)* — Fight in Korea only. When China intervenes, fall back, stabilize near the 38th, fire MacArthur when he defies you.
Δ TENSION +6 · STABILITY −6 · ECON −5 · INFLUENCE +4
- Panmunjom, Korea (37.96, 126.68) — Two years of trench warfare; armistice 1953, border almost where it started. *Insight:* Limited wars end in stalemates by design — the goal was containment, not victory.
- Beijing, China (39.90, 116.40) — Mao's regime, having "stood up" to America, consolidates power and ties itself to Moscow for a decade. *Insight:* Korea cemented the Sino-Soviet alliance — and the US-China estrangement — for 20 years.
- Taipei, Taiwan (25.03, 121.57) — The 7th Fleet enters the strait; Taiwan becomes a permanent US commitment. *Insight:* Korea accidentally decided the Chinese civil war's final border.
- Bonn, West Germany (50.74, 7.10) — Fear of a "European Korea" wins US support for German rearmament and a bigger NATO. *Insight:* A war in Asia militarized Europe.
- Washington, DC (38.90, −77.04) — Defense spending triples (NSC-68 funded); the "military-industrial complex" is born. *Insight:* Korea, not WWII, created the permanent US war economy.
- Hanoi, Vietnam (21.03, 105.85) — Washington starts paying for France's war against Ho Chi Minh — 80% of it by 1954. *Insight:* Seeing Korea as "Asian communism on the march" pulled the US into Indochina.

**B. Unleash MacArthur** — Bomb Manchurian bases, blockade China, accept Chiang Kai-shek's troops.
Δ TENSION +30 · STABILITY −10 · ECON −12 · INFLUENCE −10 · flag `CHINA_WAR`
- Shenyang, China (41.80, 123.43) — B-29 raids kill tens of thousands; Chinese "volunteers" become the full PLA and pour south. *Insight:* Bombing rarely breaks a nation's will; it usually unites it.
- Vladivostok, USSR (43.12, 131.89) — Soviet air divisions openly enter the war; the first US–Soviet dogfights over the Sea of Japan. *Insight:* Escalation has a partner; Stalin couldn't let China lose without losing face.
- London, UK (51.51, −0.13) — Attlee flies to Washington; Britain threatens to pull out of the UN command. *Insight:* Allies who joined a limited war will not follow you into a general one.
- Hiroshima, Japan (34.39, 132.46) — Japanese anti-war protests erupt at the prospect of a second nuclear war in Asia. *Insight:* The only country ever nuked is the one most sensitive to threats of using it again.
- Washington, DC (38.90, −77.04) — Truman faces impeachment talk from both directions — too soft for hawks, reckless for doves. *Insight:* Total war in a divided democracy is politically unsustainable.
- Taipei, Taiwan (25.03, 121.57) — Chiang lands 30,000 troops in Guangdong; they're annihilated within weeks. *Insight:* Chiang's army lost China in 1949 for a reason; a bad ally is not a force multiplier.

**C. Stay Out — Let the UN Handle It** — Provide air/naval support only; no US ground troops; accept a North Korean win if it comes.
Δ TENSION −4 · STABILITY +3 · ECON +5 · INFLUENCE −18
- Busan, South Korea (35.18, 129.08) — The South falls by autumn 1950; a unified communist Korea borders Japan across a narrow strait. *Insight:* Without US ground forces, the ROK army of 1950 could not hold.
- Tokyo, Japan (35.68, 139.69) — Japan demands its own army and hints at nuclear options; the pacifist constitution comes under strain. *Insight:* Allies who lose faith in your protection start arming themselves.
- Taipei, Taiwan (25.03, 121.57) — Mao invades Taiwan in 1951 with no 7th Fleet in the way. *Insight:* Taiwan's survival depended on a decision made about Korea.
- Manila, Philippines (14.60, 120.98) — The Huk rebellion gains recruits as US credibility in Asia collapses. *Insight:* Insurgencies grow when the counter-insurgent's backer looks unreliable.
- Bonn, West Germany (50.74, 7.10) — Europeans conclude NATO is a paper guarantee; France pursues an independent bomb 5 years early. *Insight:* Credibility is fungible: what you do in Korea is read in Berlin.
- Washington, DC (38.90, −77.04) — "Who lost Korea?" replaces "Who lost China?"; McCarthyism intensifies. *Insight:* Retreat abroad fuels paranoia at home.

---

### USA_T3 · 1956 · "Two Crises in One Week"
**Situation:** October–November 1956. Britain, France and Israel have secretly invaded Egypt to retake the Suez Canal after Nasser nationalized it. The same week, Hungarians have overthrown their Stalinist government and Imre Nagy declares neutrality; Soviet tanks are massing. Radio Free Europe has been telling Hungarians the West would help. Eisenhower is up for re-election in days.

**A. Condemn the Allies, Don't Touch Hungary** *(historical)* — Force Britain/France out of Suez via the UN and a run on the pound. Offer Hungary only words.
Δ TENSION +4 · STABILITY +2 · ECON 0 · INFLUENCE +10
- Budapest, Hungary (47.50, 19.04) — Soviet tanks crush the uprising; ~2,500 die, 200,000 flee. *Insight:* Spheres of influence were real: the US would not risk war inside Moscow's zone.
- London, UK (51.51, −0.13) — Eden resigns; Britain never again acts militarily without US approval. *Insight:* Suez was the moment the British Empire discovered it was a client.
- Cairo, Egypt (30.04, 31.24) — Nasser, saved by the US but grateful to the USSR, becomes the hero of the Arab world and buys Soviet arms. *Insight:* You can win an argument and lose the audience.
- Paris, France (48.86, 2.35) — France concludes the US is unreliable and doubles down on its own bomb and on the European project. *Insight:* Suez is a root cause of both the *force de frappe* and the EEC.
- Tel Aviv, Israel (32.08, 34.78) — Israel withdraws from Sinai under US pressure but gains a UN buffer force — and a lesson about pre-emptive strikes. *Insight:* 1956 was the rehearsal for 1967.
- Munich, West Germany (48.14, 11.58) — Radio Free Europe is investigated for encouraging Hungarians to expect help. *Insight:* Propaganda that promises what policy won't deliver gets people killed.

**B. Back Britain and France at Suez** — Veto the UN resolution, prop up the pound, let the allies keep the canal.
Δ TENSION +12 · ECON −3 · INFLUENCE −14
- Cairo, Egypt (30.04, 31.24) — Nasser falls; a military junta friendly to the West takes over — and is hated by its own people. *Insight:* Installed governments have short shelf lives.
- Baghdad, Iraq (33.31, 44.37) — Arab nationalist officers, enraged, overthrow the pro-Western monarchy in 1957 instead of 1958. *Insight:* Backing colonial powers turns Arab nationalism against you.
- Budapest, Hungary (47.50, 19.04) — Moscow points at Suez and crushes Hungary with zero diplomatic cost. *Insight:* You can't condemn one invasion while cheering another.
- New Delhi, India (28.61, 77.21) — Nehru's Non-Aligned Movement swells; India tilts toward Moscow for a generation. *Insight:* The Global South watched Suez to see if the US was different from the old empires.
- Riyadh, Saudi Arabia (24.71, 46.68) — Saudi Arabia threatens an oil embargo — the first use of oil as a weapon. *Insight:* 1973 could have happened in 1956.
- Washington, DC (38.90, −77.04) — Eisenhower's "peace" image cracks; the election tightens sharply. *Insight:* Voters punished colonial adventures even in the 1950s.

**C. Aid the Hungarian Rebels** — Airdrop weapons and covert teams via Austria; put NATO on alert.
Δ TENSION +28 · STABILITY −5 · ECON −4 · INFLUENCE +3 · flag `HUNGARY_FREE` (only if TENSION < 90 after this turn; else Hungary is crushed anyway)
- Vienna, Austria (48.21, 16.37) — Neutral Austria is violated; Soviet troops re-enter its eastern zone "to secure the border." *Insight:* Neutral states become battlegrounds when great powers use them as corridors.
- Budapest, Hungary (47.50, 19.04) — Street fighting drags on for months; Hungary becomes Europe's first Cold War guerrilla war. *Insight:* Weapons without an army produce a long insurgency, not liberation.
- Warsaw, Poland (52.23, 21.01) — Poland's reformist Gomułka is removed by Moscow as a precaution. *Insight:* Fear of contagion makes empires crush moderates alongside radicals.
- Bonn, West Germany (50.74, 7.10) — Adenauer calls up reservists; Germans dig bomb shelters. *Insight:* Europe, not America, would have been the battlefield.
- Cairo, Egypt (30.04, 31.24) — With US attention on Hungary, Britain and France keep the canal for now. *Insight:* Crises compete for bandwidth; one adventure enables another.
- Moscow, USSR (55.76, 37.62) — Khrushchev's rivals use the chaos to attempt his ouster; he survives, hardened. *Insight:* Pressure from outside strengthens hardliners inside.

---

### USA_T4 · 1962 · "Thirteen Days"
**Situation:** U-2 photos show Soviet nuclear missiles being installed in Cuba, 90 miles from Florida. Last year the Bay of Pigs invasion failed and the Berlin Wall went up. The Joint Chiefs want airstrikes followed by invasion. Kennedy's advisors are split. Khrushchev's motives are unclear: protect Cuba? Trade for Berlin? Match your missiles in Turkey?

**A. Naval Quarantine + Secret Deal** *(historical)* — Blockade Cuba, demand removal, secretly promise to pull US missiles from Turkey.
Δ TENSION +15 then −25 (net −10 after resolution) · INFLUENCE +12
- Havana, Cuba (23.11, −82.37) — Castro, cut out of the deal, is furious at Moscow — and never leaves its orbit. *Insight:* Small allies learn they are bargaining chips.
- Moscow, USSR (55.76, 37.62) — Khrushchev's "retreat" is used against him; he's ousted in 1964 and the USSR begins a massive missile buildup. *Insight:* The crisis the US "won" triggered the arms race of the 1970s.
- Izmir, Turkey (38.42, 27.14) — Jupiter missiles quietly removed in 1963; Turkey feels traded. *Insight:* Secret diplomacy works — and leaves allies wondering what else was secret.
- Washington–Moscow (45.00, −20.00, mid-Atlantic) — The Hotline is installed; the Limited Test Ban Treaty follows in 1963. *Insight:* Nearly dying is the best argument for talking.
- Beijing, China (39.90, 116.40) — Mao denounces Soviet "capitulationism"; the Sino-Soviet split goes public. *Insight:* Compromise with an enemy can cost you an ally.
- Miami, USA (25.76, −80.19) — Cuban exiles feel betrayed by the no-invasion pledge; a permanent, powerful anti-Castro lobby forms. *Insight:* Foreign-policy deals create domestic constituencies that outlive them.

**B. Airstrikes and Invasion** — Destroy the sites, then land Marines.
Δ TENSION +45 · STABILITY −12 · INFLUENCE −8 · flag `CUBA_INVADED` · **Effect 6 sets `NUKE_USED` with 50% probability on Historian difficulty, 25% on Student**
- Cuba, Sagua la Grande (22.81, −80.08) — Soviet commanders, who actually had tactical nukes and authority to use them, hit the invasion beaches. *Insight:* In 2002 conferences revealed ~100 tactical warheads were already on the island — the Chiefs didn't know.
- Berlin, Germany (52.52, 13.40) — Soviet forces seize West Berlin within 48 hours as retaliation. *Insight:* Khrushchev's own plan for a Cuban attack was to move on Berlin.
- Ankara, Turkey (39.93, 32.87) — Soviet missiles hit the Jupiter sites in Turkey; NATO's Article 5 is invoked. *Insight:* Alliance treaties turn a regional strike into a world war automatically.
- London, UK (51.51, −0.13) — Britain's Macmillan refuses to join and demands a ceasefire; the "special relationship" fractures. *Insight:* Allies not consulted before a strike don't feel bound by it.
- New York, USA (40.75, −73.97) — 2 million flee the city; the stock market closes. *Insight:* Fear has economic weight before a single shot lands.
- Moscow, USSR (55.76, 37.62) — Khrushchev, or hardliners around him, choose between humiliating retreat and a limited nuclear strike. *(random: NUKE_USED)* *Insight:* Once tactical weapons are used, no one has ever demonstrated a way to stop the ladder.

**C. Accept the Missiles, Negotiate Publicly** — Announce a mutual withdrawal: Turkey's Jupiters for Cuba's missiles, out loud.
Δ TENSION −8 · STABILITY −15 · INFLUENCE −15 · flag `CUBA_MISSILES_STAY` (if Moscow refuses — 40% chance)
- Ankara, Turkey (39.93, 32.87) — Turkey, publicly traded away, threatens to leave NATO and courts Moscow. *Insight:* The historical deal was secret precisely to avoid this.
- Bonn, West Germany (50.74, 7.10) — Adenauer concludes the US will trade allies for peace; West Germany explores nuclear sharing with France. *Insight:* Public concessions read as weakness even when the substance is identical.
- Washington, DC (38.90, −77.04) — Republicans hammer Kennedy as an appeaser; Democrats lose the 1962 midterms badly. *Insight:* Domestic politics punish visible compromise more than hidden compromise.
- Moscow, USSR (55.76, 37.62) — Khrushchev, strengthened, presses Berlin again in 1963. *Insight:* Rewarded gambles get repeated.
- Havana, Cuba (23.11, −82.37) — If the missiles stay, Cuba becomes a permanent Soviet nuclear base; Latin American leftists take heart. *Insight:* Deterrence works in both directions.
- Vientiane, Laos (17.98, 102.63) — Kennedy, needing to look tough, escalates in Laos and Vietnam instead. *Insight:* Toughness deferred is toughness displaced.

---

### USA_T5 · 1965 · "Rolling Thunder"
**Situation:** South Vietnam's government is collapsing. The Viet Cong control much of the countryside; Hanoi is sending regular troops down the Ho Chi Minh Trail. You have 23,000 advisors there. Johnson's advisors say without US ground troops Saigon falls within a year; the "domino theory" says Thailand and Indonesia go next. At home, the Great Society needs money and political capital.

**A. Escalate — Send Ground Troops** *(historical)* — Bomb the North, deploy 184,000 troops this year, 500,000 by 1968.
Δ TENSION +8 · STABILITY −20 · ECON −10 · INFLUENCE −6
- Hanoi, Vietnam (21.03, 105.85) — Bombing hardens rather than breaks the North; Soviet and Chinese aid triples. *Insight:* Bombing an agrarian society has little to destroy and much to enrage.
- Jakarta, Indonesia (−6.21, 106.85) — Indonesia's 1965 anti-communist purge (500,000+ killed) proceeds with US encouragement; the "domino" falls the other way. *Insight:* The domino theory's biggest test happened in Indonesia, not Vietnam.
- Chicago, USA (41.88, −87.63) — By 1968 the antiwar movement splits the Democratic Party; Nixon wins. *Insight:* Wars without clear goals lose the home front first.
- Ottawa, Canada (45.42, −75.70) — 30,000+ draft resisters cross north; Canada's identity as "not-America" hardens. *Insight:* A neighbor's war reshapes your politics too.
- Paris, France (48.86, 2.35) — De Gaulle, who warned against exactly this, pulls France out of NATO's military command in 1966. *Insight:* Allies distance themselves from wars they predicted would fail.
- Beijing, China (39.90, 116.40) — 320,000 Chinese support troops deploy to North Vietnam; Mao's fear of US invasion feeds the Cultural Revolution's paranoia. *Insight:* Wars on a neighbor's border shape its internal politics.

**B. Negotiate a Neutral Vietnam** — Accept a coalition government in Saigon and phased withdrawal; spend the money at home.
Δ TENSION −6 · STABILITY +10 · ECON +8 · INFLUENCE −10 · flag `VIETNAM_NEUTRAL`
- Saigon, Vietnam (10.82, 106.63) — Coalition government lasts two years, then Hanoi takes over politically by 1968 — without 58,000 American dead. *Insight:* The outcome may have been the same; the cost was not.
- Bangkok, Thailand (13.76, 100.50) — Thailand does not fall; it accelerates its US alliance and economic growth. *Insight:* Dominoes are not physics; each country had its own politics.
- Washington, DC (38.90, −77.04) — Great Society fully funded; Medicare and the War on Poverty expand. Johnson is attacked as "the man who lost Vietnam." *Insight:* Domestic spending and war spending compete directly.
- Moscow, USSR (55.76, 37.62) — Brezhnev reads US retreat as an opening and expands aid to Africa and the Middle East. *Insight:* Restraint in one place is tested in another.
- Phnom Penh, Cambodia (11.56, 104.92) — Without US bombing of Cambodia (1969–73), the Khmer Rouge remains a fringe movement. *Insight:* The Cambodian genocide had a Vietnam War prologue.
- Berkeley, USA (37.87, −122.27) — No mass antiwar movement; the 1960s counterculture is smaller and less political. *Insight:* Vietnam was the engine of a generation's politics.

**C. Total War — Invade the North** — Amphibious landing near Haiphong, mine the harbors, ignore the Chinese border.
Δ TENSION +35 · STABILITY −25 · ECON −18 · INFLUENCE −15 · flag `VIETNAM_TOTAL`
- Haiphong, Vietnam (20.86, 106.68) — Mined harbor sinks Soviet freighters; Moscow's navy escorts convoys with orders to shoot. *Insight:* You can't blockade a port without touching your enemy's patron.
- Kunming, China (25.04, 102.72) — Chinese divisions cross into North Vietnam; Korea repeats. *Insight:* Mao stated plainly he would intervene if the US invaded the North; he had troops pre-positioned.
- Seoul, South Korea (37.57, 126.98) — North Korea, sensing US overstretch, launches raids across the DMZ (in reality 1968 saw exactly this with the Blue House raid and USS Pueblo). *Insight:* Adversaries coordinate opportunism.
- Detroit, USA (42.33, −83.05) — Draft calls double; urban riots and antiwar protests merge into the worst domestic unrest since the Civil War. *Insight:* Total war needs total consent, which a divided democracy can't give.
- Bonn, West Germany (50.74, 7.10) — NATO allies refuse to send a single soldier and openly call for US withdrawal. *Insight:* Alliances are for defending each other, not for one member's wars of choice.
- Moscow, USSR (55.76, 37.62) — The Politburo authorizes a Berlin squeeze and considers a Cuban re-deployment. *Insight:* Escalation invites symmetrical pressure on your own weak points.

---

### USA_T6 · 1972 · "Ping-Pong"
**Situation:** Vietnam is ending badly. Moscow and Beijing nearly went to war on the Ussuri River in 1969. Kissinger has secretly visited China. The Soviets want arms-limitation talks (SALT) and grain. Your economy is strained; the dollar just left the gold standard. Nixon sees a chance to play the two communist giants against each other.

**A. Triangular Diplomacy — Open China, Sign SALT** *(historical)* — Go to Beijing, then Moscow. Détente.
Δ TENSION −15 · ECON +5 · INFLUENCE +14
- Beijing, China (39.90, 116.40) — Mao welcomes Nixon; Taiwan loses its UN seat; China begins its long turn toward markets. *Insight:* The visit gave Deng's later reforms a partner to trade with.
- Moscow, USSR (55.76, 37.62) — Fear of a US–China axis pushes Brezhnev to sign SALT I and the ABM Treaty within months. *Insight:* Leverage came from the third party, not the arms table.
- Islamabad, Pakistan (33.69, 73.04) — Pakistan, the secret go-between, is rewarded with US silence during its 1971 Bangladesh atrocities. *Insight:* Grand strategy has moral bills that get paid by small countries.
- New Delhi, India (28.61, 77.21) — Feeling encircled by a US–China–Pakistan triangle, India signs a treaty with Moscow and tests a nuke in 1974. *Insight:* Every alignment creates a counter-alignment.
- Hanoi, Vietnam (21.03, 105.85) — Isolated by both patrons, North Vietnam signs the Paris Accords in 1973 — then wins anyway in 1975. *Insight:* Great-power deals change timing more than outcomes.
- Wichita, USA (37.69, −97.34) — The "Great Grain Robbery": Soviet wheat purchases spike US food prices 20%. *Insight:* Détente was a trade deal too, and it showed up in your grocery bill.

**B. No Détente — Contain Both** — Refuse to reward "communist aggression"; keep the arms race running; no Beijing trip.
Δ TENSION +10 · ECON −8 · INFLUENCE −5 · flag `NO_DETENTE`
- Beijing, China (39.90, 116.40) — Isolated, Mao's radicals win the succession fight; Deng never returns; reform waits a decade. *Insight:* China's economic miracle needed an open door — on both sides.
- Moscow, USSR (55.76, 37.62) — No SALT; the Soviets deploy 500 more ICBMs by 1979. *Insight:* Arms control isn't charity; it caps your enemy too.
- Cairo, Egypt (30.04, 31.24) — Without a US channel, Sadat doesn't expel Soviet advisors; the 1973 war has Soviet pilots in it. *Insight:* Détente gave Egypt an off-ramp from Moscow.
- Washington, DC (38.90, −77.04) — Defense spending crowds out domestic programs; stagflation hits harder. *Insight:* Cold War budgets were a choice, not a law of nature.
- Bonn, West Germany (50.74, 7.10) — Brandt pursues *Ostpolitik* alone; the US–German rift widens. *Insight:* If you won't talk to Moscow, your allies will — without you.
- Hanoi, Vietnam (21.03, 105.85) — Fully backed by both patrons, the North launches its final offensive in 1973 instead of 1975. *Insight:* Isolating the enemy's supporters shortens wars; not doing so lengthens them.

**C. Lean to Moscow, Snub Beijing** — Sign SALT, grain deals, and a formal "condominium": the US and USSR jointly police the world. No China opening.
Δ TENSION −12 · ECON +3 · INFLUENCE +4 · flag `SINO_SOVIET_HEAL` (30% chance)
- Beijing, China (39.90, 116.40) — Feeling encircled, Mao either turns back to Moscow or goes it alone with a bigger bomb program. *Insight:* A superpower duopoly leaves everyone else looking for a third way.
- Tokyo, Japan (35.68, 139.69) — Japan opens China itself in 1972 and gets the trade the US turned down. *Insight:* Markets don't wait for ideology.
- Paris, France (48.86, 2.35) — Europeans fear a US–Soviet deal over their heads (the "Yalta II" nightmare). *Insight:* Two-power deals terrify everyone who isn't one of the two.
- Taipei, Taiwan (25.03, 121.57) — Taiwan keeps its UN seat and US recognition; it also keeps a secret nuclear program. *Insight:* Status quo for Taiwan meant status quo risks too.
- Tehran, Iran (35.69, 51.39) — The Shah, worried about a US–Soviet deal, arms up even faster — and drains his treasury. *Insight:* Client states over-insure when their patron looks unreliable.
- Moscow, USSR (55.76, 37.62) — Brezhnev, unpressured by China, is slower to sign SALT and gives less. *Insight:* Without a triangle, there is no leverage.

---

### USA_T7 · 1980 · "The Second Cold War"
**Situation:** The Soviets invaded Afghanistan on Christmas 1979. Iran holds 52 American hostages. Moscow's new SS-20 missiles can hit all of Western Europe. Détente is dead. Poland's Solidarity union has 10 million members and Soviet tanks are on the border. Your options: arm the Afghan resistance and deploy new NATO missiles; push for a nuclear freeze; or go on the offensive across Eastern Europe.

**A. Arm the Mujahideen, Deploy Pershing II** *(historical)* — Covert war in Afghanistan, new missiles in Germany, sanctions, "Evil Empire."
Δ TENSION +18 · ECON −6 · INFLUENCE +8
- Peshawar, Pakistan (34.01, 71.58) — $3 billion in CIA aid flows through Pakistan's ISI to Islamist factions; a generation of jihadists is trained. *Insight:* Weapons and networks outlive the wars they were built for — see 2001.
- Kabul, Afghanistan (34.53, 69.17) — The Soviet army bleeds for nine years; 15,000 Soviet dead, 1 million Afghans. *Insight:* Afghanistan drained Soviet legitimacy at home more than treasure.
- Bonn, West Germany (50.74, 7.10) — 400,000 march against Pershing missiles; the Green Party enters parliament. *Insight:* Deployments abroad create political movements you didn't plan for.
- Moscow, USSR (55.76, 37.62) — The Politburo genuinely fears a US first strike; Operation RYaN watches for it. *Insight:* Your signals of strength were received as signs of attack.
- Gdańsk, Poland (54.35, 18.65) — Solidarity is crushed by martial law in Dec 1981 — but Poland's own generals do it, not Soviet tanks, to avoid sanctions. *Insight:* Sanctions changed who did the crushing, not whether it happened.
- Riyadh, Saudi Arabia (24.71, 46.68) — Saudi money matches US money dollar-for-dollar in Afghanistan; Wahhabi networks spread. *Insight:* Coalition wars import your partners' ideologies.

**B. Nuclear Freeze & Restraint** — Cancel Pershing, propose a mutual freeze, quietly accept Afghanistan as a Soviet quagmire, don't arm the rebels.
Δ TENSION −10 · STABILITY +4 · ECON +4 · INFLUENCE −12
- Kabul, Afghanistan (34.53, 69.17) — The Soviets win within 3 years; the Afghan communist state survives into the 1990s. *Insight:* Without Stingers and CIA money, the Afghan resistance was too fragmented to win.
- Peshawar, Pakistan (34.01, 71.58) — No jihadist pipeline; Pakistan's ISI stays weaker; al-Qaeda has no birthplace. *Insight:* This is the branch historians debate most — what 9/11 would have looked like without Afghanistan.
- Bonn, West Germany (50.74, 7.10) — With SS-20s unanswered, West Germans feel exposed; Schmidt's government falls to the right, not the Greens. *Insight:* "No missiles" reads as abandonment to the people under the other side's missiles.
- Moscow, USSR (55.76, 37.62) — Hardliners argue the West is weak; Andropov's disciplinarian faction gains. *Insight:* Restraint can strengthen your enemy's hawks as easily as its doves.
- Managua, Nicaragua (12.13, −86.25) — No Contra war; the Sandinistas hold elections in 1984 with no US pressure. *Insight:* The "Reagan Doctrine" was a package; remove one piece and the others go.
- Washington, DC (38.90, −77.04) — Reagan is attacked as an appeaser by his own party; the freeze splits the GOP. *Insight:* A president's coalition constrains policy more than the enemy does.

**C. Rollback — Support Solidarity Openly, Covert Ops Across the Bloc** — Arm Polish resistance, sabotage Soviet pipelines, back East European dissidents with cash and radios.
Δ TENSION +30 · ECON −10 · INFLUENCE +2 · flag `POLAND_INVADED` (60% chance)
- Warsaw, Poland (52.23, 21.01) — Soviet divisions invade to "restore order" — Poland 1980 becomes Hungary 1956, at ten times the scale. *Insight:* Moscow tolerated Polish martial law because it was Polish; foreign arms would have forced its hand.
- Urengoy, USSR (66.08, 76.63) — The pipeline sabotage (historically a CIA software trojan, 1982) escalates to open economic warfare. *Insight:* Cyber-style sabotage predates the internet.
- Bonn, West Germany (50.74, 7.10) — West Germany, whose whole strategy is stability in the East, publicly breaks with Washington. *Insight:* Allies next to the fire don't want you fanning it.
- Rome, Italy (41.90, 12.50) — Pope John Paul II's quiet diplomacy is undercut by loud US arms; the Church loses its mediator role. *Insight:* Soft power works only when hard power isn't crowding it out.
- Moscow, USSR (55.76, 37.62) — The reformist generation (Gorbachev, Shevardnadze) is sidelined as traitors; a Brezhnevite hardliner succeeds Andropov. *Insight:* Reformers need a non-threatening environment to win internal arguments.
- Havana, Cuba (23.11, −82.37) — Moscow, feeling attacked, moves bombers back to Cuba. *Insight:* Pressure in Eastern Europe is answered in the Caribbean, as in 1962.

---

### USA_T8 · 1987 · "Tear Down This Wall"
**Situation:** Gorbachev is real — he's pulled out of Afghanistan, freed dissidents, and offered to eliminate all intermediate-range missiles. Hardliners in Washington say it's a trick. Eastern Europe is restless. The Soviet economy is visibly failing; Gorbachev has hinted he won't use force to hold the satellites. Do you deal, distrust, or bail him out?

**A. Engage — INF Treaty, Then Let the Bloc Go** *(historical)* — Sign INF, meet in Reykjavik and Moscow, don't gloat when the Wall falls.
Δ TENSION −30 · ECON +6 · INFLUENCE +15 · flag `GORBY_REFORM`
- Berlin, Germany (52.52, 13.40) — Nov 9, 1989: a botched press conference opens the Wall. Germany reunites in 1990 inside NATO. *Insight:* The Cold War ended by accident inside a framework built by design.
- Bucharest, Romania (44.43, 26.10) — Ceaușescu, the only leader to shoot, is executed on Christmas Day 1989. *Insight:* Once Moscow signals it won't intervene, satellites fall in months.
- Beijing, China (39.90, 116.40) — Watching Europe, China's leaders crush Tiananmen in June 1989 to avoid the same fate. *Insight:* The lesson Beijing learned from 1989 was the opposite of the one Moscow learned.
- Baku, Azerbaijan (40.41, 49.87) — Loosened control unleashes ethnic wars in the Caucasus; the USSR dissolves in Dec 1991. *Insight:* Empires rarely reform gracefully; the pieces have their own grievances.
- Washington, DC (38.90, −77.04) — "We won" triumphalism shapes 30 years of US policy — and 1990s NATO expansion Moscow never forgot. *Insight:* How you win matters as much as winning.
- Sarajevo, Bosnia (43.86, 18.41) — With the Soviet threat gone, Yugoslavia's glue dissolves; war by 1992. *Insight:* Some countries were held together by a common fear.

**B. Distrust — No Deals, Maximum Pressure** — Reject INF, keep SDI, push covert action, demand regime change.
Δ TENSION +12 · ECON −5 · INFLUENCE −6 · flag `GORBY_HARDLINE`
- Moscow, USSR (55.76, 37.62) — Gorbachev, humiliated abroad, is overthrown by the August 1991 coup plotters in 1989 instead — and this time they win. *Insight:* Reformers need visible wins from the outside to survive inside.
- Berlin, Germany (52.52, 13.40) — Honecker's East Germany, backed by a hardline Moscow, shoots protesters in Leipzig in October 1989; the Wall stands. *Insight:* The Wall fell because no one in Moscow was willing to order fire.
- Vilnius, Lithuania (54.69, 25.28) — Baltic independence movements are crushed with tanks (as briefly happened in Jan 1991). *Insight:* Hardline Soviet leaders had the means to hold on for years, at a price.
- Bonn, West Germany (50.74, 7.10) — Kohl breaks with Washington and negotiates directly with Moscow; the Western alliance frays. *Insight:* Allies who see a deal on the table will take it without you.
- Kabul, Afghanistan (34.53, 69.17) — Soviet withdrawal is reversed; the war grinds on into the 1990s. *Insight:* Wars end when leaders can afford to end them.
- Washington, DC (38.90, −77.04) — Defense spending stays at Cold War peak; the 1990s "peace dividend" never happens. *Insight:* The dividend paid for the internet boom's federal seed money.

**C. Bail Out Moscow — A Marshall Plan for the USSR** — Massive loans and food aid to stabilize Gorbachev; keep the USSR intact but democratizing.
Δ TENSION −20 · ECON −10 · INFLUENCE +6 · flag `GORBY_REFORM` + `USSR_SURVIVES`
- Moscow, USSR (55.76, 37.62) — Gorbachev survives; the USSR becomes a loose confederation by 1992 rather than 15 states. *Insight:* The historical "Grand Bargain" ($30B) was proposed in 1991 and rejected by Bush.
- Kyiv, Ukraine (50.45, 30.52) — Ukraine's independence referendum is postponed; nuclear weapons stay under central control. *Insight:* A surviving union changes the whole map of 2020s Europe.
- Berlin, Germany (52.52, 13.40) — Wall opens more slowly and by negotiation; reunification 1992, and Germany is neutral, not NATO. *Insight:* Germany in NATO was not inevitable; Gorbachev's price was cash he never got.
- Beijing, China (39.90, 116.40) — A reforming, US-funded USSR shows Chinese reformers an alternative path — Zhao Ziyang's faction is not purged. *Insight:* Demonstration effects run both ways.
- Detroit, USA (42.33, −83.05) — Aid to Moscow during a US recession is politically toxic; Bush loses 1992 in a landslide. *Insight:* Voters rarely reward foreign generosity.
- Tbilisi, Georgia (41.72, 44.79) — Ethnic conflicts frozen by a still-functioning center; fewer post-Soviet wars in the 1990s. *Insight:* Weak states, not strong ones, breed the most war.

---

## 5. SOVIET UNION — FULL SCRIPT

**Intro:** It's 1947. You lost 27 million people beating Hitler and you will never let Germany threaten you again. You have no bomb — yet. America has one, plus the world's only healthy economy. Your buffer states in Eastern Europe are unstable; your own people are exhausted and starving. Stalin's Politburo watches every choice. Secure the motherland, spread the revolution if you can — and don't get nuked.

Start meters: TENSION 40 · STABILITY 45 · ECON 35 · INFLUENCE 55

### USSR_T1 · 1948 · "The Berlin Question"
**Situation:** The Western Allies just introduced a new currency in their German zones — a step toward a separate West German state, which you view as a violation of Potsdam. West Berlin sits 100 miles inside your zone, entirely dependent on rail and road access you control. Your bomb is 18 months away. Marshall money is flooding Western Europe.

**A. Blockade Berlin** *(historical)* — Cut all land access. Force the West to choose between abandoning the city and starting a war.
Δ TENSION +12 · STABILITY +3 · INFLUENCE −8
- Berlin (52.52, 13.40) — 277,000 airlift flights supply the city; after 11 months you lift the blockade, humiliated. *Insight:* You tested Western will and gave them a moral victory they could film.
- Washington, DC (38.90, −77.04) — NATO is signed in April 1949 — the blockade convinced Congress. *Insight:* Pressure created the alliance it was meant to prevent.
- Bonn (50.74, 7.10) — West Germany founded May 1949; you answer with East Germany in October. *Insight:* Germany's division was mutual, but you moved second.
- Belgrade, Yugoslavia (44.79, 20.45) — Tito, watching you bully Berlin, breaks with Moscow and survives with Western aid. *Insight:* Coercion of allies creates defectors.
- Semipalatinsk, Kazakhstan (50.41, 80.23) — Political urgency accelerates the bomb: first test August 1949. *Insight:* Nuclear timelines respond to fear.
- Warsaw (52.23, 21.01) — Poland's Gomułka is purged for "nationalist deviation" as you tighten the bloc. *Insight:* External confrontation triggers internal purges.

**B. Accept Marshall Aid for Eastern Europe** — Let Czechoslovakia and Poland join; take the dollars; don't blockade.
Δ TENSION −12 · STABILITY −8 · ECON +14 · INFLUENCE −15
- Prague (50.08, 14.44) — Czechoslovakia stays a mixed democracy into the 1950s; the 1948 coup never happens. *Insight:* Economic openness and one-party control cannot coexist for long.
- Moscow (55.76, 37.62) — Stalin's rivals whisper that he's "sold the revolution"; Beria and Zhdanov's factions fight openly. *Insight:* Retreat is a domestic risk for dictators too.
- Washington (38.90, −77.04) — Congress attaches strings: open books, free elections. You refuse the second. *Insight:* Aid was a tool of leverage, never a gift.
- Beijing (39.90, 116.40) — Mao, seeing a "soft" Moscow, keeps his distance and courts Washington in 1949. *Insight:* Mao's 1949 "lean to one side" was a choice, not a given.
- Bonn (50.74, 7.10) — Germany remains a single, neutral, demilitarized state under four-power control. *Insight:* Stalin's 1952 offer of a neutral Germany becomes real four years early.
- Kyiv (50.45, 30.52) — Reconstruction accelerates; the 1946–47 famine's aftershocks are shorter. *Insight:* Ideological purity had a body count.

**C. Seize West Berlin** — Send in troops; present the West with a fait accompli before it can react.
Δ TENSION +40 · STABILITY −5 · INFLUENCE −20 · flag `BERLIN_WAR` · *Historian difficulty: 20% chance NUKE_USED*
- Berlin (52.52, 13.40) — 10,000 Western troops fight house-to-house; the US airlifts reinforcements under fire. *Insight:* The West had few troops in Berlin but could not be seen to run.
- Frankfurt (50.11, 8.68) — US B-29s, "atomic-capable," deploy to Europe — some actually carrying bombs this time. *Insight:* Your bomb was still a year away; theirs was real.
- Paris (48.86, 2.35) — French Communists are banned; Western Europe unites in fear. *Insight:* Nothing consolidates an alliance like an attack.
- Moscow (55.76, 37.62) — Stalin's health collapses under the strain; a succession crisis begins in 1949 instead of 1953. *Insight:* Wars stress leaders as well as nations.
- Vienna (48.21, 16.37) — Austria's four-power occupation collapses into a second Berlin. *Insight:* Every divided city becomes a front.
- Tokyo (35.68, 139.69) — MacArthur is given authority to rearm Japan immediately. *Insight:* A war in Europe militarizes Asia.

### USSR_T2 · 1950 · "Kim's Request"
**Situation:** Kim Il-sung has visited Moscow three times begging permission to unify Korea by force. He says the South will collapse in three weeks and the Americans won't intervene — Secretary Acheson just left Korea outside the US "defense perimeter." You have the bomb now. Mao has just won China. Approving Kim means risk; refusing means looking weak in front of the new Chinese comrade.

**A. Approve, But Make Mao Own It** *(historical)* — Green-light Kim, supply weapons and pilots secretly, insist China intervenes if it goes wrong.
Δ TENSION +8 · ECON −3 · INFLUENCE +5
- Pyongyang (39.02, 125.75) — Kim nearly wins, then loses everything to Inchon; China saves him; Korea is frozen at the 38th parallel. *Insight:* Proxy wars rarely go the way the proxy promises.
- Beijing (39.90, 116.40) — China spends 180,000 dead saving Korea and resents your caution forever. *Insight:* The Sino-Soviet split started on Korean battlefields.
- Washington (38.90, −77.04) — US defense budget triples; NSC-68 is funded. *Insight:* You handed the Pentagon its budget for the next forty years.
- Bonn (50.74, 7.10) — West German rearmament is approved out of fear of a "European Korea." *Insight:* Your worst nightmare — armed Germans — came from a war in Asia.
- Taipei (25.03, 121.57) — The US fleet guards Taiwan; Mao's invasion is cancelled forever. *Insight:* Korea decided the Chinese civil war's last battle by preventing it.
- Sea of Japan (39.00, 134.00) — Soviet pilots secretly fly MiGs in Korean markings; both sides hide the direct clash. *Insight:* Superpowers fought each other in Korea and both agreed to lie about it.

**B. Refuse Kim** — Tell him no. Korea stays divided; you focus on Europe.
Δ TENSION −5 · STABILITY +2 · INFLUENCE −6
- Pyongyang (39.02, 125.75) — Kim seethes and turns to Mao for a patron; North Korea becomes a Chinese client. *Insight:* Say no to a client and someone else says yes.
- Washington (38.90, −77.04) — Without Korea, NSC-68's massive rearmament is never funded; the US stays at 1949 force levels. *Insight:* A quiet 1950 keeps America small.
- Hanoi (21.03, 105.85) — With no "Asian communism on the march" panic, the US funds France's Indochina war far less. *Insight:* Vietnam's US involvement was a Korea aftershock.
- Bonn (50.74, 7.10) — No German rearmament panic; the Bundeswehr forms years later, smaller. *Insight:* Fear drives armies; calm delays them.
- Beijing (39.90, 116.40) — Mao invades Taiwan in 1951 with no US fleet blocking him — and succeeds. *Insight:* The 7th Fleet moved into the strait because of Korea.
- Tokyo (35.68, 139.69) — Japan's "Korea boom" never comes; recovery is 3–4 years slower. *Insight:* Japan's economic miracle was jump-started by war procurement.

**C. Go In Openly** — Send Soviet divisions, not just pilots. Win Korea fast.
Δ TENSION +35 · STABILITY −8 · ECON −10 · INFLUENCE −5 · flag `KOREA_SECOND_WAR`
- Busan (35.18, 129.08) — Soviet armor reaches the sea before US reinforcements; Korea unified under Kim in weeks. *Insight:* Speed sometimes wins before the other side decides to fight.
- Washington (38.90, −77.04) — Truman authorizes nuclear use on Soviet forces in Korea. *(Historian: 30% NUKE_USED)* *Insight:* Direct superpower combat removes the buffer that kept Korea limited.
- Tokyo (35.68, 139.69) — Japan is rearmed immediately and US nuclear weapons are stationed there. *Insight:* Your gain in Korea is a nuclear neighbor.
- Beijing (39.90, 116.40) — Mao is furious you didn't let China lead; he sees a Soviet army on his border. *Insight:* Winning too visibly frightens your own allies.
- Berlin (52.52, 13.40) — NATO calls up reserves; the West assumes Europe is next. *Insight:* Every move is read as a rehearsal for the main event.
- Helsinki (60.17, 24.94) — Finland, frightened, accepts tighter "Finlandization." *Insight:* Neighbors of a winning bully bend.

### USSR_T3 · 1956 · "Hungary"
**Situation:** Your secret speech denouncing Stalin has cracked the bloc. Poland just forced you to accept a reformist leader. Now Hungary has gone further: a new government under Nagy has declared neutrality and asked to leave the Warsaw Pact. Crowds are lynching secret policemen. The West is distracted by the Suez invasion. Mao says crush it. Your own Presidium is split.

**A. Crush Hungary** *(historical)* — 17 divisions, Operation Whirlwind. Install Kádár. Execute Nagy later.
Δ TENSION +10 · STABILITY +5 · INFLUENCE −12
- Budapest (47.50, 19.04) — 2,500 Hungarians and 700 Soviet troops die; 200,000 refugees flee west. *Insight:* You kept the bloc but lost the argument — and the Western communist parties.
- Rome (41.90, 12.50) — The Italian Communist Party loses a third of its members in a year. *Insight:* Tanks in Budapest converted more Europeans than any CIA program.
- Cairo (30.04, 31.24) — Suez cover means the West can't condemn you credibly; Nasser thanks you anyway. *Insight:* Two crises in one week cancel out moral high ground for everyone.
- Beijing (39.90, 116.40) — Mao takes credit for stiffening you and begins to see himself as the senior communist. *Insight:* Hungary shifted the balance of ideological authority toward Beijing.
- Warsaw (52.23, 21.01) — Gomułka keeps his reforms but stops all talk of leaving the Pact. *Insight:* One example is enough.
- Munich (48.14, 11.58) — Radio Free Europe is chastened; the West quietly accepts your sphere. *Insight:* The 1956 lesson for the West: don't promise what you won't deliver.

**B. Let Hungary Go Neutral (Austrian model)** — Withdraw. Accept a neutral Hungary as you did Austria in 1955.
Δ TENSION −10 · STABILITY −10 · INFLUENCE −8 · flag `HUNGARY_FREE`
- Budapest (47.50, 19.04) — Hungary becomes a second Austria: neutral, mixed economy, Western tourists by 1960. *Insight:* Neutral states didn't join NATO; the danger was to the *bloc's* logic, not your borders.
- Warsaw (52.23, 21.01) — Poland demands the same deal in 1957; Gomułka is overwhelmed by his own crowds. *Insight:* Precedent is the empire's enemy.
- East Berlin (52.52, 13.40) — Ulbricht panics; mass flight west doubles. *Insight:* The weakest satellite feels every tremor.
- Moscow (55.76, 37.62) — The "anti-Party group" (Molotov, Malenkov) moves to remove Khrushchev in 1957 — and succeeds. *Insight:* Historically they tried and failed; with Hungary lost, they'd have had the army.
- Beijing (39.90, 116.40) — Mao openly calls you a revisionist; the Sino-Soviet split arrives five years early. *Insight:* Weakness toward the West is unforgivable to a revolutionary ally.
- Vienna (48.21, 16.37) — Austria and Hungary form a neutral corridor that becomes a model for a wider "Central European zone" plan. *Insight:* The Rapacki Plan for a nuclear-free Central Europe gets real traction.

**C. Crush Hungary AND Send "Volunteers" to Egypt** — Use the moment: intervene in Suez too, as you threatened.
Δ TENSION +30 · ECON −8 · INFLUENCE +5
- Port Said, Egypt (31.26, 32.30) — Soviet pilots clash with British and French aircraft; the first NATO–Soviet shooting since 1945. *Insight:* Your 1956 rocket threats were bluff; making them real changes everything.
- Washington (38.90, −77.04) — Eisenhower, who was pressuring his own allies, now must back them; Suez becomes an East–West war. *Insight:* Your intervention rescues the alliance you were splitting.
- Cairo (30.04, 31.24) — Nasser becomes your client outright; Egypt hosts Soviet bases from 1957. *Insight:* Bases bought in 1956 cost you Egypt's loyalty in 1972 anyway.
- Tel Aviv (32.08, 34.78) — Israel, facing Soviet troops, seeks a US alliance a decade early. *Insight:* Enemies' enemies become friends fast.
- Budapest (47.50, 19.04) — Hungary is crushed with fewer eyes watching. *Insight:* Bigger crises hide smaller ones.
- Ankara (39.93, 32.87) — Turkey mobilizes on your Caucasus border; you must split forces. *Insight:* Two-front pressure is the Soviet nightmare since 1941.

### USSR_T4 · 1962 · "Anadyr"
**Situation:** Your missiles are in Cuba and the Americans have found them. Kennedy has announced a blockade and demands removal. Your commanders in Cuba have tactical nuclear weapons. Castro is urging you to strike first if invaded. The US has 5,000 warheads to your 300 — the "missile gap" was a myth, and you know it. Back down, fight, or bargain?

**A. Withdraw for a Secret Turkey Deal** *(historical)* — Pull the missiles for a US no-invasion pledge and quiet removal of Jupiters.
Δ TENSION −20 · STABILITY −10 · INFLUENCE −8
- Moscow (55.76, 37.62) — You're ousted in 1964; Brezhnev launches the buildup that reaches parity by 1970. *Insight:* Humiliation bought the arms race.
- Havana (23.11, −82.37) — Castro, uninformed, rages — but the no-invasion pledge is why Cuba survives to today. *Insight:* Your "defeat" is the reason Castro died in bed.
- Beijing (39.90, 116.40) — Mao calls it "adventurism then capitulationism"; the split is now public. *Insight:* You can't please a revolutionary ally by making peace.
- Washington (38.90, −77.04) — Kennedy learns caution; the Hotline and Test Ban Treaty follow. *Insight:* Both sides learned from terror.
- Izmir (38.42, 27.14) — Jupiters gone by April 1963. You got what you wanted and got no credit. *Insight:* Secret wins don't buy legitimacy.
- Kyiv (50.45, 30.52) — Ukrainian and Russian factories get a decade of missile orders; the "military-industrial" cities boom. *Insight:* Arms races reshape economic geography.

**B. Refuse — Run the Blockade** — Order ships through; if fired on, respond.
Δ TENSION +40 · STABILITY −5 · INFLUENCE −5 · flag `CUBA_MISSILES_STAY` · *Historian: 45% NUKE_USED; Student: 25%*
- Caribbean (22.00, −75.00) — A Soviet freighter is fired on; a submarine captain (as nearly happened with B-59) launches a nuclear torpedo. *Insight:* In 1962 one man, Vasili Arkhipov, vetoed exactly this.
- Havana (23.11, −82.37) — US airstrikes hit the sites; Soviet troops fire tactical nukes at the invasion fleet. *Insight:* Your commanders had authority the Americans didn't know about.
- Berlin (52.52, 13.40) — You seize West Berlin per your contingency plan. *Insight:* Berlin was always the intended trade.
- Ankara (39.93, 32.87) — Your strike on Jupiters triggers NATO Article 5. *Insight:* Treaties automate escalation.
- Washington (38.90, −77.04) — SAC goes to DEFCON 2 — then 1. *Insight:* Both sides' war plans were "all or nothing."
- Beijing (39.90, 116.40) — Mao praises your courage — from a safe distance. *Insight:* Allies who cheer escalation rarely share the fallout.

**C. Never Deploy — Press Berlin Instead** — Skip Cuba entirely; squeeze West Berlin's access with a new blockade in 1962.
Δ TENSION +15 · STABILITY +3 · INFLUENCE +2
- Berlin (52.52, 13.40) — Second blockade; this time NATO moves armored columns down the autobahn. *Insight:* The West's Berlin plans in 1961–62 included fighting on the ground.
- Havana (23.11, −82.37) — Cuba, feeling exposed, becomes more radical and exports revolution to Latin America harder. *Insight:* An unprotected ally overcompensates.
- Washington (38.90, −77.04) — Kennedy, without a Cuban "win," faces Republicans as weak; he loses seats in 1962. *Insight:* The crisis he survived made him.
- Bonn (50.74, 7.10) — West Germany accepts a peace-treaty framework recognizing the GDR to end the crisis. *Insight:* Your actual 1961 goal — recognition — becomes achievable.
- Beijing (39.90, 116.40) — No Cuban "capitulation" for Mao to cite; the split slows. *Insight:* Fewer visible humiliations, fewer excuses for enemies.
- Moscow (55.76, 37.62) — You survive as leader into the late 1960s; Brezhnev never rises. *Insight:* Leaders fall on foreign policy as often as domestic.

### USSR_T5 · 1968 · "Prague Spring"
**Situation:** Czechoslovakia's Dubček has abolished censorship and is talking about "socialism with a human face." He swears loyalty to the Warsaw Pact — but Ulbricht and Gomułka say the contagion will spread. Your economy needs the reforms Dubček is trying. Vietnam is bleeding the Americans; your position has never been stronger. Tanks, tolerance, or reform yourself?

**A. Invade** *(historical)* — Warsaw Pact forces occupy; "Brezhnev Doctrine" announced.
Δ TENSION +6 · STABILITY +5 · ECON −3 · INFLUENCE −10
- Prague (50.08, 14.44) — 20 years of "normalization"; a generation of the best minds emigrate or are silenced. *Insight:* Stability bought with stagnation.
- Beijing (39.90, 116.40) — Mao concludes you'll invade him next; the 1969 border war follows and Nixon's opening becomes possible. *Insight:* Prague led to Nixon in China.
- Bucharest (44.43, 26.10) — Ceaușescu refuses to join the invasion and becomes the West's favorite communist. *Insight:* Defiance of Moscow bought Romania decades of Western indulgence.
- Paris (48.86, 2.35) — Western communist parties break with you ("Eurocommunism"). *Insight:* Tanks in Prague killed Moscow's ideological authority in the West.
- Moscow (55.76, 37.62) — Kosygin's economic reforms die with Dubček's; the stagnation era begins. *Insight:* You crushed the experiment you needed.
- Helsinki (60.17, 24.94) — Détente survives anyway; the West signs Helsinki in 1975 — with a human-rights clause that later bites you. *Insight:* Your one concession at Helsinki became the dissidents' charter.

**B. Tolerate — Let Prague Experiment** — Keep Dubček inside the Pact; treat it as a contained trial.
Δ TENSION −8 · STABILITY −8 · ECON +6 · INFLUENCE +5 · flag `PRAGUE_FREE`
- Prague (50.08, 14.44) — Czechoslovakia becomes the bloc's Hungary-1980s a decade early: market elements, open press, still in the Pact. *Insight:* Reform within alliance was tested in Yugoslavia and worked for decades.
- East Berlin (52.52, 13.40) — Ulbricht, unable to compete, is replaced by a reformer under Moscow's pressure. *Insight:* Once one satellite reforms, the hardliners lose their argument.
- Moscow (55.76, 37.62) — Reformers around Kosygin win the 1970 economic debates; growth continues into the 1970s. *Insight:* Your own stagnation was a choice.
- Beijing (39.90, 116.40) — Mao sees a "revisionist" bloc but not a threatening one; the 1969 border clashes stay small. *Insight:* Less fear, less war.
- Washington (38.90, −77.04) — Nixon has less reason to court China; détente comes directly, sooner. *Insight:* Triangular diplomacy needs a triangle.
- Kraków, Poland (50.06, 19.94) — Polish workers demand the Czech deal; 1970 strikes are settled peacefully. *Insight:* Reform pressure spreads whether you allow it or not.

**C. Invade Prague, Reform at Home** — Crush Dubček to hold the bloc, then push Kosygin's market reforms hard in the USSR.
Δ TENSION +6 · STABILITY −3 · ECON +8 · INFLUENCE −6 · flag `USSR_CHINESE_PATH`
- Prague (50.08, 14.44) — Occupied; Czechs note bitterly that Moscow does what it forbade them. *Insight:* Hypocrisy erodes empires slower than weakness, but it erodes them.
- Novosibirsk (55.01, 82.94) — Enterprise autonomy and profit indicators spread; Soviet growth stays above 4% through the 1970s. *Insight:* This is roughly China's 1980s path, tried 15 years earlier.
- Moscow (55.76, 37.62) — The party apparatus resists; a compromise "reform with rigor" emerges. *Insight:* Bureaucracies that run an economy won't vote to shrink themselves.
- Beijing (39.90, 116.40) — Deng's later reformers study your model. *Insight:* Ideas cross ideological borders.
- Washington (38.90, −77.04) — A stronger Soviet economy makes détente less attractive to hawks and more necessary to doves. *Insight:* Economic power changes how negotiation looks.
- Warsaw (52.23, 21.01) — Poland copies the reforms; 1970 and 1980 worker uprisings never materialize. *Insight:* Bread beats banners.

### USSR_T6 · 1972 · "The Triangle"
**Situation:** Nixon has been to Beijing. Mao — who fought you on the Ussuri in 1969 — is now shaking hands with the Americans. Nixon is coming to Moscow next, offering SALT and grain. Your harvest failed. Your generals want to strike China's nuclear sites before it's too late; Brezhnev's diplomats want détente. Pick one.

**A. Détente — SALT I, Grain, Recognition** *(historical)* — Sign the treaties, buy the wheat, secure Europe's borders at Helsinki.
Δ TENSION −15 · ECON +8 · INFLUENCE +6
- Helsinki (60.17, 24.94) — 1975 Final Act recognizes your borders — and commits you to human rights. *Insight:* You got legitimacy; dissidents got a weapon.
- Wichita, USA (37.69, −97.34) — You buy 10 million tons of American wheat; US food prices spike. *Insight:* Détente was a bread deal.
- Beijing (39.90, 116.40) — Mao, fearing US–Soviet condominium, doubles down on the US opening. *Insight:* Your peace with Washington pushed Beijing toward Washington too.
- Luanda, Angola (−8.84, 13.23) — With Europe secured, you expand into Africa; Cuban troops fly to Angola in 1975. *Insight:* Détente in Europe freed you to compete in the Third World — which killed détente.
- Cairo (30.04, 31.24) — Sadat, feeling ignored, expels 20,000 Soviet advisors and turns to the US. *Insight:* Superpower deals leave clients feeling sold.
- Moscow (55.76, 37.62) — Oil revenues from the 1973 shock let you avoid reform for 15 years. *Insight:* Windfalls postpone reckonings.

**B. Reject Détente — Strike China's Nuclear Sites** — Preempt the encirclement.
Δ TENSION +35 · STABILITY −6 · ECON −10 · INFLUENCE −20 · flag `CHINA_WAR`
- Lop Nur, China (40.50, 90.00) — Your bombers destroy the test site; China's arsenal is set back — and it declares war. *Insight:* Historically you sounded out Washington on this in 1969; they said no.
- Washington (38.90, −77.04) — Nixon gives China intelligence and threatens intervention; the US–China axis is born in fire. *Insight:* Attacking your rival's new friend guarantees the friendship.
- Manchuria border (48.00, 130.00) — A million-man Chinese "people's war" grinds along 4,000 km of border for years. *Insight:* Geography favored the defender.
- Hanoi (21.03, 105.85) — North Vietnam, dependent on both of you, is forced to choose — and chooses you; China cuts off aid. *Insight:* The 1979 Sino-Vietnamese war arrives early.
- Moscow (55.76, 37.62) — Brezhnev is removed by a coalition of diplomats and economists as the war stalls. *Insight:* Preemptive wars end leaders.
- Tokyo (35.68, 139.69) — Japan debates nuclear weapons openly for the first time. *Insight:* A nuclear war in Asia erases Japan's taboo.

**C. Reconcile with Beijing — Break the Triangle** — Offer Mao a border settlement, technology, and a joint front against the US.
Δ TENSION +5 · ECON −4 · INFLUENCE +10 · flag `SINO_SOVIET_HEAL` (60% — Mao's paranoia may refuse)
- Beijing (39.90, 116.40) — Mao accepts a border deal but no alliance; after his death in 1976, Deng takes your technology and your money and opens to the US anyway. *Insight:* China wanted two patrons, not one.
- Washington (38.90, −77.04) — The Nixon opening stalls; hawks argue détente was a trap. *Insight:* Without a Sino-Soviet split, the US lost its main lever.
- Hanoi (21.03, 105.85) — With both patrons united, Hanoi's 1975 victory comes in 1973. *Insight:* Unity among suppliers shortens proxy wars.
- New Delhi (28.61, 77.21) — India, losing its Soviet counterweight to China, tests nukes sooner and courts the US. *Insight:* Every reconciliation orphans someone.
- Ulaanbaatar, Mongolia (47.92, 106.92) — Soviet divisions withdraw from Mongolia; Mongolia's independence is quietly weakened. *Insight:* Buffer states pay for great-power peace.
- Tokyo (35.68, 139.69) — Japan, facing a communist bloc of 1.2 billion, doubles its defense budget and revises Article 9 debates. *Insight:* Unified enemies unify their neighbors.

### USSR_T7 · 1979 · "The Afghan Trap"
**Situation:** Afghanistan's communist government is collapsing in a civil war it started. Its leader Amin has murdered his predecessor and may be talking to the Americans. Iran's revolution has just made your southern border an Islamic republic. The KGB says a limited intervention will take three months. Andropov and Ustinov want to go; Kosygin says it will be your Vietnam. Poland is about to erupt too.

**A. Invade Afghanistan** *(historical)* — 100,000 troops; kill Amin; install Karmal.
Δ TENSION +18 · STABILITY −8 · ECON −8 · INFLUENCE −15
- Kabul (34.53, 69.17) — Nine years, 15,000 dead, 1 million Afghans killed, a generation of veterans who distrust the regime. *Insight:* It was your Vietnam, exactly as Kosygin said.
- Peshawar, Pakistan (34.01, 71.58) — The CIA, Saudis and Pakistan build the mujahideen; bin Laden arrives in 1984. *Insight:* You created the conditions for 2001.
- Washington (38.90, −77.04) — Détente dies; Carter boycotts your Olympics; Reagan is elected on a hard line. *Insight:* One invasion elected your worst enemy.
- Moscow (55.76, 37.62) — Coffins ("Cargo 200") and rock music from veterans corrode faith in the system; glasnost's audience is born. *Insight:* Wars teach citizens their government lies.
- Beijing (39.90, 116.40) — China joins the US in arming the Afghans; the encirclement you feared is real. *Insight:* Self-fulfilling prophecy.
- Riyadh (24.71, 46.68) — Saudi Arabia floods the oil market in the 1980s, partly to bleed you; your revenues collapse. *Insight:* The oil weapon can point east.

**B. Stay Out — Let Amin Fall** — Accept a non-communist, possibly Islamist Afghanistan; secure the border.
Δ TENSION −6 · STABILITY +4 · ECON +5 · INFLUENCE −8 · flag `AFGHAN_SKIPPED`
- Kabul (34.53, 69.17) — Amin falls to a mujahideen coalition in 1981; a weak Islamist government emerges without the anti-Soviet fury. *Insight:* Without an occupier, the resistance has no unifying enemy.
- Washington (38.90, −77.04) — Détente limps on; SALT II is ratified; Reagan wins narrowly on the economy, not foreign policy. *Insight:* The "Second Cold War" needed a trigger.
- Peshawar (34.01, 71.58) — No jihadist pipeline; Pakistan's military stays weaker; the Arab volunteer movement has no cause. *Insight:* Al-Qaeda's founding myth was your invasion.
- Moscow (55.76, 37.62) — No veterans' disillusionment; the regime's legitimacy erodes more slowly. Reform comes later — or not at all. *Insight:* Pain is what teaches; without pain, no lesson.
- Tashkent, Uzbekistan (41.30, 69.24) — Islamic revival spreads north from Afghanistan and Iran into Central Asia anyway. *Insight:* Ideas don't need an army to cross borders.
- Tehran (35.69, 51.39) — Iran, without a Soviet army next door, focuses fully on the Iraq war. *Insight:* Distraction is a strategic gift.

**C. Invade Afghanistan AND Poland (1981)** — Don't trust Polish generals; send the Pact in to crush Solidarity yourself.
Δ TENSION +30 · STABILITY −12 · ECON −15 · INFLUENCE −25 · flag `POLAND_INVADED`
- Warsaw (52.23, 21.01) — Polish army units fight back; a two-week war leaves thousands dead and Poland under occupation. *Insight:* Poland's own army in 1981 was the largest in the Pact after yours.
- Bonn (50.74, 7.10) — West Germany ends *Ostpolitik*; the gas pipeline deal collapses; you lose hard currency. *Insight:* Occupying Poland cost you the West's money.
- Rome (41.90, 12.50) — Pope John Paul II, a Pole, becomes the moral leader of the West; Catholics across Eastern Europe radicalize. *Insight:* Some enemies you can't shoot.
- Washington (38.90, −77.04) — Full grain embargo and technology ban; Reagan's defense buildup doubles. *Insight:* Two invasions justify any budget.
- Kabul (34.53, 69.17) — Two wars at once; both go worse. *Insight:* Overstretch is how empires end.
- Moscow (55.76, 37.62) — The Politburo's reformers (Gorbachev) are purged as defeatists; a Stalin-style hardliner rules into the 1990s. *Insight:* Hardline choices harden the future.

### USSR_T8 · 1985 · "Acceleration"
**Situation:** You are Gorbachev. Three general secretaries died in three years. Growth is zero; oil prices just crashed; Chernobyl will happen next year. The West's Reagan seems both belligerent and, oddly, interested in abolishing nuclear weapons. Eastern Europe is bankrupt. Your options: open the system politically (glasnost), tighten discipline (Andropov's path), or copy Deng — markets first, party control forever.

**A. Glasnost + Perestroika + Let Them Go** *(historical)* — Open the press, negotiate INF, renounce the Brezhnev Doctrine.
Δ TENSION −30 · STABILITY −25 · ECON −10 · INFLUENCE +5 · flag `GORBY_REFORM`
- Berlin (52.52, 13.40) — Wall falls 1989; Germany reunites in NATO 1990; you're promised (verbally) no NATO expansion. *Insight:* Words at a table in 1990 fuel wars in the 2020s.
- Chernobyl, Ukraine (51.39, 30.10) — The disaster, and the cover-up's failure, shows why glasnost was needed and destroys what trust remained. *Insight:* Openness revealed a system too broken to save.
- Vilnius (54.69, 25.28) — Baltic republics declare independence; you hesitate to shoot; the USSR ends December 1991. *Insight:* The empire ended because one man wouldn't order fire.
- Beijing (39.90, 116.40) — Deng watches, concludes political opening was your mistake, and orders Tiananmen. *Insight:* China's path was chosen by watching yours fail.
- Moscow (55.76, 37.62) — August 1991 coup fails; Yeltsin wins; you're out. *Insight:* Reformers who succeed get replaced by the forces they released.
- Sarajevo (43.86, 18.41) — Yugoslavia, no longer needed as a buffer, dissolves into war. *Insight:* The Cold War froze conflicts it didn't solve.

**B. Discipline — Andropov's Path** — Anti-corruption purges, no political opening, hold the bloc, keep Afghanistan.
Δ TENSION +5 · STABILITY +5 · ECON −12 · INFLUENCE −10 · flag `GORBY_HARDLINE` + `WALL_STANDS`
- Berlin (52.52, 13.40) — The Wall stands; Leipzig protesters are shot in 1989; East Germany survives, poorer every year. *Insight:* Repression works right up until it doesn't — see Romania.
- Moscow (55.76, 37.62) — The economy shrinks 3% a year; by 1995 the USSR is a nuclear-armed North Korea. *Insight:* Discipline doesn't fix an economy that can't compute prices.
- Washington (38.90, −77.04) — Reagan's SDI buildup continues; you spend 25% of GDP on defense to match. *Insight:* You cannot win a spending race with an economy a third the size.
- Warsaw (52.23, 21.01) — Solidarity stays underground; 1989's roundtable never happens; a violent uprising in 1993 instead. *Insight:* Negotiated transitions require someone willing to negotiate.
- Beijing (39.90, 116.40) — China's boom makes it your creditor by 1995. *Insight:* Refusing reform hands the future to the reformer.
- Tallinn, Estonia (59.44, 24.75) — Baltic "Singing Revolution" is met with tanks; a long insurgency begins. *Insight:* Empires held by force end in blood.

**C. The Chinese Path — Markets First, Party Forever** — Legalize private farms and firms, keep censorship, keep the bloc by subsidy.
Δ TENSION −8 · STABILITY +3 · ECON +12 · INFLUENCE 0 · flag `USSR_CHINESE_PATH` + `USSR_SURVIVES`
- Shenzhen, China (22.54, 114.06) — Deng and you compare notes; a "socialist market" bloc emerges by the mid-1990s. *Insight:* Two authoritarian market states change the whole 21st century.
- Berlin (52.52, 13.40) — East Germany opens economically; the Wall becomes porous, then irrelevant by 1995; reunification is negotiated slowly, Germany neutral. *Insight:* A rich GDR had no reason to run.
- Moscow (55.76, 37.62) — Growth returns; the party keeps power; corruption explodes. *Insight:* China's problems become yours.
- Washington (38.90, −77.04) — No "victory"; the US faces a reforming rival rather than a collapsing one; defense budgets stay high. *Insight:* The peace dividend never comes.
- Kyiv (50.45, 30.52) — Ukraine stays in a prosperous union; no independence, no 2014, no 2022 — and no Ukrainian state. *Insight:* This branch is why the debrief matters: what's "better" depends on who you ask.
- Chernobyl (51.39, 30.10) — Without glasnost, the disaster is covered up more effectively; more people are exposed. *Insight:* Closed systems kill quietly.

---

## 6. COMPACT SCRIPTS — CHINA, UK (West Germany, Cuba, India in Part 2 file)

Format per effect: `Place (lat,lng): consequence — insight`. Claude Code: expand each into the JSON `Effect` shape; split at the em-dash into `text` / `insight`. Do not alter facts.

### 6.1 CHINA (PRC) — Start: STABILITY 40 · ECON 25 · INFLUENCE 35
**Intro:** It's 1949. You've just won a civil war after a century of humiliation. Your country is broken, illiterate, and surrounded: Americans in Japan and Korea, Chiang on Taiwan, the Soviets as ally-but-also-overlord. Stalin doesn't fully trust you. You want China to stand up. Choose whose shadow to stand in — or none.

**CHN_T1 · 1949–50 · "Lean to One Side"** — Stalin offers a treaty with strings (Port Arthur, Mongolia). The US hints at recognition if you stay independent.
- A. Sign with Stalin *(hist)* Δ STAB+5 ECON+4 INFL−3 · Moscow(55.76,37.62): $300M loan and 10,000 advisors, Soviet-model industry — your economy is built on their blueprint, which you'll later reject · Washington(38.9,−77.04): Recognition dies; 22 years of no contact — "Who lost China?" poisons US politics · Taipei(25.03,121.57): Chiang survives on US aid — Taiwan's fate is now a superpower issue · Hanoi(21.03,105.85): You recognize Ho Chi Minh first; Vietnam becomes your revolutionary client — you'll fight him in 1979 · Ulaanbaatar(47.92,106.92): You concede Mongolia's independence — a price paid for the treaty that Chinese nationalists still resent.
- B. Independent Path — Recognize Neither · Δ STAB−3 ECON−5 INFL+4 · Washington: Acheson's "let the dust settle" wins; US recognition by 1951 — Korea then plays very differently · Moscow: Stalin calls you a "Titoist," cuts aid — you're isolated but free · Beijing(39.9,116.4): Without Soviet blueprints, you improvise — a peasant-centered model (Mao's real instinct) emerges a decade early · Taipei: US, no longer seeing you as Soviet proxy, pressures Chiang to negotiate — a One-China deal in the 1950s becomes conceivable · Tokyo(35.68,139.69): Japan trades with you by 1952 — the East Asian economy integrates 20 years early.
- C. Court Washington Openly · Δ STAB−6 ECON+2 INFL+2 · Washington: McCarthy's Republicans block any deal — you're rebuffed and humiliated · Moscow: Stalin, enraged, backs a rival faction (Gao Gang) — your party splits · Pyongyang(39.02,125.75): Kim, distrusting you, relies entirely on Stalin — the Korean War proceeds without your buffer role · Beijing: Rebuffed, you swing hard left — the Great Leap comes early · Hong Kong(22.32,114.17): British colony becomes your only window — a role it plays till 1997 anyway.

**CHN_T2 · 1950 · "Cross the Yalu"** — UN forces approach your border. Stalin promises air cover, then hedges. Your generals say the army is exhausted.
- A. Intervene *(hist)* Δ TENSION+10 STAB+8 ECON−10 INFL+15 · Seoul(37.57,126.98): You push the UN back, then stall — 180,000 Chinese dead for a stalemate · Taipei: 7th Fleet permanently guards Taiwan — the price of Korea · Beijing: "China stood up" — legitimacy surge, mass mobilization, purges of "counter-revolutionaries" (700,000+ killed) · Moscow: Stalin's late air cover confirms he'll use you — the seed of the split · Washington: China becomes the "Yellow Peril" of US politics for two decades — no trade, no seat at the UN.
- B. Stay Out · Δ TENSION−5 STAB−8 INFL−10 · Pyongyang: Kim's regime collapses; a US-allied unified Korea sits on your border — the encirclement you feared · Moscow: Stalin treats you as unreliable; aid shrinks · Beijing: Nationalist critics ask what the revolution was for — Mao purges them anyway · Taipei: Without Korea, the US fleet doesn't deploy — you invade Taiwan in 1951 and win · Tokyo: Japan hosts US nukes aimed at you — the shield gets closer.
- C. Intervene and Bomb Japan's Bases · Δ TENSION+30 · flag `CHINA_WAR` · Tokyo: Bombing Kyushu bases brings Japan into the war — a rearmed Japan by 1952 · Washington: Truman authorizes nuclear strikes on Manchurian staging areas — *(Historian 35% NUKE_USED)* · Moscow: Stalin, terrified of being dragged in, cuts you loose — you're alone · Shanghai(31.23,121.47): US carrier strikes hit your coast; industry collapses · Beijing: The war becomes the regime's whole identity — a North Korea-style garrison state.

**CHN_T3 · 1956–58 · "Let a Hundred Flowers Bloom"** — Khrushchev has denounced Stalin. Intellectuals want to criticize the party. Moscow's model is delivering slow growth. Mao is impatient.
- A. Great Leap Forward *(hist)* Δ STAB−15 ECON−25 INFL−5 · Henan(34.76,113.65): Backyard furnaces and communes — 30–45 million die in the famine 1959–61 · Moscow: Khrushchev mocks the Leap; you call him a revisionist — the split becomes ideological · Beijing: Mao retreats from daily rule; Liu Shaoqi and Deng repair the economy — Mao's revenge becomes the Cultural Revolution · Lhasa(29.65,91.17): The 1959 Tibetan uprising, fed by Leap-era coercion, is crushed; the Dalai Lama flees to India · New Delhi(28.61,77.21): Sheltering the Dalai Lama poisons Sino-Indian ties — the 1962 war is now on the calendar.
- B. Soviet Model, Slow and Steady · Δ STAB+5 ECON+8 INFL+2 · Shenyang(41.8,123.43): Heavy industry grows 8%/yr on Soviet plans — no famine, no Leap · Moscow: Alliance holds through the 1960s — the split, if it comes, is later and milder · Beijing: Mao's radicals are marginalized; a technocratic party emerges — the Cultural Revolution never happens · Washington: A stable Sino-Soviet bloc is more frightening — the US spends more on Asia, less on Vietnam adventures (nothing to "roll back") · Taipei: Prosperous mainland tempts Taiwan's business class — cross-strait contact begins in the 1970s.
- C. Hundred Flowers For Real — Open Debate · Δ STAB−10 ECON+3 INFL+5 · Beijing: Criticism overwhelms the party within months; Mao either reverses (historically he did, purging 500,000 as "rightists") or loses control · Shanghai: A reformist intellectual wing survives — China's 1980s arrive in the 1960s · Moscow: Khrushchev cites you as proof of thaw — Eastern Europe's reformers are emboldened · Budapest(47.5,19.04): Hungary-style unrest spreads to Guangzhou students · Taipei: Chiang loses the "free China" monopoly; Western opinion shifts toward you.

**CHN_T4 · 1962 · "Himalaya"** — India has pushed border posts into disputed territory ("Forward Policy"). Nehru refuses to negotiate. The USSR sells India MiGs. Cuba is in crisis; the world is distracted.
- A. Punitive Strike Then Withdraw *(hist)* Δ TENSION+4 STAB+5 INFL+5 · Tawang(27.59,91.87): You rout Indian forces in a month, then withdraw unilaterally — a message, not a conquest · New Delhi: Nehru is broken; India militarizes and starts its nuclear program — the bomb comes in 1974 · Islamabad(33.69,73.04): Pakistan becomes your ally — the "all-weather friendship" starts here · Moscow: Khrushchev supports India during the Cuban crisis — proof to you the alliance is dead · Washington: The US airlifts arms to India — briefly, until Pakistan complains.
- B. Negotiate — Swap Aksai Chin for Arunachal · Δ TENSION−3 INFL+6 · New Delhi: Nehru accepts the swap (his 1960 position was close) — the border is settled forever · Islamabad: Pakistan, denied a Chinese patron, leans fully on the US — no Sino-Pak axis, no nuclear help later · Lhasa: A quiet border reduces Tibetan insurgency support from India · Moscow: Khrushchev claims credit — the alliance limps on · Washington: A China–India understanding alarms the US — the "Asian giants" framing appears in the 1960s, not the 2000s.
- C. Take and Hold Arunachal · Δ TENSION+12 STAB+2 INFL−8 · Assam(26.14,91.77): You occupy to the Brahmaputra; India's northeast becomes an insurgent zone · New Delhi: India joins the US in a formal treaty by 1964 — nonalignment dies · Moscow: The USSR arms India massively — you now have hostile superpowers on both flanks · Islamabad: Pakistan attacks Kashmir opportunistically in 1963 — a two-front war for India · Washington: The US considers nuclear guarantees for India — Asia goes nuclear a decade early.

**CHN_T5 · 1966 · "Bombard the Headquarters"** — Mao, sidelined since the famine, calls students to purge "capitalist roaders." Liu Shaoqi and Deng control the party machine. The Vietnam War rages on your border.
- A. Cultural Revolution *(hist)* Δ STAB−25 ECON−15 INFL−10 · Beijing: Red Guards destroy the party, universities close for years, 1–2 million die — a decade lost · Hong Kong: 1967 riots and bombs — Britain nearly loses the colony · Hanoi: You still send 320,000 troops to North Vietnam — chaos at home, war abroad · Ussuri River(48.3,134.7): Paranoia peaks in the 1969 border war with the USSR — 2,000 dead · Washington: A China at war with itself and Moscow is a China ready for Nixon — the opening's precondition.
- B. Mao Retires — Liu and Deng Rule · Δ STAB+10 ECON+12 INFL+5 · Beijing: Pragmatic reforms of 1962–65 continue — China's Deng era starts in 1966 · Moscow: A rational China negotiates the border; the split freezes rather than boils · Hanoi: Aid to Vietnam is conditioned on negotiation — the war ends sooner · Washington: No Sino-Soviet war, less reason for Nixon's opening — but trade begins by 1970 via Japan · Taipei: Prosperity draws Taiwan's businesses; reunification talks in the 1980s.
- C. Cultural Revolution Plus War With the USSR · Δ TENSION+30 STAB−30 · flag `CHINA_WAR` · Zhenbao Island(46.5,133.8): Border clashes become full war; Soviet forces bomb Manchuria — you fight with militia and slogans · Moscow: The Politburo debates nuclear strikes on your bomb sites (this was real in 1969) · Washington: Nixon warns Moscow off — the US becomes your de facto protector · Beijing: The army takes over from Red Guards; a military dictatorship under Lin Biao · Hanoi: Vietnam sides with Moscow; you're at war on two fronts.

**CHN_T6 · 1972 · "The Handshake"** — Nixon wants to visit. Lin Biao is dead in a mysterious plane crash. The Soviets have a million troops on your border. Zhou Enlai says the Americans can be used; Mao's wife says it's betrayal.
- A. Welcome Nixon *(hist)* Δ TENSION−10 ECON+5 INFL+15 · Beijing: The Shanghai Communiqué; UN seat won; Taiwan expelled — you're a great power again · Moscow: Brezhnev, fearing US–China encirclement, rushes to sign SALT — your leverage on both · Tokyo: Japan normalizes relations within months — trade explodes · Islamabad: Pakistan, your matchmaker, is rewarded with US silence over Bangladesh atrocities · Shenzhen(22.54,114.06): The door is open; when Deng wins in 1978 there's someone to trade with.
- B. Refuse — Both Superpowers Are Enemies · Δ TENSION+5 STAB−3 ECON−6 INFL−5 · Beijing: Radicals dominate; Deng never returns from exile — reform is delayed a decade or more · Moscow: Without a US–China axis, the Soviets don't need SALT — the arms race runs hotter · Washington: Nixon settles for détente with Moscow alone — the US–Soviet condominium Europeans feared · Taipei: Taiwan keeps its UN seat into the 1980s · Hanoi: Vietnam stays loyal to you — no 1979 war, but no reform either.
- C. Play Both — Also Reconcile With Moscow · Δ TENSION−12 ECON+8 INFL+10 · Moscow: Border settlement and resumed trade — the split heals into rivalry · Washington: Kissinger fears a "united front" — the US gives you more to keep you · Tokyo: Japan hedges — slower normalization · Hanoi: Both patrons united, Vietnam wins in 1973 · New Delhi: India, losing its Soviet counterweight to you, tests its bomb in 1972 and courts the US.

**CHN_T7 · 1978–79 · "Reform and Opening"** — Mao is dead. Deng has outmaneuvered the Gang of Four. Vietnam has invaded Cambodia, your ally. The economy is at famine levels in parts of the countryside.
- A. Deng's Reforms + Punish Vietnam *(hist)* Δ TENSION+4 STAB+8 ECON+20 INFL+8 · Anhui(31.86,117.28): Farmers secretly divide collective land; the state legalizes it — 400 million leave poverty by 2000 · Lang Son(21.85,106.76): A 4-week war with Vietnam; 30,000 dead; you withdraw — a message to Moscow's client, at a price · Washington: Full diplomatic relations; Deng in a cowboy hat — the US bets on Chinese reform for 40 years · Shenzhen: Special Economic Zone opens — Hong Kong capital pours in · Kabul(34.53,69.17): You join the US arming Afghan rebels — the encirclement of the USSR is complete.
- B. Maoist Continuity Under Hua Guofeng · Δ STAB−5 ECON−8 INFL−8 · Beijing: The "two whatevers" — Mao's line unchanged; growth stalls; a North Korea with 1 billion people · Hanoi: No war; Vietnam dominates Indochina · Washington: The US pivots to Japan and ASEAN as its Asian anchors · Moscow: A weak, isolated China lets Brezhnev focus on Europe and Afghanistan · Taipei: Taiwan's economy passes the mainland's in absolute terms by 1990.
- C. Political Reform Alongside Economic · Δ STAB−8 ECON+15 INFL+12 · Beijing: Village elections, a freer press — Democracy Wall is legalized rather than crushed · Shanghai: Growth is slower early (uncertainty) but no 1989 crackdown · Washington: China becomes the West's favorite reformer — Soviet reformers cite you · Moscow: Gorbachev's model has a precedent; the USSR's reforms are less panicked · Hong Kong: Handover negotiations go far easier — "one country, two systems" barely needed.

**CHN_T8 · 1989 · "Tiananmen"** — A million students occupy the square demanding reform; Gorbachev is visiting; the world's cameras are there. Zhao Ziyang wants dialogue; Li Peng wants martial law. Eastern Europe is collapsing.
- A. Martial Law *(hist)* Δ STAB+10 ECON−5 INFL−20 · flag `TIANANMEN` · Beijing: Hundreds to thousands killed June 4; Zhao under house arrest for 15 years — the party survives, the deal is "prosperity for silence" · Washington: Sanctions for a year, then business as usual by 1992 — money beats memory · Moscow: Gorbachev, horrified, resolves not to shoot in the Baltics — the USSR falls, you survive · Shenzhen: Deng's 1992 "Southern Tour" restarts reform — capitalism without democracy · Hong Kong: Trust in 1997 collapses; 500,000 march; emigration surges.
- B. Zhao's Path — Dialogue and Reform · Δ STAB−10 ECON+5 INFL+15 · Beijing: Concessions: press freedom, party elections — a slow Chinese glasnost · Moscow: A reforming China plus a reforming USSR — the whole communist world liberalizes at once · Washington: The "end of history" looks real; US defense budgets crater · Taipei: Reunification talks under democracy become plausible in the 2000s · Shanghai: Growth briefly slows, then surges with rule-of-law investment.
- C. Hardline Plus Retreat From Reform · Δ STAB+5 ECON−20 INFL−25 · Beijing: Crackdown and re-collectivization; Deng is sidelined by conservatives · Shenzhen: SEZs closed; foreign capital flees · Washington: Full sanctions; China joins the USSR as a pariah · Moscow: Soviet hardliners cite you — Gorbachev is weaker; the August 1991 coup succeeds · Pyongyang: North Korea and China form a "hermit bloc" — 1990s famine hits both.

### 6.2 UNITED KINGDOM — Start: STABILITY 55 · ECON 35 · INFLUENCE 55
**Intro:** It's 1947. You won the war and went bankrupt doing it. India is leaving; Palestine is a nightmare; the Americans hold your debt. Your bomb program is secret even from most of the cabinet. Are you still a great power, America's partner, or Europe's leader? Pick before the money runs out.

**UK_T1 · 1947 · "Bankrupt Empire"** — Winter fuel crisis; convertibility of sterling collapses. Greece, Turkey and Palestine drain the treasury. Marshall is offering aid.
- A. Hand Greece to the US, Take Marshall Aid, Build the Bomb *(hist)* Δ ECON+10 INFL−5 · Athens(37.98,23.73): The US takes over — the Truman Doctrine is born from your telegram · Aldermaston(51.37,−1.15): The bomb, secretly funded, tests in 1952 — a seat at the top table · New Delhi(28.61,77.21): Independence rushed to August 1947; Partition kills up to 1 million · Jerusalem(31.77,35.22): You dump Palestine on the UN; war follows in 1948 · Washington(38.9,−77.04): You become junior partner; the "special relationship" is born as a dependency.
- B. Lead a European Union Now · Δ ECON+5 INFL+8 · Paris(48.86,2.35): Britain joins the Schuman Plan in 1950 — the European Community forms around London and Paris · Washington: The US prefers this and pushes Marshall funds through you · Bonn(50.74,7.10): West Germany integrates under British-French leadership — less need for US troops · Canberra(−35.28,149.13): Commonwealth ties loosen faster · Aldermaston: Bomb program slows — Europe's nuclear force is Franco-British by 1960.
- C. Hold the Empire — Refuse Retreat · Δ STAB−5 ECON−15 INFL+3 · Athens: You stay; the civil war drags; you go deeper into debt · New Delhi: Independence delayed to 1950; violence is worse · Cairo(30.04,31.24): Egypt's 1952 revolution comes early, aimed at you · Washington: Congress refuses more loans; sterling crisis becomes default · London(51.51,−0.13): Rationing lasts until the 1960s.

**UK_T2 · 1950 · "The Lion Follows"** — The US demands troops for Korea and a rearmament program that will break the budget. The NHS is two years old.
- A. Send Troops, Rearm, Cut the NHS *(hist)* Δ STAB−6 ECON−8 INFL+5 · Imjin River(37.95,126.95): The Gloucesters' stand — 1,000 British dead; the alliance is cemented · London: Prescription charges split Labour; Attlee loses in 1951 · Washington: You earn a voice in the war — and use it to stop MacArthur's nukes · Kuala Lumpur(3.14,101.69): Malaya's insurgency gets less attention; Britain's counter-insurgency doctrine is born under strain · Bonn: You back German rearmament to share the burden.
- B. Refuse Rearmament — Fund the Welfare State · Δ STAB+8 ECON+4 INFL−10 · Washington: Fury; US aid conditioned; the "special relationship" cools for a decade · Imjin: A token brigade only; Britain's influence over Korea policy vanishes — MacArthur's nuclear plan gets no British veto · London: Labour wins 1951; the NHS expands · Paris: Europe, seeing British reluctance, builds its own defense community · Canberra: Australia signs ANZUS with the US alone.
- C. Send Troops But Demand Full Command Partnership · Δ ECON−6 INFL+8 · Washington: Truman refuses joint command but grants consultation rights on nuclear use · Tokyo: British forces base in Japan alongside the US — a Pacific presence retained · Hong Kong: US commitments cover the colony — China stays out · Cairo: Britain's Middle East forces are thinned — the Egyptian revolution succeeds in 1952 · London: Defense spending overwhelms the budget anyway.

**UK_T3 · 1956 · "Suez"** — Nasser has nationalized the canal. Eden sees Hitler. France and Israel propose a secret plan. Eisenhower has warned you not to.
- A. Invade Secretly With France and Israel *(hist)* Δ STAB−10 ECON−12 INFL−20 · Port Said(31.26,32.3): You win militarily and lose everything; the US crashes the pound; you withdraw in weeks · London: Eden resigns; Macmillan restores the US link on America's terms · Cairo: Nasser is the Arab world's hero — Arab nationalism is now anti-British · Paris: France concludes Britain is a US puppet — de Gaulle vetoes your EEC entry in 1963 · Accra, Ghana(5.6,−0.19): African decolonization accelerates — 17 states independent by 1960.
- B. Go to the UN, Accept Nationalization · Δ STAB+3 INFL+5 · Cairo: Nasser wins anyway — but he owes you nothing and needs the West · Washington: Eisenhower rewards restraint; the alliance is strengthened · Paris: France and Israel act alone — and fail faster · London: Eden survives; the empire's retreat is orderly, not panicked · New Delhi: The Commonwealth holds together — Nehru credits you.
- C. Invade Openly, Alone, With US Notice · Δ STAB−8 ECON−15 INFL−15 · Washington: Eisenhower, warned in advance, still cuts you off — but slower · Port Said: Occupation lasts months; a guerrilla war on the canal · Budapest(47.5,19.04): Your invasion still gives Moscow cover in Hungary · Baghdad(33.31,44.37): The Iraqi monarchy falls in 1957, a year early, to anti-British officers · London: Sterling collapses; IMF bailout.

**UK_T4 · 1962 · "Skybolt"** — The US has cancelled Skybolt, your planned nuclear delivery system. Your independent deterrent is about to become fiction. De Gaulle offers a Franco-British bomb. Kennedy offers Polaris — under NATO command, sort of.
- A. Take Polaris From Kennedy *(hist)* Δ ECON+2 INFL+3 · Nassau(25.06,−77.34): The deal makes your deterrent dependent on US missiles forever · Paris: De Gaulle vetoes your EEC entry weeks later — "Britain is not European" · Holy Loch(56.0,−4.9): US submarines base in Scotland — a protest movement (CND) is born · Washington: The special relationship is formalized as nuclear dependency · Canberra: Australia sees Britain as a US satellite; turns to Washington.
- B. Franco-British Bomb With de Gaulle · Δ ECON−5 INFL+8 · Paris: A European deterrent; de Gaulle welcomes you into the EEC in 1963 · Washington: Kennedy is furious; US–UK intelligence sharing narrows · Bonn: Germany is tempted to join the nuclear club — the US panics · Moscow: A European bomb changes Soviet targeting — Europe is a separate front · London: Sovereignty preserved; costs doubled.
- C. Abandon the Bomb — Spend on Industry · Δ STAB+3 ECON+8 INFL−12 · Washington: The US quietly welcomes fewer nuclear powers · Paris: Britain enters the EEC as an equal (no nuclear rivalry) · London: 1960s "white heat" industrial policy gets real money; decline slows · Moscow: Britain is removed from Soviet first-strike plans · New Delhi: Britain leads non-proliferation — India delays its test.

**UK_T5 · 1965 · "East of Suez"** — Wilson's government is broke. The US wants British troops in Vietnam. Rhodesia has just declared white-minority independence. The Malaysia-Indonesia confrontation drags on.
- A. Refuse Vietnam, Withdraw East of Suez by 1971 *(hist)* Δ STAB+4 ECON+6 INFL−10 · Saigon(10.82,106.63): Not one British soldier — LBJ never forgives, but the alliance survives · Singapore(1.35,103.82): British bases close; Singapore builds its own state · Salisbury, Rhodesia(−17.83,31.05): Sanctions, not force; UDI lasts 15 years · Washington: The US concludes it's alone in Asia — burden-sharing dies · Bahrain(26.23,50.59): Gulf states become US-protected — the 1970s oil politics shift.
- B. Send Troops to Vietnam · Δ STAB−15 ECON−8 INFL+4 · Saigon: 10,000 British troops; 2,000 dead; the antiwar movement splits Labour · Washington: LBJ rewards you with loans that save the pound (for now) · London: Wilson falls in 1968 to his own left · Kuala Lumpur: Malaysia and Australia join too — a Commonwealth front · Moscow: Britain becomes a Soviet target of propaganda — the Cold War comes home.
- C. Use Force in Rhodesia · Δ STAB−8 ECON−6 INFL+6 · Salisbury: Paratroopers end UDI; a Black-majority Zimbabwe forms in 1966, not 1980 · Pretoria(−25.75,28.19): Apartheid South Africa is isolated a decade early · Washington: The US supports you — a rare colonial-era approval · London: Tory right splits; the Conservative Party realigns · Lagos(6.52,3.38): Nigeria and the Commonwealth back Britain — the Commonwealth is revived.

**UK_T6 · 1973 · "Into Europe"** — You've joined the EEC. The oil shock hits; miners strike; the three-day week. Nixon's détente leaves you a bystander. Northern Ireland burns.
- A. Stay In Europe, Ride Out the Crisis *(hist)* Δ STAB−8 ECON−6 INFL+4 · Brussels(50.85,4.35): Britain in the EEC; a 1975 referendum confirms it — Europe is your future, uncertainly · London: Heath falls; Wilson returns; inflation hits 25% · Belfast(54.6,−5.93): Troubles peak — 500 dead in 1972; a war that lasts 25 years · Washington: Kissinger's "Year of Europe" is ignored; the US treats you as one of nine · Riyadh(24.71,46.68): You cut deals with Gulf monarchies — arms for oil.
- B. Leave Europe, Renew Atlantic Ties · Δ STAB+2 ECON−4 INFL−6 · Brussels: EEC proceeds without you — a Franco-German Europe · Washington: Nixon welcomes a loyal ally; trade deals follow · London: Sterling area revived, weakly · Belfast: Without European legal pressure, Northern Ireland policy is harsher · Dublin(53.35,−6.26): Ireland in the EEC, Britain out — the border becomes an EU frontier decades early.
- C. Nationalize North Sea Oil, Go Semi-Neutral · Δ STAB+6 ECON+10 INFL−8 · Aberdeen(57.15,−2.09): A Norwegian-style oil fund is created — Britain's 1980s look different · Washington: Britain distances from NATO's nuclear planning · Moscow: You're courted as a "European neutral" leader · Brussels: The EEC accepts a semi-detached Britain · Edinburgh(55.95,−3.19): Scottish nationalism, fed by oil, surges.

**UK_T7 · 1982 · "Falklands"** — Argentina's junta has invaded the Falklands. Thatcher is deeply unpopular; the economy is in recession. The US is torn between two allies. Reagan wants Pershing missiles in Britain.
- A. Retake the Islands, Deploy Cruise Missiles *(hist)* Δ STAB+15 ECON−5 INFL+12 · Port Stanley(−51.7,−57.85): 255 British and 649 Argentine dead; victory in 10 weeks · Buenos Aires(−34.6,−58.38): The junta collapses; democracy returns to Argentina — an unintended gift · Washington: Reagan tilts to you; the alliance is reborn · Greenham Common(51.38,−1.28): Women's peace camp becomes the symbol of 1980s protest · London: Thatcher wins 1983 in a landslide — the miners' strike and privatization follow.
- B. Negotiate — Accept Shared Sovereignty · Δ STAB−15 INFL−12 · Port Stanley: A leaseback deal; islanders furious · Buenos Aires: The junta survives on triumph; repression continues into the late 1980s · London: Thatcher falls; Labour's Foot wins 1983 on a unilateral-disarmament platform · Washington: Cruise missiles refused — Reagan's INF strategy weakens · Moscow: The Politburo notes NATO's second-largest power going soft.
- C. Retake the Islands, Refuse Cruise Missiles · Δ STAB+10 ECON−6 INFL+2 · Port Stanley: Victory as history · Washington: Reagan, denied bases, moves the missiles to Italy and Germany — Germany's peace movement grows · Bonn: West Germany feels singled out · London: Thatcher wins on the war alone; CND's split with Labour never happens · Moscow: Andropov sees British "independence" as a wedge — offers a bilateral deal.

**UK_T8 · 1989 · "The Wall and the Lady"** — Gorbachev is a man you can "do business with." The Wall is falling; Kohl wants rapid German unification; Thatcher fears it. Europe is moving toward a single currency.
- A. Oppose Unification, Lose; Stay Out of the Euro *(hist)* Δ STAB−5 INFL−4 · Berlin(52.52,13.4): Unification 1990 over your objection; Kohl remembers · Paris: Mitterrand trades unification for the euro — Britain opts out · London: Thatcher falls in 1990 to her own party over Europe · Moscow: Your friendship with Gorbachev gives you no leverage on Germany · Brussels: The Maastricht opt-outs shape Britain's semi-detached EU membership until 2016.
- B. Back Unification, Join the Euro Project · Δ ECON−3 INFL+10 · Berlin: Britain is the honest broker; Kohl becomes an ally · Frankfurt(50.11,8.68): Britain joins the euro in 1999; the City is at the center of Europe's finance · London: Thatcher is replaced by a pro-European Tory · Washington: A Britain inside Europe is a weaker US bridge · Edinburgh: Scottish independence loses its "Europe" argument.
- C. Push for a Neutral Unified Germany · Δ TENSION−5 INFL+5 · Berlin: Germany unites neutral, out of NATO — Gorbachev's dream · Washington: Bush is furious — the NATO order is broken · Moscow: A grateful Gorbachev survives longer; the coup of 1991 is smaller · Warsaw: Poland, with a neutral Germany, seeks NATO alone — and fast · Paris: France doubts a neutral giant next door — the Franco-German engine stalls.

---

## 7. ENDINGS (20) — `endings.json`

Resolver: evaluate in priority order; first match wins. All endings apply to all countries; `card` text uses `{country}` tokens and 2nd person. E01 is a hard stop that can fire mid-game.

| # | ID | Title | Priority | Conditions (ALL) |
|---|---|---|---|---|
| 1 | E01_NUCLEAR_WINTER | Nuclear Winter | 100 | flag NUKE_USED **and** TENSION ≥ 90 · *(or TENSION ≥ 100 at any time)* |
| 2 | E02_LIMITED_EXCHANGE | The Day After | 95 | flag NUKE_USED, TENSION < 90 |
| 3 | E03_DRAGON_WAR | Sino-Soviet War / China Front | 90 | flag CHINA_WAR |
| 4 | E04_BERLIN_1948 | The Berlin War | 88 | flag BERLIN_WAR |
| 5 | E05_SECOND_KOREA | Peninsula in Flames | 86 | flag KOREA_SECOND_WAR |
| 6 | E06_COUP_AT_HOME | Collapse at Home | 84 | STABILITY ≤ 10 |
| 7 | E07_WEST_BROKE | The West Goes Broke | 82 | flag WEST_ECON_COLLAPSE **or** (country ∈ {USA,UK,FRG} and ECON ≤ 12) |
| 8 | E08_RED_EUROPE | Red Dawn Over Europe | 80 | flag POLAND_INVADED, flag WALL_STANDS, INFLUENCE (if USSR) ≥ 60 |
| 9 | E09_FORTRESS_AMERICA | Fortress America | 78 | flag US_ISOLATION, country USA, INFLUENCE ≤ 30 |
| 10 | E10_EURASIAN_BLOC | The Eurasian Bloc | 76 | flag SINO_SOVIET_HEAL, flag NO_DETENTE |
| 11 | E11_IRON_CURTAIN_HOLDS | Iron Curtain Holds | 74 | flag GORBY_HARDLINE, flag WALL_STANDS |
| 12 | E12_TWO_MARKETS | Two Roads to Market | 72 | flag USSR_CHINESE_PATH, flag USSR_SURVIVES |
| 13 | E13_GRAND_BARGAIN | The Grand Bargain | 70 | flag USSR_SURVIVES, flag GORBY_REFORM |
| 14 | E14_EARLY_THAW | The Early Thaw | 68 | flag HUNGARY_FREE **or** flag PRAGUE_FREE, TENSION ≤ 45 |
| 15 | E15_PACIFIC_CENTURY | The Pacific Century | 66 | country CHN, ECON ≥ 75, no TIANANMEN |
| 16 | E16_NONALIGNED_WORLD | The Third Way Wins | 64 | flag NAM_STRONG **or** (country IND, INFLUENCE ≥ 70) |
| 17 | E17_ENDLESS_PROXIES | Proxy Wars Without End | 62 | flag VIETNAM_TOTAL **or** (TENSION 65–89 at end and no ending above) |
| 18 | E18_QUIET_DIVIDEND | The Quiet Dividend | 60 | flag VIETNAM_NEUTRAL, flag AFGHAN_SKIPPED |
| 19 | E19_HISTORY_AS_IT_WAS | 1991: The Long Peace | 58 | historicalPct ≥ 75 **or** (flag GORBY_REFORM and no USSR_SURVIVES) |
| 20 | E20_FROZEN_PEACE | Frozen Peace | 0 | *(fallback)* |

**Sample ending — E19 (full):**
> **1991: The Long Peace.** Forty-four years, no direct war between the superpowers, and one December night the red flag comes down over the Kremlin. You made most of the calls the real leaders made. Whether that's wisdom or luck is the question this whole game is about. *Reality:* This is what happened. The Cold War ended not with a battle but with a bankruptcy, a botched press conference, and a general secretary who would not order his soldiers to fire. Around 20 million died in its proxy wars anyway — in Korea, Vietnam, Afghanistan, Angola, Central America. *Discuss:* (1) Was the peaceful ending inevitable, or a near miss? (2) Who "won"? Ask a Vietnamese, a Pole, and an Angolan. (3) Which of your choices would you make differently knowing what you know now?

**Sample ending — E01 (full):**
> **Nuclear Winter.** The map goes dark. There is no debrief for the dead. *Reality:* Historians count at least five moments when this nearly happened: October 1962 (Cuba), the B-59 submarine, 1969 (Ussuri), 1979 and 1980 (NORAD false alarms), November 1983 (Able Archer / Petrov). Each time a specific person chose not to act. *Discuss:* (1) Deterrence worked for 44 years — was that a system or a streak? (2) Who should hold the authority to launch? (3) What made the people who said "no" say no?

Claude Code: write the remaining 18 `card` / `reality` / `discuss` blocks in this voice (≤150 words each part). Every `reality` must state whether the branch is historical or counterfactual, and name the real closest analogue.

---

## 8. LEARNING LAYER

**Debrief screen (after ending):**
1. Ending card.
2. **Divergence map:** your 8 choices vs. history as two colored lines on the turn timeline; first divergence highlighted.
3. **Three butterflies you didn't see coming:** engine picks the 3 effects farthest from the player's capital and re-shows them.
4. **What really happened:** per-turn one-liners for the historical choice.
5. **Discuss:** 3 questions. Teacher mode adds a "print worksheet" button.
6. **Sources:** a curated static list per scenario (Gaddis *The Cold War*; Westad *The Global Cold War*; Dobbs *One Minute to Midnight*; Sheehan; Judt *Postwar*; Chen Jian *Mao's China and the Cold War*; the Wilson Center Digital Archive). Link, don't quote.

**Difficulty:**
- *Student:* effects auto-advance; random branches use lower NUKE_USED odds; hints show which choice is historical after you pick.
- *Historian:* no hints; random odds as written; a "cabinet" panel shows two conflicting advisor one-liners per choice (Claude Code: generate these from the effects, or leave as TODO).

**Content guardrails (apply to WW2 especially):**
- Never let a choice "win" via atrocity; genocide/mass-killing choices are not selectable — they appear as *consequences* with historical framing.
- No gamified body counts; casualties shown as text in insights, not scoreboards.
- Playing an authoritarian state is framed as *understanding constraints*, not endorsement; the intro says so.

---

## 9. SCENARIO 2 — WW2 (Phase 2 outline; build after Cold War ships)

**Playable (8):** USA · UK · USSR · Germany · Japan · China (Nationalist) · France · Poland.
**Turns:** 1 · 1936 Rhineland/Spain · 2 · 1938 Munich · 3 · 1939 Pact & Poland · 4 · 1940 Fall of France/Battle of Britain · 5 · 1941 Barbarossa & Pearl Harbor · 6 · 1942–43 Stalingrad/Midway · 7 · 1944 Normandy & Bagration · 8 · 1945 Bomb & Potsdam.
**Extra global flags:** `MUNICH_REFUSED`, `NO_PACT`, `SEALION`, `NO_BARBAROSSA`, `NO_PEARL`, `BOMB_NOT_DROPPED`, `SOVIET_JAPAN_1945`, `FRANCE_FIGHTS_ON`, `EARLY_SECOND_FRONT`.
**Endings (20) sketch:** Historical V-E/V-J · Munich Holds (war in 1938) · Cold Peace 1940 (Britain settles) · Fortress Europe (Germany survives to 1950 stalemate) · Red Europe to the Rhine · Pacific Stalemate · Invasion of Japan (Downfall) · Bomb on Berlin · Soviet Collapse 1942 · Franco-German Peace 1940 · Poland Partitioned Thrice · China Falls · China Unified Early · Atlantic Wall Holds · Early Cold War (Patton pushes) · Nazi Bomb · Allied Split · Neutral America · League Reborn · The Long War (fallback).
**Design note:** For Germany/Japan, the decision space is strategic and diplomatic (Rhineland timing, Munich, Pact, Barbarossa, Pearl Harbor, when to seek peace). The Holocaust and Nanjing appear as fixed, non-optional historical context with dedicated insight cards on every German/Japanese turn from 1941 on; they are never choices and never affect meters "favorably." Debrief for Axis play centers on how ideology destroyed strategy.

---

## 10. BUILD ORDER FOR CLAUDE CODE

1. Scaffold Vite+React+TS; MapLibre with a bundled PMTiles world map (low-zoom, ~40 MB max; or OpenFreeMap online).
2. Implement `content/` loader + Zod validation of the schema in §2.1.
3. Encode USA (§4) and USSR (§5) into JSON verbatim. Encode China and UK (§6) by splitting each effect at the em-dash.
4. Build turn loop + map choreography (§2.4) + meters (§2.3).
5. Build resolver + all 20 endings (§7) — write the 18 missing card/reality/discuss blocks.
6. Debrief screen (§8), difficulty, teacher mode.
7. Placeholder data for FRG/CUB/IND (intro + 8 titles only, marked "Coming soon") until Part 2 file arrives.
8. Playtest: every country must reach ≥ 8 distinct endings across plausible paths; log unreachable endings.
9. Accessibility pass; export/print; ship.
