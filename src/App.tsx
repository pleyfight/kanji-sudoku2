import { useState } from 'react';
import { Cell } from './components/Cell';
import { Controls } from './components/Controls';
import { Timer } from './components/Timer';
import { ScoreBoard } from './components/ScoreBoard';
import { WordList } from './components/WordList';
import { HintModal } from './components/HintModal';
import { VictoryModal } from './components/VictoryModal';
import { LanguageToggle } from './components/LanguageToggle';
import { useGameState, type Difficulty } from './lib/gameState';

// Localized labels
const LABELS = {
  en: {
    title: 'Kanji Sudoku',
    subtitle: 'Discover the hidden words',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    newGame: 'New Game',
    check: 'Check',
    rowsHint: '← Rows (Words)',
    colsHint: 'Columns (Words) ↓',
    loading: 'Loading...',
    correct: 'Congratulations! The puzzle is correct!',
    incorrect: 'Keep going! There are some errors.',
    paused: 'Game Paused',
    possibleWords: 'Possible Words',
  },
  ja: {
    title: '漢字数独',
    subtitle: '隠された言葉を発見しよう',
    easy: '簡単',
    medium: '普通',
    hard: '難しい',
    newGame: '新しいゲーム',
    check: '確認',
    rowsHint: '← 行（単語）',
    colsHint: '列（単語）↓',
    loading: '読み込み中...',
    correct: 'おめでとうございます！パズルが正しいです！',
    incorrect: '続けてください！間違いがあります。',
    paused: 'ゲーム一時停止',
    possibleWords: '可能な単語',
  },
};

