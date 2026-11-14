# «طرق التدريب» — trainer-only lesson mode built on the TVTC guide «طرائق ووسائل التدريب» (1444)

Source guide (read it): /home/claude/st/methods_src.txt (text) and /home/claude/st/methods.pdf (28 pages). Chapter 3 has
11 methods, each with an official definition, a card (theory/practical, new/deep concepts, trainee cases, learning theory)
and official «خطوات التطبيق». Chapter 1 = selection criteria; ch. 2 = planning stages (تحليل – تصميم – إعداد – تنفيذ –
تقييم); ch. 3-ج = 14 «إضاءات» questions in 4 stages; ch. 4 = training aids (planning/executing/evaluating a demo).

## Coordinator decisions (14 Nov 2026)
- The library's current lesson view stays the DEFAULT for everyone. «طرق التدريب» is an extra layer, visible ONLY when a
  trainer is signed in with his quiz-server account (same accounts as the live quiz; any account the admin creates later
  works automatically). Trainees never see it.
- Phase 1 = 7 methods: (1) التقليد والتطبيق العملي, (3) K.W.L, (4) الاكتشاف (موجّه / شبه موجّه / حر), (7) حل المشكلات,
  (8) المقلوب/المعكوس, (9) المحاكاة, (11) المتمايز. The other 4 (المشروع، البنائي، تريز، دراسة الحالة) are listed as
  «قريباً» (disabled). Add whatever is needed so each of the 7 shows at its best (new live activities included).
- When a trainer picks a method, the lesson re-arranges into that method's phases (same lesson content and tools, ordered
  and labelled as the method's official steps). A button at the top opens «خطة الدرس المقترحة» for that method
  (printable). One method is marked «موصى به» with a one-line reason.
- Pilot course: dc-machines (آلات التيار المستمر والمحولات). Build generically, enable only for courses listed in a config
  array (start: ['dc-machines']). Backup branch backup-2026-11-14 exists in both repos.

## Server API contract (elec-quiz) — both sides build against this
1. `POST /api/login` (existing) also returns `{token}` in JSON. New `Authorization: Bearer <token>` accepted everywhere a
   session cookie is (userFromReq). `GET /api/me` with bearer → `{user:{id,username,name,is_admin}}` or `{user:null}`.
   `POST /api/logout` with bearer ends that session.
2. CORS for the library origin(s): https://muathhumaidan.github.io (and http://localhost:* / null for local tests):
   allow `Authorization, Content-Type`, methods GET/POST/OPTIONS, no cookies needed.
3. Host deep links (existing): `/host?course=<c>&lesson=<l>&type=<quiz|cloud|exit|errs|fault|sim>`; add new types below.
4. New activity `kwl` (live, like cloud): phase K (each trainee writes up to N short answers «ماذا أعرف»), phase W
   («ماذا أريد أن أتعلم»), trainer pauses to teach, phase L at the end («ماذا تعلمت»). Trainer screen shows the 3-column
   K/W/L board (grouped/merged similar answers like the cloud), can hide names, export Excel. Same PIN/join flow.
   Default prompts per lesson: K/W/L wording from the guide + lesson title; trainer can edit before starting.
5. New `hw` (flipped / واجب قبل المحاضرة): trainer creates from a lesson: picks questions (lesson quiz bank + his own),
   sets an open-until date/time; gets a share link `/hw/<code>` (and a QR) to post in BlackBoard/WhatsApp. Trainee opens
   any time before the deadline, enters name + optional training ID, reads a link to the lesson (library URL with
   #lesson), answers, sees his score and the explanations. Trainer results page: per trainee and per question (% correct,
   most-chosen wrong answer) + Excel — used to steer the in-class discussion. Persist in SQLite (additive migrations).
6. New `pre` (اختبار قبلي للتدريب المتمايز): a short quiz (default 5 lesson questions, self-paced or live), results group
   trainees into 3 levels by score: أساسي / متوسط / متقدم using thresholds stored in ONE server config constant
   (proposed default: < 50 % أساسي, 50–79 % متوسط, ≥ 80 % متقدم — pending coordinator approval, keep easy to change),
   shown on the trainer's results with the list of names per level and a copyable/printable grouping.
