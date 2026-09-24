"""Editorial additions and explicit simulation assumptions. Run after import-spec.py."""
import json,re
from pathlib import Path
out=Path(__file__).resolve().parent.parent/'public/content/cold-war'
def read(n): return json.loads((out/(n+'.json')).read_text())
def write(n,v): (out/(n+'.json')).write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
countries=[read(i) for i in ['USA','USSR','CHN','UK','FRG','CUB','IND']]
choices={x['id']:x for c in countries for n in c['nodes'] for x in n['choices']}
# Complete outcome flags where the supplied prose already describes the event.
flags={'FRG_T4_B':['BERLIN_WAR'],'UK_T5_B':['VIETNAM_TOTAL'],'FRG_T5_C':['VIETNAM_TOTAL'],'CHN_T6_C':['NO_DETENTE'],'USSR_T2_B':['KOREA_AVOIDED'],'USA_T7_B':['AFGHAN_UNARMED'],'CUB_T2_C':['CUBA_DEMOCRATIC'],'CUB_T3_C':['CUBA_INVADED'],'CHN_T3_B':['CHINA_GRADUAL'],'CHN_T3_C':['CHINA_OPEN'],'CHN_T5_B':['CHINA_GRADUAL'],'CHN_T7_C':['CHINA_OPEN'],'UK_T8_C':['FRG_NEUTRAL'],'FRG_T3_C':['PRAGUE_FREE']}
flags.pop('FRG_T3_C') # Trade alone does not establish a free Prague.
for cid,fs in flags.items(): choices[cid]['flags']=list(dict.fromkeys(choices[cid]['flags']+fs))
# A clash, not the whole war's British losses, belongs to the Imjin pin.
choices['UK_T2_A']['effects'][0].update(text='At the Imjin River, the Gloucesters hold against a much larger force. Most survivors are captured.',insight='Britain’s costly stand strengthens its claim to be heard in an American-led war.')
choices['UK_T4_A']['effects'][2].update(text='US submarines use Holy Loch. Britain’s existing nuclear-disarmament movement gains a new focus.',insight='CND formed in 1958, before the Polaris deal. New weapons gave an existing protest movement another target.')
choices['USA_T1_B']['effects'][4]['text']='Isolationists gain ground in the 1948 congressional elections; the defense budget faces deeper cuts.'
choices['USA_T1_B']['effects'][0]['text']='Without American arms, communist forces could prevail in the Greek civil war and pull Greece out of the Western orbit.'
choices['USA_T1_A']['effects'][5].update(text='Argentina pursues its own “Third Position,” seeking room between the US and Soviet blocs.',insight='European recovery aid did not erase Latin American demands for investment or greater independence from Washington.')
# A threat's modeled nuclear outcome must not be narrated as certain when the draw fails.
for c in countries:
 for n in c['nodes']:
  for ch in n['choices']:
   for e in ch['effects']:
    e['text']=re.sub(r'\s*\((?:Historian|Student|random)[^)]*\)', '',e['text']).strip()
    if e.get('chance',{}).get('flag')=='NUKE_USED':
     e['chance']['successText']='A nuclear weapon is used. The crisis has crossed a threshold; leaders now face the danger of a wider exchange.'
     e['chance']['failureText']='Leaders stop short of nuclear use in this run. The confrontation still damages trust and raises the risk of another crisis.'
    elif e.get('chance'):
     e['chance']['successText']=e['text']+' In this run, the proposed outcome takes hold.'
     e['chance']['failureText']='The proposed outcome does not take hold in this run. Rival leaders resist the pressure; the uncertainty changes their next calculations.'
    e['region']= 'Americas' if e['lng'] < -30 else ('Europe' if e['lat']>35 and e['lng']<60 else ('Africa & Middle East' if e['lng']<60 else 'Asia & Pacific'))
