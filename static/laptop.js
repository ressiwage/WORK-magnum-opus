// import * as THREE from './node_modules/three/src/three.js';
// import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';
// import { gsap } from "gsap";
// import { VertexNormalsHelper } from './node_modules/three/examples/jsm/helpers/VertexNormalsHelper.js';
// import * as CameraUtils from './node_modules/three/examples/jsm/utils/CameraUtils.js';
// import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";

// const loader = new OBJLoader();
gsap.registerPlugin(ScrollTrigger, Observer);

function vw(percent) {
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    return (percent * w) / 100;
}
function vh(percent) {
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    return (percent * h) / 100;
}

var camera, scene, renderer;

var object;
var zoom = 0; //zoom = {0 not started|1 started|2 finished 3|reverse}
var laptopAnimationTime = 0;
var velocity = 0;
var pendingRenderFunctions = [];
var cameraPosVector, cameraRotVector
const NOTEBOOK_CLOSE_X = -3.15
const NOTEBOOK_OPEN_X = -1

gsapInit();
init();

function applyTransitionFunc(start, x, stop, func) {
    dist = stop - start
    return x0 + func(x0 / distance) * distance
}

function easeOutCubic(x) {
    if (x > 0) {
        return 1 - Math.pow(1 - x, 3);
    }
    else {
        return -(1 - Math.pow(1 - Math.abs(x), 3));
    }
}

var obj_notebook, screen, screenSurface;

var lights, light1, light2, light3, common_light;

var portalCamera, screen_copy, rightPortal, screenPortalTexture, reflectedPosition,
    rightPortalTexture, bottomLeftCorner, bottomRightCorner, topLeftCorner;


