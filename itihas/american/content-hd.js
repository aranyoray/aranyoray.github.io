/* A House Divided (1850–1877) — scenario content.
   Mirrors the Cold War flow: pick a perspective, take 8 decisions, watch the
   consequences recolor the map, reach one of 20 endings.
   Choice A on every node is historical; B and C are plausible counterfactuals.
   Facts follow the companion spec; no invented quotations. */
(function () {
  // recolor helper: r=region, dl=loyalty delta, sl=slavery status, pin=group, size, occ=occupier
  const rc = (r, o) => Object.assign({ r }, o);

  window.AH_SCENARIO = {
    id: 'house-divided',
    label: 'A House Divided',
    era: '1850 — 1877',
    blurb: 'Eight decisions between the Compromise of 1850 and the end of Reconstruction. Every choice recolors the Union.',
    meta: '20–30 MINUTES · AGES 13+',
    // global meters shown as pixel bars. UNION and FREEDOM are the two that decide the ending.
    meters: [
      { id: 'UNION', label: 'Union', help: 'One nation, secure (100) vs. permanent separation (0). Starts 60.' },
      { id: 'FREEDOM', label: 'Freedom', help: 'Legal and lived freedom for Black Americans nationwide. 8 in 1850 = ~3.2M enslaved. 100 = abolition plus enforced civil and voting rights.' }
    ],
    // per-faction "condition" bars (the user's economy / arms / power sliders).
    stats: [
      { id: 'ECON', label: 'Economy', emoji: '💰', help: 'Treasury, trade and material base — GDP per head, quality of life, ability to pay for a long war.' },
      { id: 'ARMS', label: 'Arms', emoji: '⚔️', help: 'Fighting strength — soldiers, morale, materiel in the field.' },
      { id: 'POWER', label: 'Power', emoji: '🏛️', help: 'Political capital and standing — the ability to make others act.' }
    ],
    factions: [
      { id: 'REP', name: 'Republicans / Union', seat: 'Springfield · Washington', color: '#1f4e9a', emoji: '🔵',
        tagline: 'Stop slavery’s spread. Hold the country together. Decide which matters more when you can’t.',
        stats: { ECON: 60, ARMS: 45, POWER: 35 } },
      { id: 'CSA', name: 'Southern Rights / Confederacy', seat: 'Charleston · Richmond', color: '#5e5e5e', emoji: '⬜',
        tagline: 'Build a nation on cotton and slavery — and try to make the world need you.',
        stats: { ECON: 55, ARMS: 40, POWER: 25 } },
      { id: 'KY', name: 'Kentucky', seat: 'Frankfort', color: '#5b7fa6', emoji: '🔷',
        tagline: 'The border state both sides needed and neither could take for granted.',
        stats: { ECON: 50, ARMS: 35, POWER: 40 } },
      { id: 'FRM', name: 'The Freedom Movement', seat: 'Rochester · Port Royal', color: '#f2b134', emoji: '🟡',
        tagline: 'Black abolitionists, contrabands, USCT soldiers: the people freedom was about.',
        stats: { ECON: 25, ARMS: 20, POWER: 20 } },
      { id: 'GBR', name: 'Britain', seat: 'London', color: '#8b1e3f', emoji: '🟥',
        tagline: 'The empire that abolished slavery, ran on Southern cotton, and could tip the war.',
        stats: { ECON: 70, ARMS: 65, POWER: 65 } },
      { id: 'CHR', name: 'Cherokee Nation', seat: 'Tahlequah', color: '#b5563a', emoji: '🟤',
        tagline: 'A sovereign nation removed fifteen years earlier, with its own civil war coming.',
        stats: { ECON: 30, ARMS: 25, POWER: 30 } }
    ],

    // ---- Republicans / Union, full 8-turn script ----
    nodes: {
      REP: [
        { id: 'REP_T1', turn: 1, year: '1850–52', title: 'The Price of California',
          intro: 'It’s 1850. You are the anti-slavery coalition of the North: Free Soilers, Conscience Whigs, a few Democrats who hate the Slave Power more than they love their party. You have no party of your own yet, no president, and 3.2 million people are enslaved in a country that calls itself free.',
          startMeters: { UNION: 60, FREEDOM: 8 },
          situation: 'California wants in as a free state. The South wants a new Fugitive Slave Act with federal commissioners, no jury, and a fee that pays more for "guilty." Taylor dies; Fillmore takes over. Douglas passes the Compromise in pieces. Fugitives are already being seized in Boston.',
          choices: [
            { id: 'A', label: 'Personal liberty laws', summary: 'Vote no on the Fugitive Slave Act, pass personal liberty laws, stay a coalition.', historical: true,
              meterDelta: { UNION: 4, FREEDOM: 2 }, statDelta: { POWER: 4, ARMS: 3 },
              effects: [
                { place: 'Boston, MA', region: 'MA', text: 'A vigilance committee walks Shadrach Minkins out of a courtroom (1851); Thomas Sims is marched to a ship under 300 armed men.', insight: 'Enforcing the law in public turned bystanders into abolitionists.', recolor: [rc('MA', { pin: 'FREEDOM', size: 2 })] },
                { place: 'Christiana, PA', region: 'PA', text: 'A Maryland slaveholder is killed seizing four fugitives; 38 defendants are tried for treason and acquitted.', insight: 'A law a community refuses to obey cannot be enforced by a marshal.' },
                { place: 'Montpelier, VT', region: 'VT', text: 'Vermont passes the first personal liberty law, guaranteeing habeas corpus and a jury to anyone claimed as a fugitive.', insight: 'States used their own courts to nullify a federal law — the tactic the South would later claim.' },
                { place: 'Milledgeville, GA', region: 'GA', text: 'The Georgia Platform accepts the Compromise on one condition: the North enforces the Act. Unionists win the 1851 elections across the Deep South.', insight: 'The fire-eaters lost in 1851 because the deal held; every rescue in Boston re-armed them.', recolor: [rc('GA', { dl: 5 }), rc('SC', { pin: 'FIRE_EATER', size: 1 })] },
                { place: 'Chatham, Canada', region: 'CANADA', text: 'Black emigration to Canada climbs toward 20,000; Buxton and Chatham become self-governing Black towns.', insight: 'The Act made no free state safe, so freedom moved north of the border.', recolor: [rc('CANADA', { pin: 'FREEDOM', size: 2 })] }
              ] },
            { id: 'B', label: 'Kill the Compromise', summary: 'California alone, no Fugitive Slave Act, no Texas payoff — Taylor’s plan.',
              meterDelta: { UNION: -12, FREEDOM: 3 }, statDelta: { POWER: -6, ARMS: 2 }, flags: ['SECESSION_1850'],
              effects: [
                { place: 'Nashville, TN', region: 'TN', text: 'The Southern Convention votes secession resolutions; South Carolina and Mississippi call state conventions.', insight: 'The Compromise was what gave Southern moderates something to defend.', recolor: [rc('SC', { dl: -20 }), rc('MS', { dl: -15 })] },
                { place: 'Santa Fe, NM', region: 'NM', text: 'Texas militia march on New Mexico to enforce a boundary claim; federal troops are ordered to meet them.', insight: 'The $10 million Texas payment was the quiet hinge of the whole deal.' },
                { place: 'Hartford, CT', region: 'CT', text: 'Without the Act, Stowe never writes Uncle Tom’s Cabin; abolition loses the bestseller that made it a family conversation.', insight: 'Outrage needs a target, and the Act was the best one abolition ever got.' },
                { place: 'Charleston, SC', region: 'SC', text: 'The Southern Rights ticket sweeps 1851; secession clubs form in every district.', insight: '"Nothing gained" was the best recruiting line the fire-eaters ever had.', recolor: [rc('SC', { pin: 'FIRE_EATER', size: 3 })] }
              ] },
            { id: 'C', label: 'Enforce the Act fully', summary: 'Declare the Compromise final — Fillmore and Webster’s line.',
              meterDelta: { UNION: 8, FREEDOM: -3 }, statDelta: { POWER: -8, ECON: 0 },
              effects: [
                { place: 'Boston, MA', region: 'MA', text: 'Sims (1851) and Anthony Burns (1854) are returned in chains; Webster’s "Seventh of March" splits the Whigs.', insight: 'Enforcing the law saved the Union in 1850 and killed the Whig Party by 1854.' },
                { place: 'Chatham, Canada', region: 'CANADA', text: 'Flight to Canada doubles; entire Black congregations leave Buffalo and Pittsburgh.', insight: 'When a free state stops being free, people vote with their feet.', recolor: [rc('CANADA', { pin: 'FREEDOM', size: 3 })] },
                { place: 'Charleston, SC', region: 'SC', text: 'Fire-eaters lose ground for a decade; Unionists hold the Deep South through 1856.', insight: 'The Slave Power’s best argument was Northern bad faith, and you took it away.', recolor: [rc('SC', { dl: 10 }), rc('MS', { dl: 10 })] },
                { place: 'Pittsburgh, PA', region: 'PA', text: 'The Free Soil vote collapses to 5% in 1852; the anti-slavery coalition loses its independent voice for four years.', insight: 'Parties that enforce laws their members hate hollow out.' }
              ] }
          ],
          lockedChoices: [
            { id: 'D', label: 'Buy out every slaveholder', summary: 'Federal purchase of all enslaved people at market value.', counterfactual: 'ECONOMIC MOONSHOT',
              requires: { ECON: 80 }, meterDelta: { FREEDOM: 50, UNION: -5 },
              effects: [{ place: 'Washington, DC', region: 'DC', text: 'Would have cost roughly $3 billion in 1850 dollars — more than three times the federal budget of the decade.', insight: 'Compensated emancipation needed a treasury the United States did not have in 1850.' }] },
            { id: 'E', label: 'Nationalize the Army around a new slavery line', summary: 'Call federal troops to the Mason–Dixon border; dare the South to secede first.', counterfactual: 'MILITARY ULTIMATUM',
              requires: { ARMS: 60, POWER: 55 }, meterDelta: { UNION: -20, FREEDOM: 4 },
              effects: [{ place: 'Baltimore, MD', region: 'MD', text: 'Taylor died before he could send troops anywhere; Fillmore had neither the army nor the mandate.', insight: 'The Union of 1850 had 10,000 regulars; the Compromise bought time to build the one that fought in 1861.' }] }
          ] },

        { id: 'REP_T2', turn: 2, year: '1854–56', title: 'Bleeding Kansas',
          situation: 'Douglas’s Kansas-Nebraska Act repeals the Missouri Compromise and lets settlers vote on slavery. Anti-Nebraska meetings are fusing Whigs, Free Soilers and Democrats into something new. The Know-Nothings just swept Massachusetts. Missourians are crossing into Kansas to vote; New England rifles are following.',
          choices: [
            { id: 'A', label: 'Build a new party', summary: 'One idea: no slavery in the territories.', historical: true,
              meterDelta: { UNION: -2, FREEDOM: 2 }, statDelta: { POWER: 10, ARMS: 6 },
              effects: [
                { place: 'Jackson, MI', region: 'MI', text: '"Under the oaks," July 1854, the Republican Party takes its name; by 1856 it holds the House.', insight: 'Single-issue parties win when the issue is the only thing voters can see.', recolor: [rc('MI', { pin: 'RADICAL', size: 2 }), rc('WI', { pin: 'RADICAL', size: 2 })] },
                { place: 'Lawrence, KS', region: 'KS', text: 'The Emigrant Aid Company plants a free-state town; in May 1856 a pro-slavery posse sacks it.', insight: '"Popular sovereignty" meant whoever showed up with more men.', recolor: [rc('KS', { pin: 'RADICAL', size: 2 }), rc('KS', { pin: 'FIRE_EATER', size: 2 })] },
                { place: 'Philadelphia, PA', region: 'PA', text: 'Frémont is nominated on "Free Soil, Free Labor, Free Men" and carries 11 of 16 free states.', insight: 'A sectional party could win the presidency without a single Southern vote.', recolor: [rc('PA', { dl: 5 }), rc('NY', { dl: 5 })] },
                { place: 'Washington, DC', region: 'DC', text: 'Buchanan wins on Pennsylvania and Indiana; Kansas has two governments and one is fraudulent.', insight: 'The fight moved from Congress to the territory, and from ballots to rifles.' }
              ] },
            { id: 'B', label: 'Fuse with the Know-Nothings', summary: 'An anti-slavery, anti-immigrant majority.',
              meterDelta: { UNION: -3, FREEDOM: 1 }, statDelta: { POWER: 4 }, flags: ['KNOW_NOTHING_ALLIANCE'],
              effects: [
                { place: 'Louisville, KY', region: 'KY', text: '"Bloody Monday," Aug 1855: nativist mobs attack Irish and German neighborhoods, 22 dead.', insight: 'The coalition you joined had a body count before you signed.', recolor: [rc('KY', { pin: 'COPPERHEAD', size: 2 })] },
                { place: 'Cincinnati, OH', region: 'OH', text: 'German voters, the most anti-slavery immigrants in America, walk to the Democrats.', insight: 'You traded the North’s most reliable abolitionists for its least.', recolor: [rc('OH', { pin: 'IMMIGRANT', size: 2 })] },
                { place: 'Springfield, IL', region: 'IL', text: 'Lincoln refuses to join a party that reads "all men are created equal, except negroes, and foreigners, and catholics." The Illinois party splits.', insight: 'A coalition’s principles are set by its narrowest member.' },
                { place: 'Lawrence, KS', region: 'KS', text: 'Emigrant Aid money dries up as donors turn to nativist causes; Kansas leans slave through 1857.', insight: 'Attention is a budget.', recolor: [rc('KS', { dl: -10 })] }
              ] },
            { id: 'C', label: 'Make Kansas the whole war', summary: 'Fund and arm free-state settlers at ten times the scale.',
              meterDelta: { UNION: -8, FREEDOM: 2 }, statDelta: { ARMS: 4, ECON: -8 }, flags: ['KANSAS_FREE'],
              effects: [
                { place: 'Lawrence, KS', region: 'KS', text: 'Five thousand armed free-staters hold the town; the "sack" becomes a pitched battle with 400 dead.', insight: 'Escalation on both sides turned a political contest into the first battle of the war.', recolor: [rc('KS', { dl: 15 }), rc('KS', { pin: 'RADICAL', size: 3 })] },
                { place: 'Westport, MO', region: 'MO', text: 'Senator Atchison raises a Missouri state army; the border is a front line by 1856.', insight: 'A state cannot arm one side of a neighbor’s fight without becoming a belligerent.', recolor: [rc('MO', { dl: -10 }), rc('MO', { pin: 'FIRE_EATER', size: 2 })] },
                { place: 'Osawatomie, KS', region: 'KS', text: 'John Brown, better armed, fights a longer guerrilla campaign and leaves for the East with a bigger name and a bigger plan.', insight: 'The men you fund do not stop when you do.' }
              ] }
          ] },

        { id: 'REP_T3', turn: 3, year: '1857–59', title: 'A House Divided',
          situation: 'The Court has ruled in Dred Scott that Black Americans "had no rights which the white man was bound to respect" and Congress cannot ban slavery anywhere. The Panic of 1857 hit the North hardest. Douglas has broken with Buchanan over Lecompton. Then, in October 1859, John Brown seizes the arsenal at Harpers Ferry.',
          choices: [
            { id: 'A', label: 'Denounce the Court, disown Brown', summary: 'Run on containment.', historical: true,
              meterDelta: { UNION: -3, FREEDOM: 1 }, statDelta: { POWER: 8 },
              effects: [
                { place: 'Springfield, IL', region: 'IL', text: '"A house divided against itself cannot stand." Lincoln loses the Senate race and wins a national audience.', insight: 'A state race became the country’s argument.' },
                { place: 'Richmond, VA', region: 'VA', text: 'After Harpers Ferry, Virginia’s militia doubles and every Southern state assumes Republicans mean insurrection.', insight: 'Brown made your denials irrelevant; the South heard the church bells, not the disclaimers.', recolor: [rc('VA', { dl: -10 }), rc('VA', { pin: 'FIRE_EATER', size: 2 })] },
                { place: 'Concord, MA', region: 'MA', text: 'Emerson calls Brown a saint; the North splits between disowning him and canonizing him.', insight: 'A movement’s martyrs are chosen by its enemies as much as its friends.' },
                { place: 'Rochester, NY', region: 'NY', text: 'Seward’s "irrepressible conflict" makes him the frontrunner and too radical for Pennsylvania; Lincoln takes the nomination.', insight: 'The party chose the man least likely to frighten the border.', recolor: [rc('NY', { pin: 'RADICAL', size: 3 })] }
              ] },
            { id: 'B', label: 'Claim Brown as a martyr', summary: 'Run on abolition in the District and territories, repeal the Fugitive Slave Act.',
              meterDelta: { UNION: -10, FREEDOM: 3 }, statDelta: { POWER: -8, ARMS: 5 }, flags: ['BROWN_MARTYR'],
              effects: [
                { place: 'Charles Town, VA', region: 'VA', text: 'Dec 1859: Northern church bells toll for Brown’s execution; the party prints his last note as a campaign card.', insight: 'A martyr recruits, and he also arms the other side.', recolor: [rc('MA', { pin: 'RADICAL', size: 3 }), rc('VA', { dl: -25 })] },
                { place: 'Baltimore, MD', region: 'MD', text: 'Border Unionists cannot defend you; Maryland’s legislature calls a sovereignty convention.', insight: 'The border needed a party it could call moderate.', recolor: [rc('MD', { dl: -15 })] },
                { place: 'Charleston, SC', region: 'SC', text: 'Secession commissioners tour in 1859; South Carolina votes to leave on the day of any Republican victory.', insight: 'They had been waiting for an excuse and you handed them a certified one.', recolor: [rc('SC', { dl: -15 }), rc('SC', { pin: 'FIRE_EATER', size: 3 })] }
              ] },
            { id: 'C', label: 'Fuse with the Douglas Democrats', summary: 'Behind popular sovereignty — Greeley’s idea.',
              meterDelta: { UNION: 2, FREEDOM: -2 }, statDelta: { POWER: -8 }, flags: ['DEMOCRATS_UNITED'],
              effects: [
                { place: 'Freeport, IL', region: 'IL', text: 'No Lincoln-Douglas debates; the Freeport Doctrine becomes the fusion platform. Lincoln stays a railroad lawyer.', insight: 'The coalition surrendered the one idea that made it a party.' },
                { place: 'Boston, MA', region: 'MA', text: 'Radicals bolt to a new abolition party; the coalition shrinks to its center.', insight: 'Fusion with your rival costs you your base.', recolor: [rc('MA', { rmpin: 'RADICAL' })] },
                { place: 'Charleston, SC', region: 'SC', text: 'The Deep South rejects popular sovereignty and demands a federal slave code; the 1860 convention splits on the same line.', insight: 'The fire-eaters were not negotiating with Douglas either.' }
              ] }
          ] },

        { id: 'REP_T4', turn: 4, year: '1860–61', title: 'The Wayward Sisters',
          situation: 'Lincoln won with 39.8% and not one Southern electoral vote. South Carolina left Dec 20; six more by Feb 1; a Confederate government sits in Montgomery. Crittenden offers to extend the 36°30′ line to the Pacific, forever. Greeley says let the erring sisters go. Fort Sumter has six weeks of food.',
          choices: [
            { id: 'A', label: 'No compromise; resupply Sumter', summary: 'Call 75,000 militia; hold the border by force and finesse.', historical: true,
              meterDelta: { UNION: -15, FREEDOM: 2 }, statDelta: { ARMS: 12, ECON: -10, POWER: 6 },
              effects: [
                { place: 'Charleston, SC', region: 'SC', text: 'April 12, 4:30 a.m.: Confederate guns open on Sumter. No one dies in the bombardment; 750,000 will die in the war. The North unites overnight.', insight: 'Lincoln made the Confederacy fire first.', recolor: [rc('SC', { dl: -35 }), rc('MS', { dl: -35 }), rc('FL', { dl: -35 }), rc('AL', { dl: -35 }), rc('GA', { dl: -35 }), rc('LA', { dl: -35 }), rc('TX', { dl: -35 }), rc('VA', { dl: -25 }), rc('AR', { dl: -25 }), rc('NC', { dl: -25 }), rc('TN', { dl: -25 })] },
                { place: 'Baltimore, MD', region: 'MD', text: 'A mob attacks the 6th Massachusetts; troops occupy Federal Hill; Lincoln suspends habeas corpus and ignores Taney.', insight: 'Maryland stayed in the Union because the Union did not let it choose.', recolor: [rc('MD', { dl: 15, occ: 'USA' })] },
                { place: 'Frankfort, KY', region: 'KY', text: 'Kentucky declares neutrality May 20. Lincoln: he hopes to have God on his side but must have Kentucky.', insight: 'The Ohio River and 225,000 enslaved people were the war’s balance point.', recolor: [rc('KY', { setl: 50 })] },
                { place: 'St. Louis, MO', region: 'MO', text: 'Captain Lyon seizes the pro-secession militia at Camp Jackson; Missouri’s German regiments hold the state.', insight: 'Immigrants who fled 1848 knew what a coup looked like.', recolor: [rc('MO', { dl: 15, pin: 'BORDER_UNIONIST', size: 3 })] }
              ] },
            { id: 'B', label: 'Accept the Crittenden Compromise', summary: '36°30′ to the Pacific, unamendable.',
              meterDelta: { UNION: 6, FREEDOM: -4 }, statDelta: { POWER: -10 }, flags: ['CRITTENDEN'],
              effects: [
                { place: 'Montgomery, AL', region: 'AL', text: 'The seven Deep South states are gone and stay gone; the compromise holds Virginia, NC and Tennessee for now.', insight: 'The Deep South seceded against the future, not against a line.', recolor: [rc('VA', { dl: 15 }), rc('NC', { dl: 15 }), rc('TN', { dl: 15 }), rc('AR', { dl: 15 })] },
                { place: 'Havana, Cuba', region: 'CUB', text: '"Hereafter acquired" territory south of the line is open to slavery; filibuster companies for Cuba organize in New Orleans.', insight: 'This clause is why Lincoln refused the deal.' },
                { place: 'Washington, DC', region: 'DC', text: 'Two nations negotiate customs, the Mississippi, and fugitive returns; every session is a new crisis.', insight: 'Separation without settlement is a cold war with a shared river.', recolor: [rc('DC', { setl: 40 })] }
              ] },
            { id: 'C', label: 'Let the erring sisters go', summary: 'Recognize separation, negotiate a treaty.',
              meterDelta: { UNION: -45, FREEDOM: -6 }, statDelta: { ECON: 4, POWER: -15 }, flags: ['PEACEFUL_SEPARATION'],
              effects: [
                { place: 'Montgomery, AL', region: 'AL', text: 'The Confederacy is recognized in spring 1861; Virginia, Tennessee and Arkansas join by summer.', insight: 'Without coercion there was no reason to stay.', recolor: [rc('SC', { setl: 8 }), rc('GA', { setl: 8 }), rc('AL', { setl: 8 }), rc('MS', { setl: 8 }), rc('LA', { setl: 8 }), rc('FL', { setl: 8 }), rc('TX', { setl: 8 }), rc('VA', { setl: 8 }), rc('TN', { setl: 8 }), rc('AR', { setl: 8 }), rc('NC', { setl: 8 })] },
                { place: 'New Orleans, LA', region: 'LA', text: 'The Confederacy sets tolls on the Mississippi; Ohio valley farmers demand a war the president has refused.', insight: 'The Northwest’s economy ran through a river now in foreign hands.' },
                { place: 'Fort Monroe, VA', region: 'VA', text: 'No Union lines, no contrabands, no self-emancipation. Slavery expands into the new Confederate West.', insight: 'The war was the thing that made emancipation possible.', roll: { flag: 'RICHMOND_1862', pct: 0 } }
              ] }
          ],
          lockedChoices: [
            { id: 'D', label: 'Invade the Deep South in April 1861', summary: 'Full invasion the moment Sumter falls — no three-month call.', counterfactual: 'ALL-IN WAR',
              requires: { ARMS: 55 }, meterDelta: { UNION: -5, FREEDOM: 6 },
              effects: [{ place: 'Charleston, SC', region: 'SC', text: 'The regular army was 16,000 men and most of its officers resigned to join the Confederacy in April.', insight: 'The Union Army of 1865 took four years to build; it did not exist in April 1861.' }] },
            { id: 'E', label: 'Impeach Buchanan’s legacy appointees', summary: 'Purge the War Department, Navy, Supreme Court; take the whole federal machine.', counterfactual: 'POLITICAL COUP',
              requires: { POWER: 65 }, meterDelta: { UNION: 2, FREEDOM: 4 },
              effects: [{ place: 'Washington, DC', region: 'DC', text: 'Lincoln had 39.8% of the vote and no congressional majority for radical action in his first weeks.', insight: 'Legitimacy was the one thing the new administration could not spend.' }] }
          ] },

        { id: 'REP_T5', turn: 5, year: '1862', title: 'The Bloodiest Day',
          situation: 'Shiloh cost 23,000 casualties in two days. McClellan’s Peninsula campaign failed; Lee is marching into Maryland. Enslaved people walk into Union lines by the thousands. Greeley demands emancipation; Kentucky says it will secede if you try. In Minnesota, the Dakota have risen. On Sept 17, Lee is stopped at Antietam.',
          choices: [
            { id: 'A', label: 'Preliminary Emancipation', summary: 'After Antietam, border states exempt; fire McClellan; commute 265 of 303 Dakota sentences.', historical: true,
              meterDelta: { UNION: 4, FREEDOM: 18 }, statDelta: { ARMS: 4, POWER: -6 },
              effects: [
                { place: 'Sharpsburg, MD', region: 'MD', text: '22,700 casualties in twelve hours; Lee retreats; five days later Lincoln announces that on Jan 1 the enslaved in rebel areas "shall be then, thenceforward, and forever free."', insight: 'He needed a victory first, or the world would read it as a scream of desperation.', recolor: [rc('MD', { occ: null })] },
                { place: 'London, UK', region: 'GBR', text: 'The cabinet reads the Proclamation and Antietam; mediation is shelved.', insight: 'Britain could not recognize a slaveholding republic against a nation that had just declared abolition a war aim.' },
                { place: 'Port Royal, SC', region: 'SC', text: 'Jan 1, 1863, at Camp Saxton, the Proclamation is read to thousands of freedpeople; the Sea Islands are the first place it applies.', insight: 'Emancipation was enforced where the army stood; the map turns gold from the coast inward.', recolor: [rc('SC', { sl: 'SELF_EMANCIPATING', pin: 'FREEDOM', size: 3 })] },
                { place: 'Mankato, MN', region: 'MN', text: 'Dec 26: 38 Dakota men are hanged in the largest mass execution in US history; Lincoln reduced 303 to 38. The Dakota are expelled from Minnesota.', insight: 'The same president signed emancipation and the largest execution; the war for freedom did not include the West.', recolor: [rc('MN', { pin: 'NATIVE', size: 2 })] }
              ] },
            { id: 'B', label: 'War for the Union only', summary: 'No Proclamation, keep McClellan, return fugitives as the border demands.',
              meterDelta: { UNION: 0, FREEDOM: -5 }, statDelta: { ARMS: -3 }, flags: ['NO_EMANCIPATION', 'BRITISH_MEDIATION'],
              effects: [
                { place: 'London, UK', region: 'GBR', text: 'With no moral difference between the sides, Palmerston’s cabinet takes up Russell’s mediation proposal.', insight: 'Britain’s anti-slavery public was the Union’s only lobby, and you gave it nothing to say.' },
                { place: 'Fort Monroe, VA', region: 'VA', text: 'Butler’s "contraband" policy is reversed; fugitives are turned back at the picket line.', insight: 'The army had been freeing people for a year without orders; the orders now say stop.', recolor: [rc('VA', { sl: 'SLAVE' })] },
                { place: 'Richmond, VA', region: 'VA', text: 'Davis’s cabinet celebrates: the Confederacy keeps its labor force in the fields and its armies in the field.', insight: 'Four million enslaved people were the South’s logistics corps; leaving them there lengthened the war.' }
              ] },
            { id: 'C', label: 'Immediate universal emancipation', summary: 'April, border states included; enlist Black soldiers now.',
              meterDelta: { UNION: -10, FREEDOM: 25 }, statDelta: { ARMS: 6, POWER: -12 }, flags: ['EARLY_EMANCIPATION', 'ARMED_BLACKS_EARLY'],
              effects: [
                { place: 'Frankfort, KY', region: 'KY', text: 'The legislature votes to secede; the Home Guard splits; Louisville is a war zone.', insight: 'Kentucky’s Unionism had a condition, and you broke it.', recolor: [rc('KY', { dl: -30 })], roll: { flag: 'KENTUCKY_CSA', pct: 40 } },
                { place: 'Manchester, UK', region: 'GBR', text: 'Lancashire mill workers, jobless from the cotton famine, hold mass meetings for the Union anyway.', insight: 'British workers saw the war as theirs once it was plainly about slavery.' },
                { place: 'Port Royal, SC', region: 'SC', text: 'Hunter’s Black regiment, disbanded historically, takes the field; the first USCT fight in summer 1862.', insight: '180,000 men who would serve by 1865 could have served a year earlier.', recolor: [rc('SC', { pin: 'FREEDOM', size: 2 })] }
              ] }
          ] },

        { id: 'REP_T6', turn: 6, year: '1863', title: 'Four Score',
          situation: 'The Proclamation is in force. The first federal draft is law, with a $300 exemption the poor cannot pay. Lee crushed Hooker at Chancellorsville and is heading north. Grant is besieging Vicksburg. The 54th Massachusetts marches through Boston. Peace Democrats say the war is a failure and Ohio is about to vote on it.',
          choices: [
            { id: 'A', label: 'Enforce the draft; recruit Black soldiers', summary: 'Promote Grant; offer the Ten Percent Plan.', historical: true,
              meterDelta: { UNION: 10, FREEDOM: 8 }, statDelta: { ARMS: 8, ECON: -8, POWER: 6 },
              effects: [
                { place: 'Gettysburg, PA', region: 'PA', text: 'July 3: Pickett’s charge fails. July 4: Vicksburg surrenders; the Mississippi is open and Lee never invades again.', insight: 'Two victories in two days ended the Confederacy’s chance of winning on the battlefield.', recolor: [rc('MS', { occ: 'USA', dl: 6 }), rc('PA', { occ: null })] },
                { place: 'Manhattan, NY', region: 'NY', text: 'July 13–16: the draft riots; ~120 dead, the Colored Orphan Asylum burned. Troops from Gettysburg restore order.', insight: 'The war’s class and race resentments exploded in the city that had funded the cotton trade.', recolor: [rc('NY', { pin: 'COPPERHEAD', size: 3 })] },
                { place: 'Fort Wagner, SC', region: 'SC', text: 'July 18: the 54th Massachusetts loses 272 of 600 in the assault; recruiting offices fill.', insight: 'The charge answered whether Black men would fight, and the answer changed the war.', recolor: [rc('SC', { pin: 'FREEDOM', size: 3 })] },
                { place: 'Wheeling, WV', region: 'WV', text: 'June 20: West Virginia is a state, carved from Virginia by Unionists.', insight: 'The Union used secession’s own logic against Virginia.', recolor: [rc('WV', { setl: 85, sl: 'ABOLISHED' })] }
              ] },
            { id: 'B', label: 'Accept an armistice', summary: 'Suspend the draft; a peace convention with the Copperheads.',
              meterDelta: { UNION: -20, FREEDOM: -6 }, statDelta: { ARMS: -6, ECON: 6 }, flags: ['ARMISTICE_1863'],
              effects: [
                { place: 'Niagara Falls, NY', region: 'NY', text: 'Confederate commissioners arrive; the armistice is de facto recognition.', insight: 'You cannot negotiate with a government without admitting it is one.' },
                { place: 'Columbus, OH', region: 'OH', text: 'Vallandigham returns from exile and wins the governorship by 100,000 votes.', insight: 'A peace policy makes peace candidates look like prophets.', recolor: [rc('OH', { dl: -20, pin: 'COPPERHEAD', size: 3 })] },
                { place: 'Port Royal, SC', region: 'SC', text: 'The Proclamation is frozen; freedpeople in Union camps wait to learn if they will be returned.', insight: 'Freedom that depends on a war’s continuation is hostage to the peace.', recolor: [rc('SC', { sl: 'SLAVE', pin: 'FREEDOM', size: 1 })] }
              ] },
            { id: 'C', label: 'Redistribute rebel land now', summary: 'Confiscate plantations for freedpeople under the Second Confiscation Act.',
              meterDelta: { UNION: 2, FREEDOM: 10 }, statDelta: { ECON: -6, POWER: -8 }, flags: ['LAND_REDISTRIBUTION'],
              effects: [
                { place: 'Port Royal, SC', region: 'SC', text: 'The 1863 land auctions go to freedpeople at preemption prices; Sea Island families own their fields.', insight: 'Land was the difference between freedom and a new dependency.', recolor: [rc('SC', { sl: 'ABOLISHED', pin: 'FREEDOM', size: 3 })] },
                { place: 'Davis Bend, MS', region: 'MS', text: 'Jefferson Davis’s brother’s plantation becomes a freedmen’s colony run by its former workers.', insight: 'The experiment worked when it was allowed to.' },
                { place: 'Richmond, VA', region: 'VA', text: 'Desertion drops; "they’ll take everything" is the best recruiting line the Confederacy ever had.', insight: 'Total war aims produce total resistance.' }
              ] }
          ] },

        { id: 'REP_T7', turn: 7, year: '1864', title: 'The Blind Memorandum',
          situation: 'Grant’s Overland campaign has cost 55,000 casualties and stalled at Petersburg. Early’s raiders reached Washington. Lincoln writes a sealed note: "it seems exceedingly probable that this Administration will not be re-elected." The Democrats are about to nominate McClellan on a platform calling the war a failure. Sherman is outside Atlanta.',
          choices: [
            { id: 'A', label: 'Hold the line; take Atlanta', summary: 'Run with Andrew Johnson; let Sherman march to the sea.', historical: true,
              meterDelta: { UNION: 12, FREEDOM: 6 }, statDelta: { ARMS: 10, POWER: 10 },
              effects: [
                { place: 'Atlanta, GA', region: 'GA', text: 'Sept 2: "Atlanta is ours, and fairly won." The election turns in a day.', insight: 'Voters will support a war they believe is being won.', recolor: [rc('GA', { occ: 'USA' })] },
                { place: 'Savannah, GA', region: 'GA', text: 'Sherman’s 60,000 cut a 60-mile-wide path to the sea; 20,000 freedpeople follow the army.', insight: 'The March destroyed the Confederacy’s will and its railroads, and freed everyone in its path.', recolor: [rc('GA', { sl: 'SELF_EMANCIPATING', dl: 8 })] },
                { place: 'Washington, DC', region: 'DC', text: 'Nov 8: Lincoln wins 55%, 212 electoral votes, 78% of the soldier vote. The wartime election goes ahead on schedule.', insight: 'Postponing it would have meant the rebellion had already won something.' },
                { place: 'Winchester, VA', region: 'VA', text: 'Sheridan burns the Shenandoah so a crow flying over it would need to carry rations.', insight: 'Hard war ended the war faster and made the peace harder.', recolor: [rc('VA', { occ: 'USA', dl: 8 })] }
              ] },
            { id: 'B', label: 'Step aside for a Radical ticket', summary: 'Frémont or Chase on immediate abolition and Black suffrage.',
              meterDelta: { UNION: -6, FREEDOM: 4 }, statDelta: { POWER: -12, ARMS: -4 }, flags: ['RADICAL_TICKET_1864'],
              effects: [
                { place: 'Cleveland, OH', region: 'OH', text: 'The Radical Democracy ticket runs on suffrage and confiscation.', insight: 'The platform was right and the electorate was not there yet.' },
                { place: 'Atlanta, GA', region: 'GA', text: 'Falls anyway on Sept 2; Sherman does not vote.', insight: 'The army’s victories did not depend on who was at the top of the ticket.', recolor: [rc('GA', { occ: 'USA' })], roll: { flag: 'MCCLELLAN_1864', pct: 50 } }
              ] },
            { id: 'C', label: 'Negotiate at Niagara', summary: 'Test the Confederate agents Greeley is talking to.',
              meterDelta: { UNION: -14, FREEDOM: -4 }, statDelta: { POWER: -8 }, flags: ['MCCLELLAN_1864'],
              effects: [
                { place: 'Niagara Falls, NY', region: 'NY', text: 'The talks collapse over Confederate independence; the "To Whom It May Concern" letter demands abolition and Union.', insight: 'There was no deal to be had short of one side’s surrender.' },
                { place: 'Chicago, IL', region: 'IL', text: 'The Democratic convention declares the war a failure the week before Atlanta falls.', insight: 'Timing is a strategy, and theirs was wrong by six days.', recolor: [rc('IL', { pin: 'COPPERHEAD', size: 2 })] }
              ] }
          ] },

        { id: 'REP_T8', turn: 8, year: '1865–77', title: 'The Unfinished Revolution',
          situation: 'Lee surrendered April 9. Lincoln was shot April 14. President Johnson is pardoning ex-Confederates by the thousand. Southern legislatures are passing Black Codes that make unemployment a crime. In Memphis and New Orleans, white mobs and police have killed dozens of Black citizens. Congress must decide what the war was for.',
          choices: [
            { id: 'A', label: 'Congressional Reconstruction', summary: 'Military districts, the 14th and 15th Amendments, then the bargain of 1877.', historical: true,
              meterDelta: { UNION: 15, FREEDOM: 15 }, statDelta: { POWER: -4, ECON: -6 },
              effects: [
                { place: 'Memphis, TN', region: 'TN', text: 'May 1866: police and mobs kill 46 Black residents and burn schools; New Orleans follows in July. Congress overrides Johnson.', insight: 'The massacres made Reconstruction a congressional cause.', recolor: [rc('TN', { occ: 'USA' }), rc('LA', { occ: 'USA' })] },
                { place: 'Columbia, SC', region: 'SC', text: 'A Black-majority legislature writes South Carolina’s first public school law; ~2,000 Black men hold office across the South.', insight: 'For eight years the South was the most democratic region in America.', recolor: [rc('SC', { sl: 'ABOLISHED', dl: 20, pin: 'FREEDOM', size: 3 }), rc('MS', { sl: 'ABOLISHED', dl: 20 }), rc('GA', { sl: 'ABOLISHED', dl: 20 }), rc('AL', { sl: 'ABOLISHED', dl: 20 }), rc('LA', { sl: 'ABOLISHED', dl: 20 }), rc('VA', { sl: 'ABOLISHED', dl: 20 }), rc('NC', { sl: 'ABOLISHED', dl: 20 }), rc('AR', { sl: 'ABOLISHED', dl: 20 }), rc('TX', { sl: 'ABOLISHED', dl: 20 }), rc('FL', { sl: 'ABOLISHED', dl: 20 }), rc('TN', { sl: 'ABOLISHED', dl: 20 })] },
                { place: 'Colfax, LA', region: 'LA', text: 'Easter 1873: white paramilitaries kill 60 to 150 Black men defending the courthouse; the Court in Cruikshank voids the convictions.', insight: 'Without federal enforcement, the vote was defended only by the people who held it.' },
                { place: 'Washington, DC', region: 'DC', text: 'Feb 1877, Wormley’s Hotel: the last troops leave the South; Hayes is president; the Redeemers govern for ninety years.', insight: 'The 15th Amendment stayed in the Constitution and out of practice until 1965.', recolor: [rc('SC', { setl: 35 }), rc('MS', { setl: 35 }), rc('GA', { setl: 35 }), rc('AL', { setl: 35 }), rc('LA', { setl: 35 })] }
              ] },
            { id: 'B', label: 'Hold Radical Reconstruction', summary: 'Troops, land, marshals — no bargain in 1877.',
              meterDelta: { UNION: 6, FREEDOM: 30 }, statDelta: { ECON: -14, POWER: -10 }, flags: ['RADICAL_RECON_HOLDS'],
              effects: [
                { place: 'Columbia, SC', region: 'SC', text: 'The Black-majority legislature governs into the 1890s; schools and land-grant colleges are funded for everyone.', insight: 'Reconstruction worked where it was defended.', recolor: [rc('SC', { sl: 'ABOLISHED', setl: 75, pin: 'FREEDOM', size: 3 }), rc('MS', { sl: 'ABOLISHED', setl: 75 }), rc('LA', { sl: 'ABOLISHED', setl: 75 }), rc('GA', { sl: 'ABOLISHED', setl: 70 }), rc('AL', { sl: 'ABOLISHED', setl: 70 }), rc('VA', { sl: 'ABOLISHED', setl: 70 }), rc('NC', { sl: 'ABOLISHED', setl: 70 }), rc('TN', { sl: 'ABOLISHED', setl: 70 }), rc('AR', { sl: 'ABOLISHED', setl: 70 }), rc('TX', { sl: 'ABOLISHED', setl: 70 }), rc('FL', { sl: 'ABOLISHED', setl: 70 })] },
                { place: 'Washington, DC', region: 'DC', text: 'The Enforcement Acts stay funded; marshals police elections; Klan prosecutions continue past 1872.', insight: 'The vote was protected by the same tool that won the war.' },
                { place: 'Beaufort, SC', region: 'SC', text: 'Robert Smalls’s district elects Black congressmen into the 20th century.', insight: 'The Redemption that ended Black officeholding needed federal absence to work.' }
              ] },
            { id: 'C', label: 'Let Johnson’s plan stand', summary: 'Pardons, no Black suffrage, Southern states readmitted by 1866.',
              meterDelta: { UNION: 8, FREEDOM: 8 }, statDelta: { ECON: 8, POWER: -8 }, flags: ['LENIENT_RECON'],
              effects: [
                { place: 'Jackson, MS', region: 'MS', text: 'The 1865 Black Codes stand: vagrancy arrests, labor contracts enforced by whipping, no right to testify.', insight: 'Slavery was abolished and rebuilt under another name in twelve months.', recolor: [rc('MS', { sl: 'ABOLISHED', dl: 5 }), rc('SC', { sl: 'ABOLISHED', dl: 5 }), rc('GA', { sl: 'ABOLISHED', dl: 5 }), rc('AL', { sl: 'ABOLISHED', dl: 5 }), rc('LA', { sl: 'ABOLISHED', dl: 5 })] },
                { place: 'Washington, DC', region: 'DC', text: 'Ex-Confederate generals and Alexander Stephens take seats in Congress; the end of three-fifths gives the South more seats than before the war.', insight: 'Emancipation without suffrage made the South politically stronger.' },
                { place: 'Beaufort, SC', region: 'SC', text: 'Sherman’s Field Order 15 land grants are revoked; freedpeople are evicted at bayonet point in late 1865.', insight: '"Forty acres" was a wartime order, not a law.' }
              ] }
          ] }
      ]
    },

    flashpoints: [
      { after: 1, year: '1852', title: 'Uncle Tom’s Cabin sells 300,000 copies in a year', region: 'CT',
        options: [
          { label: 'Distribute it', meterDelta: { FREEDOM: 2 }, note: 'Morale +2 North.', recolor: [{ r: 'CT', pin: 'RADICAL', size: 1 }] },
          { label: 'Answer with your own press', statDelta: { POWER: 2 }, note: 'Richmond prints "anti-Tom" novels.', recolor: [{ r: 'VA', pin: 'FIRE_EATER', size: 1 }] }
        ] },
      { after: 2, year: '1856', title: 'Brooks canes Sumner on the Senate floor', region: 'DC',
        options: [
          { label: 'Condemn it', statDelta: { POWER: 3 }, note: 'Political capital +3 North.', recolor: [{ r: 'DC', pin: 'RADICAL', size: 1 }] },
          { label: 'Send Brooks a new cane', meterDelta: { UNION: -4 }, note: 'The real Southern response; morale +3 South.', recolor: [{ r: 'SC', pin: 'FIRE_EATER', size: 1 }] }
        ] },
      { after: 3, year: '1858', title: 'The Lincoln-Douglas debates', region: 'IL',
        options: [
          { label: 'Publish the transcripts nationally', statDelta: { POWER: 3 }, note: 'A state race becomes the country’s argument.', recolor: [{ r: 'IL', pin: 'RADICAL', size: 1 }] },
          { label: 'Ignore a state race', note: 'The transcripts travel anyway.' }
        ] },
      { after: 4, year: 'Nov 1861', title: 'Trent Affair: a US warship seizes two Confederate envoys from a British steamer', region: 'GBR',
        options: [
          { label: 'Release the envoys', meterDelta: { UNION: 3 }, note: 'Britain’s standing +4; "one war at a time."' },
          { label: 'Keep them', flags: ['BRITISH_WAR'], roll: { flag: 'BRITISH_WAR', pct: 25 }, note: '11,000 British troops embark for Canada.', recolor: [{ r: 'CANADA', pin: 'BRITISH', size: 2 }] }
        ] },
      { after: 5, cutscene: true, year: 'May 1862', title: 'Robert Smalls steers the steamer Planter past Confederate guns and hands it to the Union navy', region: 'SC',
        meterDelta: { FREEDOM: 3 }, note: 'He sits in Congress within twelve years.', recolor: [{ r: 'SC', pin: 'FREEDOM', size: 2 }] },
      { after: 6, year: 'July 1863', title: 'New York draft riots: four days, ~120 dead, the Colored Orphan Asylum burned', region: 'NY',
        options: [
          { label: 'Send troops from Gettysburg', note: 'Order restored; morale -2.', recolor: [{ r: 'NY', pin: 'BORDER_UNIONIST', size: 1 }] },
          { label: 'Suspend the draft in New York', statDelta: { ARMS: -3 }, note: 'Governor Seymour claims victory.', recolor: [{ r: 'NY', pin: 'COPPERHEAD', size: 2 }] }
        ] },
      { after: 7, cutscene: true, year: 'Nov 1864', title: 'Sand Creek: Colorado militia kill ~230 Cheyenne and Arapaho under a US flag and a white flag', region: 'CO',
        note: 'A congressional inquiry condemns it; no one is punished. The war for freedom in the East ran alongside a war of conquest in the West.', recolor: [{ r: 'CO', pin: 'NATIVE', size: 2 }] },
      { after: 8, cutscene: true, year: 'April 14 1865', title: 'Ford’s Theatre', region: 'DC',
        note: 'Lincoln is shot five days after Appomattox. Reconstruction passes to Andrew Johnson.' }
    ]
  };
})();
