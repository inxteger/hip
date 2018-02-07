
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
  loadStructurePhotos,structurePhotoInfoChange} from '../../actions/assetsAction.js';
import {deleteImages} from '../../actions/imageAction';
import DeviceStruPhotosView from '../../components/assets/DeviceStruPhotosView.js';
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
  componentDidMount() {
    if (this.props.deviceId) {
      InteractionManager.runAfterInteractions(()=>{
        // this._loadContentById(this.props.deviceId);
      });
    }

    backHelper.init(this.props.navigator,this.props.route.id);
  }
  componentWillReceiveProps(nextProps) {
  }

  componentWillUnmount() {
    backHelper.destroy(this.props.route.id);
  }
  _addPhoto()
  {

  }
  _deleteImage(imageId){
    // console.warn('_deleteImage...',imageId);
    this.props.deleteImages(imageId);
  }
  _dataChanged(type,action,value){
    this.props.logInfoChanged({
      log:this.props.log,
      hierarchyId:this.props.hierarchyId,
      userId:this.props.user.get('Id'),
      type,action,value
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
  _openImagePicker(){
    this.props.navigator.push({
      id:'imagePicker',
      component:ImagePicker,
      passProps:{
        max:MAX-this.props.assetLog.get('Pictures').size,
        dataChanged:(chosenImages)=>this._dataChanged('image','add',chosenImages)
      }
    });
  }
  _goToDetail(items,index,thumbImageInfo)
  {
    var canEdit=this.props.isSameUser;
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
    var title=localStr('机器结构');
    //this.props.ticketInfo?localStr('lang_ticket_edit_ticket'):localStr('lang_ticket_create_ticket');
    return (
      <DeviceStruPhotosView
        onBack={()=>this._onBackClick()}
        onRefresh={()=>this._onRefresh()}
        title={title}
        data={this.props.data}
        isFetching={this.props.isFetching}
        isSameUser={this.props.isSameUser}
        openImagePicker={()=>this._openImagePicker()}
        checkAuth={()=>this._checkAuth()}
        onAddPhoto={()=>this._addPhoto()}
        gotoDetail={(items,index,thumbImageInfo)=>this._goToDetail(items,String(index),thumbImageInfo)}
        deleteImage={(imageId)=>this._deleteImage(imageId)}
        dataChanged={(type,action,value)=>this._dataChanged(type,action,value)}
        onRowClick={(rowData,viewType)=>this._gotoDetail(rowData,viewType)}
        />
    );
  }
}

MRecordDetail.propTypes = {
  navigator:PropTypes.object,
  route:PropTypes.object,
  deviceId:PropTypes.number,
  data:PropTypes.object,
  user:PropTypes.object,
  loadStructurePhotos:PropTypes.func,
  structurePhotoInfoChange:PropTypes.func,
  // modifyRecordDetail:PropTypes.func,
  // onPostingCallback:PropTypes.func,
  // resetEditRecord:PropTypes.func,
  // initCreateRecord:PropTypes.func,
  // updateMaintancePartsSelectInfo:PropTypes.func,
  isSameUser:PropTypes.bool,
  deleteImages:PropTypes.func,
}

function mapStateToProps(state,ownProps) {
  var recordDetail = state.asset.mRecordDetail,
      isFetching = recordDetail.get('isFetching');
  var data = recordDetail.get('data');
  // // console.warn('mapStateToProps...',startTime,endTime);
  // if (ownProps.customer.get('CustomerId') !== data.get('CustomerId')) {
  //   data = null;
  // }
  var deviceId=ownProps.deviceId;
  var user = state.user.get('user');
  var isSameUser = true;
  if(data && data.get('CreateUserId') !== user.get('Id')){
    isSameUser = false;
  }
  // var isEnableCreate = customer && ticketType!==0 && selectAssets.size>=1 && startTime && endTime && selectUsers.size>=1 && content.length>0;
  // console.warn('mapStateToProps',data);
  return {
    deviceId,
    data,
    isFetching,
    isSameUser,
    user:state.user.get('user'),
  };
}

export default connect(mapStateToProps,{
  loadStructurePhotos,
  structurePhotoInfoChange,
  // modifyRecordDetail,
  // resetEditRecord,
  // initCreateRecord,
  // updateMaintancePartsSelectInfo,
  deleteImages,
})(MRecordDetail);