function init() {
    const planeGeo = new THREE.PlaneGeometry(1.0, 1.0);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 20);
    camera.position.x = 0;
    camera.position.y = 1.83;
    camera.position.z = -1.7;

    camera.rotation.x = -2.4;
    camera.rotation.z = Math.PI;






    // scene

    scene = new THREE.Scene();

    // const ambientLight = new THREE.AmbientLight(0xffffff);
    // scene.add(ambientLight);

    // const pointLight = new THREE.PointLight(0xffffff, 15);
    // camera.add(pointLight);

    scene.add(camera);

    const sphere = new THREE.SphereGeometry(0.5, 16, 8);

    //lights
    lights = []
    // #0f0204
    // #FBE6E9
    // #DB3B50

    light1 = new THREE.PointLight(0xff0000, 400);
    light1.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0x0000ff })));
    lights.push(light1)

    light2 = new THREE.PointLight(0xf5c1d4, 400);
    light2.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0x00ff00 })));
    lights.push(light2)

    light3 = new THREE.PointLight(0xff196e, 400);
    light3.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0xff0000 })));
    lights.push(light3)

    common_light = new THREE.PointLight(0xffffff, 300);
    common_light.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0xff0000 })));
    common_light.position.y = 2
    scene.add(common_light)


    lights.forEach((l) => { scene.add(l) })

    // manager

    function loadModel() {
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        screen = object.scene.children[0].children[1]
        screen.material = material
        screen.material.map = texture;

        obj_notebook = object.scene
        obj_notebook.children[0].rotation.x = NOTEBOOK_CLOSE_X

        scene.add(object.scene);




        screenSurface = new THREE.Mesh(screen.geometry.clone(), new THREE.MeshBasicMaterial({ color: 0x000000 }));
        obj_notebook.children[0].getWorldQuaternion(screenSurface.quaternion)
        obj_notebook.children[0].getWorldScale(screenSurface.scale)
        obj_notebook.children[0].getWorldPosition(screenSurface.position);
        scene.add(screenSurface);

        //portals
        // portalCamera = new THREE.PerspectiveCamera( 45, 1.0, 1, 20 );
        // scene.add( portalCamera );
        // bottomLeftCorner = new THREE.Vector3();
        // bottomRightCorner = new THREE.Vector3();
        // topLeftCorner = new THREE.Vector3();
        // reflectedPosition = new THREE.Vector3();

        // screenPortalTexture = new THREE.WebGLRenderTarget(1000, 1000 );
        // screenPortal = new THREE.Mesh( screen.geometry.clone(),  new THREE.MeshBasicMaterial( { map: screenPortalTexture.texture } ));
        // obj_notebook.children[0].getWorldQuaternion(screenPortal.quaternion)  
        // obj_notebook.children[0].getWorldScale(screenPortal.scale)
        // obj_notebook.children[0].getWorldPosition(screenPortal.position);
        // scene.add( screenPortal );




        // rightPortalTexture = new THREE.WebGLRenderTarget( 1000, 1000 );
        // rightPortal = new THREE.Mesh( planeGeo, new THREE.MeshBasicMaterial( { map: rightPortalTexture.texture } ) );
        // rightPortal.position.x = 0.6;
        // rightPortal.position.y = 0.2;
        // rightPortal.rotation.y+=3.14/2
        // rightPortal.rotateX(3.14)
        // scene.add( rightPortal );

        var d_c_f = new THREE.Vector3(
            screenSurface.position.x,
            screenSurface.position.y - Math.sin(screenSurface.rotation.x) * 0.4,
            screenSurface.position.z
        )
        camera.lookAt(d_c_f.x, d_c_f.y, d_c_f.z);
        cameraPosVector = camera.position.clone()
        cameraRotVector = camera.rotation.clone()


        console.log('scene')
        console.log(scene)
        render();


    }

    const manager = new THREE.LoadingManager(loadModel);

    // texture

    const textureLoader = new THREE.TextureLoader(manager);
    const texture = textureLoader.load('/uv_grid_opengl.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;

    // model

    function onProgress(xhr) {

        if (xhr.lengthComputable) {

            const percentComplete = xhr.loaded / xhr.total * 100;
            console.log('model ' + percentComplete.toFixed(2) + '% downloaded');

        }

    }

    function onError(e) {
        console.log(e)
    }

    const loader = new GLTFLoader(manager);
    loader.load('/exported_lt.glb', function (obj) {

        object = obj;


    }, onProgress, onError);

    // console.log(main_obj)

    //

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(vw(100), vh(100));

    // const controls = new OrbitControls(camera, renderer.domElement);
    // controls.minDistance = 0.1;
    // controls.maxDistance = 6;

    console.log("document")
    console.log(document)
    document.getElementById('three-notebook').appendChild(renderer.domElement);
    // document.getElementById('debug-btn').addEventListener('click', (e) => {
    //     console.log("camera")
    //     console.log(camera)
    //     console.log("display")
    //     console.log(object.scene.children[0].children[1])
    //     console.log(camera.position)
    //     console.log(screenSurface.position)
    // })

    // document.getElementById('debug-btn-1').addEventListener('click', (e) => {
    //     // screenSurface.getWorldQuaternion(camera.quaternion)  
    //     // screenSurface.getWorldPosition(camera.position);
    //     // camera.lookAt( screenSurface.position.x,screenSurface.position.y-Math.sin(screenSurface.rotation.x)*0.2,screenSurface.position.z );
    //     zoom = 1
    //     console.log(camera)
    // })


    window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(vw(100), vh(100));

}

function render() {
    requestAnimationFrame(render);
    // document.getElementById('debug').innerHTML = obj_notebook.children[0].rotation.x

    const lightTime = Date.now() * 0.001;
    lights.forEach((l, ind) => {
        l.position.x = Math.sin(lightTime - ind * Math.PI / 1.5) * 6;
        l.position.y = 4 - Math.sin(lightTime * 2 - ind * Math.PI / 1.5) * 1;
        l.position.z = Math.cos(lightTime - ind * Math.PI / 1.5) * 6;
    })


    if (pendingRenderFunctions.length > 0) {
        pendingRenderFunctions.shift()();
    }


    renderer.render(scene, camera);

}

function calcDisabled(speed, onComplete) {
    if (laptopAnimationTime === 2 && speed > 0) {
        onComplete();
        return true
    }
    if (laptopAnimationTime === 0 && speed < 0) {
        onComplete();
        return true
    }
    return false
}

