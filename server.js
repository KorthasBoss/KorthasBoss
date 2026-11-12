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
 'auralis-nyxara':{hp:5000000},
 'fallen-samurai-90k':{hp:9000000},
 'xenith-01-world-weaver':{hp:15000000},
 'lord-zephyrus-ivory-overlord':{hp:30000000},
 'k-z-x':{hp:12000000},
 'jorkaprime':{hp:50000000}
};

function loadMerchantSkills(){
 const window={YEN_SPECIAL_SKILLS:[]};
 window.YEN_REGISTER_SKILL=skill=>window.YEN_SPECIAL_SKILLS.push(skill);
 const sandbox={window};
 for(const file of ['bosses/merchant.js','skills/win-can-make-sword.js']){
  vm.runInNewContext(fs.readFileSync(path.join(ROOT,file),'utf8'),sandbox,{timeout:1000});
 }
 const main=window.YEN_MERCHANT?.skills||[];
 const special=window.YEN_SPECIAL_SKILLS.filter(skill=>skill.shopVisible);
 return new Map([...main,...special]
  .filter(skill=>skill?.id&&Number(skill.power)>0&&!skill.rewardOnly)
  .map(skill=>[String(skill.id),{id:String(skill.id),name:String(skill.name),power:Number(skill.power)}]));
}
const MERCHANT_SKILLS=loadMerchantSkills();

const accountSandbox={window:{}};
try{
 vm.runInNewContext(fs.readFileSync(path.join(ROOT,'accounts.js'),'utf8'),accountSandbox,{timeout:1000});
}catch(error){
 console.error('Could not read accounts.js allowlist:',error.message);
}
const knownAccounts=new Set((accountSandbox.window.YEN_ACCOUNTS||[]).map(account=>String(account.username||'').trim().toLowerCase()));
function isKnownAccount(name){return knownAccounts.has(String(name||'').trim().toLowerCase());}

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
   skills:(player.skills||[]).map(id=>{
    const skill=MERCHANT_SKILLS.get(id);
    return {id:skill.id,name:skill.name,damage:skill.power};
   })
  })),
  turn:room.turn,
  over:room.over,
  message:room.message||'MATCH LIVE'
 };
}

io.on('connection',socket=>{
 socket.on('room:create',data=>{
  const username=cleanName(data?.username);
  if(!username||!isKnownAccount(username))return socket.emit('room:error','Use an existing username from accounts.js.');
  leave(socket);
  const roomCode=code();
  const room={code:roomCode,players:[{socketId:socket.id,username,kishin:null,skills:[]}],started:false,turn:null,over:false};
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
  room.players.push({socketId:socket.id,username,kishin:null,skills:[]});
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
   .filter(id=>MERCHANT_SKILLS.has(id));
  if(!skills.length)return socket.emit('room:error','Buy a Merchant-vault skill before joining a Rivals match.');
  player.kishin=kishin;
  player.skills=skills;
  emitRoom(room);
  if(room.players.length===2&&room.players.every(entry=>entry.kishin&&entry.skills.length)){
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
  const moveIndex=Number(data?.move);
  if(!room||!player||!room.started||room.over||room.turn!==player.username)return;
  if(!Number.isInteger(moveIndex)||moveIndex<0||moveIndex>=player.skills.length)return;
  const skill=MERCHANT_SKILLS.get(player.skills[moveIndex]);
  if(!skill)return;
  const target=room.players.find(entry=>entry!==player);
  target.hp=Math.max(0,target.hp-skill.power);
  room.message=`${player.username} used ${skill.name} for ${skill.power.toLocaleString()} damage.`;
  if(target.hp<=0){
   room.over=true;
   io.to(roomCode).emit('match:over',{state:stateOf(room),message:`${player.username} wins the Public Rivals match!`});
   return;
  }
  room.turn=target.username;
  io.to(roomCode).emit('match:state',stateOf(room));
 });
 socket.on('room:leave',()=>leave(socket));
 socket.on('disconnect',()=>leave(socket));
});

const PORT=process.env.PORT||3000;
server.listen(PORT,'0.0.0.0',()=>console.log(`YEN! Public Rivals listening on ${PORT}`));
