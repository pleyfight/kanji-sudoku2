import { useMemo, useRef, useState } from 'react';
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
import { InfoPopover } from './components/InfoPopover';
import { useGameState, type Difficulty } from './lib/gameState';
import { useIsMobile } from './hooks/useIsMobile';
import { LABELS } from './lib/labels';

function AppContent() {
  const [state, actions] = useGameState();
  const [showHint, setShowHint] = useState(false);
  const [currentHint, setCurrentHint] = useState<{ meaning: string; reading: string } | null>(null);
  const [puzzleInput, setPuzzleInput] = useState('');
  const [solutionStatus, setSolutionStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [view, setView] = useState<'home' | 'game'>('home');
  const [pendingPuzzleId, setPendingPuzzleId] = useState<number | null>(null);
  const [pendingDifficulty, setPendingDifficulty] = useState<Difficulty | null>(null);
  const [showDifficultyConfirm, setShowDifficultyConfirm] = useState(false);
  const [showMobileKanjiBox, setShowMobileKanjiBox] = useState(false);
  const [activePopover, setActivePopover] = useState<'rules' | 'vocabulary' | null>(null);
  const isMobile = useIsMobile();
  const [mobileExpertInput, setMobileExpertInput] = useState('');
  const mobileExpertInputRef = useRef<HTMLInputElement>(null);

  const labels = LABELS[state.language];

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

  const handleHintRequest = () => {
    const hint = actions.requestHint();
    if (hint) {
      setCurrentHint(hint);
      setShowHint(true);
    }
  };

  const getDifficultyFromId = (id: number): Difficulty | null => {
    if (id >= 1001 && id <= 11000) return 'easy';
    if (id >= 11001 && id <= 21000) return 'medium';
    if (id >= 21001 && id <= 31000) return 'hard';
    if (id >= 31001 && id <= 41000) return 'expert';
    return null;
  };

  const handlePuzzleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 5);
    setPuzzleInput(value);
  };

  const handlePuzzleGo = () => {
    const id = parseInt(puzzleInput, 10);
    if (isNaN(id)) return;

    const targetDifficulty = getDifficultyFromId(id);
    if (!targetDifficulty) {
      setPuzzleInput('');
      alert('Invalid puzzle ID. Valid range: 1001-41000');
      return;
    }

    if (targetDifficulty !== state.difficulty) {
      setPendingPuzzleId(id);
      setPendingDifficulty(targetDifficulty);
      setShowDifficultyConfirm(true);
    } else {
      actions.loadPuzzle(id);
      setPuzzleInput('');
      setSolutionStatus('idle');
    }
  };

  const handleCheckSolution = () => {
    const isCorrect = actions.checkSolution();
    setSolutionStatus(isCorrect ? 'correct' : 'incorrect');
  };

  const handleNewGame = () => {
    actions.startNewGame(state.difficulty);
    setSolutionStatus('idle');
  };

  const handleRestartGame = () => {
    actions.restartPuzzle();
    setSolutionStatus('idle');
  };

  const handleConfirmDifficultySwitch = () => {
    if (pendingPuzzleId && pendingDifficulty) {
      actions.setDifficulty(pendingDifficulty);
      actions.loadPuzzle(pendingPuzzleId);
      setPuzzleInput('');
      setSolutionStatus('idle');
    }
    setShowDifficultyConfirm(false);
    setPendingPuzzleId(null);
    setPendingDifficulty(null);
  };

  const handleCancelDifficultySwitch = () => {
    setShowDifficultyConfirm(false);
    setPendingPuzzleId(null);
    setPendingDifficulty(null);
  };

  const handleDifficultySelect = (diff: Difficulty) => {
    actions.setDifficulty(diff);
    actions.startNewGame(diff);
    setActivePopover(null);
    setView('game');
  };

  const handleBackToMenu = () => {
    setActivePopover(null);
    setView('home');
  };

  const isLoading = !state.puzzle || state.currentBoard.length === 0;
  const puzzle = state.puzzle;
  const displaySymbols = puzzle?.symbols || [];
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];
  const shortcutKeys = useMemo(() => ([
    { label: 'Input', key: '1-9' },
    { label: 'Notes', key: 'N' },
    { label: 'Hint', key: 'H' },
    { label: 'Clear', key: 'Del' },
  ]), []);
  const puzzleWords = useMemo(() => (
    puzzle?.vocabulary.map((word) => ({
      word: { word: word.word, reading: word.reading, meaning: word.meaning },
      cells: [],
      direction: 'row' as const,
    })) ?? []
  ), [puzzle]);

  return (
    <div className="min-h-screen flex flex-col">
      {view === 'game' ? (
        <header className="border-b border-black/10 dark:border-white/10 bg-[var(--bg-panel)] sticky top-0 z-50">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 min-h-16 py-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 sm:gap-8 overflow-x-auto">
              <button
                onClick={handleBackToMenu}
                className="font-serif text-2xl italic font-bold tracking-tight"
                style={{ color: 'var(--accent)' }}
              >
                Kudoku
              </button>
              <nav className="flex items-center space-x-4 sm:space-x-6 text-sm font-semibold h-full whitespace-nowrap">
                {difficulties.map((diff) => (
                  <button
                    key={diff}
                    onClick={() => actions.setDifficulty(diff)}
                    className={`${state.difficulty === diff ? 'tab-active' : 'tab-inactive'} py-5`}
                  >
                    {labels[diff]}
                  </button>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-4 sm:gap-6 self-end sm:self-auto">
              <Timer
                elapsedTime={state.elapsedTime}
                isPaused={state.isPaused}
                onTogglePause={actions.togglePause}
                language={state.language}
                variant="header"
              />
              <Settings
                language={state.language}
                onLanguageChange={actions.setLanguage}
              />
            </div>
          </div>
        </header>
      ) : null}

      <main className={view === 'game' ? 'flex-grow flex justify-center py-10 px-6' : 'flex-grow flex justify-center'}>
        {view === 'home' ? (
          <HomeMenu
            onSelectDifficulty={handleDifficultySelect}
            language={state.language}
            settingsSlot={(
              <Settings
                language={state.language}
                onLanguageChange={actions.setLanguage}
              />
            )}
          />
        ) : isLoading ? (
          <div className="flex h-[70vh] items-center justify-center">
            <div className="text-xl animate-pulse" style={{ color: 'var(--text-muted)' }}>
              {labels.loading}
            </div>
          </div>
        ) : (
          <div className="max-w-[1400px] w-full grid grid-cols-1 xl:grid-cols-[220px_minmax(0,1fr)_260px] gap-6 lg:gap-8 items-start">
            <aside className="hidden xl:flex flex-col">
              <div className="sidebar-section">
                <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-4" style={{ color: 'var(--text-muted)' }}>
                  Quick Shortcuts
                </h3>
                <ul className="text-[11px] space-y-2" style={{ color: 'var(--text-muted)' }}>
                  {shortcutKeys.map((shortcut) => (
                    <li key={shortcut.label} className="flex justify-between">
                      <span>{shortcut.label}</span>
                      <kbd className="px-1 rounded border" style={{ color: 'var(--text-primary)', borderColor: 'var(--border-subtle)', background: 'var(--bg-secondary)' }}>
                        {shortcut.key}
                      </kbd>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="sidebar-section">
                <div className="p-4 rounded border-l-2 text-[11px] leading-relaxed italic" style={{ color: 'var(--text-muted)', borderColor: 'var(--accent)', background: 'var(--bg-secondary)' }}>
                  "Zen is not some kind of excitement, but concentration on our usual everyday routine."
                </div>
              </div>
            </aside>

            <div className="flex flex-col items-center gap-6">
              <div className="text-center">
                <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                  {labels.puzzle} #{state.puzzleId}
                </span>
                <div className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                  ({puzzle?.title})
                </div>
              </div>

              <div className="w-full flex items-center justify-center gap-2 sm:gap-3">
                <button
                  onClick={() => setActivePopover('rules')}
                  className="px-3 sm:px-4 py-2 rounded-full border text-[11px] sm:text-xs font-bold uppercase tracking-wide"
                  style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)', background: 'var(--bg-panel)' }}
                >
                  How to Play
                </button>
                <button
                  onClick={() => setActivePopover('vocabulary')}
                  className="px-3 sm:px-4 py-2 rounded-full border text-[11px] sm:text-xs font-bold uppercase tracking-wide"
                  style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)', background: 'var(--bg-panel)' }}
                >
                  Vocabulary ({puzzleWords.length})
                </button>
              </div>

              <div
                className="relative w-full"
                style={{ width: 'min(96vw, 620px)', maxWidth: 'min(620px, calc(100vh - 260px))' }}
              >
                {state.isPaused && (
                  <div
                    className="absolute inset-0 z-10 flex items-center justify-center rounded-xl"
                    style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)' }}
                  >
                    <div className="text-center">
                      <div className="text-5xl mb-3">⏸️</div>
                      <p className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
                        {labels.paused}
                      </p>
                    </div>
                  </div>
                )}
                <div className="sudoku-grid w-full aspect-square shadow-[0_0_60px_rgba(0,0,0,0.25)]">
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
                          const cellData = state.puzzle?.grid[rowIndex][colIndex];
                          if (isMobile && cellData && !cellData.isRevealed && !cellData.isKana) {
                            if (state.difficulty === 'expert') {
                              setTimeout(() => mobileExpertInputRef.current?.focus(), 50);
                            } else {
                              setShowMobileKanjiBox(true);
                            }
                          }
                        }}
                      />
                    ))
                  )}
                </div>

                {isMobile && state.difficulty === 'expert' && state.selectedCell && (
                  <div className="flex justify-center mt-2">
                    <input
                      ref={mobileExpertInputRef}
                      type="text"
                      inputMode="text"
                      value={mobileExpertInput}
                      onChange={(e) => {
                        const value = e.target.value;
                        setMobileExpertInput(value);
                        if (value.length > 0) {
                          const lastChar = value[value.length - 1];
                          actions.inputSymbol(lastChar);
                          setMobileExpertInput('');
                        }
                      }}
                      placeholder="漢字を入力..."
                      className="w-48 px-4 py-3 text-lg text-center border rounded-sm kanji-cell"
                      style={{
                        borderColor: 'var(--border-subtle)',
                        backgroundColor: 'var(--bg-panel)',
                        color: 'var(--text-primary)',
                      }}
                      lang="ja"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck={false}
                    />
                  </div>
                )}
              </div>

              <div className="w-full max-w-[620px] flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t pt-6" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={actions.toggleNoteMode}
                    className="action-btn flex items-center gap-2"
                    style={state.isNoteMode ? { color: 'var(--accent)', borderColor: 'color-mix(in srgb, var(--accent) 40%, transparent)' } : undefined}
                  >
                    <span className="material-symbols-outlined text-[14px]">edit_note</span>
                    Pencil Mode
                  </button>
                  <button
                    onClick={handleHintRequest}
                    className="action-btn flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[14px]">tips_and_updates</span>
                    Hint ({state.hintsRemaining})
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleNewGame}
                    className="action-btn"
                  >
                    New Game
                  </button>
                  <button
                    onClick={handleRestartGame}
                    className="action-btn"
                    style={{ color: 'var(--accent)', borderColor: 'color-mix(in srgb, var(--accent) 35%, transparent)' }}
                  >
                    Restart Game
                  </button>
                </div>
              </div>
            </div>

            <aside className="flex flex-col">
              <div className="sidebar-section">
                <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-4" style={{ color: 'var(--text-muted)' }}>
                  Kanji Keypad
                </h3>
                <div className="surface-muted rounded-sm p-2">
                  <Controls
                    kanjiList={puzzle?.symbols ?? []}
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
                    layout="sidebar"
                    showActions={false}
                    hideMobileKanjiGrid={isMobile && state.difficulty !== 'expert'}
                  />
                </div>
                <button
                  onClick={actions.deleteValue}
                  className="w-full py-3 mt-4 text-[10px] font-bold uppercase tracking-widest rounded-sm border"
                  style={{ color: 'var(--text-primary)', borderColor: 'var(--border-subtle)', background: 'var(--bg-panel)' }}
                >
                  Clear Cell
                </button>
              </div>

              <div className="sidebar-section">
                <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-4" style={{ color: 'var(--text-muted)' }}>
                  Game Stats
                </h3>
                <ScoreBoard
                  score={state.score}
                  hintsRemaining={state.hintsRemaining}
                  hintsUsed={state.hintsUsed}
                  wordsFound={state.foundWords.length}
                  language={state.language}
                  variant="sidebar"
                />
              </div>

              <div className="sidebar-section">
                <div className="flex gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={puzzleInput}
                    onChange={handlePuzzleInputChange}
                    placeholder="#"
                    className="w-16 px-2 py-2 text-center rounded-sm border"
                    style={{ color: 'var(--text-primary)', borderColor: 'var(--border-subtle)', background: 'var(--bg-panel)' }}
                    onKeyDown={(e) => e.key === 'Enter' && handlePuzzleGo()}
                  />
                  <button
                    onClick={handlePuzzleGo}
                    className="flex-1 px-3 py-2 rounded-sm border text-[11px] font-semibold"
                    style={{ color: 'var(--text-secondary)', borderColor: 'var(--border-subtle)', background: 'var(--bg-secondary)' }}
                  >
                    {labels.goToPuzzle}
                  </button>
                </div>
              </div>

              <div className="sidebar-section">
                <button
                  onClick={handleCheckSolution}
                  className="w-full py-3 text-[10px] font-bold uppercase tracking-widest rounded-sm"
                  style={{
                    background: 'var(--accent)',
                    color: 'var(--accent-contrast)',
                  }}
                >
                  Check Solution
                </button>
                {solutionStatus !== 'idle' && (
                  <p
                    className="mt-3 text-[11px] font-semibold"
                    style={{ color: solutionStatus === 'correct' ? 'var(--success)' : 'var(--error)' }}
                  >
                    {solutionStatus === 'correct' ? 'Looking good so far.' : 'There are mistakes to fix.'}
                  </p>
                )}
              </div>
            </aside>
          </div>
        )}
      </main>

      {activePopover === 'rules' && (
        <InfoPopover title="How to Play" onClose={() => setActivePopover(null)}>
          <div className="text-sm leading-relaxed space-y-3" style={{ color: 'var(--text-secondary)' }}>
            <p>
              Fill the 9x9 grid so each row, column, and 3x3 box contains all Kanji from{' '}
              <span className="font-bold" style={{ color: 'var(--accent)' }}>一</span> to{' '}
              <span className="font-bold" style={{ color: 'var(--accent)' }}>九</span>.
            </p>
            <p>Select a cell and use keypad/keyboard to place symbols.</p>
            <ul className="space-y-1 text-xs">
              {shortcutKeys.map((shortcut) => (
                <li key={shortcut.label} className="flex justify-between">
                  <span>{shortcut.label}</span>
                  <kbd className="px-1 rounded border" style={{ color: 'var(--text-primary)', borderColor: 'var(--border-subtle)', background: 'var(--bg-secondary)' }}>
                    {shortcut.key}
                  </kbd>
                </li>
              ))}
            </ul>
          </div>
        </InfoPopover>
      )}

      {activePopover === 'vocabulary' && (
        <InfoPopover title={`Vocabulary (${puzzleWords.length})`} onClose={() => setActivePopover(null)}>
          <WordList foundWords={puzzleWords} language={state.language} variant="panel" />
        </InfoPopover>
      )}

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

      {showMobileKanjiBox && isMobile && state.difficulty !== 'expert' && puzzle && (
        <KanjiHoverBox
          kanjiList={puzzle.symbols}
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

      {showDifficultyConfirm && pendingDifficulty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
          <div
            className="rounded-xl p-6 max-w-sm mx-4 surface-panel"
            style={{ borderColor: 'var(--border-subtle)' }}
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
                className="flex-1 py-3 rounded-lg border font-bold"
                style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
              >
                No
              </button>
              <button
                onClick={handleConfirmDifficultySwitch}
                className="flex-1 py-3 rounded-lg font-bold"
                style={{ background: 'var(--accent)', color: 'var(--accent-contrast)' }}
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
