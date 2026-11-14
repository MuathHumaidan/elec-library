# «التفاعلي» style for the two new courses (drawing, safety)
Read fully: /home/claude/st/STATIONS_GUIDE.md (fragments, merge with `python3 /home/claude/st/gmerge.py <course> <file>`,
rules, tests) and /home/claude/st/MINILAB_GUIDE.md (a mini-lab in most stations; the DCML helper copied from
/home/claude/st/dc-machines/u1/u1-l1.stations.js into the first fragment of each unit file you handle).
Also /home/claude/lib/API_NEW2.md (coordinator decisions for these courses; book errors already handled in the formal tab —
keep the same corrections and switches in stations).
Build the stations version from scratch for every lesson in your scope: one station per book heading (no merging), book
text kept, an illustration per station, out-of-book additions labelled «إضافة من خارج الكتاب», and a mini-lab or quick check
in most stations. Reuse the lesson's own lab/drawing code (helpers inside the lesson file) instead of re-drawing.
gmerge expects the lesson to contain `\n id:'<lid>',` and `\n theory:[` — check your file's formatting first; if it differs,
tell me in the report instead of editing the formal source.
Tests: `cd /home/claude/book && COURSE=<course> node test2.js <ids>` ok; `node svgbidi.js <course> <ids>`; playwright in
stations mode (localStorage 'elib-style'='stations') at 1280 and 390 (and 390 at 125% font): every widget operated, no page
errors, no horizontal overflow; LOOK at screenshots. Touch only your fragment files. Do not deploy. Short English report.
