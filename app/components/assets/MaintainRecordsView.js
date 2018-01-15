
'use strict';
import React,{Component} from 'react';
import {
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import Text from '../Text';
import Icon from '../Icon.js';
import {GRAY,BLACK,ALARM_RED,GREEN} from '../../styles/color';
import TouchFeedback from '../TouchFeedback';
import Toolbar from '../Toolbar';
import List from '../List.js';
import MaintainRecordRow from './MaintainRecordRow.js';
import Section from '../Section.js';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

export default class Alarm extends Component{
  constructor(props){
    super(props);
  }
  _renderRow(rowData,sectionId,rowId){
    // console.warn('rowData',rowData);
    return (
      <MaintainRecordRow rowData={rowData} onRowClick={this.props.onRowClick} />
    );
  }

  _renderSection(sectionData,sectionId,sectionIndex){
    var sectionTitle = this.props.sectionData.get(sectionId);
    if(!sectionTitle) return null;
    return (
      <View style={{height:44,backgroundColor:'#f0f0f5'}}>
      </View>
    );
  }
  _getSubToolbarView()
  {
    return (
      <View style={{height:44,backgroundColor:'#f6f5f7',alignItems:'center',paddingHorizontal:16,flexDirection:'row',}}>
        <Text style={{fontSize:14,color:'#8e8e9c'}}>
          {'资产编号：DS20170306'}
        </Text>

        <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end'}}>
          <TouchFeedback
            onPress={()=>{
              this.props.onAddClick();
            }}>
            <View style={{width:30,height:30,alignItems:'center',justifyContent:'flex-end',flexDirection:'row'}}>
              <Icon type="icon_add" color={GREEN} size={16} />
            </View>
          </TouchFeedback>

          <TouchFeedback
            onPress={()=>{
              this.props.onFilterClick();
            }}>
            <View style={{width:30,height:30,alignItems:'center',justifyContent:'flex-end',flexDirection:'row'}}>
              <Icon type="icon_add" color={GREEN} size={16} />
            </View>
          </TouchFeedback>
        </View>

      </View>
    )
  }
  render() {
    return (
      <View style={{flex:1,backgroundColor:'white'}}>
        {this._getSubToolbarView()}
        <List
          needGotoTop={true}
          isFetching={this.props.isFetching}
          listData={this.props.listData}
          hasFilter={this.props.hasFilter}
          currentPage={this.props.currentPage}
          nextPage={this.props.nextPage}
          onRefresh={this.props.onRefresh}
          totalPage={this.props.totalPage}
          clearFilter={this.props.clearFilter}
          onFilterClick={this.props.onFilterClick}
          renderRow={(rowData,sectionId,rowId)=>this._renderRow(rowData,sectionId,rowId)}
          renderSectionHeader={(sectionData,sectionId)=>this._renderSection(sectionData,sectionId)}
          emptyText={localStr('lang_alarm_noalarm')}
          filterEmptyText={localStr('lang_alarm_nofilteralarm')}
        />
      </View>
    );
  }
}

Alarm.propTypes = {
  user:PropTypes.object,
  currentPage:PropTypes.number,
  totalPage:PropTypes.number,
  hasFilter:PropTypes.bool.isRequired,
  onRowClick:PropTypes.func.isRequired,
  onFilterClick:PropTypes.func.isRequired,
  clearFilter:PropTypes.func.isRequired,
  isFetching:PropTypes.bool.isRequired,
  listData:PropTypes.object,
  sectionData:PropTypes.object,
  onRefresh:PropTypes.func.isRequired,
  nextPage:PropTypes.func.isRequired,
}
