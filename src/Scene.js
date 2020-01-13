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

  petalGeometry(){

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
    let cameraOrthographic = new THREE.OrthographicCamera( 
      this.width / - 2, this.width / 2, this.height / 2, this.height / - 2, 0.25, 1000);

    let camera = cameraPersp;
    scene.add(camera);


    let white = new THREE.MeshBasicMaterial({color:"white"}); 
    let wireMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true
    });
    let material = wireMaterial;


    let boxMesh = new THREE.Mesh(new THREE.BoxGeometry(0.2,1,1), material);
    let xOrigin = 0, yOrigin = 0;
    let petalLength = 10;
    let petalWidth = 5;
    // petal shape control - keep these positive to avoid clipping, but clipping also looks sorta cool
    let yCp1 = 6;
    let yCp2 = 1;
    // lies along x Axis
    let xCp1 = 0;
    let xCp2 = petalLength;

    // curve along x axis from (xOrigin, yOrigin) to (xOrigin, petalLength)
    var petalShape = new THREE.Shape();
    petalShape.bezierCurveTo( xOrigin + xCp1, yOrigin + yCp1, xOrigin + xCp2, yOrigin+yCp2, petalLength, yOrigin );
    petalShape.bezierCurveTo( xOrigin + xCp2, yOrigin - yCp2, xOrigin + xCp1, yOrigin-yCp1, xOrigin, yOrigin);

    var geometry = new THREE.ShapeGeometry( petalShape );
    // var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var mesh = new THREE.Mesh( geometry, material ) ;
    scene.add( mesh );
    // sphere = new THREE.SphereGeometry(50.1, 300, 300)
    scene.add(mesh)
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.object = mesh;

    let spotLight = new THREE.SpotLight(0xffffff, 0.25)
    spotLight.position.set(45, 50, 15);
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