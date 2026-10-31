# Saturday Plan – deploy
Live: https://dwightgoodwin1963.github.io/saturday-plan/
Repo: https://github.com/dwightgoodwin1963/saturday-plan (Pages: main, /root)

## Redeploy
```
cd /workspace/saturday-plan-app
V=$(date +%Y%m%d%H%M)
sed -i -E "s/v=[0-9]+/v=$V/g" index.html sw.js app.js
sed -i -E "s/sat-[0-9]+/sat-$V/" sw.js
git add -A
git -c user.name="Dwight Goodwin" -c user.email="dwightgoodwin1963@users.noreply.github.com" commit -m "Plan update $V"
git push origin main
```
Pages rebuilds in ~1 min; check `curl -s https://dwightgoodwin1963.github.io/saturday-plan/plan.json | head`.
