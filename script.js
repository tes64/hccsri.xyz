// DOM elements
const container = document.querySelector(".container")
const themeToggle = document.querySelector(".theme-toggle")
const body = document.body

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

// Fix for Safari backdrop-filter
document.addEventListener("DOMContentLoaded", () => {
  // Check if backdrop-filter is supported
  const isBackdropFilterSupported =
    "backdropFilter" in document.documentElement.style || "webkitBackdropFilter" in document.documentElement.style

  if (!isBackdropFilterSupported) {
    // If not supported, make the card background more opaque
    const card = document.querySelector(".card")
    if (isDark) {
      card.style.backgroundColor = "rgba(26, 26, 46, 0.9)"
    } else {
      card.style.backgroundColor = "rgba(255, 255, 255, 0.9)"
    }
  }
})

// Add corner image
setTimeout(() => {
  const img = document.createElement("img")
  img.src = "images/download.png" // Change path if needed
  img.alt = "ze guard"
  img.className = "corner-image"

  Object.assign(img.style, {
    position: "fixed",
    bottom: "-10px",
    left: "0px",
    width: "180px",
    height: "auto",
    zIndex: "9999999999",
    pointerEvents: "none",
    display: "block",
    filter: "none",
    opacity: "1",
    mixBlendMode: "normal",
    background: "none",
  })

  document.documentElement.appendChild(img)
}, 1000)

// =============== REVAMPED MP3 PLAYER FUNCTIONALITY ===============