# Correct a future event being described as already completed in 1987.
usa=countries[0]
usa['nodes'][7]['year']='1987–91'
usa['nodes'][7]['situation']='Gorbachev has freed dissidents and is discussing withdrawal from Afghanistan. He offers to eliminate intermediate-range missiles. Eastern Europe is restless, and the Soviet economy is struggling. Hardliners in Washington call it a trick. Do you negotiate, increase the pressure, or help keep a reforming Soviet Union together?'
# Each era is a historical decision laboratory; explicit variants cover the largest changed assumptions.
variants={
 'CHN_T5':[(['CHINA_GRADUAL'],'Your earlier reforms have avoided the worst economic damage in this timeline. Mao still fears losing control of the party. Choose whether to expand political campaigns, defend gradual reform, or export confrontation abroad.')],
 'CHN_T8':[(['CHINA_OPEN'],'Your earlier political opening gives students more room to organize. Demands for wider reform confront the party leadership as Eastern Europe changes. Continue dialogue, impose martial law, or retreat from economic reform?')],
 'CUB_T2':[(['CUBA_DEMOCRATIC'],'A transition is being negotiated. Your movement must decide how to convert popular support into a government.')],
 'CUB_T3':[(['CUBA_DEMOCRATIC'],'Your elected government faces a land-and-sugar dispute with American companies. Washington wants compensation; Moscow offers a market. How far will your reforms go?')],
 'CUB_T4':[(['NAM_STRONG'],'Your non-aligned policy has kept some distance from Moscow. Now a Soviet military offer tests that independence. Accepting missiles would reverse your earlier course.')],
 'USSR_T4':[(['KOREA_AVOIDED'],'You avoided a war in Korea, but the nuclear imbalance remains. Cuba offers a way to challenge Washington near its own coast. Decide whether to negotiate a withdrawal, confront the US, or put pressure on Berlin instead.')],
 'FRG_T3':[(['FRG_NEUTRAL'],'Your earlier choice pushed Germany toward neutrality. Western governments now offer closer economic and security ties. You can reconsider that course or strengthen trade across the divide.')],
 'FRG_T4':[(['EARLY_REUNIFICATION'],'Your reunification bargain has held in this timeline. Now Soviet and Western demands test German neutrality. Treat the three strategies below as responses to a new access crisis in Berlin.')]
}
for c in countries:
 for n in c['nodes']:
  n['variants']=[{'requires':f,'situation':t} for f,t in variants.get(n['id'],[])]
  rival='Washington' if c['id'] in ['USSR','CHN','CUB'] else 'Moscow'
  n['headlines']=[{'city':c['capital'],'name':'The National Dispatch','headline':n['title'],'deck':'The cabinet faces a choice. Security, prosperity and credibility are all on the table.'},{'city':rival,'name':'Foreign Desk','headline':'A rival watches your next move','deck':'Will this decision change the balance of power, or confirm what the other side already fears?'},{'city':'New Delhi' if c['id']!='IND' else 'Cairo','name':'The Independent Wire','headline':'Far from the table. Close to the consequences.','deck':'Countries outside the great-power rivalry ask what this crisis will mean for them.'}]
  adv=[]
  roles=[('General','TENSION',True),('Diplomat','TENSION',False),('Treasurer','ECON',True),('Spymaster','INFLUENCE',True)]
  for role,m,high in roles:
   pick=sorted(n['choices'],key=lambda x:x['meterDelta'].get(m,0),reverse=high)[0]
   lines={}
   for ch in n['choices']:
    delta=ch['meterDelta'].get(m,0)
    if role=='General':line='This raises the pressure. Be ready for the other side to answer.' if delta>0 else 'This gives us breathing room. Make sure our defenses hold while we use it.'
    elif role=='Diplomat':line='A quieter confrontation leaves room to negotiate. Keep a channel open.' if delta<=0 else 'Expect allies to worry about the risk. Explain where our commitment ends.'
    elif role=='Treasurer':line='This puts resources back into our economy. Recovery gives us choices later.' if delta>0 else ('We will pay for this. Decide what domestic spending can wait.' if delta<0 else 'The immediate budget holds. Watch the longer-term costs.')
    else:line='Others may listen more closely. Influence works only if they believe our promises.' if delta>0 else 'Our partners could hedge their bets. Watch where their commitments begin to weaken.'
    lines[ch['id']]=line
   adv.append({'id':role.lower(),'name':'The '+role,'recommends':pick['id'],'lines':lines})
  n['advisors']=adv
# One explicit conditional branch makes the two-war-avoidance ending possible in a single-country game.
# The source gave its two required flags to different countries, so they could never coexist.
import copy
quiet=copy.deepcopy(choices['USA_T7_B'])
quiet['label']='Nuclear Freeze & Afghan Neutrality'
quiet['summary']='Building on your Vietnam settlement, propose reciprocal restraint and an internationally backed neutral Afghanistan.'
quiet['flags']=['AFGHAN_SKIPPED']
quiet['effects'][0].update(place='Kabul, Afghanistan',lat=34.53,lng=69.17,region='Asia & Pacific',text='In this counterfactual branch, a neutrality bargain persuades Moscow to avoid direct intervention. Afghanistan’s internal conflict still continues.',insight='Avoiding a superpower invasion does not resolve local conflicts. Reciprocal restraint can narrow the outside incentives to escalate.')
for effect in quiet['effects'][1:]:
 if 'Afghan' in effect['text'] or 'mujahideen' in effect['text']:
  effect['text']='A negotiated Afghan neutrality changes the region’s alignments. Rival governments test the promises of non-intervention.'
