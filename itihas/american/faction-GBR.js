/* A House Divided (1850–1877) — Britain faction script.
   Choice A on every node is historical; B and C are plausible counterfactuals.
   Facts follow the companion spec; no invented quotations.
   Britain's per-faction meters map: Public Opinion -> ARMS, Trade -> ECON, Standing -> POWER. */
(function () {
  window.AH_SCENARIO.nodes.GBR = [

    { id: 'GBR_T1', turn: 1, year: '1850–52', title: 'The Squadron and the Mill',
      intro: 'It’s 1850. Your empire abolished slavery seventeen years ago and spends £700,000 a year hunting slave ships off Africa. Your mills in Lancashire spin cotton picked by enslaved people in Mississippi, and four million of your people eat because of it. You own Canada, which is where American fugitives run. In ten years the Americans will split, and whichever side you recognize probably wins. Your meters: Public Opinion, Trade, Standing.',
      startMeters: { UNION: 60, FREEDOM: 8 },
      situation: 'Palmerston runs the Foreign Office like a man who enjoys it. Hutt’s motion to scrap the West Africa Squadron just failed. The new American Fugitive Slave Act is sending Black families to Canada West, where your governor has said they will not be returned. You have just signed the Clayton-Bulwer Treaty promising neither you nor the US will grab Central America. Lancashire imports 80% of its cotton from the American South.',
      choices: [
        { id: 'A', label: 'Keep the squadron', summary: 'Keep the squadron; welcome fugitives in Canada; hold Clayton-Bulwer; keep buying cotton.', historical: true,
          statDelta: { ARMS: 4, ECON: 4, POWER: 2 },
          effects: [
            { place: 'Freetown, Sierra Leone', region: 'FRA', text: 'The squadron continues; by 1860 it has seized about 1,600 ships and freed 150,000 people.', insight: 'Britain’s anti-slavery policy was the one constant the American South never understood.' },
            { place: 'Chatham, Canada West', region: 'CANADA', text: 'Canada refuses extradition of anyone who escaped slavery; Black towns form along the Detroit and Niagara borders.', insight: 'the Underground Railroad had a terminus because an empire allowed it.', recolor: [{ r: 'CANADA', pin: 'FREEDOM', size: 2 }] },
            { place: 'Washington DC', region: 'DC', text: 'Clayton-Bulwer holds; when Walker seizes Nicaragua in 1856 the treaty is the ground you stand on.', insight: 'a treaty signed in 1850 decided a filibuster in 1856.' },
            { place: 'Manchester UK', region: 'GBR', text: 'Cotton imports rise toward 2.5 million bales a year.', insight: 'dependence deepened every year the price stayed low.', recolor: [{ r: 'GBR', pin: 'BRITISH', size: 3 }] },
            { place: 'Stafford House, London', region: 'GBR', text: '1853: the Duchess of Sutherland’s address against American slavery, signed by 560,000 British women, is handed to Harriet Beecher Stowe.', insight: 'British public opinion was already the Union’s ally before there was a Union to ally with.' }
          ] },
        { id: 'B', label: 'Pressure Washington', summary: 'Pressure Washington over the Fugitive Slave Act and the slave trade; declare Canada an asylum.',
          meterDelta: { UNION: -2, FREEDOM: 1 }, statDelta: { ARMS: 6, ECON: -3, POWER: 4 },
          effects: [
            { place: 'Washington DC', region: 'DC', text: 'Webster replies furiously; Democrats campaign against “British abolition” for a decade.', insight: 'foreign pressure on slavery was the South’s best argument that abolition was un-American.' },
            { place: 'Chatham, Canada West', region: 'CANADA', text: 'A declared asylum; Southern demands for an extradition treaty are refused in writing.', insight: 'what was policy became law, and law could be pointed to.', recolor: [{ r: 'CANADA', pin: 'FREEDOM', size: 3 }] },
            { place: 'Boston MA', region: 'MA', text: 'Abolitionists gain a foreign friend and a foreign liability: “British gold” is the charge.', insight: 'allies abroad cost credibility at home.' },
            { place: 'Havana, Cuba', region: 'CUB', text: 'Britain’s pressure on Spain tightens; Cuba’s slave imports fall.', insight: 'the same squadron worked on both sides of the Atlantic.' },
            { place: 'Manchester UK', region: 'GBR', text: 'Mill owners petition against provoking their supplier.', insight: 'Lancashire was Britain’s Southern lobby.' }
          ] },
        { id: 'C', label: 'Southern cotton deal', summary: 'Sign a direct cotton-supply agreement with the Southern states; cut the squadron’s budget.',
          meterDelta: { UNION: -3, FREEDOM: -2 }, statDelta: { ARMS: -8, ECON: 8, POWER: -6 },
          effects: [
            { place: 'Charleston SC', region: 'SC', text: 'A British cotton consortium; fire-eaters read it as future recognition.', insight: 'the South’s 1860 confidence was built on the belief that Britain needed it.', recolor: [{ r: 'SC', pin: 'FIRE_EATER', size: 2 }] },
            { place: 'Freetown, Sierra Leone', region: 'FRA', text: 'Hutt’s motion passes; the squadron is halved; imports to Cuba and Brazil double in the 1850s.', insight: 'the slave trade responded to enforcement, and enforcement to budgets.' },
            { place: 'Ouidah, Dahomey', region: 'FRA', text: 'The kingdom’s trade revives.', insight: 'demand on one coast is supply on another.' },
            { place: 'Washington DC', region: 'DC', text: 'Northern Whigs warn of British meddling on the wrong side.', insight: 'Britain’s leverage in America depended on being seen as anti-slavery.' },
            { place: 'Manchester UK', region: 'GBR', text: 'Cheaper cotton; a boom; a dependence that will be a famine in 1862.', insight: 'cheap now is expensive later.' }
          ] }
      ] },

    { id: 'GBR_T2', turn: 2, year: '1854–56', title: 'Crimea and Cotton',
      situation: 'You are at war with Russia and losing 20,000 men to disease. The Cotton Supply Association wants railways to India’s cotton fields before America fails you. Your consuls have been caught recruiting Americans for Crimea and Washington is expelling your minister. Walker’s filibusters threaten Belize and the Mosquito Coast. The Reciprocity Treaty with the US on Canadian trade is on the table.',
      choices: [
        { id: 'A', label: 'Fight Crimea, sign Reciprocity', summary: 'Fight Crimea; sign Reciprocity; oppose Walker quietly; ignore Kansas.', historical: true,
          statDelta: { ECON: 3, POWER: 2 },
          effects: [
            { place: 'Sevastopol', region: 'FRA', text: 'The war ends in 1856; the army’s failures produce reform at home.', insight: 'Crimea kept Britain out of American affairs at the moment America was deciding them.' },
            { place: 'Washington DC', region: 'DC', text: 'Reciprocity is signed; then Crampton is expelled over the recruiting scandal.', insight: 'trade and pride ran on separate tracks.' },
            { place: 'Greytown, Nicaragua', region: 'MEX', text: 'The navy supplies Costa Rica quietly; Walker falls in 1857.', insight: 'Britain removed a Southern empire without a shot, and the South noticed.' },
            { place: 'Bombay', region: 'FRA', text: 'The Cotton Supply Association begins lobbying for Indian cotton in 1857; it takes a decade.', insight: 'a substitute planned too late is a famine on schedule.' },
            { place: 'Manchester UK', region: 'GBR', text: 'Dependence grows.', insight: 'nobody plans for the war that has not started.' }
          ] },
        { id: 'B', label: 'Invest in Indian cotton', summary: 'Invest in Indian and Egyptian cotton now: railways, irrigation, credit.',
          statDelta: { ARMS: 2, ECON: -6, POWER: 4 },
          effects: [
            { place: 'Bombay', region: 'FRA', text: 'The rail line to the Deccan cotton fields opens in 1860 rather than 1870; Indian exports triple by 1861.', insight: 'the 1862 famine was a supply problem that could have been solved in 1855.' },
            { place: 'Cairo', region: 'FRA', text: 'Said Pasha’s Delta cotton gets British credit.', insight: 'Egypt’s cotton boom came in 1863 historically; here it comes before it is needed.' },
            { place: 'Manchester UK', region: 'GBR', text: 'Southern cotton falls to half of supply by 1861; the famine of 1862 is mild.', insight: 'King Cotton had a rival crown.' },
            { place: 'Charleston SC', region: 'SC', text: 'The South’s embargo strategy is doomed before it is tried.', insight: 'leverage is a monopoly, and you broke it.' },
            { place: 'Washington DC', region: 'DC', text: 'Union diplomats note Britain has an alternative; Seward’s 1861 confidence rises.', insight: 'what the North knew about British supply shaped how hard it pushed.' }
          ] },
        { id: 'C', label: 'Confront the US', summary: 'Confront the US over Central America and Cuba; enforce Clayton-Bulwer with the fleet.',
          meterDelta: { UNION: -3 }, statDelta: { ARMS: 2, ECON: -2, POWER: 6 },
          effects: [
            { place: 'Greytown, Nicaragua', region: 'MEX', text: 'Warships block Walker’s supplies; he falls in 1856.', insight: 'a fleet in the right harbor ends a filibuster.' },
            { place: 'Havana, Cuba', region: 'CUB', text: 'Britain warns Spain it will defend Cuba against filibusters; the Ostend Manifesto dies.', insight: 'the South’s Caribbean was a British lake.' },
            { place: 'Washington DC', region: 'DC', text: 'Pierce’s Democrats run against Britain in 1856.', insight: 'Anglophobia was the cheapest campaign in America.' },
            { place: 'Halifax NS', region: 'CANADA', text: 'The North Atlantic squadron reinforced.', insight: 'pressure needs ships behind it.' },
            { place: 'Charleston SC', region: 'SC', text: 'Blocked outward, the fire-eaters turn inward; secession talk comes sooner.', insight: 'the South’s expansion was a safety valve, and you closed it.', recolor: [{ r: 'SC', dl: -5 }] }
          ] }
      ] },

    { id: 'GBR_T3', turn: 3, year: '1857–59', title: 'Right of Search',
      situation: 'The Panic of 1857 came from New York and reached Glasgow in weeks. The Indian Rebellion has cost you a year and the Company its charter. Your cruisers off Cuba are stopping American-flagged ships to look for enslaved people and Congress is voting for a navy to stop you. The Cotton Supply Association admits India can’t replace the South for a decade. Buchanan still wants Cuba.',
      choices: [
        { id: 'A', label: 'Back down on search', summary: 'Back down on right of search; keep the squadron off Cuba by agreement; ride the cotton boom.', historical: true,
          meterDelta: { FREEDOM: -1 }, statDelta: { ECON: 6, POWER: -2 },
          effects: [
            { place: 'Havana, Cuba', region: 'CUB', text: 'Britain concedes it will not board US-flagged ships; the trade to Cuba peaks in 1859 at 30,000 people a year under American colors.', insight: 'the US flag became the slave trade’s best protection.' },
            { place: 'Washington DC', region: 'DC', text: 'Buchanan claims victory; Anglo-American calm.', insight: 'peace with the US was bought with African lives, and the ledger was kept in Havana.' },
            { place: 'Manchester UK', region: 'GBR', text: 'Record imports in 1859 and 1860, a glut that will keep the mills running into 1862.', insight: 'the South’s embargo failed because Britain had two years of cotton in warehouses.' },
            { place: 'Calcutta', region: 'FRA', text: 'The Crown takes India; cotton is not the priority.', insight: 'an empire with a mutiny does not build railways for Lancashire.' },
            { place: 'London UK', region: 'GBR', text: 'No one plans for an American war.', insight: 'Britain in 1859 could not imagine the Union breaking.' }
          ] },
        { id: 'B', label: 'Hold the line', summary: 'Hold the line on right of search; seize US-flagged slavers.',
          meterDelta: { UNION: -2, FREEDOM: 1 }, statDelta: { ARMS: 3, ECON: -4, POWER: 4 },
          effects: [
            { place: 'Havana, Cuba', region: 'CUB', text: 'A US ship is fired on; Congress votes naval appropriations; the 1858 war scare is real.', insight: 'enforcement on the high seas is a war with whoever’s flag you stop.' },
            { place: 'Washington DC', region: 'DC', text: 'Buchanan’s Southern cabinet demands war; Northern abolitionists side with Britain.', insight: 'the slave trade split the US along the same line as everything else.' },
            { place: 'Charleston SC', region: 'SC', text: 'The South marks Britain as slavery’s enemy for good; Confederate recognition will be impossible.', insight: 'the South’s 1861 hopes needed a Britain that had looked away.', recolor: [{ r: 'GBR', setl: 75 }] },
            { place: 'Lagos', region: 'FRA', text: 'Annexed in 1859, two years early.', insight: 'the trade’s African end was closed by occupation.' },
            { place: 'Manchester UK', region: 'GBR', text: 'Merchants fear an American war.', insight: 'Lancashire’s fear was the South’s leverage.' }
          ] },
        { id: 'C', label: 'Court the South', summary: 'Quiet contacts with Southern leaders: a cotton-and-recognition understanding if the Union splits.',
          meterDelta: { UNION: -4 }, statDelta: { ARMS: -3, ECON: 3, POWER: -2 },
          effects: [
            { place: 'Charleston SC', region: 'SC', text: 'The Mercury prints “Britain will recognize”; the 1860 case for secession is “King Cotton has an ally.”', insight: 'a hint in London was a promise in Charleston.', recolor: [{ r: 'SC', dl: -10, pin: 'FIRE_EATER', size: 3 }] },
            { place: 'London UK', region: 'GBR', text: 'Palmerston denies; Russell is irritated.', insight: 'unofficial contacts are official the moment they leak.' },
            { place: 'Washington DC', region: 'DC', text: 'Seward reads the reports and drafts his 1861 plan to threaten Britain.', insight: 'what you whispered in 1859 was shouted back in 1861.' },
            { place: 'Liverpool UK', region: 'GBR', text: 'Fraser, Trenholm and Co. set up the Confederate finance network two years early.', insight: 'money follows expectations.' },
            { place: 'Manchester UK', region: 'GBR', text: 'Mill owners lobby for it.', insight: 'the South’s British friends were where the cotton was.' }
          ] }
      ] },

    { id: 'GBR_T4', turn: 4, year: '1860–61', title: 'Neutrality',
      situation: 'The Prince of Wales toured America last autumn to cheering crowds. Now the Union has split and Seward is hinting that a foreign war would reunite it. The Confederacy’s commissioners are in London. Your law officers say belligerent status is required by international law. In November, a Union captain will stop the Royal Mail steamer Trent and remove two Confederate envoys by force.',
      choices: [
        { id: 'A', label: 'Proclaim neutrality', summary: 'Proclaim neutrality on May 13; grant belligerent rights; receive the commissioners unofficially.', historical: true,
          statDelta: { ECON: -4, POWER: 3 },
          effects: [
            { place: 'London UK', region: 'GBR', text: 'The Proclamation is issued the day the new US minister arrives; Adams is furious.', insight: 'recognizing a state of war was not recognizing a state, but Washington could not tell the difference for a year.' },
            { place: 'Liverpool UK', region: 'GBR', text: 'The Alabama and Florida are built under the neutrality law’s loopholes.', insight: 'belligerent rights let the Confederacy buy a navy in your shipyards.', recolor: [{ r: 'GBR', pin: 'BRITISH', size: 2 }] },
            { place: 'Halifax NS', region: 'CANADA', text: 'The Trent: 11,000 troops sail for Canada in December; Prince Albert’s last act softens the ultimatum; Lincoln releases the envoys on Dec 26.', insight: 'one war at a time, Lincoln said, and he meant it.' },
            { place: 'Charleston SC', region: 'SC', text: 'Britain accepts the blockade as effective; the law of blockade favors the Union.', insight: 'British legal doctrine, written for British navies, served the North.' },
            { place: 'Washington DC', region: 'DC', text: 'Seward’s memo proposing a foreign war to reunite the country is shelved by Lincoln.', insight: 'the most dangerous idea of 1861 died on a president’s desk.' }
          ] },
        { id: 'B', label: 'Recognize the Confederacy', summary: 'Recognize the Confederacy at once.',
          meterDelta: { UNION: -15, FREEDOM: -4 }, statDelta: { ARMS: -12, ECON: 4, POWER: -8 },
          flags: ['BRITISH_RECOGNITION', 'RAMS_SAILED', 'MAXIMILIAN_AXIS'], roll: { flag: 'BRITISH_WAR', pct: 50 },
          effects: [
            { place: 'Washington DC', region: 'DC', text: 'Seward breaks relations; privateers are commissioned against British commerce; Northern Anglophobia is total.', insight: 'recognition in 1861 was a war with the Union, and the cabinet knew it.' },
            { place: 'Richmond VA', region: 'VA', text: 'Davis’s commissioners are received as ambassadors; British ships challenge the blockade.', insight: 'recognition was the Confederacy’s whole foreign policy, and you gave it away.' },
            { place: 'Quebec', region: 'CANADA', text: 'Lincoln orders 50,000 to the border; the Fenians recruit openly.', insight: 'Canada was the hostage in every Anglo-American crisis.' },
            { place: 'Manchester UK', region: 'GBR', text: 'Workers’ meetings denounce the government; Bright and Cobden lead a Union movement.', insight: 'the government recognized a slaveholding republic against its own public.', recolor: [{ r: 'GBR', setl: 25, pin: 'BRITISH', size: 3 }] },
            { place: 'Paris', region: 'FRA', text: 'Napoleon III follows and expands the Mexico venture.', insight: 'France would go wherever Britain went first.' }
          ] },
        { id: 'C', label: 'Declare for the Union', summary: 'Declare for the Union; refuse belligerent rights; join the blockade (Bright and Cobden’s line).',
          meterDelta: { UNION: 8 }, statDelta: { ARMS: 4, ECON: -8, POWER: 6 },
          effects: [
            { place: 'London UK', region: 'GBR', text: 'Palmerston’s cabinet splits; Russell resigns; a Radical-Liberal coalition governs.', insight: 'the Union had a British party, and here it won.' },
            { place: 'Liverpool UK', region: 'GBR', text: 'No Alabama; the Confederate navy is never built.', insight: 'the loopholes closed before the ships were laid down.' },
            { place: 'Manchester UK', region: 'GBR', text: 'Workers cheer; mill owners riot.', insight: 'Lancashire was two classes with two foreign policies.', recolor: [{ r: 'GBR', setl: 85 }] },
            { place: 'Richmond VA', region: 'VA', text: 'The Confederacy’s strategy collapses; cotton diplomacy is over in a month.', insight: 'King Cotton had one court to petition.' },
            { place: 'Washington DC', region: 'DC', text: 'Seward embraces Britain; a special relationship fifty years early.', insight: 'alliances are made by who showed up in the first year.' }
          ] }
      ] },

    { id: 'GBR_T5', turn: 5, year: '1862', title: 'The Cotton Famine',
      situation: 'Half a million Lancashire workers are on relief. Gladstone has told a Newcastle audience that Jefferson Davis has made a nation. Russell has drafted a mediation proposal and France wants to sign. Lee is in Maryland. The Alabama has sailed from Liverpool and is sinking Union merchant ships. In October, news of Antietam and the Emancipation Proclamation arrives together.',
      choices: [
        { id: 'A', label: 'Consider, then back off', summary: 'Consider mediation; back off after Antietam and the Proclamation.', historical: true,
          meterDelta: { UNION: 2 }, statDelta: { ARMS: -4, ECON: -10, POWER: 2 },
          effects: [
            { place: 'Newcastle UK', region: 'GBR', text: 'Gladstone’s speech embarrasses the cabinet; Palmerston writes that they must wait.', insight: 'the Chancellor of the Exchequer spoke before the cabinet had decided, and the cabinet decided the other way.' },
            { place: 'London UK', region: 'GBR', text: 'Oct 23 and Nov 11: Palmerston and Lewis kill mediation.', insight: 'the Union’s greatest diplomatic victory was decided by two men who did not want a war.', recolor: [{ r: 'GBR', setl: 55 }] },
            { place: 'Manchester UK', region: 'GBR', text: 'Dec 31: the Free Trade Hall meeting backs Lincoln; he writes to thank the workers in January.', insight: 'the people the famine hurt most were the ones who refused to be its argument.', recolor: [{ r: 'GBR', pin: 'BRITISH', size: 3 }] },
            { place: 'Liverpool UK', region: 'GBR', text: 'The Alabama sinks 65 merchant ships; the claims will cost £3 million in 1872.', insight: 'what a neutral lets sail, a neutral pays for.' },
            { place: 'Rochdale UK', region: 'GBR', text: 'Relief committees; the Poor Law strained; the Public Works Act of 1863.', insight: 'the famine built British welfare law as much as American policy.' }
          ] },
        { id: 'B', label: 'Mediate with France', summary: 'Mediate with France; if refused, recognize.',
          meterDelta: { UNION: -12 }, statDelta: { ARMS: -10, ECON: 2, POWER: -6 },
          flags: ['BRITISH_MEDIATION'], roll: { flag: 'BRITISH_WAR', pct: 50 },
          effects: [
            { place: 'Paris', region: 'FRA', text: 'A joint note; Russia refuses to join.', insight: 'mediation needed three powers, and the Tsar had his own rebels.' },
            { place: 'Washington DC', region: 'DC', text: 'Seward rejects it; Lincoln says mediation is recognition and recognition is war; privateers are commissioned.', insight: 'the North read mediation as intervention because that is what it was.' },
            { place: 'Richmond VA', region: 'VA', text: 'Davis accepts; the Confederacy is a nation in European law.', insight: 'the only thing the South needed from Europe was a signature.' },
            { place: 'Quebec', region: 'CANADA', text: 'Canada mobilizes; a Union invasion plan sits on Stanton’s desk.', insight: 'every British move in America was priced in Canada.' },
            { place: 'Manchester UK', region: 'GBR', text: 'Bright’s Reform movement finds its cause; the government is attacked from below.', insight: 'British democracy’s argument in 1867 was that the Union had been right.', recolor: [{ r: 'GBR', setl: 30 }] }
          ] },
        { id: 'C', label: 'Let the rams sail', summary: 'Let the Laird rams sail.',
          meterDelta: { UNION: -8 }, statDelta: { ARMS: -6, ECON: 4, POWER: -8 },
          flags: ['RAMS_SAILED'],
          effects: [
            { place: 'Birkenhead UK', region: 'GBR', text: 'The rams launch in 1863; one breaks the blockade at Wilmington for a season.', insight: 'two ironclads against wooden blockaders was the Confederacy’s best naval chance.' },
            { place: 'Washington DC', region: 'DC', text: 'Adams writes that it would be superfluous to point out this is war; Seward orders privateers.', insight: 'the phrase was written historically and the ships were seized; here they were not.' },
            { place: 'Wilmington NC', region: 'NC', text: 'Cotton out, arms in, for one season.', insight: 'a blockade broken briefly is a blockade.' },
            { place: 'Halifax NS', region: 'CANADA', text: 'War scare; the navy sails.', insight: 'the price of a Confederate navy was a British one.' },
            { place: 'Geneva', region: 'FRA', text: 'The claims double.', insight: 'neutrality violated is a debt with interest.' }
          ] }
      ] },

    { id: 'GBR_T6', turn: 6, year: '1863', title: 'The Rams',
      situation: 'Roebuck’s motion to recognize the Confederacy is before the Commons. Adams has written that letting the Laird rams sail would be war. News of Gettysburg and Vicksburg has just arrived. France is installing an Austrian archduke as emperor of Mexico and wants you to come along. Lancashire is in its second winter of famine.',
      choices: [
        { id: 'A', label: 'Seize the rams', summary: 'Seize the rams; let Roebuck’s motion die; fund Lancashire relief.', historical: true,
          meterDelta: { UNION: 4 }, statDelta: { ARMS: 2, ECON: -4, POWER: 4 },
          effects: [
            { place: 'Birkenhead UK', region: 'GBR', text: 'Oct 1863: the rams are detained and bought by the Royal Navy.', insight: 'the government chose the Union’s goodwill over a shipbuilder’s contract.', recolor: [{ r: 'GBR', setl: 65 }] },
            { place: 'Westminster', region: 'GBR', text: 'Roebuck withdraws after Gettysburg.', insight: 'recognition motions followed battles, and the battles had gone the wrong way.' },
            { place: 'Manchester UK', region: 'GBR', text: 'The Public Works Act; sewers and parks built by idle cotton hands.', insight: 'Lancashire’s relief was the first large public-works program in Britain.' },
            { place: 'Mexico City', region: 'MEX', text: 'Britain stays out; Maximilian arrives in 1864 with French bayonets only.', insight: 'the Confederacy’s last European hope was a French empire Britain refused to join.' },
            { place: 'Washington DC', region: 'DC', text: 'Adams thanks Russell; relations warm for the first time since 1861.', insight: 'the rams decision was the turn.' }
          ] },
        { id: 'B', label: 'Join France in Mexico', summary: 'Join France in Mexico; back Maximilian; a Franco-British Confederate policy.',
          meterDelta: { UNION: -6 }, statDelta: { ARMS: -6, ECON: 2, POWER: -4 },
          flags: ['MAXIMILIAN_AXIS'],
          effects: [
            { place: 'Mexico City', region: 'MEX', text: 'Maximilian’s empire with British money; Juárez loses British neutrality.', insight: 'the Monroe Doctrine had no enforcement until 1865, and you tested it.', recolor: [{ r: 'MEX', pin: 'FRENCH', size: 3 }] },
            { place: 'Richmond VA', region: 'VA', text: 'A friendly border and the Matamoros cotton trade.', insight: 'the Confederacy’s one open door was Mexico.' },
            { place: 'Washington DC', region: 'DC', text: 'After Appomattox, Grant sends 50,000 to the Rio Grande; a war with France in 1866.', insight: 'the Union army of 1865 was the largest in the world and it needed somewhere to point.' },
            { place: 'Paris', region: 'FRA', text: 'Napoleon delighted; the axis.', insight: 'France followed Britain into things and out of them.' },
            { place: 'Manchester UK', region: 'GBR', text: 'Workers denounce the government; Reform agitation grows.', insight: 'British foreign policy and British democracy were the same argument in the 1860s.', recolor: [{ r: 'GBR', setl: 35 }] }
          ] },
        { id: 'C', label: 'Arm the Confederacy', summary: 'Sell the Confederacy arms and ships openly; declare the blockade ineffective.',
          meterDelta: { UNION: -12 }, statDelta: { ARMS: -10, ECON: 6, POWER: -10 },
          roll: { flag: 'BRITISH_WAR', pct: 40 },
          effects: [
            { place: 'Liverpool UK', region: 'GBR', text: 'Open contracts; four ironclads.', insight: 'the neutrality law was the only thing between Liverpool and the Confederate navy.' },
            { place: 'Washington DC', region: 'DC', text: 'Seward breaks relations; the Union navy patrols off Halifax.', insight: 'a declared policy is a declared side.' },
            { place: 'Wilmington NC', region: 'NC', text: 'The blockade breaks.', insight: 'ironclads beat wooden ships.' },
            { place: 'Quebec', region: 'CANADA', text: 'The Union’s Canada plan: 100,000 men; Confederation panic.', insight: 'Canada confederated in 1867 partly from this fear; here the fear is a plan.' },
            { place: 'Geneva', region: 'FRA', text: 'No arbitration; the claims become a war debt.', insight: 'neutrality is the thing you cannot buy back.' }
          ] }
      ] },

    { id: 'GBR_T7', turn: 7, year: '1864', title: 'St. Albans',
      situation: 'Confederate agents based in Canada have robbed the banks of St. Albans, Vermont, and tried to burn New York. A Canadian court has released them. Union generals are saying out loud that Canada is next after Richmond. The colonies are meeting at Charlottetown to discuss a federation, mostly out of fear. Lincoln’s re-election looks likely after Atlanta.',
      choices: [
        { id: 'A', label: 'Stay neutral', summary: 'Stay neutral; pass a Canadian alien act; back Confederation.', historical: true,
          meterDelta: { UNION: 2 }, statDelta: { ARMS: 2, ECON: -2, POWER: 2 },
          effects: [
            { place: 'St. Albans VT', region: 'VT', text: 'The raiders are re-arrested; Canada pays the banks $50,000; the Alien Act of 1865 expels Confederate agents.', insight: 'Canada policed its neutrality once the price of not doing so was an army on the border.' },
            { place: 'Charlottetown PEI', region: 'CANADA', text: 'The conferences of 1864; the Dominion of Canada in 1867.', insight: 'the United States built Canada by frightening it.' },
            { place: 'Washington DC', region: 'DC', text: 'The Reciprocity Treaty is abrogated in 1866 in retaliation; Fenian raids follow.', insight: 'the war’s grudges were paid in trade.' },
            { place: 'Halifax NS', region: 'CANADA', text: 'The navy reinforced.', insight: 'neutrality needs ships too.' },
            { place: 'Richmond VA', region: 'VA', text: 'No more Canadian operations.', insight: 'a base that gets you expelled is not a base.' }
          ] },
        { id: 'B', label: 'Mediate on Union terms', summary: 'Offer mediation on Union terms: reunion with emancipation and amnesty.',
          meterDelta: { UNION: 4 }, statDelta: { ARMS: 4, POWER: 6 },
          effects: [
            { place: 'Washington DC', region: 'DC', text: 'Seward accepts the channel; the Hampton Roads talks happen in the autumn of 1864 rather than February 1865.', insight: 'an offer on the winner’s terms is an offer the winner can use.' },
            { place: 'Richmond VA', region: 'VA', text: 'Davis refuses; the refusal isolates him.', insight: 'the Confederacy’s last diplomatic asset was European sympathy, and it was spent.' },
            { place: 'Manchester UK', region: 'GBR', text: 'Bright is hailed as the man who was right.', insight: 'the Union’s British friends got their vindication in a policy.', recolor: [{ r: 'GBR', setl: 80 }] },
            { place: 'Paris', region: 'FRA', text: 'Napoleon loses British cover in Mexico and withdraws in 1866.', insight: 'France’s American empire lasted as long as Britain’s patience.' },
            { place: 'Halifax NS', region: 'CANADA', text: 'Calm.', insight: 'the border’s danger was always Washington’s mood.' }
          ] },
        { id: 'C', label: 'Anglo-French armistice', summary: 'Propose a joint Anglo-French armistice; recognition if the Union refuses.',
          meterDelta: { UNION: -2 }, statDelta: { ARMS: -4, POWER: -8 },
          effects: [
            { place: 'Washington DC', region: 'DC', text: 'Seward publishes the note with contempt.', insight: 'a proposal to save a losing side is read as taking it.' },
            { place: 'Richmond VA', region: 'VA', text: 'A last hope; Davis delays surrender; thousands more dead.', insight: 'hope is a weapon that kills the hopeful.' },
            { place: 'Paris', region: 'FRA', text: 'Napoleon agrees; both powers are humiliated together in April 1865.', insight: 'joint humiliation is still humiliation.' },
            { place: 'Ottawa', region: 'CANADA', text: 'Union troops on the border; Confederation accelerates.', insight: 'fear is a federating force.' },
            { place: 'Geneva', region: 'FRA', text: 'The claims grow.', insight: 'every hostile act in wartime is a line in the peace.' }
          ] }
      ] },

    { id: 'GBR_T8', turn: 8, year: '1865–77', title: 'The Alabama Claims',
      situation: 'The Union has a million veterans and a grudge. Senator Sumner says Britain owes $2 billion for prolonging the war, or Canada. The Fenians have raided from Vermont. Canada is confederating. Bright says the Union’s victory proves ordinary people can govern and the Reform Act must follow.',
      choices: [
        { id: 'A', label: 'Treaty of Washington', summary: 'Treaty of Washington 1871; Geneva arbitration; pay $15.5 million; back Confederation.', historical: true,
          meterDelta: { UNION: 4 }, statDelta: { ARMS: 4, ECON: 6, POWER: 6 },
          effects: [
            { place: 'Geneva', region: 'FRA', text: '1872: the tribunal awards $15.5 million; Britain pays.', insight: 'the first great international arbitration settled a war’s debt without another war.' },
            { place: 'Ottawa', region: 'CANADA', text: 'July 1, 1867: the Dominion; the Fenians fade; the US recognizes it.', insight: 'Canada exists because Britain settled with Washington.', recolor: [{ r: 'CANADA', setl: 70 }] },
            { place: 'Westminster', region: 'GBR', text: 'The 1867 Reform Act doubles the electorate; Bright’s argument is that America’s war proved the people could be trusted.', insight: 'the Union’s victory was an argument in British politics.', recolor: [{ r: 'GBR', setl: 75 }] },
            { place: 'Washington DC', region: 'DC', text: 'Anglo-American peace; the special relationship begins in a courtroom.', insight: 'alliances built on arbitration outlast those built on sentiment.' },
            { place: 'Liverpool UK', region: 'GBR', text: 'Cotton returns by 1870; the Confederate financiers are bankrupt.', insight: 'trade forgave what politics remembered.' }
          ] },
        { id: 'B', label: 'Refuse arbitration', summary: 'Refuse arbitration; refuse the claims.',
          statDelta: { ARMS: -4, ECON: -4, POWER: -8 },
          effects: [
            { place: 'Washington DC', region: 'DC', text: 'Sumner’s Canada demand gets a hearing; the Fenians get a wink; the raids of 1866 and 1870 are bigger.', insight: 'a grievance unpaid is a grievance armed.' },
            { place: 'Ottawa', region: 'CANADA', text: 'Confederation under threat; Britain reinforces.', insight: 'Canada’s security was the price of every British refusal.', recolor: [{ r: 'CANADA', setl: 40 }] },
            { place: 'Geneva', region: 'FRA', text: 'No arbitration; the precedent for international law is not set.', insight: 'the Alabama case built the Hague; without it, nothing.' },
            { place: 'Victoria BC', region: 'CANADA', text: 'The US buys Alaska in 1867 with British Columbia in mind; BC joins Canada only if Britain guarantees the railway.', insight: 'the Pacific coast was the next contested border.' },
            { place: 'Westminster', region: 'GBR', text: 'Gladstone’s government falls over the refusal.', insight: 'the settlement was his policy.' }
          ] },
        { id: 'C', label: 'Back Reconstruction', summary: 'Back Reconstruction with cotton contracts for freedpeople’s cooperatives; fund Black emigration to the Caribbean.',
          meterDelta: { FREEDOM: 4 }, statDelta: { ARMS: 3, ECON: 2, POWER: 4 },
          effects: [
            { place: 'Beaufort SC', region: 'SC', text: 'British buyers contract directly with Sea Island freedpeople; Black landowners have a market.', insight: 'land without a buyer is a garden.', recolor: [{ r: 'SC', pin: 'FREEDOM', size: 3 }] },
            { place: 'Morant Bay, Jamaica', region: 'CUB', text: 'Oct 1865: your own colony’s Black rebellion is crushed with 400 executions; the contradiction is printed in every American paper.', insight: 'the empire that lectured America on freedom shot its own subjects the same year.' },
            { place: 'Manchester UK', region: 'GBR', text: 'The Cotton Supply Association backs “free labor cotton.”', insight: 'Lancashire’s conscience had a price and here it was paid.' },
            { place: 'Washington DC', region: 'DC', text: 'Radicals grateful; Southern Democrats denounce British meddling.', insight: 'British money in Reconstruction was a Radical asset and a Redeemer argument.' },
            { place: 'Liverpool UK', region: 'GBR', text: 'The Confederate financiers are shunned.', insight: 'the city that built the Alabama changed sides when the cotton did.' }
          ] }
      ] }

  ];
})();
