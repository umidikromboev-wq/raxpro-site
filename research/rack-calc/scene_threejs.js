/* ===== 3D-сцена склада. Читает тот же объект P, что план и смета. ===== */
(function(){
  const cv = document.getElementById('scene');
  const loading = document.getElementById('loading');
  if(!window.THREE){ loading.textContent = 'WebGL недоступен'; return; }

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0d1116);
  scene.fog = new THREE.Fog(0x0d1116, 60, 160);

  if(THREE.ColorManagement) THREE.ColorManagement.enabled = true;
  const renderer = new THREE.WebGLRenderer({canvas:cv, antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.outputEncoding = THREE.sRGBEncoding;          // без этого всё выцветает
  renderer.toneMapping = THREE.ACESFilmicToneMapping;    // гасит пересвет в светах
  renderer.toneMappingExposure = 0.82;

  const cam = new THREE.PerspectiveCamera(45, 1, 0.1, 400);
  const target = new THREE.Vector3(P.L/2, 3, P.W/2);

  /* ---- освещение: контраст важнее яркости ---- */
  scene.add(new THREE.HemisphereLight(0x9db4ca, 0x24292e, 0.50));
  scene.add(new THREE.AmbientLight(0xffffff, 0.07));
  const sun = new THREE.DirectionalLight(0xfff3e0, 1.05);   // ключевой
  sun.position.set(P.L*0.75, 24, -P.W*0.6);
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0xcfe0f0, 0.32);  // заполняющий с тени
  fill.position.set(-P.L*0.3, 14, P.W*1.4);
  scene.add(fill);

  /* ---- пол и коробка здания ---- */
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(P.L, P.W),
    new THREE.MeshStandardMaterial({color:0x5f666d, roughness:0.9, metalness:0.05}));
  floor.rotation.x = -Math.PI/2;
  floor.position.set(P.L/2, 0, P.W/2);
  scene.add(floor);

  const walls = new THREE.Group();
  const trusses = new THREE.Group();
  // Четыре стены без крыши. Нормали направлены внутрь + FrontSide: снаружи стена
  // отбраковывается сама, поэтому обзор никогда не перекрывается, а изнутри
  // (вид с уровня глаз) помещение выглядит закрытым.
  const wmat = new THREE.MeshStandardMaterial({color:0x8d949b, roughness:0.97, side:THREE.FrontSide});
  const wall=(w,h,x,y,z,ry)=>{ const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h), wmat);
    m.position.set(x,y,z); m.rotation.y=ry; walls.add(m); };
  wall(P.L, P.H, P.L/2, P.H/2, 0,        0);
  wall(P.L, P.H, P.L/2, P.H/2, P.W,      Math.PI);
  wall(P.W, P.H, 0,     P.H/2, P.W/2,    Math.PI/2);
  wall(P.W, P.H, P.L,   P.H/2, P.W/2,   -Math.PI/2);
  // фермы перекрытия
  const trussMat = new THREE.MeshStandardMaterial({color:0x565d64, roughness:0.62, metalness:0.5});
  for(let i=0;i<=Math.floor(P.L/4.5);i++){
    const t = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.42, P.W), trussMat);
    t.position.set(i*4.5, P.H-0.32, P.W/2);
    trusses.add(t);
  }
  scene.add(walls); scene.add(trusses);
  walls.visible = false; trusses.visible = false;  // по умолчанию оболочка снята

  // разметка пола вдоль проходов
  const lineMat = new THREE.MeshBasicMaterial({color:0xd9a521});
  for(let b=0;b<P.blocks;b++){
    const y0 = P.rowX[b*2+1] + P.depth;
    const y1 = (b<P.blocks-1) ? P.rowX[b*2+2] : y0 + P.aisle;
    [y0+0.12, y1-0.12].forEach(z=>{
      const m = new THREE.Mesh(new THREE.PlaneGeometry(P.L-2*P.gap, 0.09), lineMat);
      m.rotation.x = -Math.PI/2; m.position.set(P.L/2, 0.012, z);
      scene.add(m);
    });
  }

  /* ---- сбор геометрии стеллажей ---- */
  const bays = [];              // {x, z}  — левый-передний угол каждой секции
  P.rowX.forEach((rz, ri)=>{
    for(let b=0;b<P.bays_per_row;b++){
      if(P.skips.includes(ri+"_"+b)) continue;
      bays.push({x: P.gap + b*P.bay, z: rz, ri, b});
    }
  });

  const dummy = new THREE.Object3D();
  const mk = (geo, mat, n) => { const m = new THREE.InstancedMesh(geo, mat, n); scene.add(m); return m; };
  const place = (mesh, i, x,y,z, sx,sy,sz) => {
    dummy.position.set(x,y,z);
    dummy.scale.set(sx||1, sy||1, sz||1);
    dummy.updateMatrix(); mesh.setMatrixAt(i, dummy.matrix);
  };

  // --- стойки рам (синие) ---
  const uprightPos = new Set();
  bays.forEach(({x,z})=>{ [x, x+P.bay].forEach(px=>{
    uprightPos.add(px.toFixed(2)+"|"+z.toFixed(2)); }); });
  const ups = [...uprightPos].map(s=>s.split("|").map(Number));
  const upMesh = mk(new THREE.BoxGeometry(0.105, P.frameH, 0.105),
    new THREE.MeshStandardMaterial({color:0x1D5AA8, roughness:0.42, metalness:0.35}),
    ups.length*2);
  ups.forEach(([px,pz],i)=>{
    place(upMesh, i*2,   px, P.frameH/2, pz+0.07);
    place(upMesh, i*2+1, px, P.frameH/2, pz+P.depth-0.07);
  });
  upMesh.instanceMatrix.needsUpdate = true;

  // --- раскосы рам ---
  const braceMesh = mk(new THREE.BoxGeometry(0.05, 0.05, P.depth-0.14),
    new THREE.MeshStandardMaterial({color:0x14396B, roughness:0.55, metalness:0.3}),
    ups.length*5);
  let bi=0;
  ups.forEach(([px,pz])=>{ for(let k=1;k<=5;k++){
    place(braceMesh, bi++, px, P.frameH*k/6, pz+P.depth/2); } });
  braceMesh.instanceMatrix.needsUpdate = true;

  // --- балки (оранжевые) ---
  const pitch = P.frameH / P.levels;
  const beamMesh = mk(new THREE.BoxGeometry(P.bay, 0.12, 0.05),
    new THREE.MeshStandardMaterial({color:0xF07C12, roughness:0.38, metalness:0.3}),
    bays.length*P.levels*2);
  let mi=0;
  bays.forEach(({x,z})=>{ for(let l=1;l<=P.levels;l++){
    const y = l*pitch;
    place(beamMesh, mi++, x+P.bay/2, y, z+0.09);
    place(beamMesh, mi++, x+P.bay/2, y, z+P.depth-0.09);
  }});
  beamMesh.instanceMatrix.needsUpdate = true;

  /* ---- паллеты с грузом ---- */
  const slots = [];
  bays.forEach(({x,z})=>{ for(let l=0;l<=P.levels;l++){
    const y = l===0 ? 0 : l*pitch + 0.06;
    for(let k=0;k<P.pallets_per_bay;k++){
      slots.push({x: x + 0.18 + k*0.88, y, z: z + P.depth/2});
    }}});
  // детерминированное заполнение ~72%
  const filled = slots.filter((_,i)=> ((i*2654435761)%1000)/1000 < 0.72 );

  const palMesh = mk(new THREE.BoxGeometry(0.8, 0.14, 1.15),
    new THREE.MeshStandardMaterial({color:0x7A5630, roughness:0.93}), filled.length);
  const boxMesh = mk(new THREE.BoxGeometry(0.76, 1.0, 1.08),
    new THREE.MeshStandardMaterial({color:0xA8834F, roughness:0.88}), filled.length);
  const tints = [new THREE.Color(0xA8834F), new THREE.Color(0x96723F), new THREE.Color(0xB89664)];
  filled.forEach((s,i)=>{
    place(palMesh, i, s.x, s.y+0.07, s.z);
    place(boxMesh, i, s.x, s.y+0.14+0.5, s.z, 1, 0.85+((i%7)/20), 1);
    boxMesh.setColorAt(i, tints[i%3]);
  });
  if(boxMesh.instanceColor) boxMesh.instanceColor.needsUpdate = true;
  palMesh.instanceMatrix.needsUpdate = true;
  boxMesh.instanceMatrix.needsUpdate = true;
  const palletGroup = [palMesh, boxMesh];

  /* ---- камера: орбита ---- */
  let az = -0.72, el = 0.42, dist = 56;
  const applyCam = ()=>{
    el = Math.max(0.04, Math.min(1.45, el));
    dist = Math.max(8, Math.min(110, dist));
    cam.position.set(
      target.x + dist*Math.cos(el)*Math.cos(az),
      target.y + dist*Math.sin(el),
      target.z + dist*Math.cos(el)*Math.sin(az));
    cam.lookAt(target);
  };
  let drag=false, lx=0, ly=0;
  const down=e=>{drag=true; lx=(e.touches?e.touches[0]:e).clientX; ly=(e.touches?e.touches[0]:e).clientY;};
  const move=e=>{ if(!drag)return;
    const p=e.touches?e.touches[0]:e;
    az += (p.clientX-lx)*0.006; el += (p.clientY-ly)*0.005;
    lx=p.clientX; ly=p.clientY; applyCam();
    if(e.touches) e.preventDefault(); };
  const up=()=>drag=false;
  cv.addEventListener('mousedown',down); addEventListener('mousemove',move); addEventListener('mouseup',up);
  cv.addEventListener('touchstart',down,{passive:true});
  cv.addEventListener('touchmove',move,{passive:false});
  cv.addEventListener('touchend',up);
  cv.addEventListener('wheel',e=>{e.preventDefault(); dist*=(1+Math.sign(e.deltaY)*0.09); applyCam();},{passive:false});

  /* ---- кнопки (могут отсутствовать в режиме съёмки кадра) ---- */
  const view=(a,e,d,ty)=>{ az=a; el=e; dist=d; target.y=ty; applyCam(); };
  const tog=(btn,fn)=>{ if(!btn) return; btn.addEventListener('click',()=>{
    const on = btn.getAttribute('aria-pressed')!=='true';
    btn.setAttribute('aria-pressed', on); fn(on); }); };
  tog(document.getElementById('b-pal'), on=>palletGroup.forEach(m=>m.visible=on));
  tog(document.getElementById('b-walls'), on=>{walls.visible=on; trusses.visible=on;});
  const bind=(id,fn)=>{const b=document.getElementById(id); if(b) b.onclick=fn;};
  bind('b-top',   ()=>view(-Math.PI/2, 1.43, 40, 0));
  bind('b-eye',   ()=>view(-0.02, 0.06, 26, 1.7));
  bind('b-reset', ()=>view(-0.72, 0.42, 56, 3));

  // пресеты для съёмки эталонного кадра
  window.RAX = {
    view,
    walls:(on)=>{walls.visible=on; trusses.visible=on;},
    preset:(name)=>{
      // центр второго прохода — камера обязана стоять В проходе, а не внутри стеллажа
      const aisleZ = (P.rowX[3] + P.depth + P.rowX[4]) / 2;
      const set=(a,e,d,tx,ty,tz)=>{ target.set(tx,ty,tz); az=a; el=e; dist=d; applyCam(); };
      if(name==='aisle'){   // взгляд вдоль прохода
        walls.visible=true; trusses.visible=true;
        set(0.0, 0.055, 19, P.L*0.42, 1.85, aisleZ);
      }
      if(name==='bay'){     // крупный план нескольких секций
        walls.visible=true; trusses.visible=true;
        set(0.60, 0.10, 11, P.gap + P.bay*2.2, 2.5, aisleZ - 1.2);
      }
      if(name==='iso'){
        walls.visible=false; trusses.visible=false;
        set(-0.72, 0.42, 56, P.L/2, 3, P.W/2);
      }
      renderer.render(scene,cam);
    }
  };

  /* ---- цикл ---- */
  const resize=()=>{
    const w=cv.clientWidth, h=cv.clientHeight;
    if(!w||!h) return;
    renderer.setSize(w,h,false); cam.aspect=w/h; cam.updateProjectionMatrix();
  };
  addEventListener('resize',resize);
  resize(); applyCam();
  loading.style.display='none';
  (function loop(){ requestAnimationFrame(loop); renderer.render(scene,cam); })();
})();
