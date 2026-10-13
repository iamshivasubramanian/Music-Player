// PulseBeat Audio Controller & State Management
// Handles HTML5 Audio API, Web Audio Analyser, LocalStorage Persistence, and Shortcuts

class MusicPlayer {
  constructor(songs) {
    this.songs = songs;
    this.filteredSongs = [...songs];
    this.currentTrackIndex = 0;
    this.isPlaying = false;
    this.isShuffled = false;
    this.repeatMode = 'all'; // 'off' | 'all' | 'one'
    this.isMuted = false;
    this.previousVolume = 0.8;
    this.volume = 0.8;
    this.recentlyPlayedIds = [];
    this.favorites = new Set();
    this.shuffleHistory = [];

    // Audio Element
    this.audio = document.getElementById('audioPlayer') || new Audio();
    this.audio.preload = 'metadata';

    // Web Audio API Visualizer Setup
    this.audioContext = null;
    this.analyser = null;
    this.sourceNode = null;
    this.visualizerCanvas = document.getElementById('visualizerCanvas');
    this.modalVisualizerCanvas = document.getElementById('modalVisualizerCanvas');
    this.visualizerAnimationId = null;

    // Load Persistent Settings
    this.loadState();

    // Attach HTML5 Audio Event Listeners
    this.initAudioEvents();

    // Keyboard Shortcuts
    this.initKeyboardShortcuts();
  }

  // Load state from localStorage
  loadState() {
    try {
      const savedFavs = localStorage.getItem('pulsebeat_favorites');
      if (savedFavs) {
        this.favorites = new Set(JSON.parse(savedFavs));
      }

      const savedRecents = localStorage.getItem('pulsebeat_recents');
      if (savedRecents) {
        this.recentlyPlayedIds = JSON.parse(savedRecents);
      }

      const savedVol = localStorage.getItem('pulsebeat_volume');
      if (savedVol !== null) {
        this.volume = parseFloat(savedVol);
        this.audio.volume = this.volume;
      } else {
        this.audio.volume = this.volume;
      }

      const savedMute = localStorage.getItem('pulsebeat_muted');
      if (savedMute !== null) {
        this.isMuted = JSON.parse(savedMute);
        this.audio.muted = this.isMuted;
      }

      const savedRepeat = localStorage.getItem('pulsebeat_repeat');
      if (savedRepeat && ['off', 'all', 'one'].includes(savedRepeat)) {
        this.repeatMode = savedRepeat;
      }

      const savedShuffle = localStorage.getItem('pulsebeat_shuffle');
      if (savedShuffle !== null) {
        this.isShuffled = JSON.parse(savedShuffle);
      }

      const savedLastTrack = localStorage.getItem('pulsebeat_last_track');
      if (savedLastTrack) {
        const foundIdx = this.songs.findIndex(s => s.id === savedLastTrack);
        if (foundIdx !== -1) {
          this.currentTrackIndex = foundIdx;
        }
      }
    } catch (e) {
      console.warn("Could not load preferences from localStorage:", e);
    }
  }

  // Save state to localStorage
  saveState() {
    try {
      localStorage.setItem('pulsebeat_favorites', JSON.stringify([...this.favorites]));
      localStorage.setItem('pulsebeat_recents', JSON.stringify(this.recentlyPlayedIds));
      localStorage.setItem('pulsebeat_volume', this.volume.toString());
      localStorage.setItem('pulsebeat_muted', JSON.stringify(this.isMuted));
      localStorage.setItem('pulsebeat_repeat', this.repeatMode);
      localStorage.setItem('pulsebeat_shuffle', JSON.stringify(this.isShuffled));
      const currentTrack = this.getCurrentTrack();
      if (currentTrack) {
        localStorage.setItem('pulsebeat_last_track', currentTrack.id);
      }
    } catch (e) {
      console.warn("Could not save preferences to localStorage:", e);
    }
  }

