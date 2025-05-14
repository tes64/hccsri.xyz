// Add corner image
setTimeout(() => {
  const img = document.createElement("img")
  img.src = "../images/download.png" // Change path if needed
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
