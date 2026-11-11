# «الأنشطة التفاعلية» — decisions from the trainer (authoritative)

Pilot course: dc-machines, then all 8 courses. Trainer is not an electrical specialist: content must be checked technically by us; department specialists will review later.

## Tab
- New lesson tab «الأنشطة التفاعلية»: section «داخل المحاضرة (يطلقها المدرب)» (live, quiz server on Railway) and «للمذاكرة الذاتية» (inside the library, no server, offline).
- Site-wide hide list in the library: shared/activities-config.js `window.ACT_OFF=[]`.

## Live (quiz server)
1. Quiz (existing) + «وضع الفرق»:
   - team assignment: trainer chooses one of 3 methods: random balanced / each student picks his team on join / trainer assigns manually in the lobby.
   - number of teams: trainer picks 2–6, default 4; each team has a colour + name («الفريق الأحمر» …).
   - team ranking by SUM of members' points; also show the team AVERAGE next to it.
2. «اكتشف العطل» (lessons with a simulator): 3–5 hidden faults per simulator; trainer picks one or random. Points by speed for all students.
   «اكتشف الخطأ» (theory lessons with worked examples): one variant per worked example with NEW numbers (same idea/method) and ONE wrong step whose error is conceptual (wrong law, wrong unit, sign flipped, wrong quantity used…), not just an arithmetic slip. After answering, show why the step is wrong and its correction. Setting (trainer): «الخطوة فقط» (default) or «الخطوة + سبب الخطأ» (3–4 reason options). Points by speed for all students (Kahoot formula).
3. «تحدي المحاكاة»: trainer writes a target (e.g. speed 1450 rpm) and an acceptance band ±% (default 2%; 0% = exact). Within band = success; fastest first.
4. Open question + word cloud: 3 ready open questions per lesson + trainer's own. Max length default 40 chars, answers per student default 1 — both adjustable. Anonymous on screen; trainer can hide any word.
5. Exit ticket: MCQ (3 NEW ready questions per lesson about the key idea; trainer picks one), «وش أكثر شي ما اتضح لك اليوم؟» short text, «قيّم فهمك للدرس» 1–5. Names: trainer chooses (anonymous / named). Summary on trainer screen only. Saved with results + Excel.

## Self-study (library)
6. Flashcards per unit (laws, symbols, definitions, circuit symbols): ~15–25 per unit as needed; «عرفتها / ما عرفتها»; unknown cards come back until known. Progress saved on the device only.
7. «رتّب خطوات التجربة» / «وصّل أطراف الدائرة»: only lessons where it fits.
8. Pre/post lesson test: optional side option; 5 questions; the SAME questions before and after (to show improvement); taken from the lesson's existing «اختبر نفسك» quiz.
