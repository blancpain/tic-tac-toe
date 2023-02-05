const playerFactory = () => {
  const wins = 0;
  const losses = 0;
  const updateScore = () => { };

  return { updateScore };
};

const playerOne = playerFactory();
const playerTwo = playerFactory();

const gameBoard = (() => {
  const gameArray = [];
  for (let index = 0; index < 9; index++) {
    gameArray[index] = "";
  }

  return {
    gameArray,
  };
})();

const gameFlow = (() => {
  let currentTurn = "";
  const determineTurn = (isBoardEmpty) => {
    if (isBoardEmpty || currentTurn === "Player 2") {
      currentTurn = "Player 1";
    } else if (!isBoardEmpty && currentTurn === "Player 1") {
      currentTurn = "Player 2";
    }
    return currentTurn;
  };

  return { determineTurn };
})();

const displayController = (() => {
  const gameCells = document.querySelectorAll(".game-cell");
  const restartBtn = document.querySelector(".restart");
  let isBoardEmpty = true;

  const clearDisplay = () => {
    gameCells.forEach((cell) => {
      cell.textContent = "";
    });
    isBoardEmpty = true;
  };

  const populateDisplay = (event) => {
    const cellIndex = Number(event.target.dataset.index);
    const cellValue = event.target.textContent;
    if (cellValue !== "") return;
    const currentTurn = gameFlow.determineTurn(isBoardEmpty);
    if (currentTurn === "Player 1" && cellValue === "") {
      event.target.textContent = "X";
      gameBoard.gameArray[cellIndex] = event.target.textContent;
      isBoardEmpty = false;
    } else if (currentTurn === "Player 2" && cellValue === "") {
      event.target.textContent = "O";
      gameBoard.gameArray[cellIndex] = event.target.textContent;
      isBoardEmpty = false;
    }
  };

  // add marks
  gameCells.forEach((cell) => {
    cell.addEventListener("click", populateDisplay);
  });
  // clear display
  restartBtn.addEventListener("click", clearDisplay);

  return { clearDisplay, populateDisplay, isBoardEmpty };
})();
