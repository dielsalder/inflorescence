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
    return flowerData;
}
export {hybridize}