import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Match } from 'react-router';
import {
  Private,
  InitialLoading
} from './containers';
import { fetchLoginState } from './redux/auth/actions/auth';
import './App.css';

class App extends Component {
  state = {
    height: document.documentElement.clientHeight,
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillMount() {
    this.props.dispatch(fetchLoginState());
  }

  componentWillUpdate(nextProps) {
    const { auth } = nextProps;
    this.guestWillTransfer(auth);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  guestWillTransfer(auth) {
    const { pathname } = document.location;

    if (!auth.isLoggedIn && pathname !== '/sign-in') {
      setTimeout(function() {
        document.location.href = '/sign-in';
      }, 2000);
    }
  }

  handleResize = this.handleResize.bind(this);
  handleResize() {
    this.setState({
      height: document.documentElement.clientHeight,
    });
  }

  render() {
    const { auth } = this.props;
    const { height } = this.state;

    return auth.isLoggedIn ? (
      <BrowserRouter>
        {(router) => (
          <div>
            <Match exactly pattern="/private" component={() => <Private />} />
          </div>
        )}
      </BrowserRouter> ) : <InitialLoading height={height} />;
  }
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

function select({ auth }) {
  return { auth };
}

export default connect(select)(App);
