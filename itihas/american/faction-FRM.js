(function(){window.AH_SCENARIO.nodes.FRM=[
{ id:"FRM_T1", turn:1, year:"1850–52", title:"Vigilance",
  intro:"It’s 1850. You are Black America’s leadership: Douglass in Rochester, Still in Philadelphia, Hayden in Boston, Delany in Pittsburgh, Garnet in New York, the vigilance committees, the churches, the conventions. Three million of your people are enslaved and the new Fugitive Slave Act says none of you are safe. You have no army, no vote in most states, and the strongest argument in the country. Your meters are Community, Funds and Voice. FREEDOM is the one you are playing for.",
  situation:"Commissioners under the new Act are paid $10 to return a person and $5 to free one. Boston’s Black community has met at the Belknap Street church and voted to resist. Lewis Hayden keeps two kegs of gunpowder in his cellar. Some say fight, some say organize, some say the only safe ground is Canada or Haiti.",
  choices:[
    { id:"A", label:"Vigilance and rescues", summary:"Vigilance committees, rescues, the Underground Railroad north", historical:true,
      meterDelta:{ FREEDOM:2 }, statDelta:{ ARMS:6, ECON:-3, POWER:5 },
      effects:[
        { place:"Boston, MA", region:"MA", text:"Feb 1851: the committee walks Shadrach Minkins out of a courtroom to Canada; Hayden’s house is an arsenal and a hotel.", insight:"a city that would not obey the Act was the first place the Act failed.", recolor:[{ r:"MA", pin:"FREEDOM", size:2 }] },
        { place:"Philadelphia, PA", region:"PA", text:"William Still’s committee moves 800 people north by 1860 and keeps records he buries in a cemetery.", insight:"the records reunited families for twenty years after the war.", recolor:[{ r:"PA", pin:"FREEDOM", size:2 }] },
        { place:"Syracuse, NY", region:"NY", text:"Oct 1851: Jermain Loguen’s committee breaks \"Jerry\" McHenry out of jail in front of a crowd of thousands.", insight:"rescues were public on purpose; the audience was the point.", recolor:[{ r:"NY", pin:"FREEDOM", size:2 }] },
        { place:"St. Catharines, Canada West", region:"CANADA", text:"Harriet Tubman’s base; Canada’s Black population climbs toward 20,000 by 1860.", insight:"the Act made no free state safe, so the line moved to the border.", recolor:[{ r:"CANADA", pin:"FREEDOM", size:2 }] },
        { place:"Rochester, NY", region:"NY", text:"Douglass breaks with Garrison in 1851 and declares the Constitution an anti-slavery document; Frederick Douglass’ Paper argues for politics, not just moral suasion.", insight:"the movement’s most famous voice decided the ballot was a weapon." }
      ] },
    { id:"B", label:"Mass emigration", summary:"Emigration: a mass movement to Canada, Haiti or Liberia", historical:false,
      meterDelta:{}, statDelta:{ ARMS:-6, ECON:-8, POWER:-4 }, flags:["EMIGRATION"],
      effects:[
        { place:"Cleveland, OH", region:"OH", text:"Delany’s National Emigration Convention meets in 1852 rather than 1854, and it is a movement, not a faction.", insight:"Delany argued that a people without a nation would never be free in someone else’s." },
        { place:"Chatham, Canada West", region:"CANADA", text:"Forty thousand Black Canadians by 1860; the Elgin settlement runs its own schools and mills.", insight:"Canada showed that Black self-government worked, which is exactly what the South feared.", recolor:[{ r:"CANADA", pin:"FREEDOM", size:3 }] },
        { place:"Port-au-Prince, Haiti", region:"FL", text:"Haiti’s invitation comes early; thousands sail and thousands die of fever.", insight:"the first Black republic wanted settlers and could not feed them.", recolor:[{ r:"FL", pin:"FREEDOM", size:2 }] },
        { place:"Monrovia, Liberia", region:"DC", text:"The Colonization Society’s ships fill; most free Black leaders denounce it as a slaveholders’ scheme.", insight:"Liberia was founded to remove free Black people, not to free enslaved ones." },
        { place:"Boston, MA", region:"MA", text:"Douglass and Garnet split over leaving; the movement speaks with two voices for a decade.", insight:"the emigration debate was the movement’s deepest, and it never fully closed." }
      ] },
    { id:"C", label:"Armed self-defense doctrine", summary:"Armed self-defense as doctrine: Christiana as the model, published", historical:false,
      meterDelta:{ UNION:-4, FREEDOM:1 }, statDelta:{ ARMS:4, POWER:6 },
      effects:[
        { place:"Christiana, PA", region:"PA", text:"William Parker’s men kill a Maryland slaveholder; Parker escapes to Canada through Douglass’s Rochester house.", insight:"the movement’s first battle was won by farmers, and it hid the general.", recolor:[{ r:"PA", pin:"FREEDOM", size:3 }] },
        { place:"Boston, MA", region:"MA", text:"Hayden’s arsenal is public; Massachusetts debates whether to charge him.", insight:"openness made the cost of enforcement clear to everyone." },
        { place:"Detroit, MI", region:"MI", text:"Armed rescues become routine on the Canadian border.", insight:"doctrine spreads faster than committees." },
        { place:"Richmond, VA", region:"VA", text:"Southern papers print Christiana as insurrection; patrols double and enslaved people are punished for it.", insight:"resistance in the North was paid for in the South." },
        { place:"Philadelphia, PA", region:"PA", text:"Still’s committee splits over violence.", insight:"a movement built on secrecy did not want a doctrine that advertised." }
      ] }
  ] },

{ id:"FRM_T2", turn:2, year:"1854–56", title:"Anthony Burns",
  situation:"Anthony Burns was seized in Boston on May 24. Your committee attacked the courthouse and a deputy died. On June 2 the army marched Burns to a ship past 50,000 people and buildings draped in black. Kansas is open for settlement and its free-state men have written a constitution that bars Black settlers. The new Republican Party does not want your endorsement. Delany’s emigration convention meets in Cleveland.",
  choices:[
    { id:"A", label:"Convert the North", summary:"Turn Burns into the North’s conversion; buy his freedom; press the Republicans from outside", historical:true,
      meterDelta:{ FREEDOM:2 }, statDelta:{ ARMS:4, ECON:-4, POWER:6 },
      effects:[
        { place:"Boston, MA", region:"MA", text:"Massachusetts passes a personal liberty law in 1855; no fugitive is returned from Boston again; Burns is purchased for $1,300 and enters Oberlin.", insight:"the march converted a city; it took a year and one law.", recolor:[{ r:"MA", pin:"FREEDOM", size:3 }] },
        { place:"Rochester, NY", region:"NY", text:"Douglass endorses Frémont in 1856 as the lesser evil.", insight:"political abolition meant voting for men who did not want your vote." },
        { place:"Topeka, KS", region:"KS", text:"The free-state constitution bars Black settlers; free soil meant white soil for many of its voters.", insight:"the party that would end slavery began with a color line." },
        { place:"Cleveland, OH", region:"OH", text:"Delany’s convention votes for emigration; the movement has two programs.", insight:"every decade of the struggle had an exit faction, and every decade most people stayed." },
        { place:"Philadelphia, PA", region:"PA", text:"Still’s traffic doubles after Burns; the South’s victories were the Railroad’s recruiting.", insight:"a fugitive returned in chains sent ten more north." }
      ] },
    { id:"B", label:"Black Kansas colony", summary:"Send Black settlers to Kansas as a free-state colony", historical:false,
      meterDelta:{}, statDelta:{ ARMS:-4, ECON:-6, POWER:2 },
      effects:[
        { place:"Lawrence, KS", region:"KS", text:"Your settlers are unwelcome on both sides; the free-state party enforces its exclusion clause.", insight:"Kansas was a fight over which white men would own the land.", recolor:[{ r:"KS", pin:"FREEDOM", size:1 }] },
        { place:"Topeka, KS", region:"KS", text:"A few families stay; their descendants found Nicodemus in 1877.", insight:"seeds planted in the wrong decade sometimes grow in the right one." },
        { place:"Washington, DC", region:"DC", text:"Republicans distance themselves publicly.", insight:"the party needed Indiana and Illinois, which had Black exclusion laws of their own." },
        { place:"Chatham, Canada West", region:"CANADA", text:"Money sent to Kansas is money not sent to Canada; the settlements stall.", insight:"a small movement cannot fund two frontiers." },
        { place:"Cincinnati, OH", region:"OH", text:"Recruiting finds few takers.", insight:"Black families weighed Kansas against Canada and chose the one without Border Ruffians." }
      ] },
    { id:"C", label:"Ally with John Brown", summary:"Ally with John Brown: fund his Kansas war, recruit Black volunteers", historical:false,
      meterDelta:{ UNION:-4, FREEDOM:1 }, statDelta:{ ARMS:2, ECON:-8, POWER:4 },
      effects:[
        { place:"Osawatomie, KS", region:"KS", text:"Black fighters ride with Brown in 1856.", insight:"Brown was the one white abolitionist who asked Black men to lead, and some said yes." },
        { place:"Chatham, Canada West", region:"CANADA", text:"Brown’s 1858 convention adopts a \"Provisional Constitution\" with 34 Black delegates; here it has money.", insight:"the raid on Harpers Ferry was planned in a Black town in Canada." },
        { place:"Rochester, NY", region:"NY", text:"Brown writes his plans in Douglass’s house.", insight:"the movement’s voice and its sword shared a desk for three weeks." },
        { place:"Harpers Ferry, VA", region:"VA", text:"The raid comes with a hundred men instead of twenty-one.", insight:"numbers change the length of a siege, not the marines at the end of it." },
        { place:"Richmond, VA", region:"VA", text:"Slave patrols double; free Black Virginians are expelled by the hundred.", insight:"every Northern plan was paid for by Southern Black people first." }
      ] }
  ] },

{ id:"FRM_T3", turn:3, year:"1857–59", title:"No Rights Which the White Man Was Bound to Respect",
  situation:"The Supreme Court says you are not and cannot be citizens. Douglass calls the ruling a new hope because it is too extreme to stand. Delany is planning an expedition to the Niger Valley; Redpath is recruiting for Haiti. In August 1859, John Brown asks Douglass at a quarry near Chambersburg to join him at Harpers Ferry. Shields Green, a fugitive from Charleston, is listening.",
  choices:[
    { id:"A", label:"Denounce, decline the raid", summary:"Denounce the Court, decline Brown’s raid, keep organizing", historical:true,
      meterDelta:{ FREEDOM:1 }, statDelta:{ ARMS:3, POWER:5 },
      effects:[
        { place:"Chambersburg, PA", region:"PA", text:"Douglass tells Brown the arsenal is a steel trap; Shields Green goes anyway and is hanged on Dec 16.", insight:"five of Brown’s twenty-one were Black men who knew the odds." },
        { place:"Rochester, NY", region:"NY", text:"Brown’s carpetbag holds Douglass’s letters; Douglass flees to Canada and then England ahead of a Virginia warrant.", insight:"the raid’s failure put the whole movement’s leadership at risk." },
        { place:"Harpers Ferry, VA", region:"VA", text:"Osborne Anderson escapes and writes the only inside account, A Voice from Harper’s Ferry.", insight:"the story of the raid was told by the Black man who survived it." },
        { place:"Philadelphia, PA", region:"PA", text:"Conventions answer Dred Scott with a single line: we are Americans.", insight:"the ruling was answered by claiming the thing it denied." },
        { place:"Chatham, Canada West", region:"CANADA", text:"The May 1858 convention adopts Brown’s constitution; Black Canada is the movement’s safe house.", insight:"exile was infrastructure." }
      ] },
    { id:"B", label:"Join Brown in force", summary:"Join Brown with a larger Black force", historical:false,
      meterDelta:{ UNION:-10, FREEDOM:-2 }, statDelta:{ ARMS:-10, POWER:4 },
      effects:[
        { place:"Harpers Ferry, VA", region:"VA", text:"A hundred Black volunteers hold the arsenal three days; some local enslaved people join; Lee’s marines still take it.", insight:"the raid’s flaw was the plan, not the numbers." },
        { place:"Richmond, VA", region:"VA", text:"A real insurrection panic; hundreds of enslaved and free Black Virginians arrested, dozens executed.", insight:"the South’s response to a Black army was to punish Black people who had never seen it.", recolor:[{ r:"VA", pin:"FIRE_EATER", size:3 }] },
        { place:"Boston, MA", region:"MA", text:"Northern Black leaders are arrested under federal warrants; the movement is decapitated for two years.", insight:"a conspiracy exposed takes its organizers with it.", recolor:[{ r:"MA", pin:"FREEDOM", size:1 }] },
        { place:"Rochester, NY", region:"NY", text:"Douglass is indicted in absentia; he stays in England.", insight:"the voice was silenced from a distance." },
        { place:"Charleston, SC", region:"SC", text:"Secession commissions form on the day of the raid.", insight:"the South seceded from the North it imagined, and you made the imagination real.", recolor:[{ r:"SC", dl:-15 }] }
      ] },
    { id:"C", label:"Emigration at scale", summary:"Emigration at scale: Delany’s Niger Valley and Redpath’s Haiti", historical:false,
      meterDelta:{}, statDelta:{ ARMS:-8, ECON:-8, POWER:-6 }, flags:["EMIGRATION"], roll:{ flag:"COLONIZATION", pct:50 },
      effects:[
        { place:"Abeokuta, Nigeria", region:"DC", text:"Delany signs a treaty with the Alake in 1859 for a settlement; Britain’s annexation of Lagos in 1861 ends it.", insight:"the empire that ended the slave trade also ended the Black republic that would have replaced it." },
        { place:"Port-au-Prince, Haiti", region:"FL", text:"Redpath’s bureau sends 2,000; fever kills a quarter and half return.", insight:"Haiti wanted farmers and got city people who died.", recolor:[{ r:"FL", pin:"FREEDOM", size:2 }] },
        { place:"Chatham, Canada West", region:"CANADA", text:"The movement’s best organizers leave; the committees thin.", insight:"emigration takes the people who can organize anything." },
        { place:"Rochester, NY", region:"NY", text:"Douglass books passage to Haiti for April 1861 and cancels when Sumter is fired on, as he did historically.", insight:"the war ended the emigration debate in a week." },
        { place:"Washington, DC", region:"DC", text:"Lincoln’s colonization plans in 1862 find Black partners who have already argued for leaving.", insight:"emigration and colonization were different ideas that looked the same from the White House." }
      ] }
  ] },

{ id:"FRM_T4", turn:4, year:"1860–61", title:"Contraband",
  situation:"Lincoln is elected and the South is leaving. Black men in Cincinnati, Cleveland, Boston and New York have offered regiments and been told it is a white man’s war. In May, three men row across to Fort Monroe; General Butler refuses to return them and calls them \"contraband of war.\" In November, the navy takes Port Royal and 10,000 enslaved people stay behind as their owners flee.",
  choices:[
    { id:"A", label:"Push toward emancipation", summary:"Push the war toward emancipation from outside; flood Union lines; build Port Royal", historical:true,
      meterDelta:{ UNION:2, FREEDOM:5 }, statDelta:{ ARMS:5, POWER:6 },
      effects:[
        { place:"Fort Monroe, VA", region:"VA", text:"Baker, Mallory and Townsend cross on May 23; 900 people follow by July; the word \"contraband\" enters the language.", insight:"the army freed people before the government did, because people arrived and asked.", recolor:[{ r:"VA", sl:"SELF_EMANCIPATING", pin:"FREEDOM", size:2 }] },
        { place:"Port Royal, SC", region:"SC", text:"The Sea Islands are Union by November; teachers and missionaries arrive in 1862.", insight:"the first Reconstruction began before the first Emancipation.", recolor:[{ r:"SC", sl:"SELF_EMANCIPATING", pin:"FREEDOM", size:2 }] },
        { place:"Rochester, NY", region:"NY", text:"Douglass’ Monthly: the war must be against slavery or it is nothing.", insight:"the war’s purpose was argued into it from outside." },
        { place:"Washington, DC", region:"DC", text:"The First Confiscation Act (Aug 1861) frees anyone used for rebel military labor.", insight:"the first federal emancipation was a property law." },
        { place:"Cincinnati, OH", region:"OH", text:"Black volunteers are told it is a white man’s war; in 1862 they are conscripted at gunpoint to dig fortifications.", insight:"the army wanted Black labor before it wanted Black soldiers." }
      ] },
    { id:"B", label:"Demand regiments now", summary:"Insist on regiments now; refuse to serve as laborers until enlisted", historical:false,
      meterDelta:{ FREEDOM:1 }, statDelta:{ ARMS:-3, POWER:4 },
      effects:[
        { place:"Boston, MA", region:"MA", text:"Governor Andrew asks Washington and is refused; Massachusetts fills its quotas with white men.", insight:"the state that would raise the 54th could not raise it in 1861." },
        { place:"Washington, DC", region:"DC", text:"Lincoln refuses: Kentucky.", insight:"every Black regiment in 1861 was a Kentucky regiment lost." },
        { place:"Fort Monroe, VA", region:"VA", text:"The army’s labor is done by contrabands anyway.", insight:"a refusal by leaders does not bind the people arriving at the picket line." },
        { place:"New York, NY", region:"NY", text:"White regiments threaten to disband if Black men are armed.", insight:"the Union army of 1861 was a white man’s institution and said so." },
        { place:"Richmond, VA", region:"VA", text:"Confederate papers print the demand as proof of the North’s real aim.", insight:"the South understood the war’s logic before the North did." }
      ] },
    { id:"C", label:"The general strike", summary:"The general strike: organize a mass exodus from the plantations to Union lines from the first month", historical:false,
      meterDelta:{ UNION:2, FREEDOM:8 }, statDelta:{ ARMS:6, POWER:4 },
      effects:[
        { place:"St. Helena Island, SC", region:"SC", text:"Ten thousand stay when the planters flee; here the exodus is organized and doubles.", insight:"the war was won partly by four million people deciding where to stand.", recolor:[{ r:"SC", pin:"FREEDOM", size:3 }] },
        { place:"Hampton, VA", region:"VA", text:"Five thousand at Fort Monroe by 1862.", insight:"every Union post was a destination.", recolor:[{ r:"VA", pin:"FREEDOM", size:3 }] },
        { place:"Richmond, VA", region:"VA", text:"Labor shortages force the Confederacy to impress enslaved workers for fortifications; punishments multiply.", insight:"the strike was paid for by those who could not leave." },
        { place:"Washington, DC", region:"DC", text:"Congress passes confiscation faster; the army must feed 50,000 and does it badly; camp mortality reaches 25%.", insight:"freedom came before food, and the camps killed people the war did not." },
        { place:"Rochester, NY", region:"NY", text:"Douglass calls it the grandest strike in history.", insight:"the phrase would be Du Bois’s in 1935; the idea was Douglass’s in 1861." }
      ] }
  ] },

{ id:"FRM_T5", turn:5, year:"1862", title:"Watch Night",
  situation:"Port Royal is an experiment in wage labor, schools and land that nobody in Washington has decided about. General Hunter raised a Black regiment in May and was ordered to disband it. On Aug 14 Lincoln told five Black leaders at the White House that they should consider a colony in Central America. On Sept 22 he announced emancipation. On Dec 31, churches across the North will wait for midnight.",
  choices:[
    { id:"A", label:"Reject colonization, back Proclamation", summary:"Reject colonization publicly; back the Proclamation; build Port Royal", historical:true,
      meterDelta:{ FREEDOM:6 }, statDelta:{ ARMS:6, POWER:8 },
      effects:[
        { place:"Washington, DC", region:"DC", text:"Douglass answers the colonization meeting in print; the Chiriquí plan collapses when Central American governments refuse.", insight:"colonization died because Black Americans refused to go and the neighbors refused to take them." },
        { place:"Port Royal, SC", region:"SC", text:"Charlotte Forten’s school; the First South Carolina Volunteers re-formed in November under Higginson.", insight:"the regiment Hunter was forbidden to raise was raised six months later by order.", recolor:[{ r:"SC", pin:"FREEDOM", size:3 }] },
        { place:"Boston, MA", region:"MA", text:"Watch Night at Tremont Temple; Douglass on the platform when the telegraph confirms the Proclamation is signed.", insight:"the movement’s oldest ritual became a national one." },
        { place:"Île à Vache, Haiti", region:"FL", text:"April 1863: 453 colonists sail under a government contract; smallpox and fraud kill a hundred; the navy brings the survivors home in 1864.", insight:"Lincoln’s last colonization experiment failed on an island, and he never proposed another." },
        { place:"Chicago, IL", region:"IL", text:"Midwestern Black conventions demand the Proclamation include the border.", insight:"the exemptions were noticed by the people they exempted." }
      ] },
    { id:"B", label:"Accept a pilot colony", summary:"Accept Lincoln’s offer: lead a pilot colony in Chiriquí or Île à Vache", historical:false,
      meterDelta:{ FREEDOM:-3 }, statDelta:{ ARMS:-12, ECON:-6, POWER:-8 }, flags:["COLONIZATION"],
      effects:[
        { place:"Île à Vache, Haiti", region:"FL", text:"Two thousand colonists instead of 453; smallpox; half die.", insight:"the plan was underfunded, the contractor a fraud, and the island had no water." },
        { place:"Washington, DC", region:"DC", text:"Lincoln’s December message ties emancipation to compensation and removal; Congress appropriates $600,000.", insight:"with Black leaders on board, colonization looked viable, and emancipation looked conditional." },
        { place:"Port Royal, SC", region:"SC", text:"Teachers leave for the colony; the Sea Islands experiment loses a year.", insight:"attention is a budget." },
        { place:"Rochester, NY", region:"NY", text:"Douglass denounces the leaders who went; the movement splits over whether America is home.", insight:"colonization was the one question on which the movement had no compromise." },
        { place:"Monrovia, Liberia", region:"DC", text:"A few thousand sail on the government’s dollar.", insight:"state-funded emigration found takers when it was funded." }
      ] },
    { id:"C", label:"General strike before Proclamation", summary:"Organize a general strike on the plantations before the Proclamation; the exodus doubles", historical:false,
      meterDelta:{ UNION:-3, FREEDOM:10 }, statDelta:{ ARMS:4, POWER:4 },
      effects:[
        { place:"Corinth, MS", region:"MS", text:"Twenty thousand in Grant’s camps by winter; Chaplain Eaton’s Corinth camp has schools and a church.", insight:"the Mississippi valley freed itself along the river before any order reached it.", recolor:[{ r:"TN", sl:"SELF_EMANCIPATING", pin:"FREEDOM", size:3 },{ r:"MS", sl:"SELF_EMANCIPATING", pin:"FREEDOM", size:3 }] },
        { place:"Richmond, VA", region:"VA", text:"Confederate impressment of enslaved labor; mass punishments on plantations near the lines.", insight:"the people who stayed paid for the people who left." },
        { place:"Washington, DC", region:"DC", text:"The Proclamation drops the exemptions for New Orleans and Norfolk; the occupied South is included.", insight:"facts on the ground rewrote the document." },
        { place:"Louisville, KY", region:"KY", text:"Kentucky’s slaveholders demand the army stop the exodus; it cannot.", insight:"the border was a line on paper and a road on the ground." },
        { place:"New Orleans, LA", region:"LA", text:"Free Black Creoles found L’Union and demand the vote.", insight:"the exodus and the ballot were the same movement." }
      ] }
  ] },

{ id:"FRM_T6", turn:6, year:"1863", title:"Fort Wagner and $7",
  situation:"The 54th Massachusetts is in South Carolina. Black soldiers are paid $10 a month minus $3 for clothing; white privates get $13. In June, Harriet Tubman guides a raid up the Combahee that frees 750 people. On July 18 the 54th assaults Fort Wagner. In New York, draft rioters are hanging Black men from lampposts. In November, Sergeant William Walker of the 3rd South Carolina will stack his arms in protest.",
  choices:[
    { id:"A", label:"Serve, refuse unequal pay", summary:"Serve; refuse the unequal pay but not the fight; win equal pay in 1864", historical:true,
      meterDelta:{ FREEDOM:6 }, statDelta:{ ARMS:6, POWER:10 },
      effects:[
        { place:"Fort Wagner, SC", region:"SC", text:"272 of 600; Shaw buried with his men when the Confederates mean it as an insult.", insight:"the charge failed as an assault and succeeded as an argument.", recolor:[{ r:"SC", pin:"FREEDOM", size:3 }] },
        { place:"Combahee River, SC", region:"SC", text:"Tubman’s raid; 750 freed; the only woman to lead an armed US raid in the war.", insight:"the Railroad’s best conductor became the army’s best scout." },
        { place:"Beaufort, SC", region:"SC", text:"The 54th refuses all pay for eighteen months; Congress equalizes it in June 1864.", insight:"a strike inside an army, without leaving the line, won." },
        { place:"Camp Saxton, SC", region:"SC", text:"Walker is executed for mutiny in Feb 1864 for the same protest.", insight:"the cost of protest was set by who was watching." },
        { place:"Manhattan, NY", region:"NY", text:"Black families flee to Brooklyn and New Jersey during the riots; the Colored Orphan Asylum is burned.", insight:"the war for freedom had a front in the North too.", recolor:[{ r:"NY", pin:"COPPERHEAD", size:3 }] }
      ] },
    { id:"B", label:"Refuse until equal", summary:"Refuse to serve until pay and rank are equal", historical:false,
      meterDelta:{ UNION:-3, FREEDOM:-3 }, statDelta:{ ARMS:-4, POWER:6 }, flags:["EQUAL_PAY_STRIKE"],
      effects:[
        { place:"Boston, MA", region:"MA", text:"The 54th does not sail; Governor Andrew fills the quota with white draftees and the draft riots come to Boston.", insight:"the state’s showpiece regiment was also its quota." },
        { place:"Beaufort, SC", region:"SC", text:"The 3rd South Carolina’s mutiny spreads; a dozen executions.", insight:"a strike in the field is tried as mutiny, and the army kept its word on that." },
        { place:"Washington, DC", region:"DC", text:"Congress equalizes pay in early 1864 anyway; 50,000 fewer Black soldiers serve by 1865 and the war is longer.", insight:"the leverage was real and the price of using it was paid in a longer war." },
        { place:"Fort Wagner, SC", region:"SC", text:"White regiments assault it and fail; the question of whether Black men would fight stays open a year longer.", insight:"arguments are won by examples." },
        { place:"Richmond, VA", region:"VA", text:"Confederate papers print the strike as proof.", insight:"the enemy reads your newspapers." }
      ] },
    { id:"C", label:"Take the land", summary:"Take the land: occupy the Sea Island plantations and demand title", historical:false,
      meterDelta:{ FREEDOM:8 }, statDelta:{ ARMS:8, ECON:4, POWER:2 }, flags:["LAND_REDISTRIBUTION"],
      effects:[
        { place:"St. Helena Island, SC", region:"SC", text:"Freedpeople refuse wage labor and hold the fields; General Saxton backs them; the 1863 tax sales go to families at $1.25 an acre.", insight:"Lincoln’s December 1863 instructions allowed preemption; here they are enforced.", recolor:[{ r:"SC", sl:"ABOLISHED", pin:"FREEDOM", size:3 }] },
        { place:"Boston, MA", region:"MA", text:"Northern investors who bought at the auctions lose; the \"free labor\" experiment is debated in every paper.", insight:"Reconstruction’s land question was argued in 1863 and answered in 1865." },
        { place:"Beaufort, SC", region:"SC", text:"Robert Smalls buys his former owner’s house at a tax sale.", insight:"he did this historically; here his neighbors do too." },
        { place:"Washington, DC", region:"DC", text:"Stevens and Sumner draft a confiscation bill with the Sea Islands as precedent.", insight:"forty acres had a working model." },
        { place:"Richmond, VA", region:"VA", text:"The Confederate press calls it confiscation and fights harder.", insight:"land was the thing the war was about, after people." }
      ] }
  ] },

{ id:"FRM_T7", turn:7, year:"1864", title:"Syracuse",
  situation:"In October, 144 delegates meet in Syracuse: Douglass, Garnet, Langston, Bruce. They will found the National Equal Rights League and demand the ballot. Frémont is running against Lincoln from the left. Sherman is marching through Georgia with 20,000 freedpeople behind his army, and he does not want them. In January, twenty Black ministers will meet him in Savannah.",
  choices:[
    { id:"A", label:"Found the League", summary:"Syracuse: found the League, demand suffrage, back Lincoln over Frémont", historical:true,
      meterDelta:{ UNION:2, FREEDOM:8 }, statDelta:{ ARMS:6, POWER:10 },
      effects:[
        { place:"Syracuse, NY", region:"NY", text:"The National Equal Rights League; state leagues in every free state by 1865.", insight:"the demand for the vote was organized before the war was won." },
        { place:"Savannah, GA", region:"GA", text:"Jan 12, 1865: Garrison Frazier tells Sherman and Stanton that freedom means land to till by their own labor; four days later Field Order 15 sets aside 400,000 acres.", insight:"forty acres and a mule was a Black minister’s answer to a general’s question.", recolor:[{ r:"GA", sl:"ABOLISHED", pin:"FREEDOM", size:3 }] },
        { place:"New Orleans, LA", region:"LA", text:"The New Orleans Tribune demands suffrage; Lincoln writes the governor suggesting it for the \"very intelligent\" and the soldiers.", insight:"the first presidential words on Black suffrage were a private letter answering a Black newspaper." },
        { place:"Nashville, TN", region:"TN", text:"Black Tennesseans petition the Union convention for the vote.", insight:"the demand came from every state the army reached." },
        { place:"Washington, DC", region:"DC", text:"Lincoln wins; the 13th Amendment passes the House on Jan 31.", insight:"the movement chose the coalition over the candidate and got the amendment." }
      ] },
    { id:"B", label:"Back Frémont’s ticket", summary:"Back Frémont’s Radical ticket against Lincoln", historical:false,
      meterDelta:{ UNION:-4 }, statDelta:{ ARMS:-4, POWER:4 }, roll:{ flag:"MCCLELLAN_1864", pct:30 },
      effects:[
        { place:"Cleveland, OH", region:"OH", text:"The Radical Democracy seats Black delegates and nominates Frémont on suffrage.", insight:"the platform was two years ahead of the country." },
        { place:"Washington, DC", region:"DC", text:"Frémont, who withdrew in September historically, stays in; McClellan wins Pennsylvania (30%).", insight:"the closest the Confederacy came to winning was a split Northern vote." },
        { place:"Syracuse, NY", region:"NY", text:"The convention splits over the endorsement.", insight:"a movement that splits its vote splits its voice." },
        { place:"Savannah, GA", region:"GA", text:"Sherman’s march proceeds; the Frazier meeting still happens.", insight:"the army’s politics ran on its own clock." },
        { place:"Boston, MA", region:"MA", text:"Radicals thank you; moderates blame you for a decade.", insight:"purity in 1864 was remembered as a risk." }
      ] },
    { id:"C", label:"Land first", summary:"Land first: make Field Order 15 a national demand and organize freedpeople to hold it", historical:false,
      meterDelta:{ FREEDOM:10 }, statDelta:{ ARMS:8, ECON:6, POWER:4 }, flags:["LAND_REDISTRIBUTION"],
      effects:[
        { place:"Savannah, GA", region:"GA", text:"40,000 people on 400,000 acres by June 1865.", insight:"the order was real; the question was whether it would be defended.", recolor:[{ r:"GA", sl:"ABOLISHED", pin:"FREEDOM", size:3 },{ r:"SC", sl:"ABOLISHED", pin:"FREEDOM", size:3 }] },
        { place:"Edisto Island, SC", region:"SC", text:"Oct 1865: General Howard is sent to tell the freedpeople to return the land; they refuse and petition the president; here USCT garrisons back them.", insight:"the Edisto petition exists; it asks how they can be free without land." },
        { place:"Washington, DC", region:"DC", text:"The Freedmen’s Bureau bill’s 40-acre clause survives; Johnson vetoes; Congress overrides with the clause intact.", insight:"the clause was dropped historically to get the veto overridden." },
        { place:"Charleston, SC", region:"SC", text:"Pardoned planters return to find their land occupied; violence.", insight:"Reconstruction’s central conflict was who owned the ground." },
        { place:"Beaufort, SC", region:"SC", text:"Smalls organizes a landholders’ league.", insight:"land without organization is a target." }
      ] }
  ] },

{ id:"FRM_T8", turn:8, year:"1865–77", title:"We Are Here to Stay",
  situation:"The 13th Amendment is ratified. Black conventions in every Southern state are demanding the ballot. The Bureau is opening schools; white mobs are burning them. In three years you will have the 14th and 15th, two senators and a dozen congressmen. In twelve years the troops will leave and the Klan’s successors will run the South. Some say Kansas. Some say Liberia. Douglass says we are here to stay.",
  choices:[
    { id:"A", label:"Vote, hold office, build", summary:"Vote, hold office, build churches and schools, fight Redemption", historical:true,
      meterDelta:{ UNION:6 }, meterSet:{ FREEDOM:30 }, statDelta:{ ARMS:10, POWER:2 },
      effects:[
        { place:"Columbia, SC", region:"SC", text:"A Black-majority legislature; about 2,000 Black officeholders across the South; Hiram Revels takes Jefferson Davis’s old Senate seat in 1870.", insight:"for eight years Reconstruction was the most democratic experiment in American history.", recolor:[{ r:"VA", sl:"ABOLISHED", pin:"FREEDOM", size:3 },{ r:"NC", sl:"ABOLISHED", pin:"FREEDOM", size:3 },{ r:"SC", sl:"ABOLISHED", pin:"FREEDOM", size:3 },{ r:"GA", sl:"ABOLISHED", pin:"FREEDOM", size:3 },{ r:"FL", sl:"ABOLISHED", pin:"FREEDOM", size:3 },{ r:"AL", sl:"ABOLISHED", pin:"FREEDOM", size:3 },{ r:"MS", sl:"ABOLISHED", pin:"FREEDOM", size:3 },{ r:"LA", sl:"ABOLISHED", pin:"FREEDOM", size:3 },{ r:"TX", sl:"ABOLISHED", pin:"FREEDOM", size:3 },{ r:"AR", sl:"ABOLISHED", pin:"FREEDOM", size:3 },{ r:"TN", sl:"ABOLISHED", pin:"FREEDOM", size:3 }] },
        { place:"Hampton, VA", region:"VA", text:"Hampton 1868, Fisk 1866, Howard 1867: the colleges that would educate the next century’s leadership.", insight:"the schools outlasted the governments." },
        { place:"Colfax, LA", region:"LA", text:"Easter 1873; Cruikshank in 1876 says the federal government cannot punish it.", insight:"the vote was defended only by the people who held it, and then not." },
        { place:"Beaufort, SC", region:"SC", text:"Robert Smalls serves in Congress until 1887, one of the last.", insight:"the Sea Islands stayed Black-governed longest because they had land." },
        { place:"Washington, DC", region:"DC", text:"1877; the League dissolves; the Exodus begins.", insight:"the amendments stayed in the Constitution and out of practice until 1965.", recolor:[{ r:"DC", pin:"FREEDOM", size:1 }] }
      ] },
    { id:"B", label:"Exodus to Kansas and Liberia", summary:"Exodus: Kansas and Liberia", historical:false,
      meterDelta:{ UNION:2 }, meterSet:{ FREEDOM:32 }, statDelta:{ ARMS:-6, POWER:2 }, flags:["EMIGRATION"],
      effects:[
        { place:"Nicodemus, KS", region:"KS", text:"Founded 1877; Pap Singleton’s colonies; 20,000 to 40,000 Exodusters in 1879.", insight:"Kansas was free soil and John Brown’s state, and it could not house them.", recolor:[{ r:"KS", pin:"FREEDOM", size:2 }] },
        { place:"Charleston, SC", region:"SC", text:"1878: the Azor sails for Liberia with 206 aboard; many die on the way.", insight:"Liberia was still the exit of last resort." },
        { place:"Washington, DC", region:"DC", text:"The 1880 Senate investigates the Exodus; Douglass testifies against leaving.", insight:"the movement’s oldest debate ran into the 1880s." },
        { place:"Vicksburg, MS", region:"MS", text:"Planters blockade the river landings to stop the migration.", insight:"the South wanted its labor more than it wanted its Black population gone." },
        { place:"St. Louis, MO", region:"MO", text:"Relief committees feed the migrants through the winter.", insight:"freedom of movement needed a soup kitchen." }
      ] },
    { id:"C", label:"Armed self-defense leagues", summary:"Armed self-defense leagues and Union Leagues holding the ballot box; demand troops", historical:false,
      meterDelta:{ UNION:-4 }, meterSet:{ FREEDOM:45 }, statDelta:{ ARMS:4, POWER:4 }, flags:["RADICAL_RECON_HOLDS"],
      effects:[
        { place:"Hamburg, SC", region:"SC", text:"July 1876: the Hamburg militia is armed and drilled; the massacre becomes a battle.", insight:"the difference between a massacre and a battle is who is armed." },
        { place:"Colfax, LA", region:"LA", text:"The courthouse holds with an organized militia (50%) or the massacre is larger (50%).", insight:"self-defense raises the stakes in both directions." },
        { place:"Jackson, MS", region:"MS", text:"Grant, refusing historically, sends troops in 1875 and the Mississippi Plan fails.", insight:"the plan depended on the president looking away." },
        { place:"Columbia, SC", region:"SC", text:"Chamberlain’s government survives 1877 with militia support.", insight:"governments that can defend themselves are not bargained away." },
        { place:"New York, NY", region:"NY", text:"Northern papers call it race war; support collapses faster.", insight:"the North would fund a Reconstruction that looked like a school and not one that looked like a rifle." }
      ] }
  ] }
];})();
