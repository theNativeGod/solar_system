import './style.css';
import * as THREE from 'https://github.com/theNativeGod/solar_system/tree/d7837a2469af6408e53030e0b2bee9201b900830/node_modules/three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


//new scene
const scene = new THREE.Scene()

//initialize geometry 
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)

//initialize textureLoader
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
cubeTextureLoader.setPath('static/textures/cubeMap/')

//loading textures
const sunTexture = textureLoader.load('./static/textures/2k_sun.jpg')
const mercuryTexture = textureLoader.load('./static/textures/2k_mercury.jpg')
const venusTexture = textureLoader.load('./static/textures/2k_venus_surface.jpg')
const earthTexture = textureLoader.load('./static/textures/2k_earth_daymap.jpg')
const marsTexture = textureLoader.load('./static/textures/2k_mars.jpg')
const moonTexture = textureLoader.load('./static/textures/2k_moon.jpg')
const backgroundCubeMap = cubeTextureLoader.load([
  'px.png',
  'nx.png',
  'py.png',
  'ny.png',
  'pz.png',
  'nz.png',
])

scene.background = backgroundCubeMap

//initailize sun
const sunMaterial = new THREE.MeshBasicMaterial({
  map: sunTexture,

})
const sun = new THREE.Mesh(sphereGeometry, sunMaterial)

sun.scale.setScalar(5)

scene.add(sun)

//initialize planet materials

const mercuryMaterial = new THREE.MeshStandardMaterial({
  map: mercuryTexture
})

const venusMaterial = new THREE.MeshStandardMaterial({
  map: venusTexture
})

const earthMaterial = new THREE.MeshStandardMaterial({
  map: earthTexture
})

const marsMaterial = new THREE.MeshStandardMaterial({
  map: marsTexture
})

const moonMaterial = new THREE.MeshStandardMaterial({
  map: moonTexture
})






const planets = [
  {
    name: 'Mercury',
    radius: .5,
    distance: 10,
    speed: 0.01,
    material: mercuryMaterial,
    moons: [],
  },
  {
    name: 'Venus',
    radius: .8,
    distance: 15,
    speed: 0.007,
    material: venusMaterial,
    moons: [],
  },
  {
    name: 'Earth',
    radius: 1,
    distance: 20,
    speed: 0.005,
    material: earthMaterial,
    moons: [{
      name: 'Moon',
      radius: 0.3,
      distance: 2,
      speed: 0.015,
    }]
  }, {
    name: 'Mars',
    radius: .7,
    distance: 25,
    speed: 0.003,
    material: marsMaterial,
    moons: [{
      name: 'Phobos',
      radius: 0.1,
      distance: 2,
      speed: 0.02,
    },
    {
      name: 'Deimos',
      radius: .2,
      distance: 3,
      speed: .015,
      color: 0xffffff,
    },
    ]
  },]

const planetMeshes = planets.map((planet) => {
  //create the mesh
  const planetMesh = new THREE.Mesh(sphereGeometry, planet.material)
  //set the scale
  planetMesh.scale.setScalar(planet.radius)
  planetMesh.position.x = planet.distance
  //add it to out scene
  scene.add(planetMesh)
  //loop through each moon and create the moon 
  planet.moons.forEach((moon) => {
    const moonMesh = new THREE.Mesh(
      sphereGeometry,
      moonMaterial
    )
    moonMesh.scale.setScalar(moon.radius)
    moonMesh.position.x = moon.distance
    planetMesh.add(moonMesh)

  })

  return planetMesh

})








//ambient light
const ambientLight = new THREE.AmbientLight('white', .1)
scene.add(ambientLight)

//point light
const pointLight = new THREE.PointLight('white', 500)
scene.add(pointLight)

//initialize camera
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  400,
)

camera.position.z = 100
camera.position.y = 5

//initialize canvas
const canvas = document.querySelector('canvas.threejs')

//initialize renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})


//initialize orbit controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

camera.aspect = window.innerWidth / window.innerHeight
camera.updateProjectionMatrix()

renderer.setSize(window.innerWidth, window.innerHeight)

const maxPixelRatio = Math.min(window.devicePixelRatio, 2)
renderer.setPixelRatio(maxPixelRatio)

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
})





//renderloop

const renderloop = () => {
  sun.rotation.y += .01
  planetMeshes.forEach((planet, index) => {
    planet.rotation.y += 3 * planets[index].speed
    planet.position.x = Math.sin(planet.rotation.y) * planets[index].distance
    planet.position.z = Math.cos(planet.rotation.y) * planets[index].distance
    planet.children.forEach((moon, moonIndex) => {
      moon.rotation.y += planets[index].moons[moonIndex].speed * 3
      moon.position.x = Math.sin(moon.rotation.y) * planets[index].moons[moonIndex].distance
      moon.position.z = Math.cos(moon.rotation.y) * planets[index].moons[moonIndex].distance

    })
  })

  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(renderloop)
}

renderloop()

console.log(renderloop)
