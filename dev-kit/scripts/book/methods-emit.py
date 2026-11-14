import json,sys
d=json.load(open(sys.argv[1]));dept=sys.argv[3] if len(sys.argv)>3 else ''
J=lambda x:json.dumps(x,ensure_ascii=False)
o=['/* «طرق التدريب» — بيانات مقرر '+sys.argv[2]+' لـ shared/methods.js (الشكل والقواعد: API_METHODS.md)',
   '   rec موصى بها (طريقة أو اثنتان مع السبب) · ok مناسبة أيضاً · no لا تناسب (مع السبب)',
   '   مبدأ التوصية (المنسق): تُبنى على هدف الدرس الأساسي لا على الأدوات الموجودة فيه —',
   '     أول توصيل وتشغيل لآلة أو تجربة جديدة ← التقليد · هدفه علاقة أو منحنى يُستنتج ← الاكتشاف · هدفه التشخيص والأعطال ← حل المشكلات',
   '     · يكرر مهارة سبقت على آلة أو ظروف مختلفة ← المحاكاة (أو حل المشكلات إن كان التركيز على الأعطال) · يراجع ويبني على مقرر سابق ← K.W.L',
   '     «حل المشكلات» مناسبة أيضاً في كل درس فيه «اكتشف العطل». طريقتان موصى بهما معاً فقط إذا تساوتا فعلاً.',
   '   go لكل طريقة: هدف كل خطوة من خطوات الدليل بالترتيب — "التبويب[:أسلوب]>نص من عنوان الجزء"؛ الأول هو ما ينقل إليه «التالي» */',
   'window.METHODS_DATA={',' _meta:{dept:'+J(dept)+'},']
for k,v in d.items():
  o.append(f' /* {v["_title"]} */')
  o.append(f' {J(k)}:{{')
  o.append('  rec:'+J(v['rec'])+',')
  o.append('  ok:'+J(v['ok'])+',')
  if v.get('no'):o.append('  no:'+J(v['no'])+',')
  o.append('  go:{')
  g=v['go'];ks=list(g)
  for i,m in enumerate(ks):
    if isinstance(g[m],dict):
      o.append(f'   {m}:{{')
      ls=list(g[m])
      for j,l in enumerate(ls):o.append(f'    {l}:'+J(g[m][l])+(',' if j<len(ls)-1 else ''))
      o.append('   }'+(',' if i<len(ks)-1 else ''))
    else:o.append(f'   {m}:'+J(g[m])+(',' if i<len(ks)-1 else ''))
  o.append('  }');o.append(' },')
o[-1]=' }';o.append('};');print('\n'.join(o))
