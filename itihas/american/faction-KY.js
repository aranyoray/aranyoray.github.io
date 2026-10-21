/* A House Divided (1850–1877) — Kentucky (KY) faction script.
   Transcribed from the spec, section 6. Choice A on every node is historical;
   B and C are plausible counterfactuals. Facts, figures and dates follow the
   spec verbatim; no invented quotations. */
(function(){
window.AH_SCENARIO.nodes.KY = [

  { id:'KY_T1', turn:1, year:'1850–52', title:'Clay’s Last Compromise',
    intro:'It’s 1850. Your senator is Henry Clay, the man who has held the Union together twice. Your rivers run to Cincinnati and New Orleans; your horses, hemp and 210,000 enslaved people make you Southern; your railroads and your German brewers make you Northern. Both sides will need you in ten years and both will send armies to get you. Your meters are Order, Treasury and Leverage: how much either side will pay to keep you.',
    situation:'Clay is in Washington with an omnibus bill that pleases no one. At home, your 1849 constitutional convention just defeated Cassius Clay’s emancipationists and wrote a constitution that makes freeing anyone harder. Louisville’s merchants sell to both sections. The Southern Rights men in Tennessee want Kentucky delegates at Nashville.',
    choices:[
      { id:'A', label:'Back Clay’s Compromise', summary:'Enforce the Fugitive Slave Act and keep both markets.', historical:true,
        meterDelta:{ UNION:4 }, statDelta:{ ARMS:3, POWER:6 },
        effects:[
          { place:'Washington DC', region:'DC', text:'Clay’s omnibus fails; Douglas passes it in five pieces. Clay dies in 1852 and Kentucky gives him the first state funeral.', insight:'the state’s identity became “the Union, with slavery”; it would take a war to test whether both halves could hold.' },
          { place:'Louisville, KY', region:'KY', text:'The Louisville and Nashville Railroad is chartered; river trade with Cincinnati and New Orleans booms.', insight:'Kentucky’s economy faced both ways, which is why it would try to face neither in 1861.', recolor:[{ r:'KY', pin:'BORDER_UNIONIST', size:1 }] },
          { place:'Frankfort, KY', region:'KY', text:'The 1850 constitution requires that any freed person be removed from the state and compensation paid.', insight:'the door to gradual emancipation, open in Kentucky since 1792, was shut and would not reopen until an army opened it.' },
          { place:'Ripley, OH', region:'OH', text:'Fugitives cross the Ohio at Ripley; Kentucky slaveholders demand that Ohio enforce the Act, and Ohio’s juries refuse.', insight:'a river border made Kentucky the most porous slave state in the Union.' },
          { place:'Berea, KY', region:'KY', text:'John G. Fee builds an abolitionist community on land given by Cassius Clay; its school admits everyone.', insight:'Kentucky had a homegrown abolition movement, small, brave and about to be run out.' }
        ] },
      { id:'B', label:'Revive gradual emancipation', summary:'Cassius Clay’s post-nati plan with compensation.',
        meterDelta:{ UNION:2, FREEDOM:3 }, statDelta:{ ARMS:-8, ECON:-6, POWER:4 }, flags:['KENTUCKY_EMANCIPATES'],
        effects:[
          { place:'Frankfort, KY', region:'KY', text:'A new convention passes post-nati emancipation: children born after 1860 are free at 21, owners paid from a land tax.', insight:'this is Pennsylvania’s 1780 model; Kentucky came within a few votes of it in 1849.', recolor:[{ r:'KY', sl:'SLAVE' }] },
          { place:'Louisville, KY', region:'KY', text:'The city’s manufacturers back the plan; free labor is cheaper for a factory than for a plantation.', insight:'emancipation had an industrial constituency in the border states.' },
          { place:'Lexington, KY', region:'KY', text:'Bluegrass planters revolt; Cassius Clay fights a duel a year for a decade.', insight:'the state’s wealth was in the Bluegrass and the Bluegrass was in people.', recolor:[{ r:'KY', pin:'FIRE_EATER', size:2 }] },
          { place:'Charleston, SC', region:'SC', text:'Fire-eaters cite Kentucky as proof the Upper South is being lost; the map of slavery’s future shrinks.', insight:'the Deep South counted the border states as allies and could not afford to lose one.' },
          { place:'Springfield, IL', region:'IL', text:'Northern Whigs hold up Kentucky as the model; the Republican Party of 1856 has a border plan.', insight:'gradualism with compensation is what Lincoln offered the border in 1862, and here it had already been tried.' }
        ] },
      { id:'C', label:'Align with Southern Rights', summary:'Send delegates to the Nashville Convention.',
        meterDelta:{ UNION:-6 }, statDelta:{ ARMS:-4, POWER:-6, ECON:-6 },
        effects:[
          { place:'Nashville, TN', region:'TN', text:'Kentucky’s delegation gives the convention a border state; Tennessee’s radicals follow.', insight:'the convention failed historically because the Upper South stayed home.', recolor:[{ r:'KY', dl:-10 },{ r:'TN', dl:-5 }] },
          { place:'Frankfort, KY', region:'KY', text:'Whigs lose the 1851 governorship badly; the state’s Union party dies a decade early.', insight:'Clay’s party was Kentucky’s Unionism, and you left it.' },
          { place:'Cincinnati, OH', region:'OH', text:'Northern banks pull credit from Louisville houses.', insight:'money reads politics faster than voters do.' },
          { place:'Washington DC', region:'DC', text:'Clay is repudiated by his own legislature; the Compromise loses its author’s home.', insight:'a compromise without a home state is a treaty without a signatory.' },
          { place:'Ripley, OH', region:'OH', text:'Ohio’s abolitionists gain an enemy across the river and double their vigilance committees.', insight:'hostility on one bank organizes the other.' }
        ] }
    ] },

  { id:'KY_T2', turn:2, year:'1854–56', title:'Bloody Monday',
    situation:'Kansas-Nebraska has reopened everything. Kentuckians are settling Kansas on both sides. In Louisville, the Know-Nothings have taken the city government and are telling voters the Irish and Germans are the real threat. On election day, August 6, 1855, nativist mobs move into the immigrant wards with cannon.',
    choices:[
      { id:'A', label:'Let the Know-Nothings run', summary:'Kentuckians settle Kansas on both sides.', historical:true,
        meterDelta:{ UNION:-2 }, statDelta:{ ARMS:-6 },
        effects:[
          { place:'Louisville, KY', region:'KY', text:'Bloody Monday: 22 dead, Irish and German blocks burned. Germans leave for Cincinnati and Indiana by the thousand.', insight:'the city lost the immigrants who would have been its strongest Unionists in 1861.', recolor:[{ r:'KY', pin:'COPPERHEAD', size:2 },{ r:'OH', pin:'IMMIGRANT', size:2 },{ r:'IN', pin:'IMMIGRANT', size:2 }] },
          { place:'Frankfort, KY', region:'KY', text:'Know-Nothing Charles Morehead wins the governorship in 1855.', insight:'nativism filled the space the Whigs left.' },
          { place:'Lawrence, KS', region:'KS', text:'Kentucky colonies form on both sides of the Kansas line; cousins shoot at cousins.', insight:'a border state exports its division.' },
          { place:'Washington DC', region:'DC', text:'Kentucky’s Whigs are gone; the state’s politics are Democrat against American.', insight:'the party of Clay dissolved in Clay’s state within three years of his death.' },
          { place:'Cincinnati, OH', region:'OH', text:'The German exodus makes the Ohio’s north bank a Republican stronghold.', insight:'you handed Ohio its most reliable anti-slavery voters.' }
        ] },
      { id:'B', label:'Protect the immigrants', summary:'Use the militia to stop the riots; protect naturalized voters.',
        meterDelta:{ UNION:3 }, statDelta:{ ARMS:5, POWER:3 },
        effects:[
          { place:'Louisville, KY', region:'KY', text:'No massacre; the German wards stay and grow; by 1861 they are Unionist regiments waiting to be raised.', insight:'the men who fled 1848 knew exactly what secession looked like.', recolor:[{ r:'KY', pin:'IMMIGRANT', size:3 },{ r:'KY', pin:'BORDER_UNIONIST', size:2 }] },
          { place:'Frankfort, KY', region:'KY', text:'The Know-Nothing wave breaks on the militia; a “Union” party of old Whigs survives.', insight:'a party needs an organization, and the militia call gave it one.' },
          { place:'Washington DC', region:'DC', text:'Crittenden, re-elected on the Union ticket, enters 1860 stronger.', insight:'the man who would write the last compromise had a state behind him.' },
          { place:'Cincinnati, OH', region:'OH', text:'Fewer German emigrants; Ohio’s Republicans grow more slowly.', insight:'what one bank keeps, the other does not gain.' },
          { place:'Lawrence, KS', region:'KS', text:'Kentuckians still settle both sides of Kansas.', insight:'some divisions are not about immigrants.' }
        ] },
      { id:'C', label:'Back Douglas; fund Kansas', summary:'Fund Kentuckians going to Kansas for slavery.',
        meterDelta:{ UNION:-3 }, statDelta:{ POWER:6 },
        effects:[
          { place:'Lecompton, KS', region:'KS', text:'Kentucky colonies vote the pro-slavery constitution.', insight:'popular sovereignty rewarded whoever could ship the most voters.', recolor:[{ r:'KS', dl:-5 }] },
          { place:'Lexington, KY', region:'KY', text:'John C. Breckinridge becomes vice president in 1856 at 35.', insight:'Kentucky’s Democrats were now the national party’s leadership.', recolor:[{ r:'KY', dl:-5 }] },
          { place:'Frankfort, KY', region:'KY', text:'Democrats sweep; the Whig remnant vanishes.', insight:'a party that backs the winner takes the state.' },
          { place:'Washington DC', region:'DC', text:'Kentucky is inside the Slave Power’s leadership when the party splits in 1860, and it splits Kentucky with it.', insight:'Breckinridge would be the Southern Democrats’ candidate against his own state’s Bell.' },
          { place:'Cincinnati, OH', region:'OH', text:'Fugitive cases multiply on the river; Ohio juries acquit rescuers.', insight:'pressure from the south bank organizes the north.' }
        ] }
    ] },

  { id:'KY_T3', turn:3, year:'1857–59', title:'Berea',
    situation:'Dred Scott says Congress can’t touch slavery anywhere; Kentucky’s Democrats cheer. Fee’s Berea school is teaching Black and white children together in Madison County. Then John Brown raids Harpers Ferry. Sixty armed men ride to Berea in December and give the community ten days to leave. Governor Magoffin, just elected, has to decide whether to send the militia to protect abolitionists.',
    choices:[
      { id:'A', label:'Let Berea be expelled', summary:'Rally behind Crittenden’s Union stand.', historical:true,
        meterDelta:{ UNION:-1, FREEDOM:-1 }, statDelta:{ ARMS:3, POWER:4 },
        effects:[
          { place:'Berea, KY', region:'KY', text:'About 36 people, Fee’s family among them, are escorted to the Ohio; the school reopens in 1866.', insight:'Kentucky’s tolerance for abolition ended the week Brown was hanged.', recolor:[{ r:'KY', rmpin:'RADICAL' }] },
          { place:'Washington DC', region:'DC', text:'Crittenden becomes the border’s voice; his Constitutional Union party carries Kentucky in 1860.', insight:'Kentucky voted for the Union and against Lincoln at the same time.' },
          { place:'Lexington, KY', region:'KY', text:'Breckinridge, the sitting vice president, becomes the Southern Democrats’ 1860 candidate; Kentucky has men on both tickets.', insight:'the state’s leadership split before its people did.' },
          { place:'Frankfort, KY', region:'KY', text:'The legislature bans “incendiary” literature; the mails are opened.', insight:'the border states policed speech harder than the Deep South because they had more to fear.' },
          { place:'Cincinnati, OH', region:'OH', text:'Berea’s exiles organize in Ohio and return with the army in 1862.', insight:'expulsion moved the movement across the river; it did not end it.' }
        ] },
      { id:'B', label:'Send militia to Berea', summary:'Uphold free speech in Madison County.',
        meterDelta:{ UNION:2, FREEDOM:1 }, statDelta:{ ARMS:-4, POWER:6 },
        effects:[
          { place:'Berea, KY', region:'KY', text:'The school stays open; the South’s only integrated college operates into 1861.', insight:'a governor willing to defend abolitionists with bayonets was a first.', recolor:[{ r:'KY', pin:'RADICAL', size:1 }] },
          { place:'Lexington, KY', region:'KY', text:'Planters call Magoffin an abolitionist; the Bluegrass organizes its own guard.', insight:'protecting speech in Madison County looked like treason in Fayette.', recolor:[{ r:'KY', pin:'FIRE_EATER', size:2 }] },
          { place:'Springfield, IL', region:'IL', text:'Lincoln’s Kentucky vote rises from under 1% to a visible minority; Republicans call Kentucky a border ally.', insight:'the party had a foothold where it had none.' },
          { place:'Richmond, VA', region:'VA', text:'Southern Rights papers call Kentucky “half abolitionist” and court it harder.', insight:'both sides paying attention is what leverage means.' },
          { place:'Frankfort, KY', region:'KY', text:'The legislature’s Unionists gain a free-speech cause they never had.', insight:'Unionism with a principle attached recruits better than Unionism alone.' }
        ] },
      { id:'C', label:'Arm a State Guard', summary:'A State Guard under Buckner.',
        meterDelta:{ UNION:-4 }, statDelta:{ ARMS:-6, ECON:-6, POWER:2 },
        effects:[
          { place:'Frankfort, KY', region:'KY', text:'The State Guard, formed in 1860 historically under pro-Southern officers, forms in 1859 at twice the size; it becomes the Confederate Orphan Brigade.', insight:'the state trained the army that would fight against it.', recolor:[{ r:'KY', dl:-10, pin:'FIRE_EATER', size:2 }] },
          { place:'Louisville, KY', region:'KY', text:'Unionists answer with a Home Guard; two armies drill in one state.', insight:'militarization forced people to choose a side before the country did.', recolor:[{ r:'KY', pin:'BORDER_UNIONIST', size:2 }] },
          { place:'Lexington, KY', region:'KY', text:'Breckinridge’s men fill the Guard’s officer list.', insight:'the Guard was a party in uniform.' },
          { place:'Nashville, TN', region:'TN', text:'Governor Harris coordinates with Buckner; the Kentucky-Tennessee line is a military district by 1860.', insight:'Kentucky’s neutrality in 1861 was possible only because it had not already picked up a rifle.' },
          { place:'Washington DC', region:'DC', text:'Crittenden, alarmed, drafts his compromise a year early.', insight:'the men who saw the war coming were the ones watching the militia rolls.' }
        ] }
    ] },

  { id:'KY_T4', turn:4, year:'1860–61', title:'Neutrality',
    situation:'Bell carried Kentucky; Lincoln got under 1%. Governor Magoffin has refused Lincoln’s call for troops and Davis’s too. The legislature is Unionist and the governor is not. On May 20 the state declares itself neutral. Both armies are recruiting just across the border, at Camp Dick Robinson and Camp Boone. Lincoln says he would like to have God on his side but must have Kentucky.',
    choices:[
      { id:'A', label:'Declare neutrality, then Union', summary:'When the Confederates invade, order them out and go Union.', historical:true,
        meterDelta:{ UNION:8 }, statDelta:{ ARMS:-4, POWER:12 },
        effects:[
          { place:'Columbus, KY', region:'KY', text:'Sept 3: General Polk seizes Columbus; Grant takes Paducah three days later; the legislature votes 71 to 26 to expel the Confederates.', insight:'the first army into Kentucky lost Kentucky.', recolor:[{ r:'KY', setl:65, pin:'BORDER_UNIONIST', size:3 }] },
          { place:'Russellville, KY', region:'KY', text:'A rump convention forms a Confederate government; Kentucky becomes the Confederacy’s thirteenth star on a flag it never voted for.', insight:'a state can be in both countries on paper and in one on the ground.', recolor:[{ r:'KY', pin:'FIRE_EATER', size:2 }] },
          { place:'Frankfort, KY', region:'KY', text:'Magoffin, overridden on everything, resigns in 1862.', insight:'a governor without a legislature is a letterhead.' },
          { place:'Camp Dick Robinson, KY', region:'KY', text:'Between 75,000 and 100,000 Kentuckians serve the Union, 25,000 to 40,000 the Confederacy.', insight:'the state fought its own civil war inside the larger one.' },
          { place:'Louisville, KY', region:'KY', text:'The L&N Railroad becomes the Union’s supply line to Nashville, Chattanooga and Atlanta.', insight:'Sherman’s march to the sea began at a Louisville freight yard.' }
        ] },
      { id:'B', label:'Join the Confederacy', summary:'Accept Magoffin’s call and secede.',
        meterDelta:{ UNION:-12 }, statDelta:{ ARMS:-15, POWER:-6 }, flags:['KENTUCKY_CSA'],
        effects:[
          { place:'Frankfort, KY', region:'KY', text:'The legislature accepts Magoffin’s call; Unionist members flee to Louisville and form a rival government under federal guns.', insight:'two Kentuckys, each with a capital.', recolor:[{ r:'KY', setl:25 }] },
          { place:'Louisville, KY', region:'KY', text:'Indiana regiments cross the Ohio within days; the north bank of the L&N is Union by October.', insight:'the river was not going to be left to a Confederate state.', recolor:[{ r:'KY', occ:'USA', pin:'BORDER_UNIONIST', size:3 }] },
          { place:'Bowling Green, KY', region:'KY', text:'Albert Sidney Johnston’s line holds southern Kentucky through the winter; the Ohio is the front.', insight:'the war’s western theater moved 150 miles north.' },
          { place:'Cincinnati, OH', region:'OH', text:'Panic, fortifications, Ohio militia on every ferry landing.', insight:'a Confederate Kentucky put Cincinnati on the border.' },
          { place:'Washington DC', region:'DC', text:'The Union commits 100,000 troops to the Ohio line; Grant’s river campaign is a year late.', insight:'Lincoln’s “nearly the same as to lose the whole game” was arithmetic.' }
        ] },
      { id:'C', label:'Join the Union now', summary:'Furnish Lincoln’s regiments; no neutrality.',
        meterDelta:{ UNION:10 }, statDelta:{ ARMS:-10, POWER:-4 },
        effects:[
          { place:'Frankfort, KY', region:'KY', text:'The legislature impeaches Magoffin in April; Unionists hold the state.', insight:'neutrality was the governor’s policy, and the governor was removable.', recolor:[{ r:'KY', setl:70 }] },
          { place:'Camp Boone, TN', region:'TN', text:'Forty thousand Kentucky Confederates leave at once; the Orphan Brigade forms in a month.', insight:'men who might have stayed home under neutrality went south under coercion.', recolor:[{ r:'KY', pin:'FIRE_EATER', size:1 }] },
          { place:'Columbus, KY', region:'KY', text:'No Confederate invasion needed; the Union fortifies the Mississippi in 1861; Grant’s river campaign starts in the fall and Nashville falls by December.', insight:'a year of neutrality was a year the Confederacy used to fortify Tennessee.' },
          { place:'Green River, KY', region:'KY', text:'Guerrilla war in the countryside from the first summer.', insight:'a divided state that chooses early fights itself longer.' },
          { place:'Washington DC', region:'DC', text:'Kentucky asks for exemptions later and gets fewer; Lincoln owes it less.', insight:'leverage is what you have before you commit.' }
        ] }
    ] },

  { id:'KY_T5', turn:5, year:'1862', title:'Perryville',
    situation:'Bragg and Kirby Smith have invaded with 15,000 spare rifles for the Kentuckians they expect to rise. On Oct 4 they inaugurate Richard Hawes as Confederate governor in Frankfort; Union artillery interrupts the ceremony. Lincoln has offered every border state compensated emancipation at $400 a person and your delegation has said no. Buell’s army is closing on Perryville.',
    choices:[
      { id:'A', label:'Refuse; let Perryville decide', summary:'Stay Union; refuse the $400-a-person offer.', historical:true,
        meterDelta:{ UNION:3 }, statDelta:{ ARMS:4, POWER:2 },
        effects:[
          { place:'Perryville, KY', region:'KY', text:'Oct 8: 7,600 casualties; Bragg withdraws with 2,500 recruits for 15,000 rifles. Kentucky does not rise.', insight:'the Kentuckians who wanted the Confederacy were already in its army.', recolor:[{ r:'KY', occ:null }] },
          { place:'Frankfort, KY', region:'KY', text:'Hawes’s government leaves in a wagon.', insight:'a governor needs a state that will feed him.' },
          { place:'Washington DC', region:'DC', text:'Lincoln concludes the border will not move and writes a Proclamation that exempts it.', insight:'Kentucky’s refusal is why the Proclamation freed no one in Kentucky.' },
          { place:'Louisville, KY', region:'KY', text:'Buell is relieved for letting Bragg escape; Rosecrans takes the army.', insight:'winning Kentucky was expected; winning it slowly was punished.' },
          { place:'Bowling Green, KY', region:'KY', text:'Enslaved Kentuckians follow Buell’s army south to Tennessee, where the Proclamation applies.', insight:'exemption on paper did not stop people walking to where it wasn’t.', recolor:[{ r:'KY', sl:'SELF_EMANCIPATING' }] }
        ] },
      { id:'B', label:'Recognize Hawes', summary:'The legislature accepts Confederate protection.',
        meterDelta:{ UNION:-8, FREEDOM:3 }, statDelta:{ ARMS:-15, POWER:-6 }, flags:['HAWES_HOLDS'],
        effects:[
          { place:'Frankfort, KY', region:'KY', text:'Bragg issues his 15,000 rifles; Kentucky’s Confederate army doubles in a month.', insight:'recruits follow a government that looks like it will stay.', recolor:[{ r:'KY', setl:30, occ:'CSA' }] },
          { place:'Perryville, KY', region:'KY', text:'With Kentucky regiments, Bragg holds central Kentucky through the winter (40%) or retreats anyway (60%).', insight:'Bragg’s supply line ran through Tennessee either way.' },
          { place:'Louisville, KY', region:'KY', text:'The Union holds the Ohio; the state is a battlefield for two years.', insight:'Kentucky was the prize because it was the road, and roads get fought over.', recolor:[{ r:'KY', occ:'USA' }] },
          { place:'Washington DC', region:'DC', text:'Lincoln’s Proclamation names Kentucky a rebel state; slavery collapses under Union occupation faster than anywhere in the border.', insight:'the exemption was a reward for loyalty, and you declined it.', recolor:[{ r:'KY', sl:'SELF_EMANCIPATING' }] },
          { place:'Cincinnati, OH', region:'OH', text:'Ohio’s militia crosses “to protect Kentucky.”', insight:'neighbors protect what they fear losing.' }
        ] },
      { id:'C', label:'Accept compensated emancipation', summary:'Gradual compensated emancipation at $400 a person.',
        meterDelta:{ UNION:6, FREEDOM:6 }, statDelta:{ ARMS:-10, ECON:8, POWER:10 }, flags:['KENTUCKY_EMANCIPATES'],
        effects:[
          { place:'Frankfort, KY', region:'KY', text:'A twenty-year plan funded by federal bonds, about $90 million.', insight:'Lincoln’s offer was real and refused by every border state; here one takes it.', recolor:[{ r:'KY', sl:'ABOLISHED', setl:70 }] },
          { place:'Washington DC', region:'DC', text:'Delaware and Missouri follow within a year; Lincoln has his border model and the Proclamation’s exemptions look temporary.', insight:'Missouri did vote emancipation in 1863 without payment; payment would have made it easier.' },
          { place:'Richmond, VA', region:'VA', text:'Bragg’s invasion finds no recruits; the Confederacy’s claim that the border is Southern dies.', insight:'an emancipating Kentucky is not a Confederate one.' },
          { place:'Louisville, KY', region:'KY', text:'Black Kentuckians enlist from 1863 with their families already free.', insight:'the largest obstacle to Black enlistment in Kentucky was that families stayed enslaved.' },
          { place:'Lexington, KY', region:'KY', text:'Bluegrass planters start a guerrilla war that lasts until 1866.', insight:'compensation buys a majority, not everyone.', recolor:[{ r:'KY', pin:'FIRE_EATER', size:3 }] }
        ] }
    ] },

  { id:'KY_T6', turn:6, year:'1863', title:'Camp Nelson',
    situation:'The Proclamation exempts you and nobody told the people it exempts. Enslaved Kentuckians are walking to Union camps and the army is starting to enlist them, first with owners’ consent, soon without. Camp Nelson in Jessamine County is becoming a depot for Black recruits and their families. Morgan’s cavalry has just raided into Indiana and Ohio. Governor Bramlette says enlistment is theft.',
    choices:[
      { id:'A', label:'Resist Black enlistment', summary:'Demand the army return fugitives.', historical:true,
        meterDelta:{ UNION:-2, FREEDOM:4 }, statDelta:{ ARMS:-4, POWER:-4 },
        effects:[
          { place:'Camp Nelson, KY', region:'KY', text:'Nov 1864: the army expels 400 wives and children into the snow; 102 die. The outcry produces the March 1865 law freeing soldiers’ families.', insight:'cruelty photographed became policy reversed; Kentucky’s last legal emancipation came from a scandal.', recolor:[{ r:'KY', pin:'FREEDOM', size:2 }] },
          { place:'Louisville, KY', region:'KY', text:'The army enlists anyway from March 1864; 24,000 Black Kentuckians serve, 57% of eligible men, the highest share of any state.', insight:'enlistment was the only door out of slavery in a state the Proclamation skipped.', recolor:[{ r:'KY', sl:'SELF_EMANCIPATING' }] },
          { place:'Frankfort, KY', region:'KY', text:'The legislature petitions Lincoln; he replies to Kentuckians in April 1864 that if slavery is not wrong, nothing is wrong.', insight:'the letter was written to Kentucky because Kentucky was the argument.' },
          { place:'West Point, OH', region:'OH', text:'Morgan is captured in Ohio and jailed in Columbus; he escapes in November.', insight:'raids that thrilled Kentucky’s Confederates ended in a penitentiary.' },
          { place:'Washington DC', region:'DC', text:'Kentucky’s resistance convinces Congress the 13th Amendment cannot wait for the states.', insight:'a loyal state refusing to free anyone made a constitutional amendment the only path.' }
        ] },
      { id:'B', label:'Allow Black enlistment', summary:'Freedom for enlistees and their families.',
        meterDelta:{ UNION:2, FREEDOM:10 }, statDelta:{ ARMS:-6, POWER:2 },
        effects:[
          { place:'Camp Nelson, KY', region:'KY', text:'No expulsion; families housed; 30,000 enlist by 1864.', insight:'the camp was a refuge when the state let it be.', recolor:[{ r:'KY', pin:'FREEDOM', size:3, sl:'SELF_EMANCIPATING' }] },
          { place:'Frankfort, KY', region:'KY', text:'Bramlette denounced by his own party; the legislature splits into war and peace Unionists.', insight:'Unionism in Kentucky had always assumed slavery survived.' },
          { place:'Washington DC', region:'DC', text:'Lincoln cites Kentucky in his 1864 message.', insight:'a border state doing it voluntarily was worth ten proclamations.' },
          { place:'Lexington, KY', region:'KY', text:'Morgan’s raid finds no support and ends in a week.', insight:'a state emancipating its soldiers has fewer men waiting for a raider.' },
          { place:'Louisville, KY', region:'KY', text:'Black regiments garrison the city; white Unionist resentment builds the postwar Democratic majority.', insight:'Kentucky’s “Confederate after the war” identity had a start date.' }
        ] },
      { id:'C', label:'Back Morgan quietly', summary:'A Confederate Kentucky underground.',
        meterDelta:{ UNION:-4 }, statDelta:{ ARMS:-12, POWER:-8 },
        effects:[
          { place:'Lebanon, KY', region:'KY', text:'Morgan’s raid becomes an occupation of the eastern counties; recruits double.', insight:'raids become fronts when the population feeds them.', recolor:[{ r:'KY', dl:-15, pin:'FIRE_EATER', size:3 }] },
          { place:'Louisville, KY', region:'KY', text:'Martial law comes early and harder; Burbridge’s four-for-one executions begin in 1863.', insight:'an underground invites the counterinsurgency it was hiding from.', recolor:[{ r:'KY', occ:'USA' }] },
          { place:'Frankfort, KY', region:'KY', text:'Legislators arrested; the state government is a Union garrison.', insight:'a state that plays both sides gets treated as the enemy by one.' },
          { place:'Cincinnati, OH', region:'OH', text:'Ohio militia occupy the northern counties.', insight:'the river became a border again.' },
          { place:'Richmond, VA', region:'VA', text:'Davis counts Kentucky as a Confederate state in every speech.', insight:'the Confederacy needed the claim more than the state.' }
        ] }
    ] },

  { id:'KY_T7', turn:7, year:'1864', title:'Burbridge',
    situation:'General Burbridge runs Kentucky under martial law. He shoots four guerrilla prisoners for every Unionist killed, arrests Democratic candidates before the August election, and is about to exile the lieutenant governor to Confederate lines. Governor Bramlette, a Unionist, calls him a tyrant. Kentucky is going to vote 70% for McClellan and everyone knows it.',
    choices:[
      { id:'A', label:'Vote McClellan; denounce Burbridge', summary:'Stay Union in name; denounce the tyrant.', historical:true,
        meterDelta:{ FREEDOM:3 }, statDelta:{ ARMS:-6, POWER:2 },
        effects:[
          { place:'Frankfort, KY', region:'KY', text:'Nov 8: McClellan 69.8%. Kentucky is the most anti-Lincoln state that never left the Union.', insight:'the state punished the man who had fought a war to keep it.', recolor:[{ r:'KY', pin:'COPPERHEAD', size:3 }] },
          { place:'Louisville, KY', region:'KY', text:'Burbridge exiles Lt. Gov. Jacob to the Confederate lines; Lincoln removes Burbridge in February 1865.', insight:'military rule in a loyal state was politically unsustainable even for the president who ordered it.' },
          { place:'Camp Nelson, KY', region:'KY', text:'The November expulsion; the March law.', insight:'see Turn 6; the scandal ran on either path.' },
          { place:'Washington DC', region:'DC', text:'General Palmer replaces Burbridge and issues 8,000 “Palmer passes” that free people by letting them leave.', insight:'emancipation in Kentucky ended as it began, by an officer’s signature.' },
          { place:'Nashville, TN', region:'TN', text:'Hood’s army is destroyed in December; no Confederate army will ever reach Kentucky again.', insight:'the war left Kentucky in 1862; the politics never did.' }
        ] },
      { id:'B', label:'Vote Lincoln', summary:'Accept the military governor; ask for federal compensation.',
        meterDelta:{ UNION:4, FREEDOM:6 }, statDelta:{ ARMS:-8, POWER:6 },
        effects:[
          { place:'Frankfort, KY', region:'KY', text:'Lincoln loses Kentucky by less; Bramlette’s Union Democrats fuse with Republicans and Kentucky has a Republican party after the war.', insight:'a state party that backs the winner survives the peace.', recolor:[{ r:'KY', setl:75 }] },
          { place:'Washington DC', region:'DC', text:'Kentucky ratifies the 13th Amendment in February 1865 instead of rejecting it; Congress passes $300 compensation for loyal owners of enlisted men.', insight:'the compensation bill was real; Kentucky’s rejection of the amendment made it moot.' },
          { place:'Camp Nelson, KY', region:'KY', text:'Families protected by state order.', insight:'the state could have stopped the expulsion with a letter.' },
          { place:'Louisville, KY', region:'KY', text:'Postwar Kentucky is a Union state in memory, not a Confederate one.', insight:'monuments follow the votes of 1864.' },
          { place:'Lexington, KY', region:'KY', text:'The Bluegrass fumes and builds the Democratic machine anyway.', insight:'some counties were lost in 1850.' }
        ] },
      { id:'C', label:'Expel Burbridge', summary:'The legislature declares martial law void and calls out the militia.',
        meterDelta:{ UNION:-3, FREEDOM:-3 }, statDelta:{ ARMS:3, POWER:8 },
        effects:[
          { place:'Frankfort, KY', region:'KY', text:'A constitutional crisis; Lincoln removes Burbridge in October rather than face a second front.', insight:'the president needed Kentucky’s regiments more than its obedience.' },
          { place:'Louisville, KY', region:'KY', text:'State militia and federal troops face each other across Broadway; no shots.', insight:'both sides knew what the first shot would cost.' },
          { place:'Camp Nelson, KY', region:'KY', text:'The militia stops enlistment for three months; 5,000 fewer Black Kentuckians serve.', insight:'the state’s leverage was used against its own people.', recolor:[{ r:'KY', pin:'FREEDOM', size:1 }] },
          { place:'Washington DC', region:'DC', text:'McClellan still carries Kentucky; Lincoln gets nothing for the concession.', insight:'a concession to a state that votes against you anyway is a gift.' },
          { place:'Nashville, TN', region:'TN', text:'Thomas’s army is unaffected.', insight:'Kentucky’s politics no longer touched the war’s outcome.' }
        ] }
    ] },

  { id:'KY_T8', turn:8, year:'1865–77', title:'Confederate After the War',
    situation:'The 13th Amendment freed the last 65,000 enslaved Kentuckians on Dec 18, 1865; your legislature rejected it in February and will reject the 14th and 15th. Ex-Confederates are coming home to parades. Black Kentuckians cannot testify against white ones. The Freedmen’s Bureau has opened offices in a loyal state because of the lynchings. Berea College has reopened, integrated.',
    choices:[
      { id:'A', label:'Reject the amendments', summary:'Welcome the veterans; become Confederate after the war.', historical:true,
        meterDelta:{ UNION:2, FREEDOM:14 }, statDelta:{ ARMS:4, POWER:-4 },
        effects:[
          { place:'Frankfort, KY', region:'KY', text:'The 13th, 14th and 15th are all rejected; the 13th is ratified symbolically in 1976.', insight:'a state that never seceded refused the war’s results for a century.', recolor:[{ r:'KY', setl:40, sl:'ABOLISHED' }] },
          { place:'Lexington, KY', region:'KY', text:'Confederate monuments go up before Union ones; Morgan gets a statue in 1911.', insight:'memory is a political project, and the Democrats won it.' },
          { place:'Louisville, KY', region:'KY', text:'The Freedmen’s Bureau operates in Kentucky until 1872 because Black Kentuckians are being killed.', insight:'the Bureau went where the violence was, and it was here.', recolor:[{ r:'KY', pin:'FIRE_EATER', size:2 }] },
          { place:'Berea, KY', region:'KY', text:'Reopens integrated in 1866; the 1904 Day Law forces it to segregate.', insight:'what a mob could not close in 1859, a legislature closed in 1904.' },
          { place:'Washington DC', region:'DC', text:'Kentucky’s delegation votes with the South on every Reconstruction bill.', insight:'the Solid South included a state that never left.' }
        ] },
      { id:'B', label:'Ratify the amendments', summary:'A border-state Reconstruction without troops.',
        meterDelta:{ UNION:6, FREEDOM:31 }, statDelta:{ ARMS:-4, POWER:8 },
        effects:[
          { place:'Frankfort, KY', region:'KY', text:'Kentucky ratifies the 13th in 1865 and the 14th in 1866.', insight:'Bramlette’s Union party had the votes if it chose to use them.', recolor:[{ r:'KY', setl:70, sl:'ABOLISHED', pin:'FREEDOM', size:2 }] },
          { place:'Louisville, KY', region:'KY', text:'Black testimony is allowed in 1866, not 1872; the state funds Black schools.', insight:'law that arrives six years earlier changes a generation.' },
          { place:'Lexington, KY', region:'KY', text:'Klan cases are prosecuted by state courts.', insight:'terror needs the silence of the state’s leaders.' },
          { place:'Washington DC', region:'DC', text:'Kentucky is Congress’s model for voluntary Reconstruction; the Bureau leaves early.', insight:'a border state that did it without troops was proof it could be done.' },
          { place:'Berea, KY', region:'KY', text:'State-chartered and funded; the Day Law still comes in 1904.', insight:'some reversals were a generation away regardless.' }
        ] },
      { id:'C', label:'Demand compensation', summary:'Federal payment for the 65,000 freed by the 13th Amendment.',
        meterDelta:{ FREEDOM:16 }, statDelta:{ ARMS:-2, POWER:-6 },
        effects:[
          { place:'Washington DC', region:'DC', text:'Congress refuses; the demand becomes Kentucky’s grievance for a decade.', insight:'a loyal state asking to be paid for slavery had no friends in either party.' },
          { place:'Frankfort, KY', region:'KY', text:'The legislature ratifies conditionally; the courts void the condition.', insight:'an amendment cannot be ratified with an invoice attached.' },
          { place:'Louisville, KY', region:'KY', text:'Union Leagues organize; the demand insults the men who fought.', insight:'24,000 Black veterans were not going to be priced.', recolor:[{ r:'KY', pin:'FREEDOM', size:2 }] },
          { place:'Lexington, KY', region:'KY', text:'The Bluegrass Democrats build a party on the grievance.', insight:'a lost cause needs a bill to point to.' },
          { place:'Cincinnati, OH', region:'OH', text:'Northern papers mock “Kentucky’s bill.”', insight:'leverage spent on the wrong ask is gone.' }
        ] }
    ] }

];
})();
