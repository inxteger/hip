
'use strict';
import React,{Component} from 'react';
import {
  ListView,
  InteractionManager,
} from 'react-native';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import backHelper from '../../utils/backHelper';

import {getUsersFromMaintance,updateMaintanceUserSelectInfo} from '../../actions/assetsAction.js';
import MaintanceSelView from '../../components/assets/MaintanceSelView';
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
    console.warn('aaa');
    this.props.getUsersFromMaintance(this.props.customerId,this.props.hierarchyId);
  }
  _didRowClick(rowData){
    this.props.updateMaintanceUserSelectInfo({type:'select',value:rowData});
  }
  _onSave()
  {
    this.props.updateMaintanceUserSelectInfo({type:'save',value:this.props.selectUsers});
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
    backHelper.destroy(this.props.route.id);
  }
  render() {
    return (
      <MaintanceSelView
        title={this.props.title}
        isFetching={this.props.isFetching}
        data={this.state.dataSource}
        sectionData={this.props.sectionData}
        selectUsers={this.props.selectUsers}
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
  selectUsers:PropTypes.object,
  getUsersFromMaintance:PropTypes.func,
  updateMaintanceUserSelectInfo:PropTypes.func,
}

function mapStateToProps(state,ownProps) {
  var users = state.asset.maintances;
  var data = users.get('data'),
      sectionData = users.get('sectionData'),
      isFetching = users.get('isFetching'),
      selectUsers = users.get('selectUsers');
  return {
    isFetching,
    data,
    sectionData,
    selectUsers
  };
}

export default connect(mapStateToProps,{getUsersFromMaintance,updateMaintanceUserSelectInfo})(MaintancePartsSelect);
