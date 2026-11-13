/* YEN! // HELMET KISHIN // STARLYLANDS */
const STARLY_SKILLS=[
  {id:"starly-hearts-of-fallen",name:"Hearts of Fallen",power:90000000,description:"A fallen constellation strikes the target for 90,000,000 damage.",effect:"attack"},
  {id:"starly-judge-stars-of-fallen",name:"Judge the Stars of Fallen",power:160000000,description:"A storm of bright blue stars rains across both fighters; the target takes 160,000,000 damage.",effect:"attack"},
  {id:"starly-mercy",name:"Mercy",power:0,description:"Choose yourself or your opponent and restore that fighter to full HP.",effect:"mercy"},
  {id:"starly-comet-of-last-light",name:"Comet of Last Light",power:45000000,description:"A burning comet deals 45,000,000 damage.",effect:"attack"},
  {id:"starly-blue-star-deluge",name:"Blue Star Deluge",power:75000000,description:"A rapid blue-star barrage deals 75,000,000 damage.",effect:"attack"},
  {id:"starly-astral-collapse",name:"Astral Collapse",power:120000000,description:"A collapsing constellation deals 120,000,000 damage.",effect:"attack"},
  {id:"starly-fallen-constellation",name:"Fallen Constellation",power:200000000,usesPerBattle:1,description:"StarlyLands' once-per-battle ultimate deals 200,000,000 damage.",effect:"attack"},
  {id:"starly-event-horizon",name:"Event Horizon",power:50000000,description:"A starless gravity well deals 50,000,000 damage.",effect:"attack"}
];

window.YEN_CHOOSE_STARLY_MERCY=function(){
  return new Promise(resolve=>{
    const overlay=document.createElement("div");
    overlay.className="starly-mercy-picker";
    overlay.innerHTML='<div class="starly-picker-panel"><p class="section-kicker">STARLYLANDS // MERCY</p><h2>WHO RECEIVES MERCY?</h2><p>Restore either fighter to full HP.</p><div class="starly-picker-options"><button type="button" data-target="self">MYSELF</button><button type="button" data-target="opponent">MY OPPONENT</button></div><button type="button" class="starly-picker-cancel">CANCEL</button></div>';
    document.body.appendChild(overlay);
    const finish=value=>{overlay.remove();resolve(value);};
    overlay.querySelectorAll("[data-target]").forEach(button=>button.addEventListener("click",()=>finish(button.dataset.target)));
    overlay.querySelector(".starly-picker-cancel").addEventListener("click",()=>finish(null));
  });
};

function showStarlyVfx(message,kind="starfall"){
  const overlay=document.createElement("div");
  overlay.className=`starly-vfx ${kind}`;
  overlay.innerHTML=`<div class="starly-vfx-stars">${Array.from({length:34},(_,index)=>`<i style="--star-x:${(index*37+9)%100}%;--star-delay:${(index%11)*.055}s;--star-duration:${.7+(index%5)*.11}s"></i>`).join("")}</div><div class="starly-vfx-message"></div>`;
  overlay.querySelector(".starly-vfx-message").textContent=message;
  document.body.appendChild(overlay);
  window.setTimeout(()=>overlay.remove(),1900);
  window.showFlash?.();
  window.shake?.();
}
window.YEN_PLAY_STARLY_VFX=showStarlyVfx;

for(const skill of STARLY_SKILLS){
  window.YEN_REGISTER_SKILL({
    ...skill,
    rarity:"KISHIN // FALLEN CONSTELLATION",
    color:"#63caff",
    enchanted:true,
    special:"helmet-kishin",
    imageId:`${skill.id}-image`,
    image:"assets/StarlyLands.png",
    skillHandler:skill.id,
    shopVisible:false
  },async ctx=>{
    if(skill.effect==="mercy"){
      const target=ctx.rivalsEffect
        ?String(ctx.rivalsEffect.mercyTarget||"self")
        :await window.YEN_CHOOSE_STARLY_MERCY();
      if(!target)return {cancelled:true};
      const isSelf=target==="self";
      const maxHp=Number(isSelf
        ?ctx.boss?.playerMaxHP
        :ctx.state?.empress?ctx.boss?.empress?.maxHP:ctx.boss?.maxHP)||0;
      const currentHp=Number(isSelf?ctx.playerHP:ctx.bossHP)||0;
      const healed=Math.max(0,maxHp-currentHp);
      if(!ctx.rivalsEffect){
        if(isSelf){ctx.playerHP=maxHp;ctx.updateHP?.();}
        else{
          const targetMax=Number(ctx.boss?.empress?.maxHP||ctx.boss?.maxHP)||maxHp;
          ctx.bossHP=Math.min(targetMax,Number(ctx.bossHP||0)+healed);
          ctx.updateHP?.();
        }
      }
      showStarlyVfx(`MERCY // ${isSelf?"STARLYLANDS":"THE OPPONENT"} RESTORED TO FULL`,"mercy");
      await ctx.wait(700);
      return {damage:0,healTarget:isSelf?"self":"opponent",healAmount:healed,message:`STARLYLANDS MERCY // ${isSelf?"YOU":"THE OPPONENT"} RESTORED ${ctx.fmt(healed)} HP.`};
    }

    const message=skill.id==="starly-judge-stars-of-fallen"
      ?"JUDGE THE STARS OF FALLEN // BLUE STARS DESCEND ON BOTH FIGHTERS."
      :`${skill.name.toUpperCase()} // THE FALLEN CONSTELLATION STRIKES.`;
    showStarlyVfx(message,skill.id==="starly-judge-stars-of-fallen"?"judgment":"starfall");
    await ctx.wait(900);
    return {damage:skill.power,message:`${skill.name.toUpperCase()} // ${ctx.fmt(skill.power)} DAMAGE.`};
  });
}
