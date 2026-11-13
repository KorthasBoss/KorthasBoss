/* YEN! // HELMET KISHIN // LORD ZEPHYRUS */
window.YEN_REGISTER_SKILL({
  id:"lord-zephyrus-ivory-overlord", name:"Lord Zephyrus, the Ivory Overlord", rarity:"KISHIN // IVORY OVERLORD", color:"#fff3c4", enchanted:true,
  special:"helmet-kishin", imageId:"lord-zephyrus-card", image:"assets/Lord Zephyrus, the Ivory Overlord.png",
  cost:"100000000000000", power:30000000, description:"An absurdly expensive Ivory Overlord attack. The arena is buried beneath a catastrophic ivory storm.",
  bio:"Lord Zephyrus is what happens when a Kishin stops considering mortal HP a meaningful number. His attack is designed for hunters who have more DOX than common sense.",
  shopEffect:"30,000,000 DAMAGE // IVORY OVERLORD EXECUTION",
  shopVisible:false
}, async (ctx) => {
  const wrap=document.createElement("div"); wrap.className="zephyrus-vfx"; wrap.innerHTML='<div class="ivory-crown"></div><div class="ivory-storm"></div><div class="ivory-lance lance-a"></div><div class="ivory-lance lance-b"></div><div class="ivory-lance lance-c"></div><div class="ivory-core"></div>';
  document.body.appendChild(wrap); ctx.setMessage("LORD ZEPHYRUS // THE IVORY OVERLORD DESCENDS."); ctx.showFlash(); ctx.shake(); await ctx.wait(1000); wrap.classList.add("execution"); await ctx.wait(1250); wrap.remove(); return {damage:30000000,message:"LORD ZEPHYRUS // IVORY OVERLORD EXECUTION // 30,000,000 DAMAGE."};
});
