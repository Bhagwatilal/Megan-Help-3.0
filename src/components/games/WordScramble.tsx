import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const words = [
  { word: "happiness", hint: "A state of joy and contentment" },
  { word: "mindfulness", hint: "Being aware and present in the moment" },
  { word: "gratitude", hint: "Feeling of appreciation for what you have" },
  { word: "relaxation", hint: "State of being free from tension and anxiety" },
  { word: "meditation", hint: "Practice to focus and calm the mind" },
  { word: "resilience", hint: "Ability to recover from difficulties" },
  { word: "optimism", hint: "Hopefulness about the future" },
  { word: "tranquility", hint: "State of calmness and peace" },
  { word: "compassion", hint: "Sympathetic concern for others" },
  { word: "serenity", hint: "State of being calm and peaceful" }
];

interface WordScrambleProps {
  onBack: () => void;
  onScore: (score: number) => void;
}

const WordScramble: React.FC<WordScrambleProps> = ({ onBack, onScore }) => {
  const [currentWord, setCurrentWord] = useState("");
  const [scrambledWord, setScrambledWord] = useState("");
  const [hint, setHint] = useState("");
  const [userGuess, setUserGuess] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [isHintShown, setIsHintShown] = useState(false);
  const [usedWords, setUsedWords] = useState<string[]>([]);

  // Scramble a word randomly
  const scrambleWord = (word: string): string => {
    const wordArray = word.split("");
    let scrambled = "";
    
    // Keep scrambling until we get a different arrangement
    do {
      for (let i = wordArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
      }
      scrambled = wordArray.join("");
    } while (scrambled === word);
    
    return scrambled;
  };

  // Get a new word
  const getNewWord = () => {
    const availableWords = words.filter(wordObj => !usedWords.includes(wordObj.word));
    
    // If all words have been used, reset the usedWords
    if (availableWords.length === 0) {
      setUsedWords([]);
      getNewWord();
      return;
    }
    
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const { word, hint } = availableWords[randomIndex];
    
    setCurrentWord(word);
    setScrambledWord(scrambleWord(word));
    setHint(hint);
    setIsHintShown(false);
    setUsedWords([...usedWords, word]);
  };

  // Initialize the game
  useEffect(() => {
    getNewWord();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (gameOver) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setGameOver(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameOver]);

  // Handle user input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserGuess(e.target.value.toLowerCase());
  };

  // Check user's guess
  const checkGuess = () => {
    if (userGuess.toLowerCase() === currentWord.toLowerCase()) {
      toast.success("Correct!");
      setScore(prevScore => prevScore + 10);
      setUserGuess("");
      getNewWord();
    } else {
      toast.error("Try again!");
    }
  };

  // Show hint
  const showHint = () => {
    setIsHintShown(true);
    // Deduct points for using hint
    setScore(prevScore => Math.max(0, prevScore - 2));
    toast.info("Used a hint! -2 points");
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkGuess();
  };

  // Restart the game
  const restartGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameOver(false);
    setUsedWords([]);
    getNewWord();
  };

  // Format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };


    function handleBack(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
      event.preventDefault();
      // Navigate back to the previous page or home screen
      window.history.back();
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Word Scramble</CardTitle>
        <CardDescription>
          Unscramble mental health-related words to improve vocabulary and cognitive skills
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!gameOver ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium">
                Score: {score}
              </div>
              <div className="text-sm font-medium">
                Time: {formatTime(timeLeft)}
              </div>
            </div>
            
            <div className="flex flex-col items-center space-y-4">
              <h3 className="text-xl font-bold uppercase tracking-wider">
                {scrambledWord}
              </h3>
              
              {isHintShown && (
                <p className="text-sm text-gray-600 italic">
                  Hint: {hint}
                </p>
              )}
              
              <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    value={userGuess}
                    onChange={handleInputChange}
                    placeholder="Type your answer here..."
                    className="flex-1"
                    autoComplete="off"
                  />
                  <Button type="submit">
                    Check
                  </Button>
                </div>
                
                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={showHint}
                    disabled={isHintShown}
                  >
                    {isHintShown ? "Hint Shown" : "Show Hint (-2 pts)"}
                  </Button>
                  
                  <Button type="button" variant="outline" onClick={getNewWord}>
                    Skip Word
                  </Button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 space-y-4">
            <h3 className="text-2xl font-bold">Game Over!</h3>
            <p className="text-lg">Your final score: <span className="font-bold">{score}</span></p>
            
            <Button onClick={restartGame} className="mt-4">
              Play Again
            </Button>
          </div>
          
        )}
            <div>
      <button onClick={handleBack}>Back</button>
      <div>Memory Match Game</div>
    </div>
      </CardContent>
    </Card>
  );
};

export default WordScramble;
