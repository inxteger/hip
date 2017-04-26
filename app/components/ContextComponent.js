'use strict';
import React,{Component} from 'react';

import {
  View,
} from "react-native";
import Hud from './Hud.js';

export default class ContextComponent extends Component {
  static childContextTypes = {
    showSpinner: React.PropTypes.func,
    hideHud: React.PropTypes.func,
    navigator:React.PropTypes.object,
  };
  getChildContext() {
    return {
      showSpinner:(step)=>{
        this._hud.showSpinner(step);
      },
      hideHud:()=>{
        this._hud.hide();
      },
      navigator:this.props.navigator
    };
  }
  render() {
    return (
      <View style={{flex:1}}>
        {this.props.children}
        <Hud ref={(hud)=>this._hud=hud} />
      </View>
    );
  }
}

ContextComponent.propTypes = {
  children:React.PropTypes.any.isRequired,
  navigator:React.PropTypes.any.isRequired
}

// ContextComponent.childContextTypes = {
//   showSpinner: React.PropTypes.func,
//   hideHud: React.PropTypes.func,
//
// }
