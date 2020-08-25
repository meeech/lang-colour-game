import React, { useState, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';
import { each, random, reduce, shuffle } from 'lodash';
import './index.css';
import yaml from 'js-yaml';

// How many colour swatches to choose from
const picks = 3;

const blankGuess = { name: null, colour: null };

const actions = {
  COLOURS: 'COLOURS',
};
// TODO copy this to the project directly
const languages =
  'https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml';

// TODO how can this be changed so it subs to playerGuess?
const logColour = (colour) => {
  // fun easter egg
  console.log(
    `%c ${colour.name} ${colour.colour}                            `,
    `color: #000;font-weight:bold; background-color:${colour.colour}`
  );
};
const ColourList = ({ colours, setPlayerGuess }) => {
  console.log('ColourList...');
  // REMOVE ME!
  each(colours, logColour);
  const items = colours.map((colour) => (
    <Swatch
      key={colour.name}
      onClick={() => {
        logColour(colour);
        setPlayerGuess(colour);
      }}
      name={colour.name}
      colour={colour.colour}
    />
  ));
  return <>{items}</>;
};

const Header = ({ toGuess, scorecard }) => {
  return (
    <div className="header">
      <div className="to-guess">{toGuess.name}</div>
      <div className="scorecard">
        <div>round: {scorecard.round}</div>
        <div>correct: {scorecard.correct}</div>
        <div>streak: {scorecard.streak}</div>
      </div>
    </div>
  );
};

const Swatch = ({ colour, onClick }) => {
  return <div className="swatch" style={{ backgroundColor: colour }} onClick={onClick}></div>;
};

const gameStateReducer = (state, action) => {
  console.log('gameStateReducer', state, action);
  switch (action.type) {
    case actions.COLOURS:
      const colours = action.payload;
      const nextRound = shuffle(colours).slice(0, picks);
      const toGuess = nextRound[random(picks - 1)];
      return { ...state, colours, nextRound, toGuess };

    default:
      throw new Error('Missing Action type');
  }
};

const Game = (props) => {
  const [gameState, gameStateDispatch] = useReducer(gameStateReducer, {
    colours: [],
    nextRound: [],
    toGuess: blankGuess,
  });
  // const toGuess = {};
  const scorecard = {};
  // const nextRound = [];
  const setPlayerGuess = () => {};

  // Fetch the colour list
  useEffect(() => {
    console.log('Game: colour fetch useEffect triggered', gameState.colours);

    // How can we avoid this? We know colours won't change after the first time they set. Do we us [] for the deps? that seems wrong too
    if (gameState.colours.length > 0) {
      console.log(`Effect called, but we already have our colours: ${gameState.colours.length}`);
      return;
    }

    async function fetchData() {
      const response = await fetch(languages);
      if (!response.ok) {
        console.error(response);
      }

      const parsed = yaml.safeLoad(await response.text());
      const _colours = reduce(
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
      gameStateDispatch({ type: actions.COLOURS, payload: _colours });
    }
    fetchData();
  }, [gameState.colours]);

  console.log('Game:return/render', gameState);
  return (
    <>
      <div>
        <Header toGuess={{}} scorecard={scorecard} />
      </div>
      <div className="container">
        <ColourList colours={[]} setPlayerGuess={setPlayerGuess} />
      </div>
    </>
  );
};

const GameX = (props) => {
  // ? This all feel a bit wrong, like i should be using a 'global' in scope so everything can take advantage here
  const [colours, setColours] = useState([]);
  const [nextRound, setNextRound] = useState();
  const [playerGuess, setPlayerGuess] = useState(blankGuess);
  const [scorecard, setScorecard] = useState({
    round: 1,
    correct: 0,
    streak: 0,
  });
  const [toGuess, setToGuess] = useState(blankGuess);

  const nextTurn = () => {
    const _next = shuffle(colours).slice(0, picks);
    console.log('_next', _next);
    setNextRound(_next);
    if (_next.length) {
      setToGuess(_next[random(picks - 1)]);
    }
  };

  // THis should just handle a guess
  useEffect(() => {
    const isWinner = toGuess.name ? toGuess === playerGuess : false;
    if (!playerGuess.name) {
      console.log('No guess...');
      return;
    }

    const scUpdate = (previousScorecard) => {
      const correct = isWinner ? previousScorecard.correct + 1 : 0;
      const round = isWinner ? previousScorecard.round : previousScorecard.round + 1;
      const streak = previousScorecard.streak > correct ? previousScorecard.streak : correct;
      return { correct, round, streak };
    };
    setScorecard(scUpdate);
    // Setup next group to guess from
    setPlayerGuess(blankGuess);
    nextTurn();
  }, [playerGuess, toGuess]);

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

    fetchData()
      .then((_colours) => {
        setColours(_colours);
      })
      .then(nextTurn);
  }, [colours]);

  if (colours.length < 1) {
    console.log('No colours, return');
    return <></>;
  }

  if (!toGuess || !nextRound) {
    console.log(`No toGuess ${toGuess}, no nextRound ${nextRound}`);
    return <></>;
  }

  console.log('Main:return/render');
  return (
    <>
      <div>
        <Header toGuess={toGuess} scorecard={scorecard} />
      </div>
      <div className="container">
        <ColourList colours={nextRound} setPlayerGuess={setPlayerGuess} />
      </div>
    </>
  );
};

ReactDOM.render(<Game />, document.getElementById('root'));
