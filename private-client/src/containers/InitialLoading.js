import React, { Component, PropTypes } from 'react';
import Loading from 'react-loading';

const propTypes = {
  height: PropTypes.number.isRequired,
};

class InitialLoading extends Component {

  render() {
    const { height } = this.props;

    const loadingWrapStyle = {
      position: 'relative',
      background: 'rgba(000, 000, 000, 0.7)',
      height,
    };

    const loadingStyle = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      WebkitTransform: 'translateY(-50%) translateX(-50%)',
      'transform': 'translateY(-50%) translateX(-50%)',
      'padding': '20px'
    };

    return (
      <div className="loading-wrap" style={loadingWrapStyle}>
        <div style={loadingStyle}>
          <Loading type='bars' color='#8BC34A' />
        </div>
      </div>
    );
  }
}

InitialLoading.propsTypes = propTypes;

export default InitialLoading;
