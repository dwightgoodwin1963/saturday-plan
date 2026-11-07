const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let P,K,S;
const save=()=>localStorage.setItem(K,JSON.stringify(S));
const row=i=>`<div class="card ${i.optional?'opt':''}"><span class="t">${esc(i.time)}</span> <b>${esc(i.title)}</b>${i.optional?' <span class="tag">if I\'m up to it</span>':''}${i.detail?`<div class="d">${esc(i.detail)}</div>`:''}</div>`;
const chk=(i,mine)=>{const on=S.checked[i.id];return `<div class="card ${on?'done':''} ${i.optional?'opt':''}"><label><input type="checkbox" data-id="${esc(i.id)}" ${on?'checked':''}><span class="x"><b>${esc(i.text)}</b>${i.optional?' <span class="tag">if I\'m up to it</span>':''}${i.meta?`<div class="d">${esc(i.meta)}</div>`:''}</span>${mine?`<button class="del" data-del="${esc(i.id)}">✕</button>`:''}</label></div>`};
const sec=(h,arr,f,empty)=>(arr=Array.isArray(arr)?arr:[],0)||`<h2>${h}</h2>`+(arr&&arr.length?arr.map(f).join(''):`<div class="card d">${empty}</div>`);
function render(){
 const mine=S.added;
 $('#m').innerHTML=sec('Day at a glance',P.schedule,row,'')+
 sec('To-do',P.todo,i=>chk(i),'Nothing yet')+
 sec('Ward clerk',P.ward,i=>chk(i),'Nothing this week')+
 sec('Optional projects',(P.projects||[]).map(p=>({...p,optional:true})),i=>chk(i),'No projects this week. Take it easy!')+
 `<h2>My added tasks</h2>`+(mine||[]).map(i=>chk(i,true)).join('')+
 `<form id="f"><input id="nt" placeholder="Add a task…" aria-label="New task"><button>Add</button></form><label style="margin:8px 4px;font-size:18px"><input type="checkbox" id="no"> Optional (if I'm up to it)</label>`+
 sec('Sunday',P.sunday,row,'')+sec('Movie choices',P.movies,row,'')+
 sec('Community ideas',P.community,row,'None found')+sec('Grandkids',P.grandkids,row,'No grandkid events found this weekend.');
}
document.addEventListener('change',e=>{const id=e.target.dataset.id;if(id){S.checked[id]=e.target.checked;save();render()}});
document.addEventListener('click',e=>{const d=e.target.dataset.del;if(d){e.preventDefault();S.added=S.added.filter(i=>i.id!==d);delete S.checked[d];save();render()}});
document.addEventListener('submit',e=>{e.preventDefault();const v=$('#nt').value.trim();if(!v)return;S.added.push({id:'u'+Date.now(),text:v,optional:$('#no').checked});save();render()});
fetch('plan.json?v='+Date.now(),{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.json()}).then(p=>{P=p;K='satplan-'+p.date;
 S=JSON.parse(localStorage.getItem(K)||'null')||{checked:{},added:JSON.parse(localStorage.getItem('satplan-carry')||'[]')};
 // carry unfinished added tasks into next week
 addEventListener('pagehide',()=>localStorage.setItem('satplan-carry',JSON.stringify(S.added.filter(i=>!S.checked[i.id]))));
 document.title=p.title;$('#title').textContent=p.title;$('#wx').textContent=p.weather;render()}).catch(e=>{$('#m').innerHTML='<div class="card">Could not load the plan ('+esc(e.message)+'). <button onclick="location.reload()">Try again</button></div>'});
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js?v=202611061810',{scope:'./'}).then(r=>r.update()).catch(()=>{});
