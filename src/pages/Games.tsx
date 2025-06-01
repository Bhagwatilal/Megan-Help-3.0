import React, { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ChatbotPreview from "../components/ui/ChatbotPreview";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Gamepad2, Award, Clock, Shuffle, Puzzle, Palette } from "lucide-react";
import BubblePopGame from "../components/games/BubblePopGame";
import ColorPsychology from "../components/games/ColorPsychology";
import SnakeGame from "../components/games/SnakeGame";
import TetrisGame from "../components/games/TetrisGame";
import MemoryMatch from "../components/games/MemoryMatch";
import WordScramble from "../components/games/WordScramble";
import ReactionTest from "../components/games/ReactionTest";
import ColorMatch from "../components/games/ColorMatch";
import MathChallenge from "../components/games/MathChallenge";
import SpaceInvadersGame from "../components/games/SpaceInvadersGame";
import PacManGame from "../components/games/PacManGame";
import PongChallenge from "../components/games/PongChallenge";
import PinballClassic from "../components/games/PinballClassic";


interface Game {
  id: string;
  title: string;
  description: string;
  image: string;
  difficulty: "easy" | "medium" | "hard";
  category: "memory" | "reaction" | "puzzle" | "psychology";
  popular: boolean;
}

const GameCard: React.FC<{ game: Game; onPlay: (id: string) => void }> = ({ game, onPlay }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative">
        <img src={game.image} alt={game.title} className="w-full h-48 object-cover" />
        {game.popular && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            Popular
          </div>
        )}
        <div className={`absolute bottom-2 left-2 text-xs ${
          game.difficulty === "easy" ? "bg-green-500" : 
          game.difficulty === "medium" ? "bg-yellow-500" : "bg-red-500"
        } text-white px-2 py-1 rounded-full`}>
          {game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1)}
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle>{game.title}</CardTitle>
        <CardDescription>{game.description}</CardDescription>
      </CardHeader>
      
      <CardFooter className="pt-0">
        <button 
          onClick={() => onPlay(game.id)} 
          className="w-full bg-mentii-500 hover:bg-mentii-600 text-white py-2 rounded-md flex items-center justify-center gap-2 transition-colors"
        >
          <Gamepad2 className="h-4 w-4" />
          Play Now
        </button>
      </CardFooter>
    </Card>
  );
};

