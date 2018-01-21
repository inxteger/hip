
'use strict';
import React,{Component} from 'react';
import {
  Alert,
  InteractionManager,
} from 'react-native';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import backHelper from '../../utils/backHelper';

import {
  // loadMRecordDetailData,
  loadMtDetailById,maintanceRecordInfoChangeChange,
  // singleSelectDataChange
  // ,createTicket,resetCreateTicket,updateUserSelectInfo,updateAssetsSelectInfo,deleteTicket
        } from '../../actions/assetsAction.js';
import MRecordDetailView from '../../components/assets/MRecordDetailView.js';
import TicketTaskDesEdit from '../ticket/TicketTaskDesEdit';
import MSingleSelect from './MSingleSelect.js';
// import UsersSelect from './UsersSelect';
// import AssetsSelect from './AssetsSelect';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';
import Immutable from 'immutable';

class MRecordDetail extends Component{
  static contextTypes = {
    showSpinner: PropTypes.func,
    hideHud: PropTypes.func
  }
  constructor(props){
    super(props);
    this.state = {viewType:'view'};
    this.types=[{'Code':2,'Type':'操作不当'},{'Code':4,'Type':'自然老化'},{'Code':8,'Type':'设计缺陷'},
    {'Code':16,'Type':'维修不当'},{'Code':32,'Type':'维护不当'},{'Code':1,'Type':'其他原因'}];
    this.results=[{'Code':1,'Type':'故障排除完成'},{'Code':2,'Type':'临时处理完成'},{'Code':3,'Type':'设备未修复'}];
  }
  _loadContentById(recordId){
    this.props.loadMtDetailById(recordId);
    // if (!this.props.ticketInfo) {
    //   if (!this.props.alarm) {
    //     this.props.loadMRecordDetailData({'type':'createNormalTicket','value':{customer,alarm:this.props.alarm}});
    //   }else {
    //     this.props.loadMRecordDetailData({'type':'createAlarmTicket','value':{customer,alarm:this.props.alarm}});
    //   }
    // }else {
    //   this.props.loadMRecordDetailData({'type':'editNormalTicket','value':{customer,ticket:this.props.ticketInfo}});
    // }
  }
  _onChangeTicketType(type,value)
  {
    this.props.maintanceRecordInfoChangeChange({
      type,
      value
    });
  }
  _gotoDetail(rowData,viewType){
    var type=rowData.type;
    if (type === 'FaultPhenomenon') {
      this.props.navigator.push({
        id:'ticket_description',
        component:TicketTaskDesEdit,
        passProps:{
          content:rowData.value,
          title:rowData.title,
          editable:viewType==='edit',
          onSave:(value)=>{
            this.props.maintanceRecordInfoChangeChange({
              type:'FaultPhenomenon',value
            });
          },
        }
      });
    }
    else if (type === 'FaultJudgeText') {
      this.props.navigator.push({
        id:'ticket_description',
        component:TicketTaskDesEdit,
        passProps:{
          content:rowData.value,
          title:rowData.title,
          editable:viewType==='edit',
          onSave:(value)=>{
            this.props.maintanceRecordInfoChangeChange({
              type:'FaultJudgeText',value
            });
          },
        }
      });
    }else if (type === 'FaultRemoval') {
      this.props.navigator.push({
        id:'ticket_description',
        component:TicketTaskDesEdit,
        passProps:{
          content:rowData.value,
          title:rowData.title,
          editable:viewType==='edit',
          onSave:(value)=>{
            this.props.maintanceRecordInfoChangeChange({
              type:'FaultRemoval',value
            });
          },
        }
      });
    }else if (type === 'DealResult') {
      var arrDatas=this.results;
      arrDatas.forEach((item,index)=>{
        item.title=item.Type;
        item.id=item.Code;
        item.isCheck=item.Type===rowData.value;
      });
      this.props.navigator.push({
        id:'ticket_description',
        component:MSingleSelect,
        passProps:{
          curSelectId:String(this.props.data.get('DealResult')),
          arrDatas,
          title:rowData.title,
          onSave:(value)=>{
            console.warn('aaa',value);
            this.props.maintanceRecordInfoChangeChange({
              type,value
            });
          },
        }
      });
    }else if (type === 'FaultJudgeType') {
      var arrDatas=this.types;
      arrDatas.forEach((item,index)=>{
        item.title=item.Type;
        item.id=item.Code;
        item.isCheck=item.Type===rowData.value;
      });
      this.props.navigator.push({
        id:'ticket_description',
        component:MSingleSelect,
        passProps:{
          curSelectId:String(this.props.data.get('FaultJudgeType')),
          arrDatas,
          title:rowData.title,
          onSave:(value)=>{
            console.warn('aaa',value);
            this.props.maintanceRecordInfoChangeChange({
              type,value
            });
          },
        }
      });
    }else {
      console.warn('aa',type,rowData);
    }

  }
  _onDateChanged(type,value)
  {
    this.props.maintanceRecordInfoChangeChange({
      type,value
    });
  }
  _onRefresh(){
  }

