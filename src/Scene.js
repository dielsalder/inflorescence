import React, {Component} from 'react';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import PropTypes from 'prop-types';
import * as DrawFlower from './js-plant-gen/DrawFlower';

class Scene extends Component{
  static propTypes = {
    /** number of petals */
    numPetals: PropTypes.number,
    /** pitch of petals in degrees */
    petalPitch: PropTypes.number,
    petalLength: PropTypes.number,
    /** X coordinate of petal inner control point relative to length - between -1 and 1 */
    petalInnerXRelative: PropTypes.number,
    /** Y coordinate of petal inner control point relative to length - between -1 and 1 */
    petalInnerYRelative: PropTypes.number,
    /** X coordinate of petal outer control point relative to length - between -1 and 1 */
    petalOuterXRelative: PropTypes.number,
    /** Y coordinate of petal outer control point relative to length - between -1 and 1 */
    petalOuterYRelative: PropTypes.number,
    stemHeight:PropTypes.string,
    /** color of leaves and stems -- hex code */
    leafStemColor: PropTypes.string,
    /** color of flowers - hex code */
    flowerColor: PropTypes.string,
    flowerUpdated: PropTypes.Boolean,
    leafUpdated: PropTypes.Boolean,
    parent:Component
  }
  constructor(props){
    super(props);
    this.state={
      centerSides : 3,
      centerBottomRadius : 0,
      centerTopRadius : 0,
      centerHeight : 0.25,
      centerTranslateZ : 0.25,
    }
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.animate = this.animate.bind(this);
    this.renderScene = this.renderScene.bind(this);
    this.computeBoundingBox = this.computeBoundingBox.bind(this);
    this.setupScene = this.setupScene.bind(this);
    this.destroyContext = this.destroyContext.bind(this);
    this.handleWindowResize = this.handleWindowResize.bind(this);

    this.stemHeight = 15;
    this.wireMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true
    });
    this.centerMaterial = new THREE.MeshLambertMaterial( {
      color:"#ffe600",
      flatshading: true
    });
    // this.leafStemColor = "#69a339";
  }

  componentWillMount(){
    window.addEventListener('resize', this.handleWindowResize)
  }

  componentDidMount(){
    this.setupScene();
  }

  componentDidUpdate(prevProps){
    console.log("redrawing...");
    if(this.props.flowerUpdated){
      this.redrawFlower();
      this.props.parent.state.flowerUpdated = false;
    }
    if(this.props.leafUpdated){
      console.log("redrawing leaves");
      this.redrawLeaves();
      console.log(this.leafMesh);
      this.props.parent.state.leafUpdated=false;
    }
  }

  updateObject(){
    // doesn't work rip
    this.removeMesh(this.object);
    let mesh = DrawFlower.plantModel(this.props);
    this.object = mesh;
  }

  redrawAll(){
    this.redrawFlower();
    this.redrawLeaves();
  }

  addFlowerMesh(){
    // x values are 0 and 1 by default
    this.flowerMesh = DrawFlower.flowerMesh(this.props); 
    this.scene.add(this.flowerMesh)
    console.log("flower rendered");
  }
  addStemMesh(){
    // draw stem
    this.stemMesh = DrawFlower.stemMesh(this.props);
    this.scene.add(this.stemMesh);
  }
  addLeafMesh(){
    this.leafMesh=DrawFlower.leafMesh(this.props);
    this.scene.add(this.leafMesh);
  }
  addCenterMesh(){
    // not currently using
    // draw stamens/disk as cylinder
    let centerGeometry = new THREE.CylinderGeometry(this.state.centerTopRadius, this.state.centerBottomRadius, this.state.centerHeight, this.state.centerSides);
    centerGeometry.rotateX(0.5*Math.PI);
    let centerMesh = new THREE.Mesh(centerGeometry, this.centerMaterial);
    centerMesh.translateOnAxis(new THREE.Vector3(0,0,1), this.state.centerTranslateZ);
    this.scene.add(centerMesh);

  }

  removeMesh(mesh){
    mesh.geometry.dispose();
    mesh.material.dispose();
    this.scene.remove(mesh);
  }

  redrawFlower(){
    this.removeMesh(this.flowerMesh);
    this.addFlowerMesh();
  }
  redrawLeaves(){
    this.removeMesh(this.leafMesh);
    this.addLeafMesh();
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

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('white');

    let cameraPersp = new THREE.PerspectiveCamera(60, this.width/this.height, 0.25, 1000);
    let camera = cameraPersp;
    this.scene.add(camera);


    // draw flower
    this.addFlowerMesh();
    this.addStemMesh();
    this.addLeafMesh();

    this.renderer = renderer;
    this.scene = this.scene;
    this.camera = camera;

    // set this.object to combo of all meshes - the only use of this is to get bounding box so texture doesn't matter
    let mesh = DrawFlower.plantModel(this.props);
    this.object = mesh;

    let spotLight = new THREE.SpotLight(0xffffff, 0.9)
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
    this.renderToFile();
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

  renderToFile(){
    this.renderScene();
    let imgData = this.renderer.domElement.toDataURL("image/png");
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