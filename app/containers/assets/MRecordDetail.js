
'use strict';
import React,{Component} from 'react';
import {
  Alert,
  InteractionManager,
} from 'react-native';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import backHelper from '../../utils/backHelper';
import MaintancePartsSelect from './MaintancePartsSelect.js';
import ImagePicker from '../ImagePicker.js';
import PhotoShow from './PhotoShow';

import {
  loadMtDetailById,maintanceRecordInfoChangeChange,
  modifyRecordDetail,resetEditRecord,initCreateRecord,
  updateMaintancePartsSelectInfo,} from '../../actions/assetsAction.js';
import {deleteImages} from '../../actions/imageAction';
import MRecordDetailView from '../../components/assets/MRecordDetailView.js';
import TicketTaskDesEdit from '../ticket/TicketTaskDesEdit';
import MSingleSelect from './MSingleSelect.js';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';
import Immutable from 'immutable';
import moment from 'moment';
const MAX = 100;

class MRecordDetail extends Component{
  static contextTypes = {
    showSpinner: PropTypes.func,
    hideHud: PropTypes.func
  }
  constructor(props){
    super(props);
    this.state = {viewType:'view',};
    this.types=[
      {'Code':2,'Type':localStr('lang_record_des09')},
      {'Code':4,'Type':localStr('lang_record_des10')},
      {'Code':8,'Type':localStr('lang_record_des11')},
      {'Code':16,'Type':localStr('lang_record_des12')},
      {'Code':32,'Type':localStr('lang_record_des13')},
      {'Code':1,'Type':localStr('lang_record_des14')}];
    this.results=[{'Code':1,'Type':localStr('lang_record_des15')},{'Code':2,'Type':localStr('lang_record_des16')},{'Code':3,'Type':localStr('lang_record_des17')}];
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
          editable:viewType!=='view',
          maxLength:300,
          placeholdText:localStr('lang_record_des39'),
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
          editable:viewType!=='view',
          maxLength:300,
          placeholdText:localStr('lang_record_des39'),
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
          editable:viewType!=='view',
          maxLength:300,
          placeholdText:localStr('lang_record_des39'),
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
            this.props.maintanceRecordInfoChangeChange({
              type,value
            });
          },
        }
      });
    }else if (type === 'Parts') {
      this.props.updateMaintancePartsSelectInfo({type:'init',value:this.props.selectParts});
      this.props.updateMaintancePartsSelectInfo({type:'initSingleSelect',value:true});
      var customerId=this.props.customerId;
      var hierarchyId=this.props.hierarchyId;
      if (!this.props.customerId) {
        // customerId=321238;
        // hierarchyId=345761;//321637;//test
      }
      this.props.navigator.push({
          id:'ticket_users',
          component:MaintancePartsSelect,
          passProps:{
            title:localStr('lang_record_des04'),
            customerId:customerId,
            hierarchyId:hierarchyId,
          }
        });
    }else if (type === 'MaintainTime') {
      this.props.maintanceRecordInfoChangeChange({
        type,value:rowData.value
      });
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
    var timeCreate = this.props.data.get('MaintainTime');
    var tomorrow=moment(moment().add(1, 'days').format('YYYY-MM-DD'));
    // console.warn('aaa',timeCreate,tomorrow);
    if(moment(timeCreate) > tomorrow){
      Alert.alert(
        '',
        localStr('lang_asset_des11'),
        [
          {text: localStr('lang_ticket_OK'), onPress: () => console.log('Cancel Pressed')}
        ]
      )
      return false;
    }
    return true;
  }
  _onModifyRecordDetail()
  {
    if (!this._checkTimeIsTrue()) {
      return;
    }

    this.context.showSpinner();

    var objData=this.props.data.toJSON();
    objData.RemFiles.forEach((item,index)=>{
      item.Key=item.PictureId;
      item.uri=undefined;
      item.PictureId=undefined;
    });
    this.props.modifyRecordDetail(objData);
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
    if (this.props.recordId) {
      InteractionManager.runAfterInteractions(()=>{
        this._loadContentById(this.props.recordId);
      });
    }else {
      this.setState({'viewType':'create'});
      this.props.initCreateRecord({hierarchyId:this.props.hierarchyId,
        realName:this.props.user.get('RealName'),
        userId:this.props.user.get('Id'),});
    }

    backHelper.init(this.props.navigator,this.props.route.id);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.isPosting===2 && this.props.isPosting===1) {
      // console.warn('hideHud 1');
      this.context.hideHud();
      // console.warn('ticketCreate edit componentWillReceiveProps...',this.props.isFetching,this.props.isPosting,this.props.isEnableCreate);
      this.props.onPostingCallback(this.props.ticketInfo?'edit':'create');
      InteractionManager.runAfterInteractions(()=>{
        this.props.navigator.pop();
      });
      return ;
    }else if (nextProps.isPosting===3 && this.props.isPosting===1) {

    }
  }

  componentWillUnmount() {
    backHelper.destroy(this.props.route.id);
    this.props.resetEditRecord();
  }
  _dataChanged(type,action,value){
    this.props.maintanceRecordInfoChangeChange(
      {
        type,
        value,
        action,
        recordId:this.props.recordId,
        userId:this.props.user.get('Id'),
      }
    )
  }
  _deleteImage(imageId){
    // console.warn('_deleteImage...',imageId);
    this.props.deleteImages(imageId);
  }
  _openImagePicker(){
    this.props.navigator.push({
      id:'imagePicker',
      component:ImagePicker,
      passProps:{
        max:MAX-this.props.data.get('RemFiles').size,
        dataChanged:(chosenImages)=>this._dataChanged('image','add',chosenImages)
      }
    });
  }
  _checkAuth(){
    // if(!this.props.hasAuth){
    //   // Alert.alert('',localStr('lang_alarm_des1'));
    //   return false;
    // }
    if (this.state.viewType==='view') {
      return false;
    }
    if(!this.props.isSameUser){
      Alert.alert(
        '',
        localStr('lang_ticket_notice7'),
        [
          {text: localStr('lang_ticket_OK'), onPress: () =>{}}
        ]
      )
      return false;
    }
    return true;
  }
  _photoViewDeleteImage(item)
  {
    // console.warn('AssetLogEdit...',item);
    if (this._checkAuth()&&item) {
      this._dataChanged('image','delete',item);
      this._deleteImage([item.get('PictureId')]);
    }
  }
  _goToDetail(items,index,thumbImageInfo)
  {
    var canEdit=this.props.isSameUser&&this.state.viewType!=='view';
    this.props.navigator.push({
      id:'photo_show',
      component:PhotoShow,
      passProps:{
        index:index,
        arrPhotos:items,
        thumbImageInfo:thumbImageInfo,
        type:'recordLog',
        onRemove:(item)=>this._photoViewDeleteImage(item),
        checkAuth:()=>this._checkAuth(),
        canEdit:canEdit,
      }
    });
  }
  render() {
    var title=localStr('lang_record_des40');
    if (this.state.viewType==='edit') {
      title=localStr('lang_record_des41');
    }else if (this.state.viewType==='create') {
      title=localStr('lang_record_des42');
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
        extData={this.props.extData}
        isSameUser={this.props.isSameUser}
        openImagePicker={()=>this._openImagePicker()}
        onEditDetail={()=>{
          // this.setState({'viewType':'edit'});//correct

          if (this.state.viewType==='edit') {//test
            this.setState({viewType:'view'})
          }else {
            this.setState({'viewType':'edit'});
          }
        }}
        checkAuth={()=>this._checkAuth()}
        gotoDetail={(items,index,thumbImageInfo)=>this._goToDetail(items,String(index),thumbImageInfo)}
        deleteImage={(imageId)=>this._deleteImage(imageId)}
        dataChanged={(type,action,value)=>this._dataChanged(type,action,value)}
        onRowClick={(rowData,viewType)=>this._gotoDetail(rowData,viewType)}
        onSave={()=>this._onModifyRecordDetail()}
        />
    );
  }
}

