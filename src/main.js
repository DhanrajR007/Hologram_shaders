import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import vertexShader from "./shaders/hologram/vertex.glsl";
import fragmentShader from "./shaders/hologram/fragment.glsl";

const gui = new GUI();
const canvas = document.querySelector("#canvas");
const scene = new THREE.Scene();

const debugObject = {
  backgroundColor: "#000000",
  color: "#ff0000",
};

scene.background = new THREE.Color(debugObject.backgroundColor);
gui.addColor(debugObject, "backgroundColor").onChange(() => {
  scene.background.set(debugObject.backgroundColor);
});
gui.addColor(debugObject, "color").onChange(() => {
  material.uniforms.uColor.value.set(debugObject.color);
});

const geometry = new THREE.SphereGeometry(1, 128, 128);
const material = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  side: THREE.DoubleSide,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  transparent: true,
  uniforms: {
    uTime: new THREE.Uniform(0),
    uColor: new THREE.Uniform(new THREE.Color(debugObject.color)),
  },
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  material.uniforms.uTime.value = elapsedTime;
  sphere.rotation.x += 0.0001;
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
