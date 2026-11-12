const express=require('express');
const http=require('http');
const {Server}=require('socket.io');
const path=require('path');
const crypto=require('crypto');
const vm=require('vm');
const fs=require('fs');

const app=express();
const server=http.createServer(app);
const io=new Server(server,{cors:{origin:true}});
const ROOT=__dirname;
app.use(express.static(ROOT));
app.get('/health',(req,res)=>res.json({ok:true,service:'yen-public-rivals'}));

const KISHINS={
 'japanhunter':{hp:1000000000000000},
 'auralis-nyxara':{hp:5000000},
 'fallen-samurai-90k':{hp:9000000},
 'xenith-01-world-weaver':{hp:15000000},
 'lord-zephyrus-ivory-overlord':{hp:30000000},
 'k-z-x':{hp:12000000},
 'jorkaprime':{hp:50000000},
 'henmercy':{hp:30000000},
 'hunter':{hp:5000000}
};

function loadBattleSkills(){
 const window={};
 const sandbox={window};
 const html=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
 const skillFiles=[...html.matchAll(/<script\s+src="(skills\/[^"?]+\.js)(?:\?[^"]*)?"/g)].map(match=>match[1]);
 const registry='skills/registry.js';
 vm.runInNewContext(fs.readFileSync(path.join(ROOT,'bosses/merchant.js'),'utf8'),sandbox,{timeout:1000});
 vm.runInNewContext(fs.readFileSync(path.join(ROOT,registry),'utf8'),sandbox,{timeout:1000});
 for(const file of skillFiles){
  if(file===registry)continue;
  vm.runInNewContext(fs.readFileSync(path.join(ROOT,file),'utf8'),sandbox,{timeout:1000});
 }
 const skills=new Map([...(window.YEN_MERCHANT?.skills||[]),...(window.YEN_SPECIAL_SKILLS||[])]
  .filter(skill=>skill?.id&&Number.isFinite(Number(skill.power))&&Number(skill.power)>=0)
  .map(skill=>[String(skill.id),{
   id:String(skill.id),
   name:String(skill.name||skill.id),
   power:Number(skill.power),
   special:skill.special||"",
   skillHandler:skill.skillHandler||"",
   enchanted:Boolean(skill.enchanted),
   vfxClass:skill.vfxClass||"",
   usesPerBattle:Number(skill.usesPerBattle)||0,
   killEffect:Boolean(skill.killEffect)
  }]));
 const potions=new Map((window.YEN_MERCHANT?.potions||[]).map(potion=>[String(potion.id),{
  id:String(potion.id),name:String(potion.name||potion.id),heal:Math.max(0,Number(potion.heal)||0)
 }]));
 return {skills,potions};
}
const battleCatalog=loadBattleSkills();
const BATTLE_SKILLS=battleCatalog.skills;

const accountSandbox={window:{}};
try{
 vm.runInNewContext(fs.readFileSync(path.join(ROOT,'accounts.js'),'utf8'),accountSandbox,{timeout:1000});
}catch(error){
 console.error('Could not read accounts.js allowlist:',error.message);
}
const accountEntries=Array.isArray(accountSandbox.window.YEN_ACCOUNTS)?accountSandbox.window.YEN_ACCOUNTS:[];
const accountsByName=new Map(accountEntries.map(account=>[String(account.username||'').trim().toLowerCase(),account]));
const knownAccounts=new Set(accountsByName.keys());
const POTIONS=battleCatalog.potions;
function isKnownAccount(name){return knownAccounts.has(String(name||'').trim().toLowerCase());}
function accountFor(name){return accountsByName.get(String(name||'').trim().toLowerCase());}
function playerActions(player){
 const skills=(player.skills||[]).map(id=>{
  const skill=BATTLE_SKILLS.get(id);
  const usesRemaining=skill?.usesPerBattle?Math.max(0,skill.usesPerBattle-Number(player.skillUses?.[id]||0)):null;
  return skill?{...skill,damage:skill.power,usesRemaining,actionId:`skill:${skill.id}`,type:'skill'}:null;
 }).filter(Boolean);
 const custom=(Array.isArray(accountFor(player.username)?.attacks)?accountFor(player.username).attacks:[])
  .map((attack,index)=>{
   const id=String(attack.id||`custom-${index}`);
   const power=Math.max(1,Math.floor(Number(attack.power)||10000));
   return {id,name:String(attack.name||`CUSTOM ATTACK ${index+1}`),power,damage:power,
    rarity:String(attack.rarity||'CUSTOM'),color:String(attack.color||'#ff5573'),
    description:String(attack.description||'A custom account-only attack.'),
    enchanted:Boolean(attack.enchanted),actionId:`attack:${id}`,type:'attack'};
  });
 const potions=Object.entries(player.potions||{}).flatMap(([id,count])=>{
  const potion=POTIONS.get(id),amount=Math.min(Number.MAX_SAFE_INTEGER,Math.max(0,Math.floor(Number(count)||0)));
  return potion&&amount>0?[{...potion,count:amount,actionId:`potion:${id}`,type:'potion'}]:[];
 });
 return [...skills,...custom,...potions];
}