choices['USA_T7_B']['conditional']=[{'requires':['VIETNAM_NEUTRAL'],'label':quiet['label'],'summary':quiet['summary'],'flags':quiet['flags'],'effects':quiet['effects']}]
usa['nodes'][6]['variants'].append({'requires':['VIETNAM_NEUTRAL'],'situation':'Your earlier Vietnam settlement has created a precedent for negotiated neutrality. In this alternate 1979, Moscow is weighing intervention in Afghanistan. A reciprocal deal might keep its troops out, though the Afghan civil war continues. Iran holds American hostages, and European missile deployments remain in dispute.'})
# Use the actual countries and consequences in the reconstructed newspaper decks.
for c in countries:
 for n in c['nodes']:
  effects=n['choices'][0]['effects']
  n['headlines'][0]['deck']=n['situation'].split('. ')[0]+'.'
  rival=next((e for e in effects if e['place'].startswith(n['headlines'][1]['city'])),effects[1])
  distant=max(effects,key=lambda e:abs(e['lng']-c['lng'])+abs(e['lat']-c['lat']))
  n['headlines'][1]['headline']='The view from '+rival['place'].split(',')[0]
  n['headlines'][1]['deck']='At stake: '+rival['insight']
  n['headlines'][2]['city']=distant['place'].split(',')[0]
  n['headlines'][2]['headline']='A crisis with a long reach'
  n['headlines'][2]['deck']='The question here: '+distant['insight']
choices['CUB_T2_B']['label']='Urban Sabotage Campaign'
for c in countries: write(c['id'],c)
write('countries',[{k:v for k,v in c.items() if k!='nodes'} for c in countries])
# Conditions remain data; nested any/all express the source's alternatives.
def flag(s,set=True): return {'flag':s,'set':set}
def meter(s,op,v):return {'meter':s,'op':op,'value':v}
def anyof(*cs):return {'any':list(cs)}
def allof(*cs):return {'all':list(cs)}
cs=[
[anyof(meter('TENSION','>=',100),allof(flag('NUKE_USED'),meter('TENSION','>=',90)))],
[flag('NUKE_USED'),meter('TENSION','<=',89)], [flag('CHINA_WAR')], [flag('BERLIN_WAR')], [flag('KOREA_SECOND_WAR')], [meter('STABILITY','<=',10)],
[anyof(flag('WEST_ECON_COLLAPSE'),allof(anyof(*[{'country':x} for x in ['USA','UK','FRG']]),meter('ECON','<=',12)))],
[flag('POLAND_INVADED'),flag('WALL_STANDS'),anyof({'notCountry':'USSR'},meter('INFLUENCE','>=',60))],
[flag('US_ISOLATION'),{'country':'USA'},meter('INFLUENCE','<=',30)], [flag('SINO_SOVIET_HEAL'),flag('NO_DETENTE')], [flag('GORBY_HARDLINE'),flag('WALL_STANDS')], [flag('USSR_CHINESE_PATH'),flag('USSR_SURVIVES')], [flag('USSR_SURVIVES'),flag('GORBY_REFORM')],
[anyof(flag('HUNGARY_FREE'),flag('PRAGUE_FREE')),meter('TENSION','<=',45)], [{'country':'CHN'},meter('ECON','>=',75),flag('TIANANMEN',False)],
[anyof(flag('NAM_STRONG'),allof({'country':'IND'},meter('INFLUENCE','>=',70)))], [anyof(flag('VIETNAM_TOTAL'),allof(meter('TENSION','>=',65),meter('TENSION','<=',89)))], [flag('VIETNAM_NEUTRAL'),flag('AFGHAN_SKIPPED')], [anyof({'historicalPct':'>=','value':75},allof(flag('GORBY_REFORM'),flag('USSR_SURVIVES',False)))], []]
ends=read('endings')
for e,cond in zip(ends,cs):
 e['conditions']=cond;e['tagline']=e['card'].split('. ')[0]+'.';e['reality']=e['reality'].replace('— ','',1)
