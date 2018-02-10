
'use strict';
import React,{Component} from 'react';
import {
  View,
  Platform,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';

import moment from 'moment';
import Toolbar from '../Toolbar';
import Button from '../Button.js';
import Bottom from '../Bottom.js';
import {BLACK,GRAY,GREEN,LINE,LIST_BG,PICBORDERCOLOR,DOCBKGCOLOR,ADDICONCOLOR,LOGOUT_RED} from '../../styles/color';
import Text from '../Text';
import NetworkImage from '../NetworkImage';
import TouchFeedback from '../TouchFeedback';

import PrivilegePanel from '../PrivilegePanel.js';
import NetworkDocumentCard from '../NetworkDocumentCard.js';
import {checkFileNameIsImage} from '../../utils/fileHelper.js';
import Loading from '../Loading';

import DateTimePicker from 'react-native-modal-datetime-picker';

import UploadableImage from '../UploadableImage.js';
import Icon from '../Icon';
import ListSeperator from '../ListSeperator';
import Immutable from 'immutable';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

export default class DeviceStuPhotosView extends Component{
  constructor(props){
    super(props);

    var {width} = Dimensions.get('window');
    var picWid = parseInt((width-56)/4.0);
    this.state = {rowType:'',isDateTimePickerVisible:false,imageWidth:picWid,imageHeight:picWid,autoFocus:false};
  }
  _getNavIcon(isNav){
    if(isNav){
      return (
        <View style={{marginLeft:15}}>
          <Icon type='arrow_right' size={16} color={GRAY} />
        </View>
      )
    }
  }
  _getSelectIcon(isSelect){
    if(!!isSelect){
      return (
        <View style={styles.selectView}>
          <Icon type='icon_check' size={10} color='white' />
        </View>
      )
    }else {
      return (
        <View style={styles.unSelectView}>
        </View>
      )
    }
  }
  _getToolbar(data){
    var actions = null;
    // if(data){
      // if (this.props.isSameUser) {
        actions = [{
          title:localStr('lang_commons_notice24'),
          iconType:'add',
          show:'always'}];
      // }
    // }
    return (
      <Toolbar title={this.props.title}
        navIcon="back"
        onIconClicked={()=>this.props.onBack()}
        actions={actions}
        onActionSelected={[()=>{
          this.props.onAddPhoto();
        }]}
      />
    );
  }
  _showAuth(){
    return this.props.checkAuth();
  }
  _openImagePicker(){
    this.props.openImagePicker();
  }
  _goToDetail(items,itemObj){
    var arrImages=[];
    items.map((item,index)=>{
      if(checkFileNameIsImage(item.get('FileName')))
      {
        arrImages.push(item);
      }
    });
    var newIndex = arrImages.findIndex((item)=> item === itemObj);
    this.props.gotoDetail(Immutable.fromJS(arrImages),newIndex,{width:this.state.imageWidth-2,height:this.state.imageHeight-2});
  }
  _deleteImage(item){
    return;
    if(!this._showAuth()){
      return;
    }
    Alert.alert(
      '',
      checkFileNameIsImage(item.get('FileName'))?localStr('lang_my_des9'):localStr('lang_my_des10'),
      [
        {text: localStr('lang_ticket_cancel'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: localStr('lang_ticket_remove'), onPress: () => {
          this.props.dataChanged('image','delete',item);
          // AliyunOSS.delete(appInfo.get().ossBucket,item.get('PictureId'));
          this.props.deleteImage([item.get('Pictures')]);
        }}
      ]
    )
  }
  _imageLoadComplete(item){
    this.props.dataChanged('image','uploaded',item);
  }
  _getAddButton(index)
  {
    return (
      <View key={index} style={{padding:4}}>
        <View style={{borderWidth:1,borderColor:ADDICONCOLOR}}
          width={this.state.imageWidth}
          height={this.state.imageHeight}>
          <TouchFeedback
            style={{flex:1,backgroundColor:'transparent'}}
            key={index}
            onPress={()=>this._openImagePicker()}>
            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
              <Icon type='icon_add' size={36} color={ADDICONCOLOR} />
            </View>
          </TouchFeedback>
        </View>
      </View>
    );
  }
  _getImageView(){
    // console.warn("pics",this.props.data.get('Pictures'));
    var images = this.props.data.get('Pictures').map((item,index)=>{
      if (!checkFileNameIsImage(item.get('FileName'))) {
        return (
          <View key={index} style={{margin:4,
              borderWidth:1,
              borderColor:PICBORDERCOLOR,
              backgroundColor:DOCBKGCOLOR,
              width:this.state.imageWidth,
              height:this.state.imageHeight}}>
              <NetworkDocumentCard
                imageWidth={this.state.imageWidth}
                imageHeight={this.state.imageHeight}
                item={item}
                index={index}
                numberOfLines={3}
                forceStoped={false}
                onLongPress={()=>this._deleteImage(item)}>
              </NetworkDocumentCard>
          </View>
        );
      }
      else if(item.get('uri')){
        // console.warn('loaded',item);
        return (
          <View key={index} style={{margin:4,
              borderWidth:1,
              borderColor:PICBORDERCOLOR,
              alignItems:'center',
              justifyContent:'center',
              width:this.state.imageWidth,
              height:this.state.imageHeight}}>
            <UploadableImage
              name={item.get('PictureId')}
              uri={item.get('uri')}
              loaded={item.get('loaded')}
              resizeMode="cover"
              postUri={`device/structurephoto/upload/${item.get('PictureId')}/${this.props.deviceId}`}
              height={this.state.imageHeight-2} width={this.state.imageWidth-2}
              loadComplete = {()=>this._imageLoadComplete(item)}>
              <TouchFeedback
                style={{flex:1,backgroundColor:'transparent'}}
                key={index}
                onPress={()=>this._goToDetail(this.props.data.get('Pictures'),item)}
                onLongPress={()=>this._deleteImage(item)}>
                <View style={{flex:1}}></View>
              </TouchFeedback>
            </UploadableImage>
          </View>
        )
      }
      else {
        return (
          <View style={{margin:4,
              borderWidth:1,
              borderColor:PICBORDERCOLOR,
              alignItems:'center',
              justifyContent:'center',
              backgroundColor:'gray',
              width:this.state.imageWidth,
              height:this.state.imageHeight
            }}>
            <NetworkImage
               name={item.get('PictureId')}
               resizeMode="cover"
               imgType='jpg'
               width={this.state.imageWidth-2}
               height={this.state.imageHeight-2}>
               <TouchFeedback
                 style={{flex:1,backgroundColor:'transparent'}}
                 key={String(index)}
                 onPress={()=>this._goToDetail(this.props.data.get('Pictures'),item)}
                 onLongPress={()=>this._deleteImage(item)}>
                 <View style={{flex:1}}></View>
               </TouchFeedback>
            </NetworkImage>
          </View>
        );
      }
    });
    // if (this.props.viewType!=='view') {// && this.props.data.get('Pictures').size < 9
      // images = images.push(this._getAddButton(images.size));
    // }
    if(images && images.size >0){
      return (
        <View style={{flexDirection:'row',flexWrap:'wrap',padding:4}}>
          {images}
        </View>
      );
    }
   return null;

  }
  _getSection(height)
  {
    if (!height) {
      height=15;
    }
    return (<View style={{
        borderColor:LIST_BG,
        borderBottomWidth:height,
        }}>
      {}
    </View>);
  }
  _getSimpleRow(rowData){
    var value = rowData.value;
    if (!value) {
      value=rowData.placeholderText;
    }
    var valueColor=GRAY;
    if (rowData.valueColor) {
      valueColor=rowData.valueColor;
    }
    return (
      <TouchFeedback style={[{backgroundColor:'white'},styles.rowHeight]} onPress={()=>{
        if(rowData.isNav){
          this.props.onRowClick(rowData,this.props.viewType);
          this.setState({
            openDatePicker:false,
          });
        }
        else if (rowData.type==='MaintainTime') {
            if (this.props.viewType!=='view') {
              this.setState({ isDateTimePickerVisible: true });
            }
          }
        }}>
        <View style={[styles.row,styles.rowHeight]}>
          <Text style={styles.titleText}>
            {rowData.title}
          </Text>
          <View style={{flex:1,alignItems:'center', justifyContent:'flex-end', flexDirection:'row',marginLeft:9}}>
            <Text numberOfLines={1} lineBreakModel='charWrapping' style={[styles.valueText,{flex:1,
            color:valueColor}]}>
              {value}
            </Text>
            {this._getNavIcon(rowData.isNav)}
          </View>
        </View>
      </TouchFeedback>
    );
  }
  _getImagesAndFiles()
  {
    var arrFiles=this.props.data.get('Pictures');

      console.warn("pics",this.props.data.get('Pictures'));

    if(!arrFiles||arrFiles.size===0&&this.props.viewType==='view')
      return null;
    var imagesView = this._getImageView();
    return (
    <View style={{paddingBottom:8,}}>
      <View style={{paddingHorizontal:8,}}>
        {imagesView}
      </View>
    </View>

    );
  }
  _getContentsView()
  {
    var arrFiles=this.props.data.get('Pictures');

    var emptyView=(
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <Text style={{color:GRAY,fontSize:16}}>{'没有图片'}</Text>
      </View>
    )
    if (!arrFiles||arrFiles.size===0) {
      return emptyView;
    }
    return (
      <ScrollView style={[styles.wrapper]}>
        {this._getSection(8)}
        {this._getImagesAndFiles()}
      </ScrollView>
    );
  }
  render() {
    if (!this.props.data||this.props.isFetching) {
      return (
        <View style={{flex:1,backgroundColor:'white'}}>
          {this._getToolbar(this.props.data)}
          <Loading/>
        </View>
      );
    }
    return (
      <View style={{flex:1,backgroundColor:LIST_BG}}>
        {this._getToolbar(this.props.data)}
        {this._getContentsView()}
      </View>
    );
  }
}

DeviceStuPhotosView.propTypes = {
  navigator:PropTypes.object,
  title:PropTypes.string,
  onBack:PropTypes.func.isRequired,
  onRowClick:PropTypes.func.isRequired,
  isSameUser:PropTypes.bool,
  deviceId:PropTypes.number,
  dataChanged:PropTypes.func.isRequired,
  deleteImage:PropTypes.func.isRequired,
  gotoDetail:PropTypes.func.isRequired,
  checkAuth:PropTypes.func,
  data:PropTypes.object,
  isFetching:PropTypes.bool,
  onRefresh:PropTypes.func.isRequired,
  onAddPhoto:PropTypes.func.isRequired,
  onSave:PropTypes.func.isRequired,
  openImagePicker:PropTypes.func.isRequired,
}

var styles = StyleSheet.create({
  wrapper:{
  },
  button:{
    height:49,
    flex:1,
    // marginHorizontal:16,
    // borderRadius:6,
  },
  rowHeight:{
    height:44,
  },
  row:{
    flexDirection:'row',
    alignItems:'center',
    // flex:1,
    backgroundColor:'white',
    justifyContent:'space-between',
    paddingHorizontal:16,
  },
  titleText:{
    fontSize:17,
    color:BLACK,
    // flex:1,
    // backgroundColor:'white',
  },
  valueText:{
    textAlign:'right',
    marginLeft:10,
    fontSize:17,
  },
  selectView:{
    width:18,
    height:18,
    borderRadius:10,
    backgroundColor:GREEN,
    // paddingRight:10,
    justifyContent:'center',
    alignItems:'center'
  },
  unSelectView:{
    width:18,
    height:18,
    borderRadius:10,
    borderColor:GRAY,
    borderWidth:1,
    // marginRight:16,
    justifyContent:'center',
    alignItems:'center'
  },
});
