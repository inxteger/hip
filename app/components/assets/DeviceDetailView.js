
'use strict';
import React,{Component} from 'react';
import {
  View,
  Platform,
  Dimensions,
  ViewPagerAndroid,
  SegmentedControlIOS
} from 'react-native';
import PropTypes from 'prop-types';

import Toolbar from '../Toolbar';
import Text from '../Text';
import Loading from '../Loading';
// import SimpleRow from './SimpleRow';
// import NetworkImage from '../NetworkImage.js';
import PagerBar from '../PagerBar.js';
import {GREEN,TAB_BORDER,GRAY} from '../../styles/color.js';
// import ViewPager from '../ViewPager.android.js';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';
import ScrollableTabBar from './ScrollableTabBar';
const WINDOW_WIDTH = Dimensions.get('window').width;

export default class DeviceDetailView extends Component{
  constructor(props){
    super(props);
    // console.warn('DeviceDetailView',props);
  }
  _tabChanged(event){
    // console.warn('_tabChanged',event.nativeEvent.selectedSegmentIndex);
    this.props.indexChanged(event.nativeEvent.selectedSegmentIndex);
  }
  _onPageSelected(e){
    if(e.nativeEvent.position !== this.props.currentIndex){
      this.props.indexChanged(e.nativeEvent.position);
    }
  }
  _pagerBarClicked(index){
    // console.warn('index',index);
    if(this.props.currentIndex !== index){
      this.props.indexChanged(index);
    }
  }
  _getTabArray(){
    // console.warn('deviceData',this.props.deviceData);
    if(!this.props.deviceData){
      return [];
    }
    console.warn('hasRuntime',this.props.hasRealtime,this.props.hasRuntime,this.props.has6Dashboard);

    var array = [localStr('lang_asset_des13')];
    if(this.props.hasRealtime){
      array.push(localStr('lang_asset_des14'));
    }
    if(this.props.hasRuntime){
      array.push(localStr('lang_asset_des15'));
    }
    // if(this.props.has6Dashboard){
    //   array.push(localStr('lang_asset_des16'));
    // }
    array.push('维修历史');
    return array;
  }
  _getTabControl(){
    if(!this.props.deviceData){
      return null;
    }
    var array = this._getTabArray();
    return (
      <ScrollableTabBar
        barStyle={{
          borderBottomWidth:1,
          borderColor:TAB_BORDER,
        }}
        activeTextColor={GREEN}
        underlineStyle={{
          position: 'absolute',
          height: 3,
          backgroundColor:GREEN,
          bottom: 0,
        }}
        tabStyle={{
          height: 47,
          alignItems: 'center',
          justifyContent: 'center',
          paddingLeft: 1,
          paddingRight: 1,
        }}
        textStyle={{
          fontSize:15,
        }}
        inactiveTextColor={'#353535'}
        containerWidth={WINDOW_WIDTH}
        tabs={array}
        activeTab={this.props.currentIndex}
        scrollValue={{'_value':this.props.currentIndex}}
        goToPage={(index)=>this._pagerBarClicked(index)} />
    )

  }
  _getView(){
    if(!this.props.deviceData){
      return (
        <Loading />
      )
    }
    if(Platform.OS === 'ios'){
      return this.props.contentView;
    }
    else {
      return (
        <ViewPagerAndroid
          ref={(viewPager) => { this._viewPager = viewPager; }}
          style={{flex:1}}
          initialPage={this.props.currentIndex}
          onPageSelected={(e)=>this._onPageSelected(e)}
        >
        {
          this._getTabArray().map((item,index)=>{
            var contentView = null;
            if(this.props.currentIndex === index){
              contentView = this.props.contentView;
              // console.warn('contentView',contentView,index,this.props.currentIndex);
            }
            // console.warn('contentView',contentView);
            return (
              <View key={index} style={{flex:1}}>
              {
                contentView
              }
              </View>
            )
          })
        }
      </ViewPagerAndroid>
      )
    }
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.currentIndex !== this.props.currentIndex){
      if(this._viewPager){
        this._viewPager.setPage(nextProps.currentIndex);
      }
    }
  }
  render() {
    if(this.props.errorMessage){
      return  (
        <View style={{flex:1,backgroundColor:'white'}}>
          <Toolbar
            title={this.props.title}
            navIcon="back"
            noShadow={true}
            onIconClicked={()=>this.props.onBack()}
          />
          <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <Text style={{fontSize:17,color:GRAY}}>{this.props.errorMessage}</Text>
          </View>
        </View>
      )
    }
    return (
      <View style={{flex:1,backgroundColor:'white'}}>
        <Toolbar
          title={this.props.title}
          navIcon="back"
          noShadow={true}
          onIconClicked={()=>this.props.onBack()}
        />
        {this._getTabControl()}
        {this._getView()}
      </View>
    );
  }
}

DeviceDetailView.propTypes = {
  navigator:PropTypes.object,
  onBack:PropTypes.func.isRequired,
  contentView:PropTypes.object,
  indexChanged:PropTypes.func.isRequired,
  currentIndex:PropTypes.number.isRequired,
  hasRealtime:PropTypes.bool.isRequired,
  hasRuntime:PropTypes.bool.isRequired,
  deviceData:PropTypes.object,
  title:PropTypes.string.isRequired,
  errorMessage:PropTypes.string,
}
