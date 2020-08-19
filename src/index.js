import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { random, reduce, shuffle } from 'lodash';
const yaml = require('js-yaml');

// How many colour swatches to choose from
const picks = 5;

const languages =
  'https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml';

const ColourList = ({ colours }) => {
  const items = colours.map((colour) => <Swatch key={colour.name} colour={colour.colour} />);
  return <>{items}</>;
};

const Header = ({ toGuess }) => {
  return <div className="to-guess">{toGuess.name}</div>;
};

const Swatch = ({ colour, name }) => {
  return <div className="swatch" style={{ backgroundColor: colour }}></div>;
};

const Main = (props) => {
  const [colours, setColours] = useState([]);

  useEffect(() => {
    if (colours.length > 0) {
      console.log(`Effect called, but we already have our colours: ${colours.length}`);
      return;
    }

    async function fetchData() {
      const response = await fetch(languages);
      if (!response.ok) {
        console.error(response);
      }
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

  if (colours.length < 1) {
    console.log('No colours');
    return <></>;
  }

  const nextRound = shuffle(colours).slice(0, picks);
  const toGuess = nextRound[random(picks - 1)];
  return (
    <>
      <div>
        <Header toGuess={toGuess} />
      </div>
      <div>
        <ColourList colours={nextRound} />
      </div>
    </>
  );
};

ReactDOM.render(<Main />, document.getElementById('root'));
