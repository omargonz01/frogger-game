const grid = document.querySelector('.grid');
const timer = document.querySelector('.timer');
const endGameScreen = document.querySelector('.end-game-screen');
const endGameText = document.querySelector('.end-game-text');
const playAgainBtn = document.querySelector('.play-again');

// Set up  nested arrays
const gridMatrix = [
  ['', '', '', '', '', '', '', '', ''],
  [
    'river',
    'wood',
    'wood',
    'river',
    'wood',
    'river',
    'river',
    'river',
    'river',
  ],
  ['river', 'river', 'river', 'wood', 'wood', 'river', 'wood', 'wood', 'river'],
  ['', '', '', '', '', '', '', '', ''],
  ['road', 'bus', 'road', 'road', 'road', 'car', 'road', 'road', 'road'],
  ['road', 'road', 'road', 'car', 'road', 'road', 'road', 'road', 'bus'],
  ['road', 'road', 'car', 'road', 'road', 'road', 'bus', 'road', 'road'],
  ['', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', ''],
];

//  Initialize variables that control game settings
const victoryRow = 0; // Magic Number
const riverRows = [1, 2];
const roadRows = [4, 5, 6];
const duckPosition = { x: 4, y: 8 };
let contentBeforeDuck = '';
let time = 15;

function drawGrid() {
  grid.innerHTML = '';

  // for each row in matrix, we need to calculate process for what will be drawn on screen
  gridMatrix.forEach(function (gridRow, gridRowIndex) {
    gridRow.forEach(function (cellContent, cellContentIndex) {
      // given the current grid row, create a cell for the grid in the fame based on the cellContent
      const cellDiv = document.createElement('div');
      cellDiv.classList.add('cell');

      if (riverRows.includes(gridRowIndex)) {
        cellDiv.classList.add('river');
      } else if (roadRows.includes(gridRowIndex)) {
        cellDiv.classList.add('road');
      }
      // '' --> "falsey"
      // false --> boolean
      // 'river', 'road', 'car', 'bus', 'wood' --> "truthy"
      if (cellContent) {
        cellDiv.classList.add(cellContent);
      }

      grid.appendChild(cellDiv);
    });
  });
}

function placeDuck() {
  contentBeforeDuck = gridMatrix[duckPosition.y][duckPosition.x];
  gridMatrix[duckPosition.y][duckPosition.x] = 'duck';
}

function moveDuck(event) {
  const key = event.key;
  gridMatrix[duckPosition.y][duckPosition.x] = contentBeforeDuck;
  // arrows and "WASD"
  switch(key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      if (duckPosition.y > 0) duckPosition.y--;
      break;
    case 'ArrowDown':
    case 's':
    case 'S':
      if (duckPosition.y < 8) duckPosition.y++;
      break;
    case 'ArrowLeft':
    case 'a':
    case 'A':
      if (duckPosition.x > 0) duckPosition.x--;
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      if (duckPosition.x < 8) duckPosition.x++;
      break;
  }
  render();
}

// Animation Functions
// can be in their own file, and add script to link in html


function updateDuckPosition() {
  gridMatrix[duckPosition.y][duckPosition.x] = contentBeforeDuck;

  if(contentBeforeDuck === 'wood') {
    if (duckPosition.y === 1 && duckPosition.x < 8) duckPosition.x++;
    else if (duckPosition.y === 2 && duckPosition.x > 0) duckPosition.x--;
  }
}

function checkPosition() {
  if(duckPosition.y === victoryRow) endGame('duck-arrived');
  else if (contentBeforeDuck === 'river') endGame ('duck-drowned');
  else if (contentBeforeDuck === 'car' || contentBeforeDuck === 'bus')
    endGame('duck-hit');
}

// Game Win/loss Logic
function endGame (reason) {
  // victory
  if (reason === 'duck-arrived') {
    endGameText.innerHTML = 'YOU<br>WON!';
    endGameScreen.classList.add('win');
  }

  gridMatrix[duckPosition.y][duckPosition.x] = reason;

  // stop countdown timer
  clearInterval(countdownLoop);
  // stop game loop
  clearInterval(renderLoop);
  // stop player from controling duck
  document.removeEventListener('keyup', moveDuck);
  // display game over screen
  endGameScreen.classList.remove('hidden');
}

function countdown() {
  if (time !== 0) {
    time--;
    timer.innerText = time.toString().padStart(5, '0');
  }

  if (time === 0) {
    // end the game 
    endGame();
  }
}

function render() {
  placeDuck();
  checkPosition();
  drawGrid();
}

// anonymous function
const renderLoop = setInterval(function () {
  updateDuckPosition();
  animateGame();
  render();
}, 600);

const countdownLoop = setInterval(countdown, 1000);

document.addEventListener('keyup', moveDuck);
playAgainBtn.addEventListener('click', function () {
  location.reload();
});