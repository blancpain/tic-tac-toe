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

  const clearGameArray = () => {
    for (let index = 0; index < 9; index++) {
      gameArray[index] = "";
    }
  };

  return {
    gameArray,
    clearGameArray,
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

  const determineOutcome = () => {
    const currentGameArray = gameBoard.gameArray;
    const winnerX = "XXX";
    const winnerO = "OOO";

    const gameArrayRows = [
      currentGameArray.slice(0, 3),
      currentGameArray.slice(3, 6),
      currentGameArray.slice(6, 9),
    ];
    const gameArrayDiagonals = [
      [currentGameArray[0], currentGameArray[4], currentGameArray[8]],
      [currentGameArray[2], currentGameArray[4], currentGameArray[6]],
    ];

    const gameArrayCols = [];
    for (let index = 0; index < currentGameArray.length / 3; index++) {
      gameArrayCols.push([
        currentGameArray[index],
        currentGameArray[index + 3],
        currentGameArray[index + 6],
      ]);
    }

    const gameArrayAll = [
      ...gameArrayRows,
      ...gameArrayCols,
      ...gameArrayDiagonals,
    ];

    for (let index = 0; index < gameArrayAll.length; index++) {
      const gameArraySequence = gameArrayAll[index].join("");
      if (gameArraySequence === winnerX)
        displayController.announceWinner("Player 1");
      else if (gameArraySequence === winnerO)
        displayController.announceWinner("Player 2");
    }
  };

  return { determineTurn, determineOutcome };
})();

const displayController = (() => {
  const gameCells = document.querySelectorAll(".game-cell");
  const restartBtn = document.querySelector(".restart");
  const playerOne = document.querySelector(".player1");
  let isBoardEmpty = true;

  const clearDisplayAndGameboard = () => {
    gameCells.forEach((cell) => {
      cell.textContent = "";
    });
    gameBoard.clearGameArray();
    isBoardEmpty = true;
    setTimeout(clearPrompts, 1000);
  };

  const clearPrompts = () => {
    playerOne.textContent = "";
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
      gameFlow.determineOutcome();
    } else if (currentTurn === "Player 2" && cellValue === "") {
      event.target.textContent = "O";
      gameBoard.gameArray[cellIndex] = event.target.textContent;
      gameFlow.determineOutcome();
    }
  };

  const announceWinner = (player) => {
    playerOne.textContent = `${player} wins!`;
    setTimeout(clearDisplayAndGameboard, 2.0 * 1000);
  };

  // add marks
  gameCells.forEach((cell) => {
    cell.addEventListener("click", populateDisplay);
  });
  // clear display
  restartBtn.addEventListener("click", clearDisplayAndGameboard);

  return {
    clearDisplayAndGameboard,
    populateDisplay,
    isBoardEmpty,
    announceWinner,
    clearPrompts,
  };
})();
