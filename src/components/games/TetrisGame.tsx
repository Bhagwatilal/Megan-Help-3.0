import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

interface TetrisGameProps {
  onBack: () => void;
  onScore: (score: number) => void;
}

// Define tetrimino shapes
const TETRIMINOS = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0]
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0]
  ],
  O: [
    [1, 1],
    [1, 1]
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0]
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0]
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0]
  ]
};

const COLORS = {
  I: "#00CED1", // Cyan
  J: "#0000CD", // Dark Blue
  L: "#FFA500", // Orange
  O: "#FFFF00", // Yellow
  S: "#008000", // Green
  T: "#800080", // Purple
  Z: "#FF0000"  // Red
};

// Board dimensions
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 25;

const TetrisGame: React.FC<TetrisGameProps> = ({ onBack, onScore }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [board, setBoard] = useState<(string | null)[][]>(
    Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(null))
  );
  const [currentPiece, setCurrentPiece] = useState<{
    shape: number[][];
    type: keyof typeof TETRIMINOS;
    position: { x: number; y: number };
  } | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameActive, setGameActive] = useState(true);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const requestRef = useRef<number>();
  const lastDropTime = useRef<number>(0);
  const dropInterval = useRef<number>(1000);
  
  // Initialize the game
  useEffect(() => {
    if (gameActive && !currentPiece) {
      spawnNewPiece();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameActive, currentPiece]);
  
  // Generate a new random piece
  const spawnNewPiece = () => {
    const types = Object.keys(TETRIMINOS) as Array<keyof typeof TETRIMINOS>;
    const randomType = types[Math.floor(Math.random() * types.length)];
    const newPiece = {
      shape: TETRIMINOS[randomType],
      type: randomType,
      position: {
        x: Math.floor(BOARD_WIDTH / 2) - Math.floor(TETRIMINOS[randomType][0].length / 2),
        y: 0
      }
    };
    
    // Check if new piece can be placed (game over check)
    if (checkCollision(newPiece)) {
      setGameOver(true);
      setGameActive(false);
      onScore(score);
      return;
    }
    
    setCurrentPiece(newPiece);
  };
  
  // Check collision with walls and other pieces
  const checkCollision = (piece: typeof currentPiece) => {
    if (!piece) return false;
    
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        // Skip empty cells in the tetrimino
        if (piece.shape[y][x] === 0) continue;
        
        const boardX = piece.position.x + x;
        const boardY = piece.position.y + y;
        
        // Check for wall collision
        if (
          boardX < 0 ||
          boardX >= BOARD_WIDTH ||
          boardY >= BOARD_HEIGHT
        ) {
          return true;
        }
        
        // Check for collision with existing pieces
        if (boardY >= 0 && board[boardY][boardX] !== null) {
          return true;
        }
      }
    }
    
    return false;
  };
  
  // Rotate current piece
  const rotatePiece = useCallback(() => {
    if (!currentPiece || !gameActive) return;
    
    // Create rotated matrix (90 degrees clockwise)
    const rotatedShape = currentPiece.shape[0].map((_, i) => 
      currentPiece.shape.map(row => row[i]).reverse()
    );
    
    const rotatedPiece = {
      ...currentPiece,
      shape: rotatedShape
    };
    
    // Wall kick - try to adjust position if rotation causes collision
    let adjustedPiece = { ...rotatedPiece };
    
    if (checkCollision(adjustedPiece)) {
      // Try shifting left
      adjustedPiece.position.x -= 1;
      if (!checkCollision(adjustedPiece)) {
        setCurrentPiece(adjustedPiece);
        return;
      }
      
      // Try shifting right
      adjustedPiece.position.x += 2;
      if (!checkCollision(adjustedPiece)) {
        setCurrentPiece(adjustedPiece);
        return;
      }
      
      // Try shifting up (for I piece mostly)
      adjustedPiece.position.x -= 1;
      adjustedPiece.position.y -= 1;
      if (!checkCollision(adjustedPiece)) {
        setCurrentPiece(adjustedPiece);
        return;
      }
      
      // Reset if no adjustment works
      return;
    }
    
    setCurrentPiece(rotatedPiece);
  }, [currentPiece, gameActive, board]);
  
  // Move piece left/right
  const movePiece = useCallback((direction: "left" | "right") => {
    if (!currentPiece || !gameActive) return;
    
    const newX = currentPiece.position.x + (direction === "left" ? -1 : 1);
    const movedPiece = {
      ...currentPiece,
      position: {
        ...currentPiece.position,
        x: newX
      }
    };
    
    if (!checkCollision(movedPiece)) {
      setCurrentPiece(movedPiece);
    }
  }, [currentPiece, gameActive, board]);
  
  // Drop piece down faster
  const dropPiece = useCallback(() => {
    if (!currentPiece || !gameActive) return;
    
    const droppedPiece = {
      ...currentPiece,
      position: {
        ...currentPiece.position,
        y: currentPiece.position.y + 1
      }
    };
    
    if (!checkCollision(droppedPiece)) {
      setCurrentPiece(droppedPiece);
    } else {
      // Piece can't move down further, lock it in place
      lockPiece();
    }
  }, [currentPiece, gameActive, board]);
  
  // Hard drop - instantly place piece at lowest possible position
  const hardDrop = useCallback(() => {
    if (!currentPiece || !gameActive) return;
    
    let dropDistance = 0;
    while (!checkCollision({
      ...currentPiece,
      position: {
        ...currentPiece.position,
        y: currentPiece.position.y + dropDistance + 1
      }
    })) {
      dropDistance++;
    }
    
    setCurrentPiece({
      ...currentPiece,
      position: {
        ...currentPiece.position,
        y: currentPiece.position.y + dropDistance
      }
    });
    
    // Lock the piece immediately after hard drop
    lockPiece();
  }, [currentPiece, gameActive, board]);
  
  // Lock the current piece in place and check for completed lines
  const lockPiece = useCallback(() => {
    if (!currentPiece) return;
    
    const newBoard = [...board.map(row => [...row])];
    
    // Add the piece to the board
    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x] !== 0) {
          const boardY = currentPiece.position.y + y;
          const boardX = currentPiece.position.x + x;
          
          if (boardY >= 0) {
            newBoard[boardY][boardX] = currentPiece.type;
          }
        }
      }
    }
    
    // Check for completed lines
    let completedLines = 0;
    const updatedBoard = newBoard.filter(row => {
      const isComplete = row.every(cell => cell !== null);
      if (isComplete) completedLines++;
      return !isComplete;
    });
    
    // Add new empty rows at the top
    while (updatedBoard.length < BOARD_HEIGHT) {
      updatedBoard.unshift(Array(BOARD_WIDTH).fill(null));
    }
    
    // Update score and level
    if (completedLines > 0) {
      const linePoints = [0, 100, 300, 500, 800]; // 0, 1, 2, 3, 4 lines
      const newScore = score + linePoints[completedLines] * level;
      const newLines = lines + completedLines;
      const newLevel = Math.floor(newLines / 10) + 1;
      
      setScore(newScore);
      setLines(newLines);
      setLevel(newLevel);
      
      // Speed up as level increases
      dropInterval.current = Math.max(100, 1000 - ((newLevel - 1) * 100));
    }
    
    setBoard(updatedBoard);
    setCurrentPiece(null); // This will trigger spawnNewPiece in the useEffect
  }, [currentPiece, board, score, level, lines, onScore]);
  
  // Main game loop
  const gameLoop = useCallback((timestamp: number) => {
    if (!gameActive || gameOver) return;
    
    if (timestamp - lastDropTime.current >= dropInterval.current) {
      lastDropTime.current = timestamp;
      dropPiece();
    }
    
    requestRef.current = requestAnimationFrame(gameLoop);
  }, [gameActive, gameOver, dropPiece]);
  
  // Start and stop the game loop
  useEffect(() => {
    if (gameActive && !gameOver) {
      requestRef.current = requestAnimationFrame(gameLoop);
    }
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [gameActive, gameOver, gameLoop]);
  
  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameActive || gameOver) return;
      
      switch (e.key) {
        case "ArrowLeft":
          movePiece("left");
          break;
        case "ArrowRight":
          movePiece("right");
          break;
        case "ArrowDown":
          dropPiece();
          break;
        case "ArrowUp":
          rotatePiece();
          break;
        case " ":
          hardDrop();
          break;
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameActive, gameOver, movePiece, dropPiece, rotatePiece, hardDrop]);
  
  // Draw the game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the grid
    ctx.strokeStyle = "#EEEEEE";
    ctx.lineWidth = 0.5;
    
    // Draw vertical grid lines
    for (let x = 0; x <= BOARD_WIDTH; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL_SIZE, 0);
      ctx.lineTo(x * CELL_SIZE, BOARD_HEIGHT * CELL_SIZE);
      ctx.stroke();
    }
    
    // Draw horizontal grid lines
    for (let y = 0; y <= BOARD_HEIGHT; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL_SIZE);
      ctx.lineTo(BOARD_WIDTH * CELL_SIZE, y * CELL_SIZE);
      ctx.stroke();
    }
    
    // Draw the board
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        if (board[y][x] !== null) {
          const cellColor = COLORS[board[y][x] as keyof typeof COLORS];
          
          ctx.fillStyle = cellColor;
          ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
          
          // Draw border
          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = 1;
          ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
      }
    }
    
    // Draw the current piece
    if (currentPiece) {
      const pieceColor = COLORS[currentPiece.type];
      
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x] !== 0) {
            const boardX = currentPiece.position.x + x;
            const boardY = currentPiece.position.y + y;
            
            if (boardY >= 0) {
              ctx.fillStyle = pieceColor;
              ctx.fillRect(
                boardX * CELL_SIZE,
                boardY * CELL_SIZE,
                CELL_SIZE,
                CELL_SIZE
              );
              
              // Draw border
              ctx.strokeStyle = "#FFFFFF";
              ctx.lineWidth = 1;
              ctx.strokeRect(
                boardX * CELL_SIZE,
                boardY * CELL_SIZE,
                CELL_SIZE,
                CELL_SIZE
              );
            }
          }
        }
      }
    }
  }, [board, currentPiece]);
  
  // Reset the game
  const resetGame = () => {
    setBoard(Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(null)));
    setCurrentPiece(null);
    setGameOver(false);
    setGameActive(true);
    setScore(0);
    setLevel(1);
    setLines(0);
    dropInterval.current = 1000;
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 w-full flex justify-between items-center">
        <div className="text-md">Score: {score}</div>
        <div className="text-md">Level: {level}</div>
        <div className="text-md">Lines: {lines}</div>
      </div>
      
      <div className="relative rounded-lg overflow-hidden border border-gray-300">
        <canvas
          ref={canvasRef}
          width={BOARD_WIDTH * CELL_SIZE}
          height={BOARD_HEIGHT * CELL_SIZE}
          className="bg-gray-50"
        />
        
        {gameOver && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white">
            <h2 className="text-4xl font-bold mb-4">Game Over!</h2>
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
          onClick={rotatePiece}
          className="aspect-square p-0"
        >
          <ArrowUp />
        </Button>
        <div></div>
        
        <Button
          variant="outline"
          onClick={() => movePiece("left")}
          className="aspect-square p-0"
        >
          <ArrowLeft />
        </Button>
        <Button
          variant="outline"
          onClick={hardDrop}
          className="aspect-square p-0 text-xs"
        >
          Drop
        </Button>
        <Button
          variant="outline"
          onClick={() => movePiece("right")}
          className="aspect-square p-0"
        >
          <ArrowRight />
        </Button>
        
        <div></div>
        <Button
          variant="outline"
          onClick={dropPiece}
          className="aspect-square p-0"
        >
          <ArrowDown />
        </Button>
        <div></div>
      </div>
    </div>
  );
};

export default TetrisGame;
