import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface GamesProps {
  onBack: () => void;
  onScore: (score: number) => void;
}


const ReactionTest: React.FC<GamesProps> = ({ onBack, onScore }) => {
  const [gameState, setGameState] = useState<"waiting" | "ready" | "clicked" | "results">("waiting");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [averageTime, setAverageTime] = useState<number | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const timerRef = useRef<number | null>(null);

  const startTest = () => {
    setGameState("waiting");
    setReactionTime(null);
    setStartTime(null); // Reset startTime
    setEndTime(null);   // Reset endTime
    setCountdown(3);
    
    // Clear any existing timer
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setTimeout(() => {  // Add small delay before starting the test
            prepareTest();
          }, 100);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const prepareTest = () => {
    // Random delay between 2 and 5 seconds
    const delay = Math.floor(Math.random() * 3000) + 2000;
    
    timerRef.current = window.setTimeout(() => {
      setGameState("ready");
      setStartTime(Date.now());
    }, delay);
  };

  const handleClick = () => {
    if (gameState === "waiting") {
      // User clicked too early
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      
      toast.error("Too early! Wait for the green color.");
      startTest();
      return;
    }
    
    if (gameState === "ready" && startTime) {  // Add startTime check
      const clickTime = Date.now();
      const reaction = Math.max(0, clickTime - startTime); // Ensure non-negative
      
      setEndTime(clickTime);
      setReactionTime(reaction);
      
      // Update best time
      if (reaction && (bestTime === null || reaction < bestTime)) {
        setBestTime(reaction);
        if (reaction < 200) {
          toast.success("New record! Lightning fast reflexes!");
        } else {
          toast.success("New best time!");
        }
      }
      
      // Update average time
      const newAttemptCount = attemptCount + 1;
      const newTotalTime = totalTime + (reaction || 0);
      const newAverage = Math.round(newTotalTime / newAttemptCount);
      
      setAttemptCount(newAttemptCount);
      setTotalTime(newTotalTime);
      setAverageTime(newAverage);
      
      setGameState("clicked");
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Add a cleanup effect for the countdown interval
  useEffect(() => {
    let countdownInterval: number;
    
    if (gameState === "waiting" && countdown > 0) {
      countdownInterval = window.setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }

    return () => {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    };
  }, [gameState, countdown]);

  const getReactionMessage = (time: number): string => {
    if (time < 200) return "Lightning fast! 🚀";
    if (time < 300) return "Excellent reflexes! 🔥";
    if (time < 400) return "Great job! 👍";
    if (time < 500) return "Good reaction time! 👌";
    if (time < 600) return "Decent reaction! 👏";
    return "Keep practicing! 💪";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reaction Test</CardTitle>
        <CardDescription>
          Test your reflexes and improve your reaction time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {gameState === "waiting" && countdown > 0 ? (
            <div 
              className="w-full py-16 rounded-md bg-gray-100 flex items-center justify-center cursor-default"
            >
              <div className="text-center">
                <div className="text-6xl font-bold mb-2">{countdown}</div>
                <p className="text-gray-500">Get ready...</p>
              </div>
            </div>
          ) : gameState === "waiting" && countdown === 0 ? (  // Add explicit check for countdown === 0
            <div 
              className="w-full py-16 rounded-md bg-red-500 flex items-center justify-center cursor-pointer"
              onClick={handleClick}
            >
              <div className="text-center">
                <p className="text-white font-bold text-xl mb-2">Wait...</p>
                <p className="text-white">Click when the color changes to green</p>
              </div>
            </div>
          ) : gameState === "ready" ? (
            <div 
              className="w-full py-16 rounded-md bg-green-500 flex items-center justify-center cursor-pointer"
              onClick={handleClick}
            >
              <div className="text-center">
                <p className="text-white font-bold text-xl mb-2">Click Now!</p>
                <p className="text-white">Click as fast as you can!</p>
              </div>
            </div>
          ) : (
            <div className="w-full py-12 rounded-md bg-blue-50 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-1">
                  {reactionTime ? `${reactionTime} ms` : "No time recorded"}
                </h3>
                {reactionTime && (
                  <p className="text-gray-600 mb-6">{getReactionMessage(reactionTime)}</p>
                )}
                <Button onClick={startTest}>Try Again</Button>
              </div>
            </div>
          )}
          
          <div className="bg-gray-50 rounded-md p-4">
            <h4 className="font-medium text-lg mb-3">Your Stats</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-3 rounded border border-gray-200">
                <p className="text-sm text-gray-500">Best Time</p>
                <p className="font-bold text-lg">{bestTime ? `${bestTime} ms` : "N/A"}</p>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200">
                <p className="text-sm text-gray-500">Average Time</p>
                <p className="font-bold text-lg">{averageTime ? `${averageTime} ms` : "N/A"}</p>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200">
                <p className="text-sm text-gray-500">Attempts</p>
                <p className="font-bold text-lg">{attemptCount}</p>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>The average human reaction time is 250ms to visual stimuli. How do you compare?</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReactionTest;
