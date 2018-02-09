'use strict'

import React,{Component} from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

import Text from '../Text';
import {GRAY,BLACK,ALARM_RED} from '../../styles/color';
import moment from 'moment';
import Icon from '../Icon.js';
import TouchFeedback from '../TouchFeedback';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

import {getBaseUri} from '../../middleware/api.js';
import {TOKENHEADER,HEADERDEVICEID} from '../../middleware/api.js';
import storage from '../../utils/storage.js';

export default class DeviceFilesRow extends Component{
  constructor(props){
    super(props);

    this.state = {percent:0,load:false};
    if(props.loaded){
      this.state.loaded = true;
    }
  }

  async _uploadImage() {
    // console.warn('UploadableImage');
    var xhr = new XMLHttpRequest();
    var postUri = `${getBaseUri()}images/upload/${this.props.name}`;
    if(this.props.postUri){
      postUri = `${getBaseUri()}${this.props.postUri}`;
    }
    xhr.open('POST', postUri);
    xhr.setRequestHeader(TOKENHEADER,await storage.getToken());
    xhr.setRequestHeader(HEADERDEVICEID,await storage.getDeviceId());
    xhr.setRequestHeader('hierarchyId','123456');

    xhr.onload = () => {
      if (xhr.status !== 200) {
        console.warn(
          'Upload failed',
          'Expected HTTP 200 OK response, got ' + xhr.status,
          this.props.name,
          this.props.uri
        );
        return;
      }
      if (!xhr.responseText) {
        console.warn(
          'Upload failed',
          'No response payload.'
        );
        return;
      }
      // console.warn('xhr.responseText',xhr.responseText);
      this.setState({loaded:true});
      this.props.loadComplete(xhr.responseText);
    };
    var formdata = new FormData();
    // console.warn('uri',this.props.uri);
    // console.warn('name',this.props.name);
    formdata.append('filename',{uri:this.props.uri,name:this.props.name,type:'image/jpg','username':'张三'});

    if (xhr.upload) {
      xhr.upload.onprogress = (event) => {
        // console.warn('upload onprogress', event);
        if (event.lengthComputable) {
          // console.warn('uploadProgress',{uploadProgress: event.loaded / event.total});
          this._uploadProgress({currentSize:event.loaded,totalSize:event.total})
        }
      };
    }
    xhr.send(formdata);


    return;

	}
  _uploadProgress(obj){
    var {currentSize,totalSize} = obj;
    // console.warn('uri',this.props.uri);
    this.setState({percent:currentSize/totalSize});
  }
  componentDidMount() {
    this._uploadImage();
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.uri !== this.props.uri && !nextProps.loaded){
      this.setState({percent:0,loaded:false});
      this._uploadImage();
    }
  }
  _getTime(data){
    var time = moment(data.get('MaintainTime'));
    if(time.isSame(moment(),'day')){
      return time.format('HH:mm');
    }
    else {
      return time.format('MM-DD');
    }
  }
  render(){
    var progress = parseInt(this.state.percent*100);
    var text = null;
    if(progress !== 100){
      text = (
        <Text style={{
            textAlign: 'center',
            color: 'white',
            backgroundColor: 'transparent'
          }}>{progress+'%'}</Text>
      )
    }

    var overlay = (
      <View style={
        {
          height: this.props.height*(1-this.state.percent),
          width: this.props.width,
          position:'absolute',
          left:0,
          bottom:0,
          right:0,
          backgroundColor:'black',
          opacity:0.4
        }
      }>
    </View>);

    var {rowData} = this.props;
    // icon_file
    var iconType=rowData.get('Type')==='dir'?'icon_folder':'icon_file';
    var iconColor=rowData.get('Type')==='dir'?'#f6ca36':'#358de7';
    return (
      <View style={{flex:1,backgroundColor:'white'}}>
        <TouchFeedback onPress={()=>this.props.onRowClick(rowData)}>
          <View style={[styles.row,styles.rowHeight]}>
            <View style={{marginHorizontal:16,flexDirection:'row',justifyContent:'flex-end'}}>
              <Icon type={iconType} size={16} color={iconColor} />
              <View style={{flex:1,marginLeft:8,marginRight:8}}>
                <Text numberOfLines={1} style={styles.nameText}>{rowData.get('Name')}</Text>
              </View>
              <Icon type='arrow_right' size={16} color={GRAY} />
            </View>
          </View>
        </TouchFeedback>
      </View>
    );
  }
}

DeviceFilesRow.propTypes = {
  user:PropTypes.object,
  onRowClick:PropTypes.func.isRequired,
  rowData:PropTypes.object.isRequired,
}

var styles = StyleSheet.create({
  rowHeight:{
    height:44
  },
  row:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    backgroundColor:'white',
    // padding:16,
    overflow:'hidden'
  },
  nameText:{
    fontSize:17,
    color:BLACK
  },
});
