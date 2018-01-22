
'use strict';
import React,{Component} from 'react';
import {
  ListView,
  InteractionManager,
} from 'react-native';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import backHelper from '../../utils/backHelper';

import {getPartsFromMaintance,updateMaintancePartsSelectInfo,resetEditRecord} from '../../actions/assetsAction.js';
import MaintancePartsView from '../../components/assets/MaintancePartsView';
// import umengApi from '../../utils/umengApi.js';

class MaintancePartsSelect extends Component{
  constructor(props){
    super(props);
    this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged:(r1, r2) => r1 !== r2,
    });
    // console.warn('data',props.data);
    // if(props.data){
    //   var obj = props.data.map((item)=>item.toArray()).toArray();
    //   // InteractionManager.runAfterInteractions(() => {
    //     this.state={dataSource:this.ds.cloneWithRowsAndSections(obj)}
    //   // });
    // }else {
    this.state={dataSource:null};
    // }
  }
  _loadUsers(){
    this.props.getPartsFromMaintance(this.props.hierarchyId);
  }
  _didRowClick(rowData){
    this.props.updateMaintancePartsSelectInfo({type:'select',value:rowData});
  }
  _onSave()
  {
    this.props.updateMaintancePartsSelectInfo({type:'save',value:this.props.selectParts});
    this.props.navigator.pop();
  }
  _onRefresh(){
    this._loadUsers();
  }
  componentDidMount() {
    // umengApi.onPageBegin(this.props.route.id);
    InteractionManager.runAfterInteractions(()=>{
      this._loadUsers();
    });
    backHelper.init(this.props.navigator,this.props.route.id);
  }
  componentWillReceiveProps(nextProps) {
    var data = nextProps.data;
    var oldData = this.props.data;
    if(data){
      // console.warn('componentWillReceiveProps...',nextProps.isFetching,nextProps.sectionData,data);
      var obj = data.map((item)=>item.toArray()).toArray();
      InteractionManager.runAfterInteractions(() => {
        this.setState({
          dataSource:this.ds.cloneWithRowsAndSections(obj)});
      });
    }
  }
  componentWillUnmount() {
    // umengApi.onPageEnd(this.props.route.id);
    // this.props.resetEditRecord();
    backHelper.destroy(this.props.route.id);
  }
  render() {
    return (
      <MaintancePartsView
        title={this.props.title}
        isFetching={this.props.isFetching}
        data={this.state.dataSource}
        sectionData={this.props.sectionData}
        selectParts={this.props.selectParts}
        onRowClick={(rowData)=>this._didRowClick(rowData)}
        onBack={()=>this.props.navigator.pop()}
        onSave={()=>this._onSave()}
        onRefresh={()=>this._onRefresh()}
        />
    );
  }
}

MaintancePartsSelect.propTypes = {
  navigator:PropTypes.object,
  route:PropTypes.object,
  title:PropTypes.string,
  users:PropTypes.object,
  customerId:PropTypes.number,
  hierarchyId:PropTypes.number,
  isFetching:PropTypes.bool.isRequired,
  data:PropTypes.object,
  sectionData:PropTypes.object,
  selectParts:PropTypes.object,
  getPartsFromMaintance:PropTypes.func,
  resetEditRecord:PropTypes.func,
  updateMaintancePartsSelectInfo:PropTypes.func,
}

function mapStateToProps(state,ownProps) {
  var parts = state.asset.maintainPartsData;
  var data = parts.get('data'),
      sectionData = parts.get('sectionData'),
      isFetching = parts.get('isFetching'),
      selectParts = parts.get('selectParts');
  return {
    isFetching,
    data,
    sectionData,
    selectParts
  };
}

export default connect(mapStateToProps,{getPartsFromMaintance,updateMaintancePartsSelectInfo,resetEditRecord})(MaintancePartsSelect);
