import { toast } from "sonner";

export interface DeezerTrack {
  id: number;
  title: string;
  duration: number;
  preview: string; // 30 second preview URL
  artist: {
    id: number;
    name: string;
  };
  album: {
    id: number;
    title: string;
    cover: string;
    cover_small: string;
    cover_medium: string;
    cover_big: string;
  };
}

export interface DeezerResponse {
  data: DeezerTrack[];
  total: number;
  next?: string;
}

// Convert Deezer track to our app's track format
export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  cover: string;
  category?: "relaxing" | "energizing" | "focus" | "sleep" | "indian";
  mood?: "happy" | "sad" | "romantic" | "energetic" | "calm";
  audio: string;
}

// Mock data for when API fails to return results
const mockTracks: Track[] = [
  {
    id: "mock1",
    title: "Tum Hi Ho",
    artist: "Arijit Singh",
    duration: "4:22",
    cover: "https://cdn-images.dzcdn.net/images/cover/d4914ccd414067cd5e2c108867079a85/500x500-000000-80-0-0.jpg",
    category: "indian",
    mood: "romantic",
    audio: "https://cdnt-preview.dzcdn.net/api/1/1/9/5/1/0/9515c6b5adb0bf7be221b43cbf50a9c5.mp3"
  },
  {
    id: "mock2",
    title: "Kun Faya Kun",
    artist: "A.R. Rahman",
    duration: "5:11",
    cover: "https://cdn-images.dzcdn.net/images/cover/855d71f6b31117fef4634cd696aaf78f/500x500-000000-80-0-0.jpg",
    category: "indian",
    mood: "calm",
    audio: "https://cdnt-preview.dzcdn.net/api/1/1/7/1/9/0/719490e9619802a8ae25c13f6d62b44d.mp3"
  },
  {
    id: "mock3",
    title: "Jai Ho",
    artist: "A.R. Rahman",
    duration: "3:42",
    cover: "https://cdn-images.dzcdn.net/images/cover/394038089fa2b05873a913bae9a4f43b/500x500-000000-80-0-0.jpg",
    category: "indian",
    mood: "energetic",
    audio: "https://cdnt-preview.dzcdn.net/api/1/1/7/7/1/0/7718909d92433d675c52db12d70fb9be.mp3"
  },
  {
    id: "mock4",
    title: "Channa Mereya",
    artist: "Arijit Singh",
    duration: "4:49",
    cover: "https://cdn-images.dzcdn.net/images/cover/feea67fdb5c27e77d4abbaa0dba2addd/500x500-000000-80-0-0.jpg",
    category: "indian",
    mood: "sad",
    audio: "https://cdnt-preview.dzcdn.net/api/1/1/9/5/1/0/9515c6b5adb0bf7be221b43cbf50a9c5.mp3"
  },
  {
    id: "mock5",
    title: "Lag Ja Gale",
    artist: "Lata Mangeshkar",
    duration: "3:13",
    cover: "https://cdn-images.dzcdn.net/images/cover/1ef811b41feb81c71f236beeaf34d54d/500x500-000000-80-0-0.jpg",
    category: "indian",
    mood: "romantic",
    audio: "https://cdnt-preview.dzcdn.net/api/1/1/2/8/8/0/2880aa4091b307e2839a145f17b2a85c.mp3"
  },
  {
    id: "mock6",
    title: "Calm Piano Music",
    artist: "Relaxing Music",
    duration: "3:20",
    cover: "https://placehold.co/300x300/e5deff/6E59A5?text=Calm+Piano",
    category: "relaxing",
    mood: "calm",
    audio: "https://cdnt-preview.dzcdn.net/api/1/1/7/9/d/0/79dac7554491493df98c3cd9d11f2e23.mp3"
  },
  {
    id: "mock7",
    title: "Energetic Workout",
    artist: "Fitness Music",
    duration: "2:45",
    cover: "https://placehold.co/300x300/ffe5e5/A25959?text=Workout+Mix",
    category: "energizing",
    mood: "energetic",
    audio: "https://cdnt-preview.dzcdn.net/api/1/1/7/9/d/0/79dac7554491493df98c3cd9d11f2e23.mp3"
  },
  {
    id: "mock8",
    title: "Study Focus",
    artist: "Study Music",
    duration: "4:05",
    cover: "https://placehold.co/300x300/e5ffe5/59A259?text=Study+Focus",
    category: "focus",
    mood: "calm",
    audio: "https://cdnt-preview.dzcdn.net/api/1/1/7/7/1/0/7718909d92433d675c52db12d70fb9be.mp3"
  },
  {
    id: "mock9",
    title: "Sleep Melodies",
    artist: "Sleep Music",
    duration: "5:30",
    cover: "https://placehold.co/300x300/e5e5ff/5959A2?text=Sleep+Melodies",
    category: "sleep",
    mood: "calm",
    audio: "https://cdnt-preview.dzcdn.net/api/1/1/9/5/1/0/9515c6b5adb0bf7be221b43cbf50a9c5.mp3"
  }
];

