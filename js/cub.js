var container;
var camera, scene, renderer, stats;
var group;
var targetRotationX = 0;
var targetRotationXOnMouseDown = 0;
var targetRotationY = 0;
var targetRotationYOnMouseDown = 0;
var mouseX = 0;
var mouseY = 0;
var mouseXOnMouseDown = 0;
var mouseYOnMouseDown = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {
  //Prepare container
  container = document.createElement('div');
  document.body.appendChild(container);

  var info = document.createElement('div');
  info.style.position = 'absolute';
  info.style.top = '10px';
  info.style.width = '100%';
  info.style.textAlign = 'center';
  info.style.fontSize = '18px';
  info.innerHTML = 'Drag to spin';
  container.appendChild(info);

  // Create main scene
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xcce0ff, 0.0003);
  this.scene.add(new THREE.AmbientLight(0x444444));
  // webgl renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(this.scene.fog.color);
  //perspective camera
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
  var dirLight = new THREE.DirectionalLight(0xffffff);
  dirLight.position.set(200, 200, 1000).normalize();
  this.camera.add(dirLight);
  this.camera.add(dirLight.target);
  camera.position.set(0, 0, 600);
  scene.add(camera);

  var light = new THREE.PointLight(0xffffff, 0.8);
  camera.add(light);

  group = new THREE.Group();
  scene.add(group);

  geometry = new THREE.SphereGeometry(20, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2);
  // generate cub
  var x = -150;
  var y = 50;
  for (var i = 0; i < 7; i++) {
    for (var j = -3; j < 4; j++) {
      generateSphere(x, y * j, -150);
      generateSphere(x, y * j, -100);
      generateSphere(x, y * j, -50);
      generateSphere(x, y * j, 0);
      generateSphere(x, y * j, 50);
      generateSphere(x, y * j, 100);
      generateSphere(x, y * j, 150);
    }
    x += 50;
  }

  container.appendChild(renderer.domElement);

  stats = new Stats();
  container.appendChild(stats.dom);

  document.addEventListener('mousedown', onDocumentMouseDown, false);
  document.addEventListener('touchstart', onDocumentTouchStart, false);
  document.addEventListener('touchmove', onDocumentTouchMove, false);

  window.addEventListener('resize', onWindowResize, false);
}
//x,y,z - coordonate
function generateSphere(x, y, z) {
  material = new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff });
  material.transparent = true;
  sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(x, y, z);
  group.add(sphere);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseDown(event) {
  event.preventDefault();
  document.addEventListener('mousemove', onDocumentMouseMove, false);
  document.addEventListener('mouseup', onDocumentMouseUp, false);
  document.addEventListener('mouseout', onDocumentMouseOut, false);

  mouseXOnMouseDown = event.clientX - windowHalfX;
  mouseYOnMouseDown = event.clientY - windowHalfY;
  targetRotationXOnMouseDown = targetRotationX;
  targetRotationYOnMouseDown = targetRotationY;
}
function onDocumentMouseMove(event) {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
  targetRotationX = targetRotationXOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.02;
  targetRotationY = targetRotationYOnMouseDown + (mouseY - mouseYOnMouseDown) * 0.02;
}
function onDocumentMouseUp(event) {
  document.removeEventListener('mousemove', onDocumentMouseMove, false);
  document.removeEventListener('mouseup', onDocumentMouseUp, false);
  document.removeEventListener('mouseout', onDocumentMouseOut, false);
}
function onDocumentMouseOut(event) {
  document.removeEventListener('mousemove', onDocumentMouseMove, false);
  document.removeEventListener('mouseup', onDocumentMouseUp, false);
  document.removeEventListener('mouseout', onDocumentMouseOut, false);
}
function onDocumentTouchStart(event) {
  if (event.touches.length == 1) {
    event.preventDefault();
    mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
    targetRotationXOnMouseDown = targetRotationX;
    mouseYOnMouseDown = event.touches[0].pageY - windowHalfY;
    targetRotationYOnMouseDown = targetRotationY;
  }
}
function onDocumentTouchMove(event) {
  if (event.touches.length == 1) {
    event.preventDefault();
    mouseX = event.touches[0].pageX - windowHalfX;
    mouseY = event.touches[0].pageY - windowHalfY;

    targetRotationX = targetRotationXOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.05;
    targetRotationY = targetRotationYOnMouseDown + (mouseY - mouseYOnMouseDown) * 0.05;
  }
}

function animate() {
  requestAnimationFrame(animate);
  render();
  stats.update();
}
function render() {
  group.rotation.y += (targetRotationX - group.rotation.y) * 0.05;
  group.rotation.x += (targetRotationY - group.rotation.x) * 0.05;
  renderer.render(scene, camera);
}
