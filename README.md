# 🎵 PulseBeat — Modern Web Music Player
> **CodeSoft Web Development Internship — Task 4**  
> A stylish, responsive, and feature-rich Web Audio Player built with modern HTML5, CSS3, and ES6 JavaScript.

---

## 🚀 Live Host Link
The application is hosted locally and ready to view in your web browser:
🔗 **[http://localhost:5173](http://localhost:5173)**

---

## ✨ Features & Architecture

### 1. 🎨 Modern Design & Glassmorphism Aesthetic
- **Dark Theme:** Deep near-black background (`#090b11`) with subtle radial ambient glows and violet/cyan gradient highlights.
- **Glassmorphism Panels:** Translucent cards with `backdrop-filter: blur(20px)` and soft borders (`rgba(255, 255, 255, 0.08)`).
- **Typography:** Modern Google Fonts (`Inter` for crisp body copy and `Outfit` for display headings).
- **Smooth Micro-Interactions:** Hover transitions, pulsating play buttons, glowing focus rings, and marquee animations for long track titles.

### 2. 🎛️ Complete Playback Engine (HTML5 Audio API)
- **Audio Lifecycle Management:** Fully synchronized with `timeupdate`, `loadedmetadata`, `play`, `pause`, `ended`, and `error` events.
- **Precision Seeking:** Smooth draggable and clickable range slider with live timestamp tooltip on hover.
- **Volume & Mute Control:** Volume range slider with dynamic gradient fill and 3-state icon (High, Low, Muted) with previous level restoration.
- **Track Metadata:** Real-time synchronization of album artwork, song title, artist, album, and duration.

### 3. 📚 Smart Library & Playlist Management
- **10 Curated Tracks:** Sample library featuring Synthwave, Electronic, Ambient, and Acoustic royalty-free music.
- **Live Search Filter:** Instant search by title, artist, or album with clear button and empty-state messaging.
- **Genre Filter Pills:** One-click filtering by "All", "Electronic", "Synthwave", "Ambient", and "Acoustic & Piano".
- **Recently Played:** Dynamically tracks listening history (most recent first).
- **Favorites Section:** Click the heart icon on any track row, card, or player bar to add or remove favorites.

### 4. 🌟 Bonus Advanced Features
- **Smart Shuffle Mode:** Randomly selects next tracks without immediately repeating the active track.
- **3-State Repeat Mode:** Cycles smoothly between **Repeat Off**, **Repeat All**, and **Repeat One** (with visible badge indicator).
- **Autoplay Progression:** Seamlessly transitions to the next track upon `ended` respecting active shuffle/repeat modes.
- **Real-Time Audio Visualizer:** Web Audio API `AudioContext` & `AnalyserNode` rendering live frequency spectrum bars on `<canvas>` with procedural fallback.
- **Full-Screen Vinyl Modal Player:** Cinematic modal view featuring an animated spinning vinyl disc with artwork, enlarged progress scrubber, and controls.
- **Persistent Preferences:** Automatically saves favorites, volume level, mute state, repeat mode, shuffle state, and last played track to `localStorage`.
- **Keyboard Shortcuts:**
  - <kbd>Space</kbd> : Toggle Play / Pause
  - <kbd>←</kbd> / <kbd>→</kbd> : Seek backward / forward 5 seconds
  - <kbd>↑</kbd> / <kbd>↓</kbd> : Increase / decrease volume by 5%
  - <kbd>M</kbd> : Toggle Mute / Unmute

### 5. 📱 Fully Responsive Design
- **Desktop & Laptop:** Left sidebar menu, main dashboard scroll area, and fixed bottom playback bar.
- **Tablet:** Adaptive table layout, collapsing genre tags, and optimized card grids.
- **Mobile Devices:** Compact header, sliding drawer navigation with backdrop, sticky mini-player bar, and expandable full-screen player modal.

---

## 📁 Project File Structure

```
Music Player/
├── index.html              # Semantic HTML5 layout and accessibility markup
├── css/
│   └── style.css           # Design system tokens, glassmorphism, responsive styles
├── js/
│   ├── data.js             # Curated music library catalog (10 tracks + metadata)
│   ├── player.js           # HTML5 Audio engine, Web Audio visualizer & state
│   ├── ui.js               # UI view controller, search, filters & modal
│   └── app.js              # Application entry point & bootstrapping
├── server.py               # Multi-threaded local development server
└── README.md               # Project documentation & portfolio guide
```

---

## 🛠️ How to Run Locally

If you need to restart the local server in the future:

1. Open PowerShell or Terminal in the project directory:
   ```powershell
   cd "c:\Users\Fix\Documents\Music Player"
   ```
2. Start the local server:
   ```powershell
   python server.py
   ```
   *(Alternatively, use `python -m http.server 5173`)*
3. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```
