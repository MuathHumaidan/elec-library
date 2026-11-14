# Authoring two new courses: «الرسم الفني الكهربائي» (`drawing`, practical drawing course) and «السلامة الصناعية» (`safety`, theory)

Read first:
1. `/home/claude/book/API.md` and `/home/claude/lib/API_THEORY.md` (lesson object, tabs, KaTeX, worked examples — the
   examples tab now reveals steps one at a time automatically; wording rules).
2. `/home/claude/lib/TP_GUIDE.md` (B.params «قيم توضيحية / قيم المدرب» — use from the start for any number not in the book).
3. `/home/claude/lib/API_CIRC.md` "Content rules" (same rules apply) and `/home/claude/st/FIXNOTE_GUIDE.md` (book errors:
   «كما في الكتاب / المصحح» switch only where the error changes a result/what is done; plain correction note otherwise;
   «إخفاء الشرح»; the phrase «كما في الكتاب» is reserved for that switch and never prefixes book content).
4. Reference lesson files — read one full lesson + its lab/examples: `/home/claude/lib/courses/small-machines/lessons/u1.js`
   (theory course with labs), `/home/claude/lib/courses/control-lab/lessons/u3.js` (practical). Helpers are LOCAL to
   each file — copy what you need.
Only the FORMAL theory tab now (no `stations:` — separate pass later). Course files (course.js, unit list) already exist.

## Sources (only these; cite printed pages «ص N»)
- drawing: `/home/claude/newc/ex/drw_a.md` (units 1–2), `drw_b.md` (3–4), `drw_c.md` (5–7). Printed = PDF − 1.
  Plan: `/home/claude/newc/drawing_plan.md`. Each source ends with «ملاحظات على الكتاب» and «اقتراح الدروس» (use those
  lesson ids/titles/pages exactly).
- safety: `/home/claude/newc/ex/saf_a.md` (units 1–3), `saf_b.md` (4–6). Plan: `/home/claude/newc/safety_plan.md`.
- The PDFs (for looking at a figure yourself): `/home/claude/newc/drawing.pdf`, `/home/claude/newc/safety.pdf`
  (`pdftoppm -r 120 -f N -l N -png …`). Text layer is broken — use images.

## Coordinator decisions (approved)
drawing:
1. Same tabs as theory courses: الشرح · المختبر · الأمثلة المحلولة · اختبر نفسك. «الأمثلة المحلولة» here = drawn
   examples revealed step by step: an `examples` entry with no `given`, and `solve` returning steps whose `t` holds the
   text + an SVG of the drawing at that step (each step adds lines/wires; earlier ones stay). Use for the book's
   step-by-step constructions (ص 21–24 projection methods, ص 38–39 cylinder, grid plates) and for exercises.
2. Missing symbols in unit-2 tables: complete them from IEC 60617, marked «إضافة من خارج الكتاب» (cell styling or tag).
3. Simulations in units 5–7: logic only (lamp on/off, motor turns + direction, breaker trips) without numbers, EXCEPT
   motor starting (unit 6: resistor steps / speed rising, illustrative numbers as B.params) and time grading (u7-l2:
   the book's 180/120/60 ms).
4. Exercises: show the exercise (text + redrawn figure) and a «حل مقترح (ليس من الكتاب)» drawn step by step (examples).
5. ~42 lessons as in «اقتراح الدروس».
6. Wrong figure numbers/references: correct silently in the text + a short correction note (FIXNOTE plain note).
Book errors that change what the trainee draws/wires (e.g. the star–delta starter 6-9 shorting two windings; wrong
terminal markings) → «كما في الكتاب / المصحح» switch on the drawing. Open question still with the coordinator: unit 7
exercise 1 says «دلتا / دلتا (Δ/Y)» — build both readings behind a two-option chooser labelled «القراءة الأولى/الثانية»
and note it; do not pick one.
Home-wiring / panel figures: redraw faithfully as SVG (single-line «الدائرة الخطية» and wiring «الدائرة التنفيذية»),
interactive in the lab (press switches → current path highlighted, lamp lights). Arabic labels in SVG as separate
tspans from digits/Latin.

safety:
1. 24 lessons as in «اقتراح الدروس».
2. Outdated first aid / CPR (ص 95–99): «كما في الكتاب / المصحح» switch; corrected = current adult CPR guidance
   (call for help/AED, 30 compressions : 2 breaths, 100–120 compressions per minute, depth about 5–6 cm, minimise
   interruptions), labelled with its source «إرشادات الإنعاش القلبي الرئوي الحالية (جمعية القلب الأمريكية)».
3. Noise dose: the book's formula (ص 34) is inverted → switch (book: allowed/actual; corrected: D = Σ Cᵢ/Tᵢ, actual
   over allowed, > 1 means over the limit) + an added worked example labelled «إضافة من خارج الكتاب».
