import React, { Component } from 'react';
import Scene from './Scene';
class App extends Component {
  constructor(){
    super();
    this.state={
      numPetals: 12,
      petalPitch:30*Math.PI/180,
      petalLength : 6,
      petalInner : -1,
      petalOuter : 3,

      centerSides : 6,
      centerBottomRadius : 0,
      centerTopRadius : 1,
      centerHeight : .5,
      centerTranslateZ : 0.5,
    }
  }
  changeNpetals(event){
    this.setState({
      numPetals:event.target.value
    });
  }
  render() {
    return (
      <div>
        <label> number of petals </label>
        <input type="range" name = "nPetals" 
          onChange={this.changeNpetals.bind(this)}
          min = "0"
          max = "24"
          value = {this.state.numPetals}/>

        <Scene {...this.state} />
      </div>
    );
  }
}

export default App;
