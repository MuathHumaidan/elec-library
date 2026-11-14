# Per-course review report (for the course's trainers) — guide

Goal: one Markdown file per course, /home/claude/st/reports/<course>.md, in plain clear Arabic, that lets the
course's trainers (not developers) review every note and decision we made in the interactive book of that
course. It will be pasted into a shared doc section. No code, no file paths, no ids except lesson ids like u2-l3
(write them as «الدرس 2.3» = unit 2 lesson 3 — use the lesson's displayed number/title from course.js/lessons).

Sources (read them; do not invent):
- /home/claude/lib/courses/<course>/lessons/*.js — formal content: `{err:…}` blocks («ملاحظة على الكتاب»), elements
  with class `fixnote`, «كما في الكتاب / المصحح» switches (mode 'book'/'fixed', bkCtl, modeNote…), «إضافة من خارج
  الكتاب», «إجابة مقترحة (ليست من الكتاب)», «توضيح», B.params defs («قيم المدرب»: label, value, range), stations
  `watch` blocks with fix:true.
- /home/claude/lib/courses/<course>/activities.js, study.js, errors.js, challenge.js — activity content (counts) and
  fault lists (title + one-line symptom).
- The extra notes given in your task prompt (decisions the trainer took in conversation, and review points the
  content writers flagged) — include them.

File structure (exact headings, `###` level since the doc section heading `##` is added by the main session):

### نظرة سريعة
One or two sentences: number of units/lessons, number of book errors corrected, number of activity items.

### أخطاء الكتاب وما اعتمدناه
A pipe table, one row per correction, in lesson order:
| الدرس | الصفحة | في الكتاب | ما اعتمدناه | طريقة العرض |
«طريقة العرض» = «زر كما في الكتاب/المصحح» or «ملاحظة» or «تصحيح مطبعي صامت» (only list silent typo fixes if
the lesson files mention them; otherwise skip). Keep cells short (≤ 20 words). Merge duplicates (same error shown
in formal + stations = one row).

### إضافات من خارج الكتاب وافتراضات
Bullets grouped by lesson: laws/explanations added, suggested answers to book exercises (just say which
exercises have suggested answers, not the answers), assumptions made where the book is missing data (e.g.
assumed values, assumed sequence), and the «قيم المدرب» illustrative values per lab (one line per lab: quantity =
value unit, allowed range).

### قرارات اتخذها المدرب
Bullets — from the task prompt notes (+ anything a lesson file explicitly marks as the trainer's choice).

### محتوى الأنشطة
Small table: | النشاط | العدد | for: أسئلة مفتوحة, أسئلة تذكرة الخروج, بطاقات مراجعة, تمارين «رتّب», تمارين
«وصّل», مسائل «اكتشف الخطأ», أعطال «اكتشف العطل», دروس «تحدي المحاكاة». Count from the files.

### أعطال المحاكي في «اكتشف العطل»
Pipe table | الدرس | العطل | العرض الذي يراه المتدرب | — one row per fault, symptom ≤ 15 words, from challenge.js.
(If the course has many faults, keep each row short.)

### نقاط تحتاج مراجعة المختص
A checklist `- [ ] الدرس …: …` — every point the task prompt lists + anything you find doubtful while reading
(book contradictions, values read off a graph, assumptions). Each ≤ 25 words. This is the most important section.

Rules: Arabic only (symbols/units Latin as in the book, e.g. I<sub>a</sub> → write Ia, keep KaTeX out: write
formulas as plain text like «E = KΦn»). No HTML tags. Markdown pipe tables must not contain «|» inside cells.
Validate the file renders (no broken tables). Report back only: path and the counts per section.