write('endings',ends)
# Geography of the lunar effect is represented by mission control, never fake Earth coordinates for the Moon.
flash=[
('1949','Joe-1','The Soviet Union has tested an atomic bomb. How should {country} explain a world with two nuclear powers?', [('Tell the public',{'STABILITY':-4,'INFLUENCE':3},'Los Alamos',35.88,-106.3,'A second nuclear power changes the balance. American leaders accelerate work on a hydrogen bomb.','An opponent’s breakthrough can become an argument for your next weapon.'),('Delay the announcement',{'STABILITY':2,'INFLUENCE':-2},'Washington, DC',38.9,-77.04,'Secrecy delays public debate, but evidence and leaks make silence harder to sustain.','Protecting confidence today can undermine trust when concealed information emerges.')]),
('1957','A signal from space','Sputnik passes above every capital. People in {country} look up and ask who is ahead.', [('Fund science and spaceflight',{'ECON':-4,'INFLUENCE':6},'Baikonur',45.62,63.31,'The orbiting satellite turns science education and rockets into national priorities.','A technological demonstration can change budgets far beyond the laboratory.'),('Call it a stunt',{'ECON':2,'INFLUENCE':-5},'{capital}',0,0,'Public concern about an apparent missile gap outgrows the official reassurance.','Dismissing a rival’s achievement leaves others to define what it means.')]),
('1960','The plane that did not come home','A U-2 spy plane is shot down over the Soviet Union. Choose the public position {country} supports.', [('Support an admission',{'TENSION':5,'INFLUENCE':2},'Paris',48.86,2.35,'The summit collapses amid the spy-plane dispute.','Diplomacy depends on trust as well as what each side already knows.'),('Support a denial',{'TENSION':8,'STABILITY':-3},'Moscow',55.76,37.62,'Evidence of the flight turns a denial into a public embarrassment.','A cover story fails when the other side holds the evidence.')]),
('1967','Six days, a changed map','War in the Middle East draws in the superpower rivalry. What position does {country} take?', [('Back your partner',{'TENSION':6},'Cairo',30.04,31.24,'Military defeat and victory deepen dependence on outside patrons.','Local wars become international crises when allies make them tests of credibility.'),('Push for a UN settlement',{'TENSION':-3,'INFLUENCE':2},'New York',40.75,-73.97,'Resolution 242 becomes a disputed framework for negotiations.','A shared diplomatic text can create a channel even when its meaning is contested.')]),
('1969','Footprints on another world','People gather around television sets as Apollo 11 reaches the Moon. How does {country} cover it?', [('Broadcast the landing',{'INFLUENCE':4},'Houston',29.76,-95.37,'Mission control watches the landing in the Sea of Tranquility. The audience is worldwide.','A scientific achievement can shape perceptions of an entire political system.'),('Downplay the landing',{'STABILITY':1,'INFLUENCE':-3},'{capital}',0,0,'Foreign broadcasts and word of mouth carry the news anyway.','Information crosses borders even when official media stay quiet.')]),
('1973','The price of oil','Oil prices rise sharply. The costs reach households and factories in {country}.', [('Ration and fund alternatives',{'STABILITY':-5},'Riyadh',24.71,46.68,'Efficiency and new energy investment ease dependence over time.','Short-term sacrifice can reduce the leverage held by a vital supplier.'),('Borrow and subsidize',{'STABILITY':3,'ECON':-6},'{capital}',0,0,'Subsidies soften the immediate shock while debt and inflation build.','Making a cost less visible does not make it disappear.')]),
('1983','One man says no','On 26 September, a Soviet warning system reports five incoming US missiles. Duty officer Stanislav Petrov judges it a false alarm.', [('Continue',{'TENSION':-10},'Serpukhov-15',55.08,37.07,'Petrov reports a false alarm. Satellite reflections, not incoming missiles, triggered the warning.','Judgment by someone outside the cabinet can interrupt a dangerous chain of escalation.')]),
('1986','An invisible cloud','Chernobyl has released radioactive material across borders. How should {country} respond to the first reports?', [('Demand rapid disclosure',{'STABILITY':-6,'INFLUENCE':5},'Stockholm',59.33,18.07,'Swedish radiation monitoring helps expose a disaster that cannot stay within national borders.','Independent measurements can challenge an official account.'),('Support a cover-up',{'STABILITY':2},'Kyiv',50.45,30.52,'Public events proceed while the danger remains concealed. Trust falls when the scale becomes clear.','Withholding health information can trade brief calm for lasting distrust.')])]
fl=[]
for i,(year,title,prompt,opts) in enumerate(flash):
 options=[]
 for j,(label,delta,place,lat,lng,txt,insight) in enumerate(opts):
  ef={'id':f'FP{i+1}_{j+1}_E1','place':place,'lat':lat,'lng':lng,'text':txt,'insight':insight,'region':'World'}
  if i==5 and j==0:ef.update(delay=1,meterDelta={'ECON':3})
  if i==7 and j==1:ef['meterDelta']={'STABILITY':-10}
  options.append({'id':f'FP{i+1}_{j+1}','label':label,'meterDelta':delta,'effect':ef})
 fl.append({'id':f'FP{i+1}','afterTurn':i+1,'year':year,'title':title,'prompt':prompt,'cutscene':i==6,'options':options})
