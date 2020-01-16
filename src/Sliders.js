import React, { Component } from 'react';
import "./App.css";
import PropTypes from "prop-types";
import SliderPicker, { CompactPicker } from "react-color";

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
              <span>
                <button type="button" onClick={parent.saveCached}>save current flower</button>
                <button type="button" onClick={parent.loadCached}>load saved flower</button>
              </span>
            </li>
            <li>
              <CompactPicker onChange={parent.onColorChange}/>
            </li>
            <li><h3>petals</h3></li>
            <li>
              <label>number</label>
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
            <li ><h3>genetics</h3></li>
            <li>
              <label className="parent-label">parent 1</label>
              <button type="button" onClick={parent.saveP1}>save</button>
              <button type="button" onClick={parent.loadP1}>load</button>
            </li>
            <li>
              <label className="parent-label">parent 2</label>
              <button type="button" onClick={parent.saveP2}>save</button>
              <button type="button" onClick={parent.loadP2}>load</button>
            </li>
            <li>
              <label className="parent-label">child</label>
              <button type="button" onClick={parent.crossFlowers}>view cross</button>
            </li>
          </ul>
        </div>
        )
    }
}
export default Sliders;