  _onBackClick(){
    this.props.navigator.pop();
  }
  _checkTimeIsTrue()
  {
    var StartTime = this.props.data.get('StartTime');
    var EndTime = this.props.data.get('EndTime');
    if(StartTime > EndTime){
      Alert.alert(
        '',
        localStr('lang_ticket_starttimeerr0'),
        [
          {text: localStr('lang_ticket_OK'), onPress: () => console.log('Cancel Pressed')}
        ]
      )
      return false;
    }
    return true;
  }
  _onCreateTicket()
  {
    if (!this._checkTimeIsTrue()) {
      return;
    }
    console.warn('asdfasdf');
    this.context.showSpinner();

    var selectAssets=this.props.data.get('selectAssets');
    var selectUsers=this.props.data.get('selectUsers');
    var Assets=[];
    selectAssets.forEach((item)=>{
      Assets.push({'HierarchyId':item.get('Id')});
    });
    var Executors=[];
    selectUsers.forEach((item)=>{
      Executors.push({'UserId':item.get('Id')});
    });
    var reqbody = {
      CustomerId:this.props.data.get('CustomerId'),
      TicketType:this.props.data.get('TicketType'),
      Assets:Assets,
      StartTime:this.props.data.get('StartTime'),
      EndTime:this.props.data.get('EndTime'),
      Executors:Executors,
      Content:this.props.data.get('Content'),
    };
    if (this.props.alarm) {
      reqbody.AlarmId=this.props.alarm.get('Id');
    }
    if (this.props.ticketInfo && this.props.ticketInfo.get('Id')) {
      reqbody.Id=this.props.ticketInfo.get('Id');
    }
    this.props.createTicket(reqbody,!this.props.ticketInfo);
  }
  _onDeleteTicket(){
    var {ticketInfo} = this.props;
    var alertText = localFormatStr('lang_ticket_remove_notice',ticketInfo.get('TicketNum'));
    Alert.alert(
      '',
      alertText,
      [
        {text: localStr('lang_ticket_cancel'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: localStr('lang_ticket_remove'), onPress: () => {

          this.props.deleteTicket(ticketInfo.get('Id'));
          this.props.onPostingCallback('delete');
        }}
      ]
    )

  }
  componentDidMount() {
    InteractionManager.runAfterInteractions(()=>{
      this._loadContentById(this.props.recordId);
    });
    backHelper.init(this.props.navigator,this.props.route.id);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.isPosting===2 && this.props.isPosting===1) {
      // console.warn('hideHud 1');
      this.context.hideHud();
      // console.warn('ticketCreate edit componentWillReceiveProps...',this.props.isFetching,this.props.isPosting,this.props.isEnableCreate);
      this.props.onPostingCallback(this.props.ticketInfo?'edit':'create');
      return ;
    }
  }

  componentWillUnmount() {
    backHelper.destroy(this.props.route.id);
    // this.props.resetCreateTicket();
  }

