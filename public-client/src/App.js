import React from 'react';
import { BrowserRouter, Match } from 'react-router';
import { SignIn, Sample, Home } from './containers';
import './App.css';

function App() {

  return (
    <BrowserRouter>
      {(router) => (
        <div>
          <Match exactly pattern="/" component={() => <Home />} />
          <Match pattern="/sign-in" component={() => <SignIn {...router} />} />
          <Match pattern="/sample" component={() => <Sample />} />
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;
