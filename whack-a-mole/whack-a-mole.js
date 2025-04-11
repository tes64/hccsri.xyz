// DOM elements
const container = document.querySelector(".container")
const themeToggle = document.querySelector(".theme-toggle")
const body = document.body
const startButton = document.getElementById("start-button")
const resetButton = document.getElementById("reset-button")
const homeButton = document.getElementById("home-button")
const difficultySelect = document.getElementById("difficulty")
const scoreDisplay = document.getElementById("score")
const timeDisplay = document.getElementById("time")
const gameOverModal = document.getElementById("game-over-modal")
const finalScoreDisplay = document.getElementById("final-score")
const playAgainButton = document.getElementById("play-again-button")
const holes = document.querySelectorAll(".hole")
const moles = document.querySelectorAll(".mole")
const soundToggle = document.getElementById("sound-toggle")

// Sound effects
const whackSound = document.getElementById("whack-sound")
const gameStartSound = document.getElementById("game-start-sound")
const gameOverSound = document.getElementById("game-over-sound")

// Set lower volume for the whack sound (0.3 = 30% volume)
whackSound.volume = 0.3

// Set volume for other sounds (slightly higher but still moderate)
gameStartSound.volume = 0.5
gameOverSound.volume = 0.5

// Sound state
let soundEnabled = true

// Game state
let score = 0
let timeLeft = 30
let gameTimer
let moleTimer
let isPlaying = false
let lastHole
const difficultySettings = {
  easy: {
    minTime: 1000,
    maxTime: 2000,
    gameTime: 40,
  },
  medium: {
    minTime: 700,
    maxTime: 1500,
    gameTime: 30,
  },
  hard: {
    minTime: 500,
    maxTime: 1200,
    gameTime: 20,
  },
}

// Initial theme (default to dark)
let isDark = true

// Theme toggle functionality
themeToggle.addEventListener("click", () => {
  isDark = !isDark

  if (isDark) {
    body.classList.remove("light")
    body.classList.add("dark")
  } else {
    body.classList.remove("dark")
    body.classList.add("light")
  }

  // Update background after theme change
  updateBackground(lastMouseX, lastMouseY)
})

// Sound toggle functionality
soundToggle.addEventListener("click", () => {
  soundEnabled = !soundEnabled
  soundToggle.textContent = soundEnabled ? "🔊" : "🔇"
})

// Track mouse position
let lastMouseX = 0.5
let lastMouseY = 0.5

// Mouse movement effect for background
document.addEventListener("mousemove", (e) => {
  lastMouseX = e.clientX / window.innerWidth
  lastMouseY = e.clientY / window.innerHeight

  updateBackground(lastMouseX, lastMouseY)
})

// Update background based on mouse position
function updateBackground(x, y) {
  // Calculate dynamic background position based on mouse movement
  const bgPositionX = 50 + (x - 0.5) * 10
  const bgPositionY = 50 + (y - 0.5) * 10

  // Update the radial gradient position
  container.style.background = isDark
    ? `radial-gradient(circle at ${bgPositionX}% ${bgPositionY}%, #2a1a3a 0%, #1f1f3a 25%, #1a1a2e 50%, #2d1a2e 75%, #3a1a2e 100%)`
    : `radial-gradient(circle at ${bgPositionX}% ${bgPositionY}%, #f0e7ff 0%, #dbeafe 25%, #e0f2fe 50%, #fce7f3 75%, #fbcfe8 100%)`
}

// Initialize background
updateBackground(0.5, 0.5)

// Play sound with check for sound enabled
function playSound(sound) {
  if (soundEnabled) {
    sound.currentTime = 0
    sound.play().catch((e) => console.log("Audio play failed:", e))
  }
}

// Game functions
function startGame() {
  if (isPlaying) return

  // Reset game state
  score = 0
  scoreDisplay.textContent = score

  // Set time based on difficulty
  const difficulty = difficultySelect.value
  timeLeft = difficultySettings[difficulty].gameTime
  timeDisplay.textContent = timeLeft

  // Hide game over modal if visible
  gameOverModal.classList.add("hidden")

  // Play start sound
  playSound(gameStartSound)

  // Start the game
  isPlaying = true
  startButton.textContent = "Running"
  startButton.disabled = true

  // Start timers
  gameTimer = setInterval(updateTimer, 1000)
  popMole()
}

function updateTimer() {
  timeLeft--
  timeDisplay.textContent = timeLeft

  if (timeLeft <= 0) {
    endGame()
  }
}

function endGame() {
  isPlaying = false
  clearInterval(gameTimer)
  clearTimeout(moleTimer)

  // Reset all holes
  holes.forEach((hole) => {
    hole.classList.remove("up")
    hole.classList.remove("bonked")
  })

  // Update UI
  startButton.textContent = "Start"
  startButton.disabled = false

  // Play game over sound
  playSound(gameOverSound)

  // Show game over modal
  finalScoreDisplay.textContent = score
  gameOverModal.classList.remove("hidden")
}

