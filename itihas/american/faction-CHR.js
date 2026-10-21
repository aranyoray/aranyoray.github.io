/* A House Divided (1850–1877) — Cherokee Nation, full 8-turn script.
   Choice A on every node is historical; B and C are plausible counterfactuals.
   Facts follow the companion spec; no invented quotations. */
(function(){window.AH_SCENARIO.nodes.CHR=[
  { id:"CHR_T1", turn:1, year:"1850–52", title:"The Golden Age",
    intro:"It’s 1850. Twelve years ago the United States marched your nation west and a quarter of your people died on the road. You have rebuilt: a constitution, courts, a bilingual newspaper, and two seminaries opening next year. Your leading families own 1,500 enslaved people; your full-blood majority mostly do not, and some of them meet at night to talk about the old ways and the Baptist gospel. In ten years the Americans will split and both halves will want your land and your men. Your meters: Cohesion, Land and Treasury, Sovereignty.",
    situation:"The 1846 treaty ended the blood feud between Ross’s people and the Treaty Party who signed the removal. The Nation runs public schools; the Cherokee Advocate prints in both languages. Along the Arkansas River, mixed-blood planters work enslaved people on cotton and corn. Evan Jones, a Baptist, preaches against slavery to full-blood congregations. Washington wants your 800,000 acres of Neutral Lands in Kansas.",
    choices:[
      { id:"A", label:"Build the institutions", summary:"Build institutions; keep slavery; hold the Neutral Lands.", historical:true,
        statDelta:{ ARMS:4, ECON:2, POWER:3 },
        effects:[
          { place:"Tahlequah, Indian Territory", region:"OK", text:"The Male and Female Seminaries open in 1851, among the first institutions of higher education west of the Mississippi.", insight:"a nation that had lost everything built schools first.", recolor:[{ r:"OK", pin:"NATIVE", size:2 }] },
          { place:"Park Hill, Indian Territory", region:"OK", text:"Ross’s Rose Cottage; a slave code that bans teaching enslaved people to read.", insight:"the Nation’s elite copied the South’s institutions to prove it belonged among nations." },
          { place:"Washington DC", region:"DC", text:"Annuity disputes; per capita payments withheld; the US treats the Nation as a ward.", insight:"sovereignty in 1850 meant asking for your own money." },
          { place:"Neutral Lands, KS", region:"KS", text:"Settlers squat; the Nation cannot evict them.", insight:"land you cannot police is land you are about to lose." },
          { place:"Baptist Mission, Indian Territory", region:"OK", text:"Evan Jones and his son John baptize full-bloods and preach against slavery.", insight:"the Keetoowah Society’s roots were a mission church." }
        ] },
      { id:"B", label:"Abolish slavery now", summary:"Abolish slavery in the Nation now.",
        meterDelta:{ FREEDOM:1 }, statDelta:{ ARMS:-12, ECON:-4, POWER:4 }, flags:["CHEROKEE_FREE"],
        effects:[
          { place:"Tahlequah, Indian Territory", region:"OK", text:"The council votes abolition; the Ridge, Boudinot and Watie families revolt; the 1839 feud reopens.", insight:"the Nation’s slaveholders were the Treaty Party’s heirs, and abolition looked like Ross’s revenge.", recolor:[{ r:"OK", sl:"ABOLISHED", pin:"FIRE_EATER", size:2 }] },
          { place:"Fort Smith, AR", region:"AR", text:"Arkansas demands federal intervention; fugitives cross the line.", insight:"a free nation beside a slave state was intolerable to the state." },
          { place:"Washington DC", region:"DC", text:"Southern senators block annuities.", insight:"the Indian Bureau was a Southern instrument in the 1850s." },
          { place:"Park Hill, Indian Territory", region:"OK", text:"Ross, who owns a hundred people, must free them or resign.", insight:"the chief’s own household was the Nation’s contradiction." },
          { place:"Fort Gibson, Indian Territory", region:"OK", text:"Freedmen become citizens; the fight of 1866 is settled in 1852.", insight:"the question of who belongs to the Nation was the war’s longest legacy." }
        ] },
      { id:"C", label:"Ally with the Treaty Party", summary:"Ally with the Treaty Party remnants and Watie for US and Southern favor.",
        statDelta:{ ARMS:-6, ECON:4, POWER:-4 },
        effects:[
          { place:"Washington DC", region:"DC", text:"The Treaty Party’s Senate friends move the annuities.", insight:"the faction that signed removal had patrons in the capital." },
          { place:"Park Hill, Indian Territory", region:"OK", text:"Ross weakened; the 1839 killings are relitigated.", insight:"an alliance with the men who signed the Nation away is a wound reopened." },
          { place:"Fort Smith, AR", region:"AR", text:"Arkansas planters as partners; more enslaved people bought.", insight:"Southern favor came with Southern institutions.", recolor:[{ r:"OK", setl:40 }] },
          { place:"Tahlequah, Indian Territory", region:"OK", text:"The Keetoowah begin as an opposition.", insight:"every alliance creates its counter-alliance." },
          { place:"Austin, TX", region:"TX", text:"Texas ties; the 1861 treaty is half written.", insight:"the road to Pike’s treaty began here." }
        ] }
    ] },

  { id:"CHR_T2", turn:2, year:"1854–56", title:"Kansas at the Door",
    situation:"Kansas-Nebraska has opened the land north of you. Your Neutral Lands are now inside Kansas and squatters are arriving with both free-state and pro-slavery flags. Missouri’s Senator Atchison suggests the Nation send voters. The US Indian agent hints the Nation could one day be a Southern state.",
    choices:[
      { id:"A", label:"Stay neutral on Kansas", summary:"Stay neutral on Kansas; guard the schools; petition on the Neutral Lands.", historical:true,
        statDelta:{ ARMS:2, ECON:-3, POWER:2 },
        effects:[
          { place:"Neutral Lands, KS", region:"KS", text:"The petition is ignored until the lands are sold in 1866.", insight:"a title Washington will not enforce is a claim." },
          { place:"Tahlequah, Indian Territory", region:"OK", text:"The seminaries graduate their first classes.", insight:"the Nation’s investment was in the next generation, which the war would scatter." },
          { place:"Washington DC", region:"DC", text:"The Senate ignores the Nation’s title.", insight:"Kansas was for settlers, and the Nation’s land was in Kansas." },
          { place:"Lawrence, KS", region:"KS", text:"Both Kansas parties see the Nation as land for the taking.", insight:"free soil and slave soil agreed on Indian soil." },
          { place:"Park Hill, Indian Territory", region:"OK", text:"Watie’s men catch Kansas fever; some ride with the Border Ruffians.", insight:"the Nation’s Southern faction found its neighbors." }
        ] },
      { id:"B", label:"Sell the Neutral Lands", summary:"Sell the Neutral Lands to the US now for cash.",
        statDelta:{ ARMS:4, ECON:10, POWER:-4 },
        effects:[
          { place:"Washington DC", region:"DC", text:"The US pays a dollar an acre, half the value, in an 1855 treaty.", insight:"a seller with no leverage gets the buyer’s price." },
          { place:"Tahlequah, Indian Territory", region:"OK", text:"The money funds the schools and a national bank; per capita payments buy loyalty.", insight:"cash in 1855 was cohesion in 1861." },
          { place:"Fort Scott, KS", region:"KS", text:"The lands become free-state settlements; Kansas gains Unionists.", insight:"what the Nation sold, Kansas voted with." },
          { place:"Park Hill, Indian Territory", region:"OK", text:"The planters want the money for Texas land.", insight:"capital looks for cotton." },
          { place:"Fort Gibson, Indian Territory", region:"OK", text:"The Nation enters the war with reserves.", insight:"a treasury is a choice about the future." }
        ] },
      { id:"C", label:"Alliance with the South", summary:"Formal alliance with the Southern states; a Cherokee delegation to Southern conventions.",
        meterDelta:{ FREEDOM:-1 }, statDelta:{ ARMS:-8, ECON:2, POWER:-2 },
        effects:[
          { place:"Vicksburg, MS", region:"MS", text:"The Nation is seated as an observer at the Southern Commercial Convention; papers call it \"the Cherokee state.\"", insight:"the South wanted the Nation as a state because it wanted the Nation’s land as a slave state.", recolor:[{ r:"OK", setl:35 }] },
          { place:"Washington DC", region:"DC", text:"Annuities delayed as punishment.", insight:"the Bureau punished alignment with anyone but itself." },
          { place:"Tahlequah, Indian Territory", region:"OK", text:"The Keetoowah organize openly; the Nation polarizes on the American pattern.", insight:"the Nation imported the Union’s division along with its allies." },
          { place:"Fort Smith, AR", region:"AR", text:"The slave trade into the Nation grows.", insight:"alliance was commerce." },
          { place:"Austin, TX", region:"TX", text:"Watie’s connections; the 1861 treaty is negotiated before there is a Confederacy.", insight:"the road to Pike’s treaty is paved." }
        ] }
    ] },

  { id:"CHR_T3", turn:3, year:"1857–59", title:"Keetoowah",
    situation:"Full-blood traditionalists have formed a secret society, the Keetoowah, sworn to the old ways and against slavery, meeting at night with the Baptists’ blessing. Mixed-blood planters have formed chapters of the Knights of the Golden Circle. The US agent has read Dred Scott aloud at the agency. Ross is a slaveholder whose voters are Keetoowah.",
    choices:[
      { id:"A", label:"Ross balances both societies", summary:"Ross balances; tolerate both societies; hold the Nation together.", historical:true,
        statDelta:{ POWER:2 },
        effects:[
          { place:"Tahlequah, Indian Territory", region:"OK", text:"The Keetoowah grow to 2,000, the Knights to 500; both are armed.", insight:"the Nation’s civil war had its regiments before the American one did.", recolor:[{ r:"OK", pin:"NATIVE", size:3 },{ r:"OK", pin:"FIRE_EATER", size:2 }] },
          { place:"Park Hill, Indian Territory", region:"OK", text:"Ross is the balance point: a slaveholder with a full-blood base.", insight:"the chief’s survival depended on nobody forcing the question." },
          { place:"Baptist Mission, Indian Territory", region:"OK", text:"Evan Jones is expelled in 1860 by a Southern-leaning agent and returns with the Union army.", insight:"the missionaries were the Nation’s link to Kansas abolition." },
          { place:"Washington DC", region:"DC", text:"The agent reports abolitionists among the Cherokee.", insight:"the Bureau’s spies wrote the South’s case." },
          { place:"Fort Smith, AR", region:"AR", text:"Arkansas demands the missionaries be expelled.", insight:"a slave state polices its neighbors’ pulpits." }
        ] },
      { id:"B", label:"Suppress both societies", summary:"Suppress both societies; ban secret organizations.",
        statDelta:{ ARMS:-8, POWER:2 },
        effects:[
          { place:"Tahlequah, Indian Territory", region:"OK", text:"The Keetoowah go deeper underground; the Knights ignore the law.", insight:"bans work on the side that obeys laws." },
          { place:"Park Hill, Indian Territory", region:"OK", text:"Ross loses the full-bloods’ trust; his 1861 neutrality has fewer defenders.", insight:"a leader who suppresses his own base has no base." },
          { place:"Baptist Mission, Indian Territory", region:"OK", text:"The missionaries leave.", insight:"the Nation lost its Northern friends before it needed them." },
          { place:"Washington DC", region:"DC", text:"The agent approves.", insight:"the Bureau liked quiet." },
          { place:"Fort Gibson, Indian Territory", region:"OK", text:"In 1861 there is no organized Unionist faction; the Nation goes Confederate faster and harder.", insight:"the Keetoowah were the reason the Nation split instead of simply falling.", recolor:[{ r:"OK", setl:35 }] }
        ] },
      { id:"C", label:"Back the Keetoowah", summary:"Ross backs the Keetoowah openly and frees his own enslaved people.",
        meterDelta:{ FREEDOM:1 }, statDelta:{ ARMS:-10, POWER:4 }, flags:["TWO_CHEROKEE_NATIONS"], roll:{ flag:"CHEROKEE_UNION_EARLY", pct:60 },
        effects:[
          { place:"Park Hill, Indian Territory", region:"OK", text:"Ross frees a hundred people; the planters call him a traitor; Watie’s faction moves to secede from the Nation.", insight:"the chief chose his voters over his class.", recolor:[{ r:"OK", sl:"SELF_EMANCIPATING", pin:"FIRE_EATER", size:3 }] },
          { place:"Tahlequah, Indian Territory", region:"OK", text:"Two councils by 1859.", insight:"the split of 1862 happened three years early." },
          { place:"Fort Smith, AR", region:"AR", text:"Arkansas threatens invasion; the agent sides with the planters.", insight:"the state next door had a policy on your internal affairs." },
          { place:"Washington DC", region:"DC", text:"Northern Republicans notice; the Nation has Radical friends for 1866.", insight:"friends made in 1859 wrote treaties in 1866." },
          { place:"Fort Gibson, Indian Territory", region:"OK", text:"Union sympathies dominate in 1861.", insight:"a Nation that had already chosen did not have to be captured." }
        ] }
    ] },

  { id:"CHR_T4", turn:4, year:"1860–61", title:"Pike’s Treaty",
    situation:"The US has abandoned Forts Gibson, Washita and Arbuckle without a word to you. The Choctaw and Chickasaw have signed with the Confederacy. Albert Pike is at Park Hill with a treaty: a delegate in the Confederate Congress, your annuities guaranteed, protection. Opothleyahola’s loyal Creeks ask you to stand with them. Kansas is 200 miles of open prairie. Watie has already raised a regiment.",
    choices:[
      { id:"A", label:"Neutral, then sign Pike", summary:"Neutrality in May; sign Pike’s treaty in October after the Union abandons you; raise two regiments.", historical:true,
        statDelta:{ ARMS:-8, POWER:-4 },
        effects:[
          { place:"Tahlequah, Indian Territory", region:"OK", text:"Oct 7: Ross signs; he will say later it was under duress, and it was, and he also had no other offer.", insight:"a nation abandoned by its protector takes the protector that shows up.", recolor:[{ r:"OK", setl:35 }] },
          { place:"Fort Gibson, Indian Territory", region:"OK", text:"The US garrison marched out in April; nobody wrote to Ross.", insight:"the Union lost the Nation by forgetting it existed." },
          { place:"Chustenahlah, Indian Territory", region:"OK", text:"Dec 26: Opothleyahola’s Creeks are broken; 2,000 die walking to Kansas in winter; Drew’s Keetoowah regiment deserts rather than fight them.", insight:"the Nation’s own soldiers would not fight the Nation’s own friends.", recolor:[{ r:"KS", pin:"NATIVE", size:3 }] },
          { place:"Pea Ridge, AR", region:"AR", text:"March 1862: Cherokee regiments fight for the Confederacy; the Northern press prints scalping stories.", insight:"the Nation’s reputation in the North was set by one battle’s rumors." },
          { place:"Washington DC", region:"DC", text:"Annuities suspended; the Nation is \"in rebellion.\"", insight:"the treaty that saved the Nation in 1861 cost it in 1866." }
        ] },
      { id:"B", label:"Refuse Pike, march to Kansas", summary:"Refuse Pike; march the loyalists to Kansas with the Creeks.",
        statDelta:{ ARMS:-12, ECON:-6, POWER:6 }, flags:["CHEROKEE_UNION_EARLY","TWO_CHEROKEE_NATIONS"],
        effects:[
          { place:"Fort Scott, KS", region:"KS", text:"The Nation’s government in exile; the Union Indian Brigade forms in 1862 with Cherokee, Creek and Seminole regiments.", insight:"the loyal Nation had an army before the Union had a plan for it.", recolor:[{ r:"OK", setl:65, occ:"CSA" }] },
          { place:"Tahlequah, Indian Territory", region:"OK", text:"Watie takes the capital; two nations from the first year.", insight:"the split came either way; the question was which side held the capital." },
          { place:"Chustenahlah, Indian Territory", region:"OK", text:"The loyal Cherokee march with the Creeks; the winter still kills hundreds.", insight:"loyalty did not warm the prairie." },
          { place:"Washington DC", region:"DC", text:"Annuities paid to the loyal government; the 1866 treaty is a friend’s treaty.", insight:"what the US remembered in 1866 was who had been on which side in 1861." },
          { place:"Park Hill, Indian Territory", region:"OK", text:"Watie burns Rose Cottage in 1861 rather than 1863.", insight:"the chief’s house was the first casualty of choosing." }
        ] },
      { id:"C", label:"Sign with Pike at once", summary:"Sign with Pike at once, before the Union leaves; full alliance with Watie in command.",
        statDelta:{ ARMS:-6, ECON:-12, POWER:-10 },
        effects:[
          { place:"Tahlequah, Indian Territory", region:"OK", text:"The treaty in May; Watie is the Nation’s general; the Keetoowah are suppressed.", insight:"the Nation’s Southern faction got the Nation.", recolor:[{ r:"OK", setl:15, pin:"FIRE_EATER", size:3 }] },
          { place:"Fort Gibson, Indian Territory", region:"OK", text:"A Confederate garrison; the Nation is a military district.", insight:"an ally with a garrison is a province." },
          { place:"Baxter Springs, KS", region:"KS", text:"Raids into Kansas; Jayhawkers burn the Nation’s northern districts in reply.", insight:"raids invite raids." },
          { place:"Chustenahlah, Indian Territory", region:"OK", text:"The loyal Creeks are destroyed with Cherokee help.", insight:"the Five Tribes’ loyalists were crushed by the Five Tribes." },
          { place:"Washington DC", region:"DC", text:"The Nation is an enemy; the 1866 treaty is punitive: the Neutral Lands, the Outlet, the railroads all lost; allotment comes early.", insight:"the US punished the Nation for a choice the US had forced, and punished it harder when the choice was eager." }
        ] }
    ] },

  { id:"CHR_T5", turn:5, year:"1862", title:"Two Chiefs",
    situation:"Pea Ridge was a Confederate defeat. The Union’s Indian Expedition has entered the Nation and Drew’s regiment has changed sides. Union officers are offering to escort Ross out with his papers. Watie’s faction will elect him chief the moment Ross leaves. Refugees are already moving in both directions.",
    choices:[
      { id:"A", label:"Ross goes to Washington", summary:"Ross goes to Washington with the Union; the Nation splits.", historical:true,
        statDelta:{ ARMS:-15, ECON:-6, POWER:2 }, flags:["TWO_CHEROKEE_NATIONS"],
        effects:[
          { place:"Park Hill, Indian Territory", region:"OK", text:"July 15: Union cavalry \"capture\" Ross, his family and the Nation’s papers; he goes to Philadelphia.", insight:"the chief left with the treaty in his pocket so he could repudiate it in the capital.", recolor:[{ r:"OK", setl:50, occ:"contested" }] },
          { place:"Tahlequah, Indian Territory", region:"OK", text:"August: Watie elected chief by the Southern council; two governments, two armies.", insight:"a nation with two chiefs has one civil war." },
          { place:"Washington DC", region:"DC", text:"Ross meets Lincoln and asks that the treaty be voided and the Nation protected; Lincoln listens; the US does little.", insight:"the Nation’s loyalty was accepted and not repaid." },
          { place:"Fort Gibson, Indian Territory", region:"OK", text:"Reoccupied by the Union in 1863; 16,000 refugees by 1864.", insight:"the war’s Cherokee front was a refugee camp with a fort in it." },
          { place:"Neosho, MO", region:"MO", text:"Loyal refugees; smallpox.", insight:"displacement killed more than battle." }
        ] },
      { id:"B", label:"Stay Confederate with Watie", summary:"Ross stays and fights with Watie; the Nation stays Confederate together.",
        statDelta:{ ARMS:-4, ECON:-15, POWER:-12 },
        effects:[
          { place:"Tahlequah, Indian Territory", region:"OK", text:"One government, Confederate; the Keetoowah desert to Kansas anyway.", insight:"unity at the top did not reach the ranks.", recolor:[{ r:"OK", setl:25 }] },
          { place:"Fort Gibson, Indian Territory", region:"OK", text:"Union raids; a battlefield with no protected side.", insight:"a Nation without a loyal faction had no one to appeal to." },
          { place:"Washington DC", region:"DC", text:"Ross is a rebel chief; the 1866 treaty treats the whole Nation as conquered.", insight:"the loyal delegation of 1866 was the Nation’s only shield, and here there is none." },
          { place:"Neosho, MO", region:"MO", text:"The loyalists elect their own leaders; a third faction.", insight:"a Nation that abandons its loyalists creates a new government of them." },
          { place:"Red River, TX", region:"TX", text:"Southern refugees; destitution by 1865.", insight:"the Confederacy could not feed its own, let alone its allies." }
        ] },
      { id:"C", label:"Repudiate, declare for Union", summary:"Ross repudiates the treaty in the Nation and declares for the Union with Drew’s regiment; hold Tahlequah.",
        statDelta:{ ARMS:-8, ECON:-4, POWER:6 }, roll:{ flag:"CHEROKEE_UNITED", pct:50 },
        effects:[
          { place:"Tahlequah, Indian Territory", region:"OK", text:"The council repudiates under Union guns; Watie attacks; the capital changes hands three times in 1862.", insight:"the Nation’s government stayed in the Nation, which is what made it a government.", recolor:[{ r:"OK", setl:60 }] },
          { place:"Fort Gibson, Indian Territory", region:"OK", text:"The Union Indian Brigade garrisons; refugees concentrate.", insight:"a garrison is a promise." },
          { place:"Washington DC", region:"DC", text:"A loyal ally by summer; annuities resume; one delegation in 1866.", insight:"the US negotiates with whoever is in the capital." },
          { place:"Park Hill, Indian Territory", region:"OK", text:"Watie burns Rose Cottage anyway.", insight:"some things burn on every path." },
          { place:"Fort Scott, KS", region:"KS", text:"The Union sends more troops to the Nation.", insight:"allies that hold ground get reinforcements." }
        ] }
    ] },

  { id:"CHR_T6", turn:6, year:"1863", title:"Cowskin Prairie",
    situation:"The loyal council meets at Cowskin Prairie under Union protection with the votes to abolish slavery in the Nation, void the Confederate treaty and depose Watie. Watie’s raiders will burn Ross’s house in October. Cabin Creek is about to be fought over a supply train. A third of the Nation is in refugee camps.",
    choices:[
      { id:"A", label:"Abolish, void, depose Watie", summary:"Abolish slavery, void the treaty, depose Watie.", historical:true,
        meterDelta:{ FREEDOM:1 }, statDelta:{ ARMS:-4, POWER:4 },
        effects:[
          { place:"Cowskin Prairie, Indian Territory", region:"OK", text:"Feb 1863: the first emancipation by any government west of the Mississippi.", insight:"a nation removed by the US abolished slavery before the US did.", recolor:[{ r:"OK", sl:"ABOLISHED" }] },
          { place:"Cabin Creek, Indian Territory", region:"OK", text:"July 1 and 2: Cherokee, Black and white Union troops hold the supply train together.", insight:"the Union Indian Brigade fought beside the First Kansas Colored, the first integrated fight of the war." },
          { place:"Park Hill, Indian Territory", region:"OK", text:"October: Watie burns Rose Cottage.", insight:"the war was personal." },
          { place:"Fort Gibson, Indian Territory", region:"OK", text:"10,000 refugees; disease; the Nation’s wartime Trail of Tears.", insight:"the Nation lost a third of its people to the war and its camps." },
          { place:"Washington DC", region:"DC", text:"The council’s acts are noted for 1866.", insight:"the treaty of 1866 quoted the Nation’s own abolition against its Southern faction." }
        ] },
      { id:"B", label:"Keep slavery, stay Confederate", summary:"Keep slavery; stay Confederate; Watie as chief of one Nation.",
        statDelta:{ ARMS:2, ECON:-8, POWER:-8 },
        effects:[
          { place:"Tahlequah, Indian Territory", region:"OK", text:"Watie’s council; slavery until 1866.", insight:"the Nation’s last slaveholding government was its Confederate one.", recolor:[{ r:"OK", setl:20 }] },
          { place:"Cabin Creek, Indian Territory", region:"OK", text:"Sept 1864: Watie’s great raid takes 300 wagons.", insight:"the Confederate Cherokee were the best cavalry in the Trans-Mississippi and it did not matter." },
          { place:"Washington DC", region:"DC", text:"The loyal faction gets nothing; the 1866 treaty is written for a conquered Nation.", insight:"no loyal delegation, no leverage." },
          { place:"Fort Gibson, Indian Territory", region:"OK", text:"Union garrison; the Nation occupied.", insight:"an occupied ally is a province." },
          { place:"Red River, TX", region:"TX", text:"Refugees; destitution.", insight:"see Turn 5." }
        ] },
      { id:"C", label:"Freedmen citizens with land", summary:"Abolish slavery and grant freedmen full citizenship with land, now.",
        meterDelta:{ FREEDOM:2 }, statDelta:{ ARMS:-6, POWER:6 },
        effects:[
          { place:"Cowskin Prairie, Indian Territory", region:"OK", text:"Freedmen become citizens with 160 acres each; the full-blood council backs it, the mixed-bloods do not.", insight:"the 1866 treaty’s Article 9 was written by the US; here the Nation writes it first.", recolor:[{ r:"OK", sl:"ABOLISHED", pin:"FREEDOM", size:2 }] },
          { place:"Fort Gibson, Indian Territory", region:"OK", text:"Freedmen join the Indian Brigade as Cherokee citizens.", insight:"the Nation’s army integrated by citizenship, not by order." },
          { place:"Washington DC", region:"DC", text:"Radicals note the Nation did what the US had not; the freedmen clause of 1866 is uncontested and the court fights of 2017 never happen.", insight:"a question answered in 1863 is not litigated for 150 years." },
          { place:"Park Hill, Indian Territory", region:"OK", text:"Watie’s faction hardens; the Southern Cherokee refuse to return.", insight:"every extension of citizenship has a faction that leaves." },
          { place:"Tahlequah, Indian Territory", region:"OK", text:"The 1866 census counts 2,000 freedmen citizens.", insight:"belonging is a number on a roll." }
        ] }
    ] },

  { id:"CHR_T7", turn:7, year:"1864", title:"Watie’s Raids",
    situation:"Watie is a Confederate brigadier general and has just captured 300 Union wagons at Second Cabin Creek. In June he took a steamboat on the Arkansas. Ross is in Washington lobbying. Fort Gibson holds 16,000 refugees. In November, in Colorado, Union militia massacre Cheyenne and Arapaho at Sand Creek and officers in Denver cheer. The two councils will not speak.",
    choices:[
      { id:"A", label:"Lobby Washington; govern refugees", summary:"Ross lobbies Washington; the loyal council governs the refugees; Watie raids until June 1865.", historical:true,
        statDelta:{ ARMS:-4, ECON:-4 },
        effects:[
          { place:"Cabin Creek, Indian Territory", region:"OK", text:"Sept 19: Watie’s $1.5 million raid.", insight:"the Confederate Cherokee won their last battle and lost the war." },
          { place:"Washington DC", region:"DC", text:"Ross petitions Lincoln; the claims are logged; no action.", insight:"the Nation’s loyalty was filed." },
          { place:"Fort Gibson, Indian Territory", region:"OK", text:"The winter of 1864 kills refugees by the hundred.", insight:"the fort protected people it could not feed." },
          { place:"Doaksville, Choctaw Nation", region:"OK", text:"June 23, 1865: Watie is the last Confederate general to surrender.", insight:"the Nation’s war outlasted the South’s." },
          { place:"Sand Creek, CO", region:"CO", text:"The Nation reads what the Union does to the Cheyenne.", insight:"loyalty to the Union bought nothing for any nation west of the Mississippi." }
        ] },
      { id:"B", label:"Ceasefire, joint council", summary:"Negotiate a ceasefire between the two Cherokee governments; a joint council.",
        statDelta:{ ARMS:10, POWER:6 }, roll:{ flag:"CHEROKEE_UNITED", pct:60 },
        effects:[
          { place:"Fort Gibson, Indian Territory", region:"OK", text:"The councils meet under a flag of truce; both sides stop raiding civilians; the Nation’s civil war ends a year early.", insight:"the Nation could make peace with itself before the Americans made peace with each other.", recolor:[{ r:"OK", setl:55, rmpin:"FIRE_EATER" }] },
          { place:"Washington DC", region:"DC", text:"One Nation, one delegation, better terms in 1866.", insight:"the US played the two delegations against each other historically; here it cannot." },
          { place:"Fort Smith, AR", region:"AR", text:"The 1865 council: a united Cherokee delegation.", insight:"the other tribes followed the Cherokee example." },
          { place:"Park Hill, Indian Territory", region:"OK", text:"Ross returns to a burned house and a united council.", insight:"a chief’s house can be rebuilt; a nation’s unity is harder." },
          { place:"Doaksville, Choctaw Nation", region:"OK", text:"Watie’s surrender is a Cherokee ceremony, not a Confederate one.", insight:"the war’s ending belonged to the Nation." }
        ] },
      { id:"C", label:"A Cherokee Union brigade", summary:"Ross accepts a Union army command for the Nation: a Cherokee brigade under Cherokee officers.",
        statDelta:{ ARMS:-2, ECON:2, POWER:8 },
        effects:[
          { place:"Fort Gibson, Indian Territory", region:"OK", text:"A Cherokee brigade under its own officers, on Union pay.", insight:"sovereignty in uniform.", recolor:[{ r:"OK", setl:70 }] },
          { place:"Westport, MO", region:"MO", text:"The brigade fights Price’s raid in October.", insight:"the Nation’s soldiers decided a Missouri battle." },
          { place:"Washington DC", region:"DC", text:"The Nation’s loyalty is on the record; the railroad clause of 1866 is negotiated, not imposed.", insight:"an ally’s treaty is a negotiation." },
          { place:"Tahlequah, Indian Territory", region:"OK", text:"Watie’s faction is a Confederate remnant, not a rival government.", insight:"legitimacy went with the army." },
          { place:"Sand Creek, CO", region:"CO", text:"The same army that arms you massacres the Cheyenne; the brigade’s officers protest; nothing happens.", insight:"the Union’s Indian policy had two faces, and the Nation saw both." }
        ] }
    ] },

  { id:"CHR_T8", turn:8, year:"1865–77", title:"The Treaty of 1866",
    situation:"At Fort Smith in September 1865 the US commissioners tell all Five Tribes they forfeited their treaties by allying with the Confederacy, the loyal factions included. They want land, railroad rights, citizenship for the freedmen and a territorial government. Two Cherokee delegations go to Washington: Ross’s and Watie’s. Ross is dying. The railroad surveyors are already in the Nation.",
    choices:[
      { id:"A", label:"Ross signs the treaty", summary:"Ross’s delegation signs July 19, 1866: freedmen are citizens; the Neutral Lands and the Outlet are ceded; a railroad right of way; the Southern Cherokee get the Canadian District.", historical:true,
        meterDelta:{ FREEDOM:1 }, statDelta:{ ARMS:4, ECON:-12, POWER:-6 },
        effects:[
          { place:"Washington DC", region:"DC", text:"The treaty; Ross dies on Aug 1; the Nation survives as a nation.", insight:"the chief’s last act was the treaty that kept the Nation alive at the cost of a third of its land.", recolor:[{ r:"OK", setl:60, sl:"ABOLISHED" }] },
          { place:"Neutral Lands, KS", region:"KS", text:"Sold; the Cherokee Strip is run for in 1893.", insight:"what was lost in 1866 was homesteaded in 1893." },
          { place:"Vinita, Indian Territory", region:"OK", text:"The Katy railroad enters in 1871; towns spring up; the land base erodes.", insight:"the right of way was a road for settlers." },
          { place:"Tahlequah, Indian Territory", region:"OK", text:"Article 9: the freedmen are citizens; the dispute over it runs to 2017.", insight:"belonging was written into the treaty and argued for 150 years.", recolor:[{ r:"OK", pin:"FREEDOM", size:2 }] },
          { place:"Fort Gibson, Indian Territory", region:"OK", text:"Refugees return; the population has fallen by a third.", insight:"the war’s cost was counted in a census." }
        ] },
      { id:"B", label:"A united delegation negotiates", summary:"A united delegation negotiates: keep the Outlet, sell the Neutral Lands at market, no territorial government.", requires:"CHEROKEE_UNITED",
        statDelta:{ ARMS:8, ECON:-4, POWER:6 },
        effects:[
          { place:"Washington DC", region:"DC", text:"With one voice, the Nation wins: two dollars an acre for the Neutral Lands, the Outlet retained, one rail line only.", insight:"the US could not play the Nation against itself.", recolor:[{ r:"OK", setl:70 }] },
          { place:"Vinita, Indian Territory", region:"OK", text:"The railroad comes in 1871 and the Nation taxes it.", insight:"a sovereign taxes what crosses it." },
          { place:"Tahlequah, Indian Territory", region:"OK", text:"Freedmen citizenship, uncontested.", insight:"a united council had settled it." },
          { place:"Fort Smith, AR", region:"AR", text:"The other tribes cite the Cherokee terms.", insight:"precedent runs both ways." },
          { place:"Guthrie, OK", region:"OK", text:"Allotment still comes in 1902, but the Nation’s treasury is larger and its courts last longer.", insight:"sovereignty is measured in decades gained." }
        ] },
      { id:"C", label:"Refuse the treaty", summary:"Refuse the treaty; appeal to the courts and the Radicals; hold the land by occupancy.",
        statDelta:{ ARMS:-4, ECON:-15, POWER:-12 },
        effects:[
          { place:"Washington DC", region:"DC", text:"The Senate imposes terms by statute; the Neutral Lands are taken without payment; the railroad gets its right of way by act of Congress.", insight:"a treaty refused becomes a law imposed." },
          { place:"Vinita, Indian Territory", region:"OK", text:"Settlers flood in; the Nation cannot evict.", insight:"occupancy without a treaty is squatting by the other side’s law." },
          { place:"Tahlequah, Indian Territory", region:"OK", text:"The council refuses to seat freedmen; the US threatens; a decade of dispute.", insight:"refusing the treaty refused its best clause too." },
          { place:"Fort Smith, AR", region:"AR", text:"The other tribes sign and get better terms.", insight:"the first to refuse is the one made an example of." },
          { place:"Supreme Court, Washington DC", region:"DC", text:"Cherokee Tobacco (1870): Congress’s statutes override treaties.", insight:"the precedent was set anyway; here the Nation is its first casualty." }
        ] }
    ] }
];})();
