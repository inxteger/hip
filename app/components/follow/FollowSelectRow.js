'use strict'
import React,{Component,PropTypes} from 'react';

import {
  View,
  StyleSheet,
} from 'react-native';

import Text from '../Text';
import TouchFeedback from '../TouchFeedback';
import Icon from '../Icon.js';
import {BLACK,GRAY,GREEN,LINE} from '../../styles/color';
import ClickableRow from '../ClickableRow';

export default class FollowSelectRow extends Component{
  constructor(props){
    super(props);
  }
  _getNavIcon(){
    var {rowData} = this.props;
    var isSelect=rowData.get('Selected');
    return (
      <View style={[styles.itemIcon,{backgroundColor:isSelect?GREEN:'yellow'}]}>
        <Icon type='icon_check' size={10} color='white' />
      </View>
    )
  }
  _getSelectIcon(){
    var {rowData} = this.props;
    if(!!rowData.get('Selected')){
      return (
        <View style={styles.selectView}>
          <Icon type='icon_check' size={10} color='white' />
        </View>
      )
    }else {
      return (
        <View style={styles.unSelectView}>
        </View>
      )
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.rowData.get('Selected') === this.props.rowData.get('Selected')){
      return false;
    }
    return true;
  }
  _renderSeparator(sectionId,rowId){
    return (
      <View style={styles.sepView}></View>
    )
  }
  render(){
    var {rowData} = this.props;
    return (
      <View style={{flex:1,backgroundColor:'white'}}>
        <TouchFeedback
          style={styles.imageContainer}
          onPress={()=>{
            this.props.onRowClick(rowData)
          }}>
          <View>
            <View style={styles.rowContent}>
              {this._getNavIcon()}
              <View style={{flex:1}}>
                <Text numberOfLines={1} style={styles.titleText}>
                  {this.props.rowData.get('Name')}
                </Text>
              </View>
              {this._getSelectIcon()}
            </View>
            {this._renderSeparator()}
          </View>
        </TouchFeedback>
    </View>
    );
  }
}

FollowSelectRow.propTypes = {
  user:PropTypes.object,
  onRowClick:PropTypes.func.isRequired,
  rowData:PropTypes.object.isRequired,
  sectionId:PropTypes.number,
  rowId:PropTypes.number,
}

var styles = StyleSheet.create({
  rowContent:{
    height:64,
    flexDirection:'row',
    // justifyContent:'space-between',
    alignItems:'center',
    backgroundColor:'white',
    paddingHorizontal:16,
  },
  titleText:{
    marginLeft:16,
    fontSize:17,
    color:BLACK
  },
  subTitleText:{
    marginLeft:16,
    fontSize:13,
    color:BLACK,
    width:75,
  },
  itemIcon:{
    width:30,
    height:30,
    justifyContent:'center',
    alignItems:'center'
  },
  selectView:{
    width:18,
    height:18,
    borderRadius:10,
    backgroundColor:GREEN,
    justifyContent:'center',
    alignItems:'center'
  },
  unSelectView:{
    width:18,
    height:18,
    borderRadius:10,
    borderColor:GRAY,
    borderWidth:1,
    // marginRight:16,
    justifyContent:'center',
    alignItems:'center'
  },
  sepView:{
    height:1,
    // flex:1,
    backgroundColor:LINE
  }
});