function scroll(speed, scrollTimeout) {
    console.log(speed, laptopAnimationTime)


    if(scrollTimeout!==undefined){scrollTimeout.restart(true);}

    const display_center_coords = new THREE.Vector3(
        screenSurface.position.x,
        screenSurface.position.y - Math.sin(screenSurface.rotation.x) * 0.4,
        screenSurface.position.z
    )
    camera.lookAt(display_center_coords);


    laptopAnimationTime = Math.max(0, Math.min(2, laptopAnimationTime + speed))

    if (0 <= laptopAnimationTime && laptopAnimationTime <= 1) {
        obj_notebook.children[0].rotation.x = NOTEBOOK_CLOSE_X + easeOutCubic(Math.min(1, laptopAnimationTime)) * (NOTEBOOK_OPEN_X - NOTEBOOK_CLOSE_X)
        obj_notebook.children[0].getWorldQuaternion(screenSurface.quaternion)
    }
    // var newpos = camera.position.add( display_center_coords.sub(cameraPosVector).divideScalar(1000) )
    var newpos = cameraPosVector.clone().lerp(display_center_coords.clone(), laptopAnimationTime - 1.0)
    // console.log(
    //     "\n",
    //     laptopAnimationTime, 
    //     newpos.distanceTo(display_center_coords),
    //     cameraPosVector,
    //     display_center_coords,
    //     "\n"
    //     )
    if (laptopAnimationTime > 1 && newpos.distanceTo(display_center_coords) > 0.1) {
        camera.position.x = newpos.x
        camera.position.y = newpos.y
        camera.position.z = newpos.z
    }

}



function gsapInit() {

    


    

    // / / / / / / / / //
    // create an observer and disable it to start
    if (getComputedStyle(document.body).getPropertyValue('--mobile') == 0) {
        var scrollTimeout = gsap.delayedCall(1, () => allowScroll = true).pause(); // controls how long we should wait after an Observer-based animation is initiated before we allow another scroll-related action
        const onUpDown = (event) => {
            console.log("ud", event, "vY", event.velocityY, "iD", event.isDragging)
            velocity = event.velocityY * (event.isDragging ? 1 : 1);
            for (var i = 0; i < 15; i += 1) {
                if (calcDisabled(Math.sign(event.deltaY) * 0.0025 + velocity / 200000, () => { ltObserver.disable() })) { return }
                pendingRenderFunctions.push(
                    () => {
                        scroll(Math.sign(event.deltaY) * 0.0025 + velocity / 200000, scrollTimeout)
                    }
                )
    
    
            }
        }
        var ltObserver = ScrollTrigger.observe({
            type: "wheel,touch",
            onUp: (self) => onUpDown(self),
            onDown: (self) => onUpDown(self),
            tolerance: 10,
            preventDefault: true,
            onEnable(self) {
                scrollTimeout.restart(true);
                // when enabling, we should save the scroll position and freeze it. This fixes momentum-scroll on Macs, for example.
                let savedScroll = self.scrollY();
                self._restoreScroll = () => self.scrollY(savedScroll); // if the native scroll repositions, force it back to where it should be
                document.addEventListener("scroll", self._restoreScroll, { passive: false });
            },
            onDisable: self => document.removeEventListener("scroll", self._restoreScroll),
            onPress: self => {
                // on touch devices like iOS, if we want to prevent scrolling, we must call preventDefault() on the touchstart (Observer doesn't do that because that would also prevent side-scrolling which is undesirable in most cases)
                ScrollTrigger.isTouch && self.event.preventDefault()
            }
        });
        ltObserver.disable();


        // pin swipe section and initiate observer
        ScrollTrigger.create({
            trigger: ".portfolio",
            pin: true,
            start: "top top",
            end: "+=500", // just needs to be enough to not risk vibration where a user's fast-scroll shoots way past the end
            onEnter: (self) => {
                if (ltObserver.isEnabled) { return } // in case the native scroll jumped past the end and then we force it back to where it should be.
                self.scroll(self.start + 1); // jump to just one pixel past the start of this section so we can hold there.
                ltObserver.enable(); // STOP native scrolling
            },
            onEnterBack: (self) => {
                if (ltObserver.isEnabled) { return } // in case the native scroll jumped backward past the start and then we force it back to where it should be.
                self.scroll(self.end - 1); // jump to one pixel before the end of this section so we can hold there.
                ltObserver.enable(); // STOP native scrolling
            }
        });
    }
    else {
        ScrollTrigger.create({
            trigger: ".portfolio",
            start: "top bottom",
            onEnter: (self) => {
                for (var i = 0; i < 45; i++) {
                    pendingRenderFunctions.push(
                        () => {
                            scroll(0.05)
                        }
                    )
                }
            },
            onEnterBack: (self) => {
                for (var i = 0; i < 45; i++) {
                    pendingRenderFunctions.push(
                        () => {
                            scroll(-0.05)
                        }
                    )
                }
            }
        });
    }
}

