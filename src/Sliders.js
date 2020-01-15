import React, { Component } from 'react';
import "./App.css";
import PropTypes from "prop-types";
class Sliders extends Component {
    static propTypes = {
        /** parent object taking input from this component */
        parent: PropTypes.Component,
        changeHandler: PropTypes.func
    }
    render(){
        let parent = this.props.parent;
        return(
        <div id="inputs">
          <ul>
            <li>
              <label>number of petals</label>
              <input type="range" name = "numPetals" value={parent.state.numPetals} onChange={this.props.changeHandler} min={0} max={24}step={1}/>
            </li>
            <li>
              <label>size</label>
              <input type="range" name = "petalLength" value={parent.state.petalLength} onChange={this.props.changeHandler} min={0} max={8}step={0.1}/>
            </li>
            <li>
              <label>pitch</label>
              <input type="range" name = "petalPitch" value={parent.state.petalPitch} onChange={this.props.changeHandler} min={-90*Math.PI/180} max={90*Math.PI/180}step={.01}/>
            </li>
            <li>
              <label>innerX</label>
              <input type="range" name = "petalInnerXRelative" value={parent.state.petalInnerXRelative} onChange={this.props.changeHandler} min={0} max={2}step={0.1}/>
            </li>
            <li>
              <label>innerY</label>
              <input type="range" name = "petalInnerYRelative" value={parent.state.petalInnerYRelative} onChange={this.props.changeHandler} min={-2} max={2}step={0.1}/>
            </li>
            <li>
              <label>outerX</label>
              <input type="range" name = "petalOuterXRelative" value={parent.state.petalOuterXRelative} onChange={this.props.changeHandler} min={0} max={2}step={0.1}/>
            </li>
            <li>
              <label>outerY</label>
              <input type="range" name = "petalOuterYRelative" value={parent.state.petalOuterYRelative} onChange={this.props.changeHandler} min={-2} max={2}step={0.1}/>
            </li>
          </ul>
        </div>
        )
    }
}
export default Sliders;