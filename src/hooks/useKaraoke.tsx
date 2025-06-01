
import { useState, useRef, useEffect } from "react";
import { fetchKaraokeTracks } from "../services/musicService";
import { localKaraokeSongs } from "../services/audioService";
import { toast } from "sonner";

export interface KaraokeSong {
  id: string;
  title: string;
  artist: string;
  cover: string;
  audio: string;
  lyrics: LyricLine[];
}

export interface LyricLine {
  time: number;
  text: string;
}

export function useKaraoke() {
  const [songs, setSongs] = useState<KaraokeSong[]>([]);
  const [isPerforming, setIsPerforming] = useState(false);
  const [selectedSong, setSelectedSong] = useState<KaraokeSong | null>(null);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [previewSong, setPreviewSong] = useState<KaraokeSong | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<number | null>(null);
  
  // Load karaoke songs from local files first, then try API as fallback
  useEffect(() => {
    const loadSongs = async () => {
      setIsLoading(true);
      try {
        // First use our local karaoke songs
        if (localKaraokeSongs && localKaraokeSongs.length > 0) {
          setSongs(localKaraokeSongs);
          console.log("Using local karaoke songs");
        } else {
          // Fallback to API
          const fetchedSongs = await fetchKaraokeTracks();
          setSongs(fetchedSongs);
        }
      } catch (error) {
        console.error("Failed to load karaoke songs:", error);
        toast.error("Failed to load karaoke songs. Using fallback songs.");
        setSongs(localKaraokeSongs); // Use local songs as fallback
      } finally {
        setIsLoading(false);
      }
    };

    loadSongs();

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
    };
  }, []);

  // Hover to preview song
  const previewSongOnHover = (song: KaraokeSong) => {
    // Don't preview if it's the currently performing song
    if (selectedSong?.id === song.id && isPerforming) return;
    
    setPreviewSong(song);
    
    if (previewAudioRef.current) {
      previewAudioRef.current.volume = 0.3; // Lower volume for preview
      previewAudioRef.current.src = song.audio;
      previewAudioRef.current.currentTime = 0;
      previewAudioRef.current.play().catch(error => {
        console.error("Error playing preview:", error);
      });
    }
  };
  
  const stopPreview = () => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
    }
    setPreviewSong(null);
  };
  
  const startKaraoke = (song: KaraokeSong) => {
    // Stop any preview that might be playing
    stopPreview();
    
    setSelectedSong(song);
    setCurrentLyricIndex(0);
    setProgressPercent(0);
    setIsPerforming(true);
    
    if (audioRef.current) {
      audioRef.current.src = song.audio;
      audioRef.current.volume = 0.3; // Lower volume for karaoke
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
        toast.error("Could not start karaoke. Please try another song.");
        setIsPerforming(false);
      });
      
      // Start lyrics update interval
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
      
      intervalRef.current = window.setInterval(() => {
        if (audioRef.current) {
          const currentTime = audioRef.current.currentTime;
          const duration = audioRef.current.duration;
          
          // Update progress
          const percentage = (currentTime / duration) * 100;
          setProgressPercent(isNaN(percentage) ? 0 : percentage);
          
          // Update current lyric index
          if (song.lyrics && song.lyrics.length > 0) {
            const nextIndex = song.lyrics.findIndex(lyric => lyric.time > currentTime);
            if (nextIndex === -1) {
              setCurrentLyricIndex(song.lyrics.length - 1);
            } else if (nextIndex > 0) {
              setCurrentLyricIndex(nextIndex - 1);
            } else {
              setCurrentLyricIndex(0);
            }
          }
          
          // End of song
          if (audioRef.current.ended) {
            endKaraoke();
          }
        }
      }, 200);
    }
    
    toast.success(`Karaoke started: ${song.title}`);
  };
  
  const endKaraoke = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setIsPerforming(false);
    toast.success("Great performance! 🎤");
  };
  
  const getLyricsDisplay = () => {
    if (!selectedSong || !selectedSong.lyrics) return { prev: "", current: "", next: "" };
    
    const current = selectedSong.lyrics[currentLyricIndex]?.text || "";
    const prev = currentLyricIndex > 0 ? selectedSong.lyrics[currentLyricIndex - 1]?.text : "";
    const next = currentLyricIndex < selectedSong.lyrics.length - 1 
      ? selectedSong.lyrics[currentLyricIndex + 1]?.text 
      : "";
    
    return { prev, current, next };
  };
  
  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return {
    songs,
    filteredSongs,
    isPerforming,
    selectedSong,
    currentLyricIndex,
    progressPercent,
    searchQuery,
    isLoading,
    previewSong,
    audioRef,
    previewAudioRef,
    setSearchQuery,
    startKaraoke,
    endKaraoke,
    getLyricsDisplay,
    previewSongOnHover,
    stopPreview
  };
}
