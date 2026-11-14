# Authoring two new courses: «التحريك الكهربائي» (`electric-drive`, theory) and «تقنية التحكم الآلي — عملي» (`control-lab`, practical)

Read first:
1. `/home/claude/book/API.md` and `/home/claude/lib/API_THEORY.md` (lesson object, tabs, KaTeX, worked-example
   calculators with book/corrected toggle, wording rules).
2. `/home/claude/lib/TP_GUIDE.md` (B.params «قيم توضيحية / قيم المدرب» — rounds 1+2 + "For new courses", from the start).
3. Theory course: follow `/home/claude/lib/API_CIRC.md` "Content rules" exactly (it was for the circuits courses — same
   rules). Practical course: follow `/home/claude/lib/API_LAB.md` "Lesson = one experiment" (it was for the DC-machines
   lab manual — same approach: virtual bench, record readings into the book's tables, live curves, «جرّب» steps).
4. Reference lesson files (read one full lesson + its examples/lab): `/home/claude/lib/courses/ac-machines/lessons/u1.js`
   (u1-l3, u1-l5), `/home/claude/lib/courses/dc-machines/lessons/u3.js` (lab-manual style). Helpers are LOCAL to each
   file — copy what you need.
Only the FORMAL theory tab now (do not write `stations:` — that comes later in a separate pass).

## Sources (only these; printed page numbers «ص N»)
- electric-drive: `/home/claude/c5/ex/drv_a.md` (units 1–2), `drv_b.md` (units 3–4), `drv_c.md` (units 5–7). Printed
  page = PDF page. Each file ends with «اقتراح الدروس».
- control-lab: `/home/claude/c5/ex/ctrl.md` (whole book; printed = PDF − 1), ends with «اقتراح الدروس».

## Lesson ids / files
electric-drive (`/home/claude/lib/courses/electric-drive/lessons/`):
- `u1.js`: u1-l1, u1-l2 = drv_a lessons 1–2 (fold مقدمة/تمهيد/unit cover & objectives into u1-l1)
- `u2.js`: u2-l1..u2-l3 = drv_a lessons 3–5 ; `u3.js`: u3-l1..u3-l3 = drv_b lessons 1–3 ; `u4.js`: u4-l1, u4-l2 = drv_b 4–5
- `u5.js`: u5-l1..u5-l4 = drv_c 1–4 ; `u6.js`: u6-l1..u6-l3 = drv_c 5–7 ; `u7.js`: u7-l1 = drv_c 8
control-lab (`/home/claude/lib/courses/control-lab/lessons/`):
- `u1.js`: u1-l1 = ctrl lesson 1 ; `u2.js`: u2-l1..u2-l3 = ctrl lessons 2–4 ; `u3.js`: u3-l1..u3-l6 = ctrl lessons 5–10
Each file holds whole units, so call `B.unit` only if the reference files do — they don't: course.js registers units.

## Course-specific notes
electric-drive:
- Every worked example → calculator. Book errors with wrong numbers (notably Example 2-7: 60 rpm → 19.1 rpm, 434 Nm →
  1362.5 Nm, F 2943 → 29430 N, 0.95 vs 0.85; Example 5-2 145833; Examples 6-1, 6-3, 6-4) → «كما في الكتاب / المصحح».
- Exercises have no printed answers → «إجابة مقترحة (ليست من الكتاب)».
- Labs: load-curve vs motor-curve operating point, linear/rotary motion with gearbox, train traction forces on a
  gradient with wind/friction, braking methods (regenerative / dynamic / plugging) on a DC motor speed–torque plane,
  duty cycles and motor heating… Use book numbers; anything invented → B.params trainer fields.
control-lab:
- The book is a pure lab manual with NO theory: add short, clearly-tagged «توضيح للمتدرب — ليس من الكتاب» theory
  (gain, time constant, PT1/PT2, rise/settling time, overshoot, steady-state error, Tu/Tg, P/I/PI/PID effect, sampling).
- Lab = a virtual Com3Lab bench per experiment: the book's block/connection figure redrawn, a step source (book values:
  amplitude, period), the plant (thermal, DC-motor PT1, light, or the book's G(s)=21.81/(0.0063s²+0.379s+1)), the
  controller with the book's parameter sets (Kp, KI, Ti, Kd …), a two-channel virtual oscilloscope (Y1/Y2 as the book
  connects them), disturbance switch where the book has it, and «سجّل» filling the book's results tables.
  Plant parameters not given by the book are trainer fields (B.params) labelled «توضيحية».
- u1-l1 (MATLAB): an in-page mini MATLAB console that supports exactly the book's commands (row-vector polynomials,
  roots, tf/Tf, step, rlocus, clf, clc) with plots, plus the Simulink block diagram redrawn and simulated. Note the book
  writes `Tf` (correct: `tf`) — accept both and explain.
- Book errors (inverted gain formula in the motor/light tables, figure numbering, duplicated «زمن الصعود» column, copied
  text in the digital light experiment, Y1/Y2 mismatch) → toggle where it changes numbers, else notes.

## Rules
- Arabic plain words; never «كما في الكتاب» when presenting content; Latin/units in ltr spans; SVG Arabic+digits in
  separate tspans.
- Only edit your own lesson files. Test: `cd /home/claude/book && COURSE=<id> node test2.js <ids>` → ok; `node tpshot.js
  <id> <lesson> shots/<id>-<lesson>.jpg 1280` → errors none; LOOK at screenshots; no horizontal overflow at 390 (own script).
- Report (short, English): lessons built, labs, book errors handled, ONLY important doubts.
