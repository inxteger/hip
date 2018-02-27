
'use strict';
import React,{Component} from 'react';
import {
  View,
  Platform,
  Dimensions,
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
import DeviceUploadFilesRow from './DeviceUploadFilesRow.js';
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
  _imageLoadComplete(item,response){
    var key='';
    response=JSON.parse(response);
    if (response&&response.Result&&response.Result.Key) {
      key=response.Result.Key;
      item=item.set('Key',key);
    }
    this.props.filesInfoChange('image','uploaded',item);
  }
  _renderRow(rowData,sectionId,rowId){
    var {width} = Dimensions.get('window');
    if (rowData.get('isUpdateing')) {
      // console.warn('aaa',width);
      return (
        <DeviceUploadFilesRow
          name={rowData.get('Name')}
          uri={rowData.get('uri')}
          loaded={rowData.get('loaded')}
          width={width}
          postUri={`device/dirfile/upload/${rowData.get('PictureId')}/${this.props.deviceId}/${this.props.dirid}`}
          loadComplete = {(response)=>this._imageLoadComplete(rowData,response)}>
        </DeviceUploadFilesRow>
      )
    }
    return (
      <DeviceFilesRow
        key={rowId}
        width={width}
        rowData={rowData}
        onRowClick={(rowData)=>{
          this.props.onRowClick(rowData);
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
      if (this.props.canEdit) {
        actions = [{
          title:this.props.title,
          iconType:'add',
          show:'always'}];
      }
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
          emptyText={this.props.dirid?localStr('没有文件'):localStr('没有文件或文件夹')}
        />
      </View>
    );
  }
}
//没有文件
DeviceFilesView.propTypes = {
  user:PropTypes.object,
  title:PropTypes.string,
  currentPage:PropTypes.number,
  totalPage:PropTypes.number,
  hasFilter:PropTypes.bool.isRequired,
  canEdit:PropTypes.bool,
  onRowClick:PropTypes.func.isRequired,
  onAddClick:PropTypes.func.isRequired,
  clearFilter:PropTypes.func,
  filesInfoChange:PropTypes.func.isRequired,
  dirid:PropTypes.number.isRequired,
  deviceId:PropTypes.number.isRequired,
  isFetching:PropTypes.bool.isRequired,
  listData:PropTypes.object,
  sectionData:PropTypes.object,
  onRefresh:PropTypes.func.isRequired,
  nextPage:PropTypes.func.isRequired,
}
