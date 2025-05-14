// DOM Elements
const loginSection = document.getElementById('login-section');
const scoreSection = document.getElementById('score-section');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const userDisplay = document.getElementById('user-display');
const scoreDisplay = document.getElementById('score-display');
const incrementBtn = document.getElementById('increment-btn');
const decrementBtn = document.getElementById('decrement-btn');
const newScoreNameInput = document.getElementById('new-score-name');
const addScoreBtn = document.getElementById('add-score-btn');
const scoreboard = document.getElementById('scoreboard');

// State
let currentUser = null;
let currentScore = 0;
let scores = {};

// User credentials
const users = {
  'laba': 'larpingit',
  'test': 'test123'
};

// Event Listeners
loginBtn.addEventListener('click', handleLogin);
logoutBtn.addEventListener('click', handleLogout);
incrementBtn.addEventListener('click', () => updateScore(1));
decrementBtn.addEventListener('click', () => updateScore(-1));
addScoreBtn.addEventListener('click', addNewScore);

// Check if user is already logged in
const savedUser = localStorage.getItem('currentUser');
if (savedUser) {
  currentUser = savedUser;
  loadUserScore();
  showScoreSection();
}

// Load all scores from localStorage
function loadAllScores() {
  const savedScores = localStorage.getItem('ica_scores');
  scores = savedScores ? JSON.parse(savedScores) : {};
  updateScoreboard();
}

// Authentication Functions
function handleLogin() {
  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!username || !password) {
    alert('Please enter both username and password');
    return;
  }

  if (users[username] && users[username] === password) {
    currentUser = username;
    localStorage.setItem('currentUser', username);
    loadUserScore();
    loadAllScores();
    showScoreSection();
    resetInputs();
  } else {
    alert('Invalid username or password');
  }
}

function handleLogout() {
  currentUser = null;
  localStorage.removeItem('currentUser');
  showLoginSection();
  resetInputs();
}

// Score Functions
function loadUserScore() {
  const savedScore = localStorage.getItem(`score_${currentUser}`);
  currentScore = savedScore ? parseInt(savedScore) : 0;
  // Ensure rank is initialized
  if (!localStorage.getItem(`rank_${currentUser}`)) {
    localStorage.setItem(`rank_${currentUser}`, '0');
  }
  updateScoreDisplay();
}

function updateScore(change) {
  currentScore += change;
  
  if (currentScore < 0) currentScore = 0;
  
  if (currentScore >= 10) {
    let level = Math.floor(currentScore / 10);
    localStorage.setItem(`rank_${currentUser}`, (parseInt(localStorage.getItem(`rank_${currentUser}`) || '0') + level));
  } else if (currentScore <= 0) {
    localStorage.removeItem(`rank_${currentUser}`);
  }
  
  if (currentUser in scores) {
    if (currentScore > 0) {
      scores[currentUser] = currentScore;
    } else {
      delete scores[currentUser];
    }
    localStorage.setItem('ica_scores', JSON.stringify(scores));
  }
  
  if (currentScore > 0) {
    localStorage.setItem(`score_${currentUser}`, currentScore);
  } else {
    localStorage.removeItem(`score_${currentUser}`);
  }
  updateScoreDisplay();
}

function addNewScore() {
  const name = newScoreNameInput.value.trim();
  if (!name) return;

  scores[name] = (scores[name] || 0) + currentScore;
  
  // Remove entry if score is zero or negative
  if (scores[name] <= 0) {
    delete scores[name];
  }
  
  localStorage.setItem('ica_scores', JSON.stringify(scores));
  newScoreNameInput.value = '';
  updateScoreboard();
}

function updateScoreboard() {
  scoreboard.innerHTML = '';
  const sortedScores = Object.entries(scores)
    .filter(([, score]) => score > 0)
    .sort(([,a], [,b]) => b - a)
    .forEach(([name, score]) => {
      const rank = calculateRank(score);
      const scoreEntry = document.createElement('div');
      scoreEntry.className = 'score-entry';
      scoreEntry.innerHTML = `
        <span>${name}${rank ? ` [${rank}]` : ''}</span>
        <span>${score}</span>
        <button class="delete-btn" data-name="${name}">×</button>
      `;
      scoreEntry.querySelector('.delete-btn').addEventListener('click', () => deleteScoreEntry(name));
      scoreboard.appendChild(scoreEntry);
    });
}

function deleteScoreEntry(name) {
  delete scores[name];
  localStorage.removeItem(`score_${name}`);
  localStorage.removeItem(`rank_${name}`);
  localStorage.setItem('ica_scores', JSON.stringify(scores));
  updateScoreboard();
}

// UI Functions
function showLoginSection() {
  loginSection.classList.remove('hidden');
  scoreSection.classList.add('hidden');
}

function showScoreSection() {
  loginSection.classList.add('hidden');
  scoreSection.classList.remove('hidden');
  userDisplay.textContent = currentUser;
}

function calculateRank(score) {
  if (score >= 10) {
    const rank = Math.min(7, Math.floor(score / 10));
    return `A-${rank}`;
  }
  return '';
}

function updateScoreDisplay() {
  const rank = calculateRank(currentScore);
  scoreDisplay.textContent = `${currentScore} ${rank ? `[${rank}]` : ''}`;
}

function resetInputs() {
  usernameInput.value = '';
  passwordInput.value = '';
  newScoreNameInput.value = '';
}

// Initialize
loadAllScores();

// Function to decrease score
function decreaseScore(userId) {
  // Logic to decrease the score for the user with the given userId
}

// Function to remove user
function removeUser(userId) {
  // Logic to remove the user with the given userId from the scoreboard
}

// Add event listeners for the new buttons
const decrementButtons = document.querySelectorAll('.decrement-btn');
decrementButtons.forEach(button => {
  button.addEventListener('click', () => {
    const userId = button.dataset.userId;
    decreaseScore(userId);
  });
});

const deleteButtons = document.querySelectorAll('.delete-btn');
deleteButtons.forEach(button => {
  button.addEventListener('click', () => {
    const userId = button.dataset.userId;
    removeUser(userId);
  });
});