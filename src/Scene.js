import React, {Component} from 'react';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import PropTypes from 'prop-types';

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
    /** color of leaves and stems -- hex code */
    leafStemColor: PropTypes.string,
    /** color of flowers - hex code */
    flowerColor: PropTypes.string,
  }
  constructor(props){
    super(props);
    this.state={
      numPetals: this.props.numPetals,
      petalLength : this.props.petalLength,
      petalPitch:this.props.petalPitch*Math.PI/180,
      petalInner : this.props.petalLength*this.props.petalInnerYRelative,
      petalOuter : this.props.petalLength*this.props.petalOuterYRelative,

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

    this.stemRadius = 0.25;
    this.stemHeight = 15;
    this.flowerMaterial = new THREE.MeshLambertMaterial({
      color:this.props.flowerColor
    }); 
    this.wireMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true
    });
    this.leafMaterial = new THREE.MeshLambertMaterial({
      color:this.props.leafStemColor,
      flatshading:true
    });
    this.centerMaterial = new THREE.MeshLambertMaterial( {
      color:"#ffe600",
      flatshading: true
    });
    this.stemMaterial = new THREE.MeshBasicMaterial({ color: this.props.leafStemColor, })
    // this.leafStemColor = "#69a339";
  }

  componentWillMount(){
    window.addEventListener('resize', this.handleWindowResize)
  }

  componentDidMount(){
    this.setupScene();
  }

  componentDidUpdate(){
    console.log(this.flowerMesh);
    console.log("update");
    this.redraw();
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

  flowerGeometry(numPetals, petalLength, petalInner, petalOuter, petalPitch){
    let flowerGeometry = new THREE.Geometry();
    for (let i = 0; i < numPetals; i++){
      let petalGeometry = this.petalGeometry(0,0,petalLength,petalInner, petalOuter);
      petalGeometry.rotateY(-petalPitch);
      let rotAngle = 2*Math.PI/ numPetals;
      petalGeometry.rotateZ(rotAngle*i);
      flowerGeometry.merge(petalGeometry);
    }
    return flowerGeometry;
  }

  addFlowerMesh(){
    let flowerGeometry = this.flowerGeometry( this.props.numPetals,this.state.petalLength,this.state.petalInner,this.state.petalOuter, this.state.petalPitch); 
    this.flowerMesh = new THREE.Mesh(flowerGeometry, this.flowerMaterial) ;
    this.scene.add(this.flowerMesh)
    console.log("number of petals=" + JSON.stringify(this.props.numPetals));
    console.log("flower rendered");
  }

  removeMesh(mesh){
    mesh.geometry.dispose();
    mesh.material.dispose();
    this.scene.remove(mesh);
  }

  redraw(){
    this.removeMesh(this.flowerMesh);
    this.addFlowerMesh();
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

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('white');

    let cameraPersp = new THREE.PerspectiveCamera(60, this.width/this.height, 0.25, 1000);
    let camera = cameraPersp;
    this.scene.add(camera);


    // draw flower
    this.addFlowerMesh();

    // draw stamens/disk as cylinder
    let centerGeometry = new THREE.CylinderGeometry(this.state.centerTopRadius, this.state.centerBottomRadius, this.state.centerHeight, this.state.centerSides);
    centerGeometry.rotateX(0.5*Math.PI);
    let centerMesh = new THREE.Mesh(centerGeometry, this.centerMaterial);
    centerMesh.translateOnAxis(new THREE.Vector3(0,0,1), this.state.centerTranslateZ);
    this.scene.add(centerMesh);

    // let leafStemColor = "#96c76b";
    // draw stem
    let stemGeometry = new THREE.CylinderGeometry(this.stemRadius, this.stemRadius, this.stemHeight,3);
    stemGeometry.rotateX(0.5*Math.PI);
    let stemMesh = new THREE.Mesh(stemGeometry, this.stemMaterial);
    // move stem so its top is level with flower base
    stemMesh.translateOnAxis(new THREE.Vector3(0,0,-1),  0.5* this.stemHeight);
    this.scene.add(stemMesh);

    //draw leaves
    let leafRotAngle = 120 * (Math.PI/180);
    let leafFoldAngle = 20 * (Math.PI/180);
    let leafLength = 10;
    let leafVertSpacing = 3;
    let leafInner = 2;
    let leafOuter = -1;
    let leafPitch = 30*(Math.PI/180);
    let leavesTopBound = -this.stemHeight*0.5;
    let leavesBottomBound =  -this.stemHeight*0.9;
    let translateBy = leavesBottomBound;
    // absolutely no leaves above here
    let flowersTopBound = 0;
    for (let i = 0; translateBy < leavesTopBound && translateBy < flowersTopBound; i++){
      translateBy  += leafVertSpacing;
      let leafGeometry = this.leafGeometry(0,0,leafLength,leafInner, leafOuter, leafFoldAngle);
      leafGeometry.rotateY(-leafPitch);
      leafGeometry.rotateZ(i*leafRotAngle);
      let leafMesh = new THREE.Mesh(leafGeometry, this.leafMaterial);
      //cut off if above flower plane
      leafMesh.translateOnAxis(new THREE.Vector3(0,0,1),translateBy);
      this.scene.add(leafMesh);
    }

    this.renderer = renderer;
    this.scene = this.scene;
    this.camera = camera;

    // set this.object to combo of all meshes - the only use of this is to get bounding box so texture doesn't matter
    let allGeometry = new THREE.Geometry();
    allGeometry.merge(stemGeometry);
    allGeometry.merge(this.flowerMesh.geometry);
    var allMesh = new THREE.Mesh( allGeometry, this.wireMaterial ) ;
    this.object = allMesh;

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