const rooms=new Map();
const socketRoom=new Map();
function code(){
 let value;
 do{value=crypto.randomBytes(3).toString('hex').toUpperCase();}while(rooms.has(value));
 return value;
}
function emitRoom(room){
 io.to(room.code).emit('room:update',{
  code:room.code,
  players:room.players.map(player=>({username:player.username,ready:!!player.kishin}))
 });
}
function cleanName(name){return String(name||'').trim().slice(0,24);}
function leave(socket){
 const currentCode=socketRoom.get(socket.id);
 if(!currentCode)return;
 const room=rooms.get(currentCode);
 socketRoom.delete(socket.id);
 if(!room)return;
 room.players=room.players.filter(player=>player.socketId!==socket.id);
 if(room.players.length===0||room.started){
  rooms.delete(currentCode);
  io.to(currentCode).emit('room:left');
 }else{
  emitRoom(room);
  io.to(currentCode).emit('room:left');
 }
}
function stateOf(room){
 return {
  code:room.code,
  players:room.players.map(player=>({
   username:player.username,
   kishin:player.kishin,
   hp:player.hp,
   maxHp:player.maxHp,
   actions:playerActions(player)
  })),
  turn:room.turn,
  over:room.over,
  lastMove:room.lastMove||null,
  message:room.message||'MATCH LIVE'
 };
}

