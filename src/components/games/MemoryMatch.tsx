
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";

// Ensure framer-motion dependency is installed
interface MemoryMatchProps {
  onBack: () => void;
  onScore: (score: number) => void;
}
interface MemoryCard {
  id: number;
  emoji: string;
  matched: boolean;
  flipped: boolean;
}

const emojis = ["😀", "🎮", "🌈", "🚀", "🎨", "🎵", "🌺", "🐱"];

const MemoryMatch: React.FC<MemoryMatchProps> = ({ onBack, onScore }) => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  
  const initializeGame = () => {
    // Create pairs of cards with emojis
    const cardPairs = [...emojis, ...emojis].map((emoji, index) => ({
      id: index,
      emoji,
      matched: false,
      flipped: false
    }));
    
    // Shuffle the cards
    const shuffledCards = cardPairs.sort(() => Math.random() - 0.5);
    
    setCards(shuffledCards);
    setFlippedCards([]);
    setMoves(0);
    setGameOver(false);
    setStartTime(new Date());
    setEndTime(null);
  };

  // Initialize game on component mount
  useEffect(() => {
    initializeGame();
  }, []);

  const handleCardClick = (id: number) => {
    // Ignore click if the card is already matched or flipped, or if two cards are already flipped
    if (
      gameOver ||
      cards[id].matched ||
      flippedCards.includes(id) ||
      flippedCards.length === 2
    ) {
      return;
    }

    // Flip the card
    const newCards = [...cards];
    newCards[id].flipped = true;
    setCards(newCards);

    // Add card to flipped cards
    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);

    // If two cards are flipped, check for a match
    if (newFlippedCards.length === 2) {
      setMoves(prevMoves => prevMoves + 1);
      
      const [firstCardId, secondCardId] = newFlippedCards;
      const firstCard = newCards[firstCardId];
      const secondCard = newCards[secondCardId];

      if (firstCard.emoji === secondCard.emoji) {
        // Match found
        newCards[firstCardId].matched = true;
        newCards[secondCardId].matched = true;
        setCards(newCards);
        setFlippedCards([]);
        
        // Check if all cards are matched
        const allMatched = newCards.every(card => card.matched);
        if (allMatched) {
          setGameOver(true);
          setEndTime(new Date());
          toast.success("Congratulations! You've matched all the cards!");
        } else {
          toast.success("Match found!");
        }
      } else {
        // No match, flip cards back after a delay
        setTimeout(() => {
          newCards[firstCardId].flipped = false;
          newCards[secondCardId].flipped = false;
          setCards(newCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const calculateGameTime = (): string => {
    if (!startTime || !endTime) return "0";
    
    const timeDiff = Math.floor((endTime.getTime() - startTime.getTime()) / 1000); // in seconds
    
    const minutes = Math.floor(timeDiff / 60);
    const seconds = timeDiff % 60;
    
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  function handleBack(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    event.preventDefault();
    // Navigate back to the previous page or home screen
    window.history.back();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Memory Match</CardTitle>
        <CardDescription>
          Match pairs of cards to improve your memory and concentration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium">Moves: {moves}</div>
            <Button onClick={initializeGame} variant="outline" size="sm">
              New Game
            </Button>
          </div>

          {gameOver ? (
            <div className="text-center py-8 space-y-4">
              <h3 className="text-2xl font-bold">Game Complete!</h3>
              <div className="flex flex-col space-y-2 items-center">
                <p className="text-lg">You completed the game in <span className="font-bold">{moves}</span> moves.</p>
                <p className="text-md">Time: <span className="font-bold">{calculateGameTime()}</span></p>
              </div>
              <Button onClick={initializeGame} className="mt-4">
                Play Again
              </Button>
             
    <div>
      <button onClick={handleBack}>Back</button>
      <div>Memory Match Game</div>
    </div>
  
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {cards.map((card) => (
                <motion.div
                  key={card.id}
                  className={`aspect-square cursor-pointer rounded-lg ${
                    card.flipped || card.matched 
                      ? '' 
                      : 'bg-gradient-to-br from-mentii-200 to-mentii-300'
                  }`}
                  onClick={() => handleCardClick(card.id)}
                  initial={{ rotateY: 0 }}
                  animate={{ 
                    rotateY: card.flipped || card.matched ? 180 : 0,
                    scale: card.matched ? 0.95 : 1
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="relative w-full h-full">
                    <div className={`absolute inset-0 flex items-center justify-center ${
                      card.flipped || card.matched ? 'visible' : 'invisible'
                    }`}>
                      <span className="text-4xl transform -scale-x-100 rotate-180">{card.emoji}</span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      {!(card.flipped || card.matched) && (
                        <span className="text-xl font-bold text-mentii-600">?</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MemoryMatch;
