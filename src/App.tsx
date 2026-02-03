import { useState, useEffect, useRef } from 'react';
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
import { KanjiHoverBox } from './components/KanjiHoverBox';
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
  const [pendingPuzzleId, setPendingPuzzleId] = useState<number | null>(null);
  const [pendingDifficulty, setPendingDifficulty] = useState<Difficulty | null>(null);
  const [showDifficultyConfirm, setShowDifficultyConfirm] = useState(false);
  const [showMobileKanjiBox, setShowMobileKanjiBox] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileExpertInput, setMobileExpertInput] = useState('');
  const mobileExpertInputRef = useRef<HTMLInputElement>(null);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Helper: Get difficulty from puzzle ID range
  const getDifficultyFromId = (id: number): Difficulty | null => {
    if (id >= 1001 && id <= 11000) return 'easy';
    if (id >= 11001 && id <= 21000) return 'medium';
    if (id >= 21001 && id <= 31000) return 'hard';
    if (id >= 31001 && id <= 41000) return 'expert';
    return null;
  };

  // Handle puzzle ID input - only allow numbers, max 5 chars
  const handlePuzzleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 5);
    setPuzzleInput(value);
  };

  // Handle puzzle ID go button
  const handlePuzzleGo = () => {
    const id = parseInt(puzzleInput, 10);
    if (isNaN(id)) return;

    const targetDifficulty = getDifficultyFromId(id);
    if (!targetDifficulty) {
      // Invalid puzzle ID - clear input and alert
      setPuzzleInput('');
      alert('Invalid puzzle ID. Valid range: 1001-41000');
      return;
    }

    // Check if switching difficulty
    if (targetDifficulty !== state.difficulty) {
      setPendingPuzzleId(id);
      setPendingDifficulty(targetDifficulty);
      setShowDifficultyConfirm(true);
    } else {
      // Same difficulty, just load
      actions.loadPuzzle(id);
      setPuzzleInput('');
    }
  };

  // Confirm difficulty switch
  const handleConfirmDifficultySwitch = () => {
    if (pendingPuzzleId && pendingDifficulty) {
      actions.setDifficulty(pendingDifficulty);
      actions.loadPuzzle(pendingPuzzleId);
      setPuzzleInput('');
    }
    setShowDifficultyConfirm(false);
    setPendingPuzzleId(null);
    setPendingDifficulty(null);
  };

  // Cancel difficulty switch
  const handleCancelDifficultySwitch = () => {
    setShowDifficultyConfirm(false);
    setPendingPuzzleId(null);
    setPendingDifficulty(null);
  };

  const handleDifficultySelect = (diff: Difficulty) => {
    actions.setDifficulty(diff);
    actions.startNewGame(diff);  // Pass difficulty directly to avoid stale state
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
              <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-center lg:items-start justify-center w-full max-w-6xl animate-slide-up px-2 lg:px-0">

                {/* LEFT SIDE: Board */}
                <div className="flex-shrink-0 relative min-w-0 w-full max-w-[min(90vw,420px)] sm:max-w-[480px] lg:max-w-[520px] xl:max-w-[600px] mx-auto lg:mx-0">

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
                          isPaused={state.isPaused}
                          onClick={() => {
                            actions.selectCell(rowIndex, colIndex);
                            // Show hover box or keyboard on mobile when tapping editable cell
                            const cellData = state.puzzle?.grid[rowIndex][colIndex];
                            if (isMobile && cellData && !cellData.isRevealed && !cellData.isKana) {
                              if (state.difficulty === 'expert') {
                                // Expert mode: focus hidden input to show keyboard
                                setTimeout(() => mobileExpertInputRef.current?.focus(), 50);
                              } else {
                                // Easy/Medium/Hard: show hover box
                                setShowMobileKanjiBox(true);
                              }
                            }
                          }}
                        />
                      ))
                    )}
                  </div>

                  {/* Hidden input for Expert mode mobile keyboard */}
                  {isMobile && state.difficulty === 'expert' && (
                    <input
                      ref={mobileExpertInputRef}
                      type="text"
                      inputMode="text"
                      value={mobileExpertInput}
                      onChange={(e) => {
                        const value = e.target.value;
                        setMobileExpertInput(value);
                        // Auto-submit when a valid character is entered
                        if (value.length > 0) {
                          const lastChar = value[value.length - 1];
                          actions.inputSymbol(lastChar);
                          setMobileExpertInput('');
                        }
                      }}
                      onBlur={() => setMobileExpertInput('')}
                      className="absolute opacity-0 pointer-events-none"
                      style={{ position: 'absolute', left: '-9999px' }}
                      lang="ja"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck={false}
                    />
                  )}
                </div>

                {/* RIGHT SIDE: All Controls & Info */}
                <div className="flex flex-col w-full max-w-[min(90vw,420px)] lg:max-w-none lg:w-80 gap-4 lg:gap-6 mx-auto lg:mx-0">

                  {/* Timer & Score */}
                  <div className="glass p-3 lg:p-4 flex justify-between items-center">
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

                  {/* Controls - hide kanji grid on mobile for non-expert */}
                  <Controls
                    kanjiList={state.puzzle!.symbols}
                    onInput={(num) => {
                      actions.inputValue(num);
                      if (isMobile) setShowMobileKanjiBox(false);
                    }}
                    onInputSymbol={actions.inputSymbol}
                    onDelete={() => {
                      actions.deleteValue();
                      if (isMobile) setShowMobileKanjiBox(false);
                    }}
                    onNoteToggle={actions.toggleNoteMode}
                    onHint={handleHintRequest}
                    isNoteMode={state.isNoteMode}
                    difficulty={state.difficulty}
                    hintsRemaining={state.hintsRemaining}
                    language={state.language}
                    hideMobileKanjiGrid={isMobile && state.difficulty !== 'expert'}
                  />

                  {/* New Game & Puzzle ID */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setPuzzleInput(''); actions.startNewGame(); }}
                      className="flex-1 py-3 border-2 border-primary hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors font-bold rounded-none"
                      style={{ borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
                    >
                      {labels.newGame}
                    </button>

                    <div className="flex gap-1">
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={puzzleInput}
                        onChange={handlePuzzleInputChange}
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

      {/* Mobile Kanji Hover Box - Only for Easy/Medium/Hard on mobile */}
      {showMobileKanjiBox && isMobile && state.difficulty !== 'expert' && state.puzzle && (
        <KanjiHoverBox
          kanjiList={state.puzzle.symbols}
          onSelect={(num) => {
            actions.inputValue(num);
            setShowMobileKanjiBox(false);
          }}
          onDelete={() => {
            actions.deleteValue();
            setShowMobileKanjiBox(false);
          }}
          onClose={() => setShowMobileKanjiBox(false)}
          selectedCell={state.selectedCell}
          isNoteMode={state.isNoteMode}
          onNoteToggle={actions.toggleNoteMode}
          language={state.language}
        />
      )}

      {/* Difficulty Switch Confirmation Modal */}
      {showDifficultyConfirm && pendingDifficulty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}>
          <div
            className="border-2 p-6 max-w-sm mx-4 shadow-hard bg-[#f5f0eb] dark:bg-[#2a2a2a]"
            style={{ borderColor: 'var(--border-primary)' }}
          >
            <h2 className="text-xl font-bold mb-4 text-center" style={{ color: 'var(--text-primary)' }}>
              Switch Difficulty?
            </h2>
            <p className="mb-6 text-center" style={{ color: 'var(--text-secondary)' }}>
              Puzzle #{pendingPuzzleId} is a <strong style={{ color: 'var(--accent)' }}>{labels[pendingDifficulty]}</strong> puzzle.
              <br />
              You are currently playing <strong>{labels[state.difficulty]}</strong>.
              <br /><br />
              Switch to {labels[pendingDifficulty]} mode?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancelDifficultySwitch}
                className="flex-1 py-3 border-2 border-primary font-bold hover:bg-black/10 transition-colors"
                style={{ borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
              >
                No
              </button>
              <button
                onClick={handleConfirmDifficultySwitch}
                className="flex-1 py-3 border-2 border-primary font-bold bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-colors"
                style={{ borderColor: 'var(--border-primary)' }}
              >
                Go
              </button>
            </div>
          </div>
        </div>
      )}

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
