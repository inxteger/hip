
'use strict';

import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import backHelper from '../../utils/backHelper';

import MSingleSelectView from '../../components/assets/MSingleSelectView';
import {singleSelectDataChange} from '../../actions/assetsAction.js';

class MSingleSelect extends Component{
  constructor(props){
    super(props);
    this.state={curSelectId:props.curSelectId};
    this.props.singleSelectDataChange({type:'init',value:this.props.arrDatas});
  }
  componentDidMount() {
    backHelper.init(this.props.navigator,this.props.route.id);
  }
  componentWillReceiveProps(nextProps) {

  }

  componentWillUnmount() {
    backHelper.destroy(this.props.route.id);
  }
  _onRowClick(rowData)
  {
    this.props.singleSelectDataChange({type:'select',value:rowData});
    this.setState({curSelectId:rowData.get('id')});
  }
  render() {
    var data=[];
    if (this.props.data) {
      data=this.props.data.toArray();
    }
    return (
      <MSingleSelectView
        data={data}
        onBack={()=>{this.props.navigator.pop()}}
        title={this.props.title}
        onRowClick={(rowData)=>{this._onRowClick(rowData)}}
        onSave={()=>{
          this.props.onSave(this.state.curSelectId);
          this.props.navigator.pop();
        }}
        />
    );
  }
}
MSingleSelect.propTypes = {
  navigator:PropTypes.object,
  data:PropTypes.object,
  route:PropTypes.object,
  arrDatas:PropTypes.array,
  curSelectId:PropTypes.string,
  title:PropTypes.string.isRequired,
  onSave:PropTypes.func.isRequired,
  singleSelectDataChange:PropTypes.func,
}

function mapStateToProps(state,ownProps) {
  var mSingleSelect=state.asset.mSingleSelect;
  return {
    data:mSingleSelect.get('data'),
  };
}

export default connect(mapStateToProps,{singleSelectDataChange})(MSingleSelect);
