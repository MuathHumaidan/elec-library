#!/usr/bin/env python3
"""Rebuild lib/courses/plc/lessons/u1.js = pristine u1.orig.js + every fragment u1-lN.stations.js
(each fragment = a JS array literal starting with '['). Inserts ' stations:<frag>,' before that lesson's ' theory:['.
Safe to run any time / concurrently (always rebuilds from the pristine copy, atomic replace)."""
import os,re,glob,tempfile
D=os.path.dirname(os.path.abspath(__file__))
OUT='/home/claude/lib/courses/plc/lessons/u1.js'
src=open(os.path.join(D,'u1.orig.js'),encoding='utf-8').read()
for f in sorted(glob.glob(os.path.join(D,'u1-l*.stations.js'))):
    lid=os.path.basename(f).split('.')[0]
    frag=open(f,encoding='utf-8').read().strip()
    if not frag.startswith('['): print('skip (not an array):',f);continue
    m=re.search(r"\n id:'%s',[\s\S]*?\n( theory:\[)"%re.escape(lid),src)
    if not m: print('lesson not found',lid);continue
    src=src[:m.start(1)]+' stations:'+frag+',\n'+src[m.start(1):]
fd,tmp=tempfile.mkstemp(dir=os.path.dirname(OUT));os.write(fd,src.encode());os.close(fd);os.replace(tmp,OUT)
print('merged ->',OUT)