4. Worked examples only in lessons 2.2 (book example ص 16 = 81.25 ppm, and question ص 23 = 87.5), 3.2 (noise dose),
   3.6 (pipe lettering height table), 5.2 (body current I = V/R from book values), 5.3 (touch/step voltage from the
   book's figure) — built from book numbers, labelled where added. No examples tab elsewhere.
5. Missing extinguisher types (water, foam, K) — short added explanation labelled «إضافة من خارج الكتاب».
6. Descriptive lessons (1.1, 4.1, 5.1): the lab tab is an activity (sorting / find-the-hazard in a drawn scene) instead
   of a simulation.
Other safety notes from the sources: smoke detector — follow figure 6-8 (scattered light reaches the sensor), with a
correction note on the text; contradictory T/F answers (ص 110) → note; ص 90–92 high-voltage health claims → keep the
book text and add a short note that these claims are not established; first-aid step 4 copy error → covered by the
switch.

## Lesson ids / files
drawing (`/home/claude/lib/courses/drawing/lessons/`): `u1.js` u1-l1..u1-l8 · `u2.js` u2-l1..u2-l4 · `u3.js`
u3-l1..u3-l7 · `u4.js` u4-l1..u4-l5 · `u5.js` u5-l1..u5-l9 · `u6.js` u6-l1..u6-l3 · `u7.js` u7-l1..u7-l6.
Fold course intro/objectives (ص 1–6) into u1-l1 and each unit's cover/objectives into its first lesson.
safety (`/home/claude/lib/courses/safety/lessons/`): `u1.js` u1-l1,u1-l2 · `u2.js` u2-l1..u2-l4 · `u3.js` u3-l1..u3-l6 ·
`u4.js` u4-l1..u4-l3 · `u5.js` u5-l1..u5-l5 · `u6.js` u6-l1..u6-l4. Unit question sets (essay / fill / T-F) go into the
last lesson of each unit as a «أسئلة الوحدة» section with «إجابة مقترحة (ليست من الكتاب)» in <details>.
Each lesson also gets `quiz` (5–6 multiple-choice questions from the lesson, with short explanations).

## Rules
- Arabic plain words; book text verbatim where quoted; Latin/units in ltr spans; SVG Arabic+digits in separate tspans;
  dark mode via CSS variables; works at 390 px and at 125% font.
- Only edit your own lesson files. After your files exist, run
  `cd /home/claude/lib && python3 -c "import make_course"` is NOT needed — I regenerate index.html myself. Test with
  `cd /home/claude/book && COURSE=<id> node test2.js <ids>` (if it complains the course index lacks your file, tell me
  in the report — do not edit index.html). `node svgbidi.js <id> <ids>`. Screenshots: `node tpshot.js <id> <lesson>
  shots/<id>-<lesson>.jpg 1280` — LOOK at them; check 390 px for horizontal overflow with your own playwright script.
- Report (short, English): lessons built, labs, examples, book errors handled, ONLY important doubts.
