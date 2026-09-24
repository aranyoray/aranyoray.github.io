"""Import the two author-provided specs: python scripts/import-spec.py PART1 PART2.
The committed JSON is the editable source of truth; the importer records editorial adaptations.
"""
import json,re,sys
from pathlib import Path
p1,p2=[Path(p).read_text() for p in sys.argv[1:3]]
out=Path(__file__).resolve().parent.parent/'public/content/cold-war'
clean=lambda s: re.sub(r'[*`]', '',s).replace('−','-').strip().rstrip(' ·')
coords={}
for m in re.finditer(r'([\wÀ-ž–\- ,]+?)\s*\(([−\-\d.]+),\s*([−\-\d.]+)(?:, [^)]+)?\)',p1+'\n'+p2):
 name=clean(m[1]).split('\n')[-1].strip(' -')
 coords[name]=[float(m[2].replace('−','-')),float(m[3].replace('−','-'))]
 coords[name.split(',')[0]]=coords[name]
coords.update({'Washington':[38.90,-77.04],'Delhi':[28.61,77.21],'East Berlin':[52.52,13.4],'West Berlin':[52.52,13.4],'Berlin':[52.52,13.4],'West Germany':[50.74,7.1],'Havana':[23.11,-82.37],'New Delhi':[28.61,77.21],'Srinagar':[34.08,74.80],'Moscow':[55.76,37.62],'Prague':[50.08,14.44],'Beijing':[39.9,116.4],'Stockholm':[59.33,18.07],'Kyiv':[50.45,30.52],'Los Alamos':[35.88,-106.3],'Serpukhov-15':[55.08,37.07],'Baikonur':[45.62,63.31],'Huntsville':[34.73,-86.59]})
meta=[('USA','United States','Washington, DC',65,70,60),('USSR','Soviet Union','Moscow',45,35,55),('CHN','China','Beijing',40,25,35),('UK','United Kingdom','London',55,35,55),('FRG','West Germany','Bonn',45,30,25),('CUB','Cuba','Havana',40,30,20),('IND','India','New Delhi',35,25,40)]
sections={}
for cid,*_ in meta:
 source=p1 if cid in ['USA','USSR','CHN','UK'] else p2
 pattern=rf'(?:### |\*\*)({cid}_T(\d)) · (.*?) · "(.*?)"(?:\*\* — |\n\*\*Situation:\*\* )(.*?)(?=\n(?:### |\*\*)[A-Z]+_T|\n## |\n### 6\.|\n\*\*Cuba/India|\Z)'
 sections[cid]=list(re.finditer(pattern,source,re.S))
 assert len(sections[cid])==8,(cid,len(sections[cid]))
coords.update({'Imjin':[37.98,126.87], 'Santiago':[20.02,-75.83], 'Vallegrande':[-18.5,-64.1], 'Washington/Moscow':[45,-20]})
missing=set()
def loc(s):
 s=clean(s)
 m=re.search(r'\(([\d.−\-]+),\s*([\d.−\-]+)(?:,[^)]+)?\)',s)
 if m:return s[:m.start()].strip(),[float(m[1].replace('−','-')),float(m[2].replace('−','-'))]
 if s not in coords:missing.add(s)
 return s,coords.get(s,[0,0])
def insight_for(text):
 rules=[('aid|loan|subsid|money|fund|capital|trade|market|oil|econom','Economic dependence gives the country supplying money, fuel or trade political leverage.'),('nuclear|missile|bomb|arms race','A threat to one side changes the other side’s calculations, encouraging it to build or seek protection.'),('alliance|ally|allies|NATO|patron','Partners judge a commitment by what it costs you to keep it. A changed commitment reshapes their choices.'),('protest|election|party|public|government|opposition|reform','Foreign decisions alter domestic coalitions. Leaders must answer to the institutions and people keeping them in power.'),('war|troops|army|fight|invad|military','A military commitment consumes resources and creates new security fears beyond the original battlefield.')]
 for pattern,insight in rules:
  if re.search(pattern,text,re.I):return insight
 return 'A choice in one capital changes the options available elsewhere. Local leaders respond to the new balance of risk and opportunity.'
