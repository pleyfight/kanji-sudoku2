import { useRef, useState } from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import { Settings } from './components/Settings';
import { Cell } from './components/Cell';
import { Controls } from './components/Controls';
import { ScoreBoard } from './components/ScoreBoard';
import { HintModal } from './components/HintModal';
import { VictoryModal } from './components/VictoryModal';
import { HomeMenu } from './components/HomeMenu';
import { KanjiHoverBox } from './components/KanjiHoverBox';
import { LoadingScreen } from './components/LoadingScreen';
import { GameHeader } from './components/GameHeader';
import { GameSidePanel } from './components/GameSidePanel';
import { MobileGameView } from './components/MobileGameView';
import { MobileLogin } from './components/MobileLogin';
import { MobileProfile } from './components/MobileProfile';
import { MobileLeaderboard } from './components/MobileLeaderboard';
import { MobileSettings } from './components/MobileSettings';
import { MobileBottomNav, type MobileView } from './components/MobileBottomNav';
import { useGameState, type Difficulty } from './lib/gameState';
import { useIsMobile } from './hooks/useIsMobile';
import { LABELS } from './lib/labels';
import { isCellValid } from './lib/validation';
import { getDifficultyFromId } from './data/puzzles';

function AppContent() {
  const [state, actions] = useGameState();
  const [showHint, setShowHint] = useState(false);
  const [currentHint, setCurrentHint] = useState<{ meaning: string; reading: string } | null>(null);
  const [puzzleInput, setPuzzleInput] = useState('');
  const [solutionStatus, setSolutionStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [view, setView] = useState<MobileView>('home');
  const [pendingPuzzleId, setPendingPuzzleId] = useState<number | null>(null);
  const [pendingDifficulty, setPendingDifficulty] = useState<Difficulty | null>(null);
  const [showDifficultyConfirm, setShowDifficultyConfirm] = useState(false);
  const [showMobileKanjiBox, setShowMobileKanjiBox] = useState(false);
  const isMobile = useIsMobile();
  const [mobileExpertInput, setMobileExpertInput] = useState('');
  const mobileExpertInputRef = useRef<HTMLInputElement>(null);

  const labels = LABELS[state.language];

  // Show loading state while puzzles are being fetched
  if (state.isLoading) {
    return <LoadingScreen labels={labels} />;
  }

  const handleHintRequest = () => {
    const hint = actions.requestHint();
    if (hint) {
      setCurrentHint(hint);
      setShowHint(true);
    }
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
    setView('game');
  };

  const handleBackToMenu = () => {
    setView('home');
  };

  const handleMobileNavigate = (target: MobileView) => {
    if (target === 'game' && (!state.puzzle || state.currentBoard.length === 0)) {
      // Start a new game if navigating to game without one active
      actions.startNewGame(state.difficulty);
    }
    setView(target);
  };

  const handleMobileCellClick = (row: number, col: number) => {
    actions.selectCell(row, col);
    const cellData = state.puzzle?.grid[row][col];
    if (cellData && !cellData.isRevealed && !cellData.isKana) {
      if (state.difficulty === 'expert') {
        setTimeout(() => mobileExpertInputRef.current?.focus(), 50);
      } else {
        setShowMobileKanjiBox(true);
      }
    }
  };

  const isLoading = !state.puzzle || state.currentBoard.length === 0;
  const puzzle = state.puzzle;
  const displaySymbols = puzzle?.symbols || [];


  // --- Mobile view routing ---
  if (isMobile) {
    if (state.isLoading) {
      return <LoadingScreen labels={labels} />;
    }

    // Mobile settings overlay (can appear on top of any view)
    if (view === 'settings') {
      return (
        <MobileSettings
          onClose={() => setView('home')}
        />
      );
    }

    // Mobile login
    if (view === 'login') {
      return (
        <>
          <MobileLogin
            onLogin={() => setView('home')}
            onNavigateHome={() => setView('home')}
            settingsSlot={
              <Settings
                language={state.language}
                onLanguageChange={actions.setLanguage}
              />
            }
          />
          <MobileBottomNav activeView={view} onNavigate={handleMobileNavigate} />
        </>
      );
    }

    // Mobile profile
    if (view === 'profile') {
      return (
        <>
          <MobileProfile
            onSettingsOpen={() => setView('settings')}
            onNavigateHome={() => setView('home')}
          />
          <MobileBottomNav activeView={view} onNavigate={handleMobileNavigate} />
        </>
      );
    }

    // Mobile leaderboard
    if (view === 'leaderboard') {
      return (
        <>
          <MobileLeaderboard onBack={() => setView('home')} />
          <MobileBottomNav activeView={view} onNavigate={handleMobileNavigate} />
        </>
      );
    }

    // Mobile game view
    if (view === 'game') {
      const isGameLoading = !state.puzzle || state.currentBoard.length === 0;
      if (isGameLoading) {
        return (
          <div className="flex h-screen items-center justify-center">
            <div className="text-xl animate-pulse" style={{ color: 'var(--text-muted)' }}>
              {labels.loading}
            </div>
          </div>
        );
      }
      return (
        <>
          <MobileGameView
            state={state}
            actions={actions}
            labels={labels}
            onBackToMenu={handleBackToMenu}
            onCheckSolution={handleCheckSolution}
            onRestartGame={handleRestartGame}
            solutionStatus={solutionStatus}
            onSettingsOpen={() => setView('settings')}
            onProfileOpen={() => setView('profile')}
            onCellClick={handleMobileCellClick}
          />

          {showMobileKanjiBox && state.difficulty !== 'expert' && state.puzzle && (
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
        </>
      );
    }

    // Mobile home (default)
    return (
      <>
        <HomeMenu
          onSelectDifficulty={handleDifficultySelect}
          language={state.language}
          settingsSlot={
            <Settings
              language={state.language}
              onLanguageChange={actions.setLanguage}
            />
          }
        />
        <MobileBottomNav activeView={view} onNavigate={handleMobileNavigate} />
      </>
    );
  }

  // --- Desktop layout (unchanged) ---
  return (
    <div className="min-h-screen flex flex-col">
      {view === 'game' ? (
        <GameHeader
          difficulty={state.difficulty}
          elapsedTime={state.elapsedTime}
          isPaused={state.isPaused}
          language={state.language}
          labels={labels}
          onBackToMenu={handleBackToMenu}
          onDifficultyChange={actions.setDifficulty}
          onTogglePause={actions.togglePause}
          onLanguageChange={actions.setLanguage}
        />
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
          <div className="max-w-[1400px] w-full grid grid-cols-1 lg:grid-cols-[240px_1fr_260px] gap-10 items-start">
            <GameSidePanel
              difficulty={state.difficulty}
              puzzle={puzzle}
              language={state.language}
              labels={labels}
            />

            <div className="flex flex-col items-center gap-6">
              <div className="text-center">
                <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                  {labels.puzzle} #{state.puzzleId}
                </span>
                <div className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                  ({puzzle?.title})
                </div>
              </div>

              <div className="relative w-full max-w-[620px]">
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
                        isValid={isCellValid(state.currentBoard, rowIndex, colIndex, val, state.difficulty)}
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

              <div className="w-full max-w-[620px] flex items-center justify-between border-t pt-6" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="flex gap-4">
                  <button
                    onClick={actions.toggleNoteMode}
                    className="action-btn flex items-center gap-2"
                    style={state.isNoteMode ? { color: 'var(--accent)', borderColor: 'color-mix(in srgb, var(--accent) 40%, transparent)' } : undefined}
                  >
                    <span className="material-symbols-outlined text-[14px]">edit_note</span>
                    {labels.pencilMode}
                  </button>
                  <button
                    onClick={handleHintRequest}
                    className="action-btn flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[14px]">tips_and_updates</span>
                    {labels.hint} ({state.hintsRemaining})
                  </button>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleNewGame}
                    className="action-btn"
                  >
                    {labels.newGame}
                  </button>
                  <button
                    onClick={handleRestartGame}
                    className="action-btn"
                    style={{ color: 'var(--accent)', borderColor: 'color-mix(in srgb, var(--accent) 35%, transparent)' }}
                  >
                    {labels.restartGame}
                  </button>
                </div>
              </div>
            </div>

            <aside className="flex flex-col">
              <div className="sidebar-section">
                <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-4" style={{ color: 'var(--text-muted)' }}>
                  {labels.kanjiKeypad}
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
                  {labels.clearCell}
                </button>
              </div>

              <div className="sidebar-section">
                <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-4" style={{ color: 'var(--text-muted)' }}>
                  {labels.gameStats}
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
                  {labels.checkSolution}
                </button>
                {solutionStatus !== 'idle' && (
                  <p
                    className="mt-3 text-[11px] font-semibold"
                    style={{ color: solutionStatus === 'correct' ? 'var(--success)' : 'var(--error)' }}
                  >
                    {solutionStatus === 'correct' ? labels.lookingGood : labels.mistakesToFix}
                  </p>
                )}
              </div>
            </aside>
          </div>
        )}
      </main>

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
              {labels.switchDifficulty}
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
