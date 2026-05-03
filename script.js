// =====================
// THREE.JS 3D BACKGROUND
// =====================
const canvas = document.getElementById('bg-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true});
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
camera.position.z = 30;

// Particles
const particlesGeo = new THREE.BufferGeometry();
const particleCount = 1500;
const posArray = new Float32Array(particleCount*3);
for(let i=0;i<particleCount*3;i++){posArray[i]=(Math.random()-0.5)*100;}
particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray,3));
const particlesMat = new THREE.PointsMaterial({
  size:0.08, color:0x00d4ff, transparent:true, opacity:0.8
});
const particles = new THREE.Points(particlesGeo, particlesMat);
scene.add(particles);

// Floating 3D Shapes
const shapes = [];
const geometries = [
  new THREE.IcosahedronGeometry(1.5, 0),
  new THREE.TorusGeometry(1.2, 0.4, 16, 50),
  new THREE.OctahedronGeometry(1.5),
  new THREE.TorusKnotGeometry(0.8, 0.25, 80, 16)
];
const colors = [0x7b2ff7, 0x00d4ff, 0xf107a3, 0xffffff];

for(let i=0;i<8;i++){
  const geo = geometries[i % geometries.length];
  const mat = new THREE.MeshBasicMaterial({
    color: colors[i % colors.length],
    wireframe: true,
    transparent: true,
    opacity: 0.6
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(
    (Math.random()-0.5)*50,
    (Math.random()-0.5)*40,
    (Math.random()-0.5)*30
  );
  mesh.userData = {
    rx: Math.random()*0.01,
    ry: Math.random()*0.01,
    fx: Math.random()*0.005,
  };
  shapes.push(mesh);
  scene.add(mesh);
}

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const pl = new THREE.PointLight(0x7b2ff7, 2, 100);
pl.position.set(10,10,10);
scene.add(pl);

// Mouse
let mouseX=0, mouseY=0;
document.addEventListener('mousemove', e=>{
  mouseX = (e.clientX/innerWidth)*2 - 1;
  mouseY = -(e.clientY/innerHeight)*2 + 1;
});

// Animate
function animate(){
  requestAnimationFrame(animate);
  particles.rotation.y += 0.0008;
  particles.rotation.x += 0.0003;
  shapes.forEach(s=>{
    s.rotation.x += s.userData.rx;
    s.rotation.y += s.userData.ry;
    s.position.y += Math.sin(Date.now()*s.userData.fx)*0.005;
  });
  camera.position.x += (mouseX*3 - camera.position.x)*0.03;
  camera.position.y += (mouseY*3 - camera.position.y)*0.03;
  camera.lookAt(scene.position);
  renderer.render(scene, camera);
}
animate();

// Resize
window.addEventListener('resize', ()=>{
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

// =====================
// CUSTOM CURSOR
// =====================
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
document.addEventListener('mousemove', e=>{
  cursor.style.left = e.clientX+'px';
  cursor.style.top = e.clientY+'px';
  setTimeout(()=>{
    follower.style.left = e.clientX+'px';
    follower.style.top = e.clientY+'px';
  },80);
});
document.querySelectorAll('a,button,.skill-card,.project-card').forEach(el=>{
  el.addEventListener('mouseenter',()=>{
    cursor.style.transform='scale(2)';
    follower.style.transform='scale(1.5)';
    follower.style.borderColor='#f107a3';
  });
  el.addEventListener('mouseleave',()=>{
    cursor.style.transform='scale(1)';
    follower.style.transform='scale(1)';
    follower.style.borderColor='#7b2ff7';
  });
});

// =====================
// TYPING EFFECT
// =====================
const roles = ['AI Engineer','Web Developer','3D Designer','Full-Stack Dev','ML Specialist'];
let rIdx=0, cIdx=0, deleting=false;
const typedEl = document.querySelector('.typed');
function type(){
  const current = roles[rIdx];
  if(!deleting){
    typedEl.textContent = current.substring(0, cIdx++);
    if(cIdx > current.length){deleting=true; setTimeout(type,1500); return;}
  } else {
    typedEl.textContent = current.substring(0, cIdx--);
    if(cIdx < 0){deleting=false; rIdx=(rIdx+1)%roles.length;}
  }
  setTimeout(type, deleting?50:120);
}
type();

// =====================
// HAMBURGER
// =====================
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click',()=>navLinks.classList.toggle('active'));
document.querySelectorAll('.nav-links a').forEach(a=>{
  a.addEventListener('click',()=>navLinks.classList.remove('active'));
});

// =====================
// SCROLL REVEAL
// =====================
const reveals = document.querySelectorAll('section');
reveals.forEach(s=>s.classList.add('reveal'));
const observer = new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting) e.target.classList.add('active');});
},{threshold:0.1});
reveals.forEach(s=>observer.observe(s));

// =====================
// FORM
// =====================
document.querySelector('.contact-form').addEventListener('submit',e=>{
  e.preventDefault();
  alert('✅ Message sent! I will get back to you soon.');
  e.target.reset();
});