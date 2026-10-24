/* YEN! // SPECIAL SKILL // PERFECT_PARRY */
window.YEN_REGISTER_SKILL({
  id:"perfect-parry",
  name:"PERFECT_PARRY",
  rarity:"SPECIAL // COUNTER",
  color:"#74f7ff",
  enchanted:true,
  special:"perfect-parry",
  cost:0,
  power:0,
  description:"Enter the parry timing trial. Win it and the target loses 8 turns."
}, async (ctx) => {
  const overlay=document.createElement("div");
  overlay.className="perfect-parry-overlay";
  overlay.innerHTML='<div class="perfect-parry-card"><div class="perfect-parry-kicker">COUNTER TRIAL // PERFECT PARRY</div><h2>WAIT FOR THE BREAK</h2><div class="perfect-parry-bar"><div class="perfect-parry-zone"></div><div class="perfect-parry-cursor"></div></div><p>Press <b>SPACE</b> when the cursor enters the cyan zone.</p><div class="perfect-parry-result"></div></div>';
  document.body.appendChild(overlay);
  const cursor=overlay.querySelector(".perfect-parry-cursor"), result=overlay.querySelector(".perfect-parry-result");
  let active=true,won=false,pos=0,dir=1; const start=performance.now(); const speed=.42;
  function frame(){if(!active)return;pos+=dir*speed*16;if(pos>=100){pos=100;dir=-1}if(pos<=0){pos=0;dir=1}cursor.style.left=`${pos}%`;requestAnimationFrame(frame)} requestAnimationFrame(frame);
  const key=e=>{if(e.code!=="Space"||!active)return;e.preventDefault();won=pos>=38&&pos<=62;active=false;window.removeEventListener("keydown",key);result.textContent=won?"PERFECT. // 8 TURNS ERASED":"MISSED. // COUNTER FAILED";result.className=`perfect-parry-result ${won?"success":"fail"}`};
  window.addEventListener("keydown",key);
  await new Promise(resolve=>{const timer=setInterval(()=>{if(!active){clearInterval(timer);resolve();return}if(performance.now()-start>6000){active=false;window.removeEventListener("keydown",key);result.textContent="TOO SLOW. // COUNTER FAILED";result.className="perfect-parry-result fail";clearInterval(timer);resolve()}},50)});
  await ctx.wait(850); overlay.remove();
  if(won){
    try { const a=new Audio("assets/perry.mp3"); a.volume=.9; a.play().catch(()=>{}); } catch {}
    ctx.showFlash();
    ctx.shake();
    ctx.state.bossTurnSkip=Math.max(Number(ctx.state.bossTurnSkip||0),8);return {damage:0,message:"PERFECT_PARRY // TARGET WILL LOSE 8 TURNS."};}
  return {damage:0,message:"PERFECT_PARRY FAILED."};
});
