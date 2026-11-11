# «التفاعلي» style: mini-labs in every station — guide

The library's second explanation style (internal name 'stations', shown to users as «التفاعلي»). Trainer decision: make it
interactive in MOST stations, like his physics lesson labs — the trainee keeps doing something, not just reading.
The pilot on course `dc-machines` is DONE and APPROVED — it is the model. Study it before writing:
- /home/claude/st/dc-machines/u1/*.stations.js, u2/*, u3/* (fragments). The shared mini-lab widget helpers are defined
  at the top of the FIRST fragment of each unit (u1-l1, u2-l1, u3-l1) — copy that helper code into the first fragment of
  each unit file you handle (identical copy), then use it.
- Read /home/claude/st/STATIONS_GUIDE.md fully (widget API, fragment workflow, merge with
  `python3 /home/claude/st/gmerge.py <course> <file>` — plc unit 1 uses /home/claude/st/plc_u1/merge.py — tests, svgbidi).

For each station of every lesson in your scope that does not already have a meaningful widget, add ONE small «مختبر
مصغّر» where it genuinely helps understanding:
- formula station → sliders for inputs with live result, tiny live graph/meter, and a «توقّع أولاً» question that unlocks
  the controls/explanation after the trainee commits;
- procedure/steps → tap-to-order or «ماذا لو تخطّيت هذه الخطوة؟» choice with feedback;
- connection/terminals/wiring → tap-to-connect or toggle wiring and see the meter/lamp/rotation react;
- PLC program station → toggle inputs and watch the program/outputs (reuse the shared engine.js / the lesson's own
  simulator code), «ماذا يحدث لو ضغطنا S1 ثم S2؟» predict-then-run, find which line drives an output;
- definition → quick classify/match or صح/خطأ with explanation;
- graph/curve → move a point and read values, or choose which curve fits a statement.
Pure rules/lists with nothing to manipulate → a light صح/خطأ check instead.
Keep each mini-lab short (one idea), mobile-friendly (tap targets, no hover-only), RTL Arabic, numbers/Latin direction
correct (put equations like "T = 0" in ltr spans or KaTeX), dark mode OK, works at 125% font size (localStorage
'elib-fz'='1.25'). Use values from the book's examples/tables where given; else the lesson's illustrative values
(B.params / the lab's model) labelled «قيم توضيحية»; numbers you choose for sliders labelled «أرقام تختارها أنت». Reuse the
lab tab's model/simulator code rather than re-deriving physics. Faithful to the book; nothing technically doubtful;
corrected facts where the lesson marks a book error.
Do not change the formal style, lab tab, examples, quiz, activities, challenge files, or shared/ files. Keep book-text
blocks verbatim. SOURCE RULE: edit only fragment files, rebuild with the merge script, confirm the lib lesson files contain
your changes. Other agents work on OTHER files of the same course in parallel — touch only your files.

Tests: `cd /home/claude/book && COURSE=<course> node test2.js <your lesson ids>` all ok; `node svgbidi.js <course> <ids>`;
playwright in stations mode (localStorage 'elib-style'='stations') at 1280 and 390 (and 390 at 125%): open every lesson in
scope, operate every new widget, no page errors, no horizontal overflow; screenshot a sample and LOOK; fix issues.
Do not deploy. Report briefly: per lesson stations / now interactive / new widgets; kinds added; light-check-only stations;
points for the trainer/specialists (non-book numbers, teaching constructs).
