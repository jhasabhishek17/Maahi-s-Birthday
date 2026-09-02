import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TeddySVG from './components/teddy/TeddySVG'
import { compliments } from './data/compliments'

/* ═══════════════════════════════════════════════════
   🎵 BOLLYWOOD MUSIC LOOP
═══════════════════════════════════════════════════ */
function useBollywoodMusic() {
  const ctxRef = useRef(null); const masterRef = useRef(null)
  const loopRef = useRef(null); const [playing, setPlaying] = useState(false)
  const MELODY = [
    [392,.34],[392,.17],[440,.5],[392,.5],[392,.5],[370,.5],[330,1.0],
    [392,.34],[392,.17],[440,.5],[392,.5],[392,.5],[523,.5],[494,1.0],
    [392,.34],[392,.17],[784,.5],[659,.5],[523,.5],[494,.5],[440,1.0],
    [349,.34],[349,.17],[330,.5],[523,.5],[587,.5],[523,1.2],
  ]
  const MELODY_DUR = MELODY.reduce((s,[,d])=>s+d,0)

  const scheduleNote=(ctx,dest,freq,t,dur)=>{
    const o=ctx.createOscillator(),g=ctx.createGain()
    o.connect(g);g.connect(dest);o.type='sine';o.frequency.value=freq
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.28,t+.04);g.gain.linearRampToValueAtTime(0,t+dur)
    const v=ctx.createOscillator(),vg=ctx.createGain()
    v.frequency.value=5.5;vg.gain.value=4;v.connect(vg);vg.connect(o.frequency)
    v.start(t+.1);v.stop(t+dur);o.start(t);o.stop(t+dur+.02)
  }
  const scheduleKick=(ctx,dest,t)=>{
    const o=ctx.createOscillator(),g=ctx.createGain()
    o.connect(g);g.connect(dest);o.type='sine'
    o.frequency.setValueAtTime(180,t);o.frequency.exponentialRampToValueAtTime(50,t+.12)
    g.gain.setValueAtTime(.5,t);g.gain.exponentialRampToValueAtTime(.001,t+.18)
    o.start(t);o.stop(t+.22)
  }
  const scheduleHH=(ctx,dest,t,v=.1)=>{
    const sr=ctx.sampleRate,buf=ctx.createBuffer(1,sr*.06,sr),d=buf.getChannelData(0)
    for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*(1-i/d.length)
    const src=ctx.createBufferSource();src.buffer=buf
    const f=ctx.createBiquadFilter();f.type='highpass';f.frequency.value=5000
    const g=ctx.createGain();g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+.06)
    src.connect(f);f.connect(g);g.connect(dest);src.start(t);src.stop(t+.08)
  }
  const scheduleTabla=(ctx,dest,t,v=.2)=>{
    const o=ctx.createOscillator(),g=ctx.createGain()
    o.connect(g);g.connect(dest);o.type='triangle'
    o.frequency.setValueAtTime(240,t);o.frequency.exponentialRampToValueAtTime(120,t+.1)
    g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+.14)
    o.start(t);o.stop(t+.18)
  }
  const scheduleCycle=useCallback((ctx,master,startT)=>{
    let t=startT
    for(let rep=0;rep<2;rep++) MELODY.forEach(([fr,du])=>{ scheduleNote(ctx,master,fr,t,du); t+=du })
    const beat=.555,tb=Math.floor(MELODY_DUR*2/beat)
    for(let b=0;b<tb;b++){
      const bt=startT+b*beat,s=b%4
      if(s===0){scheduleKick(ctx,master,bt);scheduleHH(ctx,master,bt+beat*.5,.1)}
      else if(s===1){scheduleTabla(ctx,master,bt,.18);scheduleHH(ctx,master,bt+beat*.5,.08)}
      else if(s===2){scheduleKick(ctx,master,bt);scheduleTabla(ctx,master,bt+beat*.25,.12);scheduleHH(ctx,master,bt+beat*.5,.1)}
      else{scheduleTabla(ctx,master,bt,.15);scheduleHH(ctx,master,bt+beat*.5,.08);scheduleHH(ctx,master,bt+beat*.75,.06)}
    }
    return MELODY_DUR*2
  },[])

  const startLoop=useCallback(()=>{
    if(playing)return
    try{
      const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return
      const ctx=new AC();ctxRef.current=ctx
      const master=ctx.createGain();master.gain.value=.14;master.connect(ctx.destination);masterRef.current=master
      let next=ctx.currentTime+.1
      const loop=()=>{
        if(!ctxRef.current||ctxRef.current.state==='closed')return
        const dur=scheduleCycle(ctxRef.current,masterRef.current,next)
        next+=dur-.2;loopRef.current=setTimeout(loop,(dur-.5)*1000)
      }
      loop();setPlaying(true)
    }catch(e){}
  },[playing,scheduleCycle])

  const stopLoop=useCallback(()=>{
    clearTimeout(loopRef.current);try{ctxRef.current?.close()}catch{}
    ctxRef.current=null;masterRef.current=null;setPlaying(false)
  },[])
  useEffect(()=>()=>{clearTimeout(loopRef.current);try{ctxRef.current?.close()}catch{}},[])
  return {startLoop,stopLoop,playing}
}

/* ═══════════════════════════════════════════════════
   🔊 SOUNDS
═══════════════════════════════════════════════════ */
const playPop=()=>{
  try{
    const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return
    const ctx=new AC(),sr=ctx.sampleRate
    const buf=ctx.createBuffer(1,sr*.2,sr),d=buf.getChannelData(0)
    for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*(1-i/d.length)
    const src=ctx.createBufferSource();src.buffer=buf
    const f=ctx.createBiquadFilter();f.type='bandpass';f.frequency.value=1200;f.Q.value=.6
    const g=ctx.createGain();g.gain.setValueAtTime(1.3,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.18)
    src.connect(f);f.connect(g);g.connect(ctx.destination);src.start();src.stop(ctx.currentTime+.22)
    setTimeout(()=>ctx.close(),600)
  }catch(e){}
}
const playClap=(n=8)=>{
  try{
    const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return
    const ctx=new AC()
    for(let i=0;i<n;i++){
      const t=ctx.currentTime+i*.22,sr=ctx.sampleRate
      const buf=ctx.createBuffer(1,sr*.07,sr),d=buf.getChannelData(0)
      for(let j=0;j<d.length;j++) d[j]=(Math.random()*2-1)*(1-j/d.length)
      const src=ctx.createBufferSource();src.buffer=buf
      const f=ctx.createBiquadFilter();f.type='bandpass';f.frequency.value=1400;f.Q.value=1.2
      const g=ctx.createGain();g.gain.setValueAtTime(.8,t);g.gain.exponentialRampToValueAtTime(.001,t+.07)
      src.connect(f);f.connect(g);g.connect(ctx.destination);src.start(t);src.stop(t+.08)
    }
    setTimeout(()=>ctx.close(),3000)
  }catch(e){}
}
const playBirthdaySong=()=>{
  try{
    const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return
    const ctx=new AC()
    const mel=[[392,.3],[392,.15],[440,.45],[392,.45],[523,.45],[494,.9],[392,.3],[392,.15],[440,.45],[392,.45],[587,.45],[523,.9],[392,.3],[392,.15],[784,.45],[659,.45],[523,.45],[494,.45],[440,.9],[698,.3],[698,.15],[659,.45],[523,.45],[587,.45],[523,.9]]
    let t=ctx.currentTime+.1
    mel.forEach(([fr,du])=>{
      const o=ctx.createOscillator(),g=ctx.createGain()
      o.connect(g);g.connect(ctx.destination);o.type='sine';o.frequency.value=fr
      g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.25,t+.04);g.gain.linearRampToValueAtTime(0,t+du)
      o.start(t);o.stop(t+du);t+=du
    })
    setTimeout(()=>ctx.close(),t*1000+500)
  }catch(e){}
}

/* ═══════════════════════════════════════════════════
   🎊 CONFETTI
═══════════════════════════════════════════════════ */
const boom=async(opts={})=>{
  try{
    const c=(await import('canvas-confetti')).default
    const def={particleCount:200,spread:100,colors:['#c0384a','#ffd700','#f4a0b0','#fff','#e05060','#ff69b4','#9b59b6','#2ecc71'],disableForReducedMotion:true}
    c({...def,origin:{y:.5},...opts})
    setTimeout(()=>c({...def,particleCount:80,origin:{x:.05,y:.6}}),300)
    setTimeout(()=>c({...def,particleCount:80,origin:{x:.95,y:.6}}),500)
    setTimeout(()=>c({...def,particleCount:60,origin:{x:.5,y:.3}}),700)
  }catch(e){}
}

const champagneFoam=async()=>{
  try{
    const c=(await import('canvas-confetti')).default
    playPop()
    // Narrow foam stream shooting upward — champagne style
    for(let i=0;i<12;i++){
      setTimeout(()=>c({
        particleCount:22,angle:90,spread:8+i*3.5,startVelocity:55,
        origin:{x:.5,y:1.0},
        colors:['#ffffff','#fffef0','#f0faff','#e8f4ff','#d8eeff','#fffaf0'],
        shapes:['circle'],gravity:.12,ticks:380,scalar:.48,drift:0,
        disableForReducedMotion:true,
      }),i*110)
    }
    setTimeout(()=>{
      boom({particleCount:350,spread:140})
      playClap(14)
    },1600)
  }catch(e){}
}

/* ═══════════════════════════════════════════════════
   🌸 FLOWER SVGs — 5 types
═══════════════════════════════════════════════════ */
function RoseSVG({s=28}){
  return(
    <svg width={s} height={s} viewBox="0 0 44 44">
      {[0,45,90,135,180,225,270,315].map((a,i)=>{const r=a*Math.PI/180;return<ellipse key={i} cx={22+13*Math.cos(r)} cy={22+13*Math.sin(r)} rx="8" ry="6" fill="#c0384a" opacity=".8" transform={`rotate(${a} ${22+13*Math.cos(r)} ${22+13*Math.sin(r)})`}/>})}
      <circle cx="22" cy="22" r="9" fill="#c0384a"/><circle cx="22" cy="22" r="5" fill="#e05060"/><circle cx="22" cy="22" r="2.5" fill="#ff6070" opacity=".9"/>
      <ellipse cx="35" cy="34" rx="6" ry="3" fill="#2e7d10" opacity=".8" transform="rotate(42 35 34)"/>
      <ellipse cx="10" cy="36" rx="5" ry="3" fill="#2e7d10" opacity=".7" transform="rotate(-35 10 36)"/>
    </svg>
  )
}

