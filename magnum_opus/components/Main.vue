<script setup>
// import * as THREE from './node_modules/three/src/three.js';
// import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';
// import { gsap } from "gsap";
// import { VertexNormalsHelper } from './node_modules/three/examples/jsm/helpers/VertexNormalsHelper.js';
// import * as CameraUtils from './node_modules/three/examples/jsm/utils/CameraUtils.js';
// import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';

import fetch from "node-fetch";
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from "gsap";
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper.js';
import * as CameraUtils from 'three/examples/jsm/utils/CameraUtils.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';



let camera, scene, renderer;

let object;

const NOTEBOOK_CLOSE_X = -3.15
const NOTEBOOK_OPEN_X = -1

init();

var obj_notebook, screen, screenPortal;

var portalCamera, screen_copy, rightPortal, screenPortalTexture, reflectedPosition,
				rightPortalTexture, bottomLeftCorner, bottomRightCorner, topLeftCorner;

function init() {
	const planeGeo = new THREE.PlaneGeometry( 1.0, 1.0 );

	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 20);
	camera.position.x = 0;
	camera.position.y = 1.83;
	camera.position.z = -1.7;
	
	camera.rotation.x = -2.4;
	camera.rotation.y = -0.01;
	camera.rotation.z = -3.14;
	
	
	// scene

	scene = new THREE.Scene();

	const ambientLight = new THREE.AmbientLight(0xffffff);
	scene.add(ambientLight);
	
	const pointLight = new THREE.PointLight(0xffffff, 15);
	camera.add(pointLight);
	
	scene.add(camera);
	
	
	

	// manager

	function loadModel() {
		console.log(object);

		// object.scene.traverse(function (child) {

		// 	if (child.type === 'Mesh') child.material.map = texture;

		// });
		const material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
		screen = object.scene.children[0].children[1]
		screen.material = material
		screen.material.map = texture;

		obj_notebook = object.scene
		// obj_notebook.children[0].rotation.x = NOTEBOOK_CLOSE_X

		scene.add(object.scene);

		
		//walls
		const planeFront = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0x7f7fff } ) );
		planeFront.position.z = 1;
		planeFront.position.y = 0.2;
		planeFront.rotateY( Math.PI );
		scene.add( planeFront );

		const planeRight = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0xff7f7f } ) );
		planeRight.position.x = -1;
		planeRight.position.y = 0.2;
		planeRight.rotateY( Math.PI/2 );
		scene.add( planeRight );

		const planeNear = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0x7fff7f } ) );
		planeNear.position.z = -1;
		planeNear.position.y = 0.2;
		scene.add( planeNear );
		
		
		//portals
		portalCamera = new THREE.PerspectiveCamera( 45, 1.0, 1, 20 );
		scene.add( portalCamera );
		bottomLeftCorner = new THREE.Vector3();
		bottomRightCorner = new THREE.Vector3();
		topLeftCorner = new THREE.Vector3();
		reflectedPosition = new THREE.Vector3();

		screenPortalTexture = new THREE.WebGLRenderTarget(1000, 1000 );
		screenPortal = new THREE.Mesh( screen.geometry.clone(),  new THREE.MeshBasicMaterial( { map: screenPortalTexture.texture } ));
		obj_notebook.children[0].getWorldQuaternion(screenPortal.quaternion)  
		obj_notebook.children[0].getWorldScale(screenPortal.scale)
		obj_notebook.children[0].getWorldPosition(screenPortal.position);
		scene.add( screenPortal );

	


		rightPortalTexture = new THREE.WebGLRenderTarget( 1000, 1000 );
		rightPortal = new THREE.Mesh( planeGeo, new THREE.MeshBasicMaterial( { map: rightPortalTexture.texture } ) );
		rightPortal.position.x = 0.6;
		rightPortal.position.y = 0.2;
		rightPortal.rotation.y+=3.14/2
		rightPortal.rotateX(3.14)
		scene.add( rightPortal );

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
	renderer.setSize(window.innerWidth, window.innerHeight);

	const controls = new OrbitControls(camera, renderer.domElement);
	controls.minDistance = 1;
	controls.maxDistance = 6;

	console.log("document")
	console.log(document)
	document.getElementById('three-notebook').appendChild(renderer.domElement);
	document.getElementById('debug-btn').addEventListener('click', (e)=>{
		console.log("camera")
		console.log(camera)
		console.log("display")
		console.log(object.scene.children[0].children[1])
	})

	
	window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}

function render() {
	requestAnimationFrame(render);
	// document.getElementById('debug').innerHTML = obj_notebook.children[0].rotation.x
	// console.log(main_obj)
	
	if (obj_notebook.children[0].rotation.x < NOTEBOOK_OPEN_X) {
		obj_notebook.children[0].rotation.x += 0.001
	}

	const currentRenderTarget = renderer.getRenderTarget();
	const currentXrEnabled = renderer.xr.enabled;
	const currentShadowAutoUpdate = renderer.shadowMap.autoUpdate;
	renderer.xr.enabled = false; // Avoid camera modification
	renderer.shadowMap.autoUpdate = false; // Avoid re-computing shadows

	// render the portal effect
	renderPortal( screenPortal, rightPortal, screenPortalTexture );
	renderPortal( rightPortal, screenPortal, rightPortalTexture );

	// restore the original rendering properties
	renderer.xr.enabled = currentXrEnabled;
	renderer.shadowMap.autoUpdate = currentShadowAutoUpdate;
	renderer.setRenderTarget( currentRenderTarget );

	renderer.render(scene, camera);

}

