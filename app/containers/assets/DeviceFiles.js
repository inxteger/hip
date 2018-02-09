
'use strict';
import React,{Component} from 'react';
import {
  Alert,
  ListView,
  InteractionManager,
} from 'react-native';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import backHelper from '../../utils/backHelper';
import DeviceFilesView from '../../components/assets/DeviceFilesView.js';
import TicketDetail from '../ticket/TicketDetail.js';
import privilegeHelper from '../../utils/privilegeHelper.js';
import {loadDeviceFiles,filesInfoChange} from '../../actions/assetsAction.js';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';
import ImagePicker from '../ImagePicker.js';
import PhotoShow from './PhotoShow';
import {deleteImages} from '../../actions/imageAction';
const MAX = 100;

class DeviceFiles extends Component{
  constructor(props){
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var data = props.deviceFiles.get('Pictures');
    if (data) {
      data = data.toArray();
      this.state = { dataSource:this.ds.cloneWithRows(data)};
    }else {
      this.state = { dataSource:null};
    }
  }

  _addPhoto()
  {
    this._openImagePicker()
  }
  _deleteImage(imageId){
    // console.warn('_deleteImage...',imageId);
    this.props.deleteImages(imageId);
  }
  _dataChanged(type,action,value){
    console.warn('aaaa',value);
    this.props.filesInfoChange({
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
        max:MAX-this.props.deviceFiles.get('Pictures').size,
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
        type:'structure',
        onRemove:(item)=>this._photoViewDeleteImage(item),
        checkAuth:()=>this._checkAuth(),
        canEdit:canEdit,
      }
    });
  }
  _loadDeviceFilesData(filter){
    filter=filter.setIn(['Criteria','HierarchyId'],this.props.hierarchyId);
    this.props.loadDeviceFiles(filter.toJSON());
  }
  _onAddClick()
  {
    this._openImagePicker()
  }
  _gotoDetail(data){
    // this.props.navigator.push({
    //   id:'ticket_detail',
    //   component:TicketDetail,
    //   passProps:{
    //     onPostingCallback:(type)=>{},
    //     ticketId:String(data.get('Id')),
    //     fromHex:false,
    //     fromFilterResult:false,
    //     isFutureTask:false,
    //   },
    // });
  }
  _onRefresh(){
    // console.warn('_onRefresh',this.props.filter.get('PageIndex'));
    if (this.props.filter.get('PageIndex')===1) {
      this._loadDeviceFilesData(this.props.filter);
    }else {
      this.props.firstPage();
    }
  }
  componentDidMount() {
    backHelper.init(this.props.navigator,this.props.route.id);
    InteractionManager.runAfterInteractions(() => {
      this._loadDeviceFilesData(this.props.filter);
    });
  }
  componentWillReceiveProps(nextProps) {
    var data = nextProps.deviceFiles.get('Pictures');
    var origData = this.props.deviceFiles.get('Pictures');
    // console.warn('componentWillReceiveProps...',data,origData);
    if((data !== origData)){// && data && data.size >= 1){
      // this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      InteractionManager.runAfterInteractions(()=>{
        this.setState({dataSource:this.ds.cloneWithRows(data.toArray())});
      });
    }

    if(this.props.filter !== nextProps.filter){
      InteractionManager.runAfterInteractions(()=>{
        this._loadDeviceFilesData(nextProps.filter);
      });
    }
  }
  componentWillUnmount() {
    backHelper.destroy(this.props.route.id);
  }
  render() {
    return (
      <DeviceFilesView
        title={localStr('机器文件')}
        isFetching={this.props.deviceFiles.get('isFetching')}
        hasFilter={false}
        listData={this.state.dataSource}
        nextPage={()=>this.props.nextPage()}
        emptyText={localStr('lang_asset_des35')}
        currentPage={this.props.filter.get('PageIndex')}
        onRefresh={()=>this._onRefresh()}
        totalPage={this.props.deviceFiles.get('pageCount')}
        onRowClick={(rowData)=>this._gotoDetail(rowData)}
        onAddClick={()=>this._onAddClick()}
        onBack={()=>this.props.navigator.pop()} />
    );
  }
}

DeviceFiles.propTypes = {
  navigator:PropTypes.object,
  route:PropTypes.object,
  user:PropTypes.object,
  isFetching:PropTypes.bool,
  loadDeviceFiles:PropTypes.func,
  filesInfoChange:PropTypes.func,
  deleteImages:PropTypes.func,
  hierarchyId:PropTypes.number,
  deviceFiles:PropTypes.object,//immutable
  filter:PropTypes.object,
}

function mapStateToProps(state,ownProps) {
  var id = ownProps.hierarchyId;
  var deviceFiles = state.asset.deviceFiles;
  var data = null;
  // console.warn('ticketId',id);
  // if(deviceFiles.get('hierarchyId') === id){
  //   data = deviceFiles.get('data');
  // }
  var filter=deviceFiles.get('filter');
  return {
    user:state.user.get('user'),
    deviceFiles,
    isFetching:deviceFiles.get('isFetching'),
    filter
  };
}

export default connect(mapStateToProps,{loadDeviceFiles,filesInfoChange,deleteImages})(DeviceFiles);
