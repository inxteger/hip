
'use strict';
import React,{Component,PropTypes} from 'react';
import {
  View,
} from 'react-native';

import Toolbar from '../Toolbar';
import List from '../List.js';
import AlarmRow from './AlarmRow.js';
import Section from '../Section.js';

export default class Alarm extends Component{
  constructor(props){
    super(props);
  }
  _renderRow(rowData,sectionId,rowId){
    // console.warn('rowData',rowData);
    return (
      <AlarmRow rowData={rowData} onRowClick={this.props.onRowClick} />
    );
  }

  _renderSection(sectionData,sectionId,sectionIndex){
    var sectionTitle = this.props.sectionData.get(sectionId);
    if(!sectionTitle) return null;
    return (
      <Section text={sectionTitle} />
    );
  }


  render() {
    return (
      <View style={{flex:1,backgroundColor:'white'}}>
        <Toolbar title='故障报警'
          actions={[{
            title:'筛选',
            icon:require('../../images/filter/filter.png'),
            show: 'always', showWithText: false}]}
          onActionSelected={[this.props.onFilterClick]} />
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
            emptyText='暂无报警'
            filterEmptyText='没有符合筛选条件的报警'
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