function TulipSVG({s=28}){
  const h=Math.round(s*1.2)
  return(
    <svg width={s} height={h} viewBox="0 0 36 44">
      <ellipse cx="18" cy="18" rx="10" ry="14" fill="#ff69b4"/>
      <ellipse cx="10" cy="20" rx="8" ry="12" fill="#ff1493" opacity=".8" transform="rotate(-22 10 20)"/>
      <ellipse cx="26" cy="20" rx="8" ry="12" fill="#ff1493" opacity=".8" transform="rotate(22 26 20)"/>
      <ellipse cx="18" cy="12" rx="5" ry="7" fill="#ff99cc" opacity=".6"/>
      <line x1="18" y1="32" x2="18" y2="44" stroke="#2e7d10" strokeWidth="2.5" strokeLinecap="round"/>
      <ellipse cx="11" cy="39" rx="7" ry="3" fill="#2e7d10" opacity=".8" transform="rotate(-38 11 39)"/>
    </svg>
  )
}

function SunflowerSVG({s=28}){
  return(
    <svg width={s} height={s} viewBox="0 0 44 44">
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((a,i)=>{const r=a*Math.PI/180;return<ellipse key={i} cx={22+15*Math.cos(r)} cy={22+15*Math.sin(r)} rx="6" ry="4" fill="#ffd700" opacity=".92" transform={`rotate(${a} ${22+15*Math.cos(r)} ${22+15*Math.sin(r)})`}/>})}
      {[15,75,135,195,255,315].map((a,i)=>{const r=a*Math.PI/180;return<ellipse key={i} cx={22+13*Math.cos(r)} cy={22+13*Math.sin(r)} rx="5" ry="3.5" fill="#ffec44" opacity=".7" transform={`rotate(${a} ${22+13*Math.cos(r)} ${22+13*Math.sin(r)})`}/>})}
      <circle cx="22" cy="22" r="9" fill="#6b3a00"/><circle cx="22" cy="22" r="6" fill="#8b4a10"/>
      {[0,45,90,135,180,225,270,315].map((a,i)=>{const r=a*Math.PI/180;return<circle key={i} cx={22+3.5*Math.cos(r)} cy={22+3.5*Math.sin(r)} r="1.3" fill="#ffd700" opacity=".7"/>})}
    </svg>
  )
}

function DaisySVG({s=28}){
  return(
    <svg width={s} height={s} viewBox="0 0 44 44">
      {[0,36,72,108,144,180,216,252,288,324].map((a,i)=>{const r=a*Math.PI/180;return<ellipse key={i} cx={22+14*Math.cos(r)} cy={22+14*Math.sin(r)} rx="5.5" ry="3.5" fill={i%2===0?'#ffffff':'#ffe0ec'} opacity=".96" transform={`rotate(${a} ${22+14*Math.cos(r)} ${22+14*Math.sin(r)})`}/>})}
      <circle cx="22" cy="22" r="8" fill="#ffd700"/><circle cx="22" cy="22" r="5" fill="#ffb300"/>
      <circle cx="20" cy="20" r="1.5" fill="#fff" opacity=".6"/>
    </svg>
  )
}

function MarigoldSVG({s=28}){
  return(
    <svg width={s} height={s} viewBox="0 0 44 44">
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((a,i)=>{const r=a*Math.PI/180;return<ellipse key={i} cx={22+14*Math.cos(r)} cy={22+14*Math.sin(r)} rx="6.5" ry="4" fill="#ff8c00" opacity=".9" transform={`rotate(${a} ${22+14*Math.cos(r)} ${22+14*Math.sin(r)})`}/>})}
      {[15,75,135,195,255,315].map((a,i)=>{const r=a*Math.PI/180;return<ellipse key={i} cx={22+9*Math.cos(r)} cy={22+9*Math.sin(r)} rx="5" ry="3.5" fill="#ffa500" opacity=".85" transform={`rotate(${a} ${22+9*Math.cos(r)} ${22+9*Math.sin(r)})`}/>})}
      <circle cx="22" cy="22" r="7" fill="#e65c00"/><circle cx="22" cy="22" r="4" fill="#cc3d00"/>
      <circle cx="20" cy="21" r="1.2" fill="#ff9900" opacity=".7"/>
    </svg>
  )
}

// 20 flowers — 4 of each type, varied sizes
const FLOWER_CFG=[
  {c:'r1',t:'rose',s:34},{c:'r2',t:'tulip',s:28},{c:'r3',t:'sunflower',s:32},{c:'r4',t:'daisy',s:26},{c:'r5',t:'marigold',s:30},
  {c:'r6',t:'rose',s:24},{c:'r7',t:'tulip',s:36},{c:'r8',t:'sunflower',s:28},{c:'r9',t:'daisy',s:30},{c:'r10',t:'marigold',s:32},
  {c:'r11',t:'rose',s:30},{c:'r12',t:'tulip',s:26},{c:'r13',t:'sunflower',s:34},{c:'r14',t:'daisy',s:28},{c:'r15',t:'marigold',s:36},
  {c:'r16',t:'rose',s:28},{c:'r17',t:'tulip',s:32},{c:'r18',t:'sunflower',s:26},{c:'r19',t:'daisy',s:34},{c:'r20',t:'marigold',s:28},
]

function FlowerEl({t,s}){
  if(t==='rose')      return<RoseSVG s={s}/>
  if(t==='tulip')     return<TulipSVG s={s}/>
  if(t==='sunflower') return<SunflowerSVG s={s}/>
  if(t==='daisy')     return<DaisySVG s={s}/>
  if(t==='marigold')  return<MarigoldSVG s={s}/>
  return null
}

function FloatingFlowers(){
  return(
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {FLOWER_CFG.map(({c,t,s},i)=><div key={i} className={`rose-fall ${c}`}><FlowerEl t={t} s={s}/></div>)}
    </div>
  )
}

