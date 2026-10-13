// PulseBeat Application Entry Point
// Bootstraps audio engine, UI manager, and initial states

document.addEventListener('DOMContentLoaded', () => {
  try {
    // 1. Initialize Player Engine with Song Catalog
    const player = new MusicPlayer(SONGS_LIBRARY);

    // 2. Initialize UI Controller
    const ui = new UIController(player);

    // 3. Expose global instance for debugging & automated testing
    window.pulseBeat = {
      player,
      ui,
      version: '1.0.0'
    };

    console.log('%c🎵 PulseBeat Music Player Initialized Successfully!', 'color: #8b5cf6; font-size: 14px; font-weight: bold;');
    console.log('%cLoaded tracks:', 'color: #38bdf8;', SONGS_LIBRARY.length);
  } catch (err) {
    console.error('Fatal initialization error:', err);
  }
});
