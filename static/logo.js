import * as THREE from 'three';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FontLoader } from 'three/addons/loaders/FontLoader.js';


gsap.registerPlugin(ScrollTrigger);
var pointsCamera, pointsScene, pointsRenderer, pointsStats, pointsMaterial;
var mouseX = 0, mouseY = 0;
var fogStep = 0, trans=false;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
}


pointsInit();
pointsRender();


function pointsInit() {

    pointsCamera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 2, 2000);
    pointsCamera.position.z = 1000;

    pointsScene = new THREE.Scene();
    pointsScene.fog = new THREE.FogExp2(0x000000, 0.005);

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
    pointsMaterial.color.setHSL(1.0, 0.3, 0.7, THREE.SRGBColorSpace);

    const particles = new THREE.Points(geometry, pointsMaterial);
    pointsScene.add(particles);

    //

    pointsRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    pointsRenderer.setPixelRatio(window.devicePixelRatio);
    pointsRenderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('three-points').appendChild(pointsRenderer.domElement);

    //

    window.addEventListener('resize', pointsOnWindowResize);

}

function pointsOnWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    pointsCamera.aspect = window.innerWidth / window.innerHeight;
    pointsCamera.updateProjectionMatrix();

    pointsRenderer.setSize(window.innerWidth, window.innerHeight);

}

//


function pointsRender() {
    pointsScene.fog.density = 0.005-0.004*easeOutCubic(fogStep)
    requestAnimationFrame(pointsRender);
    const time = Date.now() * 0.00005;

    pointsCamera.position.x += (mouseX - pointsCamera.position.x) * 0.05;
    pointsCamera.position.y += (- mouseY - pointsCamera.position.y) * 0.05;

    pointsCamera.lookAt(pointsScene.position);

    const h = (360 * (1.0 + time) % 360) / 360;
    pointsMaterial.color.setHSL(h, 0.5, 0.5);

    pointsRenderer.render(pointsScene, pointsCamera);
    if(trans){fogStep=Math.min(1, fogStep + 0.005)}
    
}

ScrollTrigger.create({
    trigger: "#three-points",
    start: "bottom bottom",
    onEnter: (self) => {
        trans=true;
        gsap.to(
            [".title__right", ".title__left"], {
                opacity: 1,
                duration: 1,
                ease:"power3.out",
                onComplete() {
                    gsap.to(
                        [".title__right", ".title__left"], {
                            y: 1000,
                            duration: 10,
                            ease:"power3.out"
                            
                        })
                }
            }
        )
        
    },
    onEnterBack: (self) => {
        trans=true;
        gsap.to(
            [".title__right", ".title__left"], {
                opacity: 1,
                duration: 1,
                ease:"power3.out"
                
            },
        )
    },
});

