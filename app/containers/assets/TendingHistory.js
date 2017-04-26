
'use strict';
import React,{Component,PropTypes} from 'react';
import {
  Alert,
  ListView,
  InteractionManager,
} from 'react-native';

import {connect} from 'react-redux';
import backHelper from '../../utils/backHelper';
import TendingView from '../../components/assets/TendingView.js';
import TicketDetail from '../ticket/TicketDetail.js';
import privilegeHelper from '../../utils/privilegeHelper.js';
import {loadTendingHistory} from '../../actions/assetsAction.js';

class TendingHistory extends Component{
  constructor(props){
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {dataSource:null};
  }
  _loadTendHistory(){
    this.props.loadTendingHistory(this.props.hierarchyId);
  }
  _gotoDetail(data){
    this.props.navigator.push({
      id:'ticket_detail',
      component:TicketDetail,
      passProps:{
        onPostingCallback:(type)=>{},
        ticketId:String(data.get('Id')),
        fromHex:false,
        fromFilterResult:false,
        isFutureTask:false,
      },
    });
  }
  componentDidMount() {
    backHelper.init(this.props.navigator,this.props.route.id);
    InteractionManager.runAfterInteractions(() => {
      this._loadTendHistory();
    });

  }
  componentWillReceiveProps(nextProps) {
    if(this.props.tickets && !nextProps.tickets){
      InteractionManager.runAfterInteractions(() => {
        this._loadTendHistory();
      });
      return ;
    }
    if(nextProps.tickets && nextProps.tickets !== this.props.tickets ||
      (this.props.tickets && nextProps.tickets === this.props.tickets && this.props.tickets.size === 0)){
      InteractionManager.runAfterInteractions(() => {
        this.setState({dataSource:this.ds.cloneWithRows(nextProps.tickets.toArray())});
      });
    }
  }
  componentWillUnmount() {
    backHelper.destroy(this.props.route.id);
  }
  render() {
    return (
      <TendingView
        title={'维护历史'}
        tickets={this.state.dataSource}
        isFetching={this.props.isFetching}
        emptyText='暂无维护历史纪录'
        onRefresh={()=>this._loadTendHistory()}
        onRowClick={(rowData)=>this._gotoDetail(rowData)}
        onBack={()=>this.props.navigator.pop()} />
    );
  }
}

TendingHistory.propTypes = {
  navigator:PropTypes.object,
  route:PropTypes.object,
  user:PropTypes.object,
  isFetching:PropTypes.bool,
  loadTendingHistory:PropTypes.func,
  hierarchyId:PropTypes.number,
  tickets:PropTypes.object,//immutable
}


function mapStateToProps(state,ownProps) {
  var id = ownProps.hierarchyId;
  var assetTickets = state.asset.assetTickets;
  var tickets = null;
  // console.warn('ticketId',id);
  if(assetTickets.get('hierarchyId') === id){
    tickets = assetTickets.get('data');
  }
  // console.warn('tickets',tickets);
  return {
    user:state.user.get('user'),
    tickets,
    isFetching:assetTickets.get('isFetching')
  };
}

export default connect(mapStateToProps,{loadTendingHistory})(TendingHistory);
