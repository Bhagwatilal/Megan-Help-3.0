import React, { useState, useEffect } from "react";
import { saveGameScore } from "@/services/gameService";
import { toast } from "sonner";

interface BubblePopGameProps {
  onBack: () => void;
  onScore: (score: number) => void;
}

const BubblePopGame: React.FC<BubblePopGameProps> = ({ onBack, onScore }) => {
  const [bubbles, setBubbles] = useState<{ id: number; x: number; y: number; size: number; popped: boolean }[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(true);
  const [highScore, setHighScore] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (gameActive && timeLeft > 0) {
        setTimeLeft(prev => prev - 1);
      } else if (timeLeft === 0) {
        setGameActive(false);
        clearInterval(interval);
        
        saveGameScore("bubble-pop", score, { timeSpent: 30 })
          .then(() => {
            toast.success("Score saved!");
            onScore(score);
          })
          .catch((error) => {
            console.error("Error saving score:", error);
            toast.error("Failed to save score");
          });
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timeLeft, gameActive, score, onScore]);
  
  useEffect(() => {
    const createBubble = () => {
      if (!gameActive) return;
      
      const newBubble = {
        id: Date.now(),
        x: Math.random() * 80 + 10, // percentage
        y: Math.random() * 80 + 10, // percentage
        size: Math.random() * 60 + 40, // pixels
        popped: false,
      };
      
      setBubbles(prev => [...prev, newBubble]);
    };
    
    const interval = setInterval(createBubble, 1000);
    return () => clearInterval(interval);
  }, [gameActive]);
  
  const popBubble = (id: number) => {
    if (!gameActive) return;
    
    setBubbles(prev => 
      prev.map(bubble => 
        bubble.id === id ? { ...bubble, popped: true } : bubble
      )
    );
    
    setScore(prev => prev + 1);
    
    setTimeout(() => {
      setBubbles(prev => prev.filter(bubble => bubble.id !== id));
    }, 300);
  };
  
  return (
    <div className="h-[600px] bg-gradient-to-b from-blue-100 to-purple-100 rounded-lg relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 bg-black/20 text-white p-4 flex justify-between items-center">
        <div className="text-lg font-bold">Score: {score}</div>
        <div className="text-lg font-bold">Time: {timeLeft}s</div>
      </div>
      
      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          className={`absolute rounded-full cursor-pointer transition-transform ${
            bubble.popped ? 'scale-0 opacity-0' : 'scale-100 opacity-80'
          }`}
          style={{
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            background: `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), ${
              ['#ff85a2', '#ffc285', '#99ff85', '#85b8ff', '#c285ff'][Math.floor(Math.random() * 5)]
            })`,
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.5) inset',
            transform: bubble.popped ? 'scale(0)' : 'scale(1)',
            transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
          }}
          onClick={() => popBubble(bubble.id)}
        />
      ))}
      
      {!gameActive && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white">
          <h2 className="text-4xl font-bold mb-4">Game Over!</h2>
          <p className="text-2xl mb-8">Your score: {score}</p>
          <div className="space-x-4">
            <button 
              onClick={() => {
                setScore(0);
                setTimeLeft(30);
                setBubbles([]);
                setGameActive(true);
              }}
              className="px-6 py-3 bg-mentii-500 rounded-lg hover:bg-mentii-600 transition-colors"
            >
              Play Again
            </button>
            <button 
              onClick={onBack}
              className="px-6 py-3 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Games
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BubblePopGame;
