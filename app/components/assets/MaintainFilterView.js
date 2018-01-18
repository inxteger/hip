
'use strict';
import React,{Component} from 'react';
import {
  View,
  ListView,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

import Toolbar from '../Toolbar';
import StatableSelectorGroup from '../alarm/StatableSelectorGroup';
import StatableClickGroup from './StatableClickGroup';
import DateInputGroup from '../ticket/DateInputGroup';
import Button from '../Button';
import {GREEN,} from '../../styles/color.js';
import Loading from '../Loading';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

export default class MaintainFilterView extends Component{
  constructor(props){
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {dataSource: ds.cloneWithRows([0,1,2,3,4])};
  }
  _renderSeparator(sectionId,rowId){
    return (
      <View key={rowId} style={styles.sepView}></View>
    )
  }
  _renderRow(rowData){
    if(rowData === 0){
      console.warn('DateInputGroup',this.props.filter);
      return (
        <DateInputGroup
          title='时间'
          startTime={this.props.filter.get('StartTime')}
          endTime={this.props.filter.get('EndTime')}
          onChanged={(type,text)=>{
            this.props.filterChanged(type,text);
          }} />
      );
    }
    else if(rowData === 1){
      var strUsers=this.props.selectUsers.map((item,index)=>{
        var point=', ';
        if (index===(this.props.selectUsers.size-1)) {
          point='';
        }
        return item.get('RealName')+point;
      });
      return (
        <StatableClickGroup
          title='维修人'
          text={strUsers}
          data={this.props.filter.get('MaintainPersons')}
          placeholderText={'请选择维修人'}
          onRowClick={()=>{
            this.props.onSelectUsers();
          }}
          onChanged={(text)=>this.props.filterChanged('MaintainPersons',text)} />
      );
    }
    else if(rowData === 2){
      if (!this.props.bugResults || this.props.bugResults.length===0) {
        return null;
      }
      return (
        <StatableClickGroup
          title='零部件'
          text={''}
          data={this.props.filter.get('Parts')}
          placeholderText={'请选择零部件'}
          onRowClick={()=>{
            this.props.onSelectUsers();
          }}
          onChanged={(text)=>this.props.filterChanged('Parts',text)} />
      );
    }
    else if(rowData === 3){
      return (
        <StatableSelectorGroup
          title={localStr('故障判定')}
          data={this.props.codes}
          selectedIndexes={this.props.filter.get('FaultJudgeType')}
          onChanged={(index)=>this.props.filterChanged('FaultJudgeType',index)} />
      );
    }else if(rowData === 4){
      if (!this.props.bugResults || this.props.bugResults.length===0) {
        return null;
      }
      return (
        <StatableSelectorGroup
          title={localStr('处理结果')}
          data={this.props.bugResults}
          selectedIndexes={this.props.filter.get('DealResult')}
          onChanged={(index)=>this.props.filterChanged('DealResult',index)} />
      );
    }
    return null;

  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.filter !== this.props.filter||this.props.selectUsers!==nextProps.selectUsers){
      var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.setState({
        dataSource: ds.cloneWithRows([0,1,2,3,4])
      });
    }

  }
  render() {
    var list = null
    if(!this.props.isFetching){
      list = (
        <View style={{flex:1}}>
          <ListView
            style={{flex:1,backgroundColor:'transparent'}}
            contentContainerStyle={{padding:16,paddingBottom:bottomHeight,backgroundColor:'transparent'}}
            dataSource={this.state.dataSource}
            renderSeparator={(sectionId, rowId, adjacentRowHighlighted)=> this._renderSeparator(sectionId,rowId)}
            renderRow={(rowData,sectionId,rowId) => this._renderRow(rowData,sectionId,rowId)}
          />
        </View>
      )
    }
    else {
      list = (<Loading />);
    }
    return (
      <View style={{flex:1,backgroundColor:'white'}}>
        <Toolbar
          title={'维修历史筛选'}
          navIcon="close"
          onIconClicked={this.props.onClose}
          actions={[{
            title:localStr('lang_alarm_filter'),
            show: 'always', showWithText:true}]}
            onActionSelected={[this.props.doFilter]}
          />
        {list}
      </View>
    );
  }
}

MaintainFilterView.propTypes = {
  filter:PropTypes.object,
  codes:PropTypes.array,
  bugCodes:PropTypes.object,
  bugResults:PropTypes.array,
  selectUsers:PropTypes.object,
  doFilter:PropTypes.func.isRequired,
  isFetching:PropTypes.bool.isRequired,
  onClose:PropTypes.func.isRequired,
  filterChanged:PropTypes.func.isRequired,
  onSelectParts:PropTypes.func.isRequired,
  onSelectUsers:PropTypes.func.isRequired,
}

var bottomHeight = 72;

var styles = StyleSheet.create({
  sepView:{
    height:16,
    backgroundColor:'transparent'
  },
  bottom:{
    position:'absolute',
    left:0,
    right:0,
    bottom:0,
    flex:1,
    height:bottomHeight,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'white'
  },
  button:{
    // marginTop:20,
    height:43,
    flex:1,
    marginHorizontal:16,
    borderRadius:6,

  }
});