7. Tests: extend `npm test` (new e2e7.js) for bearer auth + CORS preflight, kwl full flow, hw create/answer/deadline/
   results, pre grouping. Migrations additive only. Push to main only when all tests pass.

## Library (static site) — /home/claude/lib/shared/methods.js (+ book.css rules, shell/app hooks)
- Server base URL from shared/quiz-config.js (existing).
- «دخول المدرب»: a small button in the top bar (shell.js) — opens a dialog (username, password) → POST /api/login → store
  token in localStorage 'elib-trainer' ({token,name}); validate with /api/me on page load (silently drop if invalid);
  «خروج». When signed in, a badge «المدرب: <name>».
- In a lesson (only if signed in AND course in the pilot list): a «طرق التدريب» bar under the lesson header: chooser of
  the 11 methods (7 active, 4 «قريباً»), the «موصى به» badge + reason, and «الدرس كالمعتاد» to leave method mode. Choice
  remembered per lesson in localStorage.
- Method mode: the normal tab bar is replaced by PHASE tabs following the method's official steps. Each phase = a header
  card (the guide's step text, what the trainer does, what trainees do, «دور المتدرب») + the existing lesson content that
  serves it, rendered with the existing tab renderers (theory/«التفاعلي» stations, lab, examples, quiz, activities,
  study cards, order/match) and/or a launch button for a live activity on the server (opens host deep link in a new tab).
  Phases may reuse the same tab content with a different focus note. Leaving method mode restores the normal view exactly.
- Phase templates (data in methods.js, one object per method; steps quoted from the guide):
  1 التقليد والتطبيق العملي: تهيئة (سؤال مفتوح/سحابة) → مراجعة المهارات السابقة (بطاقات الوحدة، أو أسئلة الدرس السابق) →
    شرح المعارف (الشرح) → عرض التطبيق (المختبر: المدرب يعرض خطوات «جرّب» على الشاشة) → مناقشة (أسئلة «اختبر نفسك»
    للنقاش) → تطبيق المتدربين (المختبر/رتّب/وصّل) → قياس الأداء (تذكرة خروج أو مسابقة).
  3 K.W.L: K (نشاط kwl مرحلة K) → W → الشرح والمختبر → L + مراجعة (تذكرة خروج/بطاقات).
  4 الاكتشاف: trainer picks the level: موجّه (التفاعلي: توقّع أولاً + المختبرات المصغّرة، ثم «جرّب» مرحلة مرحلة) /
    شبه موجّه (مشكلة: «تحدي المحاكاة» أو مهمة في المختبر مع تلميحات) / حر (مهمة مفتوحة في المختبر بلا خطوات) → قياس.
  7 حل المشكلات: تعريف المشكلة (عطل من «اكتشف العطل» أو «اكتشف الخطأ») → تحليلها → ابتكار الحلول → اختيار الحل وتنفيذه
    في المختبر → تقييم الحلول (شرح العطل/الخطأ والحلول البديلة).
  8 المقلوب: قبل المحاضرة (رابط الدرس + واجب hw) → في القاعة: مناقشة نتائج الواجب (صفحة النتائج) → تطبيق (المختبر/
    الأمثلة) → تقييم.
  9 المحاكاة: الأهداف وعناصر السلامة → تهيئة بيئة المحاكاة (المختبر وقيم المدرب) → تنفيذ (جرّب/تحدي المحاكاة/اكتشف
    العطل) → تقييم قبلي وبعدي (pre ثم مسابقة).
  11 المتمايز: تقويم قبلي (pre → 3 مستويات) → مهام متنوعة لكل مستوى (أساسي: بطاقات/رتّب/وصّل/الشرح التفاعلي؛ متوسط:
    المختبر «جرّب» والأمثلة؛ متقدم: تحدي المحاكاة/اكتشف العطل/اكتشف الخطأ) → تقويم تكويني وختامي.
  Where a lesson lacks a tool a phase needs (e.g. no faults), the phase shows the best available substitute and says so.
- «خطة الدرس المقترحة»: printable page (window print / PDF) generated from the method template + lesson data: course,
  unit, lesson title, pages, objectives (from the lesson), planning stages of ch. 2 filled for this lesson, the method's
  steps with the concrete library tool for each, trainee role, assessment, and the 14 «إضاءات» questions with suggested
  answers drawn from the lesson. A blank «الزمن» column for the trainer to fill (no minute values from us). TVTC header.
- «موصى به»: rules in ONE config table in methods.js (pending coordinator approval, keep easy to change), proposed:
  lesson with a lab and practical skill → التقليد والتطبيق؛ lesson with faults in challenge.js → حل المشكلات؛ theory lesson
  introducing new concepts with stations mini-labs → الاكتشاف (موجّه)؛ lesson with a sim challenge → المحاكاة؛
  otherwise → K.W.L. Show the reason sentence.
- Must not change anything for non-signed-in users; no layout shift when signed out. RTL, dark mode, 390 px, 125 % font.
- Tests: all existing `test2.js` pass for all 10 courses; new playwright test: signed-out (no bar), signed-in with a mock
  /api/me (bar shows, 7 active methods, each method renders its phases with no page errors, plan opens and prints),
  sign-out restores. Don't edit lesson files.

## ربط الطرفين (تم)
- أزرار الأنشطة الحية في المكتبة تطلب رمزاً لمرة واحدة من POST /api/handoff (Bearer) ثم تفتح /auth/handoff?code=…&next=/host?… فيدخل المدرب تبويب الخادم دون كتابة كلمة المرور مرة ثانية. إن فشل الطلب يُفتح الرابط العادي.
- رابط «نتائج الواجب» = <الخادم>/results (موجود).
- اختبار التكامل الحقيقي: /home/claude/book/realint.js (يشغّل الخادم محلياً ويخدم المكتبة على localhost).
- القيم القابلة للتعديل: PRE_LEVELS في quiz/src/pre.js، و RECOMMEND_RULES و METHODS_COURSES أعلى lib/shared/methods.js.

## تعديل 2026-11-14 (قرار المنسق بعد مراجعة مكتبة الدراسات العامة)
- أُلغيت إعادة ترتيب الدرس. البديل «مسار الطريقة»: شريط رفيع أعلى الدرس، و«التالي»/«اذهب» ينقل لجزء الدرس الذي يخدم الخطوة ويميّزه. الدرس لا يتغير.
- المحرك عام في shared/methods.js، وبيانات كل مقرر في courses/<c>/methods-data.js. لا ملف = لا بطاقة.
- التوصية بثلاث درجات (موصى بها / مناسبة أيضاً / لا تناسب) مع السبب، في ملف البيانات لا في الكود.
- الخطة المطبوعة: خطوات الدليل، الزمن والملاحظات فارغان، والأسئلة الـ14 قائمة تحقق لا يُعبّأ منها إلا 3 و6 و7 و9.
- المرحلة الأولى: التقليد، K.W.L، الاكتشاف، حل المشكلات، المحاكاة. المقلوب والمتمايز مرحلة ثانية. الباقي «قريباً».
- بطاقة «جدول K.W.L» أضيفت لـ«الأنشطة التفاعلية» في المقررات التي لها ملف بيانات.
- التفاصيل والشكل: lib/API_METHODS.md. نسخة إعادة الترتيب القديمة محفوظة في /home/claude/backups/methods-reorder-version.js.
- الخطة التفصيلية للتخصص (تقنية الآلات الكهربائية، 123 صفحة): النص في /home/claude/plan/plan.txt. كهرب 131 في الفصل الثاني، ومتطلبه دوائر 1، وقبله في الفصل الأول السلامة الصناعية (102) وورشة أساسيات الكهرباء (111).
- 2026-11-15: مبدأ التوصية = هدف الدرس الأساسي (انظر API_METHODS.md)، وقاعدة دائمة «يراجع ويبني على مقرر سابق ← K.W.L». نتيجة آلات التيار المستمر: التقليد 5، المحاكاة 5، الاكتشاف 3، K.W.L 1 (1.1)، والدرس 1.2 تقليد + اكتشاف. 3.4 تقليد.
- 2026-11-15: محطة «السلامة في هذه التجربة» في دروس المحولات الخمسة (إضافة من خارج الكتاب، بلا نسبة لكود البناء السعودي). رُفع v56 (commit 2e33272).
