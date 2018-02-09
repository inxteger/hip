
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
import DeviceFilesRow from './DeviceFilesRow.js';
import Section from '../Section.js';
import RowDelete from '../RowDelete.js'
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

export default class DeviceFilesView extends Component{
  constructor(props){
    super(props);
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
  _renderRow(rowData,sectionId,rowId){
    // console.warn('rowData',rowData);
    return (
      <DeviceFilesRow
        key={rowId}
        rowData={rowData}
        onRowClick={(rowData)=>{
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
  _getToolbarView()
  {
    var actions = null;
    // if(data){
      // if (this.props.isSameUser) {
        actions = [{
          title:localStr('机器文件'),
          iconType:'add',
          show:'always'}];
      // }
    // }
    return (
      <Toolbar title={this.props.title}
        navIcon="back"
        onIconClicked={()=>this.props.onBack()}
        actions={actions}
        onActionSelected={[()=>{
          this.props.onAddClick();
        }]}
      />
    );
  }
  render() {
    return (
      <View style={{flex:1,backgroundColor:'white'}}>
        {this._getToolbarView()}
        <List
          needGotoTop={true}
          isFetching={this.props.isFetching}
          listData={this.props.listData}
          hasFilter={this.props.hasFilter}
          currentPage={this.props.currentPage}
          nextPage={this.props.nextPage}
          onRefresh={this.props.onRefresh}
          totalPage={this.props.totalPage}
          swipable={false}
          renderSeperator={(sectionId,rowId)=>this._renderSeperator(sectionId,rowId)}
          renderRow={(rowData,sectionId,rowId)=>this._renderRow(rowData,sectionId,rowId)}
          renderSectionHeader={(sectionData,sectionId)=>this._renderSection(sectionData,sectionId)}
          emptyText={localStr('没有文件或文件夹')}
        />
      </View>
    );
  }
}
//没有文件
DeviceFilesView.propTypes = {
  user:PropTypes.object,
  currentPage:PropTypes.number,
  totalPage:PropTypes.number,
  hasFilter:PropTypes.bool.isRequired,
  canEdit:PropTypes.bool,
  onRowClick:PropTypes.func.isRequired,
  onAddClick:PropTypes.func.isRequired,
  clearFilter:PropTypes.func.isRequired,
  isFetching:PropTypes.bool.isRequired,
  listData:PropTypes.object,
  sectionData:PropTypes.object,
  onRefresh:PropTypes.func.isRequired,
  nextPage:PropTypes.func.isRequired,
}