  render() {
    var title='设备维修历史详情';
    if (this.state.viewType==='edit') {
      title='编辑设备维修历史';
    }
    //this.props.ticketInfo?localStr('lang_ticket_edit_ticket'):localStr('lang_ticket_create_ticket');
    return (
      <MRecordDetailView
        onBack={()=>this._onBackClick()}
        onRefresh={()=>this._onRefresh()}
        title={title}
        isPosting={this.props.isPosting}
        data={this.props.data}
        viewType={this.state.viewType}
        types={this.types}
        results={this.results}
        onEditDetail={()=>{
          // this.setState({'viewType':'edit'});//correct

          if (this.state.viewType==='edit') {//test
            this.setState({viewType:'view'})
          }else {
            this.setState({'viewType':'edit'});
          }
        }}
        onRowClick={(rowData,viewType)=>this._gotoDetail(rowData,viewType)}
        />
    );
  }
}

// customer={this.props.customer}
// ticketInfo={this.props.ticketInfo}
// isEnableCreate={this.props.isEnableCreate}
// isAlarm={!!this.props.alarm||(this.props.ticketInfo&&this.props.ticketInfo.get('TicketType')===2)}
// onCreateTicket={()=>this._onCreateTicket()}
// onDeleteTicket={()=>this._onDeleteTicket()}
//
// onDateChanged={(type,value)=>this._onDateChanged(type,value)}
// onTicketTypeSelect={(type,value)=>this._onChangeTicketType(type,value)}

MRecordDetail.propTypes = {
  navigator:PropTypes.object,
  route:PropTypes.object,
  recordId:PropTypes.number,
  data:PropTypes.object,
  loadMtDetailById:PropTypes.func,
  maintanceRecordInfoChangeChange:PropTypes.func,
  // singleSelectDataChange:PropTypes.func,

  // alarm:PropTypes.object,
  // ticketInfo:PropTypes.object,
  // onPostingCallback:PropTypes.func,
  // loadMRecordDetailData:PropTypes.func,
  //
  // updateUserSelectInfo:PropTypes.func,
  // deleteTicket:PropTypes.func,
  // updateAssetsSelectInfo:PropTypes.func,
  // createTicket:PropTypes.func,
  // resetCreateTicket:PropTypes.func,
  // isFetching:PropTypes.bool,
  // isPosting:PropTypes.number,
  // isEnableCreate:PropTypes.bool,
  // selectUsers:PropTypes.object,
  // selectAssets:PropTypes.object,
  // reqBody:PropTypes.any,
}

function mapStateToProps(state,ownProps) {
  var recordDetail = state.asset.mRecordDetail,
      isFetching = recordDetail.get('isFetching'),
      isPosting = recordDetail.get('isPosting');
      // selectUsers = ticketCreate.get('selectUsers'),
      // selectAssets = ticketCreate.get('selectAssets'),
      // startTime = ticketCreate.get('StartTime'),
      // endTime = ticketCreate.get('EndTime'),
      // content = ticketCreate.get('Content'),
      // ticketType = ticketCreate.get('TicketType');
  // var customer = ownProps.customer;
  // var alarm = ownProps.alarm;
  // var ticketInfo = ownProps.ticketInfo;
  var data = recordDetail.get('data');
  // // console.warn('mapStateToProps...',startTime,endTime);
  // if (ownProps.customer.get('CustomerId') !== data.get('CustomerId')) {
  //   data = null;
  // }

  var recordId=ownProps.recordId;

  // var isEnableCreate = customer && ticketType!==0 && selectAssets.size>=1 && startTime && endTime && selectUsers.size>=1 && content.length>0;
  // console.warn('mapStateToProps',data);
  return {
    recordId,
    data,
    isFetching,
    isPosting,
    // isEnableCreate,
    // selectUsers,
    // selectAssets,
    // customer,
    // alarm,
    // ticketInfo,
  };
}

export default connect(mapStateToProps,{
  //loadMRecordDetailData,
  loadMtDetailById,
  maintanceRecordInfoChangeChange,
  // singleSelectDataChange,
  // ,
  // ,
  // createTicket,resetCreateTicket,updateUserSelectInfo,updateAssetsSelectInfo,deleteTicket
})(MRecordDetail);
