const gameBoard = (() => {
  const gameArray = [];
  for (let index = 0; index < 9; index++) {
    gameArray[index] = index % 2 === 0 ? "X" : "O";
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
  const gameCells = document.querySelectorAll(".game-cell");
  const clearDisplay = () => {
    gameCells.forEach((cell) => {
      cell.textContent = "";
    });
  };
  const populateDisplay = () => {
    gameCells.forEach((cell) => {
      for (let index = 0; index < gameBoard.gameArray.length; index++) {
        if (Number(cell.dataset.index) === index) {
          cell.textContent = `${gameBoard.gameArray[index]}`;
        }
      }
    });
  };
  return { clearDisplay, populateDisplay };
})();

const playerFactory = () => {
  const wins = 0;
  const losses = 0;
  const updateScore = () => { };

  return { updateScore };
};

const playerOne = playerFactory();
const playerTwo = playerFactory();
