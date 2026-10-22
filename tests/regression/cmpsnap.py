import json,sys
a=json.load(open(sys.argv[1]));b=json.load(open(sys.argv[2]))
d=0
# step 5 moved World 1 timers env.{bliz,blizT,rockT,ash,ashT} into W1ENV and World 2's into W2ENV (wT/leaveT, unset before = 0 now):
# fold them back into env (original key order) so values are still compared exactly
def fold(r):
    if not str(r.get('W1ENV','ERR')).startswith('ERR'):
        e=json.loads(r['env']);w1=json.loads(r['W1ENV']);w2=json.loads(r['W2ENV'])
        o={}
        for k in ['biome','spawnD','next','bliz','blizT','rockT','lastX','ash','ashT','lift']:
            o[k]=w1[k] if k in w1 else e.get(k)
        for k in e:
            if k not in o:o[k]=e[k]
        for k,v in w2.items():
            if v!=0:o[k]=v
        r['env']=json.dumps(o,separators=(',',':'))
    r.pop('W1ENV',None);r.pop('W2ENV',None)
for w in a:
    fold(a[w]['r']);fold(b[w]['r'])
for w in a:
    for k in sorted(set(a[w]['r'])|set(b[w]['r'])):
        if a[w]['r'].get(k)!=b[w]['r'].get(k):
            d+=1
            if d<20:print('DIFF',w,k,str(a[w]['r'].get(k))[:150],'|',str(b[w]['r'].get(k))[:150])
print('snapshot diffs',d)
