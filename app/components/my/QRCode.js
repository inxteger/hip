
'use strict';
import React,{Component,PropTypes} from 'react';
import {
  View,
  Image,
  StyleSheet,
} from 'react-native';

import Toolbar from '../Toolbar';
import Text from '../Text';
import {BLACK} from '../../styles/color';
import appInfo from '../../utils/appInfo.js';

export default class My extends Component{
  constructor(props){
    super(props);
  }

  render() {
    var imgUrl=require('../../images/qrcode/qrcode.png');
    if(!appInfo.get().prod){
      imgUrl=require('../../images/qrcode/qrcode_test.png');
    }
    return (
      <View style={{flex:1,backgroundColor:'white'}}>
        <Toolbar
          title='二维码'
          navIcon="back"
          onIconClicked={()=>this.props.onBack()} />
        <View style={styles.container}>
          <Image style={styles.qrcode} source={imgUrl} />
          <Text style={styles.text}>使用手机扫描</Text>
          <Text style={styles.text}>即可立即下载灯塔APP</Text>
        </View>
      </View>

    );
  }
}

My.propTypes = {
  onBack:PropTypes.func,
}

var styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  qrcode:{
    marginBottom:20,
    width:212,
    height:212,
  },
  text:{
    fontSize:12,
    marginBottom:7,
    color:BLACK
  }
});
