# Activity content for a course — guide

Read /home/claude/st/ACTIVITIES_PLAN.md first (trainer decisions). The pilot course `dc-machines` is DONE and is the model:
- /home/claude/lib/courses/dc-machines/activities.js  (open + exit per lesson)
- /home/claude/lib/courses/dc-machines/study.js       (flashcards per unit; order/match per lesson)
- /home/claude/lib/courses/dc-machines/errors.js      («اكتشف الخطأ» variants per worked example)
Read them to copy the exact shapes, tone and level of care.

The trainer is NOT an electrical specialist and relies on us; department specialists review later. Content must be faithful to the course book and technically correct. Where the formal lesson marks a book error (book/corrected, «ملاحظة على الكتاب»), use the corrected fact.

## Sources per course
- Lessons: /home/claude/lib/courses/<course>/lessons/*.js (theory, lab, examples, quiz — read them; lesson ids like 'u1-l1', 'u3b-l2').
- Book text extraction:
  - plc: /home/claude/book/extract/*.md (and the lesson files themselves, which are faithful)
  - small-machines: /home/claude/c2/ex/small_*.md
  - ac-machines: /home/claude/c2/ac_ex/ac_*.md
  - circuits-1: /home/claude/c4/ex/c1_*.md ; circuits-2: /home/claude/c4/ex/c2_*.md
  - control-lab: /home/claude/c5/ex/ctrl.md
  - electric-drive: /home/claude/c5/ex/drv_*.md
  If something is missing, rely on the lesson files (they quote the book with page refs).

## Files (same shapes as dc-machines)
1. activities.js — `PLCBOOK.acts({ '<lessonId>': { open:[3 strings], exit:[3 × {q,o:[4],c,e}] }, … })` for EVERY lesson.
   - open: short-answer prompts for a live word cloud (answers 1–4 words, ≤40 chars): recall / prediction / reflection mix.
   - exit: 3 NEW MCQs on the lesson's key idea, 4 options, one correct (c 0-based), plausible distractors, no «جميع ما سبق/لا شيء مما سبق», not duplicating the lesson's quiz; e = one-sentence explanation with «(ص N)» when possible. Spread correct answers across positions.
2. study.js — `PLCBOOK.study({ units:{ <unitId>:{title, cards:[{k:'law'|'symbol'|'def'|'circuit', f, b, ref}]} }, lessons:{ '<lessonId>':{ order:[{title,steps}], match:[{title,pairs}] } } })`
   - unit id = lesson id prefix before '-l' (e.g. 'u3b').
   - cards: ~15–25 per unit as the content needs (laws with symbols explained, units/symbols, definitions, circuit/graphical symbols — small inline <svg> with currentColor strokes only for real symbols from the book). For plc: instructions/operands (e.g. A, O, =, S, R, timers SD/SE/SP…, counters), addresses, ladder/FBD symbols.
   - order: only real procedures from the book (lab steps), 4–8 steps in correct order. match: only where the book gives terminals/connections/symbol↔meaning pairs (3–6 pairs). Only lessons where it fits.
3. errors.js — `PLCBOOK.errs({ '<lessonId>':[ {ex,title,given,ask,steps:[{t},{t,bad:true,why,fix,reasons:[3–4],rc}],answer} ] })`: one variant per worked example (lesson `examples`) that is a calculation. NEW realistic numbers, same method; exactly ONE bad step with a CONCEPTUAL error (wrong law, unit/conversion, sign, wrong quantity line↔phase, peak↔rms, terminal↔induced, missing term…), not an arithmetic slip; later steps carry the wrong value consistently; fix = correct step + correct result; answer = correct final result. Recompute every number with node. Skip non-calculation examples (list them). For courses without worked examples (plc, control-lab) you may instead make variants from the lab/theory where a short program or calculation procedure exists (plc: a short STL/LAD program listing with one wrong instruction/address, given = the task, steps = program lines; control-lab: a calculation from the book) — only if natural; otherwise skip and say so.

Allowed HTML: <sub> <sup> <b> <br> (+ <svg> in circuit cards). KaTeX \( \) allowed. Plain clear Arabic; symbols as in the book.

## Wiring + validation
- Add the script tags to /home/claude/lib/courses/<course>/index.html right before shell.js, in this order: activities.js, study.js, errors.js (only files you created). (make_course.py already adds them automatically when the files exist.)
- Do NOT edit shared/, lesson files, sw.js, quiz-bank.json, tools/ (the main session regenerates those).
- Validate in node with stubs (global.PLCBOOK={acts,study,errs}): every lesson id present in activities.js; counts; options; c in range; no duplicate options/cards; lengths sane; arithmetic of every errors.js variant recomputed by a script. Then a second careful technical review pass over everything.
- Run `cd /home/claude/book && COURSE=<course> node test2.js` → all ok.
- Report briefly: counts, skipped items, and items the specialists should double-check (lesson id + one line each).
