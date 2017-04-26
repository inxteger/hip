'use strict';
import React,{Component,PropTypes} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';

import Icon from '../Icon';
import Form from './Form';
import KeyboardSpacer from '../KeyboardSpacer';
import {BLACK} from '../../styles/color.js';
import Text from '../Text.js';
import TouchFeedback from '../TouchFeedback';
var dismissKeyboard = require('dismissKeyboard');

export default class Login extends Component{
  constructor(props){
    super(props);
    var {width,height} = Dimensions.get('window');
    // console.warn('width,height',width,height);
    this.state = {width,height}
  }
  shouldComponentUpdate(nextProps, nextState) {
    if(this.props.data === nextProps.data ){
      return false;
    }
    return true;
  }
  render(){
    var {width,height} = this.state;
    var {type} = this.props,text;
    if(type === 'mobile'){
      text = '用户名密码登录';
    }
    else {
      text = '手机验证码登录';
    }
    return (
      <Image
        source={require('../../images/app_bg/app_bg.png')}
        resizeMode="cover"
        style={[{width,height},styles.imageBackground]}>
        <View style={styles.form}>
          <View style={styles.switcher}>
            <TouchFeedback style={{flex:1}} onPress={this.props.onBack}>
              <View style={{flex:1,justifyContent:"center"}}>
                <Icon type="icon_arrow_left" color='black' size={15}/>
              </View>
            </TouchFeedback>
          </View>
          <Form
            type={this.props.type}
            data={this.props.data}
            onSend={this.props.onSend}
            onSubmit={this.props.onSubmit}
            onInputChanged={this.props.onInputChanged}  />
          <TouchFeedback style={{height:40}} onPress={()=>{this.props.onSwitch();
            dismissKeyboard()}}>
            <View style={{marginTop:10,height:40,alignItems:'center',justifyContent:'center'}}>
              <Text  style={styles.switcherText}>{text}</Text>
            </View>
          </TouchFeedback>


        </View>
        <KeyboardSpacer force={true} />
      </Image>
    )
  }
}

Login.propTypes = {
  type:PropTypes.string.isRequired,
  onSwitch:PropTypes.func.isRequired,
  onBack:PropTypes.func.isRequired,
  onSubmit:PropTypes.func.isRequired,
  onInputChanged:PropTypes.func.isRequired,
  onSend:PropTypes.func,
  data:PropTypes.object.isRequired,
}

var styles = StyleSheet.create({
  imageBackground:{
    // flex:1,
    justifyContent:'center',
  },
  switcherText:{
    fontSize:14,
    color:BLACK,
  },
  switcher:{
    marginTop:24,
    height:50,

    // flex:1,
    position:'absolute',
    top:0,
    left:10,
    right:0,
    // backgroundColor:'red',
    justifyContent:'center',
  },
  form:{
    flex:1,
    paddingHorizontal:16,
    // backgroundColor:'red',
    justifyContent:'center',
    // alignItems:'center'
  }
});