function renderPortal( thisPortalMesh, otherPortalMesh, thisPortalTexture ) {

	// set the portal camera position to be reflected about the portal plane
	thisPortalMesh.worldToLocal( reflectedPosition.copy( camera.position ) );
	reflectedPosition.x *=  -1.0; reflectedPosition.z *= - 1.0;
	otherPortalMesh.localToWorld( reflectedPosition );
	portalCamera.position.copy( reflectedPosition );

	// grab the corners of the other portal
	// - note: the portal is viewed backwards; flip the left/right coordinates
	otherPortalMesh.localToWorld( bottomLeftCorner.set( 1.05, - 1.05, 0.0 ) );
	otherPortalMesh.localToWorld( bottomRightCorner.set( - 1.05, - 1.05, 0.0 ) );
	otherPortalMesh.localToWorld( topLeftCorner.set( 1.05, 1.05, 0.0 ) );
	// set the projection matrix to encompass the portal's frame
	CameraUtils.frameCorners( portalCamera, bottomLeftCorner, bottomRightCorner, topLeftCorner, false );

	// render the portal
	thisPortalTexture.texture.colorSpace = renderer.outputColorSpace;
	renderer.setRenderTarget( thisPortalTexture );
	renderer.state.buffers.depth.setMask( true ); // make sure the depth buffer is writable so it can be properly cleared, see #18897
	if ( renderer.autoClear === false ) renderer.clear();
	thisPortalMesh.visible = false; // hide this portal from its own rendering
	renderer.render( scene, portalCamera );
	thisPortalMesh.visible = true; // re-enable this portal's visibility for general rendering

}

function gsapInit() {
	let items = gsap.utils.toArray(".items"),
		pageWrapper = document.querySelector(".page-wrapper");

	items.forEach((container, i) => {
		let localItems = container.querySelectorAll(".item"),
			distance = () => {
				let lastItemBounds = localItems[localItems.length - 1].getBoundingClientRect(),
					containerBounds = container.getBoundingClientRect();
				return Math.max(0, lastItemBounds.right - containerBounds.right);
			};
		gsap.to(container, {
			x: () => -distance(), // make sure it dynamically calculates things so that it adjusts to resizes
			ease: "none",
			scrollTrigger: {
				trigger: container,
				start: "top top",
				pinnedContainer: pageWrapper,
				end: () => "+=" + distance(),
				pin: pageWrapper,
				scrub: true,
				invalidateOnRefresh: true // will recalculate any function-based tween values on resize/refresh (making it responsive)
			}
		})
	});
}
</script>

<template>
  <div>
    <header class="nav-menu">
      <br />
    </header>

    <section class="about-me">
      <br />
    </section>

    <section class="my-experience">
      <br />
    </section>

    <section class="portfolio">
      <h3 id="debug">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolore facilis
        nam, quos sit pariatur assumenda, tempore quaerat eligendi animi optio
        minus. Ipsam porro, quibusdam dolorem officia sapiente error perferendis
        at!
      </h3>
      <button id="debug-btn">debug</button>
      <div id="three-notebook"></div>
    </section>

    <section class="projects">
      <div class="card card-inline">
        <h3 class="card__header"></h3>
        <img src="" alt="" class="card__image" />
        <p class="card__body"></p>
      </div>
      <div class="card card-inline">
        <h3 class="card__header"></h3>
        <img src="" alt="" class="card__image" />
        <p class="card__body"></p>
      </div>
      <div class="card card-inline">
        <h3 class="card__header"></h3>
        <img src="" alt="" class="card__image" />
        <p class="card__body"></p>
      </div>
      <div class="card card-inline">
        <h3 class="card__header"></h3>
        <img src="" alt="" class="card__image" />
        <p class="card__body"></p>
      </div>
      <div class="card card-inline">
        <h3 class="card__header"></h3>
        <img src="" alt="" class="card__image" />
        <p class="card__body"></p>
      </div>
      <div class="card card-inline">
        <h3 class="card__header"></h3>
        <img src="" alt="" class="card__image" />
        <p class="card__body"></p>
      </div>
      <div class="card card-inline">
        <h3 class="card__header"></h3>
        <img src="" alt="" class="card__image" />
        <p class="card__body"></p>
      </div>
      <div class="card card-inline">
        <h3 class="card__header"></h3>
        <img src="" alt="" class="card__image" />
        <p class="card__body"></p>
      </div>
    </section>

    <section class="contacts">
      <br />
    </section>
    <footer class="footer">
      <br />
    </footer>

  </div>
</template>



