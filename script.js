const Gameboard = (() => {
    let board = new Array(9).fill("");
  
    const getBoard = () => board;
  
    const placeMark = (index, mark) => {
      if (!board[index]) { 
        board[index] = mark;
        return true;
      }
      return false;
    };
  
    const getEmptyIndices = () => {
      const emptyIndices = [];
      board.forEach((cell, i) => {
        if (!cell) emptyIndices.push(i);
      });
      return emptyIndices;
    };
  
    const reset = () => board.fill("");
  
    return { getBoard, placeMark, getEmptyIndices, reset };
  })();
  
  
  // Отображение
  const DisplayController = (() => {
    const boardEl = document.getElementById("gameboard");
    const statusEl = document.getElementById("status");
  
    const update = () => {
      boardEl.innerHTML = "";
      Gameboard.getBoard().forEach((mark, i) => {
        const cell = document.createElement("div");
        cell.classList.add("gameboard__cell");
        cell.textContent = mark;
        cell.addEventListener("click", () => Game.playTurn(i));
        boardEl.appendChild(cell);
      });
    };
  
    const setMessage = (msg) => {
      statusEl.textContent = msg;
    };
  
    return { update, setMessage };
  })();
  
  // Игра
  const Game = (() => {
    let isGameOver = false;
  
    const start = () => {
      Gameboard.reset();
      isGameOver = false;
      DisplayController.update();
      DisplayController.setMessage("Ваш ход (X)");
      hideResult();
    };
  
    const playTurn = (index) => {
      if (isGameOver || Gameboard.getBoard()[index] !== "") return;
  
      Gameboard.placeMark(index, "X");
      DisplayController.update();
  
      if (checkEnd("X")) return;
  
      setTimeout(() => {
        botMove();
        DisplayController.update();
        checkEnd("O");
      }, 300);
    };
  
    const botMove = () => {
      const empty = Gameboard.getEmptyIndices();
      if (empty.length > 0) {
        const randIndex = empty[Math.floor(Math.random() * empty.length)];
        Gameboard.placeMark(randIndex, "O");
      }
    };
  
    const checkEnd = (mark) => {
      const board = Gameboard.getBoard();
      const winCombos = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
      ];
  
      if (winCombos.some(combo => combo.every(i => board[i] === mark))) {
        isGameOver = true;
        showResult(mark);
        return true;
      }
  
      if (board.every(cell => cell !== "")) {
        isGameOver = true;
        showResult("draw");
        return true;
      }
  
      DisplayController.setMessage(mark === "X" ? "Ход компьютера..." : "Ваш ход (X)");
      return false;
    };
  
    const showResult = (winner) => {
      const resultDiv = document.getElementById("result");
      const resultText = document.getElementById("result-text");
      const resultImg = document.getElementById("result-img");
      const overlay = document.getElementById("overlay");
  
      if (winner === "X") {
        DisplayController.setMessage("Вы победили!");
        resultText.textContent = "Поздравляю, ты победил!";
        resultImg.src = "images/monkkkey.avif";
        resultImg.classList.remove("result__img--loser");
      } else if (winner === "O") {
        DisplayController.setMessage("Компьютер победил!");
        resultText.textContent = "Поздравляю, ты лох!";
        resultImg.src = "images/monkey.webp";
        resultImg.classList.add("result__img--loser");
      } else {
        DisplayController.setMessage("Ничья!");
        resultText.textContent = "Ничья!";
        resultImg.src = "images/draw.jpg";
        resultImg.classList.remove("result__img--loser");
      }
  
      resultDiv.classList.remove("hidden");
      overlay.classList.remove("hidden");
    };
  
    const hideResult = () => {
      document.getElementById("result").classList.add("hidden");
      document.getElementById("overlay").classList.add("hidden");
    };
  
    return { start, playTurn };
  })();
  
  // Кнопки
  document.getElementById("start__button").addEventListener("click", () => {
    document.getElementById("intro").classList.add("hidden");
    document.getElementById("gameboard").classList.remove("hidden");
    document.getElementById("status").classList.remove("hidden");
    document.getElementById("restart__button").classList.remove("hidden");
    Game.start();
  });
  
  document.getElementById("restart__button").addEventListener("click", () => {
    Game.start();
  });
  