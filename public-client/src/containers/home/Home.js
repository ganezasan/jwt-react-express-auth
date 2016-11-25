import React from 'react';

function Home() {
  return (
    <div className="App">
      <div className="App-header">
        <h2>Home</h2>
      </div>
      <ul style={{listStyleType: 'none', padding: 0}}>
        <li><a href={'/sign-in'}>SignIn</a></li>
        <li><a href={'/private'}>Private Page</a></li>
      </ul>
    </div>
  );
}

export default Home;
