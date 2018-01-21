
'use strict';
import React,{Component} from 'react';
import {
  View,
  Platform,
  StyleSheet,
  DatePickerAndroid,
  DatePickerIOS,
  ScrollView,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';

import moment from 'moment';
import Toolbar from '../Toolbar';
import Button from '../Button.js';
import Bottom from '../Bottom.js';
import {BLACK,GRAY,GREEN,LINE,LIST_BG,PICBORDERCOLOR,DOCBKGCOLOR,ADDICONCOLOR} from '../../styles/color';
import Text from '../Text';
import NetworkImage from '../NetworkImage';
import TouchFeedback from '../TouchFeedback';

import PrivilegePanel from '../PrivilegePanel.js';
import NetworkDocumentCard from '../NetworkDocumentCard.js';
import {checkFileNameIsImage} from '../../utils/fileHelper.js';

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
    this.state = {rowType:'',openDatePicker:false,imageWidth:picWid,imageHeight:picWid,autoFocus:false};
  }
  async _showPicker(type) {
    if(Platform.OS === 'android'){
      try {
        console.warn('_showPicker,type',type);
        var value = undefined;
        if (type==='StartTime') {
          value = this.props.data.get('StartTime') || undefined;
        }else if (type==='EndTime') {
          value = this.props.data.get('EndTime') || undefined;
        }
        var date = moment(value);
        var options = {date:date.toDate()}
        var {action, year, month, day} = await DatePickerAndroid.open(options);
        // console.warn('date',year,month,day);
        if (action !== DatePickerAndroid.dismissedAction) {
          var date = moment({year,month,day,hour:8});//from timezone
          // console.warn('moment',date);
          this.props.onDateChanged(type,date.toDate());
        }

      } catch ({code, message}) {
        // console.warn(`Error in example '${stateKey}': `, message);
      }
    }
  }
  _getDatePicker(dateType){
    var type = this.state.rowType;
    if(Platform.OS === 'ios' && this.state.openDatePicker && type===dateType){
      var value = undefined;
      if (type==='StartTime') {
        value = this.props.data.get('StartTime') || undefined;
      }else if (type==='EndTime') {
        value = this.props.data.get('EndTime') || undefined;
      }
      var date = moment(value);

      return (
        <DatePickerIOS style={{borderTopWidth:1,borderColor:LINE}} date={date.toDate()} mode="date"
          onDateChange={(date1)=>{
              this.props.onDateChanged(type,date1);
            }} />
      );
    }
    return null;
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
      // if (this.props.viewType==='view') {//test
        actions = [{
        title:'',
        iconType:'edit',
        show: 'always', showWithText: false}];
      // }

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
  _logChanged(text){
    this.setState({autoFocus:true});
    this.props.dataChanged('content',null,text);
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
          this.props.deleteImage([item.get('PictureId')]);
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
    this.props.save();
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
    if (this.props.viewType==='edit') {// && this.props.data.get('RemFiles').size < 9
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
    return this._getSimpleRow({
      'title':localStr('资产编号'),
      'value':this.props.data.get('MaintainPerson'),
      'isNav':false});
  }
  _getMaintanceTime()
  {
    return this._getSimpleRow({
      'title':localStr('维修时间'),
      'value':this.props.data.get('MaintainTime'),
      'isNav':false});
  }
  _getMaintanceUser()
  {
    return this._getSimpleRow({
      'title':localStr('维修人'),
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
    return this._getSimpleRow({
      'title':localStr('零部件'),
      'value':this.props.data.get('Parts'),
      'isNav':hasNav,
      type:'Parts'});
  }
  _getFaultPhenomenon()
  {
    var hasNav=true;
    return this._getSimpleRow({
      'title':localStr('故障现象'),
      'value':this.props.data.get('FaultPhenomenon'),
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
      'title':localStr('故障判定'),
      'value':strJudge,
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
      'title':localStr('原因描述'),
      'value':strJudge,
      'isNav':hasNav,
      type:'FaultJudgeText'});
  }
  _getFaultRemoval()
  {
    var hasNav=true;
    return this._getSimpleRow({
      'title':localStr('故障排除过程'),
      'value':this.props.data.get('FaultRemoval'),
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
      'title':localStr('处理结果'),
      'value':strResult,
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
    return (
      <TouchFeedback style={[{backgroundColor:'white'},styles.rowHeight]} onPress={()=>{
        if(rowData.isNav){
          this.props.onRowClick(rowData,this.props.viewType);
          this.setState({
            openDatePicker:false,
          });
        }else if (rowData.type==='StartTime'||rowData.type==='EndTime') {
            var enableEditStartTime = this.props.ticketInfo?this.props.ticketInfo.get('Status')<2:true;
            if (rowData.type==='EndTime'||enableEditStartTime) {
              this.setState({
                rowType:rowData.type,
                openDatePicker:!this.state.openDatePicker,
              });
              this._showPicker(rowData.type);
              this.props.onRowClick(rowData,this.props.viewType);
            }
          }}}>
        <View style={[styles.row,styles.rowHeight]}>
          <Text style={styles.titleText}>
            {rowData.title}
          </Text>
          <View style={{flex:1,alignItems:'center', justifyContent:'flex-end', flexDirection:'row',marginLeft:9}}>
            <Text numberOfLines={1} lineBreakModel='charWrapping' style={[styles.valueText,{flex:1,}]}>
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
      return(
        <Bottom height={49} backgroundColor={LIST_BG} borderColor={LIST_BG}>
          <Button
            style={[styles.button,{
              backgroundColor:GREEN,
            }]}
            disabledStyle={[styles.button,{
                backgroundColor:GRAY,
              }]
            }
            textStyle={{
              fontSize:20,
              color:'#f0f0f0'
            }}
            disabled={false}
            text={localStr('lang_ticket_save')} onClick={this.props.onCreateTicket} />
        </Bottom>
      );
    }
  }
  _getImagesAndFiles()
  {
    var arrFiles=this.props.data.get('RemFiles');
    if(!arrFiles||arrFiles.size===0)
      return null;
    var imagesView = this._getImageView();
    return (
    <View style={{paddingBottom:8,backgroundColor:'white'}}>
      <ListSeperator/>
      <View style={{paddingHorizontal:8,backgroundColor:'white'}}>
        <View style={{marginTop:10,marginBottom:6,marginLeft:8,flexDirection:'row',alignItems:'flex-end'}}>
          <Text style={{fontSize:17,color:BLACK}}>{'附件'}</Text>
          <Text style={{fontSize:13,color:GRAY}}>{'（选填）'}</Text>
        </View>
        {imagesView}
      </View>
    </View>

    );
  }
  _getMaintanceAssetNoRow()
  {
    if (this.props.viewType==='edit') {
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
    if (this.props.viewType==='edit') {
      return null;
    }
    return (
      <View>
        <ListSeperator marginWithLeft={16}/>
        {this._getMaintanceUser()}
      </View>
    )
  }
  render() {
    if (!this.props.data) {
      return (
        <View style={{flex:1,backgroundColor:'white'}}>
          {this._getToolbar(this.props.data)}
        </View>
      );
    }
    var marginBottom=49;
    if (this.props.viewType==='view') {
      marginBottom=0;
    }
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
  // onDateChanged:PropTypes.func.isRequired,
  // onTicketTypeSelect:PropTypes.func.isRequired,
  // isFetching:PropTypes.bool.isRequired,
  isPosting:PropTypes.number,
  data:PropTypes.object,
  viewType:PropTypes.bool,
  onRefresh:PropTypes.func.isRequired,
  onEditDetail:PropTypes.func.isRequired,

  // onCreateTicket:PropTypes.func.isRequired,
  // customer:PropTypes.object.isRequired,
  // isEnableCreate:PropTypes.bool.isRequired,
  // isAlarm:PropTypes.bool,
  // ticketInfo:PropTypes.object,
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
    color:GRAY
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
