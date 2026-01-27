import { useState } from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import { Settings } from './components/Settings';
import { Cell } from './components/Cell';
import { Controls } from './components/Controls';
import { Timer } from './components/Timer';
import { ScoreBoard } from './components/ScoreBoard';
import { WordList } from './components/WordList';
import { HintModal } from './components/HintModal';
import { VictoryModal } from './components/VictoryModal';
import { useGameState, type Difficulty } from './lib/gameState';

// Localized labels
const LABELS = {
  en: {
    title: 'Kudoko',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    expert: 'Expert',
    newGame: 'New Game',
    loading: 'Loading...',
    paused: 'Paused',
    puzzle: 'Puzzle',
    goToPuzzle: 'Go to #',
  },
  ja: {
    title: '漢字数独',
    easy: '簡単',
    medium: '普通',
    hard: '難しい',
    expert: '達人',
    newGame: '新規ゲーム',
    loading: '読み込み中...',
    paused: '一時停止中',
    puzzle: 'パズル',
    goToPuzzle: '番号へ',
  },
};

function AppContent() {
  const [state, actions] = useGameState();
  const [showHint, setShowHint] = useState(false);
  const [currentHint, setCurrentHint] = useState<{ meaning: string; reading: string } | null>(null);
  const [puzzleInput, setPuzzleInput] = useState('');

  const labels = LABELS[state.language];

  // Check if a cell value is valid according to Sudoku rules
  const isCellValid = (row: number, col: number, val: number | null): boolean => {
    if (val === null) return true;
    if (state.difficulty === 'expert') return true;

    const board = state.currentBoard;

    for (let i = 0; i < 9; i++) {
      if (i !== col && board[row][i] === val) return false;
    }

    for (let i = 0; i < 9; i++) {
      if (i !== row && board[i][col] === val) return false;
    }

    if (state.difficulty !== 'expert') {
      const startRow = Math.floor(row / 3) * 3;
      const startCol = Math.floor(col / 3) * 3;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const r = startRow + i;
          const c = startCol + j;
          if ((r !== row || c !== col) && board[r][c] === val) return false;
        }
      }
    }

    return true;
  };

  // Handle hint request
  const handleHintRequest = () => {
    const hint = actions.requestHint();
    if (hint) {
      setCurrentHint(hint);
      setShowHint(true);
    }
  };

  // Handle puzzle ID input
  const handlePuzzleGo = () => {
    const id = parseInt(puzzleInput, 10);
    if (!isNaN(id)) {
      actions.loadPuzzle(id);
      setPuzzleInput('');
    }
  };

  // Loading state
  if (!state.puzzle || state.currentBoard.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div
          className="text-xl animate-pulse"
          style={{ color: 'var(--text-muted)' }}
        >
          {labels.loading}
        </div>
      </div>
    );
  }

  const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];
  const displaySymbols = state.puzzle.symbols;

  return (
    <div className="min-h-screen flex flex-col items-center py-6 px-4">
      {/* Header - compact */}
      <header className="mb-4 w-full max-w-6xl">
        <div className="flex items-center justify-between">
          {/* Title */}
          <h1
            className="text-2xl md:text-3xl font-bold kanji-cell"
            style={{ color: 'var(--text-primary)' }}
          >
            {labels.title}
          </h1>

          {/* Settings button */}
          <Settings
            language={state.language}
            onLanguageChange={actions.setLanguage}
          />
        </div>
      </header>

      {/* Main content - Board LEFT, Controls RIGHT */}
      <div className="flex flex-col lg:flex-row gap-6 items-start justify-center w-full max-w-6xl">

        {/* LEFT SIDE: Board */}
        <div className="flex-shrink-0 relative min-w-0 w-[90vw] max-w-[420px] sm:max-w-[480px] lg:max-w-[520px] xl:max-w-[600px]">
          {/* Puzzle ID display */}
          <div className="mb-2 text-center">
            <span
              className="text-sm font-medium"
              style={{ color: 'var(--text-muted)' }}
            >
              {labels.puzzle} #{state.puzzleId}
            </span>
            <div
              className="mt-1 text-xs break-words"
              style={{ color: 'var(--text-muted)' }}
            >
              ({state.puzzle.title})
            </div>
          </div>

          {/* Pause overlay */}
          {state.isPaused && (
            <div
              className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl"
              style={{ background: 'var(--bg-glass)', backdropFilter: 'blur(8px)' }}
            >
              <div className="text-center">
                <div className="text-5xl mb-3">⏸️</div>
                <p
                  className="text-lg font-medium"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {labels.paused}
                </p>
              </div>
            </div>
          )}

          {/* Board */}
          <div
            className="glass rounded-2xl overflow-hidden grid grid-cols-9 w-full aspect-square"
            style={{ border: '2px solid var(--border-glass)' }}
          >
            {state.currentBoard.map((rowArr, rowIndex) =>
              rowArr.map((val, colIndex) => (
                <Cell
                  key={`${rowIndex}-${colIndex}`}
                  row={rowIndex}
                  col={colIndex}
                  value={val}
                  cellData={state.puzzle!.grid[rowIndex][colIndex]}
                  isSelected={
                    state.selectedCell?.row === rowIndex &&
                    state.selectedCell?.col === colIndex
                  }
                  isValid={isCellValid(rowIndex, colIndex, val)}
                  notes={state.notes[rowIndex][colIndex]}
                  symbols={displaySymbols}
                  onClick={() => actions.selectCell(rowIndex, colIndex)}
                  isPaused={state.isPaused}
                />
              ))
            )}
          </div>
        </div>

        {/* RIGHT SIDE: All Controls & Info */}
        <div className="flex flex-col w-full lg:w-80 gap-4">

          {/* Difficulty selector */}
          <div className="grid grid-cols-4 gap-2">
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => actions.setDifficulty(diff)}
                className={`
                  px-2 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all
                  ${state.difficulty === diff
                    ? 'bg-accent text-white shadow-lg'
                    : 'glass glass-hover'}
                `}
                style={state.difficulty !== diff ? { color: 'var(--text-secondary)' } : undefined}
              >
                {labels[diff]}
              </button>
            ))}
          </div>

          {/* Timer */}
          <Timer
            elapsedTime={state.elapsedTime}
            isPaused={state.isPaused}
            onTogglePause={actions.togglePause}
            language={state.language}
          />

          {/* Score */}
          <ScoreBoard
            score={state.score}
            hintsRemaining={state.hintsRemaining}
            hintsUsed={state.hintsUsed}
            wordsFound={state.foundWords.length}
            language={state.language}
          />

          {/* Word/Vocab List */}
          {state.difficulty !== 'expert' && (
            <WordList
              foundWords={state.puzzle.vocabulary.map(w => ({
                word: { word: w.word, reading: w.reading, meaning: w.meaning },
                cells: [],
                direction: 'row' as const,
              }))}
              language={state.language}
            />
          )}

          {/* Controls */}
          <Controls
            kanjiList={state.puzzle.symbols}
            onInput={actions.inputValue}
            onInputSymbol={actions.inputSymbol}
            onDelete={actions.deleteValue}
            onNoteToggle={actions.toggleNoteMode}
            onHint={handleHintRequest}
            isNoteMode={state.isNoteMode}
            difficulty={state.difficulty}
            hintsRemaining={state.hintsRemaining}
            language={state.language}
          />

          {/* New Game & Puzzle ID */}
          <div className="flex gap-2">
            <button
              onClick={() => actions.startNewGame()}
              className="flex-1 py-3 glass glass-hover rounded-xl font-medium transition-all"
              style={{ color: 'var(--text-secondary)' }}
            >
              {labels.newGame}
            </button>

            <div className="flex gap-1">
              <input
                type="text"
                value={puzzleInput}
                onChange={(e) => setPuzzleInput(e.target.value)}
                placeholder="#"
                className="w-16 px-2 py-2 text-center glass rounded-xl text-sm"
                style={{ color: 'var(--text-primary)' }}
                onKeyDown={(e) => e.key === 'Enter' && handlePuzzleGo()}
              />
              <button
                onClick={handlePuzzleGo}
                className="px-3 py-2 glass glass-hover rounded-xl text-sm"
                style={{ color: 'var(--text-secondary)' }}
              >
                Go
              </button>
            </div>
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

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
