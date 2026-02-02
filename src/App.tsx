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
import { HomeMenu } from './components/HomeMenu';
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
  const [view, setView] = useState<'home' | 'game'>('home');

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

  const handleDifficultySelect = (diff: Difficulty) => {
    actions.setDifficulty(diff);
    actions.startNewGame();
    setView('game');
  };

  const handleBackToMenu = () => {
    setView('home');
  };

  // Loading state
  const isLoading = !state.puzzle || state.currentBoard.length === 0;
  const displaySymbols = state.puzzle?.symbols || [];

  return (
    <div className="min-h-screen flex flex-col items-center py-6 px-4 font-sans bg-paper transition-colors duration-300">

      {/* Settings (Always visible at top right) */}
      <div className="w-full max-w-6xl flex justify-end mb-4 absolute top-4 right-4 z-50 pointer-events-none">
        <div className="pointer-events-auto">
          <Settings
            language={state.language}
            onLanguageChange={actions.setLanguage}
          />
        </div>
      </div>

      {view === 'home' ? (
        <HomeMenu
          onSelectDifficulty={handleDifficultySelect}
          language={state.language}
        />
      ) : (
        /* GAME VIEW */
        <>
          {isLoading ? (
            <div className="flex h-[80vh] items-center justify-center">
              <div className="text-xl animate-pulse text-ink">{labels.loading}</div>
            </div>
          ) : (
            <>
              {/* Header - Game Mode */}
              <header className="mb-6 w-full max-w-6xl flex items-center justify-between mt-8 relative z-10">
                <button
                  onClick={handleBackToMenu}
                  className="text-lg font-bold hover:underline decorate-2 underline-offset-4 flex items-center gap-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  ← {LABELS[state.language].title}
                </button>

                <div className="text-center">
                  <h1 className="text-3xl font-serif font-bold" style={{ color: 'var(--text-primary)' }}>
                    {state.puzzle?.title}
                  </h1>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    #{state.puzzleId} • {labels[state.difficulty]}
                  </span>
                </div>

                <div className="w-20"></div> {/* Spacer for alignment */}
              </header>

              {/* Main content - Board LEFT, Controls RIGHT */}
              <div className="flex flex-col lg:flex-row gap-8 items-start justify-center w-full max-w-6xl animate-slide-up">

                {/* LEFT SIDE: Board */}
                <div className="flex-shrink-0 relative min-w-0 w-[90vw] max-w-[420px] sm:max-w-[480px] lg:max-w-[520px] xl:max-w-[600px]">

                  {/* Pause overlay */}
                  {state.isPaused && (
                    <div
                      className="absolute inset-0 z-10 flex items-center justify-center bg-paper/90 backdrop-blur-none border-2 border-primary"
                    >
                      <div className="text-center">
                        <div className="text-5xl mb-3">⏸️</div>
                        <p className="text-lg font-medium text-ink">
                          {labels.paused}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Board */}
                  <div
                    className="glass overflow-hidden grid grid-cols-9 w-full aspect-square"
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
                <div className="flex flex-col w-full lg:w-80 gap-6">

                  {/* Timer & Score */}
                  <div className="glass p-4 flex justify-between items-center">
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

                  {/* Word/Vocab List */}
                  {state.difficulty !== 'expert' && (
                    <WordList
                      foundWords={state.puzzle!.vocabulary.map(w => ({
                        word: { word: w.word, reading: w.reading, meaning: w.meaning },
                        cells: [],
                        direction: 'row' as const,
                      }))}
                      language={state.language}
                    />
                  )}

                  {/* Controls */}
                  <Controls
                    kanjiList={state.puzzle!.symbols}
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
                      className="flex-1 py-3 border-2 border-primary hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors font-bold rounded-none"
                      style={{ borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
                    >
                      {labels.newGame}
                    </button>

                    <div className="flex gap-1">
                      <input
                        type="text"
                        value={puzzleInput}
                        onChange={(e) => setPuzzleInput(e.target.value)}
                        placeholder="#"
                        className="w-16 px-2 py-2 text-center border-2 border-primary bg-transparent text-ink font-mono font-bold rounded-none"
                        style={{ borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
                        onKeyDown={(e) => e.key === 'Enter' && handlePuzzleGo()}
                      />
                      <button
                        onClick={handlePuzzleGo}
                        className="px-3 py-2 border-2 border-primary hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors rounded-none text-sm font-bold"
                        style={{ borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
                      >
                        Go
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}

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
