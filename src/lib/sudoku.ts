// Standard Sudoku Logic using 1-9 integers.

export type Board = (number | null)[][];

const BLANK = null;

export const generateEmptyBoard = (): Board => {
  return Array.from({ length: 9 }, () => Array(9).fill(BLANK));
};

const shuffle = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const isValid = (board: Board, row: number, col: number, num: number): boolean => {
  // Check Row
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) return false;
  }

  // Check Col
  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num) return false;
  }

  // Check 3x3 Box
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j] === num) return false;
    }
  }

  return true;
};

const solve = (board: Board, randomize = false): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === BLANK) {
        const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const candidates = randomize ? shuffle(nums) : nums;

        for (const num of candidates) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solve(board, randomize)) return true;
            board[row][col] = BLANK;
          }
        }
        return false;
      }
    }
  }
  return true;
};

export const generateSudoku = (difficulty: 'easy' | 'medium' | 'hard' = 'easy') => {
  const solvedBoard = generateEmptyBoard();
  
  // Fill diagonal 3x3 matrices first (independent of each other) to speed up solving
  // Actually, standard randomized solve is fast enough for 9x9
  solve(solvedBoard, true);

  // Clone for the puzzle
  const puzzleBoard = solvedBoard.map(row => [...row]);
  
  // Remove numbers based on difficulty
  // Easy: Remove ~30
  // Medium: Remove ~40
  // Hard: Remove ~50
  let attempts = difficulty === 'easy' ? 30 : difficulty === 'medium' ? 45 : 55;
  
  while (attempts > 0) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    
    if (puzzleBoard[row][col] !== BLANK) {
      puzzleBoard[row][col] = BLANK;
      attempts--;
      // Ideally we check if it's still uniquely solvable, but for a prototype this is acceptable.
    }
  }

  return { solved: solvedBoard, puzzle: puzzleBoard };
};

export const checkBoard = (current: Board, solved: Board): boolean => {
  for(let i=0; i<9; i++) {
    for(let j=0; j<9; j++) {
       if (current[i][j] !== solved[i][j]) return false;
    }
  }
  return true;
};