  // HTML5 Audio Event Listeners
  initAudioEvents() {
    this.audio.addEventListener('play', () => {
      this.isPlaying = true;
      this.initVisualizer();
      this.startVisualizer();
      window.dispatchEvent(new CustomEvent('player:statechange', { detail: { isPlaying: true } }));
    });

    this.audio.addEventListener('pause', () => {
      this.isPlaying = false;
      this.stopVisualizer();
      window.dispatchEvent(new CustomEvent('player:statechange', { detail: { isPlaying: false } }));
    });

    this.audio.addEventListener('timeupdate', () => {
      const current = this.audio.currentTime;
      const duration = this.audio.duration || this.getCurrentTrack()?.duration || 0;
      window.dispatchEvent(new CustomEvent('player:timeupdate', { 
        detail: { currentTime: current, duration: duration } 
      }));
    });

    this.audio.addEventListener('loadedmetadata', () => {
      const duration = this.audio.duration;
      const track = this.getCurrentTrack();
      if (track && duration && !isNaN(duration)) {
        track.duration = Math.round(duration);
      }
      window.dispatchEvent(new CustomEvent('player:loadedmetadata', {
        detail: { duration: this.audio.duration, track: track }
      }));
    });

    this.audio.addEventListener('ended', () => {
      this.handleTrackEnded();
    });

    this.audio.addEventListener('error', (e) => {
      console.error("Audio playback error:", e);
      this.isPlaying = false;
      window.dispatchEvent(new CustomEvent('player:error', {
        detail: { message: "Error streaming audio track. Skipping to next available track..." }
      }));
    });
  }

  getCurrentTrack() {
    return this.songs[this.currentTrackIndex] || this.songs[0];
  }

  // Load a track
  loadTrack(index, shouldAutoplay = false) {
    if (index < 0 || index >= this.songs.length) return;
    this.currentTrackIndex = index;
    const track = this.getCurrentTrack();

    this.audio.src = track.audioUrl;
    this.audio.currentTime = 0;

    // Add to recently played list
    this.addToRecentlyPlayed(track.id);
    this.saveState();

    window.dispatchEvent(new CustomEvent('player:trackchanged', { detail: { track, index } }));

    if (shouldAutoplay) {
      this.play();
    }
  }

