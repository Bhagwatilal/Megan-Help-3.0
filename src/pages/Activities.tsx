import React from "react";
import { Brush, Puzzle, BookCopy, Palette, Heart } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ChatbotPreview from "../components/ui/ChatbotPreview";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import CalmZoneSection from "../components/calmzone/CalmZoneSection";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../components/auth/FirebaseConfig';
import { saveJournalEntry } from '../services/activityService';
import { Timestamp } from 'firebase/firestore';
import { useActivityTracker } from '../hooks/useActivityTracker';

interface ActivityItemProps {
  title: string;
  description: string;
  image?: string;
}

const DrawingActivity: React.FC = () => {
  const [color, setColor] = React.useState("#9b87f5");
  const [brushSize, setBrushSize] = React.useState(5);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [ctx, setCtx] = React.useState<CanvasRenderingContext2D | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.lineCap = "round";
        context.lineJoin = "round";
        context.strokeStyle = color;
        context.lineWidth = brushSize;
        setCtx(context);
      }
    }
  }, [color, brushSize]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    if (ctx) {
      ctx.beginPath();
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        if ('touches' in e) {
          ctx.moveTo(
            e.touches[0].clientX - rect.left,
            e.touches[0].clientY - rect.top
          );
        } else {
          ctx.moveTo(
            e.clientX - rect.left,
            e.clientY - rect.top
          );
        }
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      if ('touches' in e) {
        ctx.lineTo(
          e.touches[0].clientX - rect.left,
          e.touches[0].clientY - rect.top
        );
      } else {
        ctx.lineTo(
          e.clientX - rect.left,
          e.clientY - rect.top
        );
      }
      ctx.stroke();
    }
  };

  const endDrawing = () => {
    setIsDrawing(false);
    if (ctx) {
      ctx.closePath();
    }
  };

  const clearCanvas = () => {
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    if (ctx) {
      ctx.strokeStyle = newColor;
    }
  };

  return (
    <div id="drawing" className="mt-8">
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="brushSize" className="text-sm font-medium">Brush Size:</label>
            <input
              id="brushSize"
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-24"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Color:</span>
            <div className="flex space-x-2">
              {["#9b87f5", "#F97316", "#0EA5E9", "#22c55e", "#000000"].map((clr) => (
                <button
                  key={clr}
                  onClick={() => handleColorChange(clr)}
                  className={`w-6 h-6 rounded-full ${color === clr ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                  style={{ backgroundColor: clr }}
                  aria-label={`Select ${clr} color`}
                />
              ))}
            </div>
          </div>
          
          <button
            onClick={clearCanvas}
            className="ml-auto px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium transition-colors"
          >
            Clear Canvas
          </button>
        </div>
        
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            className="w-full touch-none"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={endDrawing}
            onMouseLeave={endDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={endDrawing}
          />
        </div>
      </div>
    </div>
  );
};

const PuzzleActivity: React.FC = () => {
  const [activeGame, setActiveGame] = React.useState<string | null>(null);
  
  const puzzles = [
    {
      id: "word-search",
      title: "Word Search",
      description: "Find hidden words in a grid of letters",
      image: "https://placehold.co/300x200/e5deff/6E59A5?text=Word+Search"
    },
    {
      id: "sudoku",
      title: "Sudoku",
      description: "Fill the grid with numbers from 1-9",
      image: "https://placehold.co/300x200/e5deff/6E59A5?text=Sudoku"
    },
    {
      id: "crossword",
      title: "Crossword",
      description: "Solve clues and fill in the grid",
      image: "https://placehold.co/300x200/e5deff/6E59A5?text=Crossword"
    }
  ];

  const handleBack = () => {
    setActiveGame(null);
  };

  if (activeGame) {
    return (
      <div className="mt-8">
        <button 
          onClick={handleBack}
          className="mb-4 flex items-center text-mentii-600 hover:text-mentii-700"
        >
          ← Back to puzzles
        </button>
        
        {activeGame === "word-search" && <WordSearchGame />}
        {activeGame === "sudoku" && <SudokuGame />}
        {activeGame === "crossword" && <CrosswordGame />}
      </div>
    );
  }

  return (
    <div id="puzzles" className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      {puzzles.map((puzzle) => (
        <Card key={puzzle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <img 
            src={puzzle.image} 
            alt={puzzle.title} 
            className="w-full h-40 object-cover"
          />
          <CardHeader className="pb-2">
            <CardTitle>{puzzle.title}</CardTitle>
            <CardDescription>{puzzle.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <button 
              className="w-full bg-mentii-500 text-white py-2 rounded-md hover:bg-mentii-600 transition-colors"
              onClick={() => setActiveGame(puzzle.id)}
            >
              Start Puzzle
            </button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const WordSearchGame: React.FC = () => {
  const [grid, setGrid] = React.useState<string[][]>([]);
  const [words] = React.useState(['CALM', 'PEACE', 'MIND', 'RELAX', 'HEALTH']);
  const [found, setFound] = React.useState<string[]>([]);
  const [selected, setSelected] = React.useState<{row: number, col: number}[]>([]);
  const [isDragging, setIsDragging] = React.useState(false);
  
  React.useEffect(() => {
    generateGrid();
  }, []);
  
  const generateGrid = () => {
    const size = 10;
    const directions = [
      [0, 1],   // right
      [1, 0],   // down
      [1, 1],   // diagonal down-right
      [-1, 1],  // diagonal up-right
    ];
    
    const newGrid: string[][] = Array(size).fill(null).map(() => 
      Array(size).fill('').map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
    );
    
    words.forEach(word => {
      let placed = false;
      let attempts = 0;
      
      while (!placed && attempts < 100) {
        attempts++;
        
        const row = Math.floor(Math.random() * size);
        const col = Math.floor(Math.random() * size);
        const [dRow, dCol] = directions[Math.floor(Math.random() * directions.length)];
        
        let canPlace = true;
        for (let i = 0; i < word.length; i++) {
          const newRow = row + (dRow * i);
          const newCol = col + (dCol * i);
          
          if (
            newRow < 0 || newRow >= size || 
            newCol < 0 || newCol >= size || 
            (newGrid[newRow][newCol] !== word[i] && newGrid[newRow][newCol] !== '')
          ) {
            canPlace = false;
            break;
          }
        }
        
        if (canPlace) {
          for (let i = 0; i < word.length; i++) {
            const newRow = row + (dRow * i);
            const newCol = col + (dCol * i);
            newGrid[newRow][newCol] = word[i];
          }
          placed = true;
        }
      }
    });
    
    setGrid(newGrid);
  };
  
  const handleCellMouseDown = (row: number, col: number) => {
    setIsDragging(true);
    setSelected([{row, col}]);
  };
  
  const handleCellMouseEnter = (row: number, col: number) => {
    if (isDragging) {
      setSelected(prev => {
        if (prev.some(pos => pos.row === row && pos.col === col)) {
          return prev;
        }
        
        if (prev.length >= 1) {
          const first = prev[0];
          const last = prev[prev.length - 1];
          
          const dRow = last.row - first.row;
          const dCol = last.col - first.col;
          
          if (prev.length > 1) {
            const newDRow = row - first.row;
            const newDCol = col - first.col;
            
            if (dRow === 0 && dCol !== 0) {
              if (newDRow !== 0) return prev;
              if (Math.sign(newDCol) !== Math.sign(dCol)) return prev;
            } 
            else if (dRow !== 0 && dCol === 0) {
              if (newDCol !== 0) return prev;
              if (Math.sign(newDRow) !== Math.sign(dRow)) return prev;
            } 
            else if (Math.abs(dRow) === Math.abs(dCol)) {
              if (Math.abs(newDRow) !== Math.abs(newDCol)) return prev;
              if (Math.sign(newDRow) !== Math.sign(dRow) || Math.sign(newDCol) !== Math.sign(dCol)) return prev;
            }
          }
        }
        
        return [...prev, {row, col}];
      });
    }
  };
  
  const handleCellMouseUp = () => {
    setIsDragging(false);
    
    const selectedWord = selected.map(pos => grid[pos.row][pos.col]).join('');
    const reversedWord = selectedWord.split('').reverse().join('');
    
    if (words.includes(selectedWord) && !found.includes(selectedWord)) {
      setFound(prev => [...prev, selectedWord]);
    } 
    else if (words.includes(reversedWord) && !found.includes(reversedWord)) {
      setFound(prev => [...prev, reversedWord]);
    }
    
    setSelected([]);
  };
  
  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h3 className="text-xl font-semibold mb-4">Word Search</h3>
      
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-2">Find these words:</h4>
        <div className="flex flex-wrap gap-2">
          {words.map(word => (
            <span 
              key={word} 
              className={`px-2 py-1 text-sm rounded-full ${
                found.includes(word) 
                  ? 'bg-green-200 text-green-800 line-through' 
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {word}
            </span>
          ))}
        </div>
      </div>
      
      <div 
        className="grid grid-cols-10 gap-1 select-none"
        onMouseLeave={() => {
          setIsDragging(false);
          setSelected([]);
        }}
      >
        {grid.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {row.map((cell, colIndex) => {
              const isSelected = selected.some(pos => pos.row === rowIndex && pos.col === colIndex);
              
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    w-8 h-8 flex items-center justify-center font-bold text-lg
                    ${isSelected ? 'bg-mentii-500 text-white' : 'bg-gray-100'}
                    ${found.some(word => {
                      const cellsInWord = [];
                      for (const pos of selected) {
                        const selectedWord = selected.map(p => grid[p.row][p.col]).join('');
                        if (selectedWord === word || selectedWord.split('').reverse().join('') === word) {
                          cellsInWord.push(pos);
                        }
                      }
                      return cellsInWord.some(pos => pos.row === rowIndex && pos.col === colIndex);
                    }) ? 'bg-green-500 text-white' : ''}
                    rounded cursor-pointer transition-colors
                  `}
                  onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                  onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                  onMouseUp={handleCellMouseUp}
                >
                  {cell}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      
      {found.length === words.length && (
        <div className="mt-6 text-center py-3 bg-green-100 text-green-800 rounded-lg">
          🎉 Congratulations! You found all words!
        </div>
      )}
      
      <div className="mt-6 flex justify-center">
        <button
          onClick={generateGrid}
          className="px-4 py-2 bg-mentii-500 text-white rounded-md hover:bg-mentii-600 transition-colors"
        >
          New Puzzle
        </button>
      </div>
    </div>
  );
};

const SudokuGame: React.FC = () => {
  const emptyCells = 40;
  const [board, setBoard] = React.useState<Array<Array<number | null>>>(
    Array(9).fill(null).map(() => Array(9).fill(null))
  );
  const [selectedCell, setSelectedCell] = React.useState<{row: number, col: number} | null>(null);
  const [isComplete, setIsComplete] = React.useState(false);
  
  React.useEffect(() => {
    generateSudoku();
  }, []);
  
  React.useEffect(() => {
    if (board.every(row => row.every(cell => cell !== null))) {
      const valid = validateSudoku();
      setIsComplete(valid);
    } else {
      setIsComplete(false);
    }
  }, [board]);
  
  const generateSudoku = () => {
    const solvedBoard = Array(9).fill(null).map(() => Array(9).fill(null));
    solveSudoku(solvedBoard);
    
    const puzzleBoard = JSON.parse(JSON.stringify(solvedBoard));
    
    let count = 0;
    while (count < emptyCells) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      
      if (puzzleBoard[row][col] !== null) {
        puzzleBoard[row][col] = null;
        count++;
      }
    }
    
    setBoard(puzzleBoard);
  };
  
  const solveSudoku = (board: Array<Array<number | null>>): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === null) {
          const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
          
          for (const num of numbers) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              
              if (solveSudoku(board)) {
                return true;
              }
              
              board[row][col] = null;
            }
          }
          
          return false;
        }
      }
    }
    
    return true;
  };
  
  const isValid = (board: Array<Array<number | null>>, row: number, col: number, num: number): boolean => {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num) return false;
    }
    
    for (let i = 0; i < 9; i++) {
      if (board[i][col] === num) return false;
    }
    
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[boxRow + i][boxCol + j] === num) return false;
      }
    }
    
    return true;
  };
  
  const shuffleArray = (array: number[]): number[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  
  const validateSudoku = (): boolean => {
    for (let row = 0; row < 9; row++) {
      const set = new Set<number>();
      for (let col = 0; col < 9; col++) {
        const cell = board[row][col];
        if (cell === null || set.has(cell)) return false;
        set.add(cell);
      }
    }
    
    for (let col = 0; col < 9; col++) {
      const set = new Set<number>();
      for (let row = 0; row < 9; row++) {
        const cell = board[row][col];
        if (cell === null || set.has(cell)) return false;
        set.add(cell);
      }
    }
    
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        const set = new Set<number>();
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            const cell = board[boxRow * 3 + i][boxCol * 3 + j];
            if (cell === null || set.has(cell)) return false;
            set.add(cell);
          }
        }
      }
    }
    
    return true;
  };
  
  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col });
  };
  
  const handleNumberInput = (num: number) => {
    if (!selectedCell) return;
    
    const { row, col } = selectedCell;
    
    const newBoard = [...board.map(r => [...r])];
    newBoard[row][col] = num;
    setBoard(newBoard);
  };
  
  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h3 className="text-xl font-semibold mb-4">Sudoku</h3>
      
      <div className="grid grid-cols-9 gap-[1px] bg-gray-400 p-[1px] mb-6 max-w-[450px] mx-auto">
        {board.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {row.map((cell, colIndex) => {
              const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
              const boxRow = Math.floor(rowIndex / 3);
              const boxCol = Math.floor(colIndex / 3);
              const boxColor = (boxRow + boxCol) % 2 === 0 ? 'bg-gray-100' : 'bg-white';
              
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    w-10 h-10 flex items-center justify-center font-bold text-lg select-none
                    ${boxColor}
                    ${isSelected ? 'bg-mentii-200' : ''}
                    cursor-pointer
                  `}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell !== null ? cell : ''}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      
      <div className="grid grid-cols-9 gap-1 mb-6 max-w-[450px] mx-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            className="w-10 h-10 flex items-center justify-center font-bold text-lg bg-mentii-100 hover:bg-mentii-200 cursor-pointer rounded"
            onClick={() => handleNumberInput(num)}
            disabled={!selectedCell}
          >
            {num}
          </button>
        ))}
      </div>
      
      {isComplete && (
        <div className="mt-2 text-center py-3 bg-green-100 text-green-800 rounded-lg">
          🎉 Congratulations! You solved the puzzle!
        </div>
      )}
      
      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={generateSudoku}
          className="px-4 py-2 bg-mentii-500 text-white rounded-md hover:bg-mentii-600 transition-colors"
        >
          New Puzzle
        </button>
        <button
          onClick={() => {
            if (selectedCell) {
              const newBoard = [...board.map(r => [...r])];
              newBoard[selectedCell.row][selectedCell.col] = null;
              setBoard(newBoard);
            }
          }}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          disabled={!selectedCell}
        >
          Clear Cell
        </button>
      </div>
    </div>
  );
};

