import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { each, random, reduce, shuffle, set } from 'lodash';
import './index.css';
import yaml from 'js-yaml';

// How many colour swatches to choose from
const picks = 3;

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

const Game = (props) => {
  const blankGuess = { name: null, colour: null };

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

  useEffect(() => {
    const isWinner = toGuess.name ? toGuess === playerGuess : false;
    if (!isWinner) {
      return;
    }

    const scUpdate = (previousScorecard) => {
      const round = previousScorecard.round + 1;
      const correct = previousScorecard.correct + 1;
      const streak = previousScorecard.streak > correct ? previousScorecard.streak : correct;
      return { round, correct, streak };
    };
    setScorecard(scUpdate);
    setPlayerGuess(blankGuess);
    // blank guess feels wrong having to be in this list- its static
  }, [blankGuess, playerGuess, toGuess]);

  // Run once to initialize the
  // useEffect(() => {
  //   setScorecard({ ...scorecard, round: scorecard.round + 1, streak: 0 });
  //   if (isWinner) {
  //     const round = scorecard.round + 1;
  //     const correct = scorecard.correct + 1;
  //     const streak = scorecard.streak > correct ? scorecard.streak : correct;
  //     setScorecard({ round, correct, streak });
  //     setPlayerGuess({ name: null, colour: null });
  //   } else {
  //   }
  // }, []);

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
        <Header toGuess={toGuess} scorecard={scorecard} />
      </div>
      <div className="container">
        <ColourList colours={nextRound} setPlayerGuess={setPlayerGuess} />
      </div>
      {/* <Game toGuess={toGuess} playerGuess={playerGuess} /> */}
    </>
  );
};

ReactDOM.render(<Game />, document.getElementById('root'));
