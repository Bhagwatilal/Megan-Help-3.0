
import React from "react";
import { useKaraoke, KaraokeSong } from "../../hooks/useKaraoke";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mic, Search, Play, Pause } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const KaraokeSection: React.FC = () => {
  const {
    filteredSongs,
    isPerforming,
    selectedSong,
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
  } = useKaraoke();

  const { prev, current, next } = getLyricsDisplay();

  return (
    <div className="space-y-6">
      <audio ref={audioRef} className="hidden" />
      <audio ref={previewAudioRef} className="hidden" />
      
      {isPerforming ? (
        <div className="relative overflow-hidden bg-gradient-to-r from-sunset-100 to-mentii-100 rounded-lg p-8 text-center">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">{selectedSong?.title}</h3>
            <p className="text-lg mb-8">by {selectedSong?.artist}</p>
            
            <div className="w-full h-2 bg-white/30 rounded-full mb-12">
              <div 
                className="h-full bg-white rounded-full transition-all duration-200"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            
            <div className="space-y-4">
              <p className="text-white/60 text-lg">{prev}</p>
              <p className="text-white text-2xl font-bold animate-pulse">{current}</p>
              <p className="text-white/60 text-lg">{next}</p>
            </div>
            
            <Button 
              className="mt-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30"
              size="lg"
              onClick={endKaraoke}
            >
              End Performance
            </Button>
          </div>
          
          <div className="absolute bottom-4 right-4 text-white/70 animate-bounce">
            <Mic className="h-10 w-10" />
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-sunset-100 to-mentii-100 rounded-lg p-8 text-center">
          <Mic className="h-12 w-12 mx-auto mb-4 text-sunset-500" />
          <h3 className="text-2xl font-bold mb-2">Karaoke Mode</h3>
          <p className="text-gray-700 mb-6">Sing along to your favorite songs and boost your mood!</p>
          
          <div className="relative w-full max-w-md mx-auto mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search for a song or artist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}
      
      {!isPerforming && (
        isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, idx) => (
              <Card key={idx} className="overflow-hidden">
                <Skeleton className="aspect-video w-full" />
                <CardHeader>
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSongs.length > 0 ? (
              filteredSongs.map(song => (
                <Card 
                  key={song.id} 
                  className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer hover:scale-105 transform duration-200"
                  onClick={() => startKaraoke(song)}
                  onMouseEnter={() => previewSongOnHover(song)}
                  onMouseLeave={stopPreview}
                >
                  <div className="aspect-video relative bg-gradient-to-r from-mentii-50 to-sunset-50">
                    <img 
                      src={song.cover} 
                      alt={song.title} 
                      className="w-full h-full object-cover opacity-90"
                    />
                    <div className={`absolute inset-0 flex items-center justify-center ${
                      previewSong?.id === song.id ? 'opacity-100 bg-black/50' : 'opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/50'
                    }`}>
                      <div className="bg-white/90 rounded-full p-4">
                        {previewSong?.id === song.id ? (
                          <Pause className="h-8 w-8 text-mentii-600" />
                        ) : (
                          <Mic className="h-8 w-8 text-mentii-600" />
                        )}
                      </div>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle>{song.title}</CardTitle>
                    <CardDescription>by {song.artist}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <button className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 py-2 rounded-md transition-colors">
                      <Mic className="h-4 w-4" />
                      <span>Start Singing</span>
                    </button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-lg text-gray-500">No songs found matching your search.</p>
                <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
                  Clear search
                </Button>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default KaraokeSection;
