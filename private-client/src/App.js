import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import fetch from 'isomorphic-fetch';

class App extends Component {

  handleLogout() {
    fetch('/logout', {
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
        document.location.href = res.redirect;
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

export default App;
