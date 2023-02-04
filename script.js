const gameBoard = (() => {
  const gameArray = [];
  for (let index = 0; index < 9; index++) {
    gameArray[index] = "";
  }

  return {
    gameArray,
  };
})();

const playRound = (() => {
  let play;

  return { play };
})();

const displayController = (() => {
  const display = document.querySelector(".display");

  return { display };
})();

const playerFactory = () => {
  const wins = 0;
  const losses = 0;
  const updateScore = () => { };

  return { updateScore };
};

const playerOne = playerFactory();
const playerTwo = playerFactory();
