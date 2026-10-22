import sys,json,os
from PIL import Image,ImageChops
import numpy as np
A,B=sys.argv[1],sys.argv[2]
da=json.load(open(A+'/digest.json'));db=json.load(open(B+'/digest.json'))
bad=0
for k in sorted(set(da)|set(db)):
    if da.get(k)!=db.get(k):
        bad+=1;print('DIGEST DIFF',k, (str(da.get(k))[:200]), '|', str(db.get(k))[:200]) if bad<15 else None
for k,v in db.items():
    if k.endswith('_errs') and v: print('ERRS',k,v[:2])
pix=0;n=0
for f in sorted(os.listdir(A)):
    if not f.endswith('.png'):continue
    n+=1
    if not os.path.exists(B+'/'+f): print('MISSING',f);pix+=1;continue
    a=np.asarray(Image.open(A+'/'+f).convert('RGB')).astype(int);b=np.asarray(Image.open(B+'/'+f).convert('RGB')).astype(int)
    if a.shape!=b.shape: print('SIZE',f);pix+=1;continue
    d=(np.abs(a-b).max(axis=2)>8).sum()
    if d: pix+=1;print('PIXDIFF',f,d)
print('digest diffs',bad,'of',len(da),'| images differing',pix,'of',n)
