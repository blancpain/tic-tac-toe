const playerFactory = (name) => {
  let wins = 0;
  let playerName = name;

  const getWins = () => wins;

  const updateWins = () => {
    wins += 1;
  };

  return {
    set name(name) {
      playerName = name;
    },
    get name() {
      return playerName;
    },
    getWins,
    updateWins,
  };
};

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
  let isGameOver = false;

  const restartGame = () => {
    isGameOver = false;
  };

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
    // check for wins
    for (let index = 0; index < gameArrayAll.length; index++) {
      const gameArraySequence = gameArrayAll[index].join("");
      if (gameArraySequence === winnerX) {
        displayController.announceOutcome("Player 1");
        isGameOver = true;
      } else if (gameArraySequence === winnerO) {
        displayController.announceOutcome("Player 2");
        isGameOver = true;
      }
    }
    // check for draws
    const isArrayFullyPopulated = (item) => item !== "";
    if (currentGameArray.every(isArrayFullyPopulated)) {
      displayController.announceOutcome("Draw");
      isGameOver = true;
    }
    return isGameOver;
  };

  return { determineTurn, determineOutcome, restartGame };
})();

const displayController = (() => {
  const startGameOverlay = document.querySelector(".overlay");
  const gameCells = document.querySelectorAll(".game-cell");
  // announcements
  const announcementContainer = document.querySelector(
    ".announcement-container"
  );
  const announcementMessage = document.querySelector(".announcement");
  // buttons
  const selectPlayerButton = document.querySelector("#select-player");
  const selectAIButton = document.querySelector("#select-AI");
  const clearBtn = document.querySelector(".clear");
  const restartBtn = document.querySelector(".restart");
  const startGameButton = document.querySelectorAll("#start-game");
  // player popups and names
  const playerVsPlayerPopup = document.querySelector("#player-vs-player");
  const playerVsAIPopup = document.querySelector("#player-vs-AI");
  const playerOneName = document.querySelector(".player-one-name");
  const playerTwoName = document.querySelector(".player-two-name");
  // create players
  const playerOne = playerFactory("");
  const playerTwo = playerFactory("");
  // flags
  let isBoardEmpty = true;
  let isGameVsAI = false;

  const clearDisplayAndMessages = () => {
    gameCells.forEach((cell) => {
      cell.textContent = "";
    });
    gameBoard.clearGameArray();
    isBoardEmpty = true;
    gameFlow.restartGame();
    announcementMessage.textContent = "";
    announcementContainer.classList.remove("announcement-overlay");
  };

  const restartGame = () => {
    clearDisplayAndMessages();
    startGameOverlay.classList.toggle("hide-elements");
    playerVsAIPopup.classList.remove("hide-elements");
    playerVsAIPopup.classList.remove("unhide-elements");
    playerVsPlayerPopup.classList.remove("hide-elements");
    playerVsPlayerPopup.classList.remove("unhide-elements");
    playerVsPlayerPopup.reset();
    playerVsAIPopup.reset();
  };

  const populateDisplay = (event) => {
    const cellIndex = Number(event.target.dataset.index);
    const cellValue = event.target.textContent;
    if (cellValue !== "" || gameFlow.determineOutcome()) return;
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

  const openPlayerVsPlayerPopup = () => {
    if (playerVsAIPopup.classList.contains("unhide-elements")) {
      playerVsAIPopup.classList.remove("unhide-elements");
    }
    playerVsPlayerPopup.classList.add("unhide-elements");
    isGameVsAI = false;
  };

  const openPlayerVsAIPopup = () => {
    if (playerVsPlayerPopup.classList.contains("unhide-elements")) {
      playerVsPlayerPopup.classList.remove("unhide-elements");
    }
    playerVsAIPopup.classList.add("unhide-elements");
    isGameVsAI = true;
  };

  const startGame = (e) => {
    const playerOneNamePvP =
      playerVsPlayerPopup.children[0].children.player1.value;
    const playerTwoNamePvP =
      playerVsPlayerPopup.children[0].children.player2.value;
    const playerOneNameAI = playerVsAIPopup.children[0].children.player1.value;
    if (!isGameVsAI && playerOneNamePvP !== "" && playerTwoNamePvP !== "") {
      e.preventDefault();
      startGameOverlay.classList.toggle("hide-elements");
      playerVsPlayerPopup.classList.toggle("hide-elements");
      playerOneName.textContent = playerOneNamePvP;
      playerTwoName.textContent = playerTwoNamePvP;
      playerOne.name = playerOneNamePvP;
      playerTwo.name = playerTwoNamePvP;
    } else if (isGameVsAI && playerOneNameAI !== "") {
      e.preventDefault();
      startGameOverlay.classList.toggle("hide-elements");
      playerVsAIPopup.classList.toggle("hide-elements");
      playerOneName.textContent = playerOneNameAI;
      playerTwoName.textContent = "Computer";
      playerOne.name = playerOneNamePvP;
      playerTwo.name = playerTwoNamePvP;
    }
  };

  const getPlayers = () => [playerOne, playerTwo];

  const announceOutcome = (outcome) => {
    announcementContainer.classList.add("announcement-overlay");
    announcementMessage.classList.add("announcement-message");
    const winningPlayer =
      outcome === "Player 1"
        ? playerOneName.textContent
        : playerTwoName.textContent;
    announcementMessage.textContent =
      outcome === "Draw" ? "Draw!" : `${winningPlayer} wins!`;
    setTimeout(clearDisplayAndMessages, 2000);
  };

  // select Player or AI
  selectPlayerButton.addEventListener("click", openPlayerVsPlayerPopup);
  selectAIButton.addEventListener("click", openPlayerVsAIPopup);

  // start game
  startGameButton.forEach((button) => {
    button.addEventListener("click", startGame);
  });

  // add marks
  gameCells.forEach((cell) => {
    cell.addEventListener("click", populateDisplay);
  });
  // clear display
  clearBtn.addEventListener("click", clearDisplayAndMessages);

  // restart game
  restartBtn.addEventListener("click", restartGame);

  return {
    clearDisplayAndMessages,
    populateDisplay,
    isBoardEmpty,
    announceOutcome,
    getPlayers,
  };
})();
