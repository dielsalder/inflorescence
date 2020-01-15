/** randomly pick trait from p1, p2. default chance 50% */
function pickOne(trait, p1, p2){
    const inventory = [p1[trait], p2[trait]];
    let randomTrait = inventory[Math.floor(Math.random()*inventory.length)];
    return randomTrait;
}
/** cross p1 and p2 (json objects containing flower data) */
function hybridize(p1, p2){
    let flowerData = {
        numPetals:p1.numPetals,
        petalLength: p2.petalLength,
        petalPitch : p1.petalPitch,
        petalInnerXRelative:p1.petalInnerXRelative,
        petalOuterXRelative:p2.petalOuterXRelative,
        petalInnerYRelative:p1.petalInnerYRelative,
        petalOuterYRelative:p2.petalOuterYRelative,
        flowerColor:p1.flowerColor,
        leafStemColor:"#69a339",
    }
    return flowerData;
}
export {hybridize}