/* A House Divided — Southern Rights / Confederacy (CSA) faction script.
   Transcribed from the companion spec; no invented quotations or facts.
   Choice A on every node is historical; B and C are plausible counterfactuals. */
(function(){window.AH_SCENARIO.nodes.CSA=[

  { id:"CSA_T1", turn:1, year:"1850–52", title:"The Georgia Platform",
    intro:"It’s 1850. You lead the Southern Rights men: planters, editors, senators who believe the North means to strangle slavery and with it the South’s wealth, which is measured in cotton and in people. Calhoun is dying. The Nashville Convention has met and done nothing. You hold the Senate, the Supreme Court and a president’s ear, and you are losing the census every decade. The Ledger stays on your screen. It counts the people your choices are about.",
    startMeters:{ UNION:60, FREEDOM:8 },
    situation:"California is in as a free state; the Fugitive Slave Act is your consolation prize. Rhett and Quitman want secession now; Toombs, Stephens and Cobb say the Compromise is acceptable if the North enforces the Act. López has just been executed in Havana after his Cuban expedition failed. Some editors say the answer to a shrinking South is more Africans and more islands.",
    choices:[
      { id:"A", label:"Accept the Compromise", summary:"Accept the Compromise on the Georgia Platform’s terms; hold the fire-eaters back.", historical:true,
        meterDelta:{ UNION:6 }, statDelta:{ ARMS:2, POWER:2 },
        effects:[
          { place:"Milledgeville, GA", region:"GA", text:"The Constitutional Union ticket beats the Southern Rights ticket in 1851; Mississippi and Alabama follow.", insight:"most Southerners in 1851 wanted the Union with slavery, not slavery without the Union.", recolor:[{ r:"GA", dl:10 },{ r:"MS", dl:10 },{ r:"AL", dl:10 }] },
          { place:"Charleston, SC", region:"SC", text:"South Carolina’s 1852 convention declares the right to secede and declines to use it.", insight:"a state that secedes alone is not a nation; it is a siege.", recolor:[{ r:"SC", pin:"FIRE_EATER", size:1 }] },
          { place:"Boston, MA", region:"MA", text:"Every rescue and every personal liberty law is printed in Southern papers as proof of bad faith.", insight:"the Act was a test the North was designed to fail, and each failure was a recruit for you." },
          { place:"Havana, Cuba", region:"CUB", text:"López is garroted in Havana in Sept 1851 with 50 Southern volunteers; New Orleans mobs sack the Spanish consulate.", insight:"the dream of a Caribbean slave empire had a body count before it had a map." },
          { place:"Washington, DC", region:"DC", text:"Fillmore enforces the Act; Northern Whigs split; the Democrats become the only national party.", insight:"your leverage was the Democratic Party’s need for Southern votes, and it grew." }
        ] },
      { id:"B", label:"Secede now at Nashville", summary:"Secede now, at Nashville.",
        meterDelta:{ UNION:-10 }, statDelta:{ ARMS:-15, ECON:-10, POWER:-10 }, flags:["SECESSION_1850"],
        effects:[
          { place:"Nashville, TN", region:"TN", text:"The November session votes secession resolutions; only South Carolina acts.", insight:"secession needed the Deep South to move together, and in 1851 it would not." },
          { place:"Jackson, MS", region:"MS", text:"Quitman’s secession referendum loses in September 1851, as it did historically; Mississippi stays.", insight:"the cotton states were prosperous and the Compromise had given them the Act.", recolor:[{ r:"MS", dl:10 }] },
          { place:"Charleston harbor", region:"SC", text:"Fillmore reinforces the forts; South Carolina stands alone for eight months, then rejoins with nothing.", insight:"a one-state secession proved the thing the fire-eaters most needed to hide: they were a minority.", recolor:[{ r:"SC", dl:-10 }] },
          { place:"Liverpool, UK", region:"GBR", text:"Cotton buyers shrug; South Carolina’s crop is a tenth of the South’s.", insight:"King Cotton is a South-wide monarch, not a Carolina one." },
          { place:"Milledgeville, GA", region:"GA", text:"Georgia’s Unionists win in a landslide and the Southern Rights movement is discredited until 1857.", insight:"failed revolutions set their causes back a decade." }
        ] },
      { id:"C", label:"Reopen the slave trade", summary:"Reopen the Atlantic slave trade and take Cuba.",
        meterDelta:{ UNION:-8, FREEDOM:-4 }, statDelta:{ ARMS:4, ECON:6, POWER:-15 }, flags:["SLAVE_TRADE_REOPENED"], roll:{ flag:"CUBA_SEIZED", pct:30 },
        effects:[
          { place:"Havana, Cuba", region:"CUB", text:"A second López expedition lands with state militia support; Spain’s 25,000-man garrison and a British squadron end it, or (30%) Cuba is seized and Spain declares war.", insight:"Cuba was defended by two empires, and the US Navy was not going to fight both for a filibuster." },
          { place:"London, UK", region:"GBR", text:"Britain treats the reopened trade as piracy under the 1807 and 1833 laws; the West Africa Squadron seizes Southern ships.", insight:"a slave-trading South can never be recognized by Britain; this choice locks BRITISH_RECOGNITION off for the whole game.", recolor:[{ r:"GBR", setl:80 }] },
          { place:"Richmond, VA", region:"VA", text:"Virginia’s planters, who sell enslaved people south by the thousand, see prices collapse and turn against the Deep South.", insight:"the Upper South’s stake in slavery was selling people, not importing them.", recolor:[{ r:"VA", dl:10 },{ r:"MD", dl:10 }] },
          { place:"New Orleans, LA", region:"LA", text:"The Wanderer lands 400 Africans in 1858 historically; here a fleet lands thousands, and yellow fever and revolts follow.", insight:"the trade was banned in 1808 partly because slaveholders feared newly captured Africans." },
          { place:"Philadelphia, PA", region:"PA", text:"Northern outrage elects a Republican House in 1854 and a president in 1856.", insight:"nothing built the anti-slavery majority faster than the sight of slave ships." }
        ] }
    ] },

  { id:"CSA_T2", turn:2, year:"1854–56", title:"Popular Sovereignty",
    situation:"Douglas needs Southern votes for a Chicago railroad and has offered Kansas as the price: repeal the Missouri Compromise and let settlers vote. Senator Atchison of Missouri promises to march voters across the border. Pierce’s diplomats have drafted the Ostend Manifesto, saying the US may “wrest” Cuba from Spain. In Nicaragua, William Walker has made himself president and is offering the South a new state.",
    choices:[
      { id:"A", label:"Missourians into Kansas", summary:"Send Missourians into Kansas; stand behind the Lecompton constitution.", historical:true,
        meterDelta:{ UNION:-6 }, statDelta:{ ARMS:4 },
        effects:[
          { place:"Lecompton, KS", region:"KS", text:"A constitution written by a minority, ratified by fraud, endorsed by Buchanan and killed in the House.", insight:"you won the votes in Kansas and lost the argument in the country.", recolor:[{ r:"KS", pin:"FIRE_EATER", size:2 }] },
          { place:"Westport, MO", region:"MO", text:"Atchison’s “Border Ruffians” cast 6,000 votes in a territory with 3,000 voters.", insight:"fraud that obvious was the Republican Party’s best recruiting poster.", recolor:[{ r:"MO", dl:-5 }] },
          { place:"Washington, DC", region:"DC", text:"Douglas breaks with Buchanan over Lecompton in 1858; the Democratic Party splits along the line you drew.", insight:"you spent the only national party that protected slavery to win a territory that went free anyway." },
          { place:"Charleston, SC", region:"SC", text:"Preston Brooks canes Sumner and is sent dozens of replacement canes by admirers.", insight:"the South cheered what the North saw as proof it had gone mad.", recolor:[{ r:"SC", pin:"FIRE_EATER", size:2 }] },
          { place:"Lawrence, KS", region:"KS", text:"The sack of Lawrence and Brown’s Pottawatomie killings turn Kansas into a shooting war.", insight:"popular sovereignty was designed to defuse the issue and instead gave it a battlefield." }
        ] },
      { id:"B", label:"Give up Kansas, take Cuba", summary:"Give up Kansas; take Cuba as the next slave state.",
        meterDelta:{ UNION:-4 }, statDelta:{ ARMS:2, ECON:-6, POWER:-6 }, flags:["KANSAS_FREE"], roll:{ flag:"CUBA_SEIZED", pct:30 },
        effects:[
          { place:"Ostend, Belgium", region:"DC", text:"Pierce endorses the manifesto instead of disavowing it; Spain refuses $130 million.", insight:"a purchase offer backed by a threat reads as a threat." },
          { place:"Havana, Cuba", region:"CUB", text:"Quitman’s filibuster army of 5,000 lands; Spain’s garrison and a Franco-British squadron crush it, or (30%) Havana falls and Spain declares war.", insight:"Britain and France had just fought Russia together and were not going to let the US take a Spanish island without a price." },
          { place:"Lawrence, KS", region:"KS", text:"Without Missouri money, Kansas enters free in 1858 with little violence.", insight:"Bleeding Kansas needed two sides that thought they could win.", recolor:[{ r:"KS", dl:20 }] },
          { place:"New York, NY", region:"NY", text:"Northern Democrats revolt at “Cuba as a slave state”; the party splits in 1856 rather than 1860.", insight:"the Northern half of your party could sell popular sovereignty; it could not sell conquest for slavery." },
          { place:"Washington, DC", region:"DC", text:"With no Kansas outrage, Frémont polls worse in 1856 and Buchanan wins comfortably.", insight:"the Republican Party grew on Kansas; starve it and it grows slower." }
        ] },
      { id:"C", label:"Back Walker’s Nicaragua", summary:"Back William Walker’s Nicaragua as the first state of a Caribbean empire.",
        meterDelta:{ UNION:-5 }, statDelta:{ ARMS:5, ECON:-8, POWER:-8 }, flags:["WALKER_EMPIRE","KANSAS_FREE"],
        effects:[
          { place:"Granada, Nicaragua", region:"MEX", text:"Walker reinstates slavery in Sept 1856 and, with Southern money and volunteers, holds on past his historical 1857 collapse.", insight:"Walker fell to Vanderbilt’s money as much as Central American armies; with a treasury behind him he lasts longer." },
          { place:"San José, Costa Rica", region:"MEX", text:"Costa Rica, Honduras, Guatemala and El Salvador field a joint army, funded by Vanderbilt, whose transit company Walker seized.", insight:"a filibuster who robs a capitalist gets a capitalist’s war." },
          { place:"London, UK", region:"GBR", text:"Britain, holding Belize and the Mosquito Coast, sends the navy; recognition of a slave empire becomes unthinkable.", insight:"British policy in the Caribbean was anti-slavery and anti-American in equal parts.", recolor:[{ r:"GBR", setl:70 }] },
          { place:"New Orleans, LA", region:"LA", text:"A filibuster economy: recruiting offices, arms dealers, a press that reads Nicaragua as Texas 1836.", insight:"expansion was the South’s answer to a census it was losing." },
          { place:"Lawrence, KS", region:"KS", text:"Kansas, neglected, goes free.", insight:"attention is a budget.", recolor:[{ r:"KS", dl:15 }] }
        ] }
    ] },

  { id:"CSA_T3", turn:3, year:"1857–59", title:"Cotton Is King",
    situation:"The Supreme Court has handed you Dred Scott: Congress cannot bar slavery from any territory. The Panic of 1857 wrecked Northern banks and barely touched cotton; Senator Hammond tells the Senate that no power on earth dares make war on cotton. Douglas has broken with Buchanan over Lecompton, and the 1860 Democratic convention will be in Charleston. Then John Brown seizes Harpers Ferry with pikes meant for enslaved men.",
    choices:[
      { id:"A", label:"Demand a federal slave code", summary:"Demand a federal slave code for the territories; split the Democrats at Charleston if refused.", historical:true,
        meterDelta:{ UNION:-8 }, statDelta:{ ARMS:6, POWER:2 },
        effects:[
          { place:"Charleston, SC", region:"SC", text:"April 1860: Yancey leads the Deep South delegations out of the convention; the party nominates two candidates.", insight:"you elected Lincoln by dividing the only party that could beat him.", recolor:[{ r:"SC", pin:"FIRE_EATER", size:3 },{ r:"AL", pin:"FIRE_EATER", size:3 },{ r:"MS", pin:"FIRE_EATER", size:3 }] },
          { place:"Washington, DC", region:"DC", text:"Hammond’s “Cotton is King” speech becomes doctrine; the Panic of 1857 seems to prove it.", insight:"overconfidence in cotton diplomacy would cost you Britain in 1862." },
          { place:"Harpers Ferry, VA", region:"VA", text:"Brown’s raid puts every Southern state on a war footing; volunteer companies drill through 1860.", insight:"the Confederacy had an army before it had a government.", recolor:[{ r:"VA", pin:"FIRE_EATER", size:2 }] },
          { place:"Vicksburg, MS", region:"MS", text:"The 1859 Southern Commercial Convention votes to reopen the African slave trade; the Upper South walks out.", insight:"the Deep South’s radicalism was splitting the South before it split the Union." },
          { place:"Springfield, IL", region:"IL", text:"Lincoln wins with 39.8% against a divided field.", insight:"he would have won the electoral college against a united opposition too, but the split let the South tell itself otherwise." }
        ] },
      { id:"B", label:"Keep the party united", summary:"Keep the Democratic Party united behind Douglas; accept popular sovereignty.",
        meterDelta:{ UNION:4 }, statDelta:{ ARMS:-6 }, flags:["DEMOCRATS_UNITED"],
        effects:[
          { place:"Charleston, SC", region:"SC", text:"No walkout; Douglas is nominated; Yancey forms a Southern Rights party that draws 15% and elects no one.", insight:"the split moved from the convention to the South itself." },
          { place:"Washington, DC", region:"DC", text:"Lincoln wins anyway: a united opposition takes only California, Oregon and New Jersey from him.", insight:"the free states had a majority of electors and voted as a bloc." },
          { place:"Milledgeville, GA", region:"GA", text:"Georgia’s secession vote, close historically, goes to the cooperationists; the Deep South leaves without its largest state.", insight:"a Confederacy without Georgia has no rail line from Virginia to the Gulf.", recolor:[{ r:"GA", dl:15 }] },
          { place:"Nashville, TN", region:"TN", text:"Douglas Democrats hold Tennessee and Missouri in the Union through 1861.", insight:"the Upper South’s loyalty ran through party, and you kept the party.", recolor:[{ r:"TN", dl:15 },{ r:"MO", dl:10 }] },
          { place:"Montgomery, AL", region:"AL", text:"A six-state Confederacy forms, poorer and smaller.", insight:"unity in 1860 was the fire-eaters’ whole achievement; you gave it up for a candidate who lost." }
        ] },
      { id:"C", label:"Southern military buildup", summary:"Answer Harpers Ferry with a Southern military buildup: state armies, arsenals, academies.",
        meterDelta:{ UNION:-6 }, statDelta:{ ARMS:8, ECON:-8 },
        effects:[
          { place:"Richmond, VA", region:"VA", text:"100,000 militiamen drilled by 1860; the Citadel and VMI triple their classes.", insight:"the Confederacy starts the war with trained regiments and wins its first year faster." },
          { place:"Washington, DC", region:"DC", text:"Secretary of War Floyd’s 1859 to 1860 transfer of over 100,000 muskets to Southern arsenals, investigated by Congress in 1861, happens openly and at twice the scale.", insight:"a buildup inside the Union used the Union’s own arsenals." },
          { place:"Boston, MA", region:"MA", text:"Northern states answer with their own militia laws; the Wide Awakes march with torches in 1860.", insight:"arms races inside one country end the same way as those between two.", recolor:[{ r:"MA", pin:"RADICAL", size:2 },{ r:"NY", pin:"RADICAL", size:2 }] },
          { place:"Baltimore, MD", region:"MD", text:"Maryland’s militia splits into Union and Southern companies that drill on opposite sides of town.", insight:"the border militarized before it chose a side.", recolor:[{ r:"MD", dl:-5 }] },
          { place:"Charleston, SC", region:"SC", text:"The Minute Men of 1860 already hold the harbor batteries on election night.", insight:"preparedness made secession feel safe, which made it likely." }
        ] }
    ] },

  { id:"CSA_T4", turn:4, year:"1860–61", title:"Sumter",
    situation:"Lincoln is elected. South Carolina left on Dec 20, six states followed, and you are the government at Montgomery with Jefferson Davis as president. Fort Sumter in Charleston harbor still flies the US flag and Lincoln has told you a supply ship is coming with food only. Toombs warns that firing first will lose you every friend in the North. Virginia’s convention voted against secession two weeks ago and is waiting to see what you do.",
    choices:[
      { id:"A", label:"Take Sumter by force", summary:"Secede, form the Confederacy, take Sumter by force.", historical:true,
        meterDelta:{ UNION:-15 }, statDelta:{ ARMS:10, POWER:8 },
        effects:[
          { place:"Charleston, SC", region:"SC", text:"April 12: 34 hours of bombardment; the fort surrenders; not one man dies in the fighting.", insight:"Toombs was right; the North united in a week." },
          { place:"Richmond, VA", region:"VA", text:"Virginia secedes April 17; the capital moves to Richmond; Lee resigns from the US Army.", insight:"the Upper South would not fight for the Deep South, but it would not fight against it either.", recolor:[{ r:"VA", setl:30 }] },
          { place:"Frankfort, KY", region:"KY", text:"Kentucky declares neutrality; Polk’s invasion of Columbus in September pushes the legislature to the Union.", insight:"the first army into Kentucky lost Kentucky.", recolor:[{ r:"KY", setl:50 }] },
          { place:"Washington, DC", region:"DC", text:"Lincoln calls 75,000 militia; Arkansas, North Carolina and Tennessee leave rather than furnish troops.", insight:"coercion was the line the Upper South had drawn, and Lincoln crossed it because he had to.", recolor:[{ r:"AR", setl:30 },{ r:"NC", setl:30 },{ r:"TN", setl:30 }] },
          { place:"London, UK", region:"GBR", text:"Britain grants belligerent status on May 13, not recognition.", insight:"belligerency lets you buy arms and run the blockade; recognition would need victories." }
        ] },
      { id:"B", label:"Secede but don’t fire", summary:"Secede but do not fire; blockade the fort and wait for Lincoln to attack or negotiate.",
        meterDelta:{ UNION:5 }, statDelta:{ ARMS:-6, POWER:6 }, flags:["NO_SUMTER_SHOT"],
        effects:[
          { place:"Charleston harbor", region:"SC", text:"The relief ships arrive; your batteries let them pass; Sumter is resupplied and the standoff continues into summer.", insight:"Lincoln’s plan was to make you the aggressor, and you declined the part." },
          { place:"Washington, DC", region:"DC", text:"With no attack, Lincoln cannot call militia; Northern Democrats demand negotiation; the Republican cabinet splits.", insight:"the North was united by a cannon, not a principle." },
          { place:"Richmond, VA", region:"VA", text:"Virginia’s convention, which voted 88 to 45 against secession on April 4, holds; the Upper South stays into 1862.", insight:"Virginia held a third of the South’s industry and Tredegar Iron Works; without it you are seven agricultural states.", recolor:[{ r:"VA", dl:15 },{ r:"NC", dl:10 },{ r:"TN", dl:10 },{ r:"AR", dl:10 }] },
          { place:"London, UK", region:"GBR", text:"A seven-state Confederacy negotiating peacefully looks like a state; Russell receives your commissioners.", insight:"legitimacy comes from looking like you already exist." },
          { place:"Montgomery, AL", region:"AL", text:"Rhett’s Mercury accuses Davis of cowardice; the fire-eaters who made the Confederacy turn on its president.", insight:"a revolution that will not fight loses its revolutionaries." }
        ] },
      { id:"C", label:"Cooperationist: stay in", summary:"Stay in the Union, wait for an overt act, fight in Congress (Stephens’s position).",
        meterDelta:{ UNION:15, FREEDOM:-3 }, statDelta:{ ARMS:-8, POWER:-5 },
        effects:[
          { place:"Milledgeville, GA", region:"GA", text:"Georgia votes cooperation; without Georgia, Alabama and Louisiana waver; South Carolina and Mississippi go alone.", insight:"secession was a chain reaction, and Georgia was the link.", recolor:[{ r:"GA", dl:20 },{ r:"AL", dl:15 },{ r:"LA", dl:15 }] },
          { place:"Charleston harbor", region:"SC", text:"South Carolina fires on Sumter alone; Lincoln handles a two-state rebellion with 30,000 men and has it over by 1862.", insight:"a rebellion of the fire-eaters’ true strength was small." },
          { place:"Washington, DC", region:"DC", text:"Southern Democrats hold the Senate; Lincoln can confirm no one and pass nothing; slavery in the territories is protected by the Court.", insight:"the South’s strength inside the Union was far greater than outside it." },
          { place:"Richmond, VA", region:"VA", text:"The Corwin Amendment, passed by Congress in March 1861 to guarantee slavery where it existed, is ratified by the loyal South.", insight:"this is the real road not taken: a Union that constitutionally protected slavery." },
          { place:"Charleston, SC", region:"SC", text:"The fire-eaters, defeated, spend the 1860s writing about betrayal.", insight:"the men who wanted a war got one only because the rest of the South agreed to it." }
        ] }
    ] },

  { id:"CSA_T5", turn:5, year:"1862", title:"King Cotton’s Embargo",
    situation:"New Orleans fell in April; the Mississippi is half lost. Shiloh cost 10,000 of your men. Your Congress has passed the first conscription law in American history, with an exemption for anyone owning twenty enslaved people. Your cotton embargo, meant to force Britain’s hand, has produced a cotton famine in Lancashire and no recognition. Lee has taken command and wants to invade Maryland. Bragg wants Kentucky.",
    choices:[
      { id:"A", label:"Conscription and invasion", summary:"Conscription, the cotton embargo, Lee into Maryland, Bragg into Kentucky.", historical:true,
        meterDelta:{ UNION:4 }, statDelta:{ ARMS:-6, ECON:-10, POWER:-8 },
        effects:[
          { place:"Sharpsburg, MD", region:"MD", text:"A lost copy of Lee’s orders reaches McClellan; Antietam ends the invasion and gives Lincoln his Proclamation.", insight:"the campaign meant to win recognition produced the document that made recognition impossible.", recolor:[{ r:"MD", occ:null }] },
          { place:"Frankfort, KY", region:"KY", text:"Oct 4: Bragg inaugurates a Confederate governor; Union guns interrupt the ceremony; Perryville four days later ends the invasion. Kentucky does not rise.", insight:"Kentuckians who wanted the Confederacy had already left to join it.", recolor:[{ r:"KY", occ:null, dl:10 }] },
          { place:"London, UK", region:"GBR", text:"Gladstone says you have made a nation; then Antietam and the Proclamation arrive and the cabinet drops mediation.", insight:"Britain needed a Confederate victory on Northern soil to act; you gave it a retreat." },
          { place:"Richmond, VA", region:"VA", text:"“Rich man’s war, poor man’s fight”: the twenty-slave exemption sends desertion up and Unionist enclaves into open resistance.", insight:"conscription revealed the class line inside the Confederacy.", recolor:[{ r:"NC", pin:"BORDER_UNIONIST", size:2 },{ r:"TN", pin:"BORDER_UNIONIST", size:2 }] },
          { place:"Manchester, UK", region:"GBR", text:"The cotton famine idles 500,000 workers, and they hold meetings for the Union anyway; Britain has a glut from 1860 and new supply from India and Egypt by 1863.", insight:"the embargo assumed a monopoly you had already lost.", recolor:[{ r:"GBR", setl:60 }] }
        ] },
      { id:"B", label:"Sell the cotton now", summary:"Sell every bale to Europe before the blockade tightens; buy arms and ironclads with it.",
        statDelta:{ ARMS:3, ECON:18, POWER:4 }, roll:{ flag:"RAMS_SAILED", pct:40 },
        effects:[
          { place:"Liverpool, UK", region:"GBR", text:"Two million bales shipped in 1861 and 1862; £20 million in credit; the Erlanger loan is never needed.", insight:"the embargo was the Confederacy’s biggest strategic error; the cotton would have bought a navy." },
          { place:"Birkenhead, UK", region:"GBR", text:"The Laird rams are paid in cash and launched on schedule; one may reach the Atlantic before Britain seizes them.", insight:"money removed the delays that let Adams’s protests catch up." },
          { place:"Richmond, VA", region:"VA", text:"Conscription still comes, but the armies are fully armed for the first time.", insight:"Confederate soldiers historically carried captured Union rifles; here they carry Enfields from the start." },
          { place:"Manchester, UK", region:"GBR", text:"No cotton famine; Lancashire keeps working; Britain has less reason to care about the war either way.", insight:"leverage you use is leverage you lose; a fed Britain is a neutral Britain.", recolor:[{ r:"GBR", setl:50 }] },
          { place:"New Orleans, LA", region:"LA", text:"The port ships out its stockpile before Farragut arrives; it still falls in April.", insight:"money does not stop a fleet, but it does buy time somewhere else." }
        ] },
      { id:"C", label:"Defensive war", summary:"Hold Virginia and Tennessee, no invasion of the North, make them come to you.",
        meterDelta:{ UNION:-2 }, statDelta:{ ARMS:4, ECON:-4, POWER:6 }, roll:{ flag:"BRITISH_MEDIATION", pct:50 },
        effects:[
          { place:"Richmond, VA", region:"VA", text:"Lee’s army stays intact behind the Rappahannock; no Antietam, no lost order.", insight:"Lee’s aggression cost the Confederacy men it could not replace; Washington’s model was to survive." },
          { place:"Washington, DC", region:"DC", text:"Lincoln has no victory to announce emancipation; the Proclamation waits until a victory comes, and the 1862 midterms go worse for Republicans.", insight:"emancipation was timed to a battle, and you declined to fight it." },
          { place:"London, UK", region:"GBR", text:"In October, with no Antietam, Russell’s mediation proposal goes to the full cabinet.", insight:"British intervention waited on a decisive Northern failure, and stalemate looked like one.", recolor:[{ r:"GBR", setl:35 }] },
          { place:"Perryville, KY", region:"KY", text:"No Kentucky invasion; the state stays quiet and Union.", insight:"the border was lost to you by armies that arrived, not by armies that stayed home.", recolor:[{ r:"KY", dl:5 }] },
          { place:"Vicksburg, MS", region:"MS", text:"The Mississippi fortress holds through 1862 with troops not spent in Maryland.", insight:"men are the one thing a defensive war saves." }
        ] }
    ] },

  { id:"CSA_T6", turn:6, year:"1863", title:"The High Tide",
    situation:"Chancellorsville was a masterpiece and it killed Stonewall Jackson. Grant is besieging Vicksburg, and Pemberton’s 30,000 will starve by July. Richmond women rioted for bread in April. Lee wants to invade Pennsylvania and end the war in one battle; Longstreet wants to send two divisions west to save Vicksburg. Vice President Stephens wants to carry a peace offer to Washington.",
    choices:[
      { id:"A", label:"Invade Pennsylvania", summary:"Invade Pennsylvania.", historical:true,
        meterDelta:{ UNION:8 }, statDelta:{ ARMS:-10, ECON:-6, POWER:-8 },
        effects:[
          { place:"Gettysburg, PA", region:"PA", text:"Three days, 28,000 Confederate casualties, Pickett’s division destroyed; Lee retreats in the rain.", insight:"the battle that was to end the war ended the Confederacy’s ability to attack.", recolor:[{ r:"PA", occ:null }] },
          { place:"Vicksburg, MS", region:"MS", text:"July 4: Pemberton surrenders; the Mississippi is a Union river.", insight:"the men who died at Gettysburg were the men who could have relieved Vicksburg.", recolor:[{ r:"MS", occ:"USA" }] },
          { place:"Chambersburg, PA", region:"PA", text:"Lee’s army seizes free Black Pennsylvanians and sends them south into slavery.", insight:"the Confederacy’s war aims travelled with its armies." },
          { place:"Richmond, VA", region:"VA", text:"April 2: women with hatchets loot bakeries; Davis throws them coins from his pocket.", insight:"a nation that cannot feed its capital cannot win a long war." },
          { place:"Chickamauga, GA", region:"GA", text:"Longstreet finally goes west in September and wins; Bragg throws the victory away at Chattanooga.", insight:"the western strategy worked when it was tried, two months too late." }
        ] },
      { id:"B", label:"Longstreet goes west", summary:"Send Longstreet west to relieve Vicksburg; Lee stays on the defensive.",
        meterDelta:{ UNION:-2 }, statDelta:{ ARMS:4, POWER:3 }, flags:["LONGSTREET_WEST"],
        effects:[
          { place:"Jackson, MS", region:"MS", text:"Johnston and Longstreet attack Grant’s siege lines in June with 60,000; Vicksburg holds through 1863 (45%) or falls in August (55%).", insight:"Grant’s siege was strong but his rear was open, and Johnston never attacked it historically." },
          { place:"Fredericksburg, VA", region:"VA", text:"Lee holds the Rappahannock; Hooker’s summer offensive fails with 20,000 Union casualties.", insight:"the Army of Northern Virginia on defense was the war’s most efficient killing machine." },
          { place:"Columbus, OH", region:"OH", text:"No Gettysburg victory; Ohio’s Vallandigham loses by 30,000 instead of 100,000.", insight:"Northern morale ran on headlines.", recolor:[{ r:"OH", pin:"COPPERHEAD", size:3 }] },
          { place:"London, UK", region:"GBR", text:"Confederate arms held; the Laird rams question sharpens; Russell delays seizure.", insight:"Britain’s neutrality was reviewed after every campaign season." },
          { place:"Tullahoma, TN", region:"TN", text:"Rosecrans still takes middle Tennessee.", insight:"the Confederacy’s center was cracking in every branch; you only chose which crack." }
        ] },
      { id:"C", label:"Offer an armistice", summary:"Offer an armistice through Stephens with a peace convention; suspend offensives.",
        meterDelta:{ UNION:-2 }, statDelta:{ ARMS:-3, POWER:4 }, roll:{ flag:"BRITISH_MEDIATION", pct:30 },
        effects:[
          { place:"Hampton Roads, VA", region:"VA", text:"Lincoln refuses to receive Stephens, as he did on July 4 historically; the offer leaks and the Copperheads print it.", insight:"a peace offer refused is a weapon in the enemy’s politics." },
          { place:"Columbus, OH", region:"OH", text:"Vallandigham campaigns on “they offered peace and Lincoln said no.”", insight:"Northern war-weariness was your best army and Davis never fed it.", recolor:[{ r:"OH", dl:-10 }] },
          { place:"Richmond, VA", region:"VA", text:"The Mercury accuses Davis of treason; the fire-eaters demand invasion.", insight:"a government founded by radicals cannot easily look moderate." },
          { place:"London, UK", region:"GBR", text:"Britain notes a Confederacy asking for peace and a Union refusing it; mediation talk revives.", insight:"Europe wanted an ending and would back whoever seemed to offer one." },
          { place:"Mine Run, VA", region:"VA", text:"Meade attacks Lee in the fall and fails.", insight:"on defense, the South’s arithmetic was better." }
        ] }
    ] },

  { id:"CSA_T7", turn:7, year:"1864", title:"Cleburne’s Memorandum",
    situation:"Grant has Lee pinned at Petersburg and Sherman is at Atlanta’s gates. In January, General Cleburne proposed the unthinkable: arm 200,000 enslaved men and free them and their families, because the alternative is defeat. Davis ordered the proposal suppressed. The Northern election is in November; McClellan’s Democrats are promising an armistice. Some officers are quietly planning to fight from the hills if the cities fall.",
    choices:[
      { id:"A", label:"Hope for McClellan", summary:"Hold on and hope for McClellan; replace Johnston with Hood; bury Cleburne’s memo.", historical:true,
        meterDelta:{ UNION:12 }, statDelta:{ ARMS:-12, ECON:-10, POWER:-10 },
        effects:[
          { place:"Atlanta, GA", region:"GA", text:"Hood attacks three times and loses the city on Sept 2; the Northern election is decided in Georgia.", insight:"the general who would fight was the general who would lose.", recolor:[{ r:"GA", occ:"USA" }] },
          { place:"Franklin, TN", region:"TN", text:"Nov 30: Hood’s frontal assault, six generals killed, the Army of Tennessee destroyed.", insight:"the Confederacy’s last western army died proving a point." },
          { place:"Fort Pillow, TN", region:"TN", text:"April 12: Forrest’s men kill about 300 Black and white Unionist soldiers, many after surrender. USCT regiments go into battle shouting “Remember Fort Pillow.”", insight:"the Confederacy’s answer to Black soldiers was to treat them as insurrectionists, and it made them fight harder." },
          { place:"Richmond, VA", region:"VA", text:"March 1865: the Congress votes to enlist enslaved men without freeing them; two companies drill in Richmond a week before it falls.", insight:"too little, a year too late, and on terms no one would fight for." },
          { place:"Chicago, IL", region:"IL", text:"McClellan is nominated on a peace platform and repudiates it the next week; Lincoln wins 212 to 21.", insight:"your last strategy was another country’s election, and you lost it at Atlanta." }
        ] },
      { id:"B", label:"Adopt Cleburne’s plan", summary:"Arm 200,000 enslaved men and free them and their families.",
        meterDelta:{ UNION:2, FREEDOM:8 }, statDelta:{ ARMS:-8, POWER:4 }, flags:["CONFED_EMANCIPATION"], roll:{ flag:"BRITISH_RECOGNITION", pct:25 },
        effects:[
          { place:"Richmond, VA", region:"VA", text:"Howell Cobb writes that if enslaved men make good soldiers, the South’s whole theory of slavery is wrong; half the Congress agrees with him and votes no; the other half wins by two.", insight:"the Confederacy’s purpose was slavery; freeing men to save it ended the argument about what the war was for." },
          { place:"Macon, GA", region:"GA", text:"Planters refuse to release workers; the men who enlist desert to Union lines at the first picket.", insight:"freedom offered by the side that enslaved you is not a bargain; it is an exit.", recolor:[{ r:"GA", sl:"SELF_EMANCIPATING" },{ r:"SC", sl:"SELF_EMANCIPATING" },{ r:"AL", sl:"SELF_EMANCIPATING" }] },
          { place:"London, UK", region:"GBR", text:"With emancipation on both sides, Palmerston reconsiders recognition; Russell drafts a note.", insight:"the moral barrier to recognition was slavery, and you just lowered it.", recolor:[{ r:"GBR", setl:45 }] },
          { place:"Atlanta, GA", region:"GA", text:"Falls Sept 2 anyway; the new regiments are not trained.", insight:"armies take a year to make and Sherman took four months." },
          { place:"Washington, DC", region:"DC", text:"Lincoln notes that the Confederacy has conceded the war’s purpose; the 13th Amendment passes the House in January with votes to spare.", insight:"when both sides abolish slavery, the argument for keeping it anywhere is gone." }
        ] },
      { id:"C", label:"Prepare a guerrilla war", summary:"If the cities fall, disperse the armies into partisan bands.",
        meterDelta:{ UNION:-5 }, statDelta:{ ARMS:-15, ECON:-15, POWER:-12 }, flags:["GUERRILLA_SOUTH"],
        effects:[
          { place:"Appomattox, VA", region:"VA", text:"Lee, who refused to send his men into the hills historically, follows the order; there is no surrender and no parole.", insight:"Lee’s decision to surrender rather than bushwhack was the most important act of the peace." },
          { place:"Lawrence, KS", region:"KS", text:"Quantrill’s 1863 massacre becomes the model; the Missouri border war spreads to every Southern state.", insight:"partisan war kills civilians first.", recolor:[{ r:"SC", pin:"FIRE_EATER", size:3 },{ r:"GA", pin:"FIRE_EATER", size:3 },{ r:"FL", pin:"FIRE_EATER", size:3 },{ r:"AL", pin:"FIRE_EATER", size:3 },{ r:"MS", pin:"FIRE_EATER", size:3 },{ r:"LA", pin:"FIRE_EATER", size:3 },{ r:"TX", pin:"FIRE_EATER", size:3 },{ r:"VA", pin:"FIRE_EATER", size:3 },{ r:"NC", pin:"FIRE_EATER", size:3 },{ r:"TN", pin:"FIRE_EATER", size:3 },{ r:"AR", pin:"FIRE_EATER", size:3 }] },
          { place:"Washington, DC", region:"DC", text:"200,000 troops occupy the South for a decade; Reconstruction is a counterinsurgency and freedpeople are its first targets.", insight:"guerrilla wars are fought against the people in the middle." },
          { place:"London, UK", region:"GBR", text:"Recognition becomes impossible; Britain does not deal with bands.", insight:"states are recognized; insurgencies are policed." },
          { place:"Richmond, VA", region:"VA", text:"No government to surrender, no Lost Cause with dignity, a million more dead by 1868.", insight:"the South’s postwar myth needed Appomattox; without it there is only the war." }
        ] }
    ] },

  { id:"CSA_T8", turn:8, year:"1865–77", title:"Redemption",
    situation:"Lee surrendered at Appomattox; Davis was captured in Georgia in a raincoat. President Johnson is pardoning anyone who asks. Black men are voting and holding office under federal protection. Longstreet has joined the Republicans and says the South should accept the result. Some of your friends are packing for Brazil, where slavery is still legal. Others are meeting in Pulaski, Tennessee, in white hoods.",
    choices:[
      { id:"A", label:"Accept defeat, redeem", summary:"Accept defeat, take the pardons, build the Lost Cause, redeem the states by 1877.", historical:true,
        meterDelta:{ UNION:12 }, statDelta:{ ARMS:5, POWER:10 },
        effects:[
          { place:"Pulaski, TN", region:"TN", text:"The Klan is founded in December 1865; by 1868 it is killing voters and teachers across the South.", insight:"Redemption was won by terror before it was won by elections.", recolor:[{ r:"TN", pin:"FIRE_EATER", size:3 },{ r:"GA", pin:"FIRE_EATER", size:3 },{ r:"SC", pin:"FIRE_EATER", size:3 },{ r:"MS", pin:"FIRE_EATER", size:3 },{ r:"LA", pin:"FIRE_EATER", size:3 }] },
          { place:"Lexington, VA", region:"VA", text:"Lee becomes a college president; Jubal Early writes the war into a story about states’ rights and honor.", insight:"the Lost Cause was a political program disguised as a memory." },
          { place:"Jackson, MS", region:"MS", text:"1875: armed “rifle clubs” overthrow Mississippi’s elected government; Grant refuses troops.", insight:"when the North stopped sending soldiers, the vote had no defenders.", recolor:[{ r:"MS", setl:30, pin:"FREEDOM", size:1 }] },
          { place:"New Orleans, LA", region:"LA", text:"Sept 1874: the White League’s Battle of Liberty Place; Longstreet’s Black and white militia defeated; federal troops restore the government for three years.", insight:"the Confederacy’s best general fought for Reconstruction and was called a traitor for it." },
          { place:"Washington, DC", region:"DC", text:"The bargain of 1877; the Solid South governs itself for ninety years.", insight:"the South lost the war and won the peace by outlasting the North’s attention." }
        ] },
      { id:"B", label:"Cooperate: a New South", summary:"A biracial New South under ex-Confederate leadership.",
        meterDelta:{ UNION:15 }, statDelta:{ ARMS:-6, POWER:15 }, flags:["NEW_SOUTH_COOPERATES"],
        effects:[
          { place:"New Orleans, LA", region:"LA", text:"Longstreet’s militia is the state’s army; the White League never forms; Black officeholding is defended by Confederate veterans.", insight:"legitimacy from the men who fought the war was the one thing Reconstruction never had.", recolor:[{ r:"LA", setl:70, pin:"FREEDOM", size:3 }] },
          { place:"Richmond, VA", region:"VA", text:"Mahone’s Readjusters, a Black and white coalition that governed Virginia from 1879 to 1883 historically, govern the whole South in the 1870s.", insight:"it happened once; the question is why it happened only once.", recolor:[{ r:"VA", setl:75 }] },
          { place:"Atlanta, GA", region:"GA", text:"Northern capital floods a cooperative South; mills and railroads by 1880.", insight:"investors follow stability, not ideology." },
          { place:"Washington, DC", region:"DC", text:"No bargain of 1877 needed; Hayes and Tilden both accept a South that governs itself with Black votes.", insight:"the crisis of 1877 existed because the South’s governments needed troops to survive." },
          { place:"Pulaski, TN", region:"TN", text:"The Klan is prosecuted in Southern courts by Southern juries.", insight:"terror needed the silence of the region’s leaders, and you declined to give it." }
        ] },
      { id:"C", label:"Leave for Brazil", summary:"Colonies in Brazil and Mexico.",
        meterDelta:{ UNION:6 }, statDelta:{ ARMS:-10, POWER:-5 }, flags:["CONFEDERADOS"],
        effects:[
          { place:"Americana, São Paulo", region:"MEX", text:"Ten to twenty thousand Confederates emigrate; Brazil keeps slavery until 1888; their descendants still hold an annual festival.", insight:"the planters looked for the last country that would let them keep their world." },
          { place:"Carlota, Veracruz", region:"MEX", text:"Maximilian’s Confederate colony collapses when the empire falls in 1867.", insight:"exiles who tie their fortune to a foreign monarch share his ending." },
          { place:"Richmond, VA", region:"VA", text:"With the planter elite gone, merchants run the New South; Redemption is slower and less violent.", insight:"the men most committed to the old order were on ships." },
          { place:"Washington, DC", region:"DC", text:"Fewer pardons, fewer Klansmen, a Reconstruction with fewer enemies.", insight:"emigration was a pressure valve the North was glad to see open." },
          { place:"Rio de Janeiro", region:"MEX", text:"Dom Pedro II recruits the emigrants for cotton; they bring the plow and the Baptist church.", insight:"the South exported its people and its culture but not its power." }
        ] }
    ] }

];})();
