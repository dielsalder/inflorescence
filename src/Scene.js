import React, {Component} from 'react';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';

class Scene extends Component{
  constructor(props){
    super(props);
    this.state={
    }
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.animate = this.animate.bind(this);
    this.renderScene = this.renderScene.bind(this);
    this.computeBoundingBox = this.computeBoundingBox.bind(this);
    this.setupScene = this.setupScene.bind(this);
    this.destroyContext = this.destroyContext.bind(this);
    this.handleWindowResize = this.handleWindowResize.bind(this);
  }

  componentWillMount(){
    window.addEventListener('resize', this.handleWindowResize)
  }

  componentDidMount(){
    this.setupScene();
  }

  petalGeometry(xOrigin, yOrigin, petalLength, width1, width2){
    // petal shape control - keep these positive to avoid clipping, but clipping also looks sorta cool
    let yCp1 = width1;
    let yCp2 = width2;
    // lies along x Axis
    let xCp1 = 0;
    let xCp2 = petalLength;

    // curve along x axis from (xOrigin, yOrigin) to (xOrigin, petalLength)
    var petalShape = new THREE.Shape();
    petalShape.bezierCurveTo( xOrigin + xCp1, yOrigin + yCp1, xOrigin + xCp2, yOrigin+yCp2, petalLength, yOrigin );
    petalShape.bezierCurveTo( xOrigin + xCp2, yOrigin - yCp2, xOrigin + xCp1, yOrigin-yCp1, xOrigin, yOrigin);

    var geometry = new THREE.ShapeGeometry( petalShape );
    return geometry;
  }
  leafGeometry(xOrigin, yOrigin, leafLength, width1, width2, leafFoldAngle){
    // petal shape control - keep these positive to avoid clipping, but clipping also looks sorta cool
    let yCp1 = width1;
    let yCp2 = width2;
    // lies along x Axis
    let xCp1 = 0;
    let xCp2 = leafLength;

    var shape1 = new THREE.Shape();
    shape1.bezierCurveTo( xOrigin + xCp1, yOrigin + yCp1, xOrigin + xCp2, yOrigin+yCp2, leafLength, yOrigin );
    // draw 2 halves of leaf by copying and rotating the geometry
    var geometry1 = new THREE.ShapeGeometry( shape1 );
    var shape2 = new THREE.Shape();
    shape2.bezierCurveTo( xOrigin + xCp1, yOrigin - yCp1, xOrigin + xCp2, yOrigin-yCp2, leafLength, yOrigin );
    var geometry2 = new THREE.ShapeGeometry( shape2);
    geometry1.rotateX(leafFoldAngle);
    geometry2.rotateX(-leafFoldAngle);
    geometry2.merge(geometry1);
    return geometry2;
  }
  setupScene(){
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;
    
    const renderer = new THREE.WebGLRenderer({antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.gammaOutput = true;
    renderer.gammaFactor = 2.2
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    let scene = new THREE.Scene();
    scene.background = new THREE.Color('white');

    let cameraPersp = new THREE.PerspectiveCamera(60, this.width/this.height, 0.25, 1000);
    let camera = cameraPersp;
    scene.add(camera);


    let wireMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true
    });
    let material = wireMaterial;

    // draw flower
    let flowerMaterial = new THREE.MeshLambertMaterial({
      color:"#24afff"
    }); 

    let numPetals = 12;
    let petalPitch = 30*Math.PI/180;
    let petalLength = 6;
    let innerPoint = -1;
    let outerPoint = 3;
    let flowerGeometry = new THREE.Geometry();
    for (let i = 0; i < numPetals; i++){
      let petalGeometry = this.petalGeometry(0,0,petalLength,innerPoint, outerPoint);
      petalGeometry.rotateY(-petalPitch);
      let rotAngle = 2*Math.PI/ numPetals;
      petalGeometry.rotateZ(rotAngle*i);
      flowerGeometry.merge(petalGeometry);
    }
    var flowerMesh = new THREE.Mesh( flowerGeometry, flowerMaterial) ;
    scene.add(flowerMesh)

    // draw stamens/disk as cylinder
    let centerMaterial = new THREE.MeshLambertMaterial( {
      color:"#ffe600",
      flatshading: true
    });
    let centerSides = 6;
    let centerBottomRadius = 0;
    let centerTopRadius = 1;
    let centerHeight = .5;
    let centerGeometry = new THREE.CylinderGeometry(centerTopRadius, centerBottomRadius, centerHeight, centerSides);
    centerGeometry.rotateX(0.5*Math.PI);
    let centerMesh = new THREE.Mesh(centerGeometry, centerMaterial);
    centerMesh.translateOnAxis(new THREE.Vector3(0,0,1), centerHeight);
    scene.add(centerMesh);

    let leafStemColor = "#96c76b";
    // draw stem
    let stemHeight = 15;
    let stemMaterial = new THREE.MeshBasicMaterial({
      color: leafStemColor,
    })
    let stemRadius = 0.25;
    let stemGeometry = new THREE.CylinderGeometry(stemRadius, stemRadius, stemHeight,3);
    stemGeometry.rotateX(0.5*Math.PI);
    let stemMesh = new THREE.Mesh(stemGeometry, stemMaterial);
    // move stem so its top is level with flower base
    stemMesh.translateOnAxis(new THREE.Vector3(0,0,-1),  0.5* stemHeight);
    scene.add(stemMesh);

    //draw leaves
    let leafMaterial = new THREE.MeshLambertMaterial({
      color:leafStemColor,
      flatshading:true
    });
    let leafRotAngle = 100 * (Math.PI/180);
    let leafFoldAngle = 20 * (Math.PI/180);
    let leafLength = 10;
    let leafVertSpacing = 2;
    let leafInner = 5;
    let leafOuter = -1;
    let leafPitch = 15*(Math.PI/180);
    // make bottom bound work? right now it starts at 0 no matter what
    let leavesTopBound = -stemHeight*0.8;
    let leavesBottomBound =  -stemHeight;
    let translateBy = -1000;
    // absolutely no leaves above here
    let flowersTopBound = -petalLength*Math.sin(petalPitch);
    for (let i = 0; translateBy < leavesTopBound && translateBy < flowersTopBound; i++){
      translateBy += (leafVertSpacing-stemHeight);
      let leafGeometry = this.leafGeometry(0,0,leafLength,leafInner, leafOuter, leafFoldAngle);
      leafGeometry.rotateY(-leafPitch);
      leafGeometry.rotateZ(i*leafRotAngle);
      let leafMesh = new THREE.Mesh(leafGeometry, leafMaterial);
      //cut off if above flower plane
      leafMesh.translateOnAxis(new THREE.Vector3(0,0,1),translateBy);
      scene.add(leafMesh);
    }

    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;

    // set this.object to combo of all meshes - the only use of this is to get bounding box so texture doesn't matter
    let allGeometry = new THREE.Geometry();
    allGeometry.merge(stemGeometry);
    allGeometry.merge(flowerGeometry);
    var allMesh = new THREE.Mesh( allGeometry, material ) ;
    this.object = allMesh;

    let spotLight = new THREE.SpotLight(0xffffff, 1)
    spotLight.position.set(10, 20, 15);
    camera.add(spotLight);
    this.spotLight = spotLight;

    let ambLight = new THREE.AmbientLight(0x333333);
    ambLight.position.set(5, 3, 5);
    this.camera.add(ambLight);

    this.computeBoundingBox();
    // console.log(this.camera.zoom, this.camera.near, this.camera.far, this.camera.left, this.camera.right, this.camera.top, this.camera.bottom);
    // console.log(this.object.position);
    // console.log(this.camera.getWorldDirection());
  }

