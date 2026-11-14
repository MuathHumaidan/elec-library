# Authoring the PRACTICAL course «آلات التيار المستمر والمحولات (عملي)» (course id `dc-machines`)

Read first, in this order:
1. `/home/claude/book/API.md` — lesson object, theory blocks, quiz, lab runtime, colours, rules.
2. `/home/claude/lib/API_THEORY.md` — tabs, KaTeX math, examples calculators, wording rules (it was written for the
   theory courses; everything there applies here too, except where this file says otherwise).
3. `/home/claude/lib/TP_GUIDE.md` — the «قيم توضيحية / قيم المدرب» switch (B.params). Apply round 1 + round 2 +
   "For new courses" rules FROM THE START in every lab: this book gives NO rated values, so every machine parameter
   in your simulations is illustrative and must be a trainer field.

## Where things are
- Course folder: `/home/claude/lib/courses/dc-machines/` — `index.html` and `course.js` exist (do not edit).
  You write only your unit file `lessons/uN.js`.
- Source content (your ONLY source of book content): `/home/claude/c3/ex/dc_u1_u2.md` (intro + units 1–2) and
  `/home/claude/c3/ex/dc_u3.md` (unit 3). Printed page = PDF page − 1; cite PRINTED pages (ص N).
- Reference implementations (read them before writing):
  * `/home/claude/lib/courses/ac-machines/lessons/u1.js`, lesson `u1-l5` — a virtual TEST BENCH: choose a test, raise
    a voltage slider, live meters, «سجّل القراءات» into a table, results computed step by step, book/corrected toggle.
    This is the closest model for every experiment here.
  * same file lesson `u1-l3` and `/home/claude/lib/courses/ac-machines/lessons/u2.js` — B.params usage, stepsUI with
    live (getter) step text and `redraw()`.
  * plotting helpers (plotSVG etc.) are LOCAL to each lesson file in the other courses — copy what you need into
    your own file (do not import across files).

## Lesson = one experiment
Tabs: `الشرح` · `المختبر` · `الأمثلة المحلولة` (only when there is a calculation worth a calculator) · `اختبر نفسك`.
- **الشرح**: objectives («الأهداف:» — never «الأهداف كما في الكتاب»), short theory the trainee needs (the book has
  almost none; anything you add is labelled «توضيح للمتدرب — ليس من الكتاب»), equipment list exactly as printed,
  the circuit diagram REDRAWN as clean SVG from the extraction (fig number + page), the procedure steps verbatim,
  the empty table as printed, the required curves, the book's questions with «إجابة مقترحة (ليست من الكتاب)».
  Book errors: typos/wrong figure numbers are corrected in the text and listed in a «ملاحظات على الكتاب» block;
  wrong formulas get the toggle «كما في الكتاب / المصحح» (see the AC course for the pattern).
- **المختبر** (the heart): a virtual bench for THAT experiment —
  * the circuit drawing with live meter readings (V, A, W, rpm, N·m as relevant) and the controls the book's procedure
    uses (DC supply / field rheostat / armature rheostat / load resistance % / brake torque / variac / switches,
    and for exp 4 the D1–D2 reversal, exp 11 the parallel switch, exp 12 star/delta);
  * «سجّل القراءة» fills the book's table row at the book's set-points (the printed set-point values: If, n, RL %,
    Vin, T …); the trainee can also add free rows;
  * the required curve(s) plotted live from the recorded rows, axes as the book labels them;
  * a «جرّب» task list that follows the book procedure step by step (live text from TP.v where numbers depend on
    illustrative values);
  * safety behaviour where the book warns or physics demands it (e.g. series motor with no load runs away — block
    starting at T = 0 with an explanatory red message; short-circuit test current above rated → warning);
  * a B.params panel with every illustrative machine parameter (armature resistance, field resistance, magnetisation
    curve parameters / residual voltage, rated values used for warnings, transformer equivalent-circuit values,
    acceleration time where a motor speeds up on screen, etc.), defaults chosen so the readings look like a typical
    small lab machine (0–250 V DC supply, ≤ 6 A as in the book's diagrams), all labelled «أرقام توضيحية».
- **اختبر نفسك**: 6–8 MCQs from the experiment.

## Trainer decisions for THIS course (already approved)
1. Lessons: unit 1 = `u1-l1` تمهيد (lab safety, report writing, how to draw a curve — printed pp. 3–9 incl. the unit
   cover/objectives) + `u1-l2`…`u1-l5` = experiments 1–4. Unit 2 = `u2-l1`…`u2-l3` = experiments 5–7 (fold the unit
   cover/objectives into u2-l1). Unit 3 = `u3-l1`…`u3-l5` = experiments 8–12 (fold the unit intro into u3-l1).
2. Experiment 2 speed: step 2 says 1500 rpm, the table header says 1400 rpm. PENDING trainer answer — implement with a
   single constant at the top of u1.js `const EXP2_N = 1500;` used everywhere, and mention the discrepancy in
   «ملاحظات على الكتاب».
3. Experiment 7 (series motor): starting with T = 0 is blocked with a red message explaining runaway; the table
   starts from the smallest load; note the book's contradiction in «ملاحظات على الكتاب».
4. Experiment 5: loading by the brake as in the diagram (not a coupled generator); note it.
5. Typos/figure numbers → fixed + noted; formula errors → book/corrected toggle.
6. Missing content is ADDED with the tag «إضافة من خارج الكتاب»: the voltage-regulation formula (exps 2–4), a simple
   readings table for exp 11; exp 12's efficiency/VR rows stay with a note explaining a no-load test can't give them.

## Rules
- Arabic, plain words for beginners. Never write «كما في الكتاب» when presenting content (only as the toggle name).
- Only edit your own unit file. Don't touch shared/, other courses, course.js, index.html, sw.js.
- Test: `cd /home/claude/book && COURSE=dc-machines node test2.js <ids>` must print ok for each lesson; then
  `node tpshot.js dc-machines <id> shots/dc-<id>.jpg 1280` must print `errors: none`. LOOK at screenshots of every lab
  (Read tool) — circuits must be readable, Latin labels not reversed (use the ltr classes like the other courses),
  nothing overflowing at 390 px (tpshot can't click the hidden tab at 390 — use the bottom nav in your own script).
- Report (short, English): lessons built, what each lab does, every judgement call (illustrative defaults chosen,
  added content, corrections) — these go to the trainer for approval.