const CrosswordGame: React.FC = () => {
  const [puzzle, setPuzzle] = React.useState<Array<Array<{letter: string, filled: boolean, number?: number}>>>([
    [{letter: 'M', filled: true, number: 1}, {letter: 'I', filled: true}, {letter: 'N', filled: true}, {letter: 'D', filled: true}, {letter: '', filled: false}],
    [{letter: 'E', filled: true}, {letter: '', filled: false}, {letter: '', filled: false}, {letter: '', filled: false}, {letter: '', filled: false}],
    [{letter: 'D', filled: true}, {letter: '', filled: false}, {letter: 'P', filled: true, number: 2}, {letter: 'E', filled: true}, {letter: 'A', filled: true}],
    [{letter: 'I', filled: true}, {letter: '', filled: false}, {letter: '', filled: false}, {letter: '', filled: false}, {letter: 'C', filled: true}],
    [{letter: 'T', filled: true}, {letter: 'H', filled: true, number: 3}, {letter: 'E', filled: true}, {letter: 'R', filled: true}, {letter: 'A', filled: true}],
    [{letter: 'A', filled: true}, {letter: '', filled: false}, {letter: '', filled: false}, {letter: 'E', filled: true, number: 4}, {letter: 'L', filled: true}],
    [{letter: 'T', filled: true}, {letter: '', filled: false}, {letter: 'B', filled: true, number: 5}, {letter: 'L', filled: true}, {letter: 'A', filled: true}],
    [{letter: 'E', filled: true}, {letter: '', filled: false}, {letter: '', filled: false}, {letter: 'A', filled: true}, {letter: 'X', filled: true}]
  ]);
  
  const clues = {
    across: [
      { number: 1, clue: "Your thoughts and consciousness" },
      { number: 2, clue: "Tranquility and absence of war" },
      { number: 3, clue: "Treatment of illness or injury" },
      { number: 5, clue: "State of being at ease" }
    ],
    down: [
      { number: 1, clue: "Practice of focused awareness and reflection" },
      { number: 4, clue: "To reduce tension or find comfort" }
    ]
  };
  
  const [userPuzzle, setUserPuzzle] = React.useState<Array<Array<string>>>(
    puzzle.map(row => row.map(cell => cell.filled ? cell.letter : ''))
  );
  
  const [activePosition, setActivePosition] = React.useState<{row: number, col: number} | null>(null);
  const [direction, setDirection] = React.useState<'across' | 'down'>('across');
  const [complete, setComplete] = React.useState(false);
  
  React.useEffect(() => {
    const isComplete = userPuzzle.every((row, rowIndex) => 
      row.every((letter, colIndex) => {
        if (puzzle[rowIndex][colIndex].filled) {
          return letter === puzzle[rowIndex][colIndex].letter;
        }
        return true;
      })
    );
    
    setComplete(isComplete);
  }, [userPuzzle]);
  
  const handleCellClick = (row: number, col: number) => {
    if (!puzzle[row][col].filled) return;
    
    if (activePosition?.row === row && activePosition?.col === col) {
      setDirection(prev => prev === 'across' ? 'down' : 'across');
    } else {
      setActivePosition({ row, col });
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!activePosition) return;
    
    const { row, col } = activePosition;
    
    if (e.key === 'Backspace') {
      const newPuzzle = [...userPuzzle.map(r => [...r])];
      newPuzzle[row][col] = '';
      setUserPuzzle(newPuzzle);
      
      moveToAdjacentCell(-1);
      return;
    }
    
    if (/^[a-zA-Z]$/.test(e.key)) {
      const letter = e.key.toUpperCase();
      const newPuzzle = [...userPuzzle.map(r => [...r])];
      newPuzzle[row][col] = letter;
      setUserPuzzle(newPuzzle);
      
      moveToAdjacentCell(1);
    }
    
    if (e.key === 'ArrowRight') {
      setDirection('across');
      moveToAdjacentCell(1);
    } else if (e.key === 'ArrowLeft') {
      setDirection('across');
      moveToAdjacentCell(-1);
    } else if (e.key === 'ArrowDown') {
      setDirection('down');
      moveToAdjacentCell(1);
    } else if (e.key === 'ArrowUp') {
      setDirection('down');
      moveToAdjacentCell(-1);
    }
  };
  
  const moveToAdjacentCell = (delta: number) => {
    if (!activePosition) return;
    
    const { row, col } = activePosition;
    let nextRow = row;
    let nextCol = col;
    
    if (direction === 'across') {
      nextCol += delta;
    } else {
      nextRow += delta;
    }
    
    if (
      nextRow >= 0 && nextRow < puzzle.length &&
      nextCol >= 0 && nextCol < puzzle[0].length &&
      puzzle[nextRow][nextCol].filled
    ) {
      setActivePosition({ row: nextRow, col: nextCol });
    }
  };
  
  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h3 className="text-xl font-semibold mb-4">Crossword</h3>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div>
          <div 
            className="grid grid-cols-5 gap-[1px] bg-gray-400 p-[1px] mb-6 mx-auto"
            tabIndex={0}
            onKeyDown={handleKeyDown}
          >
            {puzzle.map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                {row.map((cell, colIndex) => {
                  const isActive = activePosition?.row === rowIndex && activePosition?.col === colIndex;
                  const isSelected = 
                    (direction === 'across' && activePosition?.row === rowIndex && cell.filled) ||
                    (direction === 'down' && activePosition?.col === colIndex && cell.filled);
                  
                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`
                        w-10 h-10 flex items-center justify-center relative font-bold text-lg
                        ${cell.filled 
                          ? isActive 
                            ? 'bg-mentii-300'
                            : isSelected
                              ? 'bg-mentii-100'
                              : 'bg-white' 
                          : 'bg-gray-900'}
                        ${cell.filled ? 'cursor-pointer' : 'cursor-default'}
                      `}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                    >
                      {cell.number && (
                        <span className="absolute top-0 left-0.5 text-[10px] font-normal">
                          {cell.number}
                        </span>
                      )}
                      {cell.filled && userPuzzle[rowIndex][colIndex]}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
          
          {complete && (
            <div className="mt-2 text-center py-3 bg-green-100 text-green-800 rounded-lg">
              🎉 Congratulations! You solved the crossword!
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="mb-4">
            <h4 className="font-medium mb-2">Across</h4>
            <ul className="space-y-2">
              {clues.across.map(clue => (
                <li key={`across-${clue.number}`} className="text-sm">
                  <span className="font-medium">{clue.number}.</span> {clue.clue}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Down</h4>
            <ul className="space-y-2">
              {clues.down.map(clue => (
                <li key={`down-${clue.number}`} className="text-sm">
                  <span className="font-medium">{clue.number}.</span> {clue.clue}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => {
            setUserPuzzle(puzzle.map(row => row.map(cell => cell.filled ? '' : '')));
            setActivePosition(null);
          }}
          className="px-4 py-2 bg-mentii-500 text-white rounded-md hover:bg-mentii-600 transition-colors"
        >
          Clear Puzzle
        </button>
      </div>
    </div>
  );
};

const JournalingActivity: React.FC = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const { startActivity, endActivity } = useActivityTracker();
  const prompts = [
    "What are three things you're grateful for today?",
    "Describe a small win or achievement from today.",
    "What's something you're looking forward to?",
    "What's something that made you smile today?",
    "If today was perfect, what would it look like?"
  ];

  const [selectedPrompt, setSelectedPrompt] = React.useState(prompts[0]);
  const [journalEntry, setJournalEntry] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    startActivity('journal', 'Quick Journaling');
    return () => endActivity();
  }, []);

  const handlePromptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPrompt(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save your journal entry.",
        variant: "destructive"
      });
      return;
    }
    
    if (journalEntry.trim() === "") {
      toast({
        title: "Empty entry",
        description: "Please write something before saving your journal entry.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await saveJournalEntry({
        userId: user.uid,
        prompt: selectedPrompt,
        content: journalEntry.trim(),
        createdAt: Timestamp.now()
      });
      
      toast({
        title: "Entry saved!",
        description: "Your journal entry has been saved successfully."
      });
      
      // Clear the form
      setJournalEntry("");
      setSelectedPrompt(prompts[0]);
      
      // Navigate to journal page
      setTimeout(() => {
        navigate("/journal");
      }, 1500);
      
    } catch (error) {
      console.error('Error saving journal entry:', error);
      toast({
        title: "Error saving entry",
        description: "There was an error saving your journal entry. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="journaling" className="mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Quick Journaling</CardTitle>
          <CardDescription>Express your thoughts with guided prompts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium mb-1">
                Choose a prompt:
              </label>
              <select
                id="prompt"
                value={selectedPrompt}
                onChange={handlePromptChange}
                className="w-full p-2 border border-gray-300 rounded-md bg-white"
              >
                {prompts.map((prompt, index) => (
                  <option key={index} value={prompt}>
                    {prompt}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mt-4">
              <label htmlFor="entry" className="block text-sm font-medium mb-1">
                Your thoughts:
              </label>
              <textarea
                id="entry"
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                placeholder="Start writing here..."
                className="w-full p-3 border border-gray-300 rounded-md h-32 bg-white"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="flex justify-end mt-4">
              <button 
                type="submit" 
                disabled={isSubmitting || !user}
                className="bg-mentii-500 text-white px-4 py-2 rounded-md hover:bg-mentii-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : "Save to Journal"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const Activities: React.FC = () => {
  const { startActivity, endActivity } = useActivityTracker();

  const handleTabChange = (value: string) => {
    endActivity(); // End current activity
    
    // Start new activity based on tab
    switch (value) {
      case 'drawing':
        startActivity('drawing', 'Digital Drawing');
        break;
      case 'puzzles':
        startActivity('puzzle', 'Brain Puzzles');
        break;
      case 'journaling':
        startActivity('journal', 'Guided Journaling');
        break;
      case 'calmzone':
        startActivity('book', 'Calm Zone Activities');
        break;
    }
  };

  React.useEffect(() => {
    startActivity('drawing', 'Digital Drawing'); // Default activity
    return () => endActivity();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4">Activities</h1>
          <p className="text-center text-lg text-muted-foreground mb-12">
            Engage your mind and express yourself with these activities designed for relaxation and mental wellness.
          </p>
          
          <Tabs defaultValue="drawing" className="w-full" onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="drawing" className="flex items-center gap-2">
                <Brush className="h-4 w-4" />
                <span>Drawing</span>
              </TabsTrigger>
              <TabsTrigger value="puzzles" className="flex items-center gap-2">
                <Puzzle className="h-4 w-4" />
                <span>Puzzles</span>
              </TabsTrigger>
              <TabsTrigger value="journaling" className="flex items-center gap-2">
                <BookCopy className="h-4 w-4" />
                <span>Journaling</span>
              </TabsTrigger>
              <TabsTrigger value="calmzone" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span>Calm Zone</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="drawing">
              <DrawingActivity />
            </TabsContent>
            
            <TabsContent value="puzzles">
              <PuzzleActivity />
            </TabsContent>
            
            <TabsContent value="journaling">
              <JournalingActivity />
            </TabsContent>
            
            <TabsContent value="calmzone">
              <CalmZoneSection />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
      <ChatbotPreview />
    </div>
  );
};

export default Activities;
