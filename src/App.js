import React, { Component } from 'react';
import Scene from './Scene';
import Sliders from './Sliders';
import "./App.css";
import {hybridize} from './js-plant-gen/Hybridize';
import * as examples from './js-plant-gen/ExampleFlowers';
class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      ...examples.yellowStar,
      ...{flowerUpdated:false, leafUpdated:false}
    }
    this.onChange = this.onChange.bind(this);
    this.onLeafChange = this.onLeafChange.bind(this);
    this.saveFlowerTo=this.saveFlower.bind(this);
    this.loadFlowerData=this.showFlower.bind(this);
    this.loadSavedFlower=this.loadFlower.bind(this);
    this.onColorChange=this.onColorChange.bind(this);

    // saving functions that all use the same saveFlowerTo
    this.saveCached=this.saveFlower.bind(this,"cached");
    this.loadCached=this.loadFlower.bind(this,"cached");
    this.saveP1 = this.saveFlower.bind(this, "p1")
    this.loadP1 = this.loadFlower.bind(this, "p1")
    this.saveP2 = this.saveFlower.bind(this, "p2")
    this.loadP2 = this.loadFlower.bind(this, "p2")
    this.crossFlowers = this.crossFlowers.bind(this);

    // dictionary for saving flowers
    this.savedFlowers = {}
  }
  onChange(event){
    this.setState({...{flowerUpdated:true},
      ...{[event.target.name]: parseFloat(event.target.value)}});
  }
  onLeafChange(event){
    this.setState({...{leafUpdated:true},
      ...{[event.target.name]: parseFloat(event.target.value)}});
  }
  onColorChange(color,event){
    this.setState({...{flowerUpdated:true},
      ...{flowerColor:color.hex}});
  }
  /** object containing current flower stats, from which this model can be recreated */
  getFlowerData(){
    // only get flower stats, since state contains many things
    const flowerData = {
      numPetals:this.state.numPetals,
      petalLength:this.state.petalLength,
      petalPitch : this.state.petalPitch,
      petalInnerXRelative:this.state.petalInnerXRelative,
      petalOuterXRelative:this.state.petalOuterXRelative,
      petalInnerYRelative:this.state.petalInnerYRelative,
      petalOuterYRelative:this.state.petalOuterYRelative,
      flowerColor:this.state.flowerColor,
      leafStemColor:this.state.leafStemColor,
      leafRotAngle:this.state.leafRotAngle,
      leafLength:this.state.leafLength,
      leafSpacing:this.state.leafSpacing,
      stemHeight:this.state.stemHeight,
      leafInner:this.state.leafInner,
      leafOuter:this.state.leafOuter,
      leafPitch: this.state.leafPitch,
      leavesTopBound:this.state.leavesTopBound,
    }
    return flowerData;
  }

  /** import flowerData object and draw it */
  showFlower(flowerData){
    this.setState({flowerUpdated:true,leafUpdated:true});
    this.setState(flowerData);
  }

  /** save in flower dict */
  saveFlower(name){
    this.savedFlowers[name] = this.getFlowerData();
  }

  /** load a specific saved flower */
  loadFlower(name){
    this.showFlower(this.savedFlowers[name])
  }

  /** cross stored p1 and p2 and display the result */
  crossFlowers(){
    if (this.savedFlowers["p1"]!= null && this.savedFlowers["p2"]!=null){
      const child = hybridize(this.savedFlowers["p1"], this.savedFlowers["p2"]);
      this.showFlower(child);
    }
  }

  render() {
    return (
        <div className="container">
          <div className="Sliders"><Sliders parent={this} changeHandler={this.onChange}/></div>
          <div className="Scene">
            <Scene  {...this.state} parent={this}/>
          </div>
        </div>
    );
  }
}

export default App;
