'use strict'

import React,{Component,PropTypes} from 'react';

import {
  View,
  StyleSheet,
} from 'react-native';

import Text from '../Text';
import TouchFeedback from '../TouchFeedback';
import {BLACK,ASSET_IMG_BORDER} from '../../styles/color';
import moment from 'moment';

export default class TendingRow extends Component{
  constructor(props){
    super(props);
  }
  _getTicketType(type)
  {
    var ticketTypes=['','计划工单','报警工单','随工工单','现场工单'];
    return ticketTypes[type];
  }
  _getContentImageView(){
    var {rowData} = this.props;
    var startTime = moment(rowData.get('ActualStartTime')).format("YYYY-MM-DD");
    var endTime = moment(rowData.get('ActualEndTime')).format("YYYY-MM-DD");
    var content = rowData.get('Content') || '';
    content=content.split('\n').join(' ');
    return (
      <View style={[styles.row,styles.rowHeight,{flexDirection:'row',justifyContent:'space-between'}]}>
        <View style={{flex:1,marginTop:16}}>
          <Text style={styles.nameText} numberOfLines={1} lineBreakModel='charWrapping'>{`${startTime} 至 ${endTime}`}
          </Text>
          <Text style={styles.contentText} numberOfLines={1} lineBreakModel='charWrapping'>{`${this._getTicketType(rowData.get('TicketType'))}: ${content}`}
          </Text>
        </View>
      </View>
    )
  }
  render(){
    var {rowData} = this.props;
    return (
      <View style={{flex:1,backgroundColor:'white'}}>
        <TouchFeedback onPress={()=>this.props.onRowClick(rowData)}>
          {this._getContentImageView()}
        </TouchFeedback>
      </View>
    );
  }
}

TendingRow.propTypes = {
  user:PropTypes.object,
  onRowClick:PropTypes.func.isRequired,
  rowData:PropTypes.object.isRequired,
}

var styles = StyleSheet.create({
  rowHeight:{
    height:74
  },
  row:{
    backgroundColor:'white',
    paddingHorizontal:16,
  },
  titleRow:{
    flexDirection:'row',
    // backgroundColor:'red',
    alignItems:'flex-start',
    justifyContent:'space-between',
  },
  nameText:{
    color:BLACK,
    fontSize:17
  },
  contentText:{
    color:BLACK,
    fontSize:12,
    marginTop:13
  },
});
