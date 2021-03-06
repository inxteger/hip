
'use strict';
import React,{Component} from 'react';
import {
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import Toolbar from '../Toolbar';
import List from '../List.js';
import CustomerRow from './CustomerRow';
import Section from '../Section.js';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

export default class CustomerSelView extends Component{
  constructor(props){
    super(props);
  }
  _renderRow(rowData,sectionId,rowId){
    return (
      <CustomerRow rowData={rowData} onRowClick={this.props.onRowClick} />
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
        <Toolbar title={localStr('lang_ticket_create_ticket')}
          navIcon="close"
          onIconClicked={()=>this.props.onBack()}
        />
        <List
          isFetching={this.props.isFetching}
          listData={this.props.data}
          hasFilter={false}
          currentPage={1}
          totalPage={1}
          emptyText={localStr('lang_ticket_notice0')}
          onRefresh={this.props.onRefresh}
          renderRow={(rowData,sectionId,rowId)=>this._renderRow(rowData,sectionId,rowId)}
          renderSectionHeader={(sectionData,sectionId)=>this._renderSection(sectionData,sectionId)}
        />
      </View>
    );
  }
}
CustomerSelView.propTypes = {
  navigator:PropTypes.object,
  onBack:PropTypes.func.isRequired,
  user:PropTypes.object,
  onRowClick:PropTypes.func.isRequired,
  isFetching:PropTypes.bool.isRequired,
  data:PropTypes.object,
  sectionData:PropTypes.object,
  onRefresh:PropTypes.func.isRequired,
}
