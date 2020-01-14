import React, { Component } from 'react';
import Scene from './Scene';
class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      numPetals:6,
      petalLength:5,
      petalPitch : 30,
      petalInnerYRelative:0.1,
      petalOuterYRelative:0.5,
      flowerColor:"#24afff",
      leafStemColor:"#69a339",
    }
    this.changeNumPetals = this.changeNumPetals.bind(this);
  }
  changeNumPetals(event){
    this.setState({numPetals: parseInt(event.target.value)});
  }
  render() {
    return (
      <div>
        <div id="inputs">
          <label>number of petals</label>
          <input type="number" value={this.state.numPetals} onChange={this.changeNumPetals} min={0} max={24}step={1}/>
        </div>
        <Scene {...this.state}/>
      </div>
    );
  }
}

export default App;
