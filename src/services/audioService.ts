// Audio service for managing local audio files

import { Track } from "../services/musicService";
import { KaraokeSong, LyricLine } from "../hooks/useKaraoke";

// Pixabay API configuration for audio fetching
const API_KEY = '49630374-5018586a41740c2d662cbf95d';

interface PixabayAudioResponse {
  total: number;
  totalHits: number;
  hits: PixabayAudio[];
}

export interface PixabayAudio {
  id: number;
  pageURL: string;
  type: string;
  tags: string;
  duration: number;
  audio_url: string;
  user_id: number;
  user: string;
  userImageURL: string;
}

// Fallback audio if API fails - now with working local audio paths
export const fallbackAudio = [
  {
    id: 1,
    audio_url: "/sounds/meditation/om_meditation.mp3",
    pageURL: "https://pixabay.com/music/meditationspiritual-om-mantra-chanting-22225/",
    user: "Pixabay",
    tags: "om, mantra, meditation",
    duration: 120
  },
  {
    id: 2,
    audio_url: "/sounds/meditation/gayatri_mantra.mp3",
    pageURL: "https://pixabay.com/music/world-indian-fusion-112837/",
    user: "Pixabay",
    tags: "gayatri, mantra, meditation",
    duration: 180
  },
  {
    id: 3,
    audio_url: "/sounds/meditation/chakra_alignment.mp3",
    pageURL: "https://pixabay.com/music/meditationspiritual-peaceful-garden-healing-light-piano-amp-chimes-113897/",
    user: "Pixabay",
    tags: "chakra, meditation, healing",
    duration: 240
  },
  {
    id: 4,
    audio_url: "/sounds/meditation/mindful_breathing.mp3",
    pageURL: "https://pixabay.com/music/meditationspiritual-relaxing-133991/",
    user: "Pixabay",
    tags: "breathing, mindful, meditation",
    duration: 300
  }
];

