# Content adaptations

The author-provided specifications are preserved in `docs/`. The raw importer keeps their scripts and priorities. `enrich-content.py` records these changes:

- Corrected the importer's ending-ID pattern to include digits (for example `E04_BERLIN_1948`).
- Split cinematic tension rises/falls in the Cuban crisis into immediate decision changes and later ripple changes. A hard stop still occurs if tension reaches 100 before de-escalation.
- Explicitly label nuclear probability draws as simulation assumptions, never measured historical odds. A failed draw no longer narrates nuclear use as a certainty. Student nuclear probabilities are lower.
- Added outcome flags only where the supplied prose describes the outcome: German demands to tear down the Wall can trigger the Berlin War; German/British Vietnam deployments can trigger Endless Proxies; Chinese reconciliation can trigger a Eurasian bloc.
- **Quiet Dividend:** the original required both `VIETNAM_NEUTRAL` (USA only) and `AFGHAN_SKIPPED` (USSR only), so no single-country run could qualify. After a US Vietnam-neutrality decision, Turn 7 now offers a clearly counterfactual reciprocal Afghan-neutrality bargain. It is a conditional variant, not a claim about what happened in 1979. This connects the required flags in one playthrough.
- Added scenario variants for earlier Chinese reform, German neutrality, a democratic Cuban transition, non-alignment before the missile decision, and avoidance of the Korean War. Other eras explicitly retain their role as historical decision settings.
- Corrected the Imjin consequence so the British death toll for the whole Korean War is not assigned to one battle. Source: [National Army Museum](https://www.nam.ac.uk/explore/battle-imjin).
- Corrected the implication that the Campaign for Nuclear Disarmament began after the 1962 Polaris deal; it already existed. The script now describes a new focus for the movement.
- Replaced the claim about Perón buying Soviet grain with Argentina's Third Position diplomacy; corrected “1948 midterms” to congressional elections; avoided calling the 1946–49 Greek communist army ELAS.
- Changed the 1987 US briefing to a 1987–91 window and described withdrawal from Afghanistan as under discussion, not already completed in 1987.
- Moon landing geography points to Houston mission control, with lunar geography in the text, rather than inventing an Earth coordinate for the Sea of Tranquility.
- Flashpoints are labeled **historical interludes** with their actual date. The supplied after-turn ordering is preserved even when that creates a look back (notably Cuba's start and the final Chernobyl briefing).
- Oil investment pays its economy benefit on the following beat. Chernobyl's delayed trust cost resolves before the ending. Soviet-aligned countries have a different Moon-broadcast delta, as specified.
- Composite cabinet arguments are generated from meter tradeoffs; newspaper decks are grounded in the node's situation and consequence insights. Both are labeled reconstructed content.
- The world map depicts coastlines, not modern or period political boundaries. Natural Earth geographic data is public domain: <https://www.naturalearthdata.com/about/terms-of-use/>.

## Reachability

`REACHABILITY.json` records exact witness paths for the tested deterministic seeds and two flashpoint policies. All 20 endings can occur across the complete scenario. Eight distinct endings **per country** is incompatible with several of the supplied country scripts without major narrative expansion. The narrower country counts are recorded, not hidden. The matrix is a reproducible sample of random outcomes, not an exhaustive probability calculation.

## Historical scope

The source scripts include compressed causal interpretations and speculative downstream consequences. The in-game sources panel and debrief distinguish record from model assumptions and encourage comparison with primary documents. The scripts have not undergone a full historian's editorial review. Descriptions of authoritarian rule explain constraints and consequences; they do not endorse the regimes.
