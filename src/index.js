import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const ColourList = (props) => {
  const [colours, setColours] = useState([
    { name: 'blue', hex: '#0000ff' },
    { name: 'red', hex: '#ff0000' },
  ]);

  const items = colours.map((colour) => <li key={colour.name}>{colour.name}</li>);

  useEffect(function () {
    console.log('effect here....');
    // setColours([]);
    return function () {
      console.log('uneffect');
    };
  });

  return <ul>{items}</ul>;
};

const Game = (props) => {
  return (
    <>
      <h1>Game</h1>
      <div>
        <ColourList />
      </div>
    </>
  );
};

ReactDOM.render(<Game />, document.getElementById('root'));
