
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

interface ColorItem {
  colorName: string;
  displayColor: string;
  textColor: string;
}
interface GameProps {
  onBack: () => void;
  onScore: (score: number) => void;
}
const colorOptions: ColorItem[] = [
  { colorName: "Red", displayColor: "#FF0000", textColor: "#000000" },
  { colorName: "Blue", displayColor: "#0000FF", textColor: "#FFFFFF" },
  { colorName: "Green", displayColor: "#008000", textColor: "#FFFFFF" },
  { colorName: "Yellow", displayColor: "#FFFF00", textColor: "#000000" },
  { colorName: "Purple", displayColor: "#800080", textColor: "#FFFFFF" },
  { colorName: "Orange", displayColor: "#FFA500", textColor: "#000000" },
  { colorName: "Pink", displayColor: "#FFC0CB", textColor: "#000000" },
  { colorName: "Brown", displayColor: "#A52A2A", textColor: "#FFFFFF" },
];

const ColorMatch: React.FC<GameProps> = () => {
  const [currentColorItem, setCurrentColorItem] = useState<ColorItem | null>(null);
  const [displayedColorName, setDisplayedColorName] = useState<string>("");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(100);
  const [gameStarted, setGameStarted] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const generateQuestion = () => {
    // Select a random color for the background
    const randomColorIndex = Math.floor(Math.random() * colorOptions.length);
    const selectedColorItem = colorOptions[randomColorIndex];
    
    // Decide whether to match or mismatch color name (60% chance of mismatch)
    let colorName;
    if (Math.random() < 0.6) {
      // Mismatch
      let differentColorIndex;
      do {
        differentColorIndex = Math.floor(Math.random() * colorOptions.length);
      } while (differentColorIndex === randomColorIndex);
      
      colorName = colorOptions[differentColorIndex].colorName;
    } else {
      // Match
      colorName = selectedColorItem.colorName;
    }
    
    setCurrentColorItem(selectedColorItem);
    setDisplayedColorName(colorName);
  };

  const startGame = () => {
    setScore(0);
    setLives(3);
    setGameOver(false);
    setTimeLeft(100);
    setGameStarted(true);
    generateQuestion();
  };

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAnswer(false); // Count as wrong answer if time runs out
            return 0;
          }
          return prev - 1;
        });
      }, 50); // Update every 50ms for smoother progress bar
      
      return () => clearInterval(timer);
    }
  }, [gameStarted, gameOver]);

  const handleAnswer = (isMatch: boolean) => {
    const correctAnswer = currentColorItem?.colorName === displayedColorName;
    
    if (isMatch === correctAnswer) {
      // Correct answer
      setScore((prev) => prev + 1);
      toast.success("Correct!", { duration: 1000 });
    } else {
      // Incorrect answer
      setLives((prev) => prev - 1);
      toast.error("Wrong!", { duration: 1000 });
      
      if (lives <= 1) {
        setGameOver(true);
        if (score > highScore) {
          setHighScore(score);
          toast.success("New high score!");
        }
        return;
      }
    }
    
    // Generate new question and reset timer
    generateQuestion();
    setTimeLeft(100);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Color Match</CardTitle>
        <CardDescription>
          Test your brain's ability to process conflicting information. Does the color name match its displayed color?
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!gameStarted ? (
          <div className="text-center space-y-6 py-8">
            <h3 className="text-xl font-bold">How to Play</h3>
            <p>A color name will be displayed in a certain color. Your task is to quickly decide if the <strong>name of the color</strong> matches the actual <strong>displayed color</strong>.</p>
            <p>Example: If you see "Blue" written in blue color, answer "Match". If you see "Blue" written in red color, answer "No Match".</p>
            <Button onClick={startGame} size="lg">
              Start Game
            </Button>
          </div>
        ) : gameOver ? (
          <div className="text-center space-y-6 py-8">
            <h3 className="text-2xl font-bold">Game Over!</h3>
            <div className="text-4xl font-bold">{score}</div>
            <p>Your final score: {score}</p>
            <p>High score: {highScore}</p>
            <Button onClick={startGame} size="lg">
              Play Again
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium">
                Score: {score}
              </div>
              <div className="flex items-center gap-1">
                {[...Array(lives)].map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-red-500 rounded-full"></div>
                ))}
              </div>
            </div>
            
            <Progress value={timeLeft} className="h-2" />
            
            <div className="flex flex-col items-center justify-center space-y-8 py-4">
              <div 
                className="text-4xl md:text-6xl font-bold py-8 px-12 rounded-lg"
                style={{ 
                  backgroundColor: currentColorItem?.displayColor, 
                  color: currentColorItem?.textColor 
                }}
              >
                {displayedColorName}
              </div>
              
              <p className="text-center text-gray-600">
                Does the text color match the word?
              </p>
              
              <div className="flex gap-4">
                <Button 
                  onClick={() => handleAnswer(true)}
                  size="lg"
                  className="bg-green-500 hover:bg-green-600 px-8"
                >
                  <Check className="mr-2 h-5 w-5" />
                  Match
                </Button>
                
                <Button 
                  onClick={() => handleAnswer(false)}
                  size="lg"
                  className="bg-red-500 hover:bg-red-600 px-8"
                >
                  <X className="mr-2 h-5 w-5" />
                  No Match
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ColorMatch;