def meters(s):
 keys={'STAB':'STABILITY','INFL':'INFLUENCE'}
 return {keys.get(m[1],m[1]):int(m[2].replace('−','-').replace(' ','')) for m in re.finditer(r'(TENSION|STABILITY|STAB|ECON|INFLUENCE|INFL)\s*([+−-]?\s*\d+)',s)}
# Explicit probabilities are model assumptions from the supplied design, not empirical historical odds.
chance={'USA_T4_B':('NUKE_USED',.5,.25,5),'USA_T4_C':('CUBA_MISSILES_STAY',.4,.4,4),'USA_T6_C':('SINO_SOVIET_HEAL',.3,.3,0),'USA_T7_C':('POLAND_INVADED',.6,.6,0),'USSR_T1_C':('NUKE_USED',.2,.1,1),'USSR_T2_C':('NUKE_USED',.3,.15,1),'USSR_T4_B':('NUKE_USED',.45,.25,0),'USSR_T6_C':('SINO_SOVIET_HEAL',.6,.6,0),'CHN_T2_C':('NUKE_USED',.35,.175,1)}
# Flags attached to clearly described outcomes, missing from the shorthand spec.
chance.update({'CUB_T4_C':('NUKE_USED',.4,.2,1),'FRG_T2_B':('EARLY_REUNIFICATION',.5,.5,0)})
extra={'USA_T8_B':['WALL_STANDS'],'USSR_T6_B':['NO_DETENTE'],'USSR_T6_C':['NO_DETENTE'],'CHN_T6_B':['NO_DETENTE'],'CHN_T6_C':['SINO_SOVIET_HEAL'],'CHN_T8_C':['TIANANMEN','GORBY_HARDLINE','WALL_STANDS'],'USSR_T7_C':['GORBY_HARDLINE'],'FRG_T8_A':['GORBY_REFORM'],'UK_T8_A':['GORBY_REFORM'],'CUB_T8_A':['GORBY_REFORM'],'IND_T8_A':['GORBY_REFORM']}
allcountries=[]
for cid,name,capital,stab,econ,infl in meta:
 src=p1 if cid in ['USA','USSR','CHN','UK'] else p2
 start=sections[cid][0].start()
 intro=re.findall(r'\*\*Intro(?: \(80 words\))?:\*\* (.*)',src[:start])[-1]
 country={'id':cid,'name':name,'capital':capital,'lat':coords[capital][0],'lng':coords[capital][1],'intro':clean(intro),'startMeters':{'TENSION':40,'STABILITY':stab,'ECON':econ,'INFLUENCE':infl},'nodes':[]}
 for match in sections[cid]:
  nid,turn,year,title,body=match.groups()
  node={'id':nid,'turn':int(turn),'year':year,'title':title,'situation':clean(body.split('\n')[0]),'choices':[]}
  full=cid in ['USA','USSR']
  if full: choices=list(re.finditer(r'^\*\*([ABC])\. (.*?)\*\*(.*?)\nΔ (.*?)\n(.*?)(?=\n\*\*[ABC]\. |\Z)',body,re.M|re.S))
  else: choices=list(re.finditer(r'^- ([ABC])\. (.*?)Δ (.*)$',body,re.M))
  for c in choices:
   letter=c[1]; ident=nid+'_'+letter
   if full:
    label=clean(c[2]); hist='historical' in c[3]; summary=clean(c[3].split(' — ',1)[-1]); delta=c[4]
    effects=[]
    for line in c[5].splitlines():
     if not line.startswith('- '):continue
     location,desc=line[2:].split(' — ',1)
     text,insight=desc.split('*Insight:*',1)
     text=re.sub(r'\*?\((?:random|Historian)[^)]*\)\*?','',text)
     place,xy=loc(location)
     effects.append({'id':ident+'_E'+str(len(effects)+1),'place':place,'lat':xy[0],'lng':xy[1],'text':clean(text),'insight':clean(insight)})
   else:
    label=clean(re.sub(r'\*\(hist\)\*','',c[2]));hist='(hist)' in c[2];summary=label
    parts=c[3].split(' · '); delta='';effects=[]
    for part in parts:
     # Effect segments always have a place followed by a colon.
     if ':' not in part or part.lstrip().startswith(('flag','**','*')):delta+=' '+part;continue
     location,desc=part.split(':',1)
     place,xy=loc(location)
     pair=desc.split(' — ',1)
     text=pair[0];insight=pair[1] if len(pair)>1 and 'NUKE_USED' not in pair[1] else insight_for(text)
     effects.append({'id':ident+'_E'+str(len(effects)+1),'place':place,'lat':xy[0],'lng':xy[1],'text':clean(text),'insight':clean(insight)})
   label=label.rstrip('· ').strip()
   choice={'id':ident,'label':label,'summary':summary,'historical':hist,'meterDelta':meters(delta),'flags':re.findall(r'`([A-Z_]+)`',delta),'effects':effects}
   choice['flags']=list(dict.fromkeys(choice['flags']+extra.get(ident,[])))
   if ident in chance:
    flag,h,s,idx=chance[ident];choice['flags']=[f for f in choice['flags'] if f!=flag]
    effects[idx]['chance']={'flag':flag,'historian':h,'student':s}
   if ident=='CUB_T4_A':
    effects[-1]['meterDelta']={'TENSION':-15}
   if ident=='USA_T4_A':
    choice['meterDelta']['TENSION']=15;effects[-1]['meterDelta']={'TENSION':-25}
   # Long labels stay intact as summaries; the UI gets a short label.
   if len(label.split())>8:
    short=label.split(' — ')[0].split(' + ')[0]
    choice['label']=short if len(short.split())<=8 else ' '.join(short.split()[:8])+'…'
    choice['summary']=label+('. '+summary if summary!=label else '')
   node['choices'].append(choice)
   assert len(effects) in [5,6],(ident,len(effects))
  assert len(node['choices'])==3,(nid,len(node['choices']))
  country['nodes'].append(node)
 allcountries.append(country)
