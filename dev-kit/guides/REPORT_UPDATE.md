# Course report update (10 Nov 2026) — guide

Each course report /home/claude/st/reports/<course>.md (format: /home/claude/st/REPORT_GUIDE.md — read it) becomes a
STANDALONE report the coordinator sends directly to that course's trainer. Trainer requirement: the report must contain
EVERY decision the coordinator was asked about, and EVERY addition or modification we made that does not match the book.

Do for your course:
1. Read the current report fully, /home/claude/st/reports/notes/_general.txt and /home/claude/st/reports/notes/<course>.txt.
2. «قرارات اتخذها المدرب»: add the general decisions (Arabic, plain, short bullets) and the course decisions from the notes.
   Remove from «نقاط تحتاج مراجعة المختص» any item the notes say the trainer has now decided (record it as a decision).
3. Add a new section right after «إضافات من خارج الكتاب وافتراضات»:
   ### الأسلوب التفاعلي: المختبرات المصغّرة
   - one or two sentences: what the «التفاعلي» style is (a short hands-on mini-lab in most stations: sliders with
     «توقّع أولاً», ordering, classify, true/false, PLC program runs…) and how many were added in this course.
   - bullets grouped by lesson (write «الدرس 3.2» not u3-l2; «المحطة 4» for st4): every number not from the book, every
     teaching construct/assumption/what-if case outside the book, every corrected value used — from the notes, and
     verified against the lesson files (/home/claude/lib/courses/<course>/lessons/*.js: search the mini-lab blocks
     marked by «مختبر مصغّر», «أرقام تختارها أنت», «قيم توضيحية», «ليست من الكتاب», «من خارج الكتاب»). Add any you find
     that the notes miss. Keep each bullet ≤ 30 words.
4. «نقاط تحتاج مراجعة المختص»: add `- [ ]` items for the mini-lab points that need a specialist's confirmation
   (the notes mark them: confirm / approve / contradiction / assumption / may prefer to drop).
5. Completeness pass: skim the lesson files for any «إضافة من خارج الكتاب», «ملاحظة على الكتاب», fixnote, «كما في الكتاب
   / المصحح» switch, «إجابة مقترحة» or assumption that the report does not mention, and add it to the right section.
6. Update «نظرة سريعة» counts (add the mini-lab count). Title line is not needed (the doc adds it).
Rules: Arabic only, plain language, no code/paths/ids, no HTML, no «|» inside table cells, tables must render.
Edit only your course's report file. Report back briefly: sections changed and counts added.
