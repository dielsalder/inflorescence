import React, {Component} from 'react';
import * as THREE from 'three';

function makePetalGeometry(xOrigin, yOrigin, petalLength, petalInnerXRelative, petalInnerYRelative, petalOuterXRelative, petalOuterYRelative){
    // petal shape control - keep these positive to avoid clipping, but clipping also looks sorta cool
    let xCp1 = xOrigin + petalLength*petalInnerXRelative
    let yCp1 = yOrigin+ petalLength*petalInnerYRelative;
    let yCp2 = yOrigin+ petalLength*petalOuterYRelative;
    // lies along x Axis
    let xCp2 = xOrigin + petalLength*petalOuterXRelative;

    // curve along x axis from (xOrigin, yOrigin) to (xOrigin, petalLength)
    var petalShape = new THREE.Shape();
    petalShape.bezierCurveTo(xCp1,yCp1, xCp2, yCp2, petalLength, yOrigin );
    petalShape.bezierCurveTo(xCp2, - yCp2, xCp1, -yCp1, xOrigin, yOrigin);

    var geometry = new THREE.ShapeGeometry( petalShape );
    return geometry;
};
function makeFlowerGeometry(numPetals, petalLength, petalInnerXRelative, petalInnerYRelative, petalOuterXRelative, petalOuterYRelative, petalPitch) {
    let flowerGeometry = new THREE.Geometry();
    for (let i = 0; i < numPetals; i++){
      let petalGeometry = makePetalGeometry(0,0,petalLength,petalInnerXRelative, petalInnerYRelative, petalOuterXRelative, petalOuterYRelative);
      petalGeometry.rotateY(-petalPitch);
      let rotAngle = 2*Math.PI/ numPetals;
      petalGeometry.rotateZ(rotAngle*i);
      flowerGeometry.merge(petalGeometry);
    }
    return flowerGeometry;
  }
function flowerMesh(numPetals, petalLength, petalInnerXRelative, petalInnerYRelative, petalOuterXRelative, petalOuterYRelative, petalPitch, flowerColor){
    let flowerGeometry = makeFlowerGeometry(numPetals,petalLength,petalInnerXRelative,petalInnerYRelative,petalOuterXRelative,petalOuterYRelative, petalPitch); 
    let flowerMesh = new THREE.Mesh(flowerGeometry, 
        new THREE.MeshLambertMaterial({ color:flowerColor }));
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