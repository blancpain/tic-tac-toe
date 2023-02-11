const playerFactory = (name) => {
  let wins = 0;
  let playerName = name;

  const getWins = () => wins;

  const updateWins = () => {
    wins += 1;
  };

  const clearWins = () => {
    wins = 0;
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
    clearWins,
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
  const ai = "O";
  const humanMove = "X";
  const currentGameArray = gameBoard.gameArray;
  const scores = {
    X: -1,
    O: 1,
    Draw: 0,
  };

  const determineTurn = (isBoardEmpty) => {
    if (isBoardEmpty || currentTurn === "Player 2") {
      currentTurn = "Player 1";
    } else if (!isBoardEmpty && currentTurn === "Player 1") {
      currentTurn = "Player 2";
    }
    return currentTurn;
  };

  // minimax usually uses depth (to check how many levels down we go?) but not needed here
  const minimax = (currentGameArray, isMaximising) => {
    const outcome = determineOutcome();
    if (outcome !== null) {
      return scores[outcome];
    }
    if (isMaximising) {
      let bestScore = -Infinity;
      for (let index = 0; index < currentGameArray.length; index++) {
        if (currentGameArray[index] === "") {
          currentGameArray[index] = ai;
          const score = minimax(currentGameArray, false);
          currentGameArray[index] = "";
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    }
    if (!isMaximising) {
      let bestScore = Infinity;
      for (let index = 0; index < currentGameArray.length; index++) {
        if (currentGameArray[index] === "") {
          currentGameArray[index] = humanMove;
          const score = minimax(currentGameArray, true);
          currentGameArray[index] = "";
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const computerMove = () => {
    let bestScore = -Infinity;
    let bestMove;

    for (let index = 0; index < currentGameArray.length; index++) {
      if (currentGameArray[index] === "") {
        currentGameArray[index] = ai;
        // call minimax with false since we now want to simulate the human move
        // the line above is the computer move
        // hence we call it as the minimizer (the human)
        const score = minimax(currentGameArray, false);
        currentGameArray[index] = "";
        if (score > bestScore) {
          bestScore = score;
          bestMove = index;
        }
      }
    }
    currentGameArray[bestMove] = ai;
    displayController.populateComputerMove(bestMove);
  };

  const determineOutcome = () => {
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
        return "X";
      }
      if (gameArraySequence === winnerO) {
        return "O";
      }
    }
    // check for draws
    const isArrayFullyPopulated = (item) => item !== "";
    if (currentGameArray.every(isArrayFullyPopulated)) {
      return "Draw";
    }

    return null;
  };

  return {
    determineTurn,
    determineOutcome,
    computerMove,
  };
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
  // scoreboards
  const playerOneScore = document.querySelector(".player-one-score");
  const playerTwoScore = document.querySelector(".player-two-score");
  // flags
  let isBoardEmpty = true;
  let isGameVsAI = false;

  const clearDisplayAndMessages = () => {
    gameCells.forEach((cell) => {
      cell.textContent = "";
    });
    gameBoard.clearGameArray();
    isBoardEmpty = true;
    turnCounter = 0;
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
    playerOne.clearWins();
    playerTwo.clearWins();
    playerOneScore.textContent = "0";
    playerTwoScore.textContent = "0";
  };

  const announceOutcome = (outcome) => {
    announcementContainer.classList.add("announcement-overlay");
    announcementMessage.classList.add("announcement-message");
    const winningPlayer =
      outcome === playerOne.name
        ? playerOneName.textContent
        : playerTwoName.textContent;
    announcementMessage.textContent =
      outcome === "Draw" ? "Draw!" : `${winningPlayer} wins!`;
    setTimeout(clearDisplayAndMessages, 2000);
  };

  const updateScoreboard = (winner) => {
    if (winner.name === playerOne.name) {
      playerOneScore.textContent = winner.getWins();
    } else {
      playerTwoScore.textContent = winner.getWins();
    }
  };

  const populateDisplay = (event) => {
    const cellIndex = Number(event.target.dataset.index);
    const cellValue = event.target.textContent;
    let outcome;
    if (cellValue !== "") return;
    const currentTurn = gameFlow.determineTurn(isBoardEmpty);
    if (!isGameVsAI) {
      if (currentTurn === "Player 1" && cellValue === "") {
        event.target.textContent = "X";
        gameBoard.gameArray[cellIndex] = event.target.textContent;
        isBoardEmpty = false;
        outcome = gameFlow.determineOutcome();
        if (outcome === "X") {
          announceOutcome(playerOne.name);
          playerOne.updateWins();
          updateScoreboard(playerOne);
        } else if (outcome === "Draw") {
          displayController.announceOutcome("Draw");
        }
      } else if (currentTurn === "Player 2" && cellValue === "") {
        event.target.textContent = "O";
        gameBoard.gameArray[cellIndex] = event.target.textContent;
        outcome = gameFlow.determineOutcome();
        if (outcome === "O") {
          announceOutcome(playerTwo.name);
          playerTwo.updateWins();
          updateScoreboard(playerTwo);
        } else if (outcome === "Draw") announceOutcome("Draw");
      }
    } else if (isGameVsAI && cellValue === "") {
      event.target.textContent = "X";
      gameBoard.gameArray[cellIndex] = event.target.textContent;
      isBoardEmpty = false;
      outcome = gameFlow.determineOutcome();
      if (outcome !== "X") {
        gameFlow.computerMove();
      }
      // check if computer won after it's last move
      outcome = gameFlow.determineOutcome();
      if (outcome === "O") {
        announceOutcome(playerTwo.name);
        playerTwo.updateWins();
        updateScoreboard(playerTwo);
      } else if (outcome === "X") {
        announceOutcome(playerOne.name);
        playerOne.updateWins();
        updateScoreboard(playerOne);
      } else if (outcome === "Draw") announceOutcome("Draw");
    }
  };

  const populateComputerMove = (index) => {
    gameCells.forEach((cell) => {
      if (Number(cell.getAttribute("data-index")) === index) {
        cell.textContent = "O";
      }
    });
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
      playerTwo.name = "Computer";
    }
  };

  const getPlayers = () => [playerOne, playerTwo];

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
    updateScoreboard,
    populateComputerMove,
  };
})();