export const fetchDeezerTracks = async (query: string = "Bollywood Songs, Arijit Singh, Rap Songs, Indian Songs, Bhajans"): Promise<Track[]> => {
  const url = `https://deezerdevs-deezer.p.rapidapi.com/search?q=${encodeURIComponent(query)}`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': 'be9d0edea2mshedd35281eab4f29p181e78jsnfff0139e5c88',
      'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const result: DeezerResponse = await response.json();
    
    if (!result.data || !Array.isArray(result.data) || result.data.length === 0) {
      console.log("API returned empty results, using mock data");
      return mockTracks;
    }

    // Convert Deezer tracks to our app's format
    return result.data.map(track => ({
      id: track.id.toString(),
      title: track.title,
      artist: track.artist.name,
      duration: formatDuration(track.duration),
      cover: track.album.cover_medium || `https://placehold.co/300x300/e5deff/6E59A5?text=${encodeURIComponent(track.title)}`,
      category: categorizeTrack(track),
      mood: determineTrackMood(track),
      audio: track.preview
    }));
  } catch (error) {
    console.error("Error fetching music:", error);
    toast.error("Using local music collection due to API limitation.");
    return mockTracks;
  }
};

// Helper function to format duration from seconds to mm:ss
const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

// Helper functions for track categorization and mood determination
const categorizeTrack = (track: DeezerTrack): "relaxing" | "energizing" | "focus" | "sleep" | "indian" => {
  const title = track.title.toLowerCase();
  const artist = track.artist.name.toLowerCase();
  
  if (artist.includes("arijit") || 
      title.includes("bollywood") || 
      artist.includes("singh") || 
      title.includes("indian")) {
    return "indian";
  }
  
  if (title.includes("relax") || 
      title.includes("calm") || 
      title.includes("peace")) {
    return "relaxing";
  }
  
  if (title.includes("energy") || 
      title.includes("workout") || 
      title.includes("dance") || 
      title.includes("party")) {
    return "energizing";
  }
  
  if (title.includes("study") || 
      title.includes("focus") || 
      title.includes("concentrate")) {
    return "focus";
  }
  
  if (title.includes("sleep") || 
      title.includes("night") || 
      title.includes("dream")) {
    return "sleep";
  }
  
  // Default category based on randomization
  const categories: ("relaxing" | "energizing" | "focus" | "sleep" | "indian")[] = 
    ["relaxing", "energizing", "focus", "sleep", "indian"];
  return categories[Math.floor(Math.random() * categories.length)];
};

const determineTrackMood = (track: DeezerTrack): "happy" | "sad" | "romantic" | "energetic" | "calm" => {
  const title = track.title.toLowerCase();
  
  if (title.includes("love") || 
      title.includes("romance") || 
      title.includes("heart")) {
    return "romantic";
  }
  
  if (title.includes("happy") || 
      title.includes("joy") || 
      title.includes("fun")) {
    return "happy";
  }
  
  if (title.includes("sad") || 
      title.includes("tear") || 
      title.includes("pain")) {
    return "sad";
  }
  
  if (title.includes("energy") || 
      title.includes("dance") || 
      title.includes("party")) {
    return "energetic";
  }
  
  if (title.includes("calm") || 
      title.includes("peace") || 
      title.includes("relax")) {
    return "calm";
  }
  
  // Default mood based on randomization
  const moods: ("happy" | "sad" | "romantic" | "energetic" | "calm")[] = 
    ["happy", "sad", "romantic", "energetic", "calm"];
  return moods[Math.floor(Math.random() * moods.length)];
};

