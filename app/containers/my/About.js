
'use strict';

import React,{Component} from 'react';
import {
  Linking,
} from 'react-native';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import backHelper from '../../utils/backHelper';

import AboutView from '../../components/my/About.js';
import appInfo from '../../utils/appInfo.js';

class About extends Component{
  constructor(props){
    super(props);
  }
  componentDidMount() {
    backHelper.init(this.props.navigator,'about');
  }
  componentWillReceiveProps(nextProps) {

  }
  componentWillUnmount() {
    backHelper.destroy('about');
  }
  render() {
    return (
      <AboutView user={this.props.user}
        version={this.props.version}
        appInfo={appInfo.get()}
        updateClick={()=>{
          var upUri='https://www.fm.energymost.com/zh-cn/login';
          if (this.props.version.get('upgradeUri')) {
            upUri=this.props.version.get('upgradeUri');
          }
          Linking.openURL(upUri);
        }}
        onBack={()=>this.props.navigator.pop()} />
    );
  }
}

About.propTypes = {
  navigator:PropTypes.object,
  user:PropTypes.object,
  version:PropTypes.object,
}


function mapStateToProps(state) {
  return {
    user:state.user.get('user'),
    version:state.version,
  };
}

export default connect(mapStateToProps,{})(About);