document.addEventListener("DOMContentLoaded", () => {
  // Common Elements
  const audioPlayer = document.getElementById("audio-player")

  // Desktop Player Elements
  const mp3Container = document.getElementById("mp3-container")
  const toggleMp3 = document.getElementById("toggle-mp3")
  const songName = document.getElementById("song-name")
  const artistName = document.getElementById("artist-name")
  const playPauseBtn = document.getElementById("play-pause")
  const playIcon = document.getElementById("play-icon")
  const pauseIcon = document.getElementById("pause-icon")
  const prevBtn = document.getElementById("prev-btn")
  const nextBtn = document.getElementById("next-btn")
  const loopBtn = document.getElementById("loop-btn")
  const shuffleBtn = document.getElementById("shuffle-btn")
  const muteBtn = document.getElementById("mute-btn")
  const volumeIcon = document.getElementById("volume-icon")
  const muteIcon = document.getElementById("mute-icon")
  const progressBar = document.getElementById("progress-bar")
  const seekSlider = document.getElementById("seek-slider")
  const currentTimeEl = document.getElementById("current-time")
  const durationEl = document.getElementById("duration")
  const volumeSlider = document.getElementById("volume-slider")
  const volumeLevel = document.getElementById("volume-level")
  const volumePercent = document.getElementById("volume-percent")
  const playlist = document.getElementById("playlist")
  const vinylRecord = document.querySelector(".vinyl-record")

  // Mobile Player Elements
  const mobileMusicBtn = document.getElementById("mobile-music-btn")
  const mobilePlayerOverlay = document.getElementById("mobile-player-overlay")
  const mobileCloseBtn = document.getElementById("mobile-close-btn")
  const mobilePlaylistBtn = document.getElementById("mobile-playlist-btn")
  const mobileSongName = document.getElementById("mobile-song-name")
  const mobileArtistName = document.getElementById("mobile-artist-name")
  const mobilePlayPauseBtn = document.getElementById("mobile-play-pause")
  const mobilePlayIcon = document.getElementById("mobile-play-icon")
  const mobilePauseIcon = document.getElementById("mobile-pause-icon")
  const mobilePrevBtn = document.getElementById("mobile-prev-btn")
  const mobileNextBtn = document.getElementById("mobile-next-btn")
  const mobileLoopBtn = document.getElementById("mobile-loop-btn")
  const mobileShuffleBtn = document.getElementById("mobile-shuffle-btn")
  const mobileProgressBar = document.getElementById("mobile-progress-bar")
  const mobileSeekSlider = document.getElementById("mobile-seek-slider")
  const mobileCurrentTimeEl = document.getElementById("mobile-current-time")
  const mobileDurationEl = document.getElementById("mobile-duration")
  const mobilePlaylist = document.getElementById("mobile-playlist-items")
  const mobileVinylRecord = document.querySelector(".mobile-vinyl-record")
  const mobileNowPlaying = document.querySelector(".mobile-now-playing")
  const mobilePlaylistContainer = document.querySelector(".mobile-playlist")

  // Player state
  let songs = []
  let currentIndex = 0
  let isPlaying = false
  let isLooping = false
  let isShuffle = false
  let isMuted = false
  let shuffledIndices = []
  let isMobilePlaylistVisible = false

  // Audio visualization
  let audioContext
  let analyser
  let dataArray
  let source
  let animationId
  let isVisualizationActive = false
  const visualizationCanvas = document.getElementById("visualization-canvas")
  const visualizationCtx = visualizationCanvas.getContext("2d")
  const blobs = document.querySelectorAll(".blob")

  // Toggle Desktop MP3 player visibility
  toggleMp3.addEventListener("click", () => {
    mp3Container.classList.toggle("active")
  })

  // Mobile player controls
  mobileMusicBtn.addEventListener("click", () => {
    mobilePlayerOverlay.classList.remove("hidden")
    document.body.style.overflow = "hidden" // Prevent scrolling
  })

  mobileCloseBtn.addEventListener("click", () => {
    mobilePlayerOverlay.classList.add("hidden")
    document.body.style.overflow = "" // Re-enable scrolling
  })

  mobilePlaylistBtn.addEventListener("click", () => {
    isMobilePlaylistVisible = !isMobilePlaylistVisible
    if (isMobilePlaylistVisible) {
      mobileNowPlaying.classList.add("hidden")
      mobilePlaylistContainer.classList.remove("hidden")
    } else {
      mobileNowPlaying.classList.remove("hidden")
      mobilePlaylistContainer.classList.add("hidden")
    }
  })

  // Allow dragging the mobile player handle to close
  const playerHandle = document.querySelector(".mobile-player-handle")
  let startY = 0
  let currentY = 0

  playerHandle.addEventListener("touchstart", (e) => {
    startY = e.touches[0].clientY
  })

  playerHandle.addEventListener("touchmove", (e) => {
    currentY = e.touches[0].clientY
    const deltaY = currentY - startY

    if (deltaY > 0) {
      // Only allow dragging down
      const mobilePlayer = document.getElementById("mobile-player")
      mobilePlayer.style.transform = `translateY(${deltaY}px)`
    }
  })

  playerHandle.addEventListener("touchend", () => {
    const deltaY = currentY - startY
    const mobilePlayer = document.getElementById("mobile-player")

    if (deltaY > 100) {
      // If dragged down more than 100px, close the player
      mobilePlayerOverlay.classList.add("hidden")
      document.body.style.overflow = ""
    }

    mobilePlayer.style.transform = "" // Reset transform
  })

  // Format time in MM:SS
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  // Set up audio visualization
  function setupAudioVisualization() {
    // Create audio context if it doesn't exist
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)()
      analyser = audioContext.createAnalyser()
      analyser.fftSize = 256

      // Connect the audio element to the analyser
      source = audioContext.createMediaElementSource(audioPlayer)
      source.connect(analyser)
      analyser.connect(audioContext.destination)

      // Create data array for frequency data
      dataArray = new Uint8Array(analyser.frequencyBinCount)

      // Add reactive class to blobs
      blobs.forEach((blob) => {
        blob.classList.add("react-to-music")
      })

      // Set up canvas size
      resizeCanvas()
      window.addEventListener("resize", resizeCanvas)

      isVisualizationActive = true
    }

    // Start visualization
    if (!animationId) {
      animateVisualization()
    }
  }

  // Resize canvas to match window size
  function resizeCanvas() {
    visualizationCanvas.width = window.innerWidth
    visualizationCanvas.height = window.innerHeight
  }

  // Animate the visualization
  function animateVisualization() {
    animationId = requestAnimationFrame(animateVisualization)

    // Get frequency data
    analyser.getByteFrequencyData(dataArray)

    // Clear canvas
    visualizationCtx.clearRect(0, 0, visualizationCanvas.width, visualizationCanvas.height)

    // Only draw visualization if music is playing
    if (isPlaying) {
      // Draw visualization
      drawVisualization()

      // Make blobs react to music
      animateBlobs()
    }
  }

  // Draw visualization on canvas
  function drawVisualization() {
    const centerX = visualizationCanvas.width / 2
    const centerY = visualizationCanvas.height / 2
    const radius = Math.min(visualizationCanvas.width, visualizationCanvas.height) * 0.3

    // Draw circular visualization
    visualizationCtx.beginPath()
    visualizationCtx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    visualizationCtx.strokeStyle = isDark ? "rgba(255, 107, 193, 0.2)" : "rgba(255, 26, 139, 0.2)"
    visualizationCtx.lineWidth = 2
    visualizationCtx.stroke()

    // Draw frequency bars
    const barCount = 64 // Number of bars to display
    const step = Math.floor(dataArray.length / barCount)

    for (let i = 0; i < barCount; i++) {
      const value = dataArray[i * step]
      const percent = value / 255
      const barHeight = radius * 0.8 * percent
      const angle = (i / barCount) * Math.PI * 2

      const x1 = centerX + Math.cos(angle) * radius
      const y1 = centerY + Math.sin(angle) * radius
      const x2 = centerX + Math.cos(angle) * (radius + barHeight)
      const y2 = centerY + Math.sin(angle) * (radius + barHeight)

      visualizationCtx.beginPath()
      visualizationCtx.moveTo(x1, y1)
      visualizationCtx.lineTo(x2, y2)

      // Create gradient based on frequency
      const gradient = visualizationCtx.createLinearGradient(x1, y1, x2, y2)
      gradient.addColorStop(0, `rgba(255, 107, 193, ${percent * 0.8})`)
      gradient.addColorStop(1, `rgba(147, 51, 234, ${percent * 0.8})`)

      visualizationCtx.strokeStyle = gradient
      visualizationCtx.lineWidth = 3
      visualizationCtx.stroke()
    }
  }

  // Animate blobs based on audio frequency
  function animateBlobs() {
    // Get average frequency values for low, mid, and high ranges
    const lowFreq = getAverageFrequency(0, 10)
    const midFreq = getAverageFrequency(10, 30)
    const highFreq = getAverageFrequency(30, 50)

    // Animate each blob with different frequency ranges
    if (blobs[0]) {
      const scale = 1 + (lowFreq / 255) * 0.3
      blobs[0].style.transform = `scale(${scale})`
      blobs[0].style.filter = `blur(${60 + (lowFreq / 255) * 20}px)`
    }

    if (blobs[1]) {
      const scale = 1 + (midFreq / 255) * 0.3
      blobs[1].style.transform = `scale(${scale})`
      blobs[1].style.filter = `blur(${60 + (midFreq / 255) * 20}px)`
    }

    if (blobs[2]) {
      const scale = 1 + (highFreq / 255) * 0.3
      blobs[2].style.transform = `scale(${scale})`
      blobs[2].style.filter = `blur(${60 + (highFreq / 255) * 20}px)`
    }
  }

  // Get average frequency in a range
  function getAverageFrequency(start, end) {
    let sum = 0
    for (let i = start; i < end; i++) {
      sum += dataArray[i]
    }
    return sum / (end - start)
  }

  // Fetch song list
  function loadSongs() {
    fetch("/mp3-list.json")
      .then((response) => response.json())
      .then((data) => {
        songs = data
        renderPlaylist()
        if (songs.length > 0) {
          loadSong(0)
        }
      })
      .catch((error) => {
        console.error("Error loading MP3 list:", error)
        songName.textContent = "Error loading songs"
        mobileSongName.textContent = "Error loading songs"
      })
  }

  // Load a specific song
  function loadSong(index) {
    if (!songs.length) return

    // Update desktop playlist active item
    const playlistItems = playlist.querySelectorAll("li")
    playlistItems.forEach((item) => item.classList.remove("active"))
    if (playlistItems[index]) {
      playlistItems[index].classList.add("active")
    }

    // Update mobile playlist active item
    const mobilePlaylistItems = mobilePlaylist.querySelectorAll("li")
    mobilePlaylistItems.forEach((item) => item.classList.remove("active"))
    if (mobilePlaylistItems[index]) {
      mobilePlaylistItems[index].classList.add("active")
    }

    currentIndex = index
    const song = songs[currentIndex]

    audioPlayer.src = song.file

    // Update desktop player
    songName.textContent = song.title
    artistName.textContent = song.artist
    progressBar.style.width = "0%"
    currentTimeEl.textContent = "0:00"

    // Update mobile player
    mobileSongName.textContent = song.title
    mobileArtistName.textContent = song.artist
    mobileProgressBar.style.width = "0%"
    mobileCurrentTimeEl.textContent = "0:00"

    // Update album art if available
    const albumImage = document.getElementById("album-image")
    const mobileAlbumImage = document.getElementById("mobile-album-image")

    if (song.image) {
      albumImage.src = song.image
      mobileAlbumImage.src = song.image
      albumImage.style.display = "block"
      mobileAlbumImage.style.display = "block"
    } else {
      albumImage.src = "/placeholder.svg?height=180&width=180"
      mobileAlbumImage.src = "/placeholder.svg?height=200&width=200"
    }

    // Update duration after metadata is loaded
    audioPlayer.addEventListener("loadedmetadata", () => {
      // Desktop
      durationEl.textContent = formatTime(audioPlayer.duration)
      seekSlider.max = Math.floor(audioPlayer.duration)

      // Mobile
      mobileDurationEl.textContent = formatTime(audioPlayer.duration)
      mobileSeekSlider.max = Math.floor(audioPlayer.duration)
    })

    // Setup audio visualization if not already set up
    if (!isVisualizationActive) {
      setupAudioVisualization()
    }
  }

  // Render playlist for both desktop and mobile
  function renderPlaylist() {
    // Desktop playlist
    playlist.innerHTML = ""

    // Mobile playlist
    mobilePlaylist.innerHTML = ""

    songs.forEach((song, index) => {
      // Desktop playlist item
      const li = document.createElement("li")
      li.innerHTML = `
        <span class="song-title">${song.title}</span>
        <span class="song-artist">${song.artist}</span>
      `
      li.addEventListener("click", () => {
        loadSong(index)
        playSong()
      })
      if (index === currentIndex) {
        li.classList.add("active")
      }
      playlist.appendChild(li)

      // Mobile playlist item
      const mobileLi = document.createElement("li")
      mobileLi.innerHTML = `
        <span class="song-title">${song.title}</span>
        <span class="song-artist">${song.artist}</span>
      `
      mobileLi.addEventListener("click", () => {
        loadSong(index)
        playSong()
        // Switch back to now playing view
        isMobilePlaylistVisible = false
        mobileNowPlaying.classList.remove("hidden")
        mobilePlaylistContainer.classList.add("hidden")
      })
      if (index === currentIndex) {
        mobileLi.classList.add("active")
      }
      mobilePlaylist.appendChild(mobileLi)
    })
  }

  // Play the current song
  function playSong() {
    // Resume audio context if it's suspended (needed for browsers that block autoplay)
    if (audioContext && audioContext.state === "suspended") {
      audioContext.resume()
    }

    audioPlayer
      .play()
      .then(() => {
        isPlaying = true

        // Update desktop player
        playIcon.classList.add("hidden")
        pauseIcon.classList.remove("hidden")
        vinylRecord.classList.add("playing")

        // Update mobile player
        mobilePlayIcon.classList.add("hidden")
        mobilePauseIcon.classList.remove("hidden")
        mobileVinylRecord.classList.add("playing")
      })
      .catch((error) => {
        console.error("Error playing audio:", error)
      })
  }

  // Pause the current song
  function pauseSong() {
    audioPlayer.pause()
    isPlaying = false

    // Update desktop player
    playIcon.classList.remove("hidden")
    pauseIcon.classList.add("hidden")
    vinylRecord.classList.remove("playing")

    // Update mobile player
    mobilePlayIcon.classList.remove("hidden")
    mobilePauseIcon.classList.add("hidden")
    mobileVinylRecord.classList.remove("playing")
  }

  // Generate shuffled indices
  function shuffleIndices() {
    shuffledIndices = Array.from({ length: songs.length }, (_, i) => i)
    // Fisher-Yates shuffle algorithm
    for (let i = shuffledIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffledIndices[i], shuffledIndices[j]] = [shuffledIndices[j], shuffledIndices[i]]
    }
  }

  // Get next song index based on shuffle and loop settings
  function getNextIndex() {
    if (isShuffle) {
      if (!shuffledIndices.length) {
        shuffleIndices()
      }
      const currentShuffleIndex = shuffledIndices.indexOf(currentIndex)
      const nextShuffleIndex = (currentShuffleIndex + 1) % shuffledIndices.length
      return shuffledIndices[nextShuffleIndex]
    } else {
      return (currentIndex + 1) % songs.length
    }
  }

  // Get previous song index based on shuffle and loop settings
  function getPrevIndex() {
    if (isShuffle) {
      if (!shuffledIndices.length) {
        shuffleIndices()
      }
      const currentShuffleIndex = shuffledIndices.indexOf(currentIndex)
      const prevShuffleIndex = (currentShuffleIndex - 1 + shuffledIndices.length) % shuffledIndices.length
      return shuffledIndices[prevShuffleIndex]
    } else {
      return (currentIndex - 1 + songs.length) % songs.length
    }
  }

  // Desktop Play/Pause button
  playPauseBtn.addEventListener("click", () => {
    if (isPlaying) {
      pauseSong()
    } else {
      playSong()
    }
  })

  // Mobile Play/Pause button
  mobilePlayPauseBtn.addEventListener("click", () => {
    if (isPlaying) {
      pauseSong()
    } else {
      playSong()
    }
  })

  // Desktop Next button
  nextBtn.addEventListener("click", () => {
    loadSong(getNextIndex())
    if (isPlaying) {
      playSong()
    }
  })

  // Mobile Next button
  mobileNextBtn.addEventListener("click", () => {
    loadSong(getNextIndex())
    if (isPlaying) {
      playSong()
    }
  })

  // Desktop Previous button
  prevBtn.addEventListener("click", () => {
    loadSong(getPrevIndex())
    if (isPlaying) {
      playSong()
    }
  })

  // Mobile Previous button
  mobilePrevBtn.addEventListener("click", () => {
    loadSong(getPrevIndex())
    if (isPlaying) {
      playSong()
    }
  })

  // Desktop Loop toggle
  loopBtn.addEventListener("click", () => {
    isLooping = !isLooping
    audioPlayer.loop = isLooping
    loopBtn.classList.toggle("active", isLooping)
    mobileLoopBtn.classList.toggle("active", isLooping)
  })

  // Mobile Loop toggle
  mobileLoopBtn.addEventListener("click", () => {
    isLooping = !isLooping
    audioPlayer.loop = isLooping
    loopBtn.classList.toggle("active", isLooping)
    mobileLoopBtn.classList.toggle("active", isLooping)
  })

  // Desktop Shuffle toggle
  shuffleBtn.addEventListener("click", () => {
    isShuffle = !isShuffle
    shuffleBtn.classList.toggle("active", isShuffle)
    mobileShuffleBtn.classList.toggle("active", isShuffle)
    if (isShuffle) {
      shuffleIndices()
    }
  })

  // Mobile Shuffle toggle
  mobileShuffleBtn.addEventListener("click", () => {
    isShuffle = !isShuffle
    shuffleBtn.classList.toggle("active", isShuffle)
    mobileShuffleBtn.classList.toggle("active", isShuffle)
    if (isShuffle) {
      shuffleIndices()
    }
  })

  // Desktop Mute toggle
  muteBtn.addEventListener("click", () => {
    isMuted = !isMuted
    audioPlayer.muted = isMuted

    if (isMuted) {
      volumeIcon.classList.add("hidden")
      muteIcon.classList.remove("hidden")
    } else {
      volumeIcon.classList.remove("hidden")
      muteIcon.classList.add("hidden")
    }
  })

  // Update progress as song plays
  audioPlayer.addEventListener("timeupdate", () => {
    if (audioPlayer.duration) {
      const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100

      // Update desktop progress
      progressBar.style.width = `${percent}%`
      currentTimeEl.textContent = formatTime(audioPlayer.currentTime)
      seekSlider.value = audioPlayer.currentTime

      // Update mobile progress
      mobileProgressBar.style.width = `${percent}%`
      mobileCurrentTimeEl.textContent = formatTime(audioPlayer.currentTime)
      mobileSeekSlider.value = audioPlayer.currentTime
    }
  })

  // Desktop seek
  seekSlider.addEventListener("input", () => {
    audioPlayer.currentTime = seekSlider.value
  })

  // Mobile seek
  mobileSeekSlider.addEventListener("input", () => {
    audioPlayer.currentTime = mobileSeekSlider.value
  })

  // Volume control
  volumeSlider.addEventListener("input", () => {
    const volume = volumeSlider.value / 100
    audioPlayer.volume = volume
    volumeLevel.style.width = `${volumeSlider.value}%`
    volumePercent.textContent = `${volumeSlider.value}%`

    // Update mute state based on volume
    if (volume === 0) {
      isMuted = true
      volumeIcon.classList.add("hidden")
      muteIcon.classList.remove("hidden")
    } else if (isMuted) {
      isMuted = false
      volumeIcon.classList.remove("hidden")
      muteIcon.classList.add("hidden")
    }
  })

  // Auto-play next when song ends
  audioPlayer.addEventListener("ended", () => {
    if (!isLooping) {
      loadSong(getNextIndex())
      playSong()
    }
  })

  // Initialize volume
  audioPlayer.volume = volumeSlider.value / 100
  volumeLevel.style.width = `${volumeSlider.value}%`

  // Load songs on page load
  loadSongs()

  // Clean up audio visualization when page is unloaded
  window.addEventListener("beforeunload", () => {
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
    if (audioContext) {
      audioContext.close()
    }
  })
})

// Add this code to the end of your existing script.js file

document.addEventListener("DOMContentLoaded", () => {
  // Existing code...

  // KJ Flex Video Functionality
  const videoContainer = document.getElementById("video-container")
  const kjFlexVideo = document.getElementById("kj-flex-video")

  // Keyboard sequence detection
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
    // If video is near the end (last 2 seconds), start fade out
    if (kjFlexVideo.duration - kjFlexVideo.currentTime <= 2) {
      kjFlexVideo.classList.add("fade-out")
      kjFlexVideo.classList.add("fade-out-animation")
    }
  }

  // When video ends, hide the container and clean up
  kjFlexVideo.addEventListener("ended", () => {
    // Hide the video container
    videoContainer.classList.remove("visible")

    // Remove the timeupdate event listener to avoid memory leaks
    kjFlexVideo.removeEventListener("timeupdate", handleVideoTimeUpdate)
  })
})


