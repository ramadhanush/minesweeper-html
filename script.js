const board = document.getElementById("board");
const resetBtn = document.getElementById("reset");

let grid = [];
const WIDTH = 9;
const HEIGHT = 9;
const MINES = 10;

let mineCount = MINES;
let revealedCells = 0;

init();

resetBtn.addEventListener("click", function() {
  mineCount = MINES;
  revealedCells = 0;
  init();
});

function init() {
  createBoard();
  placeMines();
  updateMineCount();

  // Remove all cell classes and event listeners
  const cells = document.querySelectorAll('.cell');
  cells.forEach((cell) => {
    cell.classList.remove('hidden', 'revealed', 'mine', 'flag');
    cell.textContent = '';
    cell.removeEventListener('click', handleCellClick);
  });

  // Reset grid array
  grid = [];
  for (let i = 0; i < HEIGHT; i++) {
    grid[i] = [];
    for (let j = 0; j < WIDTH; j++) {
      grid[i][j] = { isMine: false, revealed: false, x: i, y: j };
    }
  }

  // Re-add event listeners to cells
  cells.forEach((cell) => {
    cell.addEventListener('click', handleCellClick);
  });
}

function createBoard() {
  for (let i = 0; i < HEIGHT; i++) {
    for (let j = 0; j < WIDTH; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell", "hidden");
      cell.setAttribute("data-row", i);
      cell.setAttribute("data-col", j);
      cell.addEventListener("click", handleCellClick);
      board.appendChild(cell);

      if (!grid[i]) {
        grid[i] = [];
      }
      grid[i][j] = { isMine: false, revealed: false, x: i, y: j };
    }
  }
}

function placeMines() {
  let minesPlaced = 0;
  while (minesPlaced < MINES) {
    const row = Math.floor(Math.random() * HEIGHT);
    const col = Math.floor(Math.random() * WIDTH);
    if (!grid[row][col].isMine) {
      grid[row][col].isMine = true;
      minesPlaced++;
    }
  }
}

function updateMineCount() {
  const mineCountEl = document.getElementById("mine-count");
  mineCountEl.textContent = `Mines: ${mineCount}`;
}

function handleCellClick(event) {
  const cell = event.target;
  const row = parseInt(cell.getAttribute("data-row"));
  const col = parseInt(cell.getAttribute("data-col"));

  if (cell.classList.contains('revealed') || cell.classList.contains('flag')) {
    return;
  }

  if (cell.classList.contains('hidden') && event.button === 2) {
    cell.classList.add('flag');
    mineCount--;
    updateMineCount();
    checkWin();
    return;
  }

  if (grid[row][col].isMine) {
    revealMines();
    endGame(false);
  } else {
    revealCell(row, col);
    checkWin();
  }
}

function revealMines() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    const row = parseInt(cell.getAttribute("data-row"));
    const col = parseInt(cell.getAttribute("data-col"));

    if (grid[row][col].isMine) {
      cell.classList.remove("hidden", "flag");
      cell.classList.add("mine");
    }
  });
}

function endGame(didWin) {
  const message = didWin ? "You won!" : "You lost!";
  alert(message);
}

function revealCell(row, col) {
  const cell = board.querySelector(
    `[data-row="${row}"][data-col="${col}"]`
  );
  if (cell.classList.contains('revealed') || cell.classList.contains('flag')) {
    return;
  }

  grid[row][col].revealed = true;
  revealedCells++;
  cell.classList.remove("hidden", "flag");
  cell.classList.add('revealed');

  if (!grid[row][col].isMine) {
    const minesAround = countMinesAround(row, col);
    if (minesAround > 0) {
      cell.textContent = minesAround;
    } else {
      revealNeighbours(row, col);
    }
  }
}

function countMinesAround(row, col) {
  let count = 0;
  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      if (i < 0 || i >= HEIGHT || j < 0 || j >= WIDTH) {
        continue;
      }
      if (grid[i][j].isMine) {
        count++;
      }
    }
  }
  return count;
}

function revealNeighbours(row, col) {
  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      if (i < 0 || i >= HEIGHT || j < 0 || j >= WIDTH) {
        continue;
      }
      if (!grid[i][j].revealed && !grid[i][j].isMine) {
        revealCell(i, j);
      }
    }
  }
}

function checkWin() {
  const nonMinesCount = WIDTH * HEIGHT - MINES;
  if (revealedCells === nonMinesCount) {
    endGame(true);
  }
}
