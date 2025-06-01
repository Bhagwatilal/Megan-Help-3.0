import React, { useEffect, useRef, useState } from "react";
import { toast } from "@/hooks/use-toast";

interface PongChallengeProps {
  onBack: () => void;
  onScore: (score: number) => void;
}

const PongChallenge: React.FC<PongChallengeProps> = ({ onBack, onScore }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = 800;
    canvas.height = 400;
    
    // Game variables
    let paddleHeight = 80;
    let paddleWidth = 10;
    let ballSize = 10;
    let userPaddleY = (canvas.height - paddleHeight) / 2;
    let computerPaddleY = (canvas.height - paddleHeight) / 2;
    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    let ballSpeedX = 5;
    let ballSpeedY = 2;
    let playerScore = 0;
    let computerScore = 0;
    let computerSpeed = 4; // Computer paddle speed
    let touchY: number | null = null;
    
    // Handle mouse movement for paddle
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseY = e.clientY - rect.top;
      userPaddleY = mouseY - paddleHeight / 2;
      
      // Keep paddle within canvas bounds
      if (userPaddleY < 0) {
        userPaddleY = 0;
      }
      if (userPaddleY > canvas.height - paddleHeight) {
        userPaddleY = canvas.height - paddleHeight;
      }
    };
    
    // Handle touch events for mobile
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        touchY = e.touches[0].clientY - rect.top;
        userPaddleY = touchY - paddleHeight / 2;
        
        // Keep paddle within canvas bounds
        if (userPaddleY < 0) {
          userPaddleY = 0;
        }
        if (userPaddleY > canvas.height - paddleHeight) {
          userPaddleY = canvas.height - paddleHeight;
        }
      }
    };
    
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        e.preventDefault();
      }
    };
    
    // Draw everything
    const draw = () => {
      // Clear canvas
      ctx.fillStyle = "#f0f0f0";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw center line
      ctx.beginPath();
      ctx.setLineDash([5, 15]);
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.strokeStyle = "#cccccc";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Draw paddles
      ctx.fillStyle = "#333333";
      ctx.fillRect(0, userPaddleY, paddleWidth, paddleHeight);
      ctx.fillRect(canvas.width - paddleWidth, computerPaddleY, paddleWidth, paddleHeight);
      
      // Draw ball
      ctx.beginPath();
      ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
      ctx.fillStyle = "#ff6b6b";
      ctx.fill();
      ctx.closePath();
      
      // Draw scores
      ctx.font = "30px Arial";
      ctx.fillStyle = "#333333";
      ctx.textAlign = "center";
      ctx.fillText(playerScore.toString(), canvas.width / 4, 50);
      ctx.fillText(computerScore.toString(), canvas.width * 3 / 4, 50);
    };
    
    // Update game state
    const update = () => {
      if (isPaused || gameOver) return;
      
      // Move computer paddle to follow ball
      const computerPaddleCenter = computerPaddleY + paddleHeight / 2;
      if (computerPaddleCenter < ballY - 35) {
        computerPaddleY += computerSpeed;
      } else if (computerPaddleCenter > ballY + 35) {
        computerPaddleY -= computerSpeed;
      }
      
      // Keep computer paddle within bounds
      if (computerPaddleY < 0) {
        computerPaddleY = 0;
      }
      if (computerPaddleY > canvas.height - paddleHeight) {
        computerPaddleY = canvas.height - paddleHeight;
      }
      
      // Update ball position
      ballX += ballSpeedX;
      ballY += ballSpeedY;
      
      // Check for collisions with top and bottom walls
      if (ballY - ballSize < 0 || ballY + ballSize > canvas.height) {
        ballSpeedY = -ballSpeedY;
      }
      
      // Check for collision with player paddle
      if (
        ballX - ballSize < paddleWidth &&
        ballY > userPaddleY &&
        ballY < userPaddleY + paddleHeight
      ) {
        ballSpeedX = -ballSpeedX;
        // Adjust ball angle based on where it hits the paddle
        const hitPosition = (ballY - userPaddleY) / paddleHeight;
        ballSpeedY = hitPosition * 10 - 5; // -5 to 5 range
      }
      
      // Check for collision with computer paddle
      if (
        ballX + ballSize > canvas.width - paddleWidth &&
        ballY > computerPaddleY &&
        ballY < computerPaddleY + paddleHeight
      ) {
        ballSpeedX = -ballSpeedX;
        // Adjust ball angle based on where it hits the paddle
        const hitPosition = (ballY - computerPaddleY) / paddleHeight;
        ballSpeedY = hitPosition * 10 - 5; // -5 to 5 range
      }
      
      // Check for scoring
      if (ballX < 0) {
        // Computer scores
        computerScore++;
        resetBall();
      } else if (ballX > canvas.width) {
        // Player scores
        playerScore++;
        setScore(playerScore);
        resetBall();
      }
      
      // End game if someone reaches 5 points
      if (playerScore >= 5 || computerScore >= 5) {
        setGameOver(true);
        onScore(playerScore);
        if (playerScore > computerScore) {
          toast({
            title: "Game Over",
            description: "You won! Final score: " + playerScore + " - " + computerScore,
          });
        } else {
          toast({
            title: "Game Over",
            description: "Computer won! Final score: " + playerScore + " - " + computerScore,
          });
        }
      }
    };
    
    // Reset ball to center after scoring
    const resetBall = () => {
      ballX = canvas.width / 2;
      ballY = canvas.height / 2;
      ballSpeedX = -ballSpeedX;
      ballSpeedY = Math.random() * 6 - 3; // Random Y direction
    };
    
    // Game loop
    let animationFrameId: number;
    const gameLoop = () => {
      update();
      draw();
      animationFrameId = requestAnimationFrame(gameLoop);
    };
    
    // Start game loop
    gameLoop();
    
    // Add event listeners
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("touchmove", handleTouchMove as any);
    canvas.addEventListener("touchstart", handleTouchStart as any);
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("touchmove", handleTouchMove as any);
      canvas.removeEventListener("touchstart", handleTouchStart as any);
    };
  }, [isPaused, gameOver, onScore]);
  
  const handleRestart = () => {
    setScore(0);
    setGameOver(false);
  };
  
  const togglePause = () => {
    setIsPaused(!isPaused);
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 flex items-center justify-between w-full">
        <div>
          <span className="text-lg font-semibold">Score: {score}</span>
        </div>
        <div>
          <button 
            onClick={togglePause} 
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md mr-2"
          >
            {isPaused ? "Resume" : "Pause"}
          </button>
          <button 
            onClick={onBack} 
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
          >
            Exit
          </button>
        </div>
      </div>
      
      <div className="relative border border-gray-300 shadow-md">
        <canvas 
          ref={canvasRef} 
          className="bg-white max-w-full"
          style={{ width: "100%", height: "auto", maxWidth: "800px" }}
        />
        
        {gameOver && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
            <h2 className="text-white text-2xl font-bold mb-4">Game Over!</h2>
            <p className="text-white mb-6">Your Score: {score}</p>
            <div className="space-x-4">
              <button 
                onClick={handleRestart} 
                className="px-6 py-2 bg-mentii-500 text-white rounded-md hover:bg-mentii-600"
              >
                Play Again
              </button>
              <button 
                onClick={onBack} 
                className="px-6 py-2 bg-white text-gray-800 rounded-md hover:bg-gray-100"
              >
                Back to Games
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6 bg-gray-100 p-4 rounded-md w-full max-w-full">
        <h3 className="font-semibold mb-2">How to Play:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Move your paddle (left side) up and down using your mouse or touch.</li>
          <li>Try to hit the ball with your paddle to return it to the opponent's side.</li>
          <li>Score points when the computer misses the ball.</li>
          <li>First to reach 5 points wins!</li>
        </ul>
      </div>
    </div>
  );
};

export default PongChallenge;