if missing:
 print('MISSING COORDINATES:',sorted(missing));sys.exit(1)
for c in allcountries:(out/(c['id']+'.json')).write_text(json.dumps(c,ensure_ascii=False,indent=2)+'\n')
(out/'countries.json').write_text(json.dumps([{k:v for k,v in c.items() if k!='nodes'} for c in allcountries],ensure_ascii=False,indent=2)+'\n')
# Ending wording is preserved from part 2. Conditions use any/all for the disjunctions in part 1.
ids=re.findall(r'\| \d+ \| (E\d+_[A-Z0-9_]+) \|',p1)
endings=[]
for m in re.finditer(r'\*\*(E\d+) · (.*?)\*\* \((?:priority )?(\d+)(?:, fallback)?\)\n\*Card:\* (.*?)\n\*Reality (.*?)\n\*Discuss:\* (.*)',p2):
 num,title,priority,card,reality,discuss=m.groups()
 endings.append({'id':next(i for i in ids if i.startswith(num+'_')),'title':title,'priority':int(priority),'card':card,'reality':reality.replace('.*','.',1).replace('.* ','. '),'discuss':discuss.split(' · ')})
assert len(endings)==20
(out/'endings.json').write_text(json.dumps(endings,ensure_ascii=False,indent=2)+'\n')
print(f'Imported {len(allcountries)} countries, 56 turns, 168 choices, {sum(len(ch["effects"]) for c in allcountries for n in c["nodes"] for ch in n["choices"])} effects, 20 endings')
