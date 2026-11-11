import markdown,re,sys,json,subprocess,base64
C=sys.argv[1:]
LV=[('قصوى','🔴 أهمية قصوى: لازم يعرفها المدرب','hi'),('متوسطة','🟡 أهمية متوسطة: يفيد يعرفها','md'),('للعلم','🟢 للعلم: لا يؤثر على النتيجة','lo')]
def reorder(raw):
    parts=re.split(r'^## ',raw,flags=re.M)
    head=parts[0].strip(); items=[]; n=0
    for sec in parts[1:]:
        title,_,body=sec.partition('\n')
        kind='خطأ في الكتاب' if 'أخطاء' in title else 'قرار المدرب'
        for blk in re.split(r'^(?=### )',body,flags=re.M):
            if not blk.startswith('### '): continue
            m=re.search(r'\*\*الأهمية:\*\*\s*(\S+)',blk); lv=m.group(1) if m else 'متوسطة'
            blk=re.sub(r'^- \*\*الأهمية:\*\*.*\n','',blk,flags=re.M)
            lm=re.search(r'الدرس\s*(\d+)\.(\d+)',blk.split('\n')[0])
            key=(int(lm.group(1)),int(lm.group(2))) if lm else (999,0)
            h,_,rest=blk.partition('\n')
            items.append((lv,key,n,h[4:].strip(),kind,rest.strip())); n+=1
    head=re.sub(r'\n?حسب الأهمية:.*','',head)
    cn={lv:sum(1 for i in items if i[0]==lv) for lv,_,_ in LV}
    head+='\n\nحسب الأهمية: '+'، '.join(f'{cn[lv]} {lv}' for lv,_,_ in LV)+'.'
    out=[head]
    for lv,title,cls in LV:
        its=sorted([i for i in items if i[0]==lv],key=lambda i:(i[1],i[2]))
        if not its: continue
        out.append(f'<h2 class="lv {cls}">{title} ({len(its)})</h2>')
        for i in its:
            out.append(f'### <span class="tag">{i[4]}</span> {i[3]}\n\n{i[5]}\n')
    return '\n\n'.join(out)