write('flashpoints',fl)
terms={'containment':'A policy of limiting a rival’s expansion rather than trying to overthrow it everywhere.','détente':'An easing of tensions through talks, agreements and trade, without ending the underlying rivalry.','proxy war':'A conflict in which outside powers support local forces rather than fight each other directly.','MAD':'Mutually assured destruction: the belief that both sides could retaliate with devastating nuclear force.','non-alignment':'An effort to remain outside the major military blocs while pursuing independent foreign policy.','sphere of influence':'A region where a powerful country expects special influence over other states’ decisions.','domino theory':'The belief that one country becoming communist could cause neighboring countries to follow.','brinkmanship':'Taking a crisis close to conflict to pressure an opponent into giving way.','glasnost':'Gorbachev’s policy of greater openness, including more public criticism of Soviet institutions.','Ostpolitik':'West Germany’s effort to improve relations with Eastern Europe through treaties and practical contacts.','hegemon':'A state with enough power to shape the rules and behavior of others.','deterrence':'Trying to prevent an action by making its expected cost unacceptable.','perestroika':'Gorbachev’s attempt to restructure the Soviet economy and political system.','armistice':'An agreement to stop fighting. It does not necessarily end a war or settle its causes.','sovereignty':'A state’s authority to govern itself and make its own decisions.'}
write('vocabulary',[{'term':k,'definition':v} for k,v in terms.items()])
badges=[('arkhipov','Arkhipov Award','Choose de-escalation when tension is at least 80.'),('historian','Historian','Make at least seven historical decisions.'),('chaos','Chaos Theorist','Survive eight decisions without following history.'),('collector','Butterfly Collector','Open every consequence in a complete game.'),('passport','Passport','Finish as three different countries.'),('perspective','Perspective','Play the same era as the US and USSR.'),('long-game','Long Game','Reach The Long Peace or The Grand Bargain.'),('cassandra','Cassandra','Predict a historically followed advisor six times in one game.'),('treasurer','Treasurer’s Friend','Finish with an economy of at least 80.'),('peace','No Man’s Land','Finish with tension at 20 or below.'),('nonaligned','Non-Aligned','Reach The Third Way Wins.'),('reader','Debrief Reader','Open all three discussion questions.')]
write('badges',[{'id':i,'name':n,'description':d} for i,n,d in badges])
write('sources',[
 {'title':'US National Archives · Marshall Plan documents','url':'https://www.archives.gov/milestone-documents/marshall-plan','note':'Primary documents on European recovery.'},
 {'title':'US National Archives · Cuban Missile Crisis','url':'https://www.archives.gov/publications/prologue/2002/fall/cuban-missiles.html','note':'Archival photographs, decisions and chronology.'},
 {'title':'Wilson Center Digital Archive','url':'https://digitalarchive.wilsoncenter.org/','note':'Declassified records from multiple countries.'},
 {'title':'National Army Museum · Battle of the Imjin River','url':'https://www.nam.ac.uk/explore/battle-imjin','note':'British forces in the Korean War.'},
 {'title':'John Lewis Gaddis · The Cold War','url':'https://search.worldcat.org/search?q=ti%3AThe+Cold+War+au%3AGaddis','note':'A broad introduction to the rivalry.'},
 {'title':'Odd Arne Westad · The Global Cold War','url':'https://search.worldcat.org/search?q=ti%3AThe+Global+Cold+War+au%3AWestad','note':'Interventions and their consequences across the Global South.'},
 {'title':'Michael Dobbs · One Minute to Midnight','url':'https://search.worldcat.org/search?q=ti%3AOne+Minute+to+Midnight+au%3ADobbs','note':'The Cuban crisis from multiple perspectives.'},
 {'title':'Tony Judt · Postwar','url':'https://search.worldcat.org/search?q=ti%3APostwar+au%3AJudt','note':'Europe after 1945.'},
 {'title':'Chen Jian · Mao’s China and the Cold War','url':'https://search.worldcat.org/search?q=ti%3AMaos+China+and+the+Cold+War+au%3AChen','note':'Chinese foreign policy and revolutionary politics.'},
 {'title':'Neil Sheehan · A Bright Shining Lie','url':'https://search.worldcat.org/search?q=ti%3AA+Bright+Shining+Lie+au%3ASheehan','note':'The American war in Vietnam.'}])
print('Enriched 56 eras; wrote endings, flashpoints, vocabulary, badges and sources.')
