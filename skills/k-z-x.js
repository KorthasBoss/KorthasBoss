/* YEN! // HELMET KISHIN // K,Z,X
   Dedicated script: its VFX, audio, damage and healing never share logic with other Kishins.
*/
window.YEN_REGISTER_SKILL({
  id:"k-z-x",
  name:"K,Z,X",
  rarity:"KISHIN // GLITCH ENTITY",
  color:"#ff35f5",
  enchanted:true,
  special:"k-z-x",
  imageId:"k-z-x-card",
  image:"assets/k-z-x.png",
  cost:"999999999999999999999999999999",
  power:1000000,
  description:"A corrupted Helmet Kishin. Every activation performs a random static-rainbow slash, plays one of K,Z,X's random voice lines, and has a 67% chance to restore 67% of its owner's maximum HP.",
  bio:"A Kishin that looks like a broken signal given a body. Helmet keeps K,Z,X behind an absurd DOX wall because every strike carries a different glitch signature.",
  shopEffect:"1,000,000 DAMAGE // 67% HEAL CHANCE // 67% MAX-HP RESTORE",
  shopVisible:false
}, async (ctx) => {
  const slashVariants=["slash-a","slash-b","slash-c","slash-d"];
  const voiceLines=["assets/kzx-voice-1.mp3","assets/kzx-voice-2.mp3","assets/kzx-voice-3.mp3"];
  const chosenSlash=slashVariants[Math.floor(Math.random()*slashVariants.length)];
  const chosenVoice=voiceLines[Math.floor(Math.random()*voiceLines.length)];

  const wrap=document.createElement("div");
  wrap.className=`kzx-vfx ${chosenSlash}`;
  wrap.innerHTML=`
    <div class="kzx-static"></div>
    <div class="kzx-scanlines"></div>
    <div class="kzx-glitch-rain"></div>
    <div class="kzx-rgb-ring ring-1"></div>
    <div class="kzx-rgb-ring ring-2"></div>
    <div class="kzx-slash-core"></div>
    <div class="kzx-slash-echo echo-1"></div>
    <div class="kzx-slash-echo echo-2"></div>
    <div class="kzx-pixels"></div>`;
  document.body.appendChild(wrap);

  const target=document.querySelector("#battle-boss");
  if(target){
    const r=target.getBoundingClientRect();
    wrap.style.setProperty("--tx",`${r.left+r.width/2}px`);
    wrap.style.setProperty("--ty",`${r.top+r.height*.42}px`);
  }

  ctx.setMessage("K,Z,X // SIGNAL CORRUPTION // EXECUTE.");
  ctx.showFlash();
  ctx.shake();

  try {
    const audio=new Audio(chosenVoice);
    audio.volume=.82;
    audio.play().catch(()=>{});
  } catch {}

  await ctx.wait(620);
  wrap.classList.add("hit");
  await ctx.wait(520);

  let healed=false;
  if(Math.random()<0.67){
    const maxHP=Number(ctx.boss?.playerMaxHP||2500000);
    const heal=Math.round(maxHP*0.67);
    ctx.playerHP=Math.min(maxHP,ctx.playerHP+heal);
    ctx.updateHP();
    healed=true;
  }

  await ctx.wait(500);
  wrap.remove();

  return {
    damage:1000000,
    message:healed
      ? "K,Z,X // STATIC RAINBOW SLASH // 1,000,000 DAMAGE // OWNER RESTORED BY 67% MAX HP."
      : "K,Z,X // STATIC RAINBOW SLASH // 1,000,000 DAMAGE."
  };
});
