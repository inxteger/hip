
'use strict';

import React,{Component} from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import backHelper from '../../utils/backHelper';
import TaskDesEditView from '../../components/ticket/TaskDesEditView';
// import {ticketCreateConditionChange} from '../../actions/ticketAction';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

class TicketTaskDesEdit extends Component{
  constructor(props){
    super(props);
  }
  _save(value){
    this.props.onSave(value);
    // this.props.ticketCreateConditionChange({
    //   type:'Content',value
    // });
    this.props.navigator.pop();
  }
  _dataChanged(value){
    // this.props.ticketCreateConditionChange({
    //   type:'Content',value
    // });
  }
  componentDidMount() {
    backHelper.init(this.props.navigator,this.props.route.id);
  }
  componentWillReceiveProps(nextProps) {
    // if(nextProps.logs !== this.props.logs){
    //   this.props.navigator.pop();
    // }
  }
  componentWillUnmount() {
    backHelper.destroy(this.props.route.id);
  }
  render() {
    return (
      <TaskDesEditView
        title={this.props.title}
        content={this.props.content}
        user={null}
        ticketId={this.props.ticketId}
        editable={this.props.editable}
        onSave={(data)=>this._save(data)}
        dataChanged={(value)=>this._dataChanged(value)}
        onBack={()=>this.props.navigator.pop()} />
    );
  }
}

TicketTaskDesEdit.propTypes = {
  navigator:PropTypes.object,
  route:PropTypes.object,
  user:PropTypes.object,
  content:PropTypes.string,
  title:PropTypes.string,
  onSave:PropTypes.func,
  // ticketCreateConditionChange:PropTypes.func,
  editable:PropTypes.bool,
  hasAuth:PropTypes.bool,
  ticketId:PropTypes.number,
}

function mapStateToProps(state,ownProps) {
  return {}
}

export default connect(mapStateToProps,{
  // ticketCreateConditionChange
})(TicketTaskDesEdit);
