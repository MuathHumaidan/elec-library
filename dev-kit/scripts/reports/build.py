import markdown,re,sys,json,subprocess,base64
C=sys.argv[1:]
logo=base64.b64encode(open('logo_color_c.png','rb').read()).decode()
for c in C:
    cj=open(f'/home/claude/lib/courses/{c}/course.js',encoding='utf8').read()
    m=re.search(r"title\s*:\s*'([^']+)'\s*,\s*sub\s*:\s*'([^']*)'",cj); name=(m.group(1)+' '+m.group(2)).strip()
    md=open(f'/home/claude/st/reports/{c}.md',encoding='utf8').read()
    md=md.replace('- [ ] ','- ☐ ')
    L=r"A-Za-z0-9.,=+\-−×·/Ωµ°%²³⁰¹⁴⁵⁶⁷⁸⁹⁻∠≈Δφθαβωπε√_′″'*"
    def w(m):
        t=m.group(0); pre=''; post=''
        while t.count('(')<t.count(')') and t.rstrip().endswith(')'):
            k=len(t.rstrip()); post=t[k-1:]+post; t=t[:k-1]
        while t.count('(')>t.count(')') and t.lstrip().startswith('('):
            k=len(t)-len(t.lstrip()); pre+=t[:k+1]; t=t[k+1:]
        core=t.strip()
        if re.search(r'[0-9]',core) and re.search(r'[A-Za-zΩµ°%∠]',core) and ' ' in core:
            lead=t[:len(t)-len(t.lstrip())]; tail=t[len(t.rstrip()):]
            return pre+lead+'<span dir="ltr">'+core+'</span>'+tail+post
        return m.group(0)
    md=re.sub(r'(?<![<\w])[%s][%s ]*[%s]'%(L,L,L),w,md)
    md=re.sub(r'^### ','## ',md,flags=re.M)
    md=re.sub(r'^([^\n\-|#\s][^\n]*)\n(?=[-*] |\d+\. )',r'\1\n\n',md,flags=re.M)
    md=re.sub(r'^([^\n|]+)\n(?=\|)',r'\1\n\n',md,flags=re.M)
    md=re.sub(r'^( +)(?=[-*] |\d+\. )',lambda m:' '*(4*((len(m.group(1))+1)//2)),md,flags=re.M)
    body=markdown.markdown(md,extensions=['tables','sane_lists'])
    body=re.sub(r'<ul>(\s*<li>☐)',r'<ul class="ck">\1',body)
    html=f'''<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>
@page{{size:A4;margin:16mm 14mm 16mm 14mm}}
body{{font-family:'thmanyah sans';font-size:11pt;line-height:1.75;color:#1d2a33;margin:0}}
.hd{{border-bottom:3px solid #2b7fa3;padding-bottom:10px;margin-bottom:14px}}
.hd img{{height:62px;display:block;margin-bottom:8px}}
td:first-child{{white-space:nowrap}}
h1{{font-size:20pt;margin:0;color:#123a4f;font-weight:900;line-height:1.4}}
.sub{{color:#2b7fa3;font-size:11.5pt;margin-top:4px}}
.lead{{background:#f4f7f9;border-inline-start:4px solid #2b7fa3;padding:8px 12px;border-radius:8px;margin:0 0 10px}}
h2{{font-size:14.5pt;color:#fff;background:#2b7fa3;padding:5px 12px;border-radius:8px;margin:20px 0 8px;break-after:avoid}}
table{{border-collapse:collapse;width:100%;font-size:9.5pt;margin:6px 0 10px}}
th{{background:#123a4f;color:#fff;padding:5px 6px;font-weight:700;text-align:right}}
td{{border:1px solid #d5dee4;padding:4px 6px;vertical-align:top}}
tr:nth-child(even) td{{background:#f4f7f9}}
tr{{break-inside:avoid}} thead{{display:table-header-group}}
ul,ol{{padding-inline-start:20px;margin:4px 0}} li{{margin:2px 0;break-inside:avoid}}\nul.ck{{list-style:none;padding-inline-start:4px}}
p{{margin:4px 0}}
</style></head><body>
<div class="hd"><img src="data:image/png;base64,{logo}"><h1>تقرير مراجعة مقرر {name}</h1><div class="sub">المكتبة الرقمية للتقنية الكهربائية · 10 نوفمبر 2026</div></div>
<p class="lead">تقرير لمدرب المقرر: كل قرار اتخذه المنسق، وكل إضافة أو تعديل لا يطابق الكتاب، والنقاط التي تحتاج مراجعتك (المربعات ☐ في آخر التقرير).</p>
{body}</body></html>'''
    open(f'{c}.html','w',encoding='utf8').write(html)
    print(c,name)
