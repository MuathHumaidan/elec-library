# Short "decisions" report per course — guide

The coordinator wants, for each course, a SHORT report for the course trainer containing ONLY the things that were
DECIDED and can affect teaching/the trainee — each with: the problem, what the book has (the error), and the decision taken.
NOT included: undecided review points (the ☐ checklist), activity counts, simulator-fault tables, general description,
mini-lab number lists, silent typo fixes that change nothing for the trainee (e.g. a misspelled word, a missing letter,
reordered words) — leave those out entirely.

Sources (read fully): the full report /home/claude/st/reports/<course>.md (sections «أخطاء الكتاب وما اعتمدناه»,
«قرارات اتخذها المدرب», «إضافات من خارج الكتاب وافتراضات»), and the lesson files
/home/claude/lib/courses/<course>/lessons/*.js — the correction notes (fixnote / «ملاحظة على الكتاب» / «كما في الكتاب /
المصحح» blocks) explain WHY each book item is wrong; use them to write the problem explanation. Do not invent; if the
lesson gives no reason, state the problem in one plain sentence from what the book shows vs the correct value.

Write /home/claude/st/reports/dec/<course>.md in Arabic, plain language for a trainer (no code, ids, paths, HTML):

## أخطاء الكتاب والقرار فيها
One item per book error that matters (wrong number/result, wrong figure label or address, wrong formula, wrong unit,
contradiction, missing data that we filled, mismatch between figure and text, …). Merge items that are the same error
repeated. Order by lesson. Each item EXACTLY this shape:

### الدرس 3.2 (ص 41): <short title, ≤ 8 words>
- **المشكلة:** <1–2 sentences: what is wrong and why it matters for the trainee>
- **في الكتاب:** <what the book prints, short>
- **القرار:** <what we adopted, and how it appears: مفتاح «كما في الكتاب / المصحح» / ملاحظة تصحيح / اعتماد الصحيح مباشرة>

## قرارات المدرب في المقرر
Course-specific decisions the coordinator took (from «قرارات اتخذها المدرب» — skip the site-wide general ones, they go
in a shared section added separately), plus any decided addition from «إضافات من خارج الكتاب» that changes what is
taught (e.g. a section added because book questions need it, a frequency switch, an assumed value the coordinator
approved). Same shape:

### <short title>
- **المشكلة:** …
- **القرار:** …

Rules: Arabic only; numbers+units as in the report; each bullet ≤ 45 words; no tables; no checklist. At the very top one
line: «عدد البنود: N خطأ في الكتاب، و M قراراً للمدرب.» Report back: counts and anything uncertain.
