import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import './index.css';

import { reduce } from 'lodash';
const yaml = require('js-yaml');

const languages =
  'https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml';

const ColourList = (props) => {
  const [colours, setColours] = useState([]);
  const items = colours.map((colour) => (
    <li className="swatch" style={{ backgroundColor: colour.colour }} key={colour.name}>
      {colour.name}
    </li>
  ));

  useEffect(() => {
    if (colours.length > 0) {
      return;
    }

    async function fetchData() {
      const response = await fetch(languages);
      if (!response.ok) {
        console.error(response);
      }
      // const raw = ;
      const parsed = yaml.safeLoad(await response.text());
      return reduce(
        parsed,
        (acc, value, key) => {
          // debugger;
          if (value.color) {
            acc.push({
              name: key,
              colour: value.color,
            });
          }
          return acc;
        },
        []
      );
    }
    fetchData().then(function (response) {
      setColours(response);
    });
  }, [colours]);

  // useEffect(function () {
  //   console.log('fetch...');
  //   // setColours([]);
  //   return function () {
  //     console.log('uneffect');
  //   };
  // });

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