const Games: React.FC = () => {
  const [filter, setFilter] = useState<string>("all");
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [highScores, setHighScores] = useState<Record<string, number>>({});
  
  const games: Game[] = [
    {
      id: "bubble-pop",
      title: "Bubble Pop",
      description: "Pop as many bubbles as you can before time runs out!",
      image: "https://placehold.co/800x600/99a9ff/1A1F2C?text=Bubble+Pop",
      difficulty: "easy",
      category: "reaction",
      popular: true
    },
    {
      id: "color-psychology",
      title: "Color Psychology",
      description: "Learn how colors affect your emotions and thoughts",
      image: "https://placehold.co/800x600/ff9ee5/1A1F2C?text=Color+Psychology",
      difficulty: "medium",
      category: "psychology",
      popular: true
    },
    {
      id: "memory-match",
      title: "Memory Match",
      description: "Find matching pairs of cards in this classic memory game.",
      image: "https://placehold.co/800x600/ffc285/1A1F2C?text=Memory+Match",
      difficulty: "medium",
      category: "memory",
      popular: false
    },
    {
      id: "word-scramble",
      title: "Word Scramble",
      description: "Unscramble letters to form words against the clock.",
      image: "https://placehold.co/800x600/a2ff99/1A1F2C?text=Word+Scramble",
      difficulty: "hard",
      category: "puzzle",
      popular: true
    },
    {
      id: "reaction-test",
      title: "Reaction Test",
      description: "Test your reflexes with this quick reaction game.",
      image: "https://placehold.co/800x600/ff99e5/1A1F2C?text=Reaction+Test",
      difficulty: "easy",
      category: "reaction",
      popular: false
    },
    {
      id: "color-match",
      title: "Color Match",
      description: "Match colors quickly before they change.",
      image: "https://placehold.co/800x600/fffa99/1A1F2C?text=Color+Match",
      difficulty: "medium",
      category: "memory",
      popular: false
    },
    {
      id: "math-challenge",
      title: "Math Challenge",
      description: "Solve math problems as fast as you can.",
      image: "https://placehold.co/800x600/99fffa/1A1F2C?text=Math+Challenge",
      difficulty: "hard",
      category: "puzzle",
      popular: false
    },
    {
      id: "tetris-classic",
      title: "Tetris Classic",
      description: "Arrange falling blocks to create complete lines in this timeless classic.",
      image: "https://placehold.co/800x600/99e5ff/1A1F2C?text=Tetris+Classic",
      difficulty: "medium",
      category: "puzzle",
      popular: true
    },
    {
      id: "snake-game",
      title: "Snake Game",
      description: "Control a snake to eat apples and grow without hitting walls or yourself.",
      image: "https://placehold.co/800x600/a9ff99/1A1F2C?text=Snake+Game",
      difficulty: "easy",
      category: "reaction",
      popular: true
    },
    {
      id: "space-invaders",
      title: "Space Invaders",
      description: "Defend Earth from descending alien ships in this arcade classic.",
      image: "https://placehold.co/800x600/ffb099/1A1F2C?text=Space+Invaders",
      difficulty: "medium",
      category: "reaction",
      popular: true
    },
    {
      id: "pinball-classic",
      title: "Pinball Classic",
      description: "Keep the ball in play and rack up points in this virtual pinball machine.",
      image: "https://placehold.co/800x600/e5ff99/1A1F2C?text=Pinball+Classic",
      difficulty: "medium",
      category: "reaction",
      popular: false
    },
    {
      id: "pacman-maze",
      title: "Pac-Man Maze",
      description: "Navigate mazes and eat dots while avoiding colorful ghosts.",
      image: "https://placehold.co/800x600/ff99c7/1A1F2C?text=Pac-Man+Maze",
      difficulty: "medium",
      category: "puzzle",
      popular: true
    },
    {
      id: "pong-challenge",
      title: "Pong Challenge",
      description: "The original video game! Bounce the ball past your opponent's paddle.",
      image: "https://placehold.co/800x600/99ffd5/1A1F2C?text=Pong+Challenge",
      difficulty: "easy",
      category: "reaction",
      popular: false
    }
  ];
  
  const handlePlayGame = (id: string) => {
    setActiveGame(id);
  };
  
  const handleBackToGames = () => {
    setActiveGame(null);
  };
  
  const handleScore = (score: number) => {
    setHighScores(prev => {
      if (!activeGame) return prev;
      const currentHighScore = prev[activeGame] || 0;
      if (score > currentHighScore) {
        return { ...prev, [activeGame]: score };
      }
      return prev;
    });
  };
  
  const filteredGames = filter === "all" 
    ? games 
    : games.filter(game => 
        filter === "popular" 
          ? game.popular 
          : game.category === filter || game.difficulty === filter
      );
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4">Games</h1>
          <p className="text-center text-lg text-muted-foreground mb-8">
            Have fun and take your mind off stress with these relaxing games.
          </p>
          
          {activeGame ? (
            <div className="max-w-4xl mx-auto">
              <button 
                onClick={handleBackToGames}
                className="mb-4 flex items-center text-mentii-600 hover:text-mentii-700"
              >
                ← Back to all games
              </button>
              
              <h2 className="text-2xl font-bold mb-6">
                {games.find(g => g.id === activeGame)?.title}
              </h2>
              
              {activeGame === "bubble-pop" && (
                <BubblePopGame onBack={handleBackToGames} onScore={handleScore} />
              )}
              
              
              {activeGame === "memory-match" && (
                <MemoryMatch onBack={handleBackToGames} onScore={handleScore} />
              )}
              
              {activeGame === "word-scramble" && (
                <WordScramble onBack={handleBackToGames} onScore={handleScore} />
              )}

              {activeGame === "reaction-test" && (
                <ReactionTest onBack={handleBackToGames} onScore={handleScore} />
              )}

               {activeGame === "color-match" && (
                <ColorMatch onBack={handleBackToGames} onScore={handleScore} />
              )}

             {activeGame === "pacman-maze" && (
                <PacManGame onBack={handleBackToGames} onScore={handleScore} />
              )}
              
              {activeGame === "pong-challenge" && (
                <PongChallenge onBack={handleBackToGames} onScore={handleScore} />
              )}
              
              {activeGame === "pinball-classic" && (
                <PinballClassic onBack={handleBackToGames} onScore={handleScore} />
              )}

              {activeGame === "math-challenge" && (
                <MathChallenge onBack={handleBackToGames} onScore={handleScore} />
              )}

              {activeGame === "color-psychology" && (
                <ColorPsychology />
              )}
              
              {activeGame === "space-invaders" && (
                <SpaceInvadersGame onBack={handleBackToGames} onScore={handleScore} />
              )}
              
              {activeGame === "snake-game" && (
                <SnakeGame onBack={handleBackToGames} onScore={handleScore} />
              )}
              
              {activeGame === "tetris-classic" && (
                <TetrisGame onBack={handleBackToGames} onScore={handleScore} />
              )}
              
              {activeGame !== "bubble-pop" && 
               activeGame !== "color-psychology" && 
               activeGame !== "snake-game" && 
               activeGame !== "tetris-classic" && 
               activeGame !== "word-scramble" &&
               activeGame !== "memory-match" &&
               
               activeGame !== "color-match" &&
               activeGame !== "math-challenge" &&
               activeGame !== "space-invaders" && 
               activeGame !== "pacman-maze" && 
               activeGame !== "pong-challenge" && 
               activeGame !== "pinball-classic" &&(
                <div className="text-center py-20 bg-gray-100 rounded-lg">
                  <h3 className="text-xl mb-4">Game coming soon!</h3>
                  <button 
                    onClick={handleBackToGames}
                    className="px-4 py-2 bg-mentii-500 text-white rounded-md hover:bg-mentii-600 transition-colors"
                  >
                    Back to Games
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-3 justify-center mb-8">
                <button 
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-full ${
                    filter === "all" 
                      ? "bg-mentii-500 text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All Games
                </button>
                <button 
                  onClick={() => setFilter("popular")}
                  className={`px-4 py-2 rounded-full flex items-center gap-1 ${
                    filter === "popular" 
                      ? "bg-mentii-500 text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Award className="h-4 w-4" />
                  Popular
                </button>
                <button 
                  onClick={() => setFilter("memory")}
                  className={`px-4 py-2 rounded-full flex items-center gap-1 ${
                    filter === "memory" 
                      ? "bg-mentii-500 text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Shuffle className="h-4 w-4" />
                  Memory
                </button>
                <button 
                  onClick={() => setFilter("reaction")}
                  className={`px-4 py-2 rounded-full flex items-center gap-1 ${
                    filter === "reaction" 
                      ? "bg-mentii-500 text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Clock className="h-4 w-4" />
                  Reaction
                </button>
                <button 
                  onClick={() => setFilter("puzzle")}
                  className={`px-4 py-2 rounded-full flex items-center gap-1 ${
                    filter === "puzzle" 
                      ? "bg-mentii-500 text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Puzzle className="h-4 w-4" />
                  Puzzle
                </button>
                <button 
                  onClick={() => setFilter("psychology")}
                  className={`px-4 py-2 rounded-full flex items-center gap-1 ${
                    filter === "psychology" 
                      ? "bg-mentii-500 text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Palette className="h-4 w-4" />
                  Psychology
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGames.map(game => (
                  <GameCard 
                    key={game.id} 
                    game={game} 
                    onPlay={handlePlayGame} 
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      
      <Footer />
      <ChatbotPreview />
    </div>
  );
};

export default Games;
