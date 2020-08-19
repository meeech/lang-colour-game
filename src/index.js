import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import './index.css';

import { reduce } from 'lodash';
const yaml = require('js-yaml');

const languages =
  'https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml';

const Swatch = ({ colour, name }) => {
  return (
    <div className="swatch" style={{ backgroundColor: colour }}>
      {name}
    </div>
  );
};

const ColourList = (props) => {
  const [colours, setColours] = useState([]);
  const items = colours.map((colour) => (
    <Swatch key={colour.name} colour={colour.colour} name={colour.name} />
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

  return <>{items}</>;
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
