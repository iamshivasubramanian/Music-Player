// PulseBeat UI Controller & View Renderer
// Manages rendering, interactions, modal player, search, filters, and toasts

class UIController {
  constructor(player) {
    this.player = player;
    this.currentGenreFilter = 'all';
    this.searchQuery = '';
    this.currentView = 'home'; // 'home' | 'library' | 'favorites' | 'recent'
    this.isDraggingSeek = false;

    // DOM Elements
    this.dom = {
      // Navigation
      navLinks: document.querySelectorAll('.sidebar-nav .nav-link[data-view]'),
      libraryCountBadge: document.getElementById('libraryCountBadge'),
      favoritesCountBadge: document.getElementById('favoritesCountBadge'),
      sidebarCoverImg: document.getElementById('sidebarCoverImg'),
      sidebarTrackTitle: document.getElementById('sidebarTrackTitle'),
      sidebarTrackArtist: document.getElementById('sidebarTrackArtist'),
      sidebarSoundWave: document.getElementById('sidebarSoundWave'),
      mobileMenuBtn: document.getElementById('mobileMenuBtn'),
      mobileCloseBtn: document.getElementById('mobileCloseBtn'),
      sidebar: document.getElementById('sidebar'),
      sidebarBackdrop: document.getElementById('sidebarBackdrop'),
      mobileSearchTrigger: document.getElementById('mobileSearchTrigger'),
      topNavBar: document.querySelector('.top-nav-bar'),

      // Search & Filters
      searchInput: document.getElementById('searchInput'),
      clearSearchBtn: document.getElementById('clearSearchBtn'),
      filterChips: document.querySelectorAll('.filter-chip'),
      genreNavLinks: document.querySelectorAll('#genreNavList .nav-link'),

      // Sections
      heroBanner: document.getElementById('heroBanner'),
      heroPlayBtn: document.getElementById('heroPlayBtn'),
      heroShuffleBtn: document.getElementById('heroShuffleBtn'),
      heroFeaturedImg: document.getElementById('heroFeaturedImg'),
      heroFeaturedTitle: document.getElementById('heroFeaturedTitle'),
      heroFeaturedArtist: document.getElementById('heroFeaturedArtist'),
      heroFeaturedPlayBtn: document.getElementById('heroFeaturedPlayBtn'),

      recentlyPlayedSection: document.getElementById('recentlyPlayedSection'),
      recentCardsGrid: document.getElementById('recentCardsGrid'),
      viewAllRecentBtn: document.getElementById('viewAllRecentBtn'),

      favoritesSection: document.getElementById('favoritesSection'),
      favoritesCardsGrid: document.getElementById('favoritesCardsGrid'),
      favoritesSectionCount: document.getElementById('favoritesSectionCount'),

      librarySection: document.getElementById('librarySection'),
      librarySectionTitle: document.getElementById('librarySectionTitle'),
      trackCountLabel: document.getElementById('trackCountLabel'),
      tracklistBody: document.getElementById('tracklistBody'),
      emptyState: document.getElementById('emptyState'),
      emptyStateDesc: document.getElementById('emptyStateDesc'),
      resetSearchBtn: document.getElementById('resetSearchBtn'),

      // Player Bar Controls
      nowPlayingArt: document.getElementById('nowPlayingArt'),
      artPlayingOverlay: document.getElementById('artPlayingOverlay'),
      nowPlayingTitle: document.getElementById('nowPlayingTitle'),
      nowPlayingArtist: document.getElementById('nowPlayingArtist'),
      nowPlayingAlbumBadge: document.getElementById('nowPlayingAlbumBadge'),
      playerFavoriteBtn: document.getElementById('playerFavoriteBtn'),

      shuffleBtn: document.getElementById('shuffleBtn'),
      shuffleIndicator: document.getElementById('shuffleIndicator'),
      prevBtn: document.getElementById('prevBtn'),
      playPauseBtn: document.getElementById('playPauseBtn'),
      playIcon: document.getElementById('playIcon'),
      pauseIcon: document.getElementById('pauseIcon'),
      nextBtn: document.getElementById('nextBtn'),
      repeatBtn: document.getElementById('repeatBtn'),
      repeatIndicator: document.getElementById('repeatIndicator'),
      repeatOneBadge: document.getElementById('repeatOneBadge'),

      currentTimeLabel: document.getElementById('currentTimeLabel'),
      totalDurationLabel: document.getElementById('totalDurationLabel'),
      seekBarWrapper: document.getElementById('seekBarWrapper'),
      seekBar: document.getElementById('seekBar'),
      seekFill: document.getElementById('seekFill'),
      seekHoverTime: document.getElementById('seekHoverTime'),

      muteBtn: document.getElementById('muteBtn'),
      volHighIcon: document.getElementById('volHighIcon'),
      volLowIcon: document.getElementById('volLowIcon'),
      volMuteIcon: document.getElementById('volMuteIcon'),
      volumeSlider: document.getElementById('volumeSlider'),
      volumeFill: document.getElementById('volumeFill'),
      expandPlayerBtn: document.getElementById('expandPlayerBtn'),

      // Modal Player
      modalPlayer: document.getElementById('modalPlayer'),
      modalCloseBtn: document.getElementById('modalCloseBtn'),
      modalAlbumTitle: document.getElementById('modalAlbumTitle'),
      modalFavoriteBtn: document.getElementById('modalFavoriteBtn'),
      modalVinylDisk: document.getElementById('modalVinylDisk'),
      modalArtworkImg: document.getElementById('modalArtworkImg'),
      modalTrackTitle: document.getElementById('modalTrackTitle'),
      modalTrackArtist: document.getElementById('modalTrackArtist'),
      modalSeekBar: document.getElementById('modalSeekBar'),
      modalSeekFill: document.getElementById('modalSeekFill'),
      modalCurrentTime: document.getElementById('modalCurrentTime'),
      modalTotalDuration: document.getElementById('modalTotalDuration'),
      modalShuffleBtn: document.getElementById('modalShuffleBtn'),
      modalShuffleIndicator: document.getElementById('modalShuffleIndicator'),
      modalPrevBtn: document.getElementById('modalPrevBtn'),
      modalPlayPauseBtn: document.getElementById('modalPlayPauseBtn'),
      modalPlayIcon: document.getElementById('modalPlayIcon'),
      modalPauseIcon: document.getElementById('modalPauseIcon'),
      modalNextBtn: document.getElementById('modalNextBtn'),
      modalRepeatBtn: document.getElementById('modalRepeatBtn'),
      modalRepeatIndicator: document.getElementById('modalRepeatIndicator'),
      modalRepeatOneBadge: document.getElementById('modalRepeatOneBadge'),

      // Toast
      toastNotification: document.getElementById('toastNotification'),
      toastMessage: document.getElementById('toastMessage')
    };

    this.initEventListeners();
    this.initPlayerEventSubscribers();
    this.renderInitialUI();
  }

