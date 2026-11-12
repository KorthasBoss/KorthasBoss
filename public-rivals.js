(()=>{
 const $=id=>document.getElementById(id);
 let socket=null,room=null,selected=null,me=null,game=null,lastEffectAction=null;
 const stats={
  "auralis-nyxara":{hp:5000000},
  "fallen-samurai-90k":{hp:9000000},
  "xenith-01-world-weaver":{hp:15000000},
  "lord-zephyrus-ivory-overlord":{hp:30000000},
  "k-z-x":{hp:12000000},
  "jorkaprime":{hp:50000000},
  "hunter":{hp:5000000}
 };
 const defaultTarget={id:"hunter",name:"HUNTER",image:"assets/menu-idle.png"};
 const getTargets=()=>Array.isArray(window.YEN_HELMET?.targets)?window.YEN_HELMET.targets:[];
 const configuredSkills=()=>{
  const main=Array.isArray(window.YEN_MERCHANT?.skills)?window.YEN_MERCHANT.skills:[];
  const special=Array.isArray(window.YEN_SPECIAL_SKILLS)?window.YEN_SPECIAL_SKILLS:[];
  return [...new Map([...main,...special].filter(s=>s?.id).map(skill=>[String(skill.id),skill])).values()];
 };
 const owns=value=>(account?.ownedSkills||[]).some(v=>String(v)===String(value.id)||String(v).trim().toLowerCase()===String(value.name).trim().toLowerCase());
 const ownedTargets=()=>{
  const targets=getTargets().filter(t=>(account?.ownedSkills||[]).map(String).includes(String(t.id))&&stats[t.id]);
  return targets.length?targets:[defaultTarget];
 };
 const ownedBattleSkills=()=>configuredSkills().filter(owns);
 function show(id){document.querySelectorAll('.portal-screen,.portal-subscreen,main > .battle-screen').forEach(x=>x.classList.add('hidden'));$(id)?.classList.remove('hidden');}
 function connect(){
  if(socket?.connected)return;
  socket=io();
  socket.on('room:update',renderRoom);
  socket.on('match:countdown',d=>{$('rivals-status').textContent=`MATCH STARTING IN ${d.seconds} SECONDS...`;});
  socket.on('match:start',startMatch);
  socket.on('match:state',renderMatch);
  socket.on('match:over',d=>{renderMatch(d.state);$('rivals-battle-status').textContent=d.message;$('rivals-turn-status').textContent=d.message;$('rivals-attack-buttons').querySelectorAll('button').forEach(b=>b.disabled=true);});
  socket.on('room:error',m=>alert(m));
  socket.on('room:left',()=>{
   room=null;selected=null;game=null;lastEffectAction=null;
   $('public-rivals-screen').classList.remove('rivals-in-match');
   show('public-rivals-screen');
   $('rivals-waiting').classList.add('hidden');
   $('rivals-battle').classList.add('hidden');
   $('rivals-entry').classList.remove('hidden');
  });
 }
 function open(){
  if(!account){show('auth-screen');return;}
  connect();me=account.username;
  show('public-rivals-screen');
  $('public-rivals-screen').classList.remove('rivals-in-match');
  $('rivals-entry').classList.remove('hidden');
  $('rivals-waiting').classList.add('hidden');
  $('rivals-battle').classList.add('hidden');
 }
 function renderRoom(r){
  room=r;
  $('rivals-entry').classList.add('hidden');
  $('rivals-waiting').classList.remove('hidden');
  $('rivals-battle').classList.add('hidden');
  $('rivals-room-code').textContent=r.code;
  $('rivals-status').textContent=r.players.length<2?'Waiting for another hunter to join...':'Both hunters connected. Choose your Kishin and owned skills.';
  $('rivals-player-list').innerHTML=r.players.map(p=>`<span class="rivals-player-chip">${esc(p.username)} ${p.ready?'✓ READY':'// CONNECTED'}</span>`).join('');
  renderKishins();
 }
 function renderKishins(){
  const grid=$('rivals-kishin-grid');
  grid.innerHTML='';
  const targets=ownedTargets();
  if(!targets.length){
   grid.innerHTML='<p class="rivals-muted">No eligible Helmet Kishins are owned by this account yet.</p>';
   $('rivals-ready').disabled=true;
   return;
  }
  const skills=ownedBattleSkills();
  if(!skills.length){
   grid.innerHTML='<p class="rivals-muted">This account has no configured battle skills to use in Rivals.</p>';
   $('rivals-ready').disabled=true;
   return;
  }
  targets.forEach(t=>{
   const b=document.createElement('button');
   b.className='rivals-kishin-option'+(selected===t.id?' selected':'');
   b.innerHTML=`<img src="${esc(t.image)}" alt=""><b>${esc(t.name)}</b><small>${stats[t.id].hp.toLocaleString()} HP // ${skills.length} OWNED SKILL${skills.length===1?'':'S'}</small>`;
   b.onclick=()=>{selected=t.id;renderKishins();};
   grid.appendChild(b);
  });
  $('rivals-ready').disabled=!(selected&&room&&room.players.length===2);
 }
 function renderMatch(g){
  game=g;
  if(!g)return;
  const mine=g.players.find(p=>p.username===me);
  const opp=g.players.find(p=>p.username!==me);
  if(!mine||!opp)return;
  const t1=getTargets().find(t=>t.id===mine.kishin)||defaultTarget;
  const t2=getTargets().find(t=>t.id===opp.kishin)||defaultTarget;
  $('rivals-room-label').textContent=g.code;
  $('rivals-self-image').src=t1?.image||'';
  $('rivals-self-image').alt=t1?.name||mine.kishin;
  $('rivals-self-name').textContent=mine.username;
  $('rivals-self-kishin').textContent=t1?.name||mine.kishin;
  $('rivals-opponent-image').src=t2?.image||'';
  $('rivals-opponent-image').alt=t2?.name||opp.kishin;
  $('rivals-opponent-name').textContent=opp.username;
  $('rivals-opponent-kishin').textContent=t2?.name||opp.kishin;
  $('rivals-self-hp-label').textContent=`${mine.hp.toLocaleString()} / ${mine.maxHp.toLocaleString()} HP`;
  $('rivals-opponent-hp-label').textContent=`${opp.hp.toLocaleString()} / ${opp.maxHp.toLocaleString()} HP`;
  $('rivals-self-hp').style.width=`${Math.max(0,100*mine.hp/mine.maxHp)}%`;
  $('rivals-opponent-hp').style.width=`${Math.max(0,100*opp.hp/opp.maxHp)}%`;
  $('rivals-battle-status').textContent=g.message|| (g.turn===me?'Your turn. Choose an owned skill.':'Waiting for opponent...');
  $('rivals-turn-title').textContent=g.over?'MATCH OVER':g.turn===me?'YOUR TURN':'OPPONENT TURN';
  $('rivals-turn-status').textContent=g.over?'MATCH COMPLETE':g.turn===me?'Choose an owned skill':'Waiting for opponent';
  $('rivals-self-status').textContent=`${mine.hp.toLocaleString()} HP`;
  $('rivals-opponent-status').textContent=`${opp.hp.toLocaleString()} HP`;
  renderAttackButtons(mine.skills||[],g.turn!==me||g.over);
  if(g.lastMove&&g.lastMove.actionId!==lastEffectAction){
   lastEffectAction=g.lastMove.actionId;
   const attacker=g.players.find(player=>player.username===g.lastMove.username);
   const target=g.players.find(player=>player.username!==g.lastMove.username);
   const skill=attacker?.skills.find(owned=>owned.id===g.lastMove.skillId);
   if(skill&&attacker&&target){
    void playSkillVfx(skill,attacker,target,attacker.username===me).catch(error=>{
     console.error(`Could not play ${skill.name} effect:`,error);
     $('rivals-battle-status').textContent=`${skill.name} landed, but its visual effect failed to play.`;
    });
   }
  }
 }
 function renderAttackButtons(skills,disabled){
  const grid=$('rivals-attack-buttons');
  grid.innerHTML='';
  skills.forEach((skill,index)=>{
   const button=document.createElement('button');
   button.className=`attack-button owned-skill ${skill.special==='rainbow-sword'?'rainbow-sword-button':''} ${skill.special==='trident-of-co-op'?'trident-coop-button':''} ${skill.special==='deathsringer'?'deathsringer-button':''} ${skill.special==='helmet-kishin'?`helmet-kishin-button ${skill.id}`:''}`;
   button.textContent=`${skill.name} // ${Number(skill.damage).toLocaleString()} DMG`;
   button.disabled=disabled;
   button.onclick=()=>{
    if(!room||button.disabled)return;
    button.disabled=true;
    socket.emit('battle:attack',{code:room.code,move:index});
   };
   grid.appendChild(button);
  });
  if(!skills.length){
   const empty=document.createElement('p');
   empty.className='rivals-muted';
   empty.textContent='No owned skills are available for this match.';
   grid.appendChild(empty);
  }
 }
 async function playSkillVfx(skill,attacker,rival,isOwner){
  if(!isOwner&&skill.id==='perfect-parry'){
   const effect=document.createElement('div');
   effect.className='perfect-parry-overlay';
   effect.innerHTML='<div class="perfect-parry-card"><div class="perfect-parry-kicker">COUNTER TRIAL // PERFECT PARRY</div><h2>PERFECT PARRY</h2><div class="perfect-parry-bar"><div class="perfect-parry-zone"></div><div class="perfect-parry-cursor"></div></div><p>THE RIVAL ENTERED A PERFECT PARRY TRIAL.</p></div>';
   document.body.appendChild(effect);
   window.setTimeout(()=>effect.remove(),1200);
   window.showFlash?.();
   window.shake?.();
   return;
  }
  const handler=skill.skillHandler&&window.YEN_SKILL_HANDLERS?.[skill.skillHandler];
  const context={
   setMessage:text=>{$('rivals-battle-status').textContent=String(text);},
   showFlash:()=>window.showFlash?.(),
   shake:()=>window.shake?.(),
   wait:milliseconds=>new Promise(resolve=>window.setTimeout(resolve,milliseconds)),
   boss:{name:rival.username,playerMaxHP:attacker.maxHp},
   bossHP:rival.hp,
   playerHP:attacker.hp,
   state:{bossTurnSkip:0},
   updateHP:()=>{},
   fmt:value=>Math.max(0,Math.floor(Number(value)||0)).toLocaleString('en-US')
  };
  if(typeof handler==='function'){
   await handler(context,skill);
   return;
  }
  if(skill.skillHandler)console.warn(`Missing visual handler for ${skill.id}; using its configured effect.`);
  window.playConfiguredSkillVFX?.({source:skill},false);
 }
 function startMatch(g){
  game=g;
  $('rivals-waiting').classList.add('hidden');
  $('rivals-battle').classList.remove('hidden');
  $('public-rivals-screen').classList.add('rivals-in-match');
  renderMatch(g);
 }
 function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
 $('public-rivals-open')?.addEventListener('click',open);
 $('rivals-back')?.addEventListener('click',()=>{if(room)socket.emit('room:leave',{code:room.code});else show('lobby-screen');});
 $('rivals-create')?.addEventListener('click',()=>{connect();socket.emit('room:create',{username:account?.username});});
 $('rivals-join-btn')?.addEventListener('click',()=>{connect();socket.emit('room:join',{username:account?.username,code:$('rivals-code').value.trim().toUpperCase()});});
 $('rivals-ready')?.addEventListener('click',()=>{
  if(selected&&room){
   const skills=ownedBattleSkills().map(skill=>skill.id);
   socket.emit('room:ready',{code:room.code,kishin:selected,skills});
  }
 });
 $('rivals-copy-code')?.addEventListener('click',()=>navigator.clipboard?.writeText(room?.code||''));
 $('rivals-leave')?.addEventListener('click',()=>socket?.emit('room:leave',{code:room?.code}));
 $('rivals-ready').disabled=true;
})();
