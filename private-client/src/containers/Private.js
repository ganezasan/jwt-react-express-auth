import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import { connect } from 'react-redux';

import logo from '../logo.svg';
import { clickLogout } from '../redux/auth/actions/auth';

class Private extends Component {
  handleLogout = this.handleLogout.bind(this);
  handleLogout() {
    fetch('/api/logout', {
      credentials: 'same-origin',
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: {},
    })
    .then((res) => res.json())
    .then((res) => {
      if(res.success) {
        this.props.dispatch(clickLogout());
      }
    }).catch((err) => {
      console.error('Fetch logout ERROR:', err);
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Private Client</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={this.handleLogout}>Logout</button>
      </div>
    );
  }
}

export default connect()(Private);
