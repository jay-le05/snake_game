import { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, Play, RotateCcw } from 'lucide-react';

type Point = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };
const BASE_SPEED = 150;

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const directionRef = useRef(direction);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Keep ref in sync with state to prevent rapid double-turns causing self-collision
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    let isOccupied = true;
    while (isOccupied) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      isOccupied = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }
    return newFood!;
  }, []);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
    setFood(generateFood(INITIAL_SNAKE));
    gameAreaRef.current?.focus();
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isPlaying || isGameOver) return;

      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      const { x, y } = directionRef.current;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    },
    [isPlaying, isGameOver]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setIsGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => {
            const newScore = s + 10;
            if (newScore > highScore) setHighScore(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop(); // Remove tail if no food eaten
        }

        return newSnake;
      });
    };

    // Increase speed slightly as score goes up
    const currentSpeed = Math.max(50, BASE_SPEED - Math.floor(score / 50) * 10);
    const gameLoop = setInterval(moveSnake, currentSpeed);

    return () => clearInterval(gameLoop);
  }, [isPlaying, isGameOver, food, score, highScore, generateFood]);

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      {/* Score Board */}
      <div className="w-full flex justify-between items-center mb-6 px-6 py-4 bg-zinc-900/80 backdrop-blur-md border border-cyan-500/30 rounded-2xl shadow-[0_0_20px_rgba(34,211,238,0.15)]">
        <div className="flex flex-col">
          <span className="text-zinc-400 text-sm uppercase tracking-wider font-bold">Score</span>
          <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
            {score}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-zinc-400 text-sm uppercase tracking-wider font-bold flex items-center gap-1">
            <Trophy size={14} className="text-amber-400" /> High Score
          </span>
          <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">
            {highScore}
          </span>
        </div>
      </div>

      {/* Game Board */}
      <div 
        ref={gameAreaRef}
        className="relative w-full aspect-square max-w-[500px] bg-zinc-950 border-2 border-cyan-500/50 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(34,211,238,0.2)] focus:outline-none"
        tabIndex={0}
      >
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #22d3ee 1px, transparent 1px), linear-gradient(to bottom, #22d3ee 1px, transparent 1px)`,
            backgroundSize: `${100 / GRID_SIZE}% ${100 / GRID_SIZE}%`
          }}
        />

        {/* Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className="absolute rounded-sm"
              style={{
                left: `${(segment.x / GRID_SIZE) * 100}%`,
                top: `${(segment.y / GRID_SIZE) * 100}%`,
                width: `${100 / GRID_SIZE}%`,
                height: `${100 / GRID_SIZE}%`,
                backgroundColor: isHead ? '#22d3ee' : '#06b6d4',
                boxShadow: isHead ? '0 0 10px #22d3ee, 0 0 20px #22d3ee' : '0 0 5px #06b6d4',
                zIndex: isHead ? 10 : 5,
                transform: 'scale(0.9)',
              }}
            />
          );
        })}

        {/* Food */}
        <div
          className="absolute rounded-full bg-fuchsia-500 animate-pulse"
          style={{
            left: `${(food.x / GRID_SIZE) * 100}%`,
            top: `${(food.y / GRID_SIZE) * 100}%`,
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
            boxShadow: '0 0 10px #d946ef, 0 0 20px #d946ef',
            transform: 'scale(0.8)',
          }}
        />

        {/* Overlays */}
        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
            <button
              onClick={startGame}
              className="flex items-center gap-2 px-8 py-4 bg-cyan-500 text-black font-bold rounded-full hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(34,211,238,0.6)] hover:shadow-[0_0_30px_rgba(34,211,238,0.8)] hover:scale-105"
            >
              <Play size={24} className="fill-black" /> START GAME
            </button>
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center z-20">
            <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-400 to-red-600 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] mb-2">
              GAME OVER
            </h2>
            <p className="text-zinc-300 text-lg mb-8">Final Score: <span className="text-cyan-400 font-bold">{score}</span></p>
            
            <button
              onClick={startGame}
              className="flex items-center gap-2 px-8 py-4 bg-fuchsia-500 text-black font-bold rounded-full hover:bg-fuchsia-400 transition-all shadow-[0_0_20px_rgba(217,70,239,0.6)] hover:shadow-[0_0_30px_rgba(217,70,239,0.8)] hover:scale-105"
            >
              <RotateCcw size={24} /> PLAY AGAIN
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-zinc-500 text-sm flex gap-4">
        <span>Use <kbd className="bg-zinc-800 px-2 py-1 rounded text-cyan-400 border border-zinc-700">W</kbd> <kbd className="bg-zinc-800 px-2 py-1 rounded text-cyan-400 border border-zinc-700">A</kbd> <kbd className="bg-zinc-800 px-2 py-1 rounded text-cyan-400 border border-zinc-700">S</kbd> <kbd className="bg-zinc-800 px-2 py-1 rounded text-cyan-400 border border-zinc-700">D</kbd> or Arrow Keys to move</span>
      </div>
    </div>
  );
}