  // Format seconds to M:SS
  formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // Toast notification
  showToast(message) {
    if (!this.dom.toastNotification) return;
    this.dom.toastMessage.textContent = message;
    this.dom.toastNotification.classList.add('show');
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.dom.toastNotification.classList.remove('show');
    }, 2400);
  }

  // Initial render
  renderInitialUI() {
    this.updateBadges();
    this.renderFeaturedHero();
    this.renderTracklist();
    this.renderRecentlyPlayed();
    this.renderFavoritesGrid();
    this.updateControlsState();

    const currentTrack = this.player.getCurrentTrack();
    if (currentTrack) {
      this.updateNowPlayingInfo(currentTrack);
    }
  }

  updateBadges() {
    if (this.dom.libraryCountBadge) {
      this.dom.libraryCountBadge.textContent = this.player.songs.length;
    }
    if (this.dom.favoritesCountBadge) {
      this.dom.favoritesCountBadge.textContent = this.player.favorites.size;
    }
    if (this.dom.favoritesSectionCount) {
      this.dom.favoritesSectionCount.textContent = `${this.player.favorites.size} tracks`;
    }
  }

  // Render Featured Hero
  renderFeaturedHero() {
    const featured = this.player.songs.find(s => s.featured) || this.player.songs[0];
    if (!featured) return;

    if (this.dom.heroFeaturedImg) {
      this.dom.heroFeaturedImg.src = featured.coverUrl;
      this.dom.heroFeaturedImg.onerror = () => {
        this.dom.heroFeaturedImg.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80';
      };
    }
    if (this.dom.heroFeaturedTitle) {
      this.dom.heroFeaturedTitle.textContent = featured.title;
    }
    if (this.dom.heroFeaturedArtist) {
      this.dom.heroFeaturedArtist.textContent = featured.artist;
    }
  }

  // Filter songs based on genre & search
  getFilteredSongs() {
    return this.player.songs.filter(song => {
      const matchesGenre = this.currentGenreFilter === 'all' || song.genre.toLowerCase() === this.currentGenreFilter.toLowerCase();
      const q = this.searchQuery.trim().toLowerCase();
      const matchesSearch = !q || 
        song.title.toLowerCase().includes(q) ||
        song.artist.toLowerCase().includes(q) ||
        song.album.toLowerCase().includes(q) ||
        song.genre.toLowerCase().includes(q);

      return matchesGenre && matchesSearch;
    });
  }

  // Render Full Tracklist
  renderTracklist() {
    const list = this.getFilteredSongs();
    const currentTrack = this.player.getCurrentTrack();

    if (this.dom.trackCountLabel) {
      this.dom.trackCountLabel.textContent = `${list.length} Track${list.length === 1 ? '' : 's'}`;
    }

    if (list.length === 0) {
      this.dom.tracklistBody.innerHTML = '';
      this.dom.emptyState.style.display = 'flex';
      if (this.dom.emptyStateDesc) {
        this.dom.emptyStateDesc.textContent = `No songs found matching "${this.searchQuery}". Try searching for another artist, song, or reset filter.`;
      }
      return;
    }

    this.dom.emptyState.style.display = 'none';

    let html = '';
    list.forEach((song, idx) => {
      const isCurrent = currentTrack && currentTrack.id === song.id;
      const isPlaying = isCurrent && this.player.isPlaying;
      const isFav = this.player.isFavorite(song.id);

      html += `
        <div class="track-row ${isCurrent ? 'playing' : ''}" data-id="${song.id}" data-index="${this.player.songs.findIndex(s => s.id === song.id)}">
          <div class="track-col-index">
            <span class="row-index-num">${idx + 1}</span>
            <svg class="row-play-icon" viewBox="0 0 24 24" fill="currentColor">
              ${isPlaying 
                ? '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>' 
                : '<polygon points="6 4 20 12 6 20 6 4"></polygon>'}
            </svg>
          </div>
          <div class="track-col-title">
            <img class="track-thumb" src="${song.coverUrl}" alt="${song.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80'">
            <div class="track-details">
              <span class="track-name">${song.title}</span>
              <span class="track-artist-sub">${song.artist}</span>
            </div>
          </div>
          <div class="track-col-album">${song.album}</div>
          <div class="track-col-genre"><span class="genre-tag">${song.genre}</span></div>
          <div class="track-col-duration">${this.formatTime(song.duration)}</div>
          <div class="track-col-action">
            <button class="heart-btn ${isFav ? 'active' : ''}" data-action="favorite" data-id="${song.id}" aria-label="Favorite song">
              <svg viewBox="0 0 24 24" class="heart-icon" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>
        </div>
      `;
    });

    this.dom.tracklistBody.innerHTML = html;
  }

  // Render Recently Played Carousel
  renderRecentlyPlayed() {
    const recentSongs = this.player.recentlyPlayedIds
      .map(id => this.player.songs.find(s => s.id === id))
      .filter(Boolean);

    // If empty, show first 4 songs as suggestions
    const displayList = recentSongs.length > 0 ? recentSongs : this.player.songs.slice(0, 4);

    let html = '';
    displayList.forEach(song => {
      const isCurrent = this.player.getCurrentTrack()?.id === song.id;
      const isFav = this.player.isFavorite(song.id);

      html += `
        <div class="song-card ${isCurrent ? 'playing' : ''}" data-id="${song.id}">
          <div class="card-art-wrap">
            <img src="${song.coverUrl}" alt="${song.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80'">
            <button class="card-fav-btn ${isFav ? 'active' : ''}" data-action="favorite" data-id="${song.id}">
              <svg viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            <button class="card-play-btn" data-action="play" data-id="${song.id}">
              <svg viewBox="0 0 24 24" fill="currentColor">
                ${isCurrent && this.player.isPlaying 
                  ? '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>' 
                  : '<polygon points="6 4 20 12 6 20 6 4"></polygon>'}
              </svg>
            </button>
          </div>
          <div class="card-meta">
            <span class="card-title">${song.title}</span>
            <span class="card-artist">${song.artist}</span>
          </div>
        </div>
      `;
    });

    this.dom.recentCardsGrid.innerHTML = html;
  }

  // Render Favorites Section
  renderFavoritesGrid() {
    const favSongs = Array.from(this.player.favorites)
      .map(id => this.player.songs.find(s => s.id === id))
      .filter(Boolean);

    if (favSongs.length === 0) {
      this.dom.favoritesCardsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 24px; text-align: center; color: var(--text-muted); background: var(--bg-surface); border-radius: var(--radius-md); border: 1px dashed var(--border-glass);">
          <p>No favorite tracks yet. Click the heart icon on any song to add it to your favorites!</p>
        </div>
      `;
      return;
    }

    let html = '';
    favSongs.forEach(song => {
      const isCurrent = this.player.getCurrentTrack()?.id === song.id;

      html += `
        <div class="song-card ${isCurrent ? 'playing' : ''}" data-id="${song.id}">
          <div class="card-art-wrap">
            <img src="${song.coverUrl}" alt="${song.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80'">
            <button class="card-fav-btn active" data-action="favorite" data-id="${song.id}">
              <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            <button class="card-play-btn" data-action="play" data-id="${song.id}">
              <svg viewBox="0 0 24 24" fill="currentColor">
                ${isCurrent && this.player.isPlaying 
                  ? '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>' 
                  : '<polygon points="6 4 20 12 6 20 6 4"></polygon>'}
              </svg>
            </button>
          </div>
          <div class="card-meta">
            <span class="card-title">${song.title}</span>
            <span class="card-artist">${song.artist}</span>
          </div>
        </div>
      `;
    });

    this.dom.favoritesCardsGrid.innerHTML = html;
  }

  // Update Now Playing UI info across the player bar, sidebar, and modal
  updateNowPlayingInfo(track) {
    if (!track) return;
    const isFav = this.player.isFavorite(track.id);

    // Player Bar
    this.dom.nowPlayingArt.src = track.coverUrl;
    this.dom.nowPlayingArt.onerror = () => {
      this.dom.nowPlayingArt.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80';
    };
    this.dom.nowPlayingTitle.textContent = track.title;
    this.dom.nowPlayingArtist.textContent = track.artist;
    this.dom.nowPlayingAlbumBadge.textContent = track.album;
    this.dom.totalDurationLabel.textContent = this.formatTime(track.duration);

    this.dom.playerFavoriteBtn.classList.toggle('active', isFav);

    // Sidebar Preview
    if (this.dom.sidebarCoverImg) {
      this.dom.sidebarCoverImg.src = track.coverUrl;
    }
    if (this.dom.sidebarTrackTitle) {
      this.dom.sidebarTrackTitle.textContent = track.title;
    }
    if (this.dom.sidebarTrackArtist) {
      this.dom.sidebarTrackArtist.textContent = track.artist;
    }

    // Modal Player
    if (this.dom.modalArtworkImg) {
      this.dom.modalArtworkImg.src = track.coverUrl;
    }
    if (this.dom.modalTrackTitle) {
      this.dom.modalTrackTitle.textContent = track.title;
    }
    if (this.dom.modalTrackArtist) {
      this.dom.modalTrackArtist.textContent = track.artist;
    }
    if (this.dom.modalAlbumTitle) {
      this.dom.modalAlbumTitle.textContent = track.album;
    }
    if (this.dom.modalTotalDuration) {
      this.dom.modalTotalDuration.textContent = this.formatTime(track.duration);
    }
    if (this.dom.modalFavoriteBtn) {
      this.dom.modalFavoriteBtn.classList.toggle('active', isFav);
    }

    // Update active highlight classes
    this.highlightActiveTrack(track.id);
  }

  highlightActiveTrack(trackId) {
    document.querySelectorAll('.track-row').forEach(row => {
      row.classList.toggle('playing', row.getAttribute('data-id') === trackId);
    });
    document.querySelectorAll('.song-card').forEach(card => {
      card.classList.toggle('playing', card.getAttribute('data-id') === trackId);
    });
  }

  // Update controls state (buttons, sliders, repeat, shuffle)
  updateControlsState() {
    // Play / Pause icons
    const isPlaying = this.player.isPlaying;
    this.dom.playIcon.style.display = isPlaying ? 'none' : 'block';
    this.dom.pauseIcon.style.display = isPlaying ? 'block' : 'none';

    if (this.dom.modalPlayIcon) {
      this.dom.modalPlayIcon.style.display = isPlaying ? 'none' : 'block';
      this.dom.modalPauseIcon.style.display = isPlaying ? 'block' : 'none';
    }

    // Vinyl spin & soundwaves
    if (this.dom.modalVinylDisk) {
      this.dom.modalVinylDisk.classList.toggle('spinning', isPlaying);
    }
    if (this.dom.artPlayingOverlay) {
      this.dom.artPlayingOverlay.classList.toggle('active', isPlaying);
    }
    if (this.dom.sidebarSoundWave) {
      this.dom.sidebarSoundWave.classList.toggle('active', isPlaying);
    }

    // Shuffle Button
    this.dom.shuffleBtn.classList.toggle('active', this.player.isShuffled);
    if (this.dom.modalShuffleBtn) {
      this.dom.modalShuffleBtn.classList.toggle('active', this.player.isShuffled);
    }

    // Repeat Button
    const repMode = this.player.repeatMode;
    this.dom.repeatBtn.classList.toggle('active', repMode !== 'off');
    this.dom.repeatOneBadge.style.display = repMode === 'one' ? 'block' : 'none';

    if (this.dom.modalRepeatBtn) {
      this.dom.modalRepeatBtn.classList.toggle('active', repMode !== 'off');
      this.dom.modalRepeatOneBadge.style.display = repMode === 'one' ? 'block' : 'none';
    }

    // Volume Slider & Mute Icon
    this.updateVolumeUI();
  }

  updateVolumeUI() {
    const vol = this.player.isMuted ? 0 : this.player.volume;
    this.dom.volumeSlider.value = vol;
    this.dom.volumeFill.style.width = `${vol * 100}%`;

    if (this.player.isMuted || vol === 0) {
      this.dom.volHighIcon.style.display = 'none';
      this.dom.volLowIcon.style.display = 'none';
      this.dom.volMuteIcon.style.display = 'block';
    } else if (vol < 0.5) {
      this.dom.volHighIcon.style.display = 'none';
      this.dom.volLowIcon.style.display = 'block';
      this.dom.volMuteIcon.style.display = 'none';
    } else {
      this.dom.volHighIcon.style.display = 'block';
      this.dom.volLowIcon.style.display = 'none';
      this.dom.volMuteIcon.style.display = 'none';
    }
  }

  // Update progress bar & time labels
  updateProgressUI(currentTime, duration) {
    if (this.isDraggingSeek) return;

    const currentFormatted = this.formatTime(currentTime);
    const durationFormatted = this.formatTime(duration);

    this.dom.currentTimeLabel.textContent = currentFormatted;
    if (duration > 0) {
      this.dom.totalDurationLabel.textContent = durationFormatted;
    }

    const pct = duration > 0 ? (currentTime / duration) * 100 : 0;
    this.dom.seekBar.value = pct;
    this.dom.seekFill.style.width = `${pct}%`;

    // Modal
    if (this.dom.modalCurrentTime) {
      this.dom.modalCurrentTime.textContent = currentFormatted;
      this.dom.modalTotalDuration.textContent = durationFormatted;
      this.dom.modalSeekBar.value = pct;
      this.dom.modalSeekFill.style.width = `${pct}%`;
    }
  }

  // Switch Active Navigation View
  switchView(viewName) {
    this.currentView = viewName;
    this.dom.navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-view') === viewName);
    });

    if (viewName === 'home') {
      this.dom.heroBanner.style.display = 'flex';
      this.dom.recentlyPlayedSection.style.display = 'flex';
      this.dom.favoritesSection.style.display = 'flex';
      this.dom.librarySectionTitle.textContent = 'Complete Music Library';
      this.dom.librarySection.scrollIntoView({ behavior: 'smooth' });
    } else if (viewName === 'library') {
      this.dom.heroBanner.style.display = 'none';
      this.dom.recentlyPlayedSection.style.display = 'none';
      this.dom.favoritesSection.style.display = 'none';
      this.dom.librarySectionTitle.textContent = 'All Library Tracks';
      this.dom.librarySection.scrollIntoView({ behavior: 'smooth' });
    } else if (viewName === 'favorites') {
      this.dom.heroBanner.style.display = 'none';
      this.dom.recentlyPlayedSection.style.display = 'none';
      this.dom.favoritesSection.style.display = 'flex';
      this.dom.librarySection.style.display = 'none';
      this.dom.favoritesSection.scrollIntoView({ behavior: 'smooth' });
      return;
    } else if (viewName === 'recent') {
      this.dom.heroBanner.style.display = 'none';
      this.dom.recentlyPlayedSection.style.display = 'flex';
      this.dom.favoritesSection.style.display = 'none';
      this.dom.librarySection.style.display = 'none';
      this.dom.recentlyPlayedSection.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    this.dom.librarySection.style.display = 'flex';
  }

  // Subscribe to Player Events
  initPlayerEventSubscribers() {
    window.addEventListener('player:statechange', () => {
      this.updateControlsState();
      this.renderTracklist();
      this.renderRecentlyPlayed();
      this.renderFavoritesGrid();
    });

    window.addEventListener('player:trackchanged', (e) => {
      this.updateNowPlayingInfo(e.detail.track);
      this.updateControlsState();
      this.renderRecentlyPlayed();
      this.renderTracklist();
    });

    window.addEventListener('player:timeupdate', (e) => {
      this.updateProgressUI(e.detail.currentTime, e.detail.duration);
    });

    window.addEventListener('player:loadedmetadata', (e) => {
      this.dom.totalDurationLabel.textContent = this.formatTime(e.detail.duration);
      if (this.dom.modalTotalDuration) {
        this.dom.modalTotalDuration.textContent = this.formatTime(e.detail.duration);
      }
    });

    window.addEventListener('player:volumechange', () => {
      this.updateVolumeUI();
    });

    window.addEventListener('player:shufflechange', (e) => {
      this.updateControlsState();
      this.showToast(e.detail.isShuffled ? 'Shuffle Mode: ON' : 'Shuffle Mode: OFF');
    });

    window.addEventListener('player:repeatchange', (e) => {
      this.updateControlsState();
      const labels = { off: 'Repeat: OFF', all: 'Repeat: ALL', one: 'Repeat: ONE' };
      this.showToast(labels[e.detail.repeatMode] || 'Repeat Mode Changed');
    });

    window.addEventListener('player:favoriteschange', (e) => {
      this.updateBadges();
      this.renderTracklist();
      this.renderRecentlyPlayed();
      this.renderFavoritesGrid();
      const currentTrack = this.player.getCurrentTrack();
      if (currentTrack && currentTrack.id === e.detail.trackId) {
        this.dom.playerFavoriteBtn.classList.toggle('active', e.detail.isFavorite);
        if (this.dom.modalFavoriteBtn) {
          this.dom.modalFavoriteBtn.classList.toggle('active', e.detail.isFavorite);
        }
      }
      this.showToast(e.detail.isFavorite ? 'Added to Favorites ♥' : 'Removed from Favorites');
    });

    window.addEventListener('player:error', (e) => {
      this.showToast(e.detail.message);
    });
  }

  // Initialize UI Event Listeners
  initEventListeners() {
    // Navigation Links
    this.dom.navLinks.forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-view');
        this.switchView(view);
        // Mobile sidebar auto-close
        this.dom.sidebar.classList.remove('open');
        this.dom.sidebarBackdrop.classList.remove('active');
      });
    });

    if (this.dom.viewAllRecentBtn) {
      this.dom.viewAllRecentBtn.addEventListener('click', () => {
        this.switchView('recent');
      });
    }

    // Mobile Hamburger & Search
    if (this.dom.mobileMenuBtn) {
      this.dom.mobileMenuBtn.addEventListener('click', () => {
        this.dom.sidebar.classList.add('open');
        this.dom.sidebarBackdrop.classList.add('active');
      });
    }

    if (this.dom.mobileCloseBtn) {
      this.dom.mobileCloseBtn.addEventListener('click', () => {
        this.dom.sidebar.classList.remove('open');
        this.dom.sidebarBackdrop.classList.remove('active');
      });
    }

    if (this.dom.sidebarBackdrop) {
      this.dom.sidebarBackdrop.addEventListener('click', () => {
        this.dom.sidebar.classList.remove('open');
        this.dom.sidebarBackdrop.classList.remove('active');
      });
    }

    if (this.dom.mobileSearchTrigger) {
      this.dom.mobileSearchTrigger.addEventListener('click', () => {
        this.dom.topNavBar.classList.toggle('mobile-visible');
        if (this.dom.topNavBar.classList.contains('mobile-visible')) {
          this.dom.searchInput.focus();
        }
      });
    }

    // Search Input
    this.dom.searchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      this.dom.clearSearchBtn.style.display = this.searchQuery ? 'block' : 'none';
      this.renderTracklist();
    });

    this.dom.clearSearchBtn.addEventListener('click', () => {
      this.dom.searchInput.value = '';
      this.searchQuery = '';
      this.dom.clearSearchBtn.style.display = 'none';
      this.renderTracklist();
      this.dom.searchInput.focus();
    });

    if (this.dom.resetSearchBtn) {
      this.dom.resetSearchBtn.addEventListener('click', () => {
        this.dom.searchInput.value = '';
        this.searchQuery = '';
        this.dom.clearSearchBtn.style.display = 'none';
        this.currentGenreFilter = 'all';
        this.dom.filterChips.forEach(c => c.classList.toggle('active', c.getAttribute('data-genre') === 'all'));
        this.renderTracklist();
      });
    }

    // Genre Filter Chips
    this.dom.filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        this.dom.filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.currentGenreFilter = chip.getAttribute('data-genre');
        this.renderTracklist();
      });
    });

    // Sidebar Genre Links
    this.dom.genreNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        const genre = link.getAttribute('data-genre');
        this.currentGenreFilter = genre;
        this.dom.filterChips.forEach(c => c.classList.toggle('active', c.getAttribute('data-genre') === genre));
        this.switchView('home');
        this.renderTracklist();
        this.dom.sidebar.classList.remove('open');
        this.dom.sidebarBackdrop.classList.remove('active');
      });
    });

    // Hero Actions
    if (this.dom.heroPlayBtn) {
      this.dom.heroPlayBtn.addEventListener('click', () => {
        const featuredIndex = this.player.songs.findIndex(s => s.featured);
        this.player.loadTrack(featuredIndex !== -1 ? featuredIndex : 0, true);
      });
    }

    if (this.dom.heroFeaturedPlayBtn) {
      this.dom.heroFeaturedPlayBtn.addEventListener('click', () => {
        const featuredIndex = this.player.songs.findIndex(s => s.featured);
        this.player.loadTrack(featuredIndex !== -1 ? featuredIndex : 0, true);
      });
    }

    if (this.dom.heroShuffleBtn) {
      this.dom.heroShuffleBtn.addEventListener('click', () => {
        if (!this.player.isShuffled) {
          this.player.toggleShuffle();
        }
        this.player.nextTrack();
      });
    }

    // Tracklist Row Click Delegation
    this.dom.tracklistBody.addEventListener('click', (e) => {
      const favBtn = e.target.closest('[data-action="favorite"]');
      if (favBtn) {
        e.stopPropagation();
        const id = favBtn.getAttribute('data-id');
        this.player.toggleFavorite(id);
        return;
      }

      const row = e.target.closest('.track-row');
      if (row) {
        const idx = parseInt(row.getAttribute('data-index'), 10);
        if (this.player.currentTrackIndex === idx) {
          this.player.togglePlayPause();
        } else {
          this.player.loadTrack(idx, true);
        }
      }
    });

    // Cards Grid Click Delegation (Recently Played & Favorites)
    [this.dom.recentCardsGrid, this.dom.favoritesCardsGrid].forEach(container => {
      if (!container) return;
      container.addEventListener('click', (e) => {
        const favBtn = e.target.closest('[data-action="favorite"]');
        if (favBtn) {
          e.stopPropagation();
          const id = favBtn.getAttribute('data-id');
          this.player.toggleFavorite(id);
          return;
        }

        const card = e.target.closest('.song-card');
        if (card) {
          const id = card.getAttribute('data-id');
          const idx = this.player.songs.findIndex(s => s.id === id);
          if (idx !== -1) {
            if (this.player.currentTrackIndex === idx) {
              this.player.togglePlayPause();
            } else {
              this.player.loadTrack(idx, true);
            }
          }
        }
      });
    });

    // Bottom Player Controls
    this.dom.playPauseBtn.addEventListener('click', () => this.player.togglePlayPause());
    this.dom.nextBtn.addEventListener('click', () => this.player.nextTrack());
    this.dom.prevBtn.addEventListener('click', () => this.player.prevTrack());
    this.dom.shuffleBtn.addEventListener('click', () => this.player.toggleShuffle());
    this.dom.repeatBtn.addEventListener('click', () => this.player.cycleRepeat());

    this.dom.playerFavoriteBtn.addEventListener('click', () => {
      const current = this.player.getCurrentTrack();
      if (current) this.player.toggleFavorite(current.id);
    });

    // Seeker Input & Dragging
    const handleSeekInput = (val) => {
      const duration = this.player.audio.duration || this.player.getCurrentTrack()?.duration || 0;
      this.dom.seekFill.style.width = `${val}%`;
      this.dom.currentTimeLabel.textContent = this.formatTime((val / 100) * duration);
    };

    this.dom.seekBar.addEventListener('input', (e) => {
      this.isDraggingSeek = true;
      handleSeekInput(e.target.value);
    });

    this.dom.seekBar.addEventListener('change', (e) => {
      this.player.seek(parseFloat(e.target.value));
      this.isDraggingSeek = false;
    });

    // Seeker Hover preview tooltip
    this.dom.seekBarWrapper.addEventListener('mousemove', (e) => {
      const rect = this.dom.seekBarWrapper.getBoundingClientRect();
      const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const duration = this.player.audio.duration || this.player.getCurrentTrack()?.duration || 0;
      this.dom.seekHoverTime.style.left = `${pos * 100}%`;
      this.dom.seekHoverTime.textContent = this.formatTime(pos * duration);
      this.dom.seekHoverTime.style.display = 'block';
    });

    this.dom.seekBarWrapper.addEventListener('mouseleave', () => {
      this.dom.seekHoverTime.style.display = 'none';
    });

    // Volume & Mute
    this.dom.muteBtn.addEventListener('click', () => this.player.toggleMute());
    this.dom.volumeSlider.addEventListener('input', (e) => {
      this.player.setVolume(parseFloat(e.target.value));
    });

    // Expand Modal Player
    this.dom.expandPlayerBtn.addEventListener('click', () => {
      this.dom.modalPlayer.classList.add('open');
    });

    this.dom.modalCloseBtn.addEventListener('click', () => {
      this.dom.modalPlayer.classList.remove('open');
    });

    // Modal Player Controls
    this.dom.modalPlayPauseBtn.addEventListener('click', () => this.player.togglePlayPause());
    this.dom.modalNextBtn.addEventListener('click', () => this.player.nextTrack());
    this.dom.modalPrevBtn.addEventListener('click', () => this.player.prevTrack());
    this.dom.modalShuffleBtn.addEventListener('click', () => this.player.toggleShuffle());
    this.dom.modalRepeatBtn.addEventListener('click', () => this.player.cycleRepeat());

    this.dom.modalFavoriteBtn.addEventListener('click', () => {
      const current = this.player.getCurrentTrack();
      if (current) this.player.toggleFavorite(current.id);
    });

    this.dom.modalSeekBar.addEventListener('input', (e) => {
      this.isDraggingSeek = true;
      const duration = this.player.audio.duration || this.player.getCurrentTrack()?.duration || 0;
      this.dom.modalSeekFill.style.width = `${e.target.value}%`;
      this.dom.modalCurrentTime.textContent = this.formatTime((e.target.value / 100) * duration);
    });

    this.dom.modalSeekBar.addEventListener('change', (e) => {
      this.player.seek(parseFloat(e.target.value));
      this.isDraggingSeek = false;
    });
  }
}