  computeBoundingBox(){
    let offset = 1.60;
    const boundingBox = new THREE.Box3();
    boundingBox.setFromObject(this.object);
    const center = boundingBox.getCenter();
    const size = boundingBox.getSize();
    const maxDim = Math.max( size.x, size.y, size.z );
    const fov = this.camera.fov * ( Math.PI / 180 );
    let cameraZ = maxDim / 2 / Math.tan( fov / 2 );
    cameraZ *= offset;
    this.camera.position.z = center.z + cameraZ;
    const minZ = boundingBox.min.z;
    const cameraToFarEdge = ( minZ < 0 ) ? -minZ + cameraZ : cameraZ - minZ;

    this.camera.far = cameraToFarEdge * 3;
    this.camera.lookAt(center);
    this.camera.updateProjectionMatrix();

    let controls = new OrbitControls( this.camera, this.renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.zoomSpeed = 0.1;
    controls.enableKeys = false;
    controls.screenSpacePanning = false;
    controls.enableRotate = true;
    controls.autoRotate = false;
    controls.dampingFactor = 1;
    controls.autoRotateSpeed = 1.2;
    controls.enablePan = false;
    controls.target.set(center.x, center.y, center.z);
    controls.update();
    this.controls = controls;
    this.renderer.setSize(this.width, this.height);
    this.container.appendChild(this.renderer.domElement);
    this.start();
  }
  
  start(){
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate)
    }
  }

  renderScene(){
    this.renderer.render(this.scene, this.camera)
  }

  animate() {
    this.frameId = requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderScene();
  }

  stop() {
    cancelAnimationFrame(this.frameId);
  }

  handleWindowResize(){
    let width = window.innerWidth;
    let height = window.innerHeight;
    this.camera.aspect = width/height;
    this.camera.updateProjectionMatrix();
  }

  componentWillUnmount(){
    this.stop();
    this.destroyContext();
  }

  destroyContext(){
    this.container.removeChild(this.renderer.domElement);
    this.renderer.forceContextLoss();
    this.renderer.context = null;
    this.renderer.domElement = null;
    this.renderer = null;
  }


  render(){
    const width = '100%';
    const height = '100%';
    return(
      <div 
        ref={(container) => {this.container = container}}
        style={{width: width, height: height, position: 'absolute', overflow: 'hidden'}}
      >
      </div>
    )
  }
  
}

export default Scene;