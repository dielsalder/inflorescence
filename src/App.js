import React, { Component } from 'react';
import Scene from './Scene';
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
  }
  onChange(event){
    console.log(event);
    this.setState({[event.target.name]: parseFloat(event.target.value)});
  }
  render() {
    return (
      <div>
        <div id="inputs">
          <ul>
            <li>
              <label>number of petals</label>
              <input type="range" name = "numPetals" value={this.state.numPetals} onChange={this.onChange} min={0} max={24}step={1}/>
            </li>
            <li>
              <label>size</label>
              <input type="range" name = "petalLength" value={this.state.petalLength} onChange={this.onChange} min={0} max={8}step={0.1}/>
            </li>
            <li>
              <label>pitch</label>
              <input type="range" name = "petalPitch" value={this.state.petalPitch} onChange={this.onChange} min={-90*Math.PI/180} max={90*Math.PI/180}step={.01}/>
            </li>
            <li>
              <label>innerX</label>
              <input type="range" name = "petalInnerXRelative" value={this.state.petalInnerXRelative} onChange={this.onChange} min={0} max={2}step={0.1}/>
            </li>
            <li>
              <label>innerY</label>
              <input type="range" name = "petalInnerYRelative" value={this.state.petalInnerYRelative} onChange={this.onChange} min={-2} max={2}step={0.1}/>
            </li>
            <li>
              <label>outerX</label>
              <input type="range" name = "petalOuterXRelative" value={this.state.petalOuterXRelative} onChange={this.onChange} min={0} max={2}step={0.1}/>
            </li>
            <li>
              <label>outerY</label>
              <input type="range" name = "petalOuterYRelative" value={this.state.petalOuterYRelative} onChange={this.onChange} min={-2} max={2}step={0.1}/>
            </li>
          </ul>
        </div>
        <Scene className="Scene" {...this.state}/>
      </div>
    );
  }
}

export default App;
