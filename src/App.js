import React, { Component } from 'react';
import Scene from './Scene';
import Sliders from './Sliders';
import "./App.css";
class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      numPetals:6,
      petalLength:5,
      petalPitch : 30*Math.PI/180,
      petalInnerXRelative:0,
      petalOuterXRelative:1,
      petalInnerYRelative:0.1,
      petalOuterYRelative:0.5,
      flowerColor:"#24afff",
      leafStemColor:"#69a339",
    }
    this.onChange = this.onChange.bind(this);
    this.cacheFlower=this.cacheFlower.bind(this);
    this.loadFlowerData=this.loadFlowerData.bind(this);
    this.loadCached=this.loadCached.bind(this);
  }
  onChange(event){
    console.log(event);
    this.setState({[event.target.name]: parseFloat(event.target.value)});
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
    }
    return flowerData;
  }

  /** import flowerData object and draw it */
  loadFlowerData(flowerData){
    this.setState(flowerData);
  }

  cacheFlower(){
    this.cachedFlower = this.getFlowerData();
  }

  loadCached(){
    this.loadFlowerData(this.cachedFlower);
  }

  render() {
    return (
        <div className="container">
          <div className="Sliders"><Sliders parent={this} changeHandler={this.onChange}/></div>
          <div className="Scene">
            <Scene  {...this.state}/>
          </div>
        </div>
    );
  }
}

export default App;
