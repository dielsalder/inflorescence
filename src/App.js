import React, { Component } from 'react';
import Scene from './Scene';
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
  }
  onChange(event){
    console.log(event);
    this.setState({[event.target.name]: parseFloat(event.target.value)});
  }
  render() {
    return (
      <div>
        <div id="inputs">
          <label>number of petals</label>
          <input type="number" name = "numPetals" value={this.state.numPetals} onChange={this.onChange} min={0} max={24}step={1}/>
          <label>innerY</label>
          <input type="number" name = "petalInnerYRelative" value={this.state.petalInnerYRelative} onChange={this.onChange} min={-1} max={1}step={0.1}/>
        </div>
        <Scene {...this.state}/>
      </div>
    );
  }
}

export default App;