function PaperConfetti(){
  return(
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {Array.from({length:12},(_,i)=><div key={i} className={`paper p${i+1}`}/>)}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   💡 CLUB LIGHTS
═══════════════════════════════════════════════════ */
function ClubLights(){
  return(
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <div style={{position:'absolute',top:0,left:0,width:'55%',height:'100vh',background:'linear-gradient(145deg,rgba(192,56,74,.09) 0%,transparent 55%)',animation:'scan1 4s ease-in-out infinite',transformOrigin:'top left'}}/>
      <div style={{position:'absolute',top:0,right:0,width:'55%',height:'100vh',background:'linear-gradient(215deg,rgba(255,215,0,.07) 0%,transparent 55%)',animation:'scan2 3.5s ease-in-out infinite',transformOrigin:'top right'}}/>
      <div style={{position:'absolute',top:0,left:'28%',width:'44%',height:'100vh',background:'linear-gradient(180deg,rgba(155,89,182,.06) 0%,transparent 45%)',animation:'scan3 5s ease-in-out infinite',transformOrigin:'top center'}}/>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   🕺 PARTY SCENE — Fixed layout, no overlaps
═══════════════════════════════════════════════════ */
function PartyScene(){
  // All characters clearly spaced: Adults far left, Kids center-left, Guitarist center, Adults right, Table far right
  const DL = [
    // Disco light dots scattered on floor
    {x:80,y:395,r:20,color:'rgba(192,56,74,0.35)',d:.9},
    {x:200,y:390,r:15,color:'rgba(255,215,0,0.3)',d:1.3},
    {x:330,y:398,r:18,color:'rgba(155,89,182,0.3)',d:.7},
    {x:470,y:392,r:22,color:'rgba(52,152,219,0.3)',d:1.1},
    {x:600,y:396,r:16,color:'rgba(46,204,113,0.28)',d:.85},
    {x:730,y:391,r:20,color:'rgba(192,56,74,0.3)',d:1.4},
    {x:860,y:394,r:18,color:'rgba(255,215,0,0.28)',d:.95},
  ]
  return(
    <div style={{width:'100%',maxWidth:980,margin:'0 auto'}}>
      <svg viewBox="0 0 980 430" width="100%" xmlns="http://www.w3.org/2000/svg">

        {/* ── FLOOR (checkerboard) ── */}
        {Array.from({length:25},(_,col)=>Array.from({length:3},(_,row)=>(
          <rect key={`${col}-${row}`} x={col*40} y={380+row*14} width={40} height={14}
            fill={(col+row)%2===0?'rgba(192,56,74,.22)':'rgba(255,215,0,.1)'}
            style={{animation:`floorPulse ${1.5+row*.3}s ease-in-out ${col*.08}s infinite`}}/>
        )))}

        {/* Floor disco light spots */}
        {DL.map((dl,i)=>(
          <ellipse key={i} cx={dl.x} cy={dl.y} rx={dl.r} ry={dl.r*.4}
            fill={dl.color} style={{animation:`floorPulse ${dl.d+.5}s ease-in-out ${i*.2}s infinite`}}/>
        ))}

        {/* ── 🪩 DISCO BALL (top center) ── */}
        <g transform="translate(490,62)">
          <line x1="0" y1="-62" x2="0" y2="-25" stroke="#888" strokeWidth="1.5" opacity=".7"/>
          <circle cx="0" cy="0" r="30" fill="#c0c0c0" opacity=".9"/>
          <g style={{animation:'discoBallSpin 3s linear infinite',transformOrigin:'0px 0px'}}>
            {Array.from({length:24},(_,i)=>{const a=i*15,r=a*Math.PI/180,d=23;return(
              <rect key={i} x={d*Math.cos(r)-4} y={d*Math.sin(r)-4} width="8" height="8"
                fill={['white','#f4a0b0','#ffd700','#aae','#afa','#fca'][i%6]}
                opacity=".9" rx="1.5" transform={`rotate(${a} ${d*Math.cos(r)} ${d*Math.sin(r)})`}/>
            )})}
          </g>
          <circle cx="0" cy="0" r="30" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="1.5"/>
          <circle cx="-9" cy="-11" r="7" fill="white" opacity=".3"/>
          {/* Rotating colored light beams */}
          {[0,60,120,180,240,300].map((a,i)=>(
            <ellipse key={i} cx={0} cy={0} rx="3.5" ry="2.5"
              fill={['#c0384a','#ffd700','#f4a0b0','#9b59b6','#3498db','#2ecc71'][i]}
              opacity=".85"
              style={{animation:`discoLight ${2+i*.25}s linear infinite`,transformOrigin:'0px 0px'}}
              transform={`rotate(${a}) translate(100,0)`}/>
          ))}
        </g>

        {/* ── ADULT DANCER 1 (x=70) ── */}
        <g transform="translate(70,215)" style={{animation:'dance1 .5s ease-in-out infinite alternate'}}>
          <rect x="-16" y="0" width="32" height="46" rx="10" fill="#c0384a"/>
          <circle cx="0" cy="-22" r="20" fill="#f4c4a0"/>
          <ellipse cx="0" cy="-38" rx="20" ry="11" fill="#1a0a04"/>
          <ellipse cx="-14" cy="-28" rx="8" ry="14" fill="#1a0a04"/>
          <ellipse cx="14" cy="-28" rx="8" ry="14" fill="#1a0a04"/>
          <circle cx="-6" cy="-23" r="3" fill="#1a0a04"/><circle cx="6" cy="-23" r="3" fill="#1a0a04"/>
          <path d="M -6 -12 Q 0 -6 6 -12" stroke="#c0384a" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <line x1="-16" y1="8" x2="-40" y2="-15" stroke="#f4c4a0" strokeWidth="10" strokeLinecap="round"/>
          <line x1="16" y1="12" x2="40" y2="22" stroke="#f4c4a0" strokeWidth="10" strokeLinecap="round"/>
          <line x1="-8" y1="46" x2="-15" y2="82" stroke="#3a3a5c" strokeWidth="12" strokeLinecap="round"/>
          <line x1="8" y1="46" x2="18" y2="80" stroke="#2d2d4a" strokeWidth="12" strokeLinecap="round"/>
        </g>

        {/* ── ADULT DANCER 2 (x=155) ── */}
        <g transform="translate(155,208)" style={{animation:'dance2 .6s ease-in-out infinite alternate'}}>
          <rect x="-15" y="0" width="30" height="44" rx="10" fill="#9b59b6"/>
          <circle cx="0" cy="-21" r="19" fill="#e8b090"/>
          <ellipse cx="0" cy="-36" rx="19" ry="10" fill="#5a2d0a"/>
          <ellipse cx="-13" cy="-27" rx="7" ry="13" fill="#5a2d0a"/>
          <ellipse cx="13" cy="-27" rx="7" ry="13" fill="#5a2d0a"/>
          <circle cx="-6" cy="-22" r="2.8" fill="#1a0a04"/><circle cx="6" cy="-22" r="2.8" fill="#1a0a04"/>
          <path d="M -5 -12 Q 0 -6 5 -12" stroke="#c0384a" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <circle cx="-19" cy="-22" r="3" fill="#ffd700"/>
          <line x1="-15" y1="6" x2="-36" y2="-6" stroke="#e8b090" strokeWidth="10" strokeLinecap="round"/>
          <line x1="15" y1="6" x2="38" y2="-12" stroke="#e8b090" strokeWidth="10" strokeLinecap="round"/>
          <path d="M -20 44 Q -24 80 -14 82 L 14 82 Q 24 80 20 44" fill="#9b59b6"/>
          <line x1="-10" y1="82" x2="-10" y2="108" stroke="#c0384a" strokeWidth="8" strokeLinecap="round"/>
          <line x1="10" y1="82" x2="14" y2="106" stroke="#a02030" strokeWidth="8" strokeLinecap="round"/>
        </g>

        {/* ── KIDS ZONE (260-370) — drawn AFTER adults so they appear on top ── */}

        {/* KID 1 — bright yellow, x=270 */}
        <g transform="translate(270,245)" style={{animation:'danceKid .4s ease-in-out infinite alternate'}}>
          {/* Outfit */}
          <rect x="-13" y="0" width="26" height="36" rx="8" fill="#ffd700"/>
          {/* Head */}
          <circle cx="0" cy="-16" r="16" fill="#f4c4a0"/>
          {/* Hair */}
          <ellipse cx="0" cy="-29" rx="15" ry="8" fill="#1a0a04"/>
          <ellipse cx="-13" cy="-23" rx="6" ry="11" fill="#1a0a04"/>
          <ellipse cx="13" cy="-23" rx="6" ry="11" fill="#1a0a04"/>
          {/* Face */}
          <circle cx="-5" cy="-17" r="2.5" fill="#1a0a04"/>
          <circle cx="5" cy="-17" r="2.5" fill="#1a0a04"/>
          <path d="M -4 -10 Q 0 -6 4 -10" stroke="#c0384a" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
          <ellipse cx="-9" cy="-12" rx="5" ry="3" fill="#e8a0a0" opacity=".45"/>
          <ellipse cx="9" cy="-12" rx="5" ry="3" fill="#e8a0a0" opacity=".45"/>
          {/* Arms raised high */}
          <line x1="-13" y1="6" x2="-32" y2="-12" stroke="#f4c4a0" strokeWidth="8" strokeLinecap="round"/>
          <line x1="13" y1="6" x2="32" y2="-12" stroke="#f4c4a0" strokeWidth="8" strokeLinecap="round"/>
          {/* Legs */}
          <line x1="-6" y1="36" x2="-10" y2="62" stroke="#ffd700" strokeWidth="9" strokeLinecap="round"/>
          <line x1="6" y1="36" x2="12" y2="60" stroke="#e8c000" strokeWidth="9" strokeLinecap="round"/>
          {/* Shoes */}
          <ellipse cx="-10" cy="64" rx="7" ry="4" fill="#c0384a"/>
          <ellipse cx="13" cy="62" rx="7" ry="4" fill="#c0384a"/>
          {/* "KID" label */}
          <rect x="-20" y="70" width="40" height="14" rx="7" fill="rgba(255,215,0,0.85)"/>
          <text x="0" y="81" textAnchor="middle" fontSize="8" fontFamily="Poppins,sans-serif" fill="#1a0508" fontWeight="700">Baccha 🧒</text>
        </g>

        {/* KID 2 — bright cyan/green, x=355 */}
        <g transform="translate(355,240)" style={{animation:'danceKid .45s ease-in-out .2s infinite alternate'}}>
          <rect x="-12" y="0" width="24" height="34" rx="7" fill="#00c87a"/>
          <circle cx="0" cy="-15" r="15" fill="#e8b090"/>
          <ellipse cx="0" cy="-27" rx="14" ry="8" fill="#2d1208"/>
          <ellipse cx="-12" cy="-21" rx="5.5" ry="10" fill="#2d1208"/>
          <ellipse cx="12" cy="-21" rx="5.5" ry="10" fill="#2d1208"/>
          <circle cx="-4.5" cy="-16" r="2.2" fill="#1a0a04"/><circle cx="4.5" cy="-16" r="2.2" fill="#1a0a04"/>
          <path d="M -3.5 -9 Q 0 -5 3.5 -9" stroke="#c0384a" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
          <ellipse cx="-9" cy="-11" rx="4.5" ry="3" fill="#e8a0a0" opacity=".5"/>
          <ellipse cx="9" cy="-11" rx="4.5" ry="3" fill="#e8a0a0" opacity=".5"/>
          {/* Arms one up one side */}
          <line x1="-12" y1="5" x2="-30" y2="-16" stroke="#e8b090" strokeWidth="7.5" strokeLinecap="round"/>
          <line x1="12" y1="5" x2="28" y2="10" stroke="#e8b090" strokeWidth="7.5" strokeLinecap="round"/>
          {/* Legs */}
          <line x1="-5" y1="34" x2="-9" y2="58" stroke="#00c87a" strokeWidth="8" strokeLinecap="round"/>
          <line x1="5" y1="34" x2="11" y2="56" stroke="#009a5e" strokeWidth="8" strokeLinecap="round"/>
          <ellipse cx="-9" cy="60" rx="7" ry="4" fill="#007a4a"/>
          <ellipse cx="12" cy="58" rx="7" ry="4" fill="#007a4a"/>
          <rect x="-22" y="66" width="44" height="14" rx="7" fill="rgba(0,200,122,0.85)"/>
          <text x="0" y="77" textAnchor="middle" fontSize="8" fontFamily="Poppins,sans-serif" fill="#fff" fontWeight="700">Bacchi 👧</text>
        </g>

        {/* ── 🎸 GUITARIST (x=490) ── */}
        <g transform="translate(490,195)">
          {/* Stool */}
          <ellipse cx="0" cy="108" rx="24" ry="9" fill="#6b3520"/>
          <line x1="-17" y1="108" x2="-17" y2="155" stroke="#6b3520" strokeWidth="6" strokeLinecap="round"/>
          <line x1="17" y1="108" x2="17" y2="155" stroke="#6b3520" strokeWidth="6" strokeLinecap="round"/>
          {/* Body */}
          <rect x="-20" y="22" width="40" height="86" rx="12" fill="#1e3a6e"/>
          {/* Head */}
          <circle cx="0" cy="0" r="24" fill="#f4c4a0"/>
          {/* Spiky musician hair */}
          <ellipse cx="0" cy="-20" rx="22" ry="12" fill="#1a0a04"/>
          {[-15,-7,0,7,15].map((x,i)=><path key={i} d={`M ${x} -28 Q ${x+3} -44 ${x} -36`} stroke="#1a0a04" strokeWidth="5" fill="none" strokeLinecap="round"/>)}
          <circle cx="-7" cy="2" r="3.5" fill="#1a0a04"/><circle cx="7" cy="2" r="3.5" fill="#1a0a04"/>
          <circle cx="-5.5" cy="1" r="1.2" fill="white" opacity=".7"/><circle cx="8.5" cy="1" r="1.2" fill="white" opacity=".7"/>
          <path d="M -6 13 Q 0 19 6 13" stroke="#c0384a" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
          <ellipse cx="-14" cy="8" rx="6" ry="4" fill="#e8a0a0" opacity=".4"/>
          <ellipse cx="14" cy="8" rx="6" ry="4" fill="#e8a0a0" opacity=".4"/>
          {/* Guitar */}
          <g style={{animation:'guitarStrum .32s ease-in-out infinite alternate',transformOrigin:'0px 65px'}}>
            <rect x="3" y="26" width="10" height="78" rx="5" fill="#c8935a"/>
            {[36,49,62,75].map(y=><rect key={y} x="2" y={y} width="12" height="2" rx="1" fill="#8b5c28"/>)}
            {[30,40,50].map(y=>[1,15].map(x=><circle key={`${y}-${x}`} cx={x} cy={y} r="4" fill="#a07040"/>))}
            <ellipse cx="8" cy="122" rx="33" ry="36" fill="#8b5e3c"/>
            <ellipse cx="8" cy="122" rx="26" ry="28" fill="#a07040"/>
            <circle cx="8" cy="119" r="13" fill="#3a1a08"/>
            {[-3,-1,1,3,5,7].map((o,i)=><line key={i} x1={8+o} y1="98" x2={8+o} y2="150" stroke="#ffd700" strokeWidth=".8" opacity=".8"/>)}
            <rect x="-17" y="147" width="50" height="6" rx="3" fill="#6b4226"/>
          </g>
          <line x1="-20" y1="42" x2="5" y2="58" stroke="#f4c4a0" strokeWidth="11" strokeLinecap="round"/>
          <line x1="20" y1="52" x2="18" y2="112" stroke="#f4c4a0" strokeWidth="11" strokeLinecap="round"/>
          <line x1="-10" y1="108" x2="-16" y2="155" stroke="#1e3a6e" strokeWidth="14" strokeLinecap="round"/>
          <line x1="10" y1="108" x2="20" y2="153" stroke="#1e3a6e" strokeWidth="14" strokeLinecap="round"/>
          {/* Floating notes */}
          {['♪','♫','♬','♩','𝄞'].map((n,i)=>(
            <motion.text key={i} x={32+i*18} y={-12} initial={{opacity:0,y:0}} animate={{opacity:[0,1,0],y:-55}}
              transition={{delay:i*.6,duration:2.5,repeat:Infinity,repeatDelay:.4}}
              fontSize="18" fill="#ffd700" opacity=".9">{n}</motion.text>
          ))}
          {/* GUITARIST label */}
          <rect x="-40" y="165" width="80" height="16" rx="8" fill="rgba(30,58,110,0.88)"/>
          <text x="0" y="177" textAnchor="middle" fontSize="10" fontFamily="Poppins,sans-serif" fill="#a0c0ff" fontWeight="700">🎸 Guitarist</text>
        </g>

        {/* ── ADULT DANCER 3 (x=640) ── */}
        <g transform="translate(640,212)" style={{animation:'dance3 .55s ease-in-out infinite alternate'}}>
          <rect x="-15" y="0" width="30" height="44" rx="10" fill="#2ecc71"/>
          <circle cx="0" cy="-21" r="19" fill="#f0c8a0"/>
          <ellipse cx="0" cy="-36" rx="19" ry="10" fill="#3a1a0a"/>
          <ellipse cx="-13" cy="-27" rx="7" ry="12" fill="#3a1a0a"/>
          <ellipse cx="13" cy="-27" rx="7" ry="12" fill="#3a1a0a"/>
          <circle cx="-6" cy="-22" r="3" fill="#1a0a04"/><circle cx="6" cy="-22" r="3" fill="#1a0a04"/>
          <path d="M -5 -12 Q 0 -6 5 -12" stroke="#c0384a" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <line x1="-15" y1="8" x2="-37" y2="-12" stroke="#f0c8a0" strokeWidth="10" strokeLinecap="round"/>
          <line x1="15" y1="8" x2="38" y2="-8" stroke="#f0c8a0" strokeWidth="10" strokeLinecap="round"/>
          <line x1="-8" y1="44" x2="-14" y2="82" stroke="#1e3a1e" strokeWidth="12" strokeLinecap="round"/>
          <line x1="8" y1="44" x2="18" y2="80" stroke="#1e3a1e" strokeWidth="12" strokeLinecap="round"/>
        </g>

        {/* ── ADULT DANCER 4 (x=725) ── */}
        <g transform="translate(725,208)" style={{animation:'dance4 .5s ease-in-out .25s infinite alternate'}}>
          <rect x="-16" y="0" width="32" height="46" rx="10" fill="#e74c3c"/>
          <circle cx="0" cy="-22" r="20" fill="#e8b090"/>
          <ellipse cx="0" cy="-38" rx="20" ry="10" fill="#5a2d0a"/>
          <circle cx="-7" cy="-23" r="3" fill="#1a0a04"/><circle cx="7" cy="-23" r="3" fill="#1a0a04"/>
          <path d="M -6 -12 Q 0 -6 6 -12" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <line x1="-16" y1="10" x2="-40" y2="5" stroke="#e8b090" strokeWidth="10" strokeLinecap="round"/>
          <line x1="16" y1="10" x2="42" y2="-10" stroke="#e8b090" strokeWidth="10" strokeLinecap="round"/>
          <line x1="-9" y1="46" x2="-16" y2="82" stroke="#8a1a1a" strokeWidth="12" strokeLinecap="round"/>
          <line x1="9" y1="46" x2="20" y2="80" stroke="#8a1a1a" strokeWidth="12" strokeLinecap="round"/>
        </g>

        {/* ── DRINKS TABLE (x=840-970) ── */}
        <g transform="translate(855,235)">
          <rect x="-15" y="120" width="100" height="9" rx="4" fill="#6b3520"/>
          <line x1="0" y1="129" x2="0" y2="175" stroke="#6b3520" strokeWidth="6" strokeLinecap="round"/>
          <line x1="70" y1="129" x2="70" y2="175" stroke="#6b3520" strokeWidth="6" strokeLinecap="round"/>
          {/* Champagne bottle */}
          <rect x="2" y="55" width="18" height="65" rx="5" fill="#2d6e20"/>
          <rect x="5" y="40" width="12" height="18" rx="4" fill="#2d6e20"/>
          <rect x="7" y="36" width="8" height="7" rx="2" fill="#c8935a"/>
          <rect x="4" y="72" width="14" height="22" rx="2" fill="#ffd700" opacity=".85"/>
          <text x="11" y="86" textAnchor="middle" fontSize="6" fill="#2d0a12" fontWeight="bold">PARTY</text>
          {[0,.6,1.2,1.8].map((d,i)=>(
            <motion.circle key={i} cx={11+i%2*4} cy={42} initial={{opacity:0,y:0}} animate={{opacity:[0,.9,0],y:-32}}
              transition={{delay:d,duration:2.2,repeat:Infinity}} r="2.5" fill="rgba(255,255,255,.7)"/>
          ))}
          {/* Glasses */}
          <g transform="translate(28,62)">
            <polygon points="0,0 11,0 8,32 3,32" fill="rgba(200,255,255,.45)" stroke="rgba(255,255,255,.6)" strokeWidth=".8"/>
            <line x1="5.5" y1="32" x2="5.5" y2="48" stroke="rgba(255,255,255,.45)" strokeWidth="1.5"/>
            <ellipse cx="5.5" cy="48" rx="6.5" ry="3" fill="rgba(255,255,255,.25)"/>
            <motion.circle cx="5" cy="27" r="1.5" fill="#ffd700" opacity=".8"
              animate={{y:[-27,-5]}} transition={{duration:1.6,repeat:Infinity,repeatType:'loop'}}/>
          </g>
          <g transform="translate(50,68)">
            <polygon points="0,0 10,0 7,28 3,28" fill="rgba(200,255,255,.4)" stroke="rgba(255,255,255,.6)" strokeWidth=".8"/>
            <line x1="5" y1="28" x2="5" y2="44" stroke="rgba(255,255,255,.4)" strokeWidth="1.5"/>
            <ellipse cx="5" cy="44" rx="6" ry="2.5" fill="rgba(255,255,255,.25)"/>
          </g>
          {/* Mini cake */}
          <rect x="58" y="88" width="32" height="32" rx="6" fill="#6b3520"/>
          <rect x="58" y="88" width="32" height="11" rx="5" fill="#8b4a28"/>
          <rect x="61" y="72" width="26" height="19" rx="5" fill="#c0384a"/>
          <rect x="61" y="72" width="26" height="8" rx="4" fill="#e05060"/>
          <rect x="71" y="60" width="6" height="14" rx="3" fill="#ffd700"/>
          <motion.g animate={{scaleY:[1,1.35,.88,1],scaleX:[1,.8,1.1,1]}} transition={{duration:.7,repeat:Infinity}} style={{transformOrigin:'74px 57px'}}>
            <ellipse cx="74" cy="57" rx="3.5" ry="4.5" fill="#FFA500"/>
            <ellipse cx="74" cy="55" rx="2" ry="3" fill="#FFD700"/>
          </motion.g>
          <text x="74" y="100" textAnchor="middle" fontSize="6" fontFamily="Poppins,sans-serif" fill="#ffd700" fontWeight="bold">Party!</text>
          {/* TABLE LABEL */}
          <rect x="-20" y="182" width="110" height="16" rx="8" fill="rgba(107,53,32,0.85)"/>
          <text x="35" y="194" textAnchor="middle" fontSize="10" fontFamily="Poppins,sans-serif" fill="#ffd700" fontWeight="700">🍾 Party Corner</text>
        </g>

        {/* Party text */}
        <text x="490" y="420" textAnchor="middle" fontSize="11" fontFamily="Poppins,sans-serif" fill="rgba(255,215,0,.5)" fontWeight="600">
          🎉 Dance karo, khao, piyo — Party on! 🎉
        </text>
      </svg>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   🎈 BALLOONS
═══════════════════════════════════════════════════ */
const BC=['#c0384a','#e05060','#ffd700','#f4a0b0','#ff7f50','#9b59b6','#3498db','#ff69b4']
const BM=['🌹 Maahi!','🎉 Party!','🧸 Teddy!','✨ Amazing!','🎂 Cake!','💛 Love!','🌸 Akshuu!','🎊 Yaaay!']
function Balloon({id,color,xRatio,message,onPop}){
  const [popped,setPopped]=useState(false),[msg,setMsg]=useState(false)
  const handle=async()=>{
    if(popped)return;setPopped(true);setMsg(true);playPop()
    try{const c=(await import('canvas-confetti')).default;c({particleCount:60,spread:80,colors:[color,'#ffd700','#fff','#f4a0b0'],origin:{x:xRatio,y:.5},scalar:.9,disableForReducedMotion:true})}catch(e){}
    setTimeout(()=>setMsg(false),1800);setTimeout(()=>onPop(id),2000)
  }
  return(
    <motion.div initial={{scale:0,y:30}} animate={{scale:1,y:[0,-15,0]}} exit={{scale:[1,1.6,0],opacity:[1,1,0],transition:{duration:.3}}}
      transition={{scale:{type:'spring',stiffness:180},y:{duration:2.5+Math.random(),repeat:Infinity,ease:'easeInOut'}}}
      onClick={handle} className="cursor-pointer select-none relative" title="Pop! 🎈">
      <svg width="72" height="95" viewBox="0 0 72 95">
        <ellipse cx="36" cy="36" rx="30" ry="34" fill={color}/>
        <ellipse cx="27" cy="23" rx="9" ry="11" fill="white" opacity=".2"/>
        <path d="M 34 70 Q 36 74 38 70" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M 36 73 Q 31 82 36 90" stroke="#d4a0a8" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      </svg>
      <AnimatePresence>
        {msg&&<motion.div initial={{opacity:0,y:0,scale:.6}} animate={{opacity:1,y:-45,scale:1}} exit={{opacity:0}}
          className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-2xl px-3 py-1.5 text-xs font-bold z-20 pointer-events-none"
          style={{background:'#ffd700',color:'#2d0a12',fontFamily:"'Poppins',sans-serif",top:0}}>
          {message}
        </motion.div>}
      </AnimatePresence>
    </motion.div>
  )
}
function BalloonSection({onAllPopped}){
  const [balloons,setBalloons]=useState(Array.from({length:8},(_,i)=>({id:i,color:BC[i],xRatio:(.1+i*.11),message:BM[i]})))
  const pop=useCallback((id)=>{
    setBalloons(b=>{const next=b.filter(x=>x.id!==id);if(next.length===0){onAllPopped?.();boom()};return next})
  },[onAllPopped])
  return(
    <div className="text-center">
      <div className="flex flex-wrap justify-center items-end gap-4 min-h-[130px]">
        <AnimatePresence>{balloons.map(b=><Balloon key={b.id} {...b} onPop={pop}/>)}</AnimatePresence>
        {balloons.length===0&&<motion.p initial={{scale:0}} animate={{scale:1}} transition={{type:'spring'}}
          style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.4rem',color:'#ffd700'}}>
          🎊 Saare phoot gaye! Mast party! 🎉
        </motion.p>}
      </div>
      {balloons.length>0&&<p style={{color:'#9a6070',fontSize:'.88rem',marginTop:12,fontFamily:"'Poppins',sans-serif"}}>
        👆 Tap karke phodo! Cracker sound! 🎆 ({balloons.length} bache)
      </p>}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   🌹 BOUQUET — Fixed name labels
═══════════════════════════════════════════════════ */
function BouquetScene(){
  const [given,setGiven]=useState(false)
  const give=()=>{setGiven(true);boom({particleCount:100,spread:70})}
  return(
    <div className="flex flex-col items-center max-w-lg w-full mx-auto">
      {/* Increased viewBox height to 310 so labels are visible */}
      <svg viewBox="0 0 420 310" width="100%" xmlns="http://www.w3.org/2000/svg">
        {/* ── Abhishek ── */}
        <rect x="68" y="210" width="14" height="55" rx="7" fill="#3a3a5c"/>
        <rect x="86" y="210" width="14" height="55" rx="7" fill="#2d2d4a"/>
        <ellipse cx="75" cy="265" rx="10" ry="5" fill="#1a1a2e"/>
        <ellipse cx="93" cy="265" rx="10" ry="5" fill="#1a1a2e"/>
        <rect x="60" y="155" width="52" height="58" rx="10" fill="#1e3a6e"/>
        <path d="M 80 155 L 86 165 L 92 155" fill="white" opacity=".7"/>
        <rect x="42" y="160" width="18" height="44" rx="9" fill="#f4c4a0"/>
        <motion.g animate={given?{x:28}:{x:0}} transition={{type:'spring',stiffness:150}}>
          <rect x="112" y="162" width="44" height="16" rx="8" fill="#f4c4a0"/>
        </motion.g>
        <circle cx="86" cy="130" r="30" fill="#f4c4a0"/>
        <ellipse cx="86" cy="106" rx="28" ry="12" fill="#2a1a0a"/>
        <ellipse cx="62" cy="118" rx="8" ry="14" fill="#2a1a0a"/>
        <ellipse cx="110" cy="118" rx="8" ry="14" fill="#2a1a0a"/>
        <circle cx="78" cy="130" r="2.5" fill="#1a0a04"/>
        <circle cx="94" cy="130" r="2.5" fill="#1a0a04"/>
        <path d="M 79 142 Q 86 150 93 142" stroke="#c0384a" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <ellipse cx="70" cy="138" rx="7" ry="4" fill="#e8a0a0" opacity=".4"/>
        <ellipse cx="102" cy="138" rx="7" ry="4" fill="#e8a0a0" opacity=".4"/>
        {/* Abhishek NAME — big, clearly visible */}
        <rect x="38" y="273" width="96" height="22" rx="11" fill="#1e3a6e" opacity=".95"/>
        <text x="86" y="289" textAnchor="middle" fontSize="12" fontFamily="Poppins,sans-serif" fill="#a0c0ff" fontWeight="700">Abhishek 🌹</text>

        {/* ── Bouquet ── */}
        <motion.g animate={given?{x:75,opacity:1}:{x:0,opacity:1}} transition={{type:'spring',stiffness:110}}>
          <path d="M 170 230 L 200 175 L 230 230 Z" fill="#d4a060" opacity=".8"/>
          <path d="M 180 215 Q 200 220 220 215" stroke="#c0384a" strokeWidth="4.5" fill="none"/>
          {[[200,148,36],[182,158,28],[218,158,28],[170,170,26],[230,170,26],[192,165,24],[208,165,24],[200,178,22],[185,180,20],[215,180,20],[200,142,20]].map(([cx,cy,sz],i)=>(
            <g key={i}>
              {[0,60,120,180,240,300].map((a,j)=>{const r=a*Math.PI/180,d=sz*.38;return<ellipse key={j} cx={cx+d*Math.cos(r)} cy={cy+d*Math.sin(r)} rx={sz*.28} ry={sz*.22} fill={i%3===0?'#c0384a':i%3===1?'#e05060':'#a02030'} opacity=".85" transform={`rotate(${a} ${cx+d*Math.cos(r)} ${cy+d*Math.sin(r)})`}/>})}
              <circle cx={cx} cy={cy} r={sz*.25} fill={i%2===0?'#c0384a':'#e05060'}/>
            </g>
          ))}
        </motion.g>

        {/* ── Akshuu ── */}
        <rect x="308" y="210" width="14" height="55" rx="7" fill="#c0384a"/>
        <rect x="326" y="210" width="14" height="55" rx="7" fill="#a02030"/>
        <ellipse cx="315" cy="265" rx="9" ry="5" fill="#8a1a28"/>
        <ellipse cx="333" cy="265" rx="9" ry="5" fill="#8a1a28"/>
        <path d="M 298 210 Q 294 240 298 265 L 350 265 Q 354 240 350 210 Z" fill="#c0384a"/>
        <rect x="300" y="155" width="48" height="58" rx="10" fill="#e05060"/>
        <motion.g animate={given?{x:-26}:{x:0}} transition={{type:'spring',stiffness:150}}>
          <rect x="252" y="162" width="48" height="15" rx="7" fill="#f4c4a0"/>
        </motion.g>
        <rect x="348" y="160" width="16" height="44" rx="8" fill="#f4c4a0"/>
        <circle cx="324" cy="125" r="30" fill="#f4c4a0"/>
        <ellipse cx="324" cy="102" rx="30" ry="14" fill="#1a0a04"/>
        <rect x="296" y="100" width="14" height="80" rx="7" fill="#1a0a04"/>
        <rect x="342" y="100" width="14" height="80" rx="7" fill="#1a0a04"/>
        <ellipse cx="296" cy="175" rx="9" ry="12" fill="#1a0a04"/>
        <ellipse cx="342" cy="175" rx="9" ry="12" fill="#1a0a04"/>
        <circle cx="316" cy="125" r="2.5" fill="#1a0a04"/>
        <circle cx="332" cy="125" r="2.5" fill="#1a0a04"/>
        <path d={given?"M 314 138 Q 324 150 334 138":"M 316 138 Q 324 144 332 138"} stroke="#c0384a" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <ellipse cx="308" cy="133" rx="7" ry="4" fill="#e8a0a0" opacity=".5"/>
        <ellipse cx="340" cy="133" rx="7" ry="4" fill="#e8a0a0" opacity=".5"/>
        <circle cx="294" cy="128" r="3" fill="#ffd700"/>
        {/* Akshuu NAME — big, clearly visible */}
        <rect x="286" y="273" width="76" height="22" rx="11" fill="#c0384a" opacity=".95"/>
        <text x="324" y="289" textAnchor="middle" fontSize="12" fontFamily="Poppins,sans-serif" fill="#ffd700" fontWeight="700">Akshuu ✨</text>

        {given&&<motion.g initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.7}}>
          <rect x="120" y="52" width="180" height="28" rx="14" fill="rgba(192,56,74,.35)" stroke="rgba(244,160,176,.45)" strokeWidth="1.2"/>
          <text x="210" y="71" textAnchor="middle" fontSize="12" fontFamily="Poppins,sans-serif" fill="#f4a0b0" fontWeight="700">🌹 Bestfriends Forever 🌹</text>
        </motion.g>}

        {/* Hearts floating up when given */}
        {given&&[185,200,215,200].map((cx,i)=>(
          <motion.text key={i} x={cx} y={110} initial={{opacity:0,y:0}} animate={{opacity:[0,1,0],y:-50}}
            transition={{delay:i*.35,duration:1.8}} fontSize="18" textAnchor="middle">❤️</motion.text>
        ))}
      </svg>

      {!given&&<motion.button whileHover={{scale:1.06}} whileTap={{scale:.95}} onClick={give} className="btn-gold mt-2">
        🌹 Abhishek Ne Diya Bouquet!
      </motion.button>}
      {given&&<motion.p initial={{opacity:0,scale:.8}} animate={{opacity:1,scale:1}} transition={{type:'spring'}}
        style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.15rem',color:'#f4a0b0',marginTop:10,textAlign:'center'}}>
        🌹 Dosti ka bouquet — always priceless! 🧸
      </motion.p>}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   🎂 CHOCOLATE CAKE
═══════════════════════════════════════════════════ */
function ChocCake({blown,cut,onBlow,onCut}){
  return(
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 340 310" width="100%" style={{maxWidth:380}} xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="160" cy="298" rx="155" ry="10" fill="#1a0804" opacity=".4"/>
        <rect x="10" y="228" width="230" height="62" rx="12" fill="#3d1c09"/>
        <rect x="10" y="228" width="230" height="16" rx="8" fill="#5a2e10"/>
        {[26,50,74,98,122,146,170,194,218].map((x,i)=><ellipse key={i} cx={x} cy={228} rx={i%2===0?9:7} ry={i%2===0?12:9} fill="#1a0804" opacity=".9"/>)}
        {[38,72,106,140,174,208].map((x,i)=><circle key={i} cx={x} cy={243} r="4" fill="#ffd700" opacity=".6"/>)}
        <rect x="22" y="168" width="206" height="62" rx="10" fill="#6b3520"/>
        <rect x="22" y="168" width="206" height="14" rx="7" fill="#8b4a28"/>
        {[40,70,100,130,160,190,215].map((x,i)=>(
          <g key={i}><ellipse cx={x} cy={190} rx="9" ry="11" fill="#e03050"/><polygon points={`${x-3},${180} ${x+3},${180} ${x},${177}`} fill="#1e6b10" opacity=".9"/></g>
        ))}
        {[30,56,82,108,134,160,186,212,230].map((x,i)=><ellipse key={i} cx={x} cy={168} rx={i%2===0?8:6} ry={i%2===0?10:8} fill="#3d1c09" opacity=".9"/>)}
        <rect x="36" y="112" width="178" height="58" rx="9" fill="#2d1008"/>
        <rect x="36" y="112" width="178" height="13" rx="6" fill="#4a1e0c"/>
        {[48,70,92,115,138,162,186,205].map((x,i)=><ellipse key={i} cx={x} cy={112} rx={i%2===0?9:7} ry={i%2===0?12:10} fill="#1a0804" opacity=".9"/>)}
        <text x="125" y="148" textAnchor="middle" fontSize="20" fontFamily="'Pacifico','Cormorant Garamond',serif" fill="#ffb3c1" fontWeight="bold">Akshuu ❤️</text>
        <text x="125" y="261" textAnchor="middle" fontSize="10" fontFamily="Poppins,sans-serif" fill="#ffd700" fontWeight="700" opacity=".9">🎂 Happy Birthday! 🎂</text>
        {[62,88,120,152,178].map((x,i)=>(
          <g key={i}>
            <rect x={x-5} y={74} width="10" height="39" fill={['#f4a0b0','#ffd700','#c0384a','#9b59b6','#ff7f50'][i]} rx="4"/>
            {!blown?(
              <g className="flame" style={{transformOrigin:`${x}px 68px`}}>
                <ellipse cx={x} cy={67} rx="6" ry="9" fill="#FFA500" opacity=".95"/>
                <ellipse cx={x} cy={62} rx="4" ry="6" fill="#FFD700"/>
                <ellipse cx={x} cy={57} rx="2" ry="3.5" fill="white" opacity=".9"/>
                <ellipse cx={x} cy={67} rx="10" ry="14" fill="rgba(255,165,0,.1)"/>
              </g>
            ):<text x={x} y={65} textAnchor="middle" fontSize="14">💨</text>}
          </g>
        ))}
        {cut&&<motion.line initial={{y2:112}} animate={{y2:290}} transition={{duration:.5}} x1={125} y1={112} x2={125} stroke="rgba(255,255,255,.75)" strokeWidth="3.5" strokeDasharray="7,3" strokeLinecap="round"/>}
        {cut&&['♪','♫','♬','♩'].map((n,i)=>(
          <motion.text key={i} x={50+i*62} y={85} initial={{opacity:0,y:0}} animate={{opacity:[0,1,0],y:-55}} transition={{delay:i*.5,duration:2.5,repeat:4}} fontSize="20" fill="#ffd700">{n}</motion.text>
        ))}
        {blown&&(
          <motion.g initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:.3,type:'spring'}}>
            <line x1="265" y1="235" x2="265" y2="292" stroke="#c0384a" strokeWidth="13" strokeLinecap="round"/>
            <line x1="278" y1="237" x2="280" y2="292" stroke="#a02030" strokeWidth="12" strokeLinecap="round"/>
            <ellipse cx="262" cy="292" rx="10" ry="5.5" fill="#5a1020"/><ellipse cx="280" cy="292" rx="10" ry="5.5" fill="#5a1020"/>
            <path d="M 252 235 Q 248 260 252 290 L 292 290 Q 296 260 292 235 Z" fill="#c0384a" opacity=".9"/>
            <rect x="252" y="182" width="44" height="56" rx="9" fill="#e05060"/>
            <motion.g animate={cut?{rotate:[-8,12,-4,0]}:{rotate:0}} transition={{duration:.4}} style={{transformOrigin:'230px 185px'}}>
              <line x1="252" y1="188" x2="218" y2="175" stroke="#f4c4a0" strokeWidth="12" strokeLinecap="round"/>
              <ellipse cx="215" cy="173" rx="10" ry="7" fill="#e8b090"/>
              {cut&&<><rect x="192" y="167" width="26" height="7" rx="3.5" fill="#d0d0d0"/><path d="M 192 170 L 178 178 L 192 174" fill="#a0a0a0"/></>}
            </motion.g>
            <line x1="296" y1="190" x2="314" y2="210" stroke="#f4c4a0" strokeWidth="12" strokeLinecap="round"/>
            <circle cx="272" cy="156" r="28" fill="#f4c4a0"/>
            <ellipse cx="272" cy="133" rx="27" ry="13" fill="#1a0a04"/>
            <rect x="246" y="130" width="13" height="74" rx="6.5" fill="#1a0a04"/>
            <rect x="285" y="130" width="13" height="74" rx="6.5" fill="#1a0a04"/>
            <ellipse cx="246" cy="196" rx="9" ry="12" fill="#1a0a04"/><ellipse cx="285" cy="196" rx="9" ry="12" fill="#1a0a04"/>
            <ellipse cx="286" cy="132" rx="6" ry="7" fill="#ffd700"/>
            <ellipse cx="264" cy="154" rx="4.5" ry="5.5" fill="white"/>
            <circle cx="264" cy="156" r="2.8" fill="#1a0a04"/>
            <ellipse cx="280" cy="154" rx="4.5" ry="5.5" fill="white"/>
            <circle cx="280" cy="156" r="2.8" fill="#1a0a04"/>
            <path d={cut?"M 262 168 Q 272 178 282 168":"M 264 168 Q 272 174 280 168"} stroke="#c0384a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            {cut&&<ellipse cx="272" cy="171" rx="5" ry="4" fill="#ff9090" opacity=".5"/>}
            <ellipse cx="256" cy="162" rx="7" ry="4.5" fill="#e8a0a0" opacity=".5"/>
            <ellipse cx="288" cy="162" rx="7" ry="4.5" fill="#e8a0a0" opacity=".5"/>
            <circle cx="244" cy="158" r="3.5" fill="#ffd700"/><ellipse cx="244" cy="164" rx="2" ry="3.5" fill="#ffd700" opacity=".8"/>
          </motion.g>
        )}
      </svg>
      <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',gap:12,marginTop:12}}>
        {!blown&&<motion.button whileHover={{scale:1.06}} whileTap={{scale:.95}} onClick={onBlow} className="btn-gold">🌬️ Candles Phunko!</motion.button>}
        {blown&&!cut&&<motion.button initial={{scale:0}} animate={{scale:1}} transition={{type:'spring',stiffness:200}} whileHover={{scale:1.06}} whileTap={{scale:.95}} onClick={onCut} className="btn-rose">🔪 Cake Kato, Akshuu!</motion.button>}
        {cut&&<motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:'spring'}}>
          <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.3rem',color:'#ffd700',textAlign:'center'}}>
            🎂 Akshuu ne cake kaata! 🎉<br/>
            <span style={{fontSize:'.95rem',color:'#d4a0a8'}}>Taaliyan baj rahi hain! Birthday song! 👏🎵</span>
          </p>
        </motion.div>}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   😂 HINDI JOKES
═══════════════════════════════════════════════════ */
const HINDI_JOKES=[
  {setup:"Teacher ne pucha: Duniya ki sabse meeti cheez kya hai?",punchline:"Akshuu boli: Sir, mera birthday cake! 😂🎂"},
  {setup:"Doctor: Roz itna cake mat khao!",punchline:"Akshuu: Theek hai doctor — ab teen baar khauungi! 😂🎂"},
  {setup:"Abhishek ne pucha: Akshuu tumhara favourite time kya hai?",punchline:"Akshuu: Jab cake aata hai — aur kisi ka bhi birthday ho! 😂🎂"},
  {setup:"Teddy birthday pe darwaza kholke andar aaya aur bola:",punchline:"'Maahi, main tumhara sabse zyada chahne wala hoon — cake ke baad!' 🧸😂"},
  {setup:"Maa ne pucha: Beta aaj kuch special plan hai?",punchline:"Maahi: Haan maa — seedha sounga! Birthday pe chutti milni chahiye! 😂🌹"},
  {setup:"Akshuu se pucha: Zindagi mein sabse zyada kya chahiye?",punchline:"'Har roz birthday rahe, cake mile — aur homework kabhi na aaye!' 🎂😂"},
]

/* ═══════════════════════════════════════════════════
   LOADING & SHARED DATA
═══════════════════════════════════════════════════ */
const loadMsgs=['🌹 Gulab sajaa rahe hain...','🌸 Tulips aur Sunflowers bhi...','🎂 Chocolate cake bake ho rahi hai...','🎈 Balloons fula rahe hain...','🪩 Disco ball set ho raha hai...','🎸 Guitar tuning ho raha hai...','✨ Party shuru! Akshuu ko bulao! 🥳']
const shayaris=[
  {text:"ज़िन्दगी में आये हों जो गम और परेशानियाँ,\nफूलों की तरह महकती रहे तेरी हर कहानियाँ।\nजन्मदिन मुबारक हो अक्षु! ❤️"},
  {text:"आसमान से माँगी हैं दुआएँ तेरे लिए,\nखुशियाँ हमेशा बरसें तेरे दरवाज़े पर।\nजन्मदिन मुबारक! 🌹"},
  {text:"गुलाब जितनी प्यारी है तू,\nचाँद जितनी रोशन है तू।\nआज का दिन बस तेरा है! 🌹🧸"},
  {text:"Abhishek ki taraf se —\nSaari duaaon ke saath,\nHappy Birthday meri bestfriend! 🎂🌹"},
]

/* ═══════════════════════════════════════════════════
   APP ROOT
═══════════════════════════════════════════════════ */
export default function App(){
  const [screen,setScreen]=useState('loading')
  const [loadStep,setLoadStep]=useState(0)
  const [blown,setBlown]=useState(false)
  const [cut,setCut]=useState(false)
  const [jokeIdx,setJokeIdx]=useState(0)
  const [jokeKey,setJokeKey]=useState(0)
  const [compIdx,setCompIdx]=useState(0)
  const [champActive,setChampActive]=useState(false)
  const {startLoop,stopLoop,playing}=useBollywoodMusic()

  useEffect(()=>{
    if(screen!=='loading')return
    if(loadStep<loadMsgs.length){const t=setTimeout(()=>setLoadStep(s=>s+1),700);return()=>clearTimeout(t)}
    else{const t=setTimeout(()=>setScreen('hero'),500);return()=>clearTimeout(t)}
  },[screen,loadStep])

  const handleBlow=()=>{setBlown(true);boom({particleCount:150,spread:80,origin:{y:.4}})}
  const handleCut=()=>{setCut(true);playClap(8);playBirthdaySong();boom({particleCount:220,spread:110})}
  const nextJoke=()=>{setJokeIdx(i=>(i+1)%HINDI_JOKES.length);setJokeKey(k=>k+1)}
  const nextComp=()=>setCompIdx(i=>{let n=Math.floor(Math.random()*compliments.length);while(n===i)n=Math.floor(Math.random()*compliments.length);return n})

  const handleFinale=async()=>{
    setChampActive(true)
    await champagneFoam()
    setTimeout(()=>setChampActive(false),5000)
  }

  const CS={background:'rgba(255,255,255,.04)',border:'1px solid rgba(244,160,176,.2)',borderRadius:24,boxShadow:'0 4px 24px rgba(0,0,0,.3)'}
  const ST={fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(1.7rem,5vw,2.7rem)',color:'#f4a0b0',textAlign:'center',marginBottom:8}

  if(screen==='loading') return(
    <div style={{minHeight:'100vh',background:'#1a0508',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
      <motion.div animate={{y:[0,-12,0]}} transition={{duration:2.5,repeat:Infinity}}><TeddySVG size={110}/></motion.div>
      <div style={{marginTop:32,textAlign:'center',padding:'0 20px'}}>
        <AnimatePresence mode="wait">
          <motion.p key={loadStep} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}
            style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.25rem',color:'#f4a0b0',fontStyle:'italic'}}>
            {loadMsgs[Math.min(loadStep,loadMsgs.length-1)]}
          </motion.p>
        </AnimatePresence>
        <div style={{display:'flex',justifyContent:'center',gap:8,marginTop:24}}>
          {loadMsgs.map((_,i)=><div key={i} style={{width:8,height:8,borderRadius:'50%',transition:'all .4s',background:i<loadStep?'#c0384a':'#4a1a20'}}/>)}
        </div>
      </div>
    </div>
  )

  if(screen==='hero') return(
    <div style={{minHeight:'100vh',background:'radial-gradient(ellipse at 50% 30%,#3a0e16 0%,#1a0508 70%)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',position:'relative',padding:'24px',overflow:'hidden'}}>
      <FloatingFlowers/><PaperConfetti/><ClubLights/>
      <div style={{position:'absolute',top:0,left:0,right:0,height:5,background:'linear-gradient(90deg,#c0384a,#ffd700,#c0384a,#ffd700,#c0384a)'}}/>
      <div style={{fontSize:'2rem',letterSpacing:'6px',marginBottom:20,opacity:.7}}>🎉 🎈 🌹 🎊 🌸 🎈 🎉</div>
      <motion.div initial={{scale:0,rotate:-20}} animate={{scale:1,rotate:0}} transition={{type:'spring',stiffness:160,damping:14}} style={{marginBottom:16}}>
        <TeddySVG size={155}/>
      </motion.div>
      <motion.h1 initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:.4}}
        className="glow-title" style={{fontFamily:"'Pacifico',cursive",fontSize:'clamp(2rem,8vw,4rem)',color:'#c0384a',textAlign:'center',marginBottom:8}}>
        Happy Birthday, Akshuu! 🌹
      </motion.h1>
      <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.7}}
        style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.2rem',color:'#d4a0a8',fontStyle:'italic',textAlign:'center',marginBottom:32,maxWidth:380}}>
        Abhishek ki taraf se — ek chhota sa birthday surprise 🧸
      </motion.p>
      <motion.button initial={{opacity:0,scale:.7}} animate={{opacity:1,scale:1}} transition={{delay:1,type:'spring'}}
        whileHover={{scale:1.07}} whileTap={{scale:.94}}
        onClick={()=>{setScreen('main');setTimeout(()=>startLoop(),600)}}
        className="btn-rose" style={{fontSize:'1.15rem'}}>
        🎁 Open Your Birthday Gift!
      </motion.button>
      <div style={{position:'absolute',bottom:0,left:0,right:0,height:5,background:'linear-gradient(90deg,#c0384a,#ffd700,#c0384a)'}}/>
    </div>
  )

  return(
    <div style={{minHeight:'100vh',background:'#1a0508',position:'relative'}}>
      <FloatingFlowers/><PaperConfetti/><ClubLights/>

      {/* Ticker */}
      <div style={{background:'#c0384a',overflow:'hidden',padding:'8px 0',borderBottom:'2px solid #ffd700',position:'relative',zIndex:10}}>
        <span className="ticker" style={{fontFamily:"'Poppins',sans-serif",fontSize:'.88rem',color:'white',fontWeight:600}}>
          &nbsp;&nbsp;&nbsp;🎉 Happy Birthday Akshuu! 🌹 &nbsp;|&nbsp; 🎂 Abhishek ki taraf se! 🧸 &nbsp;|&nbsp; 🌸 Gulab, Tulip, Sunflower — sab gir rahe hain! 🌻 &nbsp;|&nbsp; 🎈 Pop pop pop! 🎊 &nbsp;|&nbsp; 🪩 Disco party chal rahi hai! 💃 &nbsp;|&nbsp; 🍾 Champagne time! 🎶&nbsp;&nbsp;&nbsp;
        </span>
      </div>

      {/* Floating music control */}
      <div style={{position:'fixed',bottom:20,right:20,zIndex:50,display:'flex',flexDirection:'column',gap:8,alignItems:'flex-end'}}>
        <button onClick={playing?stopLoop:startLoop} className={playing?'btn-outline':'btn-rose'} style={{fontSize:'.85rem',padding:'10px 20px'}}>
          {playing?'🔇 Band Karo':'🎵 Bollywood Music'}
        </button>
        {playing&&<div style={{display:'flex',alignItems:'flex-end',gap:3,height:20,background:'rgba(26,5,8,.7)',padding:'4px 8px',borderRadius:20}}>
          {[.3,.6,.4,.8,.5,.7,.45,.35,.6].map((d,i)=><div key={i} className="wave-bar" style={{height:20,animationDelay:`${d}s`}}/>)}
        </div>}
      </div>

      {/* S1: HEADER */}
      <section style={{background:'radial-gradient(ellipse at 50% 0%,#3a0e16 0%,#1a0508 80%)',padding:'56px 16px 48px',textAlign:'center',borderBottom:'1px solid rgba(244,160,176,.15)'}}>
        <div style={{fontSize:'2rem',letterSpacing:'6px',marginBottom:16,opacity:.65}}>🎉 🌸 🌹 🎊 🌻 🌷 🎉</div>
        <motion.div initial={{scale:0}} animate={{scale:1,y:[0,-10,0]}} transition={{scale:{type:'spring',stiffness:150},y:{duration:3.5,repeat:Infinity}}}>
          <TeddySVG size={165}/>
        </motion.div>
        <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.3}}
          className="glow-title" style={{fontFamily:"'Pacifico',cursive",fontSize:'clamp(2.2rem,8vw,4.5rem)',color:'#c0384a',margin:'16px 0 4px'}}>
          Happy Birthday
        </motion.h1>
        <motion.h2 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.5}}
          style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(1.6rem,6vw,3rem)',color:'#fdf6ec',fontStyle:'italic',margin:'0 0 8px'}}>
          Akshra 🌹 Maahi 🌸 Akshuu
        </motion.h2>
        <p style={{color:'#9a6070',fontFamily:"'Poppins',sans-serif",marginBottom:24,fontSize:'.9rem'}}>From your bestfriend — Abhishek 🧸</p>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:12,margin:'24px auto 0',maxWidth:300}}>
          <div style={{flex:1,height:1,background:'linear-gradient(90deg,transparent,rgba(244,160,176,.4))'}}/>
          <span style={{fontSize:'1.3rem'}}>🌹 🧸 🌸</span>
          <div style={{flex:1,height:1,background:'linear-gradient(90deg,rgba(244,160,176,.4),transparent)'}}/>
        </div>
      </section>

      {/* S2: PARTY SCENE */}
      <section style={{background:'#220810',padding:'48px 16px',borderBottom:'1px solid rgba(244,160,176,.12)'}}>
        <motion.h2 initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} style={ST}>
          🕺 Party Chal Rahi Hai! 💃
        </motion.h2>
        <p style={{textAlign:'center',color:'#9a6070',fontFamily:"'Poppins',sans-serif",marginBottom:32,fontSize:'.9rem'}}>
          Disco ball 🪩 • Guitar 🎸 • Dancing 💃 • Champagne 🍾 — Sab hai!
        </p>
        <motion.div initial={{opacity:0,scale:.95}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{duration:.6}}>
          <PartyScene/>
        </motion.div>
      </section>

      {/* S3: BALLOONS */}
      <section style={{background:'#1a0508',padding:'48px 16px',borderBottom:'1px solid rgba(244,160,176,.12)'}}>
        <motion.h2 initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} style={ST}>
          🎈 Balloons Phodo — Pop Pop Pop!
        </motion.h2>
        <p style={{textAlign:'center',color:'#9a6070',fontFamily:"'Poppins',sans-serif",marginBottom:32,fontSize:'.9rem'}}>
          Har balloon todne pe asli cracker sound! 🎆
        </p>
        <BalloonSection onAllPopped={()=>boom({particleCount:300})}/>
      </section>

      {/* S4: BOUQUET */}
      <section style={{background:'#220810',padding:'48px 16px',borderBottom:'1px solid rgba(244,160,176,.12)',display:'flex',flexDirection:'column',alignItems:'center'}}>
        <motion.h2 initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} style={ST}>
          🌹 Abhishek Ka Special Bouquet
        </motion.h2>
        <p style={{textAlign:'center',color:'#9a6070',fontFamily:"'Poppins',sans-serif",marginBottom:32,fontSize:'.9rem'}}>
          Bestfriend ki taraf se — dil se ❤️
        </p>
        <BouquetScene/>
      </section>

      {/* S5: CAKE */}
      <section style={{background:'#1a0508',padding:'48px 16px',borderBottom:'1px solid rgba(244,160,176,.12)',display:'flex',flexDirection:'column',alignItems:'center'}}>
        <motion.h2 initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} style={ST}>
          🎂 Akshuu Ki Chocolate Birthday Cake
        </motion.h2>
        <p style={{textAlign:'center',color:'#9a6070',fontFamily:"'Poppins',sans-serif",marginBottom:32,fontSize:'.9rem'}}>
          Candles phunko → Cake kato → Taaliyan + Birthday song! 🎵👏
        </p>
        <motion.div initial={{opacity:0,scale:.85}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{type:'spring',stiffness:130}}>
          <ChocCake blown={blown} cut={cut} onBlow={handleBlow} onCut={handleCut}/>
        </motion.div>
        <AnimatePresence>
          {cut&&<motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.6}}
            style={{...CS,marginTop:32,padding:'28px 36px',maxWidth:440,textAlign:'center'}}>
            <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.2rem',color:'#f4a0b0',fontStyle:'italic',lineHeight:1.9}}>
              "Akshuu ki zindagi itni meethi ho,<br/>jitni yeh chocolate cake —<br/>
              <span style={{color:'#ffd700',fontWeight:700}}>aur usse bhi zyada! 🌹🧸</span>"
            </p>
          </motion.div>}
        </AnimatePresence>
      </section>

      {/* S6: LETTER */}
      <section style={{background:'#220810',padding:'48px 16px',display:'flex',flexDirection:'column',alignItems:'center',borderBottom:'1px solid rgba(244,160,176,.12)'}}>
        <motion.h2 initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} style={ST}>
          💌 Ek Chhoti Si Baat
        </motion.h2>
        <motion.div initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:.2}}
          style={{...CS,borderLeft:'4px solid #c0384a',padding:'36px',maxWidth:520,width:'100%'}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.15rem',color:'#fdf6ec',lineHeight:2.1}}>
            <p style={{fontWeight:700,fontSize:'1.3rem',color:'#f4a0b0',marginBottom:16}}>Akshra, Maahi, Akshuu —</p>
            <p style={{marginBottom:12,color:'#d4b0b8'}}>Yeh saal shayad aasaan nahi raha. Mushkilein aayi — par tum hamesha strong rahi.</p>
            <p style={{marginBottom:12}}>Tum intelligent ho, caring ho, amazingly talented ho.</p>
            <p style={{marginBottom:16,fontWeight:600,fontSize:'1.2rem',color:'#f4a0b0'}}>Aaj ka din bas tera hai. 🌹</p>
            <p style={{fontStyle:'italic',color:'#d4b0b8'}}>Kha lo, muskura lo, enjoy karo! 🧸</p>
            <p style={{marginTop:16,fontSize:'.9rem',color:'#9a6070',fontFamily:"'Poppins',sans-serif"}}>— Abhishek 🌹</p>
          </div>
        </motion.div>
      </section>

      {/* S7: DANCING TEDDY */}
      <section style={{background:'#1a0508',padding:'48px 16px',textAlign:'center',borderBottom:'1px solid rgba(244,160,176,.12)'}}>
        <motion.h2 initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} style={ST}>
          🧸 Teddy Ka Birthday Dance!
        </motion.h2>
        <motion.div initial={{opacity:0,scale:.5}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{type:'spring',stiffness:200}} style={{display:'inline-block'}}>
          <TeddySVG size={155} dancing={true}/>
        </motion.div>
        <motion.div initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} transition={{delay:.4}}
          style={{...CS,display:'inline-block',marginTop:24,padding:'20px 32px',maxWidth:360}}>
          <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.15rem',color:'#f4a0b0',fontStyle:'italic'}}>
            "Teddy tumhara number one fan hai.<br/>Aur woh yeh bahut seriously leta hai! 🧸"
          </p>
        </motion.div>
      </section>

      {/* S8: SHAYARI */}
      <section style={{background:'#220810',padding:'48px 16px',display:'flex',flexDirection:'column',alignItems:'center',borderBottom:'1px solid rgba(244,160,176,.12)'}}>
        <motion.h2 initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} style={ST}>
          🌹 Kuch Shayari — Abhishek Ki Taraf Se
        </motion.h2>
        <div style={{maxWidth:540,width:'100%',display:'flex',flexDirection:'column',gap:16}}>
          {shayaris.map((s,i)=>(
            <motion.div key={i} initial={{opacity:0,x:i%2===0?-30:30}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*.1}}
              style={{...CS,borderLeft:`4px solid ${i%2===0?'#c0384a':'#ffd700'}`,padding:'24px 28px'}}>
              <p className="hindi" style={{fontSize:'1.05rem',color:'#fdf6ec',lineHeight:2.1,whiteSpace:'pre-line'}}>{s.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* S9: FUN — Hindi jokes */}
      <section style={{background:'#1a0508',padding:'48px 16px',borderBottom:'1px solid rgba(244,160,176,.12)'}}>
        <motion.h2 initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} style={ST}>
          😂 Hindi Jokes — Teddy Ki Bakwaas!
        </motion.h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:20,maxWidth:680,margin:'32px auto 0'}}>
          <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} style={{...CS,padding:'28px',textAlign:'center'}}>
            <div style={{fontSize:'2.5rem',marginBottom:16}}>😂</div>
            <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.25rem',color:'#f4a0b0',marginBottom:20}}>Teddy Ka Hindi Joke</h3>
            <AnimatePresence mode="wait">
              <motion.div key={jokeKey} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} transition={{duration:.3}}>
                <p className="hindi" style={{color:'#fdf6ec',fontSize:'1rem',marginBottom:12,lineHeight:1.9}}>{HINDI_JOKES[jokeIdx].setup}</p>
                <div style={{width:40,height:1,background:'rgba(244,160,176,.4)',margin:'0 auto 12px'}}/>
                <p className="hindi" style={{color:'#ffd700',fontSize:'1.05rem',fontWeight:700,lineHeight:1.8}}>{HINDI_JOKES[jokeIdx].punchline}</p>
              </motion.div>
            </AnimatePresence>
            <button onClick={nextJoke} className="btn-outline" style={{marginTop:20}}>Aur Suno 😂</button>
          </motion.div>
          <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:.1}} style={{...CS,padding:'28px',textAlign:'center'}}>
            <div style={{fontSize:'2.5rem',marginBottom:16}}>💛</div>
            <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.25rem',color:'#f4a0b0',marginBottom:20}}>Aaj Ka Compliment</h3>
            <AnimatePresence mode="wait">
              <motion.p key={compIdx} initial={{opacity:0,scale:.95}} animate={{opacity:1,scale:1}} exit={{opacity:0}} transition={{duration:.3}}
                style={{color:'#fdf6ec',fontFamily:"'Cormorant Garamond',serif",fontSize:'1.1rem',fontStyle:'italic',lineHeight:1.8}}>
                "{compliments[compIdx]}"
              </motion.p>
            </AnimatePresence>
            <button onClick={nextComp} className="btn-outline" style={{marginTop:20}}>Aur Suno 💛</button>
          </motion.div>
        </div>
      </section>

      {/* S10: FINALE */}
      <section style={{background:'#220810',padding:'64px 16px',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:'linear-gradient(90deg,transparent,#c0384a,#ffd700,#c0384a,transparent)'}}/>
        <div style={{fontSize:'2.5rem',letterSpacing:'6px',marginBottom:24,opacity:.6}}>🎉 🌸 🌹 🧸 🌻 🌷 🎉</div>
        <motion.div initial={{scale:0}} whileInView={{scale:1}} viewport={{once:true}} transition={{type:'spring',stiffness:140}}>
          <TeddySVG size={130} dancing={true}/>
        </motion.div>
        <motion.h2 initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:.2}}
          className="glow-title" style={{fontFamily:"'Pacifico',cursive",fontSize:'clamp(2rem,7vw,3.8rem)',color:'#c0384a',margin:'24px 0 16px'}}>
          Happy Birthday, Akshuu! 🌹
        </motion.h2>
        <motion.p initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} transition={{delay:.4}}
          style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.25rem',color:'#fdf6ec',fontStyle:'italic',lineHeight:2,maxWidth:480,margin:'0 auto 24px'}}>
          "Tum bahut pyari ho, bahut strong ho.<br/>Aaj ka din tumhara hai — poora.<br/>
          <span style={{color:'#f4a0b0'}}>Yeh gift sirf tere liye hai — always. 🧸🌹"</span>
        </motion.p>
        <motion.p initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} transition={{delay:.6}} className="hindi"
          style={{fontSize:'1.15rem',color:'#f4a0b0',lineHeight:2.2,marginBottom:32}}>
          जन्मदिन मुबारक हो, अक्षु। 🌹<br/>
          <span style={{fontSize:'.95rem',color:'#9a6070'}}>— Abhishek की तरफ से, हमेशा। 🧸</span>
        </motion.p>

        {/* CHAMPAGNE FINALE BUTTON */}
        <motion.button initial={{opacity:0,scale:.8}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{delay:.8,type:'spring'}}
          whileHover={{scale:1.07}} whileTap={{scale:.95}}
          onClick={handleFinale} disabled={champActive}
          className="btn-gold" style={{fontSize:'1.1rem'}}>
          {champActive ? '🍾 Foam aa raha hai! 🫧' : '🍾 Champagne Open Karo + Grand Finale!'}
        </motion.button>

        {/* Champagne bottle animation */}
        <AnimatePresence>
          {champActive&&(
            <motion.div initial={{opacity:0,y:30,scale:.7}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-20}}
              style={{marginTop:32,display:'inline-block'}}>
              <svg viewBox="0 0 80 200" width="80" height="200" xmlns="http://www.w3.org/2000/svg">
                {/* Bottle */}
                <rect x="25" y="80" width="30" height="100" rx="8" fill="#2d6e20"/>
                <rect x="28" y="55" width="24" height="28" rx="5" fill="#2d6e20"/>
                {/* Foil top */}
                <rect x="27" y="50" width="26" height="12" rx="3" fill="#ffd700"/>
                {/* Cork flying away */}
                <motion.g initial={{y:0,x:0,rotate:0}} animate={{y:-80,x:30,rotate:360}} transition={{duration:1,ease:'easeOut'}}>
                  <rect x="34" y="42" width="12" height="10" rx="3" fill="#c8935a"/>
                </motion.g>
                {/* Label */}
                <rect x="27" y="100" width="26" height="35" rx="3" fill="#ffd700" opacity=".9"/>
                <text x="40" y="117" textAnchor="middle" fontSize="7" fill="#2d0a12" fontWeight="bold">PARTY</text>
                <text x="40" y="127" textAnchor="middle" fontSize="6" fill="#2d0a12">🍾</text>
                {/* Foam/bubbles shooting up */}
                {[0,.3,.6,.9,1.2].map((d,i)=>(
                  <motion.g key={i} initial={{opacity:0,y:50}} animate={{opacity:[0,1,0],y:-60+i*10}}
                    transition={{delay:d,duration:1.8,repeat:3}}>
                    <ellipse cx={35+i*3} cy={50} rx="6" ry="18" fill="rgba(255,255,255,.7)"/>
                    {[0,1,2].map(j=>(
                      <motion.circle key={j} cx={32+j*5} cy={30-j*8} r={2+j} fill="rgba(255,255,255,.6)"
                        animate={{y:[-10,-50],opacity:[0,.9,0]}} transition={{delay:d+j*.15,duration:1.5,repeat:3}}/>
                    ))}
                  </motion.g>
                ))}
              </svg>
              <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.3rem',color:'#ffd700',marginTop:8}}>
                🍾 Pop! Champagne! 🫧🎊
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{position:'absolute',bottom:0,left:0,right:0,height:3,background:'linear-gradient(90deg,transparent,#c0384a,#ffd700,#c0384a,transparent)'}}/>
        <p style={{marginTop:40,fontSize:'.75rem',color:'rgba(244,160,176,.35)',fontFamily:"'Poppins',sans-serif"}}>
          🔒 Koi data collect nahi kiya. Sirf pyaar hai yahan. 🌹
        </p>
      </section>
    </div>
  )
}
