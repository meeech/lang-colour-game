import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const languages =
  'https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml';

const ColourList = (props) => {
  const [colours, setColours] = useState([
    { name: 'blue', hex: '#0000ff' },
    { name: 'red', hex: '#ff0000' },
  ]);

  const items = colours.map((colour) => <li key={colour.name}>{colour.name}</li>);

  useEffect(() => {
    console.log('effect fetching...');

    async function fetchData() {
      const response = await fetch(languages);
      console.log(response.ok);
      console.log(await response.text());
    }

    fetchData();
  }, [colours]);

  useEffect(function () {
    console.log('fetch...');
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
