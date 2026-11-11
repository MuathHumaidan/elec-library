# Authoring the THEORY courses «دوائر كهربائية-1» (id `circuits-1`) and «دوائر كهربائية-2» (id `circuits-2`)

Read first, in this order:
1. `/home/claude/book/API.md` — lesson object, theory blocks, quiz, lab runtime, colours, rules.
2. `/home/claude/lib/API_THEORY.md` — tabs (الشرح · المختبر · الأمثلة المحلولة · اختبر نفسك), KaTeX, worked-example
   calculators (given / solve(g,B,isBook) / dp / B.round / book-vs-corrected), wording rules.
   (Paths in it mention small-machines — the same rules apply to your course.)
3. `/home/claude/lib/TP_GUIDE.md` — «قيم توضيحية / قيم المدرب» (B.params). Apply round 1 + round 2 + "For new
   courses" from the start, for any lab number that is NOT from the book. Book data (example values) are not trainer
   fields — they are usually sliders/inputs the trainee moves anyway.
4. Reference lesson files for depth and style (read at least one full lesson + its examples):
   `/home/claude/lib/courses/ac-machines/lessons/u1.js` (u1-l3, u1-l5 with book/corrected toggle) and
   `/home/claude/lib/courses/ac-machines/lessons/u2.js`. Helpers (plotSVG, stepsUI, segHTML, sl, fact …) are LOCAL to
   each file — copy what you need into your own file.

## Your source
Only the extraction files in `/home/claude/c4/ex/` (printed page numbers, «ص N»). Each ends with «اقتراح الدروس» —
use that split exactly as the mapping below says.

## Lesson ids / files
circuits-1 (`/home/claude/lib/courses/circuits-1/lessons/`):
- `u1.js`: u1-l1..u1-l4 = c1_a.md lessons 1–4 (fold the book's مقدمة/تمهيد/unit cover & objectives into u1-l1)
- `u2.js`: u2-l1..u2-l4 = c1_a.md lessons 5–8 (unit 2 cover/objectives into u2-l1)
- `u3.js`: u3-l1..u3-l6 = c1_b.md lessons 1–6
- `u3b.js`: u3-l7..u3-l12 = c1_c.md lessons 1–6 (u3-l12 = unit 3 exercises)
- `u4.js`: u4-l1..u4-l4 = c1_c.md lessons 7–10 (u4-l4 = unit 4 exercises)
- `u5.js`: u5-l1..u5-l5 = c1_d.md lessons 1–5 ; `u6.js`: u6-l1..u6-l4 = c1_d.md lessons 6–9
circuits-2 (`/home/claude/lib/courses/circuits-2/lessons/`):
- `u1.js`: u1-l1..u1-l7 = c2_a.md lessons 1–7 (fold مقدمة/تمهيد/unit cover into u1-l1)
- `u1b.js`: u1-l8..u1-l14 = c2_a.md lessons 8–11 then c2_b.md lessons 1–3
- `u2.js`: u2-l1..u2-l4 = c2_b.md lessons 4–7
When a file holds lessons of a unit that another file also holds (u3/u3b, u1/u1b) — only push your own lessons with
`B.lesson(...)`; do NOT call B.unit (course.js already did).

## Content rules (trainer decisions — already approved)
- Every worked example of the book appears in «الأمثلة المحلولة» as a calculator (given values editable, steps with
  the book's rounding). Where the book has an arithmetic/formula error: the toggle «كما في الكتاب / المصحح»
  reproducing the printed numbers in book mode and the right numbers in corrected mode, plus a «ملاحظات على الكتاب»
  block. Pure typos / wrong figure or equation numbers: corrected silently in the text and listed in the notes block.
- Exercises (تمارين) have no printed answers: give «إجابة مقترحة (ليست من الكتاب)» (calculators where numeric).
  Exercise lessons (u3-l12, u4-l4, and the chapter problems placed in other lessons) present every exercise with its
  figure redrawn.
- Things the book uses but never explains get a short block tagged «إضافة من خارج الكتاب»: power-factor correction
  and the power factor from two-wattmeter readings (circuits-2); the coupling coefficient K and leakage factor λ
  (circuits-1). Anything else you add for understanding: «توضيح للمتدرب — ليس من الكتاب».
- Never write «كما في الكتاب» when presenting content (only as the toggle name). «الأهداف:» not «الأهداف كما في الكتاب».
- Every figure redrawn as clean SVG (fig number + page). Latin labels must not be reversed in RTL (use the ltr
  classes as the reference files do).
- **المختبر** — a real interactive simulation per lesson that lets the trainee DO the topic: build/adjust the circuit
  (sliders, switches, drag values), see live meters / waveforms / phasors / field lines / curves, a «جرّب» task list
  (3–6 steps) whose checks follow live values, using the book's example numbers as presets where possible.
  Exercise lessons: the lab can be a "check your answer" circuit solver for the exercises.
- 6–8 quiz questions per lesson.

## Rules
- Only edit your own lesson file(s). Don't touch shared/, course.js, index.html, other courses, sw.js.
- Test: `cd /home/claude/book && COURSE=<course-id> node test2.js <ids>` → ok for each; `node tpshot.js <course-id>
  <id> shots/<course-id>-<id>.jpg 1280` → `errors: none` (other agents write other files in parallel; if a page fails
  because ANOTHER file is unfinished, test with your own script that blanks the others, and say so). LOOK at
  screenshots of every lab and of several theory pages. At 390 px tpshot can't click the hidden tab — use the bottom
  nav in your own script; nothing may overflow horizontally.
- Report (short, English): lessons built, what each lab does, book errors handled (toggle vs note), every judgement
  call (illustrative numbers, additions) — they go to the trainer for approval.
