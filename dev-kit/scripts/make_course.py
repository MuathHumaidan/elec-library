import sys,os
# ملفات «الأنشطة التفاعلية» الاختيارية: تُضاف تلقائياً إذا وُجدت في مجلد المقرر
# activities.js = محتوى أنشطة المدرب الجاهز · study.js = بطاقات المراجعة/رتّب/وصّل · errors.js = «اكتشف الخطأ»
# challenge.js = «اكتشف العطل» و«تحدي المحاكاة» (أعطال المختبر وقراءاته ومدخلاته)
ACT_FILES=['activities.js','study.js','errors.js','challenge.js']
def course(slug,title,lessons,extra_head='',acts=False):
    # acts: لم يعد لازماً (يبقى للتوافق)؛ كل ملف من ACT_FILES يُضاف إذا كان موجوداً في courses/<slug>/
    extra=[f for f in ACT_FILES if os.path.exists(os.path.join('courses',slug,f)) or (acts and f=='activities.js')]
    scripts=''.join(f'<script src="lessons/{l}.js"></script>\n' for l in lessons)+''.join(f'<script src="{f}"></script>\n' for f in extra)
    return f'''<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title>
<meta name="theme-color" content="#123A2B">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="مكتبة الكهرباء">
<link rel="manifest" href="../../manifest.webmanifest">
<link rel="icon" href="../../shared/icons/icon-192.png">
<link rel="apple-touch-icon" href="../../shared/icons/apple-touch-icon.png">
<link rel="stylesheet" href="../../shared/fonts.css">
<link rel="stylesheet" href="../../shared/katex/katex.min.css">
<link rel="stylesheet" href="../../shared/book.css">
{extra_head}</head>
<body>
<div class="topbar"><div class="in"><a class="brand" href="../../"><span>المكتبة الرقمية للتقنية الكهربائية</span></a>
<div class="top-actions"><a class="tag" href="#home" id="courseTag"></a><button class="iconbtn" id="themeBtn" aria-label="تبديل الوضع الليلي" title="الوضع الليلي"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" fill="currentColor"/></svg></button></div></div></div>
<main id="view"></main>
<script src="../../shared/katex/katex.min.js"></script>
<script src="../../shared/katex/contrib/auto-render.min.js"></script>
<script src="../../shared/engine.js"></script>
<script src="../../shared/quiz-config.js"></script>
<script src="../../shared/activities-config.js"></script>
<script src="../../shared/app.js"></script>
<script src="course.js"></script>
{scripts}<script src="../../shared/shell.js"></script>
</body>
</html>
'''
open('courses/plc/index.html','w').write(course('plc','تقنية التحكم المبرمج',['u1','u2','u3','u4','u5','u6','u7','u8','u9','u10']))
open('courses/small-machines/index.html','w').write(course('small-machines','الآلات الكهربائية الصغيرة',['u1','u2','u3','u4','u5']))

open('courses/dc-machines/index.html','w').write(course('dc-machines','آلات التيار المستمر والمحولات',['u1','u2','u3'],acts=True))
open('courses/circuits-1/index.html','w').write(course('circuits-1','دوائر كهربائية-1',['u1','u2','u3','u3b','u4','u5','u6']))
open('courses/circuits-2/index.html','w').write(course('circuits-2','دوائر كهربائية-2',['u1','u1b','u2']))
open('courses/electric-drive/index.html','w').write(course('electric-drive','التحريك الكهربائي',['u1','u2','u3','u4','u5','u6','u7']))
open('courses/control-lab/index.html','w').write(course('control-lab','تقنية التحكم الآلي',['u1','u2','u3']))
