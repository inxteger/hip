'use strict'

import React,{Component} from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

import Text from '../Text';
import {GRAY,BLACK,ALARM_RED} from '../../styles/color';
import moment from 'moment';
import Icon from '../Icon.js';
import TouchFeedback from '../TouchFeedback';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

export default class DeviceFilesRow extends Component{
  constructor(props){
    super(props);
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
  }
  _getTime(data){
    var time = moment(data.get('MaintainTime'));
    if(time.isSame(moment(),'day')){
      return time.format('HH:mm');
    }
    else {
      return time.format('MM-DD');
    }
  }
  render(){
    var {rowData} = this.props;
    // icon_file
    var iconType=rowData.get('Type')==='dir'?'icon_folder':'icon_file';
    var iconColor=rowData.get('Type')==='dir'?'#f6ca36':'#358de7';
    return (
      <View style={{flex:1,backgroundColor:'white'}}>
        <TouchFeedback onPress={()=>this.props.onRowClick(rowData)}>
          <View style={[styles.row,styles.rowHeight]}>
            <View style={{marginHorizontal:16,flexDirection:'row',justifyContent:'flex-end'}}>
              <Icon type={iconType} size={16} color={iconColor} />
              <View style={{flex:1,marginLeft:8,marginRight:8}}>
                <Text numberOfLines={1} style={styles.nameText}>{rowData.get('Name')}</Text>
              </View>
              <Icon type='arrow_right' size={16} color={GRAY} />
            </View>
          </View>
        </TouchFeedback>
      </View>
    );
  }
}

DeviceFilesRow.propTypes = {
  user:PropTypes.object,
  onRowClick:PropTypes.func.isRequired,
  rowData:PropTypes.object.isRequired,
}

var styles = StyleSheet.create({
  rowHeight:{
    height:44
  },
  row:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    backgroundColor:'white',
    // padding:16,
    overflow:'hidden'
  },
  nameText:{
    fontSize:17,
    color:BLACK
  },
});
