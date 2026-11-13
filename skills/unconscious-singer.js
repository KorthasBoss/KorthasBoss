/* YEN! // HELMET KISHIN // UNCONSCIOUS SINGER */
(() => {
  const moves = [
    {id:"singer-guitar-strings",name:"GUITAR STRINGS // CAGED SERENADE",power:4250000,color:"#ff5375",kind:"strings",nonlethal:true,description:"Guitar strings descend from the sky and cage the target's battle UI. Heavy damage, but it always leaves the target at 1 HP."},
    {id:"singer-feedback-howl",name:"FEEDBACK HOWL",power:1450000,color:"#ff7490",kind:"feedback",description:"A shrieking chord sends red soundwaves across the arena."},
    {id:"singer-dissonant-drop",name:"DISSONANT DROP",power:1750000,color:"#ff3d61",kind:"drop",description:"A wall of falling music notes crashes into the target."},
    {id:"singer-bone-rattle",name:"BONE-RATTLE BARRAGE",power:1950000,color:"#e9d8e8",kind:"bones",description:"A rapid percussion line rattles through the target in a burst of bone-white notes."},
    {id:"singer-stolen-tempo",name:"STOLEN TEMPO",power:1300000,color:"#ff5d83",kind:"tempo",skipTurns:1,description:"A stolen beat deals damage and can silence the target's next turn."},
    {id:"singer-phantom-note",name:"PHANTOM NOTE",power:1550000,color:"#d9a8ff",kind:"phantom",description:"An almost-silent note appears behind the target and bursts into sound."},
    {id:"singer-requiem-loop",name:"REQUIEM LOOP",power:2300000,color:"#ff385f",kind:"requiem",description:"A repeating chorus circles the target and strikes from every direction."},
    {id:"singer-curtain-call",name:"CURTAIN CALL // LAST CHORD",power:3000000,color:"#ff9aaf",kind:"curtain",description:"The stage lights snap shut around the target before the final chord lands."}
  ];
  const notes=["♫","♬","♪","♩","♭","♯"];

  function getTargetBounds(){
    const target=window.YEN_GET_BATTLE_TARGET?.();
    const panel=target?.closest?.(".rivals-fighter, .boss-panel")||target;
    const rect=panel?.getBoundingClientRect?.();
    return rect
      ?{left:rect.left,top:rect.top,width:rect.width,height:rect.height}
      :{left:window.innerWidth*.22,top:window.innerHeight*.28,width:window.innerWidth*.56,height:window.innerHeight*.48};
  }

  function showVfx(move){
    const bounds=getTargetBounds();
    const overlay=document.createElement("div");
    overlay.className=`unconscious-singer-vfx singer-${move.kind}`;
    overlay.setAttribute("aria-hidden","true");

    const noteLayer=document.createElement("div");
    noteLayer.className="singer-note-layer";
    for(let i=0;i<12;i++){
      const note=document.createElement("span");
      note.className="singer-note";
      note.textContent=notes[i%notes.length];
      note.style.setProperty("--note-x",`${(i*29+7)%96}%`);
      note.style.setProperty("--note-delay",`${(i%6)*.08}s`);
      noteLayer.appendChild(note);
    }
    overlay.appendChild(noteLayer);

    if(move.kind==="strings"){
      const rain=document.createElement("div");
      rain.className="singer-string-rain";
      for(let i=0;i<13;i++){
        const string=document.createElement("i");
        string.className="singer-string";
        string.style.setProperty("--string-x",`${bounds.left+bounds.width*(i+1)/14}px`);
        string.style.setProperty("--string-delay",`${(i%5)*.07}s`);
        rain.appendChild(string);
      }
      const cage=document.createElement("div");
      cage.className="singer-string-cage";
      cage.style.setProperty("--target-left",`${bounds.left}px`);
      cage.style.setProperty("--target-top",`${bounds.top}px`);
      cage.style.setProperty("--target-width",`${bounds.width}px`);
      cage.style.setProperty("--target-height",`${bounds.height}px`);
      overlay.append(rain,cage);
    }else{
      const impact=document.createElement("div");
      impact.className="singer-impact";
      overlay.appendChild(impact);
    }
    document.body.appendChild(overlay);
    return overlay;
  }

  moves.forEach(move=>window.YEN_REGISTER_SKILL({
    id:move.id,
    name:move.name,
    rarity:"OFF-SALE // UNCONSCIOUS SINGER",
    color:move.color,
    power:move.power,
    enchanted:true,
    special:"helmet-kishin",
    imageId:`${move.id}-image`,
    image:"assets/Unconscious Singer.png",
    skillHandler:move.id,
    shopVisible:false,
    nonlethal:Boolean(move.nonlethal),
    skipTurns:Number(move.skipTurns)||0,
    description:move.description,
    bio:move.description
  },async ctx=>{
    const effect=showVfx(move);
    const sound=new Audio("assets/Alert_sound.mp3");
    sound.volume=.45;
    sound.play().catch(error=>console.warn("Could not play the Unconscious Singer cue:",error));
    ctx.setMessage?.(`UNCONSCIOUS SINGER // ${move.name}`);
    ctx.showFlash?.();
    ctx.shake?.();
    await ctx.wait(2200);
    effect.remove();

    const remainingHP=Math.max(0,Math.floor(Number(ctx.bossHP)||0)-1);
    const damage=move.nonlethal?Math.min(move.power,remainingHP):move.power;
    if(move.skipTurns&&ctx.state){
      ctx.state.bossTurnSkip=Math.max(Number(ctx.state.bossTurnSkip)||0,move.skipTurns);
    }
    const message=move.nonlethal
      ?`${move.name} // ${ctx.fmt(damage)} DAMAGE. THE STRINGS RELEASE AT 1 HP.`
      :`${move.name} // ${ctx.fmt(damage)} DAMAGE.${move.skipTurns?" THE NEXT BEAT IS SILENCED.":""}`;
    return {damage,message};
  }));
})();
