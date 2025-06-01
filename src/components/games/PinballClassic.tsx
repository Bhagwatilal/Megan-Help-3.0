import React, { useEffect, useRef, useState } from "react";
import { toast } from "@/hooks/use-toast";

interface PinballClassicProps {
  onBack: () => void;
  onScore: (score: number) => void;
}

const PinballClassic: React.FC<PinballClassicProps> = ({ onBack, onScore }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [balls, setBalls] = useState<number>(3);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = 400;
    canvas.height = 600;
    
    // Game variables
    let currentScore = 0;
    let ballsLeft = 3;
    let ballX = canvas.width / 2;
    let ballY = canvas.height - 50;
    let ballRadius = 10;
    let ballSpeedX = 0;
    let ballSpeedY = 0;
    let gravity = 0.2;
    let friction = 0.98;
    let leftPaddleX = 50;
    let leftPaddleY = canvas.height - 100;
    let rightPaddleX = canvas.width - 80;
    let rightPaddleY = canvas.height - 100;
    let paddleWidth = 30;
    let paddleHeight = 10;
    let paddleAngle = Math.PI / 4; // 45 degrees
    let isLaunched = false;
    let leftPaddlePressed = false;
    let rightPaddlePressed = false;
    
    // Create bumpers
    const bumpers = [
      { x: 100, y: 200, radius: 20, points: 10, color: "#FF5733" },
      { x: 300, y: 200, radius: 20, points: 10, color: "#FF5733" },
      { x: 150, y: 150, radius: 15, points: 20, color: "#33A8FF" },
      { x: 250, y: 150, radius: 15, points: 20, color: "#33A8FF" },
      { x: 200, y: 100, radius: 25, points: 50, color: "#33FF57" }
    ];
    
    // Create targets
    const targets = [
      { x: 80, y: 300, width: 40, height: 10, points: 30, color: "#FFD733", hit: false },
      { x: 180, y: 300, width: 40, height: 10, points: 30, color: "#FFD733", hit: false },
      { x: 280, y: 300, width: 40, height: 10, points: 30, color: "#FFD733", hit: false }
    ];
    
    // Handle keyboard
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "z" || e.key === "Z") {
        leftPaddlePressed = true;
      }
      if (e.key === "m" || e.key === "M") {
        rightPaddlePressed = true;
      }
      if (e.key === " " && !isLaunched) {
        launchBall();
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "z" || e.key === "Z") {
        leftPaddlePressed = false;
      }
      if (e.key === "m" || e.key === "M") {
        rightPaddlePressed = false;
      }
    };
    
    // Handle mobile touch controls
    const handleTouchStart = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const touchX = e.touches[0].clientX - rect.left;
      
      if (touchX < canvas.width / 2) {
        leftPaddlePressed = true;
      } else {
        rightPaddlePressed = true;
      }
      
      // Launch the ball on touch if not launched
      if (!isLaunched) {
        launchBall();
      }
    };
    
    const handleTouchEnd = () => {
      leftPaddlePressed = false;
      rightPaddlePressed = false;
    };
    
    // Launch the ball
    const launchBall = () => {
      if (isLaunched) return;
      
      isLaunched = true;
      ballSpeedY = -10;
      ballSpeedX = (Math.random() - 0.5) * 3; // Random initial direction
      
      toast({
        title: "Ball Launched!",
        description: "Use Z and M keys or touch the sides to control paddles.",
      });
    };
    
    // Reset the ball when lost
    const resetBall = () => {
      ballsLeft--;
      setBalls(ballsLeft);
      
      if (ballsLeft <= 0) {
        // Game over
        setGameOver(true);
        onScore(currentScore);
        return;
      }
      
      // Reset ball position
      ballX = canvas.width / 2;
      ballY = canvas.height - 50;
      ballSpeedX = 0;
      ballSpeedY = 0;
      isLaunched = false;
      
      // Reset targets
      targets.forEach(target => {
        target.hit = false;
      });
      
      toast({
        title: "Ball Lost!",
        description: `${ballsLeft} balls remaining.`,
      });
    };
    
    // Draw everything
    const draw = () => {
      // Clear canvas
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw score
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "20px Arial";
      ctx.textAlign = "left";
      ctx.fillText(`Score: ${currentScore}`, 20, 30);
      
      // Draw balls left
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "right";
      ctx.fillText(`Balls: ${ballsLeft}`, canvas.width - 20, 30);
      
      // Draw walls
      ctx.fillStyle = "#444444";
      ctx.fillRect(0, 0, 10, canvas.height); // Left wall
      ctx.fillRect(canvas.width - 10, 0, 10, canvas.height); // Right wall
      ctx.fillRect(0, 0, canvas.width, 10); // Top wall
      
      // Draw ball
      ctx.beginPath();
      ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.closePath();
      
      // Draw bumpers
      bumpers.forEach(bumper => {
        ctx.beginPath();
        ctx.arc(bumper.x, bumper.y, bumper.radius, 0, Math.PI * 2);
        ctx.fillStyle = bumper.color;
        ctx.fill();
        ctx.closePath();
        
        // Draw points in the center of the bumper
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(bumper.points.toString(), bumper.x, bumper.y);
      });
      
      // Draw targets
      targets.forEach(target => {
        if (!target.hit) {
          ctx.fillStyle = target.color;
          ctx.fillRect(target.x, target.y, target.width, target.height);
        }
      });
      
      // Draw paddles
      // Left paddle
      ctx.save();
      ctx.translate(leftPaddleX, leftPaddleY);
      ctx.rotate(leftPaddlePressed ? -paddleAngle : 0);
      ctx.fillStyle = "#FF3366";
      ctx.fillRect(-paddleWidth / 2, -paddleHeight / 2, paddleWidth, paddleHeight);
      ctx.restore();
      
      // Right paddle
      ctx.save();
      ctx.translate(rightPaddleX, rightPaddleY);
      ctx.rotate(rightPaddlePressed ? paddleAngle : 0);
      ctx.fillStyle = "#FF3366";
      ctx.fillRect(-paddleWidth / 2, -paddleHeight / 2, paddleWidth, paddleHeight);
      ctx.restore();
      
      // Draw launch text if ball is not launched
      if (!isLaunched) {
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Press SPACE or tap screen to launch", canvas.width / 2, canvas.height - 20);
      }
    };
    
    // Update game state
    const update = () => {
      if (isPaused || gameOver) return;
      
      if (isLaunched) {
        // Apply gravity
        ballSpeedY += gravity;
        
        // Apply friction
        ballSpeedX *= friction;
        ballSpeedY *= friction;
        
        // Update ball position
        ballX += ballSpeedX;
        ballY += ballSpeedY;
        
        // Check for wall collisions
        if (ballX - ballRadius < 10) {
          ballX = ballRadius + 10;
          ballSpeedX = -ballSpeedX * 0.8;
        } else if (ballX + ballRadius > canvas.width - 10) {
          ballX = canvas.width - ballRadius - 10;
          ballSpeedX = -ballSpeedX * 0.8;
        }
        
        if (ballY - ballRadius < 10) {
          ballY = ballRadius + 10;
          ballSpeedY = -ballSpeedY * 0.8;
        }
        
        // Check if ball falls below the bottom
        if (ballY > canvas.height + 50) {
          resetBall();
        }
        
        // Check for bumper collisions
        bumpers.forEach(bumper => {
          const dx = ballX - bumper.x;
          const dy = ballY - bumper.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < ballRadius + bumper.radius) {
            // Collision detected
            currentScore += bumper.points;
            setScore(currentScore);
            
            // Calculate new velocity
            const angle = Math.atan2(dy, dx);
            const speed = Math.sqrt(ballSpeedX * ballSpeedX + ballSpeedY * ballSpeedY);
            ballSpeedX = Math.cos(angle) * speed * 1.2; // Increase speed slightly
            ballSpeedY = Math.sin(angle) * speed * 1.2;
            
            // Move ball outside of bumper
            const newDistance = ballRadius + bumper.radius;
            ballX = bumper.x + Math.cos(angle) * newDistance;
            ballY = bumper.y + Math.sin(angle) * newDistance;
          }
        });
        
        // Check for target collisions
        targets.forEach(target => {
          if (!target.hit && 
              ballX + ballRadius > target.x && 
              ballX - ballRadius < target.x + target.width &&
              ballY + ballRadius > target.y && 
              ballY - ballRadius < target.y + target.height) {
            // Collision detected
            target.hit = true;
            currentScore += target.points;
            setScore(currentScore);
            
            // Bounce
            ballSpeedY = -ballSpeedY;
          }
        });
        
        // Check for paddle collisions
        // Left paddle
        if (isPaddleCollision(leftPaddleX, leftPaddleY, leftPaddlePressed ? -paddleAngle : 0)) {
          handlePaddleCollision(leftPaddlePressed ? -paddleAngle : 0);
        }
        
        // Right paddle
        if (isPaddleCollision(rightPaddleX, rightPaddleY, rightPaddlePressed ? paddleAngle : 0)) {
          handlePaddleCollision(rightPaddlePressed ? paddleAngle : 0);
        }
      }
    };
    
    // Check if ball collides with a paddle
    const isPaddleCollision = (paddleX: number, paddleY: number, angle: number) => {
      // Transform ball position relative to paddle
      const dx = ballX - paddleX;
      const dy = ballY - paddleY;
      
      // Rotate point to align with paddle
      const rotatedX = dx * Math.cos(-angle) - dy * Math.sin(-angle);
      const rotatedY = dx * Math.sin(-angle) + dy * Math.cos(-angle);
      
      // Check if the rotated point is inside the paddle rectangle
      return (
        rotatedX > -paddleWidth / 2 - ballRadius &&
        rotatedX < paddleWidth / 2 + ballRadius &&
        rotatedY > -paddleHeight / 2 - ballRadius &&
        rotatedY < paddleHeight / 2 + ballRadius
      );
    };
    
    // Handle paddle collision physics
    const handlePaddleCollision = (angle: number) => {
      // Increase score
      currentScore += 5;
      setScore(currentScore);
      
      // Apply force based on paddle angle
      const force = 12;
      ballSpeedX = Math.sin(angle) * force;
      ballSpeedY = -Math.cos(angle) * force;
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
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    canvas.addEventListener("touchstart", handleTouchStart as any);
    canvas.addEventListener("touchend", handleTouchEnd as any);
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      canvas.removeEventListener("touchstart", handleTouchStart as any);
      canvas.removeEventListener("touchend", handleTouchEnd as any);
    };
  }, [isPaused, gameOver, onScore]);
  
  const handleRestart = () => {
    setScore(0);
    setBalls(3);
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
          <span className="ml-4 text-lg font-semibold">Balls: {balls}</span>
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
          className="bg-black max-w-full"
          style={{ width: "100%", height: "auto", maxWidth: "400px" }}
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
          <li>Launch the ball with spacebar or tap the screen.</li>
          <li>Press 'Z' key or touch the left side to control the left paddle.</li>
          <li>Press 'M' key or touch the right side to control the right paddle.</li>
          <li>Hit bumpers and targets to score points.</li>
          <li>Don't let the ball fall out of play!</li>
        </ul>
      </div>
    </div>
  );
};

export default PinballClassic;