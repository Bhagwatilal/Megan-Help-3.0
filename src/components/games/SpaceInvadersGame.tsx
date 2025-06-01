import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface SpaceInvadersProps {
  onBack: () => void;
  onScore: (score: number) => void;
}

type Position = { x: number; y: number };

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 500;
const PLAYER_WIDTH = 30;
const PLAYER_HEIGHT = 15;
const INVADER_WIDTH = 25;
const INVADER_HEIGHT = 15;
const BULLET_WIDTH = 3;
const BULLET_HEIGHT = 10;
const INVADER_ROWS = 3;
const INVADERS_PER_ROW = 8;
const GAME_SPEED = 20;

const SpaceInvadersGame: React.FC<SpaceInvadersProps> = ({ onBack, onScore }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [player, setPlayer] = useState<Position>({ x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2, y: CANVAS_HEIGHT - 30 });
  const [invaders, setInvaders] = useState<Position[]>([]);
  const [bullets, setBullets] = useState<Position[]>([]);
  const [enemyBullets, setEnemyBullets] = useState<Position[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [direction, setDirection] = useState(1);
  const [level, setLevel] = useState(1);
  const [invaderSpeed, setInvaderSpeed] = useState(1);
  
  const playerRef = useRef(player);
  const invadersRef = useRef(invaders);
  const bulletsRef = useRef(bullets);
  const enemyBulletsRef = useRef(enemyBullets);
  const gameOverRef = useRef(gameOver);
  const directionRef = useRef(direction);
  
  // Initialize the game
  useEffect(() => {
    resetGame();
  }, []);
  
  // Update refs when state changes
  useEffect(() => {
    playerRef.current = player;
    invadersRef.current = invaders;
    bulletsRef.current = bullets;
    enemyBulletsRef.current = enemyBullets;
    gameOverRef.current = gameOver;
    directionRef.current = direction;
  }, [player, invaders, bullets, enemyBullets, gameOver, direction]);
  
  const resetGame = () => {
    // Create initial invaders grid
    const newInvaders: Position[] = [];
    for (let row = 0; row < INVADER_ROWS; row++) {
      for (let col = 0; col < INVADERS_PER_ROW; col++) {
        newInvaders.push({
          x: col * (INVADER_WIDTH + 15) + 40,
          y: row * (INVADER_HEIGHT + 15) + 40,
        });
      }
    }
    
    setInvaders(newInvaders);
    setBullets([]);
    setEnemyBullets([]);
    setPlayer({ x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2, y: CANVAS_HEIGHT - 30 });
    setScore(0);
    setGameOver(false);
    setDirection(1);
    setLevel(1);
    setInvaderSpeed(1);
  };
  
  // Game loop
  useEffect(() => {
    const gameLoop = setInterval(() => {
      if (gameOverRef.current) return;
      
      // Move player's bullets
      setBullets(prev => 
        prev
          .map(bullet => ({ ...bullet, y: bullet.y - 5 }))
          .filter(bullet => bullet.y > 0)
      );
      
      // Move enemy bullets
      setEnemyBullets(prev => 
        prev
          .map(bullet => ({ ...bullet, y: bullet.y + 3 }))
          .filter(bullet => bullet.y < CANVAS_HEIGHT)
      );
      
      // Randomly fire enemy bullets
      if (Math.random() < 0.02 && invadersRef.current.length > 0 && enemyBulletsRef.current.length < 3) {
        const randomInvader = invadersRef.current[Math.floor(Math.random() * invadersRef.current.length)];
        setEnemyBullets(prev => [
          ...prev, 
          { 
            x: randomInvader.x + INVADER_WIDTH / 2, 
            y: randomInvader.y + INVADER_HEIGHT 
          }
        ]);
      }
      
      // Move invaders
      let shouldChangeDirection = false;
      
      setInvaders(prev => {
        const updatedInvaders = prev.map(invader => {
          const newX = invader.x + (directionRef.current * invaderSpeed);
          
          // Check if any invader hits the boundaries
          if (newX <= 10 || newX >= CANVAS_WIDTH - INVADER_WIDTH - 10) {
            shouldChangeDirection = true;
          }
          
          return { ...invader, x: newX };
        });
        
        return updatedInvaders;
      });
      
      if (shouldChangeDirection) {
        setDirection(prev => -prev);
        setInvaders(prev => 
          prev.map(invader => ({ 
            ...invader, 
            y: invader.y + 10,
            x: invader.x + (directionRef.current * invaderSpeed) // Adjust x to prevent getting stuck at boundary
          }))
        );
      }
      
      // Check if any invader reached the bottom
      if (invadersRef.current.some(invader => invader.y > CANVAS_HEIGHT - 50)) {
        setGameOver(true);
        onScore(score);
      }
      
      // Check bullet-invader collisions
      bulletsRef.current.forEach(bullet => {
        invadersRef.current.forEach((invader, invaderIndex) => {
          if (
            bullet.x < invader.x + INVADER_WIDTH &&
            bullet.x + BULLET_WIDTH > invader.x &&
            bullet.y < invader.y + INVADER_HEIGHT &&
            bullet.y + BULLET_HEIGHT > invader.y
          ) {
            // Remove the hit invader
            setInvaders(prev => prev.filter((_, i) => i !== invaderIndex));
            
            // Remove the bullet
            setBullets(prev => prev.filter(b => b !== bullet));
            
            // Update score
            setScore(prev => prev + 10);
          }
        });
      });
      
      // Check enemy bullet-player collisions
      enemyBulletsRef.current.forEach(bullet => {
        if (
          bullet.x < playerRef.current.x + PLAYER_WIDTH &&
          bullet.x + BULLET_WIDTH > playerRef.current.x &&
          bullet.y < playerRef.current.y + PLAYER_HEIGHT &&
          bullet.y + BULLET_HEIGHT > playerRef.current.y
        ) {
          setGameOver(true);
          onScore(score);
        }
      });
      
      // Check if all invaders are destroyed
      if (invadersRef.current.length === 0) {
        // Level up!
        setLevel(prev => prev + 1);
        setInvaderSpeed(prev => Math.min(prev + 0.5, 4));
        
        // Create new invaders for next level
        const newInvaders: Position[] = [];
        for (let row = 0; row < INVADER_ROWS; row++) {
          for (let col = 0; col < INVADERS_PER_ROW; col++) {
            newInvaders.push({
              x: col * (INVADER_WIDTH + 15) + 40,
              y: row * (INVADER_HEIGHT + 15) + 40,
            });
          }
        }
        
        setInvaders(newInvaders);
        setBullets([]);
        setEnemyBullets([]);
      }
      
    }, GAME_SPEED);
    
    return () => clearInterval(gameLoop);
  }, [score, onScore, invaderSpeed]);
  
  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOverRef.current) return;
      
      switch (e.key) {
        case "ArrowLeft":
          setPlayer(prev => ({
            ...prev,
            x: Math.max(prev.x - 10, 0),
          }));
          break;
        case "ArrowRight":
          setPlayer(prev => ({
            ...prev,
            x: Math.min(prev.x + 10, CANVAS_WIDTH - PLAYER_WIDTH),
          }));
          break;
        case " ": // Spacebar to fire
          if (bulletsRef.current.length < 3) { // Limit bullet count
            setBullets(prev => [
              ...prev,
              {
                x: playerRef.current.x + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2,
                y: playerRef.current.y - BULLET_HEIGHT,
              },
            ]);
          }
          break;
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  
  // Direction button handlers for mobile
  const handleDirectionClick = (direction: "left" | "right") => {
    if (gameOver) return;
    
    if (direction === "left") {
      setPlayer(prev => ({
        ...prev,
        x: Math.max(prev.x - 15, 0),
      }));
    } else {
      setPlayer(prev => ({
        ...prev,
        x: Math.min(prev.x + 15, CANVAS_WIDTH - PLAYER_WIDTH),
      }));
    }
  };
  
  const handleFireClick = () => {
    if (gameOver || bulletsRef.current.length >= 3) return;
    
    setBullets(prev => [
      ...prev,
      {
        x: playerRef.current.x + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2,
        y: playerRef.current.y - BULLET_HEIGHT,
      },
    ]);
  };
  
  // Draw on canvas
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw player
    ctx.fillStyle = "#4CAF50";
    ctx.fillRect(player.x, player.y, PLAYER_WIDTH, PLAYER_HEIGHT);
    
    // Draw invaders
    ctx.fillStyle = "#FF5252";
    invaders.forEach(invader => {
      ctx.fillRect(invader.x, invader.y, INVADER_WIDTH, INVADER_HEIGHT);
    });
    
    // Draw player bullets
    ctx.fillStyle = "#FFFFFF";
    bullets.forEach(bullet => {
      ctx.fillRect(bullet.x, bullet.y, BULLET_WIDTH, BULLET_HEIGHT);
    });
    
    // Draw enemy bullets
    ctx.fillStyle = "#FFEB3B";
    enemyBullets.forEach(bullet => {
      ctx.fillRect(bullet.x, bullet.y, BULLET_WIDTH, BULLET_HEIGHT);
    });
    
    // Draw score
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "16px Arial";
    ctx.fillText(`Score: ${score}  Level: ${level}`, 10, 20);
    
  }, [player, invaders, bullets, enemyBullets, score, level]);
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative bg-black rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="border border-gray-600"
        />
        
        {gameOver && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white">
            <h2 className="text-4xl font-bold mb-4">Game Over!</h2>
            <p className="text-2xl mb-2">Your score: {score}</p>
            <p className="mb-8">You reached level {level}</p>
            <div className="space-x-4">
              <Button 
                onClick={resetGame}
                className="bg-mentii-500 hover:bg-mentii-600"
              >
                Play Again
              </Button>
              <Button 
                onClick={onBack}
                variant="outline"
                className="text-white border-white"
              >
                Back to Games
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Mobile controls */}
      <div className="mt-6 grid grid-cols-3 gap-2 w-full max-w-xs">
        <Button
          variant="outline"
          onClick={() => handleDirectionClick("left")}
          className="p-3"
        >
          <ArrowLeft />
        </Button>
        
        <Button
          variant="default"
          onClick={handleFireClick}
          className="p-3 bg-red-500 hover:bg-red-600"
        >
          Fire!
        </Button>
        
        <Button
          variant="outline"
          onClick={() => handleDirectionClick("right")}
          className="p-3"
        >
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
};

export default SpaceInvadersGame;
