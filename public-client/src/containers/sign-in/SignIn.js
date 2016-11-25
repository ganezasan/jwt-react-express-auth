import React, { Component } from 'react';
import logo from '../../logo.svg';
import fetch from 'isomorphic-fetch';

class SignIn extends Component {
  state = {
    message: 'Welcome to React',
    success: true,
  }

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
      body: JSON.stringify({ "email": email, "password": pass }),
    })
    .then((res) => res.json())
    .then((res) => {
      // this.props.router.replaceWith('/private');
      if(res.success) {
        document.location.href = res.redirect;
      }
      this.setState({
        message: res.message,
        success: res.success
      });
    }).catch((err) => {
      console.error('Fetch signup ERROR:', err)
    });
  }

  render() {
    const { message, success } = this.state;

    const titleStyle = {
      color: success ? 'white' : 'red',
    };

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2 style={titleStyle}>{message}</h2>
        </div>
        <form onSubmit={this.handleSubmit}>
          <label><input ref="email" placeholder="email" defaultValue="joe@example.com" /></label>
          <label><input ref="pass" placeholder="password" /></label> (hint: password)<br />
          <button type="submit">login</button>
        </form>
      </div>
    );
  }
}
export default SignIn;
