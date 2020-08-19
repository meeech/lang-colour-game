import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { reduce } from 'lodash';
const yaml = require('js-yaml');

const languages =
  'https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml';

const ColourList = (props) => {
  const [colours, setColours] = useState([]);
  console.log(colours, colours.map);
  const items = colours.map((colour) => <li key={colour.name}>{colour.name}</li>);

  useEffect(() => {
    if (colours.length > 0) {
      return;
    }

    async function fetchData() {
      const response = await fetch(languages);
      if (!response.ok) {
        console.error(response);
      }
      const raw = await response.text();
      const parsed = yaml.safeLoad(raw);
      // console.log(parsed);
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
