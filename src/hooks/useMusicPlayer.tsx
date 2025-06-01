
import { useState, useRef, useEffect } from "react";
import { Track, fetchDeezerTracks } from "../services/musicService";
import { localMusicTracks } from "../services/audioService";
import { toast } from "sonner";

export function useMusicPlayer() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [moodFilter, setMoodFilter] = useState<string | null>(null);
  const [previewTrack, setPreviewTrack] = useState<Track | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  // Load tracks from local files first, then API as fallback
  useEffect(() => {
    const loadTracks = async () => {
      setIsLoading(true);
      try {
        // First try to use our local tracks
        if (localMusicTracks && localMusicTracks.length > 0) {
          setTracks(localMusicTracks);
          console.log("Using local music tracks");
        } else {
          // Fallback to API
          const fetchedTracks = await fetchDeezerTracks();
          setTracks(fetchedTracks);
        }
      } catch (error) {
        console.error("Failed to load tracks:", error);
        toast.error("Failed to load music tracks. Using local tracks.");
        setTracks(localMusicTracks || []); // Use local tracks as fallback
      } finally {
        setIsLoading(false);
      }
    };

    loadTracks();

    // Cleanup function
    return () => {
      if (progressIntervalRef.current) {
        window.clearInterval(progressIntervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
    };
  }, []);

  // Handle search with API
  const handleSearch = async (query: string) => {
    if (query.trim() === "" && searchQuery === "") return;
    
    setIsLoading(true);
    try {
      // If we have local tracks, filter them by query
      if (localMusicTracks && localMusicTracks.length > 0) {
        const filteredTracks = localMusicTracks.filter(track => 
          track.title.toLowerCase().includes(query.toLowerCase()) || 
          track.artist.toLowerCase().includes(query.toLowerCase())
        );
        setTracks(filteredTracks.length > 0 ? filteredTracks : localMusicTracks);
      } else {
        // Fallback to API
        const fetchedTracks = await fetchDeezerTracks(query || "Bollywood Songs");
        setTracks(fetchedTracks);
      }
      setSearchQuery(query);
    } catch (error) {
      console.error("Search failed:", error);
      toast.error("Search failed. Please try a different query.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const playTrack = (track: Track) => {
    // Stop any preview that might be playing
    stopPreview();
    
    if (currentTrack?.id === track.id) {
      togglePlayPause();
      return;
    }
    
    setCurrentTrack(track);
    setIsPlaying(true);
    
    if (audioRef.current) {
      audioRef.current.src = track.audio;
      audioRef.current.volume = volume / 100;
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
        toast.error("Could not play this track. Please try another.");
        setIsPlaying(false);
      });
      
      startProgressInterval();
    }
  };
  
  const togglePlayPause = () => {
    if (!currentTrack || !audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      if (progressIntervalRef.current) {
        window.clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    } else {
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
        toast.error("Could not play this track. Please try another.");
      });
      startProgressInterval();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  // Preview functionality on hover
  const previewTrackOnHover = (track: Track) => {
    // Don't preview if it's the current track that's already playing
    if (currentTrack?.id === track.id && isPlaying) return;
    
    setPreviewTrack(track);
    
    if (previewAudioRef.current) {
      previewAudioRef.current.volume = 0.3; // Lower volume for preview
      previewAudioRef.current.src = track.audio;
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
    setPreviewTrack(null);
  };
  
  const startProgressInterval = () => {
    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
    }
    
    progressIntervalRef.current = window.setInterval(() => {
      if (audioRef.current) {
        const percentage = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setProgress(isNaN(percentage) ? 0 : percentage);
        
        if (audioRef.current.ended) {
          playNextTrack();
        }
      }
    }, 1000);
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };
  
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseInt(e.target.value);
    setProgress(newProgress);
    
    if (audioRef.current) {
      audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
    }
  };
  
  const playNextTrack = () => {
    if (!currentTrack || tracks.length === 0) return;
    
    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    playTrack(tracks[nextIndex]);
  };
  
  const playPrevTrack = () => {
    if (!currentTrack || tracks.length === 0) return;
    
    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    playTrack(tracks[prevIndex]);
  };

  const filteredTracks = tracks.filter(track => {
    const matchesSearch = 
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      track.artist.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesMood = moodFilter ? track.mood === moodFilter : true;
    
    return matchesSearch && matchesMood;
  });
  
  const clearFilters = () => {
    setSearchQuery("");
    setMoodFilter(null);
  };

  return {
    tracks,
    currentTrack,
    isPlaying,
    volume,
    progress,
    searchQuery,
    moodFilter,
    isLoading,
    previewTrack,
    audioRef,
    previewAudioRef,
    filteredTracks,
    setSearchQuery,
    setMoodFilter,
    playTrack,
    togglePlayPause,
    handleVolumeChange,
    handleProgressChange,
    playNextTrack,
    playPrevTrack,
    clearFilters,
    handleSearch,
    previewTrackOnHover,
    stopPreview
  };
}
