# «قيم المدرب» — how to convert illustrative numbers in a lesson's lab

The trainer asked: every simulation that runs on numbers NOT from the book (marked «توضيحي/توضيحية» or invented
by us) gets a two-option switch «قيم توضيحية / قيم المدرب». In trainer mode the trainer types his own numbers
and the simulation runs on them live. Values are saved on his device only (localStorage).

## The shared component (already in /home/claude/lib/shared/app.js — do NOT modify shared files)

```js
const TP = B.params(hostEl, 'u1-l3', [
  {k:'Er0', label:'جهد العضو الدوار عند السكون E<sub>r</sub>', unit:'V', value:100, min:1, max:10000},
  {k:'S0',  label:'الانزلاق بلا حمل', unit:'', value:0.012, min:0.001, max:0.2, step:0.001},
], v => { /* redraw / recompute here */ });
// TP.v.Er0 → current value (default or trainer's). TP.trainer → true if trainer mode on.
```
- Put an empty `<div id="xxtp"></div>` as the FIRST child of the lab markup (before the `.grid`), then call
  B.params on it right after `el.innerHTML=...` / `const $=...`.
- `value` = EXACTLY the current illustrative number, so default behaviour is unchanged byte-for-byte.
- `id` = lesson id (e.g. 'u2-l3'); if a lab has two independent simulations you may use two panels with ids
  'u2-l3-a', 'u2-l3-b' (each host div placed just above its own panel, inside the grid as `<div class="c12" id=..>`).
- Replace every use of the hard-coded constant with `TP.v.k`. Loop-based sims (loopOn) just read TP.v each frame.
  Event-driven sims must redraw in the onChange callback.
- Choose min/max so nothing breaks (no division by zero, no negative where impossible, no NaN). Guard formulas
  that could explode with Math.max(…, tiny). Auto-scale axes if a plot's range was tuned to the old constant.
- Text that prints an illustrative number (headings, captions, step hints) must print the live value
  (span updated in onChange) or be worded without the number (or say «بالقيم التوضيحية»).
- «جرّب» step checks must still pass in default mode; it's fine if they are only reachable with default values.

## What counts / what doesn't
- YES: numbers that drive a lab simulation and are not from the book (illustrative motor parameters, slip at no
  load, rotor voltage, time constants that the trainee would perceive as physical, illustrative lab values for
  experiments, an «قيم توضيحية» preset button in the lab).
- NO: book numbers (given data of examples/exercises — those stay as they are); purely visual things (colours,
  drawing shapes, animation slow-down factor «العرض مبطأ 50 مرة», pixel sizes); figures in the THEORY tab drawn
  «بقيم توضيحية» (leave them); calculators in the examples tab (already editable).
- If a value is a mix (e.g. a curve shape constant with no physical meaning) — skip it and mention it in your report.

## Rules
- Arabic labels, plain words for beginners; units in the `unit` field (Latin symbols like V, A, Ω, rpm, Hz, s).
- Never write «كما في الكتاب» when presenting content.
- Only edit the lesson files you are assigned. Don't touch shared/, other courses, sw.js.
- Test: `cd /home/claude/book && COURSE=<course> node test2.js <lesson ids>` must print ok for each.
  Then `node tpshot.js <course> <lesson-id> shots/tp-<id>.jpg 1280` (switches to trainer mode, types 220 in the
  first field) — must print `errors: none`; look at the screenshot (Read tool) for a few lessons, and also try a
  390-px-wide shot for one lesson.
- Report back (short, in English): per lesson — params added (label, default), anything skipped and why,
  and any judgement call you had to make (these go to the trainer for approval).

## Round 2 — trainer decisions (apply to every lab that has B.params)
The shared component now shows the allowed range under each field and a red message when a value is pulled back
(nothing to do for that, it's automatic — but make sure every def has sensible min AND max).

A. «جرّب» steps must FOLLOW the current values (TP.v), not the illustrative ones. Step text that names a number
   derived from an illustrative value must print the live number (compute it from TP.v when the step list is
   rendered/checked — stepsUI texts may be static strings, so either regenerate the step list in onChange or put
   `<span>` placeholders in the text that you update in onChange), and the `done` check must use the same live
   number. Remove the «بالقيم التوضيحية» qualifiers you added in round 1 where the step now follows live values.
   Book numbers in steps (e.g. example data) stay as they are.
B. Acceleration time (rotor inertia) is a trainer field EVERYWHERE a motor accelerates on screen, with the same
   label used in unit 2: «ثابت زمن التسارع (يكبر مع ثقل العضو الدوار)», unit s. Default must reproduce the current
   behaviour exactly (convert the current inertia constant to the equivalent time constant).

## For new courses: round 1 + round 2 together
Do the round-1 conversion AND rules A and B in one pass. Do not invent new physics models to make a trainer value
"do more" — if a value would only change a drawing, keep it and say so in your report (the trainer decides).
In lab captions the trainer wants a short plain explanation whenever a number shown differs from what a trainee
might expect (e.g. because friction is included).
