import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { random, reduce, shuffle } from 'lodash';
import './index.css';
import yaml from 'js-yaml';

// How many colour swatches to choose from
const picks = 5;

// TODO copy this to the project directly
const languages =
  'https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml';

const ColourList = ({ colours, setPlayerGuess }) => {
  console.log('ColourList...');
  const items = colours.map((colour) => (
    <Swatch
      key={colour.name}
      onClick={() => {
        // fun easter egg
        console.log(
          `%c ${colour.name} ${colour.colour}                            `,
          `color: #000;font-weight:bold; background-color:${colour.colour}`
        );
        setPlayerGuess(colour);
      }}
      name={colour.name}
      colour={colour.colour}
    />
  ));
  return <>{items}</>;
};

const Header = ({ toGuess }) => {
  return (
    <div className="header">
      <div className="to-guess">{toGuess.name}</div>
      <div className="scorecard">
        <div>round: #</div>
        <div>correct: #</div>
        <div>streak: #</div>
      </div>
    </div>
  );
};

const Swatch = ({ colour, onClick }) => {
  return <div className="swatch" style={{ backgroundColor: colour }} onClick={onClick}></div>;
};

const Game = (props) => {
  // ? This all feel a bit wrong, like i should be using a 'global' in scope so everything can take advantage here
  const [colours, setColours] = useState([]);
  const [nextRound, setNextRound] = useState();
  const [playerGuess, setPlayerGuess] = useState({ name: null, colour: null });
  const [toGuess, setToGuess] = useState({ name: null, colour: null });

  const isWinner = toGuess.name ? toGuess === playerGuess : false;

  if (isWinner) {
  }

  useEffect(() => {
    console.log('useEffect triggered');
    async function fetchData() {
      if (colours.length > 0) {
        console.log(`Effect called, but we already have our colours: ${colours.length}`);
        return colours;
      }

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

    fetchData().then((response) => {
      setColours(response);
      const _next = shuffle(colours).slice(0, picks);
      console.log('_next', _next);
      setNextRound(_next);
      if (_next.length) {
        setToGuess(_next[random(picks - 1)]);
      }
    });
  }, [colours]);

  if (colours.length < 1) {
    console.log('No colours, return');
    return <></>;
  }

  if (!toGuess || !nextRound) {
    console.log(`No toGuess ${toGuess}, no nextRound ${nextRound}`);
    return <></>;
  }

  // const gameLoop = function () {
  //   //user makes a pick
  //   // is it a winner?
  //   // no... reveal name of colour they picked
  //   // otherwise
  //   // yes
  //   //
  // };
  console.log('Main:return/render');
  return (
    <>
      <div>
        <Header toGuess={toGuess} />
      </div>
      <div className="container">
        <ColourList colours={nextRound} setPlayerGuess={setPlayerGuess} />
      </div>
      {/* <Game toGuess={toGuess} playerGuess={playerGuess} /> */}
    </>
  );
};

ReactDOM.render(<Game />, document.getElementById('root'));
