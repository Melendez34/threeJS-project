import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

let myCanvas = document.getElementById("myCanvas");

let scene = new THREE.Scene();
let renderer = new THREE.WebGLRenderer({ canvas: myCanvas });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x0f4c5c);
renderer.setPixelRatio(window.devicePixelRatio);

let ambientLight = new THREE.AmbientLight();
scene.add(ambientLight);

let pointLightA = new THREE.PointLight(0xffffff, 5, 100);
pointLightA.position.set(10, 10, 10);
scene.add(pointLightA);

let pointLightB = new THREE.PointLight(0xffffff, 10, 100);
pointLightB.position.set(-5, -5, -5);
scene.add(pointLightB);

let camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(100, 50, 100);

let orbit = new OrbitControls(camera, renderer.domElement);
let gui = new GUI({ width: 250 });

let actions = {};
let currentAction;

let pause_resume = {
  "pause - resume": () => {
    if (currentAction) {
      currentAction.paused = !currentAction.paused;
    }
  },
};
gui.add(pause_resume, "pause - resume");

let folder = gui.addFolder("Actions");
let loader = new GLTFLoader();
let clock = new THREE.Clock();
let mixer;

loader.load("Models/start_pack.glb", (glb) => {
  mixer = new THREE.AnimationMixer(glb.scene);
  for (const value of glb.animations) {
    let action = mixer.clipAction(value);
    actions[value.name] = () => {
      mixer.stopAllAction();
      action.play();
      current_action = action;
    };
    folder.add(actions, value.name);
  }
  scene.add(glb.scene);
  animate();
});
let animate = function () {
  requestAnimationFrame(animate);
  mixer.update(clock.getDelta());
  renderer.render(scene, camera);
};
