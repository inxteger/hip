'use strict';
import React,{Component} from 'react';
import {
  View,
  Animated,
  StyleSheet,
  ScrollView,
  Text,
  Platform,
  Dimensions,
  ViewPropTypes
} from 'react-native';
import PropTypes from 'prop-types';

import TouchFeedback from '../TouchFeedback';

const WINDOW_WIDTH = Dimensions.get('window').width;

export default class ScrollableTabBar extends Component{
  constructor(props) {
    super(props);
    this.state={
      _leftTabUnderline: new Animated.Value(0),
      _widthTabUnderline: new Animated.Value(0),
      _containerWidth: null,
      scrollEnabled:true,
    }
    this._tabsMeasurements = [];
  }
  componentDidMount() {
    if (this.props.scrollValue) {
      // this.props.scrollValue.addListener(this.updateView);
    }
  }
  updateView(offset) {
    const position = Math.floor(offset.value);
    const pageOffset = offset.value % 1;
    const tabCount = this.props.tabs.length;
    const lastTabPosition = tabCount - 1;

    if (tabCount === 0 || offset.value < 0 || offset.value > lastTabPosition) {
      return;
    }

    if (this.necessarilyMeasurementsCompleted(position, position === lastTabPosition)) {
      this.updateTabPanel(position, pageOffset);
      this.updateTabUnderline(position, pageOffset, tabCount);
    }
  }

  necessarilyMeasurementsCompleted(position, isLastTab) {
    return this._tabsMeasurements[position] &&
      (isLastTab || this._tabsMeasurements[position + 1]) &&
      this._tabContainerMeasurements &&
      this._containerMeasurements;
  }

  updateTabPanel(position, pageOffset) {
    const containerWidth = this._containerMeasurements.width;
    const tabWidth = this._tabsMeasurements[position].width;
    const nextTabMeasurements = this._tabsMeasurements[position + 1];
    const nextTabWidth = nextTabMeasurements && nextTabMeasurements.width || 0;
    const tabOffset = this._tabsMeasurements[position].left;
    const absolutePageOffset = pageOffset * tabWidth;
    let newScrollX = tabOffset + absolutePageOffset;

    // center tab and smooth tab change (for when tabWidth changes a lot between two tabs)
    newScrollX -= (containerWidth - (1 - pageOffset) * tabWidth - pageOffset * nextTabWidth) / 2;
    newScrollX = newScrollX >= 0 ? newScrollX : 0;

    if (Platform.OS === 'android') {
      this._scrollView.scrollTo({x: newScrollX, y: 0, animated: false, });
    } else {
      const rightBoundScroll = this._tabContainerMeasurements.width - (this._containerMeasurements.width);
      newScrollX = newScrollX > rightBoundScroll ? rightBoundScroll : newScrollX;
      this._scrollView.scrollTo({x: newScrollX, y: 0, animated: false, });
    }
  }

  updateTabUnderline(position, pageOffset, tabCount) {
    const lineLeft = this._tabsMeasurements[position].left;
    const lineRight = this._tabsMeasurements[position].right;

    if (position < tabCount - 1) {
      const nextTabLeft = this._tabsMeasurements[position + 1].left;
      const nextTabRight = this._tabsMeasurements[position + 1].right;

      const newLineLeft = (pageOffset * nextTabLeft + (1 - pageOffset) * lineLeft);
      const newLineRight = (pageOffset * nextTabRight + (1 - pageOffset) * lineRight);

      this.state._leftTabUnderline.setValue(newLineLeft);
      this.state._widthTabUnderline.setValue(newLineRight - newLineLeft);
    } else {
      this.state._leftTabUnderline.setValue(lineLeft);
      this.state._widthTabUnderline.setValue(lineRight - lineLeft);
    }
  }

