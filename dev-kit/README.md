# dev-kit — how the electrical department library is built

This folder is NOT part of the site (sw.js does not cache it). It holds the guides and build/test scripts that were used to
build «المكتبة الرقمية للتقنية الكهربائية», so a new Claude session can rebuild the same workspace or start a library for
another department with the same system.

## Rebuild the workspace (paths the guides assume)
```
git clone https://github.com/MuathHumaidan/elec-library /home/claude/plc-book        # deploy clone (push → GitHub Pages)
mkdir -p /home/claude/lib && cp -r /home/claude/plc-book/. /home/claude/lib/          # working copy
cp /home/claude/lib/dev-kit/guides/API_*.md /home/claude/lib/dev-kit/guides/TP_GUIDE.md /home/claude/lib/
cp /home/claude/lib/dev-kit/scripts/make_course.py /home/claude/lib/
mkdir -p /home/claude/book /home/claude/st && cp /home/claude/lib/dev-kit/scripts/book/* /home/claude/book/
cp /home/claude/lib/dev-kit/scripts/st/gmerge.py /home/claude/lib/dev-kit/guides/*.md /home/claude/st/
cd /home/claude/book && npm i playwright && npx playwright install chromium
```
Thmanyah font (decks/PDF reports): clone github.com/engdawood/thmanyah-font-web into ~/.fonts (family 'thmanyah sans').

Note: the «التفاعلي» (stations) fragments live in /home/claude/st/<course>/<unit>/*.stations.js in the original session and
are merged into lib lesson files by gmerge.py from a pristine `orig.js`. Those fragment folders are not in this kit: for an
existing course, the merged lesson files in courses/<id>/lessons are the source of truth; for a new course, follow
STATIONS_GUIDE.md and create fragments from scratch.

## Contents
- guides/API_THEORY.md, API_LAB.md, API_CIRC.md, API_NEW.md, TP_GUIDE.md — how a course and its lessons are written
  (theory, labs, circuits, worked examples, trainer values).
- guides/STATIONS_GUIDE.md, MINILAB_GUIDE.md — the second explanation style «التفاعلي» and its mini-labs.
- guides/FIXNOTE_GUIDE.md — book-error handling: «كما في الكتاب / المصحح» switch, «إخفاء الشرح».
- guides/ACTIVITIES_PLAN.md, ACT_CONTENT_GUIDE.md, CHALLENGE_GUIDE.md — «الأنشطة التفاعلية» tab, live activities with the
  quiz server (repo elec-quiz on Railway), fault-finding and simulation challenge.
- guides/REPORT_GUIDE.md, REPORT_UPDATE.md, DECISIONS_REPORT.md, IMPORTANCE.md, DOC_TASK.md — per-course review reports
  and the short decisions PDF (green theme, sorted by importance).
- scripts/make_course.py — scaffold a course; scripts/book/test2.js, svgbidi.js … — tests (`COURSE=<id> node test2.js`);
  scripts/st/gmerge.py — merge stations fragments; scripts/reports/build2.py + book/_pdf.js — decisions PDFs.

## Deploy
Bump `V` in sw.js, copy lib → plc-book, remove make_course.py and API_*.md/TP_GUIDE.md from the copy, commit, push.
