// DOM elements
const container = document.querySelector('.container');
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

// Initial theme (default to dark)
let isDark = true;

// Theme toggle functionality
themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  
  if (isDark) {
    body.classList.remove('light');
    body.classList.add('dark');
  } else {
    body.classList.remove('dark');
    body.classList.add('light');
  }
  
  // Update background after theme change
  updateBackground(lastMouseX, lastMouseY);
});

// Track mouse position
let lastMouseX = 0.5;
let lastMouseY = 0.5;

// Mouse movement effect for background
document.addEventListener('mousemove', (e) => {
  lastMouseX = e.clientX / window.innerWidth;
  lastMouseY = e.clientY / window.innerHeight;
  
  updateBackground(lastMouseX, lastMouseY);
});

// Update background based on mouse position
function updateBackground(x, y) {
  // Calculate dynamic background position based on mouse movement
  const bgPositionX = 50 + (x - 0.5) * 10;
  const bgPositionY = 50 + (y - 0.5) * 10;
  
  // Update the radial gradient position
  container.style.background = isDark 
    ? `radial-gradient(circle at ${bgPositionX}% ${bgPositionY}%, #2a1a3a 0%, #1f1f3a 25%, #1a1a2e 50%, #2d1a2e 75%, #3a1a2e 100%)`
    : `radial-gradient(circle at ${bgPositionX}% ${bgPositionY}%, #f0e7ff 0%, #dbeafe 25%, #e0f2fe 50%, #fce7f3 75%, #fbcfe8 100%)`;
}

// Initialize background
updateBackground(0.5, 0.5);

// Fix for Safari backdrop-filter
document.addEventListener('DOMContentLoaded', () => {
  // Check if backdrop-filter is supported
  const isBackdropFilterSupported = 'backdropFilter' in document.documentElement.style ||
                                   'webkitBackdropFilter' in document.documentElement.style;
  
  if (!isBackdropFilterSupported) {
    // If not supported, make the card background more opaque
    const card = document.querySelector('.card');
    if (isDark) {
      card.style.backgroundColor = 'rgba(26, 26, 46, 0.9)';
    } else {
      card.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    }
  }
});

setTimeout(() => {
    let img = document.createElement("img");
    img.src = "/download.png"; // Change path if needed
    img.alt = "ze guard";
    img.className = "corner-image";

    Object.assign(img.style, {
        position: "fixed",
        bottom: "-10px", // ⬇️ Moves it lower
        left: "0px",
        width: "180px", // 📏 Made slightly smaller
        height: "auto",
        zIndex: "9999999999",
        pointerEvents: "none",
        display: "block",
        filter: "none",
        opacity: "1",
        mixBlendMode: "normal",
        background: "none"
    });

    document.documentElement.appendChild(img); // Adds to the page
}, 1000);
