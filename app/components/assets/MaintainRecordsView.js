
'use strict';
import React,{Component} from 'react';
import {
  View,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';

import Text from '../Text';
import Icon from '../Icon.js';
import {GRAY,BLACK,ALARM_RED,GREEN,LOGOUT_RED,LINE} from '../../styles/color';
import TouchFeedback from '../TouchFeedback';
import ListSeperator from '../ListSeperator';
import Toolbar from '../Toolbar';
import List from '../List.js';
import MaintainRecordRow from './MaintainRecordRow.js';
import Section from '../Section.js';
import RowDelete from '../RowDelete.js'
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

export default class MaintainRecordsView extends Component{
  constructor(props){
    super(props);
  }
  _renderHiddenRow(rowData,sectionId,rowId,closeRow){
    // console.warn('_renderHiddenRow');
    return (
      <RowDelete onPress={()=>{
          closeRow();
          this.props.onRowLongPress(rowData)}} />
    )
  }
  _renderSeperator(sectionId,rowId){
    var isLastRow=false;
    // var secRowCounts=this.props.logs.getSectionLengths();
    // // console.warn('bb',secRowCounts[sectionId],sectionId,rowId);
    if (this.props.listData.getRowCount()===Number(rowId)+1)
      isLastRow=true;
    // console.warn('aa',rowId,this.props.logs.getSectionLengths(),this.props.logs.getRowCount());
    return (
      <ListSeperator key={sectionId+rowId} marginWithLeft={isLastRow?0:16}/>
    );
  }
  _renderRow(rowData,sectionId,rowId,closeRow){
    // console.warn('rowData',rowData);
    return (
      <MaintainRecordRow
        key={rowId}
        rowData={rowData}
        onRowLongPress={this.props.onRowLongPress}
        onRowClick={(rowData)=>{
          closeRow();
          this.props.onRowClick(rowData)
        }}
        />
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
  _getAssetNoView()
  {
    if (this.props.isFetching||!this.props.listData) {
      return (
        <View style={{flex:1,}}>
        </View>
      );
    }
    var assNo=this.props.extData;
    var textView=(
      <View style={{flex:1,}}>
        <Text numberOfLines={1} style={{fontSize:14,color:'#8e8e9c'}}>
          {localStr('lang_record_des18')+assNo}
        </Text>
      </View>
    );
    if (!assNo) {
      textView=(
        <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
          <Icon type="icon_notification" color={LOGOUT_RED} size={15} />
          <Text numberOfLines={1} style={{fontSize:14,color:LOGOUT_RED,marginLeft:3}}>
            {localStr('lang_record_des19')}
          </Text>
        </View>
      );
    }
    return textView;
  }
  _getAddRecordView()
  {
    if (this.props.canEdit) {
      return (
        <TouchFeedback
          onPress={()=>{
            this.props.onAddClick();
          }}>
          <View style={{height:40,paddingRight:16,paddingLeft:8,
              alignItems:'center',justifyContent:'flex-end',flexDirection:'row'}}>
            <Icon type="icon_add" color={GREEN} size={16} />
          </View>
        </TouchFeedback>
      )
    }
  }
  _getSubToolbarView()
  {
    return (
      <View style={{
          height:44,backgroundColor:'#F0F0F5',
          alignItems:'center',paddingLeft:16,
          flexDirection:'row',borderTopWidth:1,
          borderBottomWidth:1,borderColor:LINE
        }}>
        {this._getAssetNoView()}
        <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
          <TouchFeedback
            onPress={()=>{
              this.props.onFilterClick();
            }}>
            <View style={{height:40,paddingHorizontal:16,
              alignItems:'center',justifyContent:'flex-end',flexDirection:'row'}}>
              <Icon type="icon_filter" color={GREEN} size={16} />
            </View>
          </TouchFeedback>
          {this._getAddRecordView()}
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
          swipable={Platform.OS === 'ios'}
          renderSeperator={(sectionId,rowId)=>this._renderSeperator(sectionId,rowId)}
          renderRow={(rowData,sectionId,rowId,rowMap)=>this._renderRow(rowData,sectionId,rowId,rowMap)}
          renderHiddenRow={(rowData,sectionId,rowId,rowMap)=>this._renderHiddenRow(rowData,sectionId,rowId,rowMap)}
          renderSectionHeader={(sectionData,sectionId)=>this._renderSection(sectionData,sectionId)}
          emptyText={localStr('lang_record_des20')}
          filterEmptyText={localStr('lang_record_des45')}
        />
      </View>
    );
  }
}

MaintainRecordsView.propTypes = {
  user:PropTypes.object,
  currentPage:PropTypes.number,
  totalPage:PropTypes.number,
  hasFilter:PropTypes.bool.isRequired,
  canEdit:PropTypes.bool,
  onRowClick:PropTypes.func.isRequired,
  onFilterClick:PropTypes.func.isRequired,
  onAddClick:PropTypes.func.isRequired,
  onRowLongPress:PropTypes.func.isRequired,
  clearFilter:PropTypes.func.isRequired,
  isFetching:PropTypes.bool.isRequired,
  listData:PropTypes.object,
  sectionData:PropTypes.object,
  onRefresh:PropTypes.func.isRequired,
  nextPage:PropTypes.func.isRequired,
}
