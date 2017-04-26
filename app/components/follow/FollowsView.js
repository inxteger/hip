
'use strict';
import React,{Component,PropTypes} from 'react';

import {
  View,
  StyleSheet,
  ScrollView,
  Modal,
  Image,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native';

import Toolbar from '../Toolbar';
import List from '../List.js';
import SelectRow from './FollowSelectRow.js';
import Section from '../Section.js';
import Text from '../Text';
import {GRAY,LIST_BG,GREEN} from '../../styles/color';
import Icon from '../Icon';
import TouchFeedback from '../TouchFeedback';

import Button from '../Button.js';
import Bottom from '../Bottom.js';
import storage from '../../utils/storage.js';
import Loading from '../Loading';

export default class FollowsView extends Component{
  constructor(props){
    super(props);
    var {width,height} = Dimensions.get('window');
    this.state = {width,height,showModal:false};
    storage.getItem('ISFIRSTLOADING',((res)=>{
      // this.setState({showModal:res===null});
      if (!res) {
        storage.setItem('ISFIRSTLOADING','false');
      }
      this.setState({showModal:true});//test need remove
    }));
  }
  _getContentView()
  {
    if (!this.props.data||this.props.data.size===0) {
      return null;
    }
    return this.props.data.map((item,index)=>{
      return (
        <View key={'follow'+index} style={styles.statusRow}>
          <SelectRow rowData={item} onRowClick={this.props.onRowClick} />
        </View>
      )
    });
  }
  _getModalView()
  {
    return (
      <Modal
        animationType={'fade'}
        transparent={true}
        visible={this.state.showModal}
        onRequestClose={() => {
          console.warn('visible...');
          this._setModalVisible(false)}
        }
        >
        <TouchableWithoutFeedback onPress={()=>{this._setModalVisible(false)}}>
        <View style={{flex:1,backgroundColor:'#0008',justifyContent:'center',alignItems:'center'}}>
          <View style={styles.imageContainer}>
            <TouchableWithoutFeedback onPress={()=>{}}>
            <Image
              source={require('../../images/follow_bg/follow.png')}
              resizeMode="cover"
              style={[{width:305,height:421,}]}>
            </Image>
            </TouchableWithoutFeedback>
            <View style={{marginTop:30}}>
              <Icon type="icon_add" color='white' size={30}/>
            </View>
          </View>
        </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
  _getBottomButton()
  {
    var btnEnable=false;
    if (this.props.data) {
      this.props.data.forEach(item=>{
        if (item.get('Selected')) {
          btnEnable=true;
        }
      })
    }
    return(
      <View key={'follow'} style={{marginVertical:40}}>
        <Button
          style={[styles.button,{
            backgroundColor:GREEN,
          }]}
          disabledStyle={[styles.button,{
              backgroundColor:GRAY,
            }]
          }
          textStyle={{
            fontSize:15,
            color:'#ffffff'
          }}
          disabled={!btnEnable}
          text='完成' onClick={this.props.onSave}
          // text='完成' onClick={()=>{
          //   this._setModalVisible(true);
          // }}
          />
      </View>
    );
  }
  _setModalVisible(visible) {
    this.setState({showModal: visible});
  }
  _getLoadingView(){
    if (this.props.isFetching) {
      return (
        <View style={{paddingVertical:16,backgroundColor:LIST_BG}}>
          <View style={{marginVertical:16,}}>
            <Loading color={GREEN}/>
          </View>
        </View>
      )
    }
    return null;
  }
  render() {
    var {width,height} = this.state;

    return (
      <View style={{flex:1,backgroundColor:'white'}}>
        {this._getModalView()}
        <Toolbar title='特别关注'/>
        {this._getLoadingView()}
        <ScrollView style={[styles.wrapper]}>
          <View style={{backgroundColor:LIST_BG}}>
            {this._getContentView()}
            {this._getBottomButton()}
          </View>
        </ScrollView>
      </View>
    );
    // return (
    //   <View style={{flex:1,backgroundColor:'white'}}>
    //     {this._getModalView()}
    //     <Toolbar title='特别关注'/>
    //     {this._getLoadingView()}
    //     <ScrollView style={[styles.wrapper]}>
    //       <View style={{backgroundColor:LIST_BG}}>
    //         {this._getContentView()}
    //       </View>
    //     </ScrollView>
    //     {this._getBottomButton()}
    //   </View>
    // );
  }
}

FollowsView.propTypes = {
  navigator:PropTypes.object,
  onSave:PropTypes.func.isRequired,
  user:PropTypes.object,
  onRowClick:PropTypes.func.isRequired,
  isFetching:PropTypes.bool.isRequired,
  data:PropTypes.object,
}

var styles = StyleSheet.create({
  statusRow:{
    flexDirection:'row'
  },
  wrapper:{
    // paddingBottom: 48,
    flex:1,
    backgroundColor:LIST_BG,
  },
  button:{
    height:48,
    flex:1,
    marginHorizontal:16,
    borderRadius:6,
  },
  imageContainer:{
    // flex:1,
    justifyContent:'center',
    alignItems:'center',
    // backgroundColor:'red'
  }
});
