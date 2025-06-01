import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

interface PacManGameProps {
  onBack: () => void;
  onScore: (score: number) => void;
}

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Position = { x: number; y: number };

const CELL_SIZE = 20;
const GRID_SIZE = 20;
const GAME_SPEED = 200;

// Simple maze layout: 0 = path, 1 = wall, 2 = pellet, 3 = power pellet
const initialMaze = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 3, 1, 0, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 0, 1, 3, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 2, 1, 1, 0, 0, 0, 0, 1, 1, 2, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 1, 2, 1, 1, 0, 1, 1, 0, 1, 1, 2, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 2, 1, 1, 0, 1, 1, 0, 1, 1, 2, 1, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 2, 1, 1, 0, 0, 0, 0, 1, 1, 2, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 2, 0, 0, 0, 1, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 2, 1, 1, 0, 0, 0, 0, 1, 1, 2, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 3, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 3, 1],
  [1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const PacManGame: React.FC<PacManGameProps> = ({ onBack, onScore }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pacman, setPacman] = useState<Position>({ x: 10, y: 13 });
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [requestedDirection, setRequestedDirection] = useState<Direction>("RIGHT");
  const [maze, setMaze] = useState<number[][]>(JSON.parse(JSON.stringify(initialMaze)));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [ghosts, setGhosts] = useState<{position: Position, direction: Direction, scared: boolean}[]>([
    { position: { x: 9, y: 10 }, direction: "UP", scared: false },
    { position: { x: 10, y: 10 }, direction: "UP", scared: false },
  ]);
  const [powerMode, setPowerMode] = useState(false);
  
  // Refs for use in callbacks
  const pacmanRef = useRef(pacman);
  const directionRef = useRef(direction);
  const requestedDirectionRef = useRef(requestedDirection);
  const mazeRef = useRef(maze);
  const ghostsRef = useRef(ghosts);
  const powerModeRef = useRef(powerMode);
  const gameOverRef = useRef(gameOver);
  
  // Update refs when state changes
  useEffect(() => {
    pacmanRef.current = pacman;
    directionRef.current = direction;
    requestedDirectionRef.current = requestedDirection;
    mazeRef.current = maze;
    ghostsRef.current = ghosts;
    powerModeRef.current = powerMode;
    gameOverRef.current = gameOver;
  }, [pacman, direction, requestedDirection, maze, ghosts, powerMode, gameOver]);
  
  // Initialize game
  useEffect(() => {
    resetGame();
  }, []);
  
  const resetGame = () => {
    setPacman({ x: 10, y: 13 });
    setDirection("RIGHT");
    setRequestedDirection("RIGHT");
    setMaze(JSON.parse(JSON.stringify(initialMaze)));
    setScore(0);
    setGameOver(false);
    setGameWon(false);
    setGhosts([
      { position: { x: 9, y: 10 }, direction: "UP", scared: false },
      { position: { x: 10, y: 10 }, direction: "UP", scared: false },
    ]);
    setPowerMode(false);
  };
  
  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOverRef.current) return;
      
      switch (e.key) {
        case "ArrowUp":
          setRequestedDirection("UP");
          break;
        case "ArrowDown":
          setRequestedDirection("DOWN");
          break;
        case "ArrowLeft":
          setRequestedDirection("LEFT");
          break;
        case "ArrowRight":
          setRequestedDirection("RIGHT");
          break;
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  
  // Direction button handlers for mobile
  const handleDirectionClick = (newDirection: Direction) => {
    if (gameOver) return;
    setRequestedDirection(newDirection);
  };
  
  // Check if a move is valid
  const isValidMove = (pos: Position, dir: Direction): boolean => {
    let newX = pos.x;
    let newY = pos.y;
    
    switch (dir) {
      case "UP":
        newY -= 1;
        break;
      case "DOWN":
        newY += 1;
        break;
      case "LEFT":
        newX -= 1;
        break;
      case "RIGHT":
        newX += 1;
        break;
    }
    
    // Handle wrap-around
    if (newX < 0) newX = GRID_SIZE - 1;
    if (newX >= GRID_SIZE) newX = 0;
    if (newY < 0) newY = GRID_SIZE - 1;
    if (newY >= GRID_SIZE) newY = 0;
    
    // Check if hitting a wall
    return !(newY >= 0 && newY < GRID_SIZE && newX >= 0 && newX < GRID_SIZE && mazeRef.current[newY][newX] === 1);
  };
  
  // Main game loop
  useEffect(() => {
    const gameInterval = setInterval(() => {
      if (gameOverRef.current) return;
      
      // Try to change to requested direction if possible
      if (requestedDirectionRef.current !== directionRef.current) {
        if (isValidMove(pacmanRef.current, requestedDirectionRef.current)) {
          setDirection(requestedDirectionRef.current);
        }
      }
      
      // Move pacman
      if (isValidMove(pacmanRef.current, directionRef.current)) {
        setPacman(prev => {
          let newX = prev.x;
          let newY = prev.y;
          
          switch (directionRef.current) {
            case "UP":
              newY -= 1;
              break;
            case "DOWN":
              newY += 1;
              break;
            case "LEFT":
              newX -= 1;
              break;
            case "RIGHT":
              newX += 1;
              break;
          }
          
          // Handle wrap-around
          if (newX < 0) newX = GRID_SIZE - 1;
          if (newX >= GRID_SIZE) newX = 0;
          if (newY < 0) newY = GRID_SIZE - 1;
          if (newY >= GRID_SIZE) newY = 0;
          
          return { x: newX, y: newY };
        });
      }
      
      // Check if pacman eats a pellet
      const x = pacmanRef.current.x;
      const y = pacmanRef.current.y;
      
      if (mazeRef.current[y][x] === 2) {
        // Regular pellet
        setScore(prev => prev + 10);
        setMaze(prev => {
          const newMaze = [...prev];
          newMaze[y][x] = 0;
          return newMaze;
        });
      } else if (mazeRef.current[y][x] === 3) {
        // Power pellet
        setScore(prev => prev + 50);
        setMaze(prev => {
          const newMaze = [...prev];
          newMaze[y][x] = 0;
          return newMaze;
        });
        setPowerMode(true);
        
        // Make ghosts scared
        setGhosts(prev => 
          prev.map(ghost => ({ ...ghost, scared: true }))
        );
        
        // Power mode lasts for 10 seconds
        setTimeout(() => {
          setPowerMode(false);
          setGhosts(prev => 
            prev.map(ghost => ({ ...ghost, scared: false }))
          );
        }, 10000);
      }
      
      // Check if all pellets are eaten
      let remainingPellets = 0;
      for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
          if (mazeRef.current[y][x] === 2 || mazeRef.current[y][x] === 3) {
            remainingPellets++;
          }
        }
      }
      
      if (remainingPellets === 0) {
        setGameWon(true);
        setGameOver(true);
        onScore(score);
      }
      
      // Move ghosts
      setGhosts(prev => {
        return prev.map(ghost => {
          // Determine new direction
          let newDirection = ghost.direction;
          const possibleDirections: Direction[] = ["UP", "DOWN", "LEFT", "RIGHT"];
          const validDirections = possibleDirections.filter(dir => 
            isValidMove(ghost.position, dir)
          );
          
          // Occasionally change direction
          if (Math.random() < 0.3 || !validDirections.includes(ghost.direction)) {
            newDirection = validDirections[Math.floor(Math.random() * validDirections.length)];
          }
          
          // Calculate new position
          let newX = ghost.position.x;
          let newY = ghost.position.y;
          
          switch (newDirection) {
            case "UP":
              newY -= 1;
              break;
            case "DOWN":
              newY += 1;
              break;
            case "LEFT":
              newX -= 1;
              break;
            case "RIGHT":
              newX += 1;
              break;
          }
          
          // Handle wrap-around
          if (newX < 0) newX = GRID_SIZE - 1;
          if (newX >= GRID_SIZE) newX = 0;
          if (newY < 0) newY = GRID_SIZE - 1;
          if (newY >= GRID_SIZE) newY = 0;
          
          return {
            position: { x: newX, y: newY },
            direction: newDirection,
            scared: ghost.scared
          };
        });
      });
      
      // Check ghost collisions
      ghostsRef.current.forEach(ghost => {
        if (ghost.position.x === pacmanRef.current.x && ghost.position.y === pacmanRef.current.y) {
          if (powerModeRef.current) {
            // Eat ghost
            setScore(prev => prev + 200);
            setGhosts(prev => 
              prev.map(g => 
                g.position.x === ghost.position.x && g.position.y === ghost.position.y
                  ? { ...g, position: { x: 10, y: 10 } }
                  : g
              )
            );
          } else {
            // Game over
            setGameOver(true);
            onScore(score);
          }
        }
      });
      
    }, GAME_SPEED);
    
    return () => clearInterval(gameInterval);
  }, [score, onScore]);
  
  // Draw on canvas
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE);
    
    // Draw maze
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const cell = maze[y][x];
        
        if (cell === 1) {
          // Wall
          ctx.fillStyle = "#1A1F2C";
          ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        } else if (cell === 2) {
          // Pellet
          ctx.fillStyle = "#FFD700";
          ctx.beginPath();
          ctx.arc(
            x * CELL_SIZE + CELL_SIZE / 2,
            y * CELL_SIZE + CELL_SIZE / 2,
            CELL_SIZE / 8,
            0,
            Math.PI * 2
          );
          ctx.fill();
        } else if (cell === 3) {
          // Power pellet
          ctx.fillStyle = "#FFD700";
          ctx.beginPath();
          ctx.arc(
            x * CELL_SIZE + CELL_SIZE / 2,
            y * CELL_SIZE + CELL_SIZE / 2,
            CELL_SIZE / 4,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      }
    }
    
    // Draw pacman
    ctx.fillStyle = "#FFFF00";
    ctx.beginPath();
    
    const centerX = pacman.x * CELL_SIZE + CELL_SIZE / 2;
    const centerY = pacman.y * CELL_SIZE + CELL_SIZE / 2;
    const radius = CELL_SIZE / 2 - 2;
    
    // Calculate mouth angles based on direction
    let startAngle = 0.2 * Math.PI;
    let endAngle = 1.8 * Math.PI;
    
    switch (direction) {
      case "RIGHT":
        startAngle = 0.2 * Math.PI;
        endAngle = 1.8 * Math.PI;
        break;
      case "DOWN":
        startAngle = 0.7 * Math.PI;
        endAngle = 2.3 * Math.PI;
        break;
      case "LEFT":
        startAngle = 1.2 * Math.PI;
        endAngle = 0.8 * Math.PI;
        break;
      case "UP":
        startAngle = 1.7 * Math.PI;
        endAngle = 1.3 * Math.PI;
        break;
    }
    
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.lineTo(centerX, centerY);
    ctx.fill();
    
    // Draw ghosts
    ghosts.forEach(ghost => {
      ctx.fillStyle = ghost.scared ? "#2196F3" : "#FF5252";
      
      const ghostX = ghost.position.x * CELL_SIZE;
      const ghostY = ghost.position.y * CELL_SIZE;
      
      // Ghost body
      ctx.beginPath();
      ctx.arc(
        ghostX + CELL_SIZE / 2,
        ghostY + CELL_SIZE / 2 - 2,
        CELL_SIZE / 2 - 2,
        Math.PI,
        0,
        false
      );
      
      // Ghost bottom
      ctx.lineTo(ghostX + CELL_SIZE, ghostY + CELL_SIZE);
      ctx.lineTo(ghostX + CELL_SIZE * 0.75, ghostY + CELL_SIZE * 0.75);
      ctx.lineTo(ghostX + CELL_SIZE * 0.5, ghostY + CELL_SIZE);
      ctx.lineTo(ghostX + CELL_SIZE * 0.25, ghostY + CELL_SIZE * 0.75);
      ctx.lineTo(ghostX, ghostY + CELL_SIZE);
      ctx.lineTo(ghostX, ghostY + CELL_SIZE / 2);
      
      ctx.fill();
      
      // Ghost eyes
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(
        ghostX + CELL_SIZE / 3,
        ghostY + CELL_SIZE / 2 - 2,
        CELL_SIZE / 6,
        0,
        Math.PI * 2
      );
      ctx.arc(
        ghostX + CELL_SIZE * 2 / 3,
        ghostY + CELL_SIZE / 2 - 2,
        CELL_SIZE / 6,
        0,
        Math.PI * 2
      );
      ctx.fill();
      
      // Ghost pupils
      ctx.fillStyle = "#000000";
      
      // Position pupils based on direction
      let pupilOffsetX = 0;
      let pupilOffsetY = 0;
      
      switch (ghost.direction) {
        case "LEFT":
          pupilOffsetX = -2;
          break;
        case "RIGHT":
          pupilOffsetX = 2;
          break;
        case "UP":
          pupilOffsetY = -2;
          break;
        case "DOWN":
          pupilOffsetY = 2;
          break;
      }
      
      ctx.beginPath();
      ctx.arc(
        ghostX + CELL_SIZE / 3 + pupilOffsetX,
        ghostY + CELL_SIZE / 2 - 2 + pupilOffsetY,
        CELL_SIZE / 10,
        0,
        Math.PI * 2
      );
      ctx.arc(
        ghostX + CELL_SIZE * 2 / 3 + pupilOffsetX,
        ghostY + CELL_SIZE / 2 - 2 + pupilOffsetY,
        CELL_SIZE / 10,
        0,
        Math.PI * 2
      );
      ctx.fill();
    });
    
    // Draw score
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "16px Arial";
    ctx.fillText(`Score: ${score}`, 10, 20);
    
    // Draw power mode indicator
    if (powerMode) {
      ctx.fillStyle = "#2196F3";
      ctx.fillText("POWER MODE!", GRID_SIZE * CELL_SIZE - 120, 20);
    }
    
  }, [pacman, direction, maze, ghosts, score, powerMode]);
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative bg-black rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          className="border border-gray-600"
        />
        
        {gameOver && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white">
            <h2 className="text-4xl font-bold mb-4">{gameWon ? "You Win!" : "Game Over!"}</h2>
            <p className="text-2xl mb-8">Your score: {score}</p>
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
      <div className="mt-6 grid grid-cols-3 gap-2 w-48">
        <div></div>
        <Button
          variant="outline"
          onClick={() => handleDirectionClick("UP")}
          className="aspect-square p-0"
        >
          <ArrowUp />
        </Button>
        <div></div>
        
        <Button
          variant="outline"
          onClick={() => handleDirectionClick("LEFT")}
          className="aspect-square p-0"
        >
          <ArrowLeft />
        </Button>
        <div></div>
        <Button
          variant="outline"
          onClick={() => handleDirectionClick("RIGHT")}
          className="aspect-square p-0"
        >
          <ArrowRight />
        </Button>
        
        <div></div>
        <Button
          variant="outline"
          onClick={() => handleDirectionClick("DOWN")}
          className="aspect-square p-0"
        >
          <ArrowDown />
        </Button>
        <div></div>
      </div>
    </div>
  );
};

export default PacManGame;
