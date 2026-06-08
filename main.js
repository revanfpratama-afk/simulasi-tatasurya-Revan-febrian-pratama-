// ================= SCENE =================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x000011);

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth/window.innerHeight,
0.1,
1000
);

camera.position.set(0,15,35);

const renderer = new THREE.WebGLRenderer({
antialias:true
});

renderer.setSize(
window.innerWidth,
window.innerHeight
);

document.body.appendChild(
renderer.domElement
);

// ================= CONTROLS =================

const controls =
new THREE.OrbitControls(
camera,
renderer.domElement
);

controls.enableDamping = true;

// ================= LIGHT =================

scene.add(
new THREE.AmbientLight(
0xffffff,
0.5
)
);

const light =
new THREE.PointLight(
0xffffff,
3
);

scene.add(light);

// ================= STARS =================

for(let i=0;i<1000;i++){

const star =
new THREE.Mesh(
new THREE.SphereGeometry(
0.05,
8,
8
),
new THREE.MeshBasicMaterial({
color:0xffffff
})
);

star.position.set(
(Math.random()-0.5)*300,
(Math.random()-0.5)*300,
(Math.random()-0.5)*300
);

scene.add(star);
}

// ================= SUN =================

const sun =
new THREE.Mesh(
new THREE.SphereGeometry(
3,
32,
32
),
new THREE.MeshBasicMaterial({
color:0xffff00
})
);

scene.add(sun);

// ================= PLANETS =================

const planets = [];

function addPlanet(
name,
size,
distance,
color,
speed
){

const mesh =
new THREE.Mesh(
new THREE.SphereGeometry(
size,
32,
32
),
new THREE.MeshPhongMaterial({
color
})
);

scene.add(mesh);

planets.push({
name,
mesh,
distance,
speed,
angle:Math.random()*Math.PI*2
});
}

addPlanet(
"Merkurius",
0.5,
6,
0x999999,
0.02
);

addPlanet(
"Venus",
0.8,
9,
0xffaa00,
0.015
);

addPlanet(
"Bumi",
1,
13,
0x3366ff,
0.01
);

addPlanet(
"Mars",
0.7,
17,
0xff3300,
0.008
);

addPlanet(
"Jupiter",
2,
23,
0xd2b48c,
0.005
);

// ================= ORBIT =================

planets.forEach(p=>{

const points=[];

for(let i=0;i<=100;i++){

const angle=
(i/100)*Math.PI*2;

points.push(
new THREE.Vector3(
Math.cos(angle)*p.distance,
0,
Math.sin(angle)*p.distance
)
);
}

const orbit =
new THREE.Line(
new THREE.BufferGeometry()
.setFromPoints(points),

new THREE.LineBasicMaterial({
color:0x444444
})
);

scene.add(orbit);
});

// ================= HOVER =================

const raycaster =
new THREE.Raycaster();

const mouse =
new THREE.Vector2();

const info =
document.getElementById(
"planetInfo"
);

window.addEventListener(
"mousemove",
e=>{

mouse.x =
(e.clientX/window.innerWidth)*2-1;

mouse.y =
-(e.clientY/window.innerHeight)*2+1;
}
);

// ================= BUTTON =================

let running=true;

document
.getElementById("toggleBtn")
.onclick=()=>{

running=!running;

document
.getElementById("toggleBtn")
.innerText=
running
? "Pause"
: "Play";
};

// ================= ANIMATE =================

function animate(){

requestAnimationFrame(
animate
);

if(running){

sun.rotation.y += 0.005;

planets.forEach(p=>{

p.angle += p.speed;

p.mesh.position.x =
Math.cos(
p.angle
)*p.distance;

p.mesh.position.z =
Math.sin(
p.angle
)*p.distance;

p.mesh.rotation.y +=
0.02;
});
}

raycaster.setFromCamera(
mouse,
camera
);

const hit =
raycaster.intersectObjects(
planets.map(
p=>p.mesh
)
);

if(hit.length>0){

const found=
planets.find(
p=>p.mesh===hit[0].object
);

info.innerText=
found.name;
}
else{

info.innerText=
"Arahkan mouse ke planet";
}

controls.update();

renderer.render(
scene,
camera
);
}

animate();

// ================= RESIZE =================

window.addEventListener(
"resize",
()=>{

camera.aspect=
window.innerWidth/
window.innerHeight;

camera.updateProjectionMatrix();

renderer.setSize(
window.innerWidth,
window.innerHeight
);
}
);