MRecordDetail.propTypes = {
  navigator:PropTypes.object,
  route:PropTypes.object,
  recordId:PropTypes.number,
  extData:PropTypes.string,
  data:PropTypes.object,
  user:PropTypes.object,
  selectParts:PropTypes.object,
  loadMtDetailById:PropTypes.func,
  maintanceRecordInfoChangeChange:PropTypes.func,
  modifyRecordDetail:PropTypes.func,
  onPostingCallback:PropTypes.func,
  resetEditRecord:PropTypes.func,
  initCreateRecord:PropTypes.func,
  updateMaintancePartsSelectInfo:PropTypes.func,
  isSameUser:PropTypes.bool,
  deleteImages:PropTypes.func,
  hierarchyId:PropTypes.number,
  customerId:PropTypes.number,
}

function mapStateToProps(state,ownProps) {
  var recordDetail = state.asset.mRecordDetail,
      isFetching = recordDetail.get('isFetching'),
      isPosting = recordDetail.get('isPosting');
  var data = recordDetail.get('data');
  // // console.warn('mapStateToProps...',startTime,endTime);
  // if (ownProps.customer.get('CustomerId') !== data.get('CustomerId')) {
  //   data = null;
  // }

  var selectParts=recordDetail.get('selectParts');
  var recordId=ownProps.recordId;
  var user = state.user.get('user');
  var isSameUser = true;
  if(data && data.get('CreateUserId') !== user.get('Id')){
    isSameUser = false;
  }
  // var isEnableCreate = customer && ticketType!==0 && selectAssets.size>=1 && startTime && endTime && selectUsers.size>=1 && content.length>0;
  // console.warn('mapStateToProps',data);
  return {
    recordId,
    data,
    isFetching,
    isPosting,
    selectParts,
    isSameUser,
    user:state.user.get('user'),
  };
}

export default connect(mapStateToProps,{
  loadMtDetailById,
  maintanceRecordInfoChangeChange,
  modifyRecordDetail,
  resetEditRecord,
  initCreateRecord,
  updateMaintancePartsSelectInfo,
  deleteImages,
})(MRecordDetail);
