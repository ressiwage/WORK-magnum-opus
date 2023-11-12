import * as THREE from 'three';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


gsap.registerPlugin(ScrollTrigger);
var pointsCamera, pointsScene, pointsRenderer, pointsStats, pointsMaterial;
var mouseX = 0, mouseY = 0;
var fogStep = 0, trans=false;
var backColor, textColor, backColorProp, textColorProp
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
}

function vh(percent) {
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    return (percent * h) / 100;
  }

const hex2rgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    // return {r, g, b} 
    return { r, g, b };
}
  
function vw(percent) {
var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
return (percent * w) / 100;
}


pointsInit();
pointsRender();


function pointsInit() {

    pointsCamera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 2, 2000);
    pointsCamera.position.z = 1000;

    pointsScene = new THREE.Scene();

    backColorProp = hex2rgb(getComputedStyle(document.body).getPropertyValue('--back'));
    backColor = new THREE.Color(`rgb(${backColorProp.r}, ${backColorProp.g}, ${backColorProp.b})`)
    
    textColorProp = hex2rgb( getComputedStyle(document.body).getPropertyValue('--text'));
    textColor = new THREE.Color(`rgb(${textColorProp.r}, ${textColorProp.g}, ${textColorProp.b})`)
    pointsScene.fog = new THREE.FogExp2(backColor, 0.005);

    const geometry = new THREE.BufferGeometry();
    const vertices = [];

    const sprite = new THREE.TextureLoader().load('/disc.png');
    sprite.colorSpace = THREE.SRGBColorSpace;

    for (let i = 0; i < 10000; i++) {

        const x = 2000 * Math.random() - 1000;
        const y = 2000 * Math.random() - 1000;
        const z = 1650 * Math.random() - 1000;

        vertices.push(x, y, z);

    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    pointsMaterial = new THREE.PointsMaterial({ size: 35, sizeAttenuation: true, map: sprite, alphaTest: 0.5, transparent: true });
    var lighterTextColor = textColor.offsetHSL(0,0, 0.15); 
    
    pointsMaterial.color.set(lighterTextColor);

    const particles = new THREE.Points(geometry, pointsMaterial);
    pointsScene.add(particles);

    //

    pointsRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    pointsRenderer.setPixelRatio(window.devicePixelRatio);
    pointsRenderer.setSize(vw(100), vh(100));
    document.getElementById('three-points').appendChild(pointsRenderer.domElement);
    // document.getElementById('three-points').style.maxHeight = vh(100)

    //

    window.addEventListener('resize', pointsOnWindowResize);

}

function pointsOnWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    pointsCamera.aspect = window.innerWidth / window.innerHeight;
    pointsCamera.updateProjectionMatrix();

    pointsRenderer.setSize(vw(100), vh(100));
}

//


function pointsRender() {
    pointsScene.fog.density = 0.005-0.004*easeOutCubic(fogStep)
    requestAnimationFrame(pointsRender);
    const time = Date.now() * 0.00005;

    pointsCamera.position.x += (mouseX - pointsCamera.position.x) * 0.05;
    pointsCamera.position.y += (- mouseY - pointsCamera.position.y) * 0.05;

    pointsCamera.lookAt(pointsScene.position);


    pointsRenderer.render(pointsScene, pointsCamera);
    if(trans){fogStep=Math.min(1, fogStep + 0.01)}
    
}

ScrollTrigger.create({
    trigger: '#three-points',
    start: "top bottom",
    onUpdate: self => pointsCamera.position.y += self.direction*5
})

ScrollTrigger.create({
    trigger: "#three-points",
    start: "bottom bottom",
    once: true,
    onEnter: (self) => {
        trans=true;
        gsap.to(
            [".title__right", ".title__left"], {
                opacity: 1,
                duration: 1,
                
                ease:"power3.out",
            }
        );
        gsap.from(
            [".title__right", ".title__left"], {
                duration: 1,
                "--margin-extenda": -5,
                
                ease:"power3.out",
            }
        )  
    },
});

gsap.set('.title__right', {
    
    
})
gsap.set('.title__left', {
    // translateX:'-100%',
})