  renderTab(name, page, isTabActive, onPressHandler, onLayoutHandler) {
    const { activeTextColor, inactiveTextColor, textStyle, } = this.props;
    const textColor = isTabActive ? activeTextColor : inactiveTextColor;
    const fontWeight = isTabActive ? 'normal' : 'normal';
    var lineColor='green';
    if (this.props.underlineStyle) {
      lineColor=this.props.underlineStyle.backgroundColor;
    }
    if (this.props.renderTab) {
      return this.props.renderTab();
    }
    return (
      <TouchFeedback
        style={[{}]}
        key={`${name}_${page}`}
        accessible={true}
        accessibilityLabel={name}
        accessibilityTraits='button'
        onPress={() => onPressHandler(page)}
        onLayout={onLayoutHandler}
      >
        <View style={{}}>
          <View style={[styles.tab, this.props.tabStyle,]}>
            <Text style={[{color: textColor, fontWeight, }, textStyle, ]}>
              {name}
            </Text>
          </View>
          <View style={[{flex:1,paddingHorizontal:10,height:3}]}>
            <View style={{height:3,backgroundColor:!isTabActive?'transparent':lineColor,}}>
            </View>
          </View>
        </View>
      </TouchFeedback>
    )
  }

  measureTab(page, event) {
    const { x, width, height, } = event.nativeEvent.layout;
    this._tabsMeasurements[page] = {left: x, right: x + width, width, height, };
    // console.warn('measureTab...',page,x,width);
    this.updateView({value: this.props.scrollValue._value, });
  }

  render() {
    const tabUnderlineStyle = {
      position: 'absolute',
      height: 4,
      backgroundColor: 'navy',
      bottom: 0,
    };
    console.warn('dynamicTabUnderline',this.state._leftTabUnderline,this.state._widthTabUnderline);
    const dynamicTabUnderline = {
      left: this.state._leftTabUnderline,
      width: this.state._widthTabUnderline,
    };

    return (
      <View
        style={[styles.container, {backgroundColor: this.props.backgroundColor, }, this.props.style, ]}
        onLayout={this.onContainerLayout.bind(this)}
      >
        <ScrollView
          ref={(scrollView) => { this._scrollView = scrollView; }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          directionalLockEnabled={true}
          bounces={false}
          scrollEnabled={this.state.scrollEnabled}
          scrollsToTop={false}
        >
          <View
            style={[styles.tabs, {width: this.state._containerWidth, }, this.props.tabsContainerStyle, ]}
            ref={'tabContainer'}
            onLayout={this.onTabContainerLayout.bind(this)}
          >
            {this.props.tabs.map((name, page) => {
              const isTabActive = this.props.activeTab === page;
              return this.renderTab(name, page, isTabActive, this.props.goToPage, this.measureTab.bind(this, page));
            })}
            {
              // <Animated.View style={[tabUnderlineStyle, dynamicTabUnderline, this.props.underlineStyle, ]} />
            }
          </View>
        </ScrollView>
      </View>
    )
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.tabs) !== JSON.stringify(nextProps.tabs) && this.state._containerWidth) {
      this.setState({ _containerWidth: null, });
    }
    if (this.props.scrollValue!==nextProps.scrollValue) {
      this.updateView({value: nextProps.scrollValue._value, });
    }
  }
  onTabContainerLayout(e) {
    this._tabContainerMeasurements = e.nativeEvent.layout;
    let width = this._tabContainerMeasurements.width;
    if (width < WINDOW_WIDTH) {
      width = WINDOW_WIDTH;
      this.setState({scrollEnabled:false});
    }else {
      this.setState({scrollEnabled:true});
    }
    this.setState({ _containerWidth: width, });
    this.updateView({value: this.props.scrollValue._value, });
  }
  onContainerLayout(e) {
    this._containerMeasurements = e.nativeEvent.layout;
    this.updateView({value: this.props.scrollValue._value, });
  }
}

ScrollableTabBar.propTypes = {
  goToPage: PropTypes.func,
  activeTab: PropTypes.number,
  tabs: PropTypes.array,
  backgroundColor: PropTypes.string,
  activeTextColor: PropTypes.string,
  inactiveTextColor: PropTypes.string,
  scrollOffset: PropTypes.number,
  style: ViewPropTypes.style,
  tabStyle: ViewPropTypes.style,
  tabsContainerStyle: ViewPropTypes.style,
  textStyle: Text.propTypes.style,
  renderTab: PropTypes.func,
  underlineStyle: ViewPropTypes.style,
  onScroll: PropTypes.func,
};

ScrollableTabBar.defaultProps = {
  scrollOffset: 52,
  activeTextColor: 'navy',
  inactiveTextColor: 'black',
  backgroundColor: null,
  style: {},
  tabStyle: {},
  tabsContainerStyle: {},
  underlineStyle: {},
};

var styles = StyleSheet.create({
  tab: {
    height: 47,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 20,
  },
  container: {
    height: 47,
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: '#ccc',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
})