export const fetchAudioFromPixabay = async (query: string): Promise<PixabayAudio[]> => {
  try {
    // We need to specifically use the audio endpoint
    const url = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(query)}&media_type=audio`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch audio from Pixabay');
    }
    
    const data: PixabayAudioResponse = await response.json();
    return data.hits || [];
  } catch (error) {
    console.error('Error fetching audio:', error);
    // Return fallback audio on error
    return fallbackAudio as unknown as PixabayAudio[];
  }
};

// Local music tracks with proper typing
export const localMusicTracks: Track[] = [
  {
    id: "local1",
    title: "Peaceful Meditation",
    artist: "Relaxation Music",
    duration: "5:23",
    cover: "https://placehold.co/300x300/e5deff/6E59A5?text=Meditation",
    category: "relaxing",
    mood: "calm",
    audio: "/sounds/music/meditation.mp3"
    // Download from: https://pixabay.com/music/meditationspiritual-om-mantra-chanting-22225/
  },
  {
    id: "local2",
    title: "Morning Energy",
    artist: "Workout Mix",
    duration: "3:45",
    cover: "https://placehold.co/300x300/ffe5e5/A25959?text=Energy",
    category: "energizing",
    mood: "energetic",
    audio: "/sounds/music/energy.mp3"
    // Download from: https://pixabay.com/music/beautiful-uplifting-electronic-ambient-main-7673/
  },
  {
    id: "local3",
    title: "Deep Focus",
    artist: "Study Music",
    duration: "4:12",
    cover: "https://placehold.co/300x300/e5ffe5/59A259?text=Focus",
    category: "focus",
    mood: "calm",
    audio: "/sounds/music/focus.mp3"
    // Download from: https://pixabay.com/music/ambient-atmospheric-piano-with-drums-99692/
  },
  {
    id: "local4",
    title: "Sleep Well",
    artist: "Ambient Sounds",
    duration: "6:30",
    cover: "https://placehold.co/300x300/e5e5ff/5959A2?text=Sleep",
    category: "sleep",
    mood: "calm",
    audio: "/sounds/music/sleep.mp3"
    // Download from: https://pixabay.com/music/ambient-chill-step-calm-relaxing-music-for-videos-5686/
  },
  {
    id: "local5",
    title: "Bollywood Classics",
    artist: "Various Artists",
    duration: "4:15",
    cover: "https://placehold.co/300x300/fff5e5/A28559?text=Bollywood",
    category: "indian",
    mood: "romantic",
    audio: "/sounds/music/bollywood.mp3"
    // Download from: https://pixabay.com/music/world-indian-fusion-112837/
  }
];

// Karaoke songs with proper local paths
export const localKaraokeSongs: KaraokeSong[] = [
  {
    id: "k1",
    title: "Tum Hi Ho (Karaoke)",
    artist: "Arijit Singh",
    cover: "https://cdn-images.dzcdn.net/images/cover/d4914ccd414067cd5e2c108867079a85/500x500-000000-80-0-0.jpg",
    audio: "/sounds/karaoke/tum_hi_ho.mp3",
    lyrics: [
      { time: 0, text: "♪ Tum Hi Ho ♪" },
      { time: 4, text: "Hum tere bin ab reh nahi sakte" },
      { time: 8, text: "Tere bina kya wajood mera" },
      { time: 12, text: "Tujhse juda gar ho jaayenge" },
      { time: 16, text: "To khud se hi ho jaayenge judaa" },
      { time: 20, text: "Kyunki tum hi ho" },
      { time: 24, text: "Ab tum hi ho" },
      { time: 28, text: "Zindagi ab tum hi ho" }
    ]
    // Download from: https://pixabay.com/music/beautiful-sad-background-music-for-videos-5726/
  },
  {
    id: "k2",
    title: "Kal Ho Naa Ho (Karaoke)",
    artist: "Sonu Nigam",
    cover: "https://cdn-images.dzcdn.net/images/cover/855d71f6b31117fef4634cd696aaf78f/500x500-000000-80-0-0.jpg",
    audio: "/sounds/karaoke/kal_ho_naa_ho.mp3",
    lyrics: [
      { time: 0, text: "♪ Kal Ho Naa Ho ♪" },
      { time: 4, text: "Har pal yahan jee bhar jiyo" },
      { time: 8, text: "Jo hai samaa kal ho naa ho" },
      { time: 12, text: "Har pal yahan jee bhar jiyo" },
      { time: 16, text: "Jo hai samaa kal ho naa ho" },
      { time: 20, text: "Har pal yahan" },
      { time: 24, text: "Jo hai samaa" }
    ]
    // Download from: https://pixabay.com/music/beautiful-relaxing-145038/
  },
  {
    id: "k3",
    title: "Channa Mereya (Karaoke)",
    artist: "Arijit Singh",
    cover: "https://cdn-images.dzcdn.net/images/cover/394038089fa2b05873a913bae9a4f43b/500x500-000000-80-0-0.jpg",
    audio: "/sounds/karaoke/channa_mereya.mp3",
    lyrics: [
      { time: 0, text: "♪ Channa Mereya ♪" },
      { time: 4, text: "Acha chalta hoon duaon mein yaad rakhna" },
      { time: 8, text: "Mere zikr ka zubaan pe swaad rakhna" },
      { time: 12, text: "Dil ke sandookon mein mere acche kaam rakhna" },
      { time: 16, text: "Chit ke chithiyon mein meri thoodi si jagah rakhna" },
      { time: 20, text: "Channa mereya mereya" },
      { time: 24, text: "Channa mereya mereya" },
      { time: 28, text: "Channa mereya mereya beliya, oh!" }
    ]
    // Download from: https://pixabay.com/music/beautiful-relaxing-145038/
  },
  {
    id: "k4",
    title: "Gerua (Karaoke)",
    artist: "Arijit Singh",
    cover: "https://cdn-images.dzcdn.net/images/cover/feea67fdb5c27e77d4abbaa0dba2addd/500x500-000000-80-0-0.jpg",
    audio: "/sounds/karaoke/gerua.mp3",
    lyrics: [
      { time: 0, text: "♪ Gerua ♪" },
      { time: 4, text: "Rang de tu mohe gerua" },
      { time: 8, text: "Gerua Rang de" },
      { time: 12, text: "Rang de tu mohe gerua" },
      { time: 16, text: "Rishta hum apna boond ka" },
      { time: 20, text: "Madhumas se tujhko rang doon" },
      { time: 24, text: "Ishq mein kaise rang na doon" },
      { time: 28, text: "Mera saaya chhooke chhooke" }
    ]
    // Download from: https://pixabay.com/music/world-indian-fusion-112837/
  },
  {
    id: "k5",
    title: "Raabta (Karaoke)",
    artist: "Arijit Singh",
    cover: "https://cdn-images.dzcdn.net/images/cover/1ef811b41feb81c71f236beeaf34d54d/500x500-000000-80-0-0.jpg",
    audio: "/sounds/karaoke/raabta.mp3",
    lyrics: [
      { time: 0, text: "♪ Raabta ♪" },
      { time: 4, text: "Kehte hain khuda ne iss jahaan mein" },
      { time: 8, text: "Sabhi ke liye kisi na kisi ko hai banaya" },
      { time: 12, text: "Har kisi ke liye" },
      { time: 16, text: "Rab ne banaya ek hi saathi hai" },
      { time: 20, text: "Bas dekhna hai kahan pe milta hai" },
      { time: 24, text: "Tumko aur mujhko jeene ka sahaara" },
      { time: 28, text: "Khuda se zyaada tumhe na kahin maanga" }
    ]
    // Download from: https://pixabay.com/music/world-indian-fusion-112837/
  }
];

// Remedy meditation audio tracks
export const remedyAudioTracks = [
  {
    id: "remedy1",
    title: "Deep Breathing Exercise",
    audio: "/sounds/remedies/deep_breathing.mp3"
    // Download from: https://pixabay.com/music/meditationspiritual-om-mantra-chanting-22225/
  },
  {
    id: "remedy2",
    title: "Progressive Muscle Relaxation",
    audio: "/sounds/remedies/muscle_relaxation.mp3"
    // Download from: https://pixabay.com/music/ambient-chill-step-calm-relaxing-music-for-videos-5686/
  },
  {
    id: "remedy3",
    title: "Guided Visualization",
    audio: "/sounds/remedies/guided_visualization.mp3"
    // Download from: https://pixabay.com/music/beautiful-relaxing-145038/
  },
  {
    id: "remedy4",
    title: "Mindfulness Practice",
    audio: "/sounds/remedies/mindfulness.mp3"
    // Download from: https://pixabay.com/music/ambient-atmospheric-piano-with-drums-99692/
  }
];

// Meditation audio tracks with corresponding wallpapers
export const meditationTracks = [
  {
    id: "med1",
    title: "Om Meditation",
    description: "Ancient mantra for peace and clarity",
    audio: "/sounds/meditation/om_meditation.mp3",
    wallpaper: "/images/meditation/om_wallpaper.jpg"
    // Audio download from: https://pixabay.com/music/meditationspiritual-om-mantra-chanting-22225/
    // Image download from: https://unsplash.com/photos/om-symbol-on-black-background-nU1myuF4Z9c
  },
  {
    id: "med2",
    title: "Gayatri Mantra",
    description: "Sacred verse for enlightenment",
    audio: "/sounds/meditation/gayatri_mantra.mp3",
    wallpaper: "/images/meditation/gayatri_wallpaper.jpg"
    // Audio download from: https://pixabay.com/music/world-indian-fusion-112837/
    // Image download from: https://unsplash.com/photos/silhouette-of-person-sitting-on-rock-formation-during-sunset-a-vUhBNsAoY
  },
  {
    id: "med3",
    title: "Chakra Alignment",
    description: "Balance your energy centers",
    audio: "/sounds/meditation/chakra_alignment.mp3",
    wallpaper: "/images/meditation/chakra_wallpaper.jpg"
    // Audio download from: https://pixabay.com/music/meditationspiritual-peaceful-garden-healing-light-piano-amp-chimes-113897/
    // Image download from: https://unsplash.com/photos/seven-multicolored-chakra-symbols-JTxCldUehxc
  },
  {
    id: "med4",
    title: "Mindful Breathing",
    description: "Focus on the breath for present moment awareness",
    audio: "/sounds/meditation/mindful_breathing.mp3",
    wallpaper: "/images/meditation/breathing_wallpaper.jpg"
    // Audio download from: https://pixabay.com/music/meditationspiritual-relaxing-133991/
    // Image download from: https://unsplash.com/photos/silhouette-of-person-doing-yoga-during-golden-hour-near-body-of-water-NTyBbu66_SI
  }
];

// Test audio for checking if audio files are set up
export const testAudio = "/sounds/test-audio.mp3";
// Download a small test audio file from: https://pixabay.com/sound-effects/click-button-140881/