function resetGame() {
  // Stop the game if it's running
  if (isPlaying) {
    clearInterval(gameTimer)
    clearTimeout(moleTimer)
    isPlaying = false
  }

  // Reset game state
  score = 0
  scoreDisplay.textContent = score

  const difficulty = difficultySelect.value
  timeLeft = difficultySettings[difficulty].gameTime
  timeDisplay.textContent = timeLeft

  // Reset UI
  startButton.textContent = "Start"
  startButton.disabled = false

  // Reset all holes
  holes.forEach((hole) => {
    hole.classList.remove("up")
    hole.classList.remove("bonked")
  })

  // Hide game over modal if visible
  gameOverModal.classList.add("hidden")
}

function getRandomHole() {
  const index = Math.floor(Math.random() * holes.length)
  const hole = holes[index]

  // Don't pick the same hole twice in a row
  if (hole === lastHole) {
    return getRandomHole()
  }

  lastHole = hole
  return hole
}

function getRandomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min)
}

function popMole() {
  if (!isPlaying) return

  const difficulty = difficultySelect.value
  const minTime = difficultySettings[difficulty].minTime
  const maxTime = difficultySettings[difficulty].maxTime

  const time = getRandomTime(minTime, maxTime)
  const hole = getRandomHole()

  // Make the mole pop up
  hole.classList.add("up")

  // Hide the mole after a random time
  moleTimer = setTimeout(() => {
    hole.classList.remove("up")
    hole.classList.remove("bonked")
    if (isPlaying) popMole()
  }, time)
}

function whack(e) {
  if (!isPlaying) return
  

  // Check if the hole is already bonked
  if (this.classList.contains("bonked")) return

  // Only count the whack if the mole is up
  if (this.classList.contains("up")) {
    this.classList.add("bonked")
    score++
    scoreDisplay.textContent = score

    // Play whack sound at reduced volume
    playSound(whackSound)
  }
}

// Event listeners
startButton.addEventListener("click", startGame)
resetButton.addEventListener("click", resetGame)
playAgainButton.addEventListener("click", startGame)
homeButton.addEventListener("click", () => {
  window.location.href = "index.html"
})

// Add event listeners to each hole
holes.forEach((hole) => {
  hole.addEventListener("click", whack)
  hole.addEventListener("touchstart", whack, { passive: true })
})

// Keyboard sequence detection for KJ Flex
let typedKeys = ""
const targetSequence = "kj flex"

document.addEventListener("keydown", (e) => {
  // Add the pressed key to the sequence
  typedKeys += e.key.toLowerCase()

  // Only keep the last 7 characters (length of "kj flex")
  if (typedKeys.length > targetSequence.length) {
    typedKeys = typedKeys.substring(typedKeys.length - targetSequence.length)
  }

  // Check if the typed sequence matches "kj flex"
  if (typedKeys === targetSequence) {
    playKjFlexVideo()
    // Reset the typed keys
    typedKeys = ""
  }
})

function playKjFlexVideo() {
  const videoContainer = document.getElementById("video-container")
  const kjFlexVideo = document.getElementById("kj-flex-video")

  // Show the video container
  videoContainer.classList.add("visible")

  // Reset video to beginning
  kjFlexVideo.currentTime = 0

  // Remove any existing fade-out class
  kjFlexVideo.classList.remove("fade-out-animation")
  kjFlexVideo.classList.remove("fade-out")

  // Play the video
  const playPromise = kjFlexVideo.play()

  // Handle play promise (required for some browsers)
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        // Video started playing successfully
        // Set up timeupdate listener for fade-out
        kjFlexVideo.addEventListener("timeupdate", handleVideoTimeUpdate)
      })
      .catch((error) => {
        console.error("Error playing video:", error)
      })
  }
}

function handleVideoTimeUpdate() {
  const kjFlexVideo = document.getElementById("kj-flex-video")
  const videoContainer = document.getElementById("video-container")

  // If video is near the end (last 2 seconds), start fade out
  if (kjFlexVideo.duration - kjFlexVideo.currentTime <= 2) {
    kjFlexVideo.classList.add("fade-out")
    kjFlexVideo.classList.add("fade-out-animation")
  }
}

// When video ends, hide the container and clean up
function videoEnded() {
  const videoContainer = document.getElementById("video-container")
  const kjFlexVideo = document.getElementById("kj-flex-video")

  // Hide the video container
  videoContainer.classList.remove("visible")

  // Remove the timeupdate event listener to avoid memory leaks
  kjFlexVideo.removeEventListener("timeupdate", handleVideoTimeUpdate)
}

// Add event listener for video end
document.getElementById("kj-flex-video").addEventListener("ended", videoEnded)

// Initialize the game
updateBackground(0.5, 0.5)

