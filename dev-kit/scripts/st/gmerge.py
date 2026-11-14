#!/usr/bin/env python3
"""usage: gmerge.py <course> <file>   e.g. gmerge.py plc u2   (file = lesson file name without .js)
Rebuilds /home/claude/lib/courses/<course>/lessons/<file>.js = pristine copy (/home/claude/st/<course>/<file>/orig.js,
made automatically on first run) + every fragment /home/claude/st/<course>/<file>/<lesson-id>.stations.js
(each fragment = a JS array literal starting with '['), inserted as ' stations:<frag>,' before that lesson's ' theory:['.
Safe to run any time (always rebuilds from the pristine copy; atomic replace)."""
import os,re,glob,sys,tempfile,shutil
course,fn=sys.argv[1],sys.argv[2]
D=f'/home/claude/st/{course}/{fn}'; os.makedirs(D,exist_ok=True)
OUT=f'/home/claude/lib/courses/{course}/lessons/{fn}.js'
orig=os.path.join(D,'orig.js')
if not os.path.exists(orig): shutil.copy(OUT,orig)
src=open(orig,encoding='utf-8').read()
for f in sorted(glob.glob(os.path.join(D,'u*-l*.stations.js'))):
    lid=os.path.basename(f).split('.')[0]
    frag=open(f,encoding='utf-8').read().strip()
    if not (frag.startswith('[') and frag.endswith(']')): print('skip (not an array):',f);continue
    m=re.search(r"\n id:'%s',[\s\S]*?\n( theory:\[)"%re.escape(lid),src)
    if not m: print('lesson not found',lid);continue
    src=src[:m.start(1)]+' stations:'+frag+',\n'+src[m.start(1):]
fd,tmp=tempfile.mkstemp(dir=os.path.dirname(OUT));os.write(fd,src.encode());os.close(fd);os.replace(tmp,OUT)
print('merged ->',OUT)
