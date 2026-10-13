// PulseBeat Music Library Data
// Curated royalty-free tracks with high-definition album art and playable audio streams

const SONGS_LIBRARY = [
  {
    id: "track-1",
    title: "Midnight Horizon",
    artist: "Aura Soundscape",
    album: "Neon Dreams Vol. 1",
    duration: 372, // 6:12
    genre: "Synthwave",
    coverUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    featured: true,
    year: 2024
  },
  {
    id: "track-2",
    title: "Electric Pulse",
    artist: "Cybernetic Beats",
    album: "Future Echoes",
    duration: 423, // 7:03
    genre: "Electronic",
    coverUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    featured: false,
    year: 2024
  },
  {
    id: "track-3",
    title: "Cosmic Serenade",
    artist: "Stella Nova",
    album: "Interstellar Journey",
    duration: 345, // 5:45
    genre: "Ambient",
    coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    featured: false,
    year: 2023
  },
  {
    id: "track-4",
    title: "Retrowave City",
    artist: "RetroWave Syndicate",
    album: "Arcade Twilight",
    duration: 302, // 5:02
    genre: "Synthwave",
    coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    featured: false,
    year: 2024
  },
  {
    id: "track-5",
    title: "Velvet Melodies",
    artist: "Elena Vance",
    album: "Nocturnal Notes",
    duration: 351, // 5:51
    genre: "Acoustic",
    coverUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    featured: false,
    year: 2023
  },
  {
    id: "track-6",
    title: "Cybernetic Mirage",
    artist: "Kinetix Flow",
    album: "Digital Utopia",
    duration: 279, // 4:39
    genre: "Electronic",
    coverUrl: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600&auto=format&fit=crop&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    featured: false,
    year: 2024
  },
  {
    id: "track-7",
    title: "Solar Flare Anthem",
    artist: "Hyperion Project",
    album: "Supernova",
    duration: 418, // 6:58
    genre: "Electronic",
    coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    featured: false,
    year: 2024
  },
  {
    id: "track-8",
    title: "Twilight Reflections",
    artist: "Lofi Solitude",
    album: "Rain & Coffee",
    duration: 324, // 5:24
    genre: "Ambient",
    coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    featured: false,
    year: 2023
  },
  {
    id: "track-9",
    title: "Echoes of Dawn",
    artist: "Aurora Borealis",
    album: "Skyward Whispers",
    duration: 360, // 6:00
    genre: "Ambient",
    coverUrl: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    featured: false,
    year: 2024
  },
  {
    id: "track-10",
    title: "Night Owl Groove",
    artist: "Broke For Free",
    album: "Directionless EP",
    duration: 218, // 3:38
    genre: "Acoustic",
    coverUrl: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=600&auto=format&fit=crop&q=80",
    audioUrl: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/WFMU/Broke_For_Free/Directionless_EP/Broke_For_Free_-_01_-_Night_Owl.mp3",
    featured: false,
    year: 2023
  }
];

// Fallback high-contrast colorful SVG gradients in case image URLs are blocked by network policies
const FALLBACK_COVER_GRADIENTS = [
  "linear-gradient(135deg, #7928ca 0%, #ff0080 100%)",
  "linear-gradient(135deg, #0070f3 0%, #00dfd8 100%)",
  "linear-gradient(135deg, #f81ce5 0%, #7928ca 100%)",
  "linear-gradient(135deg, #4338ca 0%, #6ee7b7 100%)",
  "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
  "linear-gradient(135deg, #3b82f6 0%, #10b981 100%)",
  "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
  "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)"
];