logo=base64.b64encode(open('logo_color_c.png','rb').read()).decode()
for c in C:
    cj=open(f'/home/claude/lib/courses/{c}/course.js',encoding='utf8').read()
    m=re.search(r"title\s*:\s*'([^']+)'\s*,\s*sub\s*:\s*'([^']*)'",cj); name=(m.group(1)+' '+m.group(2)).strip()
    raw=open(f'/home/claude/st/reports/dec/{c}.md',encoding='utf8').read()
    md=reorder(raw)+'\n\n'+open('/home/claude/st/reports/dec/_general.md',encoding='utf8').read()
    md=md.replace('- [ ] ','- ☐ ')
    def cnt(n,one,two,few,many):
        n=int(n); return one if n==1 else two if n==2 else f'{n} {few}' if n<=10 else f'{n} {many}'
    def fixline(m):
        e,d=m.group(1),m.group(2)
        return 'عدد البنود: '+cnt(e,'خطأ واحد','خطآن','أخطاء','خطأً')+' في الكتاب، و'+cnt(d,'قرار واحد','قراران','قرارات','قراراً')+' للمدرب.'
    md=re.sub(r'عدد البنود:\s*(\d+)\s*\S+ في الكتاب،\s*و\s*(\d+)\s*\S+ للمدرب\.?',fixline,md)
    L=r"A-Za-z0-9.,=+\-−×·/Ωµμ°%\u0370-\u03FF²³⁰¹⁴⁵⁶⁷⁸⁹⁻∠≈Δφθαβωπε√_′″'*"
    def w(m):
        t=m.group(0); pre=''; post=''
        while t.count('(')<t.count(')') and t.rstrip().endswith(')'):
            k=len(t.rstrip()); post=t[k-1:]+post; t=t[:k-1]
        while t.count('(')>t.count(')') and t.lstrip().startswith('('):
            k=len(t)-len(t.lstrip()); pre+=t[:k+1]; t=t[k+1:]
        mm=re.search(r'[.,]+\s*$',t)
        if mm: post=t[mm.start():]+post; t=t[:mm.start()]
        core=t.strip()
        if re.search(r'[0-9]',core) and re.search(r'[A-Za-zΩµμ°%\u0370-\u03FF∠]',core) and len(core)>2:
            lead=t[:len(t)-len(t.lstrip())]; tail=t[len(t.rstrip()):]
            return pre+lead+'<span dir="ltr">'+core+'</span>'+tail+post
        return m.group(0)
    md=re.sub(r'(?<![<\w])[%s][%s ]*[%s]'%(L,L,L),w,md)
    pass
    md=re.sub(r'^([^\n\-|#\s][^\n]*)\n(?=[-*] |\d+\. )',r'\1\n\n',md,flags=re.M)
    md=re.sub(r'^([^\n|]+)\n(?=\|)',r'\1\n\n',md,flags=re.M)
    md=re.sub(r'^( +)(?=[-*] |\d+\. )',lambda m:' '*(4*((len(m.group(1))+1)//2)),md,flags=re.M)
    body=markdown.markdown(md,extensions=['tables','sane_lists'])
    body=re.sub(r'<h3>(.*?)</h3>\s*<ul>(.*?)</ul>',lambda m:'<div class="card"><h3>'+m.group(1)+'</h3><ul>'+m.group(2).replace('<li><strong>القرار:','<li class="dec"><strong>القرار:')+'</ul></div>',body,flags=re.S)
    html=f'''<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>
@font-face{{font-family:'grk';src:local('DejaVu Sans');unicode-range:U+0370-03FF,U+00B5,U+2200-22FF}}
@page{{size:A4;margin:16mm 14mm 16mm 14mm}}
body{{font-family:'grk','thmanyah sans','DejaVu Sans';font-size:11pt;line-height:1.75;color:#1d2a33;margin:0}}
.hd{{border-bottom:3px solid #12855A;padding-bottom:10px;margin-bottom:14px}}
.hd img{{height:62px;display:block;margin-bottom:8px}}
td:first-child{{white-space:nowrap}}
h1{{font-size:20pt;margin:0;color:#123A2B;font-weight:900;line-height:1.4}}
.sub{{color:#12855A;font-size:11.5pt;margin-top:4px}}
.lead{{background:#eef6f1;border-inline-start:4px solid #12855A;padding:8px 12px;border-radius:8px;margin:0 0 10px}}
h2{{font-size:14.5pt;color:#fff;background:linear-gradient(90deg,#123A2B,#0B2A1F);padding:5px 12px;border-radius:8px;margin:20px 0 8px;break-after:avoid}}
table{{border-collapse:collapse;width:100%;font-size:9.5pt;margin:6px 0 10px}}
th{{background:#123A2B;color:#fff;padding:5px 6px;font-weight:700;text-align:right}}
td{{border:1px solid #cfe3d7;padding:4px 6px;vertical-align:top}}
tr:nth-child(even) td{{background:#eef6f1}}
tr{{break-inside:avoid}} thead{{display:table-header-group}}
ul,ol{{padding-inline-start:20px;margin:4px 0}} li{{margin:2px 0;break-inside:avoid}}\nul.ck{{list-style:none;padding-inline-start:4px}}
p{{margin:4px 0}}
h2.lv.hi{{background:#9b2c2c}} h2.lv.md{{background:#a86b0c}} h2.lv.lo{{background:linear-gradient(90deg,#123A2B,#0B2A1F)}}
.tag{{font-size:8.5pt;font-weight:600;color:#12855A;border:1px solid #12855A;border-radius:10px;padding:0 7px;margin-inline-end:6px;vertical-align:2px}}
.card{{border:1px solid #cfe3d7;border-inline-start:5px solid #12855A;border-radius:10px;padding:6px 12px 8px;margin:8px 0;break-inside:avoid;background:#fff}}
.card h3{{margin:0 0 4px;font-size:12pt;color:#123A2B}}
.card ul{{list-style:none;padding:0;margin:0}} .card li{{margin:3px 0}}
.card li strong{{color:#12855A}}
.card li.dec{{background:#eef6f1;border-radius:6px;padding:3px 8px}}
</style></head><body>
<div class="hd"><img src="data:image/png;base64,{logo}"><h1>قرارات مقرر {name}</h1><div class="sub">المكتبة الرقمية للتقنية الكهربائية · 10 نوفمبر 2026</div></div>
<p class="lead">لمدرب المقرر: أخطاء الكتاب المؤثرة والقرارات التي اتُّخذت فيها، مع شرح كل مشكلة. البنود التي ما زالت تحتاج قراراً ليست في هذا الملف.</p>
{body}</body></html>'''
    open(f'{c}.html','w',encoding='utf8').write(html)
    print(c,name)
