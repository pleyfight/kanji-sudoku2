import { useState, useEffect, useCallback } from 'react';
import { Cell } from './components/Cell';
import { Controls } from './components/Controls';
import { generateSudoku, checkBoard } from './lib/sudoku';
import type { Board } from './lib/sudoku';
import { KANJI_SETS, VALID_WORDS } from './lib/constants';

function App() {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [currentSetId, setCurrentSetId] = useState('elements');
  
  const [initialBoard, setInitialBoard] = useState<Board>([]);
  const [board, setBoard] = useState<Board>([]);
  const [solvedBoard, setSolvedBoard] = useState<Board>([]);
  
  // cellNotes[row][col] = [1, 3, ...]
  const [notes, setNotes] = useState<number[][][]>([]);
  
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
  const [isNoteMode, setIsNoteMode] = useState(false);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [wordCells, setWordCells] = useState<Set<string>>(new Set()); // "row-col" strings

  const currentSet = KANJI_SETS.find(s => s.id === currentSetId) || KANJI_SETS[1];

  // Initialize Game
  const startNewGame = useCallback((diff = difficulty) => {
    const { solved, puzzle } = generateSudoku(diff);
    setInitialBoard(puzzle.map(row => [...row]));
    setBoard(puzzle.map(row => [...row]));
    setSolvedBoard(solved);
    
    // Init empty notes
    const emptyNotes = Array.from({ length: 9 }, () => 
      Array.from({ length: 9 }, () => [])
    );
    setNotes(emptyNotes);
    setFoundWords([]);
    setWordCells(new Set());
    setSelectedCell(null);
  }, [difficulty]);

  useEffect(() => {
    startNewGame();
  }, []); // Run once on mount

  // Check for words
  useEffect(() => {
    if (!board.length) return;

    const newFoundWords: string[] = [];
    const newWordCells = new Set<string>();

    const checkLine = (line: (number | null)[], isRow: boolean, index: number) => {
      // Convert line to Kanji string, use '?' for null
      const lineStr = line.map(v => v ? currentSet.items[v-1] : '?').join('');
      
      // Check all valid words
      Object.keys(VALID_WORDS).forEach(word => {
        const idx = lineStr.indexOf(word);
        if (idx !== -1) {
          // Word found!
          newFoundWords.push(`${word} (${VALID_WORDS[word as keyof typeof VALID_WORDS]})`);
          // Mark cells
          for (let i = 0; i < word.length; i++) {
            if (isRow) {
              newWordCells.add(`${index}-${idx + i}`);
            } else {
              newWordCells.add(`${idx + i}-${index}`);
            }
          }
        }
      });
    };

    // Check Rows
    for (let r = 0; r < 9; r++) {
      checkLine(board[r], true, r);
    }

    // Check Cols
    for (let c = 0; c < 9; c++) {
      const colData = [];
      for (let r = 0; r < 9; r++) {
        colData.push(board[r][c]);
      }
      checkLine(colData, false, c);
    }

    // De-duplicate found words for display
    setFoundWords([...new Set(newFoundWords)]);
    setWordCells(newWordCells);

  }, [board, currentSet]);

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col });
  };

  const handleInput = (num: number) => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;

    // Cannot edit initial cells
    if (initialBoard[row][col] !== null) return;

    if (isNoteMode) {
      setNotes(prev => {
        const newNotes = [...prev];
        const cellNotes = [...newNotes[row][col]];
        if (cellNotes.includes(num)) {
          newNotes[row][col] = cellNotes.filter(n => n !== num);
        } else {
          newNotes[row][col] = [...cellNotes, num].sort();
        }
        return newNotes;
      });
    } else {
      setBoard(prev => {
        const newBoard = prev.map(r => [...r]);
        newBoard[row][col] = num;
        return newBoard;
      });
      // Clear notes for this cell
      setNotes(prev => {
        const newNotes = [...prev];
        newNotes[row][col] = [];
        return newNotes;
      });
    }
  };

  const handleDelete = () => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    if (initialBoard[row][col] !== null) return;

    setBoard(prev => {
      const newBoard = prev.map(r => [...r]);
      newBoard[row][col] = null;
      return newBoard;
    });
  };

  const isBoardValid = (r: number, c: number, val: number | null) => {
    if (val === null) return true;
    // Check row
    for (let i = 0; i < 9; i++) {
      if (i !== c && board[r][i] === val) return false;
    }
    // Check col
    for (let i = 0; i < 9; i++) {
      if (i !== r && board[i][c] === val) return false;
    }
    // Check box
    const startRow = Math.floor(r / 3) * 3;
    const startCol = Math.floor(c / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if ((startRow + i !== r || startCol + j !== c) && board[startRow + i][startCol + j] === val) return false;
      }
    }
    return true;
  };
  
  const handleCheck = () => {
      if (checkBoard(board, solvedBoard)) {
          alert("Congratulations! The board is correct.");
      } else {
          alert("Keep going! There are some errors.");
      }
  }

  const handleHint = () => {
    // If cell selected and empty/wrong, fill it
    if (selectedCell) {
      const { row, col } = selectedCell;
      if (initialBoard[row][col] === null) {
        setBoard(prev => {
          const newBoard = prev.map(r => [...r]);
          newBoard[row][col] = solvedBoard[row][col];
          return newBoard;
        });
        return;
      }
    }

    // Otherwise find random empty cell
    const emptyCells: {r: number, c: number}[] = [];
    board.forEach((row, r) => {
      row.forEach((val, c) => {
        if (val === null) emptyCells.push({r, c});
      });
    });

    if (emptyCells.length > 0) {
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      setBoard(prev => {
        const newBoard = prev.map(r => [...r]);
        newBoard[randomCell.r][randomCell.c] = solvedBoard[randomCell.r][randomCell.c];
        return newBoard;
      });
    }
  };

  if (board.length === 0) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 font-serif">
      <header className="mb-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-ink mb-2">Kanji Wordoku</h1>
        <p className="text-ink/60 mb-4">Discover the hidden words.</p>
        
        <div className="flex gap-4 justify-center mb-4">
          <select 
            value={difficulty} 
            onChange={(e) => {
              setDifficulty(e.target.value as any);
              startNewGame(e.target.value as any);
            }}
            className="bg-paper border border-ink/30 rounded px-2 py-1"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          
          <select 
            value={currentSetId} 
            onChange={(e) => setCurrentSetId(e.target.value)}
            className="bg-paper border border-ink/30 rounded px-2 py-1"
          >
            {KANJI_SETS.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 items-start justify-center w-full max-w-6xl">
        {/* Main Board */}
        <div className="flex-shrink-0 relative">
           <div className="absolute -top-6 left-0 text-xs text-ink/40 w-full flex justify-between px-2">
              <span>← Lines (Words)</span>
              <span>Cols (Words) ↓</span>
           </div>
           
           <div className="border-4 border-ink bg-paper shadow-lg grid grid-cols-9 w-[90vw] max-w-[500px] aspect-square">
            {board.map((rowArr, rowIndex) => (
              rowArr.map((val, colIndex) => (
                <Cell 
                  key={`${rowIndex}-${colIndex}`}
                  row={rowIndex}
                  col={colIndex}
                  value={val}
                  isInitial={initialBoard[rowIndex][colIndex] !== null}
                  isSelected={selectedCell?.row === rowIndex && selectedCell?.col === colIndex}
                  isValid={isBoardValid(rowIndex, colIndex, val)}
                  isPartOfWord={wordCells.has(`${rowIndex}-${colIndex}`)}
                  notes={notes[rowIndex][colIndex]}
                  kanjiList={currentSet.items}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                />
              ))
            ))}
          </div>
        </div>

        {/* Sidebar Info & Controls */}
        <div className="flex flex-col w-full max-w-md gap-6">
          
          {/* Found Words Panel */}
          <div className="bg-paper border border-ink/20 p-4 rounded shadow-sm min-h-[150px]">
            <h3 className="text-lg font-bold border-b border-ink/20 pb-2 mb-2 text-cinnabar">
              Discovered Words
            </h3>
            {foundWords.length > 0 ? (
              <ul className="space-y-1">
                {foundWords.map((w, i) => (
                  <li key={i} className="text-lg">{w}</li>
                ))}
              </ul>
            ) : (
              <p className="text-ink/40 italic">Form words horizontally or vertically...</p>
            )}
          </div>

          <Controls 
            kanjiList={currentSet.items}
            onInput={handleInput}
            onDelete={handleDelete}
            onNoteToggle={() => setIsNoteMode(!isNoteMode)}
            isNoteMode={isNoteMode}
          />
          
          <div className="flex justify-center gap-4 mt-4">
            <button 
                onClick={handleHint}
                className="px-6 py-3 bg-paper border border-ink/30 text-ink rounded shadow hover:bg-ink/5 transition-colors"
            >
                Hint
            </button>
            <button 
                onClick={handleCheck}
                className="px-6 py-3 bg-indigo text-paper rounded shadow hover:bg-indigo/80 transition-colors"
            >
                Check
            </button>
            <button 
                onClick={() => startNewGame()}
                className="px-6 py-3 bg-ink text-paper rounded shadow hover:bg-ink/80 transition-colors"
            >
                New Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
