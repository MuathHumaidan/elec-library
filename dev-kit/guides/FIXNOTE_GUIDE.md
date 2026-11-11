# Tagging book-error explanations as hideable («إخفاء الشرح»)

## Goal (from the trainer)
In the site, many places switch between «كما في الكتاب» and «المصحح», and many places explain that the
book is wrong. The trainer wants every **explanation that the book is wrong / what was corrected** to be
hideable with a small «إخفاء الشرح» button. When hidden, a small «لماذا؟» chip appears in its place,
and the choice is remembered on the device for the whole site.

The shared mechanism is DONE (do not change /home/claude/lib/shared/*):
- Any element with class `fixnote` automatically gets the «إخفاء الشرح» button appended inside it, and a
  «لماذا؟» chip inserted just before it. Works for elements rendered at any time (MutationObserver).
- Stations: a watch block `{watch:String.raw`…`, fix:true}` renders with class `fixnote` (the whole «انتبه» box hides).
- Generic inline switch for text errors: `B.bkCtl('key','label')` + `<span class="bkb" data-bk="key">book</span><span class="bkf" data-bk="key">fixed</span>`
  (see electric-drive u4 «rain» for a full example: formal theory li, lab text, stations art). You do NOT need to
  convert existing toggles to this — only tag explanations.

Working examples to copy:
- /home/claude/lib/courses/control-lab/lessons/u3.js — `PID_NOTE`: only the explanation sentence is wrapped in
  `<span class="fixnote">…</span>`; the `<select>` chooser after it stays visible.
- /home/claude/st/electric-drive/u4/orig.js — rain note `<span class="bkf blk sub fixnote" data-bk="rain">`.
- /home/claude/st/electric-drive/u4/u4-l2.stations.js — `{watch:…,fix:true}` followed by a separate `{html:…}` that holds the switch.

## What to tag (class `fixnote`, or `fix:true` on a stations watch block)
Tag text whose purpose is to say the book printed something wrong / missing / inconsistent, and what we
corrected and why. Typical places:
- notes shown in «المصحح» mode next to calculators, tables, labs, examples (modeNote-like functions,
  ternaries `md==='book'?…:…`, `mode==='fixed'`, «المصحح:» notes);
- formal-tab callouts/notes that explain a book error (often `callout err`, «تنبيه»/«ملاحظة» about a printed error, «خطأ مطبعي»);
- stations «انتبه» (watch) blocks whose content is ONLY about a book error/correction → add `fix:true`.
  If a watch block mixes a book-error explanation with other useful teaching, split it: keep the teaching in
  the watch block (no fix) and move the error explanation into its own `{watch:…,fix:true}` block right after.

## What NOT to tag
- the switch/toggle buttons, selects, inputs, or the corrected values/results themselves (those must stay visible);
- notes shown only in «كما في الكتاب» mode (e.g. "as printed: …") — leave them;
- general «انتبه» teaching (safety, common mistakes, units, reading tips) that is not about a book error;
- labels «إضافة من خارج الكتاب» / «إجابة مقترحة (ليست من الكتاب)» — not error explanations;
- quiz questions/explanations;
- book text inside `{book:…}` blocks.
If a note mixes an explanation with a control (like PID_NOTE), wrap ONLY the explanation part.
Element choice: inside running text use `<span class="fixnote">…</span>`; for a whole box add `fixnote` to the
box's class list (e.g. `<div class="callout err fixnote">`). Never put `fixnote` on an element that also contains a control.

## Where to edit (important — otherwise future merges lose your edits)
Lesson files in /home/claude/lib/courses/<course>/lessons/<file>.js are BUILT from:
- formal content: /home/claude/st/<course>/<file>/orig.js  (pristine copy)
- stations content: /home/claude/st/<course>/<file>/<lesson-id>.stations.js
Edit those sources, then rebuild with `python3 /home/claude/st/gmerge.py <course> <file>`.
Exception: plc unit 1 (`u1`) — read /home/claude/st/plc_u1/merge.py and use it the same way.
If some lesson file has no orig.js folder, edit the lib file directly and say so in your report.
course.js files are edited directly.

## Test
- `cd /home/claude/book && COURSE=<course> node test2.js` → every lesson must print ok.
- Playwright spot check (write your own small script; examples /home/claude/book/fxchk.js): open a few edited
  places in both styles (localStorage 'elib-style' = 'formal' or 'stations'), switch to «المصحح» where needed,
  confirm `.fx-hide` appears in each tagged note, clicking it hides all `.fixnote` and shows `.fx-chip`,
  controls stay visible, no page errors. Clear localStorage 'elib-hidefix' between runs.

## Report
Per course: number of places tagged (formal / lab / stations), any watch blocks you split, and anything you were unsure about. Keep it short.
Do not deploy (no git); the main session deploys.
