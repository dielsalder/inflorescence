import * as tinycolor from "tinycolor2";
/** return hex of a random color between color1 and color2 */
function colorBetween(color1, color2){
    let randomWeight = Math.random()*100;
    let newColor = tinycolor.mix(color1, color2,randomWeight);
    return newColor.toHexString();
    
}
/** randomly pick trait from p1, p2. default chance 50% */
function pickOne(trait, p1, p2){
    const inventory = [p1[trait], p2[trait]];
    let randomTrait = inventory[Math.floor(Math.random()*inventory.length)];
    return randomTrait;
}
/** cross p1 and p2 (json objects containing flower data) */
function hybridize(p1, p2){
    let flowerData = {
        numPetals: null,
        petalLength:  null,
        petalPitch :  null,
        petalInnerXRelative:null,
        petalOuterXRelative:null,
        petalInnerYRelative:null,
        petalOuterYRelative:null,
        flowerColor:null,
        leafStemColor:"#69a339",
    }
    for (const trait in flowerData){
        flowerData[trait] = pickOne(trait,p1,p2);
    }
    flowerData.flowerColor = colorBetween(p1.flowerColor,p2.flowerColor);
    return flowerData;
}
export {hybridize}