function App() {
  const [state, actions] = useGameState();
  const [showHint, setShowHint] = useState(false);
  const [currentHint, setCurrentHint] = useState<{ meaning: string; reading: string } | null>(null);

  const labels = LABELS[state.language];

  // Check if a cell value is valid according to Sudoku rules
  const isCellValid = (row: number, col: number, val: number | null): boolean => {
    if (val === null) return true;

    const board = state.currentBoard;

    // Check row
    for (let i = 0; i < 9; i++) {
      if (i !== col && board[row][i] === val) return false;
    }

    // Check column
    for (let i = 0; i < 9; i++) {
      if (i !== row && board[i][col] === val) return false;
    }

    // Check 3x3 box
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const r = startRow + i;
        const c = startCol + j;
        if ((r !== row || c !== col) && board[r][c] === val) return false;
      }
    }

    return true;
  };

  // Get cells that are part of found words
  const wordCells = new Set<string>();
  state.foundWords.forEach(({ cells }) => {
    cells.forEach(c => wordCells.add(`${c.row}-${c.col}`));
  });

  // Handle hint request
  const handleHintRequest = () => {
    const hint = actions.requestHint();
    if (hint) {
      setCurrentHint(hint);
      setShowHint(true);
    }
  };

  // Handle check
  const handleCheck = () => {
    const isCorrect = actions.checkSolution();
    if (isCorrect) {
      alert(labels.correct);
    } else {
      alert(labels.incorrect);
    }
  };

  // Loading state
  if (!state.gameBoard || state.currentBoard.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-2xl text-ink/60 animate-pulse">{labels.loading}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-6 px-4 font-serif">
      {/* Header */}
      <header className="mb-6 text-center w-full max-w-6xl">
        <div className="flex items-center justify-between mb-4">
          <LanguageToggle
            language={state.language}
            onToggle={actions.setLanguage}
          />
          <h1 className="text-3xl md:text-4xl font-bold text-ink">{labels.title}</h1>
          <div className="w-24" /> {/* Spacer for alignment */}
        </div>

        <p className="text-ink/60 mb-4">{labels.subtitle}</p>

        {/* Difficulty selector */}
        <div className="flex gap-2 justify-center mb-4">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
            <button
              key={diff}
              onClick={() => actions.setDifficulty(diff)}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all
                ${state.difficulty === diff
                  ? 'bg-indigo text-paper shadow-md'
                  : 'bg-paper border border-ink/20 text-ink hover:border-indigo hover:text-indigo'}
              `}
            >
              {labels[diff]}
            </button>
          ))}
        </div>

        {/* Timer and Score row */}
        <div className="flex flex-wrap gap-4 justify-center items-center">
          <Timer
            elapsedTime={state.elapsedTime}
            isPaused={state.isPaused}
            onTogglePause={actions.togglePause}
            language={state.language}
          />
          <ScoreBoard
            score={state.score}
            hintsRemaining={state.hintsRemaining}
            hintsUsed={state.hintsUsed}
            wordsFound={state.foundWords.length}
            language={state.language}
          />
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row gap-6 items-start justify-center w-full max-w-6xl">
        {/* Board Section */}
        <div className="flex-shrink-0 relative">
          {/* Direction hints */}
          <div className="absolute -top-6 left-0 text-xs text-ink/40 w-full flex justify-between px-2">
            <span>{labels.rowsHint}</span>
            <span>{labels.colsHint}</span>
          </div>

          {/* Pause overlay */}
          {state.isPaused && (
            <div className="absolute inset-0 bg-paper/90 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <div className="text-4xl mb-2">⏸️</div>
                <p className="text-xl font-bold text-ink">{labels.paused}</p>
              </div>
            </div>
          )}

          {/* Board */}
          <div className="border-4 border-ink bg-paper shadow-lg rounded-lg overflow-hidden grid grid-cols-9 w-[90vw] max-w-[450px] aspect-square">
            {state.currentBoard.map((rowArr, rowIndex) =>
              rowArr.map((val, colIndex) => (
                <Cell
                  key={`${rowIndex}-${colIndex}`}
                  row={rowIndex}
                  col={colIndex}
                  value={val}
                  isInitial={state.initialBoard[rowIndex][colIndex] !== null}
                  isSelected={
                    state.selectedCell?.row === rowIndex &&
                    state.selectedCell?.col === colIndex
                  }
                  isValid={isCellValid(rowIndex, colIndex, val)}
                  isPartOfWord={wordCells.has(`${rowIndex}-${colIndex}`)}
                  notes={state.notes[rowIndex][colIndex]}
                  kanjiList={state.gameBoard!.kanjiSet}
                  onClick={() => actions.selectCell(rowIndex, colIndex)}
                  isPaused={state.isPaused}
                />
              ))
            )}
          </div>

          {/* Possible words hint */}
          <div className="mt-4 text-center">
            <p className="text-xs text-ink/50">
              {labels.possibleWords}: {state.gameBoard.possibleWords.length}
            </p>
          </div>
        </div>

        {/* Controls Section */}
        <div className="flex flex-col w-full max-w-md gap-4">
          {/* Word List */}
          <WordList
            foundWords={state.foundWords}
            language={state.language}
          />

          {/* Controls */}
          <Controls
            kanjiList={state.gameBoard.kanjiSet}
            onInput={actions.inputValue}
            onDelete={actions.deleteValue}
            onNoteToggle={actions.toggleNoteMode}
            onHint={handleHintRequest}
            isNoteMode={state.isNoteMode}
            difficulty={state.difficulty}
            hintsRemaining={state.hintsRemaining}
            language={state.language}
          />

          {/* Action buttons */}
          <div className="flex justify-center gap-3 mt-4">
            <button
              onClick={handleCheck}
              className="px-6 py-3 bg-indigo text-paper rounded-lg shadow-md 
                hover:bg-indigo/90 transition-colors font-medium"
            >
              {labels.check}
            </button>
            <button
              onClick={() => actions.startNewGame()}
              className="px-6 py-3 bg-ink text-paper rounded-lg shadow-md 
                hover:bg-ink/80 transition-colors font-medium"
            >
              {labels.newGame}
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <HintModal
        isOpen={showHint}
        hint={currentHint}
        onClose={() => setShowHint(false)}
        language={state.language}
      />

      <VictoryModal
        isOpen={state.isComplete}
        score={state.score}
        elapsedTime={state.elapsedTime}
        wordsFound={state.foundWords.length}
        hintsUsed={state.hintsUsed}
        onNewGame={() => actions.startNewGame()}
        language={state.language}
      />
    </div>
  );
}

export default App;