// Karaoke mock data
const karaokeMockSongs = [
  {
    id: "k1",
    title: "Tum Hi Ho (Karaoke)",
    artist: "Arijit Singh",
    cover: "https://cdn-images.dzcdn.net/images/cover/d4914ccd414067cd5e2c108867079a85/500x500-000000-80-0-0.jpg",
    audio: "https://cdnt-preview.dzcdn.net/api/1/1/9/5/1/0/9515c6b5adb0bf7be221b43cbf50a9c5.mp3",
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
  },
  {
    id: "k2",
    title: "Kal Ho Naa Ho (Karaoke)",
    artist: "Sonu Nigam",
    cover: "https://cdn-images.dzcdn.net/images/cover/855d71f6b31117fef4634cd696aaf78f/500x500-000000-80-0-0.jpg",
    audio: "https://cdnt-preview.dzcdn.net/api/1/1/7/1/9/0/719490e9619802a8ae25c13f6d62b44d.mp3",
    lyrics: [
      { time: 0, text: "♪ Kal Ho Naa Ho ♪" },
      { time: 4, text: "Har pal yahan jee bhar jiyo" },
      { time: 8, text: "Jo hai samaa kal ho naa ho" },
      { time: 12, text: "Har pal yahan jee bhar jiyo" },
      { time: 16, text: "Jo hai samaa kal ho naa ho" },
      { time: 20, text: "Har pal yahan" },
      { time: 24, text: "Jo hai samaa" }
    ]
  },
  {
    id: "k3",
    title: "Channa Mereya (Karaoke)",
    artist: "Arijit Singh",
    cover: "https://cdn-images.dzcdn.net/images/cover/394038089fa2b05873a913bae9a4f43b/500x500-000000-80-0-0.jpg",
    audio: "https://cdnt-preview.dzcdn.net/api/1/1/7/7/1/0/7718909d92433d675c52db12d70fb9be.mp3",
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
  },
  {
    id: "k4",
    title: "Gerua (Karaoke)",
    artist: "Arijit Singh",
    cover: "https://cdn-images.dzcdn.net/images/cover/feea67fdb5c27e77d4abbaa0dba2addd/500x500-000000-80-0-0.jpg",
    audio: "https://cdnt-preview.dzcdn.net/api/1/1/9/5/1/0/9515c6b5adb0bf7be221b43cbf50a9c5.mp3",
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
  },
  {
    id: "k5",
    title: "Raabta (Karaoke)",
    artist: "Arijit Singh",
    cover: "https://cdn-images.dzcdn.net/images/cover/1ef811b41feb81c71f236beeaf34d54d/500x500-000000-80-0-0.jpg",
    audio: "https://cdnt-preview.dzcdn.net/api/1/1/2/8/8/0/2880aa4091b307e2839a145f17b2a85c.mp3",
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
  }
];

// Function to fetch tracks specifically for karaoke
export const fetchKaraokeTracks = async (): Promise<any[]> => {
  try {
    // Use API call first
    const tracks = await fetchDeezerTracks("karaoke songs, popular songs, bollywood karaoke");
    
    // If API returns data, add our lyrics
    if (tracks && tracks.length > 0 && tracks[0].id !== "mock1") {
      return tracks.map(track => ({
        id: track.id,
        title: track.title + " (Karaoke)",
        artist: track.artist,
        cover: track.cover,
        audio: track.audio,
        lyrics: generateLyrics(track.title, track.duration)
      }));
    } else {
      // Use our mock karaoke data
      return karaokeMockSongs;
    }
  } catch (error) {
    console.error("Error fetching karaoke tracks:", error);
    return karaokeMockSongs;
  }
};

// Generate lyrics for karaoke (if API doesn't provide lyrics)
const generateLyrics = (title: string, duration: string): {time: number, text: string}[] => {
  return karaokeMockSongs[0].lyrics; // Fallback to our mock lyrics
};
