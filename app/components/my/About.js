
'use strict';
import React,{Component,PropTypes} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Platform
} from 'react-native';

import Toolbar from '../Toolbar';
import Text from '../Text';
import {BLACK,GREEN} from '../../styles/color';
import Button from '../Button';

export default class About extends Component{
  constructor(props){
    super(props);
    // console.warn('my props',props.appInfo);
  }
  _getSpFullName()
  {
    var spName=this.props.user.get('SpFullName');
    if (!spName) {
      spName='施耐德电气（中国）有限公司 版权所有';
    }
    return spName;
  }
  _getIsSpCustomer()
  {
    var spName=this._getSpFullName();
    return spName.indexOf('施耐德')===-1;
  }
  _renderFooter(){
    var hasNewVersion=this.props.version.get('hasNewVersion');
    var {width} = Dimensions.get('window');
    var version=this.props.version.get('version');
    if (!hasNewVersion) {
      return null;
    }
    return (
      <Button
        style={{
          backgroundColor:GREEN,
          marginTop:42,
          height:48,marginHorizontal:16,
          borderRadius:6,
          width:width-32,
        }}
        textStyle={{
          fontSize:15,
          color:'#ffffff'
        }}
        text={"下载新版本 "+version} onClick={()=>this.props.updateClick()} />
    );
  }
  _getLatestText(hasNewVersion)
  {
    if (!hasNewVersion&&Platform.OS==='android') {
      return (
        <Text style={styles.versionText}>{`${'(已为最新版本)'}`}</Text>
      );
    }else {
      return null;
    }
  }
  // {this.props.version.get('version')}
  // hasNewVersion={this.props.version.get('hasNewVersion')}
  // upgradeUri={this.props.version.get('upgradeUri')}
  render() {
    var hasNewVersion=this.props.version.get('hasNewVersion');
    var appInfo = this.props.appInfo;
    var spCopyRightColor=this._getIsSpCustomer()?'transparent':BLACK;
    return (
      <View style={{flex:1,backgroundColor:'white'}}>
        <Toolbar
          title={Platform.OS==='android'?'版本信息':'关于'}
          navIcon="back"
          onIconClicked={()=>this.props.onBack()} />
        <View style={styles.container}>
          <Image source={require("../../images/about_logo/about_logo.png")} />
          <Text style={styles.productNameText}>灯塔</Text>
          <Text style={styles.versionText}>{`${hasNewVersion?'当前版本':'版本'}:${appInfo.versionName}`}</Text>
          {this._getLatestText(hasNewVersion)}
          {this._renderFooter()}
          <View style={styles.bottom}>
            <Text style={styles.corpText}>{this._getSpFullName()}</Text>
            <Text style={[styles.copyrightText,{color:spCopyRightColor}]}>Copyright @ 2015-2018 Schneider Electric.All Rights </Text>
            <Text style={[styles.copyrightText,{color:spCopyRightColor}]}>Reserved.</Text>
          </View>
        </View>
      </View>

    );
  }
}

About.propTypes = {
  onBack:PropTypes.func,
  appInfo:PropTypes.object,
  user:PropTypes.object,
  updateClick:PropTypes.func,
  version:PropTypes.object,
}

var styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  productNameText:{
    marginTop:20,
    color:BLACK,
    fontSize:14,
  },
  versionText:{
    marginTop:7,
    color:BLACK,
    fontSize:14,
  },
  bottom:{
    position:'absolute',
    left:0,
    right:0,
    bottom:0,
    flex:1,
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    // marginHorizontal:40,
  },
  corpText:{
    marginBottom:7,
    fontSize:12,
    color:BLACK
  },
  copyrightText:{
    color:BLACK,
    fontSize:12,
  }
});
