
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

export default class MRecordDetailView extends Component{
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
    if(data){
      if (this.props.viewType==='view'&&this.props.isSameUser) {
        actions = [{
        title:'',
        iconType:'edit',
        show: 'always', showWithText: false}];
      }
    }
    return (
      <Toolbar title={this.props.title}
        navIcon="back"
        onIconClicked={()=>this.props.onBack()}
        actions={actions}
        onActionSelected={[()=>{
          this.props.onEditDetail();
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
          this.props.deleteImage([item.get('RemFiles')]);
        }}
      ]
    )
  }
  _imageLoadComplete(item){
    this.props.dataChanged('image','uploaded',item);
  }
  _saveLog()
  {
    if(!this._showAuth()){
      return;
    }
    this.props.onSave();
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
    // console.warn("pics",this.props.data.get('RemFiles'));
    var images = this.props.data.get('RemFiles').map((item,index)=>{
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
              height={this.state.imageHeight-2} width={this.state.imageWidth-2}
              loadComplete = {()=>this._imageLoadComplete(item)}>
              <TouchFeedback
                style={{flex:1,backgroundColor:'transparent'}}
                key={index}
                onPress={()=>this._goToDetail(this.props.data.get('RemFiles'),item)}
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
                 onPress={()=>this._goToDetail(this.props.data.get('RemFiles'),item)}
                 onLongPress={()=>this._deleteImage(item)}>
                 <View style={{flex:1}}></View>
               </TouchFeedback>
            </NetworkImage>
          </View>
        );
      }
    });
    if (this.props.viewType!=='view') {// && this.props.data.get('RemFiles').size < 9
      images = images.push(this._getAddButton(images.size));
    }
    if(images && images.size >0){
      return (
        <View style={{flexDirection:'row',flexWrap:'wrap',padding:4}}>
          {images}
        </View>
      );
    }
   return null;

  }
  _getAssetNoRow()
  {
    var assNo=localStr('lang_record_des22');
    var color=LOGOUT_RED;
    if (this.props.extData) {
      assNo=this.props.extData;
      color=GRAY;
    }
    return this._getSimpleRow({
      'title':localStr('lang_record_des23'),
      'value':assNo,
      'valueColor':color,
      'isNav':false});
  }
  _getMaintanceTime()
  {
    var date=this.props.data.get('MaintainTime');
    var dateTime='';
    if (date) {
      dateTime = moment(date).format("YYYY-MM-DD HH:00");
    }
    return this._getSimpleRow({
      'title':localStr('lang_record_des24'),
      'value':dateTime,
      'isNav':false,
      'type':'MaintainTime'
    });
  }
  _getMaintanceUser()
  {
    return this._getSimpleRow({
      'title':localStr('lang_record_des02'),
      'value':this.props.data.get('MaintainPerson'),
      'isNav':false,
      type:'MaintainPerson'});
  }
  _getMaintancePart()
  {
    var hasNav=true;
    if (this.props.viewType==='view') {
      hasNav=false;
    }
    if (this.props.viewType==='edit') {
      hasNav=true;
    }
    var strValue=this.props.data.get('Parts');
    return this._getSimpleRow({
      'title':localStr('lang_record_des04'),
      'value':strValue,
      'placeholderText':localStr('lang_ticket_please_choice'),
      'isNav':hasNav,
      type:'Parts'});
  }
  _getFaultPhenomenon()
  {
    var hasNav=true;
    var strValue=this.props.data.get('FaultPhenomenon');
    return this._getSimpleRow({
      'title':localStr('lang_record_des25'),
      'value':strValue,
      'placeholderText':localStr('lang_ticket_input2'),
      'isNav':hasNav,
      type:'FaultPhenomenon'});
  }
  _getJudgeType()
  {
    var hasNav=true;
    if (this.props.viewType==='view') {
      hasNav=false;
    }
    if (this.props.viewType==='edit') {
      hasNav=true;
    }
    var strJudge='';
    this.props.types.forEach((item)=>{
      if (item.Code===this.props.data.get('FaultJudgeType')) {
        strJudge=item.Type;
      }
    });
    return this._getSimpleRow({
      'title':localStr('lang_record_des06'),
      'value':strJudge,
      'placeholderText':localStr('lang_ticket_please_choice'),
      'isNav':hasNav,
      type:'FaultJudgeType'});
  }
  _getOtherJudgeTypeInfo()
  {
    var hasNav=true;
    if (this.props.data.get('FaultJudgeType')!==1) {
      return null;
    }
    var strJudge='';
    this.props.types.forEach((item)=>{
      if (item.Code===this.props.data.get('FaultJudgeType')) {
        strJudge=item.Type;
        if (item.Code===1) {
          strJudge=this.props.data.get('FaultJudgeText');
        }
      }
    });
    return this._getSimpleRow({
      'title':localStr('lang_record_des26'),
      'value':strJudge,
      'placeholderText':localStr('lang_ticket_input2'),
      'isNav':hasNav,
      type:'FaultJudgeText'});
  }
  _getFaultRemoval()
  {
    var hasNav=true;
    var strValue=this.props.data.get('FaultRemoval');
    return this._getSimpleRow({
      'title':localStr('lang_record_des27'),
      'value':strValue,
      'placeholderText':localStr('lang_ticket_input2'),
      'isNav':hasNav,
      type:'FaultRemoval'});
  }
  _getDealResult()
  {
    var hasNav=true;
    if (this.props.viewType==='view') {
      hasNav=false;
    }
    if (this.props.viewType==='edit') {
      hasNav=true;
    }
    var strResult='';
    var numRes=this.props.data.get('DealResult');
    if (numRes>=1&&numRes<=this.props.results.length) {
      strResult=this.props.results[numRes-1].Type;
    }
    return this._getSimpleRow({
      'title':localStr('lang_record_des07'),
      'value':strResult,
      'placeholderText':localStr('lang_ticket_please_choice'),
      'isNav':hasNav,
      type:'DealResult'});
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
  _getBottomButton()
  {
    if (this.props.viewType==='view') {
      return null;
    }else {

      var parts=this.props.data.get('Parts');
      var Phenomenon=this.props.data.get('FaultPhenomenon');
      var judgeType=this.props.data.get('FaultJudgeType');
      var judgeText=this.props.data.get('FaultJudgeText');
      var removal=this.props.data.get('FaultRemoval');
      var numRes=this.props.data.get('DealResult');

      var isEnableCreate=true;
      if (!parts||!Phenomenon||judgeType===0||!removal||numRes===0||(!judgeText&&judgeType===1)) {
        isEnableCreate=false;
      }
      return(
        <Bottom height={49} backgroundColor={LIST_BG} borderColor={LIST_BG}>
          <Button
            style={[styles.button,{
              backgroundColor:GREEN,
            }]}
            disabledStyle={[styles.button,{
                backgroundColor:'#B3E9D6',
              }]
            }
            textStyle={{
              fontSize:20,
              color:'#f0f0f0'
            }}
            disabled={!isEnableCreate}
            text={localStr('lang_ticket_save')} onClick={()=>this._saveLog()} />
        </Bottom>
      );
    }
  }
  _getImagesAndFiles()
  {
    var arrFiles=this.props.data.get('RemFiles');
    if(!arrFiles||arrFiles.size===0&&this.props.viewType==='view')
      return null;
    var imagesView = this._getImageView();
    return (
    <View style={{paddingBottom:8,backgroundColor:'white'}}>
      <ListSeperator/>
      <View style={{paddingHorizontal:8,backgroundColor:'white'}}>
        <View style={{marginTop:10,marginBottom:6,marginLeft:8,flexDirection:'row',alignItems:'flex-end'}}>
          <Text style={{fontSize:17,color:BLACK}}>{localStr('lang_record_des30')}</Text>
          <Text style={{fontSize:13,color:GRAY}}>{localStr('lang_record_des31')}</Text>
        </View>
        {imagesView}
      </View>
    </View>

    );
  }
  _getMaintanceAssetNoRow()
  {
    if (this.props.viewType!=='view') {
      return null;
    }
    return (
      <View>
        {this._getSection()}
        <ListSeperator/>
        {this._getAssetNoRow()}
        <ListSeperator/>
      </View>
    )
  }
  _getMaintanUserRow()
  {
    if (this.props.viewType!=='view') {
      return null;
    }
    return (
      <View>
        <ListSeperator marginWithLeft={16}/>
        {this._getMaintanceUser()}
      </View>
    )
  }
  _handleDatePicked(date){
    // var dateTime = moment(date).format("YYYY-MM-DDTHH:00:00");
    // console.warn('aaa',dateTime);
    this.props.onRowClick({type:'MaintainTime',value:date},this.props.viewType);
    this._hideDateTimePicker();
  };
  _hideDateTimePicker()
  {
    this.setState({ isDateTimePickerVisible: false });
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
    var marginBottom=49;
    if (this.props.viewType==='view') {
      marginBottom=0;
    }
    var date=this.props.data.get('MaintainTime');
    return (
      <View style={{flex:1,backgroundColor:LIST_BG}}>
        {this._getToolbar(this.props.data)}

        <ScrollView style={[styles.wrapper,{marginBottom}]}>
          {this._getMaintanceAssetNoRow()}

          {this._getSection()}
          <ListSeperator/>
          {this._getMaintanceTime()}
          {this._getMaintanUserRow()}

          <ListSeperator/>

          {this._getSection()}
          <ListSeperator/>
          {this._getMaintancePart()}
          <ListSeperator/>

          {this._getSection()}
          <ListSeperator/>
          {this._getFaultPhenomenon()}
          <ListSeperator marginWithLeft={16}/>
          {this._getJudgeType()}
          <ListSeperator/>
          {this._getOtherJudgeTypeInfo()}


          {this._getSection()}
          <ListSeperator/>
          {this._getFaultRemoval()}
          <ListSeperator marginWithLeft={16}/>
          {this._getDealResult()}
          <ListSeperator/>

          {this._getSection()}
          {this._getImagesAndFiles()}

          {this._getSection(25)}
        </ScrollView>
        {
          this._getBottomButton()
        }
        <DateTimePicker
          is24Hour={true}
          titleIOS={localStr('lang_record_des28')}
          cancelTextIOS={localStr('lang_ticket_cancel')}
          confirmTextIOS={localStr('lang_record_des29')}
          mode={'datetime'}
          date={moment(date).toDate()}
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={(date)=>this._handleDatePicked(date)}
          onCancel={()=>this._hideDateTimePicker()}
          />
      </View>
    );
  }
}

MRecordDetailView.propTypes = {
  navigator:PropTypes.object,
  title:PropTypes.string,
  onBack:PropTypes.func.isRequired,
  onRowClick:PropTypes.func.isRequired,
  types:PropTypes.array,
  results:PropTypes.array,
  extData:PropTypes.string,
  isSameUser:PropTypes.bool,
  dataChanged:PropTypes.func.isRequired,
  deleteImage:PropTypes.func.isRequired,
  gotoDetail:PropTypes.func.isRequired,
  checkAuth:PropTypes.func,
  isPosting:PropTypes.number,
  data:PropTypes.object,
  isFetching:PropTypes.bool,
  viewType:PropTypes.string,
  onRefresh:PropTypes.func.isRequired,
  onEditDetail:PropTypes.func.isRequired,
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
