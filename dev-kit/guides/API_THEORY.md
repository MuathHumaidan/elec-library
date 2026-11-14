# Authoring a THEORY course (e.g. الآلات الكهربائية الصغيرة) — addendum to /home/claude/book/API.md

Read `/home/claude/book/API.md` first (lesson object, theory blocks, quiz, plant/lab, colors, rules). This addendum lists what differs for theory courses.

## Where things are
- Library root: `/home/claude/lib/` (library home `index.html`, catalogue `library.js`).
- Shared framework (DO NOT EDIT): `/home/claude/lib/shared/` — `engine.js`, `app.js`, `book.css`, `shell.js`, KaTeX.
- Course: `/home/claude/lib/courses/small-machines/` — `index.html` (do not edit), `course.js` (units; do not edit), `lessons/uN.js` (YOU write only your unit file).
- Source content: `/home/claude/c2/ex/small_u1_u2.md`, `/home/claude/c2/ex/small_u3_u5.md` (faithful extraction; your ONLY source of book content). Use each file's «اقتراح الدروس» as the lesson split.
- Reference implementation for depth/quality: `/home/claude/lib/courses/plc/lessons/u2.js` (lesson u2-l1) and `/home/claude/lib/courses/plc/lessons/u3.js` (timer workbench custom lab).

## Lesson tabs in a theory course
`الشرح` (theory) · `المختبر` (simulation) · `الأمثلة المحلولة` (worked examples, only if the lesson has some) · `اختبر نفسك` (quiz). There is no PLC program: omit `program`, `io`, `ctrl`.

## Math
KaTeX is loaded. In any theory `html`, write inline math as `\\( ... \\)` and display math as `$$ ... $$` (in a JS string remember to escape backslashes: `'\\(\\theta = \\frac{360}{N P}\\)'`). For strings you render yourself use `B.tex(latex, displayBool)` → HTML. Keep equation numbers as printed, e.g. `$$ \\theta=\\frac{360^\\circ}{N\\,P_r} \\qquad (١-١) $$`.

## Worked examples tab (calculators)
```js
examples:[{
  title:'مثال (٢-١)', ref:'ص 31',
  q:'<p>question text exactly as in the book…</p>',
  given:[{id:'Vf',label:'جهد المجال',sym:'V_f',unit:'V',value:24,step:'any'}, ...],   // book values
  solve:(g,B,isBook)=>[                    // return the solution steps, in the book's order
     {t:'نحسب الجهد المتولد:', f:'E = K\\,\\omega', v:B.round(...,2), unit:'V', dp:2},
     ...,
     {t:'الجواب', v:..., unit:'V', dp:2, final:true}],
  note:'optional callout (e.g. a book slip)'
}]
```
- **User decision: results use the BOOK's rounding.** With the book's input values the calculator must show exactly the book's printed intermediate and final numbers. Reproduce the book's own rounding of intermediates with `B.round(x,dp)` at the same points the book rounds, and set `dp` per step to the book's printed decimals. When the trainee changes inputs, the same procedure runs on the new numbers.
- Where the book has an arithmetic slip, still show the book's printed value when `isBook` is true, and add a `note` (and an `err` theory block) giving the exact value. Example: book 24.93 V, exact 24.94 V.
- **Display (user decision, Nov 2026):** the solution starts hidden and is revealed one step at a time («الخطوة التالية»), with «اعرض الحل كاملاً» and «إخفاء الحل»; a side button «توقّع الناتج» lets the trainee type a guess for the next numeric step — correct if it matches the shown value after rounding to the fewer of (decimals typed, decimals shown). Handled in shared/app.js renderExamples — nothing to add per example.
- Complex numbers / quadratic solutions: compute them yourself in JS (small helpers in your file).

## Simulation (المختبر)
Prefer a fully custom `lab:(el,B)=>{...}` for theory courses: sliders (`<input type="range">`), buttons, SVG/canvas drawings animated with requestAnimationFrame. Stop the loop when `!document.body.contains(el)`. Style with existing classes (`panel`, `grid`, `c7/c5/c12`, `btn`, `seg`, `facts/fact`, `sub`, `callout`, `chart`) and CSS variables only. Each lab must be based on a specific book figure (cite it: «مبنية على الشكل (١-٥) ص 10») and let a beginner operate it, with a short «جرّب» list of 3–5 things to try. Give exact physics where the book gives formulas; any illustrative numbers must be labelled «أرقام توضيحية».
(You may also use the built-in runtime: `plant` + `inputs` with push/toggle buttons, as in the PLC course, if that fits better.)

## Book questions
Each unit ends with one extra lesson «أسئلة الوحدة واختبارها الذاتي» (order = last): copy the book's self-test and questions exactly (with page refs) inside `<details>` items; under each, a «إجابة مقترحة (ليست من الكتاب)» written from the book's text (the book has no answer keys). Numeric questions may get a calculator in `examples`.

## Book errors
User policy: wherever the book is wrong in a way that changes behaviour/results, show an `err` block and, where it matters for a simulation, offer a toggle «كما في الكتاب» / «المصحح» inside your lab. Typos/wrong cross-references: `err` block only.
Specific decision already taken by the user: hybrid stepper step = **18°** as in the book; add a «توضيح» explaining that the formula (١-١) gives 18° when the rotor teeth of BOTH ends are counted (P = 10, the two ends are offset by half a tooth), otherwise one would get 36°.

## Quiz
6–8 questions per lesson written by you from the book's content (Arabic), with explanations.

## Testing
`cd /home/claude/book && COURSE=small-machines node test2.js u1-l1 u1-l2 ... --shots` (screenshots in `/home/claude/book/shots/`). It opens every tab and presses push buttons; also open your custom labs and move sliders in a small playwright script of your own, and check every calculator with the book's values reproduces the book's printed numbers (node script: `global.window=global; global.document={...}` is awkward — simplest is evaluating `PLCBOOK.LESSONS.find(...).examples[i].solve(...)` inside the page with playwright `page.evaluate`).

## Wording rule (user decision)
Never prefix book content with «كما في الكتاب» / «كما وردت في الكتاب» / «منقولة كما في الكتاب» — just present it (e.g. «الأهداف:» / «الأهداف التفصيلية:», not «الأهداف كما في الكتاب:»). Page refs already show the source. The phrase «كما في الكتاب» is used ONLY as the name of the book-vs-corrected toggle and when contrasting the book version with the corrected one.
