# «المحطات» — writing a lesson's theory tab in the stations style

The trainer approved a sample (AC course lesson 1.3) and wants every lesson to get a SECOND version of its theory tab in
the «المحطات» style. The site now has a top-bar switch «أسلوب الشرح: رسمي / المحطات»; in stations mode the theory tab
renders `L.stations` (an array) with `renderStations` (shared/app.js — already installed, do not modify shared/).
The formal `theory:[…]` stays untouched. Lab, worked examples and quiz stay exactly as they are.

## THE APPROVED REFERENCE — study it fully before writing
`/home/claude/lib/courses/ac-machines/lessons/u1.js` → lesson `u1-l3` → the `stations:[ … ]` array (≈130 lines starting at
the line ` stations:[`). Copy its patterns: block types, SVG art style, data-tip usage, predict format, widget code
style, recap. Also read `renderStations` in `/home/claude/lib/shared/app.js` (search `function renderStations`) to know
exactly which fields exist.

Also approved (same rules, PLC course): the unit-1 fragments `/home/claude/st/plc_u1/u1-l*.stations.js` — good
models for exercise/program lessons (LAD/FBD/STL drawings, study/coding/drawing stations, STL step widget).

## Structure of the array (trainer's rules — verbatim intent)
1. Start with `{intro:true}` (the «كيف تقرأ هذا الدرس؟» box + station buttons).
2. Every heading of the lesson becomes a station `{st:N, short:'…', title:'…', q:'…', ref:'ص N', art:String.raw\`<svg…>\`,
   cap:'…', side:[blocks], body:[blocks]}` — number, short title, a thought-provoking question `q`, and the BOOK page `ref`.
3. The book text goes VERBATIM in `{book:'…', ref:'ص N'}` blocks — no «» around it, no rewording at all. Source of the
   book text: the course's extraction file(s) (listed in your task) and the formal theory of the same lesson (which
   quotes the book) in the lesson file. Never write «كما في الكتاب» before book text.
4. Our explanation goes in `{tip:'…', title?}` (توضيح للمتدرب); a real-world example or info not in the book goes in
   `{add:'…', title?}` (إضافة من خارج الكتاب); common mistakes in `{watch:'…'}` (انتبه).
5. Every station has at least one `{predict:{q:'…', opts:[[text, true/false, reason], …]}}` — every option has the reason
   it is right or wrong; the position of the right answer varies from question to question.
6. A small in-text experiment `{widget:(el,B)=>{…}, title:'…'}` ONLY where it really helps (a slider that changes a
   value, a cause→effect chain…). Do not duplicate the lab.
7. End with `{recap:[ '…', … ]}` — 3 to 5 lines; every equation in it carries its number.
8. Displayed equations: `<div class="eq">$$...$$<span class="eqno">(1-3)</span></div>`.

## Drawings
- Each station has its own SVG (`art`), same style as the reference: flat colours, a light circle behind the drawing,
  dark lines, viewBox 0 0 360 320, `style="font-family:var(--font)"`.
- NO decoration without purpose (stars, dots, wavy lines) — formal lesson for college trainees.
- Any part whose meaning is not obvious without explanation (symbols, English abbreviations, colours that represent
  something, arrows) gets `data-tip="…"` explaining its name and role. Clearly-labelled parts don't need it.
  Inside data-tip text wrap any equation/English symbol with ⟦ ⟧ (e.g. «العنوان ⟦I 0.0⟧»).
- Under every drawing that has tips, the caption `cap` ends with: «مرّر المؤشر على … (أو المسه في الجوال) لتعرف معناه.»
- Every NUMBER inside a drawing must come from the book. If you need a number that is not in the book, DO NOT use it:
  leave it out and list it in your report as a question for the trainer.

## Text direction
Any number with a unit, equation written as text, or equation number like (1-3) inside Arabic text goes in
`<span class="ltr">…</span>` or inside KaTeX, so it doesn't flip (e.g. «rpm 1500»). Addresses like I 0.0 / Q 4.0 /
M 0.1 / T1 and PLC terms (LAD, FBD, STL) too.

## Fixed rules
- Illustrative (non-book) numbers in any widget get the «قيم توضيحية / قيم المدرب» switch (B.params — see
  /home/claude/lib/TP_GUIDE.md) like the other simulations. Prefer widgets that need no invented numbers.
- Any judgement call (a number, the wording of an addition, a calculation method) → do not assume: list it in the report.
- Plain Arabic for beginners.

## Trainer decisions since the first unit (apply them)
- EVERY book heading gets its OWN station — never merge two headings into one station («التقيّد بمحتوى الكتاب وإيصال فكرته
  في أفضل صورة»). Numbered sub-steps that are not headings (الدراسة/الترميز/الرسم…) may stay inside one station.
- Additions («إضافة من خارج الكتاب» — real-world examples etc.) are ALLOWED, clearly labelled, like the reference.
- Book typos: write the corrected word silently like the formal tab does (the formal tab is the reference for
  which typos it fixed); a real book ERROR (wrong number/formula) is shown as in the formal tab (its «انتبه»/notes
  and the book/corrected toggle in the examples stay as they are).
- The trainer wants to be asked only about IMPORTANT things. So: don't invent numbers (use only book numbers in art and
  text; widgets that need invented numbers must use the B.params «قيم المدرب» switch with defaults labelled
  «توضيحية»). Report only real doubts.
- Known pitfalls (fix them as you write):
  * SVG <text> mixing Arabic with digits/Latin renders in the wrong order: give it direction="rtl" (and remember that
    text-anchor start/end flip sides under rtl — centred text is safest), or put the Latin part in its own <tspan>.
  * (fixed centrally: ltrU no longer touches anything inside <svg>…</svg>, so no workaround needed.)
  * station `title`, `short`, `cap` fields don't go through ltrU: wrap figure numbers like (2-1), units, addresses in
    <span class="ltr">…</span> by hand.

## How to write / test (many authors work in parallel)
- Your task names a course `<course>` and a lesson file `<file>` (e.g. plc / u2). Lessons are in
  `/home/claude/lib/courses/<course>/lessons/<file>.js`. Book page refs = printed pages, as in the formal tab.
- Write ONLY your fragment files: `/home/claude/st/<course>/<file>/<lesson-id>.stations.js` — each contains exactly
  the array literal (starts with `[`, ends with `]`), nothing else.
- Then run `python3 /home/claude/st/gmerge.py <course> <file>` (rebuilds the lesson file from its pristine copy + all
  fragments). NEVER edit the lesson file directly. Lessons that already have a `stations:` array in the pristine
  copy (ac-machines u1-l3) are DONE — skip them.
- Test: `cd /home/claude/book && COURSE=<course> node test2.js <ids>` → ok for each. Then your own playwright script:
  `await page.addInitScript(()=>localStorage.setItem('elib-style','stations'))`, open
  `file:///home/claude/lib/courses/<course>/index.html#<id>`, screenshot at 1280 and 390 px and LOOK (Read): art
  readable, Arabic/Latin order right, tips (hover one), predict feedback (click), no page errors, no horizontal
  overflow at 390 (`document.documentElement.scrollWidth<=390`). Put screenshots in /tmp/<course>-<file>/ (not in
  /home/claude/book/shots).
- Report (short, English): stations per lesson, and ONLY important doubts (e.g. a book error you are unsure how to
  show, a place where you could not avoid a non-book number). Don't list routine additions.
