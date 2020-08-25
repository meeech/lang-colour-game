import React, { useState, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';
import { each, random, reduce, shuffle } from 'lodash';
import './index.css';
import yaml from 'js-yaml';

// How many colour swatches to choose from
const picks = 3;
const blankGuess = { name: null, colour: null };

// reducer actions
const actions = {
  INIT: 'INIT',
  GUESS: 'GUESS',
};

// TODO copy this to the project directly?
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

const scUpdate = (previousScorecard, isWinner) => {
  const correct = isWinner ? previousScorecard.correct + 1 : 0;
  const round = isWinner ? previousScorecard.round : previousScorecard.round + 1;
  const streak = previousScorecard.streak > correct ? previousScorecard.streak : correct;
  return { correct, round, streak };
};

const gameStateReducer = (state, action) => {
  console.log('gameStateReducer', state, action);

  if (actions.INIT === action.type) {
    const colours = action.payload;
    const nextRound = shuffle(colours).slice(0, picks);
    const toGuess = nextRound[random(picks - 1)];
    return { ...state, colours, nextRound, toGuess };
  }

  if (actions.GUESS === action.type) {
    const colours = state.colours;
    const playerGuess = action.payload;
    const isWinner = playerGuess.name === state.toGuess.name;
    const nextRound = shuffle(colours).slice(0, picks);
    const toGuess = nextRound[random(picks - 1)];

    const scorecard = scUpdate(state.scorecard, isWinner);

    return { ...state, nextRound, toGuess, scorecard };
  }

  throw new Error(`Did not handle action ${action.type}`);
};

const Game = (props) => {
  const [gameState, gameStateDispatch] = useReducer(gameStateReducer, {
    colours: [],
    nextRound: [],
    playerGuess: blankGuess,
    toGuess: blankGuess,
    scorecard: {
      correct: 0,
      round: 1,
      streak: 0,
    },
  });

  // Fetch the colour list - do I need this effect?
  // Could this just be a regular call for fetchData which then sets the state?
  useEffect(() => {
    console.log('Game: colour fetch useEffect triggered');

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
          if (value.color) {
            acc.push({ name: key, colour: value.color });
          }
          return acc;
        },
        []
      );
      gameStateDispatch({ type: actions.INIT, payload: _colours });
    }
    fetchData();
  }, [gameState.colours]);

  const setPlayerGuess = (colour) => {
    gameStateDispatch({ type: actions.GUESS, payload: colour });
  };

  console.log('Game:return/render', gameState);
  return (
    <>
      <div>
        <Header toGuess={gameState.toGuess} scorecard={gameState.scorecard} />
      </div>
      <div className="container">
        <ColourList colours={gameState.nextRound} setPlayerGuess={setPlayerGuess} />
      </div>
    </>
  );
};

ReactDOM.render(<Game />, document.getElementById('root'));
