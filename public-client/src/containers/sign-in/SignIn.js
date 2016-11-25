import React, { Component } from 'react';
import logo from '../../logo.svg';
import fetch from 'isomorphic-fetch';

class SignIn extends Component {

  handleSubmit = this.handleSubmit.bind(this);
  handleSubmit(event) {
    event.preventDefault();

    const email = this.refs.email.value;
    const pass = this.refs.pass.value;
    const formData = new FormData();
    formData.append('username',this.refs.email.value);
    formData.append('password',this.refs.pass.value);

    fetch('/sign-in', {
      credentials: 'same-origin',
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ "username": email, "password": pass }),
    }).then((res) => {
      // this.props.router.replaceWith('/private');
      document.location.href = '/private';
    }).catch((err) => {
      console.error('Fetch signup ERROR:',err)
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <form onSubmit={this.handleSubmit}>
          <label><input ref="email" placeholder="email" defaultValue="joe@example.com" /></label>
          <label><input ref="pass" placeholder="password" /></label> (hint: password1)<br />
          <button type="submit">login</button>
        </form>
      </div>
    );
  }
}
export default SignIn;
