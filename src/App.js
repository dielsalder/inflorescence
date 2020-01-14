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
  }
  render() {
    return (
      <div>
        <Scene {...this.state}/>
      </div>
    );
  }
}

export default App;
