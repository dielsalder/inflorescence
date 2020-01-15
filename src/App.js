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
  }
  onChange(event){
    console.log(event);
    this.setState({[event.target.name]: parseFloat(event.target.value)});
  }
  /** export current floewr stats, from which this model can be recreated */
  flowerStats(){

  }
  render() {
    return (
        <div>
          <Sliders parent={this} changeHandler={this.onChange}/>
          <Scene className="Scene" {...this.state}/>
        </div>
    );
  }
}

export default App;
