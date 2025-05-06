// Get references to elements in the HTML
const box = document.getElementById('box');
const gameArea = document.getElementById('gameArea');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const countdownEl = document.getElementById('countdown');
const scoreList = document.getElementById('scoreList');

// Game state variables
let score = 0;
let timeLeft = 20;
let gameTimer;
let moveTimer;
let moveSpeed = 1500; // Starting movement speed (milliseconds between moves)

// Moves the box to a random position within the game area
function randomPosition() {
  const maxX = gameArea.clientWidth - box.offsetWidth;
  const maxY = gameArea.clientHeight - box.offsetHeight;
  const x = Math.floor(Math.random() * maxX);
  const y = Math.floor(Math.random() * maxY);
  box.style.left = `${x}px`;
  box.style.top = `${y}px`;
}

// Shows a countdown before the game starts, then calls the callback
function startCountdown(callback) {
  let count = 3;
  countdownEl.style.display = 'block';
  countdownEl.textContent = count;

  const countdown = setInterval(() => {
    count--;
    if (count > 0) {
      countdownEl.textContent = count;
    } else {
      clearInterval(countdown);
      countdownEl.textContent = 'GO!';
      setTimeout(() => {
        countdownEl.style.display = 'none';
        callback(); // Start the game
      }, 600);
    }
  }, 1000);
}

// Starts the game: resets variables, starts timers, and shows the box
function startGame() {
  score = 0;
  timeLeft = 20;
  scoreDisplay.textContent = 'Score: 0';
  timerDisplay.textContent = 'Time: 20';
  startBtn.disabled = true;
  box.style.display = 'block';
  randomPosition();

  moveSpeed = 1500; // Reset speed at game start
  moveTimer = setInterval(randomPosition, moveSpeed); // Move box at intervals

  // Countdown game timer
  gameTimer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time: ${timeLeft}`;

    // Speed up the box at certain intervals
    if (timeLeft === 15) resetMoveInterval(1200);
    if (timeLeft === 10) resetMoveInterval(1000);
    if (timeLeft === 5) resetMoveInterval(800);

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

// Resets the interval that moves the box to a new, faster speed
function resetMoveInterval(newSpeed) {
  clearInterval(moveTimer);
  moveSpeed = newSpeed;
  moveTimer = setInterval(randomPosition, moveSpeed);
}

// Ends the game: stops timers, hides box, shows alert, updates high scores
function endGame() {
  clearInterval(gameTimer);
  clearInterval(moveTimer);
  box.style.display = 'none';
  startBtn.disabled = false;
  alert(`Game over! Your score: ${score}`);
  saveHighScore(score);
  updateHighScoreDisplay();
}

// Called when the user clicks/taps the box: increases score, moves box
function handleBoxClick() {
  score++;
  scoreDisplay.textContent = `Score: ${score}`;
  randomPosition();
}

// Event listeners for clicking/tapping the box
box.addEventListener('click', handleBoxClick);
box.addEventListener('touchstart', function(e) {
  e.preventDefault(); // Prevents duplicate touch behavior
  handleBoxClick();
});

// Starts the game when the "Start Game" button is clicked
startBtn.addEventListener('click', () => {
  startCountdown(startGame);
});

// Saves a new high score to localStorage, keeping only top 5
function saveHighScore(newScore) {
  let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  highScores.push(newScore);
  highScores.sort((a, b) => b - a); // Sort descending
  highScores = highScores.slice(0, 5); // Keep top 5
  localStorage.setItem('highScores', JSON.stringify(highScores));
}

// Displays the high scores in the list
function updateHighScoreDisplay() {
  const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  scoreList.innerHTML = '';
  highScores.forEach((s, index) => {
    const li = document.createElement('li');
    li.textContent = `#${index + 1} - ${s} clicks`;
    scoreList.appendChild(li);
  });
}

// Initialize high score list on page load
updateHighScoreDisplay();