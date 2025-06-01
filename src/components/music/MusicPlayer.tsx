import React from "react";
import { useMusicPlayer } from "../../hooks/useMusicPlayer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, SkipForward, SkipBack, Music as MusicIcon, Volume2, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

const MusicPlayer: React.FC = () => {
  const {
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
  } = useMusicPlayer();

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-mentii-100 to-lavender-100 rounded-lg p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-full md:w-auto md:flex-shrink-0">
            <div className="w-48 h-48 mx-auto relative">
              {currentTrack ? (
                <img 
                  src={currentTrack.cover} 
                  alt={currentTrack.title} 
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                />
              ) : (
                <div className="w-full h-full bg-mentii-200 rounded-lg flex items-center justify-center">
                  <MusicIcon className="h-16 w-16 text-mentii-500" />
                </div>
              )}
              <div className={`absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg ${!currentTrack ? 'opacity-0' : ''}`}>
                {isPlaying ? (
                  <div className="w-12 h-12 border-4 border-white rounded-full animate-spin border-t-transparent"></div>
                ) : null}
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full">
            <div className="mb-4 text-center md:text-left">
              <h3 className="text-xl font-bold truncate">
                {currentTrack?.title || "Select a track to play"}
              </h3>
              <p className="text-sm text-gray-600">
                {currentTrack?.artist || "Music player"}
              </p>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">0:00</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={handleProgressChange}
                  className="flex-1 h-2 bg-gray-200 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-mentii-500 cursor-pointer"
                />
                <span className="text-xs text-gray-600">{currentTrack?.duration || "0:00"}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center md:justify-between">
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={playPrevTrack}
                  disabled={!currentTrack}
                  className="p-2 text-gray-600 hover:text-mentii-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SkipBack className="h-6 w-6" />
                </button>
                
                <button
                  onClick={togglePlayPause}
                  disabled={!currentTrack}
                  className="p-4 bg-mentii-500 text-white rounded-full hover:bg-mentii-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6" />
                  )}
                </button>
                
                <button
                  onClick={playNextTrack}
                  disabled={!currentTrack}
                  className="p-2 text-gray-600 hover:text-mentii-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SkipForward className="h-6 w-6" />
                </button>
              </div>
              
              <div className="hidden md:flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-gray-600" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-24 h-2 bg-gray-200 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-mentii-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <audio ref={audioRef} className="hidden" />
      <audio ref={previewAudioRef} className="hidden" />
      
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-1/2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by song or artist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(searchQuery)}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button 
            variant={moodFilter === "happy" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setMoodFilter(moodFilter === "happy" ? null : "happy")}
          >
            Happy
          </Button>
          <Button 
            variant={moodFilter === "sad" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setMoodFilter(moodFilter === "sad" ? null : "sad")}
          >
            Sad
          </Button>
          <Button 
            variant={moodFilter === "romantic" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setMoodFilter(moodFilter === "romantic" ? null : "romantic")}
          >
            Romantic
          </Button>
          <Button 
            variant={moodFilter === "energetic" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setMoodFilter(moodFilter === "energetic" ? null : "energetic")}
          >
            Energetic
          </Button>
          <Button 
            variant={moodFilter === "calm" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setMoodFilter(moodFilter === "calm" ? null : "calm")}
          >
            Calm
          </Button>
          
          {(searchQuery || moodFilter) && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
            >
              Clear filters
            </Button>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="grid grid-cols-6 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="indian">Indian</TabsTrigger>
          <TabsTrigger value="relaxing">Relaxing</TabsTrigger>
          <TabsTrigger value="energizing">Energizing</TabsTrigger>
          <TabsTrigger value="focus">Focus</TabsTrigger>
          <TabsTrigger value="sleep">Sleep</TabsTrigger>
        </TabsList>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array(8).fill(0).map((_, idx) => (
              <Card key={idx} className="overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <CardHeader className="p-3">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <TabsContent value="all" className="m-0">
              {filteredTracks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredTracks.map(track => (
                    <Card 
                      key={track.id} 
                      className={`overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${
                        currentTrack?.id === track.id ? 'ring-2 ring-mentii-500' : ''
                      }`}
                      onClick={() => playTrack(track)}
                      onMouseEnter={() => previewTrackOnHover(track)}
                      onMouseLeave={stopPreview}
                    >
                      <div className="aspect-square relative">
                        <img 
                          src={track.cover} 
                          alt={track.title} 
                          className="w-full h-full object-cover"
                        />
                        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                          previewTrack?.id === track.id || (currentTrack?.id === track.id && isPlaying) 
                            ? 'opacity-100' 
                            : 'opacity-0 hover:opacity-100'
                        }`}>
                          <div className="bg-white/90 rounded-full p-3">
                            {currentTrack?.id === track.id && isPlaying ? (
                              <Pause className="h-6 w-6 text-mentii-600" />
                            ) : (
                              <Play className="h-6 w-6 text-mentii-600" />
                            )}
                          </div>
                        </div>
                      </div>
                      <CardHeader className="p-3">
                        <CardTitle className="text-base truncate">{track.title}</CardTitle>
                        <CardDescription className="text-xs truncate">{track.artist}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg text-gray-500">No songs found matching your search.</p>
                  <Button variant="outline" className="mt-4" onClick={clearFilters}>
                    Clear filters
                  </Button>
                </div>
              )}
            </TabsContent>
            
            {["indian", "relaxing", "energizing", "focus", "sleep"].map(category => (
              <TabsContent key={category} value={category} className="m-0">
                {filteredTracks.filter(track => track.category === category).length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredTracks
                      .filter(track => track.category === category)
                      .map(track => (
                        <Card 
                          key={track.id} 
                          className={`overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${
                            currentTrack?.id === track.id ? 'ring-2 ring-mentii-500' : ''
                          }`}
                          onClick={() => playTrack(track)}
                          onMouseEnter={() => previewTrackOnHover(track)}
                          onMouseLeave={stopPreview}
                        >
                          <div className="aspect-square relative">
                            <img 
                              src={track.cover} 
                              alt={track.title} 
                              className="w-full h-full object-cover"
                            />
                            <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                              previewTrack?.id === track.id || (currentTrack?.id === track.id && isPlaying) 
                                ? 'opacity-100' 
                                : 'opacity-0 hover:opacity-100'
                            }`}>
                              <div className="bg-white/90 rounded-full p-3">
                                {currentTrack?.id === track.id && isPlaying ? (
                                  <Pause className="h-6 w-6 text-mentii-600" />
                                ) : (
                                  <Play className="h-6 w-6 text-mentii-600" />
                                )}
                              </div>
                            </div>
                          </div>
                          <CardHeader className="p-3">
                            <CardTitle className="text-base truncate">{track.title}</CardTitle>
                            <CardDescription className="text-xs truncate">{track.artist}</CardDescription>
                          </CardHeader>
                        </Card>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-lg text-gray-500">No {category} songs found matching your search.</p>
                    <Button variant="outline" className="mt-4" onClick={clearFilters}>
                      Clear filters
                    </Button>
                  </div>
                )}
              </TabsContent>
            ))}
          </>
        )}
      </Tabs>
    </div>
  );
};

export default MusicPlayer;
