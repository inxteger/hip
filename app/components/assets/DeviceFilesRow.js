'use strict'

import React,{Component} from 'react';
import {
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';

import Text from '../Text';
import {GRAY,BLACK,ALARM_RED} from '../../styles/color';
import moment from 'moment';
import Icon from '../Icon.js';
import TouchFeedback from '../TouchFeedback';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';
import appInfo from '../../utils/appInfo.js';

import Toast from 'react-native-root-toast';
import {openFile} from '../../utils/openFile';
import storage from '../../utils/storage.js';
import {getBaseUri,TOKENHEADER,HEADERDEVICEID} from '../../middleware/api.js';

const RNFS = require('react-native-fs');

const saveDocumentPath = Platform.OS === 'ios' ? RNFS.TemporaryDirectoryPath : RNFS.ExternalDirectoryPath;

var jobId = -1;

export default class DeviceFilesRow extends Component{
  constructor(props){
    super(props);
    this.state={id:null,loaded:false,progress:'',percent:0};
  }

  async downloadFile(name,id) {
    if (jobId !== -1) {
      return;
    }

    var progress = data => {
      var percentage = ((100 * data.bytesWritten) / data.contentLength) | 0;
      var percent = (data.bytesWritten/data.contentLength);
      this.setState({
          id,
          loaded:false,
          progress:`${percentage}%`,
          percent,
      });
    };

    var begin = res => {
      this.setState({
          id,
          loaded:false,
          progress:`1%`,
          percent:0,
      });
    };

    var progressDivider = 1;

    var index = name.lastIndexOf('.');
    var type = name.substring(index+1);
    // var ossBucket = appInfo.get().ossBucket;
    // index = ossBucket.indexOf('.');
    // ossBucket = ossBucket.substring(0,index);
    // var url = `http://${ossBucket}.oss-cn-hangzhou.aliyuncs.com/rem-file-${id}.${type}`;
    //api/tickets/docs/{fileId}.{ext}
    // var baseUri = getBaseUri();
    // var url = 'http://www.pdf995.com/samples/pdf.pdf';
    // var url = `${baseUri}tickets/docs/${id}.${type}`;

    var bucketName = appInfo.get().ossBucket;

    var url = `http://${bucketName}/${id}@.jpg`

    var downFilePath=`${saveDocumentPath}/${id}.${type}`;
    var token = await storage.getToken();
    var deviceid=await storage.getDeviceId();
    var headers={};
    headers[TOKENHEADER]=token;
    headers[HEADERDEVICEID]=deviceid;

    RNFS.exists(downFilePath).then((result) => {
      if (result) {
        console.warn('will open file...',downFilePath);
        this.fileOpen(downFilePath,type);
      }else {
        const ret = RNFS.downloadFile({ fromUrl: url, toFile: downFilePath, begin, progress, background:false, progressDivider ,headers});
        console.warn('start down load file with id:',ret.jobId);
        jobId = ret.jobId;

        ret.promise.then(res => {
          this.setState({
              id,
              loaded:true,
              progress:'',
              percent:0,
          });
          console.warn('end down load file with forceStoped:',this.props.forceStoped);
          if (!this.props.forceStoped) {
            this.fileOpen(downFilePath,type);
          }else {
            console.warn('stoped is false...');
          }
    //'image/jpeg','application/msword',image/png,	application/x-png,application/octet-stream
          jobId = -1;
        }).catch(err => {
          this.showError(err)

          jobId = -1;
        });
      }
    });
  }

  fileOpen(downFilePath,type)
  {
    openFile(downFilePath,type,()=>{
      Toast.show(localStr('lang_ticket_notice2'), {
        duration: 5000,
        position: -80,
      });
    });
  }

  stopDownloadTest() {
    console.warn('stopDownloadTest...jobId:',jobId);
    if (jobId !== -1) {
      console.warn('stopDownloadTest 2...');
      RNFS.stopDownload(jobId);
    } else {
      console.warn('There is no download to stop');
    }
  }
  showError(err){
    this.setState({ output: `ERROR: Code: ${err.code} Message: ${err.message}` });
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
  }
  _getOverflowView()
  {
    var overlay = (
      <View style={
        {
          height: 44,
          width: this.props.width*(this.state.percent),
          position:'absolute',
          left:0,
          bottom:0,
          right:0,
          backgroundColor:'#03b679',
          opacity:0.1
        }
      }>
    </View>);
    return overlay;
  }
  render(){
    var {rowData} = this.props;
    // icon_file
    var isDir=rowData.get('Type')==='dir';
    var iconType=isDir?'icon_folder':'icon_file';
    var iconColor=isDir?'#f6ca36':'#358de7';
    var iconSize=isDir?16:0.1;
    var textContent=`${rowData.get('Name')}`;
    return (
      <View style={{flex:1,backgroundColor:'white'}}>
        <TouchFeedback onPress={()=>{
            if (rowData.get('Type')==='dir') {
              this.props.onRowClick(rowData);
            }else {
              this.downloadFile(rowData.get('Name'),rowData.get('Key'))
            }
          }}>
          <View style={[styles.row,styles.rowHeight]}>
            <View style={{marginHorizontal:16,flexDirection:'row',justifyContent:'flex-end'}}>
              <Icon type={iconType} size={18} color={iconColor} />
              <View style={{flex:1,marginLeft:8,marginRight:8}}>
                <Text numberOfLines={1} style={styles.nameText}>{textContent}</Text>
              </View>
              <Icon type='arrow_right' size={iconSize} color={GRAY} />
            </View>
            {this._getOverflowView()}
          </View>
        </TouchFeedback>
      </View>
    );
  }
}

DeviceFilesRow.propTypes = {
  user:PropTypes.object,
  width:PropTypes.number,
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
