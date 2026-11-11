# Classify decision items by importance — guide
File: /home/claude/st/reports/dec/<course>.md. Every item (a `### ...` heading followed by bullets), in BOTH sections,
gets ONE new bullet placed directly after its heading, before «المشكلة»:
- **الأهمية:** قصوى   |   - **الأهمية:** متوسطة   |   - **الأهمية:** للعلم
Rules agreed with the coordinator:
- قصوى (لازم يعرفها المدرب): the error changes the final answer/number the trainee writes (an example result, an
  exercise solution); OR following the book would produce something wrong in practice (wrong wiring, a program that
  doesn't work, wrong input/output address, wrong value set on equipment); OR it could appear in an exam and make the
  trainee's answer differ from the trainer's. Trainer decisions that change what is taught/computed (e.g. a frequency
  switch, an added section the questions depend on, an assumed value used in calculations) are قصوى.
- متوسطة (يفيد يعرفها): does not change the result but can confuse the trainee while following: wrong figure/table
  number, a label in a drawing that doesn't match the solution, missing data we completed, text/figure mismatch.
- للعلم (لا يؤثر): small rounding differences, a symbol or unit written differently, wording that changes neither
  understanding nor result.
Use the lesson files (/home/claude/lib/courses/<course>/lessons/*.js) when an item is unclear. When in doubt between two
levels, choose the higher one. Do not change any other text. Update the top count line to also give the split, e.g.
«عدد البنود: 55 خطأً في الكتاب، و9 قرارات للمدرب.» followed by a new line «حسب الأهمية: 20 قصوى، 30 متوسطة، 14 للعلم.»
Report back: the split per course and any items you found hard to place.