io.on('connection',socket=>{
 socket.on('room:create',data=>{
  const username=cleanName(data?.username);
  if(!username||!isKnownAccount(username))return socket.emit('room:error','Use an existing username from accounts.js.');
  leave(socket);
  const roomCode=code();
  const room={code:roomCode,players:[{socketId:socket.id,username,kishin:null,skills:[],potions:{},skillUses:{},skipTurns:0}],started:false,turn:null,over:false,actionCount:0};
  rooms.set(roomCode,room);
  socketRoom.set(socket.id,roomCode);
  socket.join(roomCode);
  emitRoom(room);
 });
 socket.on('room:join',data=>{
  const username=cleanName(data?.username);
  const roomCode=String(data?.code||'').trim().toUpperCase();
  const room=rooms.get(roomCode);
  if(!username||!isKnownAccount(username))return socket.emit('room:error','Use an existing username from accounts.js.');
  if(!room||room.started||room.players.length>=2)return socket.emit('room:error','That room code is invalid, full, or already in battle.');
  if(room.players.some(player=>player.username.toLowerCase()===username.toLowerCase()))return socket.emit('room:error','A room needs two different account usernames.');
  leave(socket);
  room.players.push({socketId:socket.id,username,kishin:null,skills:[],potions:{},skillUses:{},skipTurns:0});
  socketRoom.set(socket.id,roomCode);
  socket.join(roomCode);
  emitRoom(room);
 });
 socket.on('room:ready',data=>{
  const roomCode=String(data?.code||'');
  const room=rooms.get(roomCode);
  const player=room?.players.find(entry=>entry.socketId===socket.id);
  const kishin=String(data?.kishin||'');
  if(!room||!player||room.started||!KISHINS[kishin])return socket.emit('room:error','That Kishin is not eligible for Rivals.');
  const skills=[...new Set((Array.isArray(data?.skills)?data.skills:[]).map(String))]
   .filter(id=>BATTLE_SKILLS.has(id));
  const potions=Object.fromEntries(Object.entries(data?.potions||{}).flatMap(([id,count])=>{
   const amount=Math.min(Number.MAX_SAFE_INTEGER,Math.max(0,Math.floor(Number(count)||0)));
   return POTIONS.has(id)&&amount>0?[[id,amount]]:[];
  }));
  player.kishin=kishin;
  player.skills=skills;
  player.potions=potions;
  player.skillUses={};
  if(!playerActions(player).length){
   player.kishin=null;
   player.skills=[];
   player.potions={};
   return socket.emit('room:error','Equip at least one owned skill, custom attack, or healing item before joining a Rivals match.');
  }
  emitRoom(room);
  if(room.players.length===2&&room.players.every(entry=>entry.kishin&&playerActions(entry).length)){
   room.started=true;
   room.players.forEach(entry=>{
    entry.maxHp=KISHINS[entry.kishin].hp;
    entry.hp=entry.maxHp;
   });
   room.turn=room.players[0].username;
   io.to(roomCode).emit('match:countdown',{seconds:4});
   setTimeout(()=>{
    if(!rooms.has(roomCode))return;
    io.to(roomCode).emit('match:start',stateOf(room));
   },4000);
  }
 });
 socket.on('battle:attack',data=>{
  const roomCode=String(data?.code||'');
  const room=rooms.get(roomCode);
  const player=room?.players.find(entry=>entry.socketId===socket.id);
  if(!room||!player||!room.started||room.over||room.turn!==player.username)return;
  const action=playerActions(player).find(entry=>entry.actionId===String(data?.actionId||''));
  if(!action)return;
  const target=room.players.find(entry=>entry!==player);
  const targetHpBefore=target.hp,attackerHpBefore=player.hp;
  const effects={};
  let damage=0,message='';
  if(action.type==='potion'){
   if(player.hp>=player.maxHp)return socket.emit('battle:action-rejected','Your HP is already full.');
   if(!player.potions[action.id])return socket.emit('battle:action-rejected','You do not have that healing item.');
   const healed=Math.min(action.heal,player.maxHp-player.hp);
   player.potions[action.id]--;
   player.hp+=healed;
   effects.heal=healed;
   message=`${player.username} used ${action.name} and restored ${healed.toLocaleString()} HP.`;
  }else{
   const skill=action.type==='skill'?BATTLE_SKILLS.get(action.id):null;
   if(skill?.usesPerBattle){
    const used=Number(player.skillUses[skill.id]||0);
    if(used>=skill.usesPerBattle)return socket.emit('battle:action-rejected',`${skill.name} has no uses remaining.`);
    player.skillUses[skill.id]=used+1;
   }
   damage=action.power;
   if(skill?.id==='deathsringer')damage=Math.max(0,target.hp-1);
   if(skill?.id==='no-saki')damage=Math.max(0,target.hp-200);
   if(skill?.id==='perfect-parry'){
    effects.parryWon=Boolean(data?.parryWon);
    damage=0;
    if(effects.parryWon)target.skipTurns=Math.max(target.skipTurns||0,8);
   }
   if(skill?.id==='henmercy-mercy'){
    effects.heal=player.maxHp-player.hp;
    player.hp=player.maxHp;
    damage=0;
   }
   if(skill?.id==='henmercy-cards-wish'){
    const cardPick=data?.cardPick;
    if(!Number.isInteger(cardPick)||cardPick<0||cardPick>2)return socket.emit('battle:action-rejected','Choose one of the three Cards Wish cards.');
    effects.cardPick=cardPick;
    effects.cardCorrect=Math.floor(Math.random()*3)===cardPick;
    if(effects.cardCorrect)damage=10000000;
    else{
     player.hp=Math.max(0,player.hp-4000000);
     target.skipTurns=Math.max(target.skipTurns||0,2);
     effects.selfDamage=4000000;
     effects.extraTurns=2;
    }
   }
   if(skill?.id==='henmercy-nornos-mask'){
    damage=0;
    target.skipTurns=Math.max(target.skipTurns||0,1);
    effects.skippedTurns=1;
   }
   if(skill?.id==='henmercy-hell-arrived')damage=200000;
   if(skill?.id==='k-z-x'&&Math.random()<0.67){
    effects.heal=Math.min(player.maxHp-player.hp,Math.round(player.maxHp*0.67));
   }
   if(skill?.id==='xenith-01-world-weaver'&&Math.random()<0.45){
    effects.heal=Math.min(player.maxHp-player.hp,650000);
   }
   if(effects.heal>0&&skill?.id!=='henmercy-mercy')player.hp+=effects.heal;
   target.hp=Math.max(0,target.hp-damage);
   message=skill?.id==='perfect-parry'
    ?effects.parryWon?`${player.username} landed a PERFECT PARRY. ${target.username} loses the next 8 turns.`:`${player.username} missed the Perfect Parry timing trial.`
    :skill?.id==='henmercy-cards-wish'
    ?effects.cardCorrect?`${player.username} won Cards Wish. ${target.username} takes 10,000,000 damage.`:`${player.username} lost Cards Wish, takes 4,000,000 damage, and gains two turns.`
    :skill?.id==='henmercy-mercy'
    ?`${player.username} used Mercy and restored ${effects.heal.toLocaleString()} HP.`
    :skill?.id==='henmercy-nornos-mask'
    ?`${player.username} used Nornos Mask. ${target.username}'s next turn is skipped.`
    :skill?.id==='henmercy-hell-arrived'
    ?`${player.username}: "You're hell arriveed.." // 200,000 damage.`
    :`${player.username} used ${action.name} for ${damage.toLocaleString()} damage.${effects.heal?` Restored ${effects.heal.toLocaleString()} HP.`:''}`;
  }
  room.lastMove={actionId:++room.actionCount,username:player.username,moveId:action.actionId,
   skillId:action.type==='skill'?action.id:null,targetHpBefore,attackerHpBefore,effects};
  room.message=message;
  if(player.hp<=0){
   room.over=true;
   io.to(roomCode).emit('match:over',{state:stateOf(room),message:`${target.username} wins the Public Rivals match!`});
   return;
  }
  if(target.hp<=0){
   room.over=true;
   io.to(roomCode).emit('match:over',{state:stateOf(room),message:`${player.username} wins the Public Rivals match!`});
   return;
  }
  if(target.skipTurns>0){
   target.skipTurns--;
   room.turn=player.username;
   room.message+=` ${target.username}'s turn is skipped.`;
  }else room.turn=target.username;
  io.to(roomCode).emit('match:state',stateOf(room));
 });
 socket.on('room:leave',()=>leave(socket));
 socket.on('disconnect',()=>leave(socket));
});

const PORT=process.env.PORT||3000;
server.listen(PORT,'0.0.0.0',()=>console.log(`YEN! Public Rivals listening on ${PORT}`));