  play() {
    if (!this.audio.src || this.audio.src === window.location.href) {
      this.loadTrack(this.currentTrackIndex, true);
      return;
    }

    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        this.isPlaying = true;
      }).catch(err => {
        console.warn("Playback was prevented by browser policy:", err);
        this.isPlaying = false;
        window.dispatchEvent(new CustomEvent('player:statechange', { detail: { isPlaying: false } }));
      });
    }
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
  }

  togglePlayPause() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  nextTrack() {
    if (this.isShuffled && this.songs.length > 1) {
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * this.songs.length);
      } while (nextIndex === this.currentTrackIndex);
      this.loadTrack(nextIndex, true);
    } else {
      const nextIndex = (this.currentTrackIndex + 1) % this.songs.length;
      this.loadTrack(nextIndex, true);
    }
  }

  prevTrack() {
    // If track has been playing for more than 3 seconds, restart it
    if (this.audio.currentTime > 3) {
      this.audio.currentTime = 0;
      return;
    }

    const prevIndex = (this.currentTrackIndex - 1 + this.songs.length) % this.songs.length;
    this.loadTrack(prevIndex, true);
  }

  handleTrackEnded() {
    if (this.repeatMode === 'one') {
      this.audio.currentTime = 0;
      this.play();
    } else if (this.repeatMode === 'all') {
      this.nextTrack();
    } else if (this.repeatMode === 'off') {
      if (this.currentTrackIndex < this.songs.length - 1) {
        this.nextTrack();
      } else {
        this.pause();
        this.audio.currentTime = 0;
      }
    }
  }

  seek(percentage) {
    const duration = this.audio.duration || this.getCurrentTrack()?.duration || 0;
    if (duration > 0) {
      this.audio.currentTime = (percentage / 100) * duration;
    }
  }

  seekRelative(seconds) {
    const duration = this.audio.duration || this.getCurrentTrack()?.duration || 0;
    const newTime = Math.max(0, Math.min(duration, this.audio.currentTime + seconds));
    this.audio.currentTime = newTime;
  }

  setVolume(value) {
    this.volume = Math.max(0, Math.min(1, value));
    this.audio.volume = this.volume;
    if (this.volume > 0 && this.isMuted) {
      this.isMuted = false;
      this.audio.muted = false;
    }
    this.saveState();
    window.dispatchEvent(new CustomEvent('player:volumechange', { 
      detail: { volume: this.volume, isMuted: this.isMuted } 
    }));
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.audio.muted = this.isMuted;
    this.saveState();
    window.dispatchEvent(new CustomEvent('player:volumechange', { 
      detail: { volume: this.volume, isMuted: this.isMuted } 
    }));
  }

  toggleShuffle() {
    this.isShuffled = !this.isShuffled;
    this.saveState();
    window.dispatchEvent(new CustomEvent('player:shufflechange', { detail: { isShuffled: this.isShuffled } }));
  }

  cycleRepeat() {
    if (this.repeatMode === 'off') {
      this.repeatMode = 'all';
    } else if (this.repeatMode === 'all') {
      this.repeatMode = 'one';
    } else {
      this.repeatMode = 'off';
    }
    this.saveState();
    window.dispatchEvent(new CustomEvent('player:repeatchange', { detail: { repeatMode: this.repeatMode } }));
  }

  // Favorites management
  toggleFavorite(trackId) {
    let isFav = false;
    if (this.favorites.has(trackId)) {
      this.favorites.delete(trackId);
      isFav = false;
    } else {
      this.favorites.add(trackId);
      isFav = true;
    }
    this.saveState();
    window.dispatchEvent(new CustomEvent('player:favoriteschange', { 
      detail: { trackId, isFavorite: isFav, count: this.favorites.size } 
    }));
    return isFav;
  }

  isFavorite(trackId) {
    return this.favorites.has(trackId);
  }

  addToRecentlyPlayed(trackId) {
    this.recentlyPlayedIds = this.recentlyPlayedIds.filter(id => id !== trackId);
    this.recentlyPlayedIds.unshift(trackId);
    if (this.recentlyPlayedIds.length > 12) {
      this.recentlyPlayedIds.pop();
    }
  }

  // Setup Web Audio Analyser
  initVisualizer() {
    if (this.audioContext) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioCtx();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 64;

      // Note: createMediaElementSource requires CORS clearance for remote media
      try {
        this.sourceNode = this.audioContext.createMediaElementSource(this.audio);
        this.sourceNode.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
      } catch (corsErr) {
        // If cross origin audio node connection is disallowed, fallback seamlessly to procedural live bars
        console.info("Using procedural visualizer mode:", corsErr.message);
      }
    } catch (e) {
      console.warn("Web Audio API not supported or restricted:", e);
    }
  }

  startVisualizer() {
    if (this.visualizerAnimationId) {
      cancelAnimationFrame(this.visualizerAnimationId);
    }

    const draw = () => {
      this.drawVisualizerCanvas(this.visualizerCanvas, 8, 3);
      this.drawVisualizerCanvas(this.modalVisualizerCanvas, 24, 6);
      this.visualizerAnimationId = requestAnimationFrame(draw);
    };
    draw();
  }

  stopVisualizer() {
    if (this.visualizerAnimationId) {
      cancelAnimationFrame(this.visualizerAnimationId);
      this.visualizerAnimationId = null;
    }
    this.clearVisualizerCanvas(this.visualizerCanvas);
    this.clearVisualizerCanvas(this.modalVisualizerCanvas);
  }

  drawVisualizerCanvas(canvas, barCount, barGap) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    let dataArray = null;
    if (this.analyser && this.sourceNode) {
      const bufferLength = this.analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
      this.analyser.getByteFrequencyData(dataArray);
    }

    const barWidth = (width - (barCount - 1) * barGap) / barCount;
    const now = Date.now() / 200;

    for (let i = 0; i < barCount; i++) {
      let barHeight;
      if (dataArray && dataArray[i]) {
        barHeight = (dataArray[i] / 255) * height * 0.9 + 2;
      } else if (this.isPlaying) {
        // Procedural rhythmic wave
        const wave = Math.sin(now + i * 0.6) * 0.5 + 0.5;
        barHeight = Math.max(3, wave * (height * 0.85) + 3);
      } else {
        barHeight = 2;
      }

      const x = i * (barWidth + barGap);
      const y = height - barHeight;

      // Gradient color for bars
      const grad = ctx.createLinearGradient(0, height, 0, 0);
      grad.addColorStop(0, '#8b5cf6');
      grad.addColorStop(1, '#38bdf8');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(x, y, barWidth, barHeight, 2) : ctx.rect(x, y, barWidth, barHeight);
      ctx.fill();
    }
  }

  clearVisualizerCanvas(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // Keyboard Shortcuts Handler
  initKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Avoid conflict with input / textarea
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        this.togglePlayPause();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        this.seekRelative(5);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        this.seekRelative(-5);
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        this.setVolume(this.volume + 0.05);
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        this.setVolume(this.volume - 0.05);
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        this.toggleMute();
      }
    });
  }
}
