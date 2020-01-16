import React, {Component} from 'react';
import * as THREE from 'three';

function makePetalGeometry(xOrigin, yOrigin, flowerData){
    // petal shape control - keep these positive to avoid clipping, but clipping also looks sorta cool
    let xCp1 = xOrigin + flowerData.petalLength*flowerData.petalInnerXRelative
    let yCp1 = yOrigin+ flowerData.petalLength*flowerData.petalInnerYRelative;
    let yCp2 = yOrigin+ flowerData.petalLength*flowerData.petalOuterYRelative;
    // lies along x Axis
    let xCp2 = xOrigin + flowerData.petalLength*flowerData.petalOuterXRelative;

    // curve along x axis from (xOrigin, yOrigin) to (xOrigin, petalLength)
    var petalShape = new THREE.Shape();
    petalShape.bezierCurveTo(xCp1,yCp1, xCp2, yCp2, flowerData.petalLength, yOrigin );
    petalShape.bezierCurveTo(xCp2, - yCp2, xCp1, -yCp1, xOrigin, yOrigin);

    var geometry = new THREE.ShapeGeometry( petalShape );
    return geometry;
};
function makeFlowerGeometry(flowerData) {
  let flowerGeometry = new THREE.Geometry();
  for (let i = 0; i < flowerData.numPetals; i++){
    let petalGeometry = makePetalGeometry(0,0, flowerData);
    petalGeometry.rotateY(-flowerData.petalPitch);
    let rotAngle = 2*Math.PI/ flowerData.numPetals;
    petalGeometry.rotateZ(rotAngle*i);
    flowerGeometry.merge(petalGeometry);
  }
  return flowerGeometry;
  }
function flowerMesh(flowerData){
    let flowerGeometry = makeFlowerGeometry(flowerData); 
    let flowerMesh = new THREE.Mesh(flowerGeometry, 
        new THREE.MeshLambertMaterial({ color:flowerData.flowerColor }));
    return flowerMesh;
}
function stemMesh(stemRadius,stemHeight,stemColor){
    const stemSubdivisions=3;
    let stemGeometry = new THREE.CylinderGeometry(stemRadius, stemRadius, stemHeight,stemSubdivisions);
    stemGeometry.rotateX(0.5*Math.PI);
    let stemMesh = new THREE.Mesh(stemGeometry,
      new THREE.MeshBasicMaterial({
        color:stemColor,
      }));
    return stemMesh;
}

export {flowerMesh, stemMesh};