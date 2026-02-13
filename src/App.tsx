import { lazy, Suspense, useMemo, useState } from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import { Settings } from './components/Settings';
import { AuthIconButton } from './components/AuthIconButton';
import { HomeMenu } from './components/HomeMenu';
import { usePuzzleNavigation } from './hooks/usePuzzleNavigation';
import { useGameState, type Difficulty } from './lib/gameState';
import { useIsMobile } from './hooks/useIsMobile';
import { LABELS } from './lib/labels';
import { isCellValid as validateCell } from './lib/validation';

const LazyWordList = lazy(() =>
  import('./components/WordList').then((module) => ({ default: module.WordList }))
);
const LazyHintModal = lazy(() =>
  import('./components/HintModal').then((module) => ({ default: module.HintModal }))
);
const LazyVictoryModal = lazy(() =>
  import('./components/VictoryModal').then((module) => ({ default: module.VictoryModal }))
);
const LazyKanjiHoverBox = lazy(() =>
  import('./components/KanjiHoverBox').then((module) => ({ default: module.KanjiHoverBox }))
);
const LazyInfoPopover = lazy(() =>
  import('./components/InfoPopover').then((module) => ({ default: module.InfoPopover }))
);
const LazyGameTopHeader = lazy(() =>
  import('./components/GameTopHeader').then((module) => ({ default: module.GameTopHeader }))
);
const LazyGameQuickShortcuts = lazy(() =>
  import('./components/GameQuickShortcuts').then((module) => ({ default: module.GameQuickShortcuts }))
);
const LazyGameBoardPanel = lazy(() =>
  import('./components/GameBoardPanel').then((module) => ({ default: module.GameBoardPanel }))
);
const LazyGameControlSidebar = lazy(() =>
  import('./components/GameControlSidebar').then((module) => ({ default: module.GameControlSidebar }))
);
const LazyLoginPage = lazy(() =>
  import('./components/LoginPage').then((module) => ({ default: module.LoginPage }))
);
const LazyMobileProfile = lazy(() =>
  import('./components/MobileProfile').then((module) => ({ default: module.MobileProfile }))
);

function AppContent() {
  const [state, actions] = useGameState();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentHint, setCurrentHint] = useState<{ meaning: string; reading: string } | null>(null);
  const [solutionStatus, setSolutionStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [view, setView] = useState<'home' | 'game' | 'login' | 'profile'>('home');
  const [showMobileKanjiBox, setShowMobileKanjiBox] = useState(false);
  const [activePopover, setActivePopover] = useState<'rules' | 'vocabulary' | null>(null);
  const isMobile = useIsMobile();

  const labels = LABELS[state.language];
  const {
    puzzleInput,
    pendingPuzzleId,
    pendingDifficulty,
    showDifficultyConfirm,
    handlePuzzleInputChange,
    handlePuzzleGo,
    handleConfirmDifficultySwitch,
    handleCancelDifficultySwitch,
  } = usePuzzleNavigation({
    currentDifficulty: state.difficulty,
    setDifficulty: actions.setDifficulty,
    loadPuzzle: actions.loadPuzzle,
    onPuzzleLoaded: () => setSolutionStatus('idle'),
  });

  const isCellValid = (row: number, col: number, val: number | null): boolean => {
    return validateCell(state.currentBoard, row, col, val, state.difficulty);
  };

  const handleHintRequest = () => {
    const hint = actions.requestHint();
    if (hint) {
      setCurrentHint(hint);
      setShowHint(true);
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

  const handleLogin = () => {
    setIsAuthenticated(true);
    setView('home');
  };

  const handleContinueAsGuest = () => {
    setIsAuthenticated(true);
    setView('home');
  };

  const handleAuthIconClick = () => {
    setActivePopover(null);
    setView(isAuthenticated ? 'profile' : 'login');
  };

  const isLoading = !state.puzzle || state.currentBoard.length === 0;
  const puzzle = state.puzzle;
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

  const loginView = (
    <Suspense fallback={null}>
      <LazyLoginPage
        language={state.language}
        onLogin={handleLogin}
        onContinueAsGuest={handleContinueAsGuest}
        settingsSlot={(
          <Settings
            language={state.language}
            onLanguageChange={actions.setLanguage}
          />
        )}
        authSlot={(
          <AuthIconButton
            isAuthenticated={false}
            onClick={handleAuthIconClick}
          />
        )}
      />
    </Suspense>
  );

  if (view === 'login' && !isAuthenticated) {
    return loginView;
  }

  if (view === 'profile' && !isAuthenticated) {
    return loginView;
  }

  if (view === 'profile') {
    return (
      <Suspense fallback={null}>
        <LazyMobileProfile
          onSettingsOpen={handleBackToMenu}
          onNavigateHome={handleBackToMenu}
        />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {view === 'game' ? (
        <Suspense fallback={null}>
          <LazyGameTopHeader
            difficulty={state.difficulty}
            elapsedTime={state.elapsedTime}
            isPaused={state.isPaused}
            language={state.language}
            labels={labels}
            onBackToMenu={handleBackToMenu}
            onDifficultyChange={actions.setDifficulty}
            onTogglePause={actions.togglePause}
            onLanguageChange={actions.setLanguage}
            authSlot={(
              <AuthIconButton
                isAuthenticated={isAuthenticated}
                onClick={handleAuthIconClick}
              />
            )}
          />
        </Suspense>
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
            authSlot={(
              <AuthIconButton
                isAuthenticated={isAuthenticated}
                onClick={handleAuthIconClick}
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
          <Suspense fallback={
            <div className="flex h-[70vh] items-center justify-center">
              <div className="text-xl animate-pulse" style={{ color: 'var(--text-muted)' }}>
                {labels.loading}
              </div>
            </div>
          }>
            <div className="max-w-[1400px] w-full grid grid-cols-1 xl:grid-cols-[220px_minmax(0,1fr)_260px] gap-6 lg:gap-8 items-start">
              <LazyGameQuickShortcuts
                shortcutKeys={shortcutKeys}
                onOpenRules={() => setActivePopover('rules')}
                onOpenVocabulary={() => setActivePopover('vocabulary')}
                puzzleWordsCount={puzzleWords.length}
              />

              <LazyGameBoardPanel
                state={state}
                actions={actions}
                puzzle={puzzle!}
                labels={labels}
                isMobile={isMobile}
                puzzleWordsCount={puzzleWords.length}
                isCellValid={isCellValid}
                onOpenRules={() => setActivePopover('rules')}
                onOpenVocabulary={() => setActivePopover('vocabulary')}
                onHintRequest={handleHintRequest}
                onNewGame={handleNewGame}
                onRestartGame={handleRestartGame}
                onShowMobileKanjiBox={() => setShowMobileKanjiBox(true)}
              />

              <LazyGameControlSidebar
                puzzle={puzzle!}
                state={state}
                actions={actions}
                labels={labels}
                isMobile={isMobile}
                puzzleInput={puzzleInput}
                solutionStatus={solutionStatus}
                onPuzzleInputChange={handlePuzzleInputChange}
                onPuzzleGo={handlePuzzleGo}
                onHintRequest={handleHintRequest}
                onCheckSolution={handleCheckSolution}
                onHideMobileKanjiBox={() => setShowMobileKanjiBox(false)}
              />
            </div>
          </Suspense>
        )}
      </main>

      {activePopover === 'rules' && (
        <Suspense fallback={null}>
          <LazyInfoPopover title="How to Play" onClose={() => setActivePopover(null)}>
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
          </LazyInfoPopover>
        </Suspense>
      )}

      {activePopover === 'vocabulary' && (
        <Suspense fallback={null}>
          <LazyInfoPopover title={`Vocabulary (${puzzleWords.length})`} onClose={() => setActivePopover(null)}>
            <LazyWordList foundWords={puzzleWords} language={state.language} variant="panel" />
          </LazyInfoPopover>
        </Suspense>
      )}

      <Suspense fallback={null}>
        <LazyHintModal
          isOpen={showHint}
          hint={currentHint}
          onClose={() => setShowHint(false)}
          language={state.language}
        />
      </Suspense>

      <Suspense fallback={null}>
        <LazyVictoryModal
          isOpen={state.isComplete}
          score={state.score}
          elapsedTime={state.elapsedTime}
          wordsFound={state.foundWords.length}
          hintsUsed={state.hintsUsed}
          onNewGame={() => actions.startNewGame()}
          language={state.language}
        />
      </Suspense>

      {showMobileKanjiBox && isMobile && state.difficulty !== 'expert' && puzzle && (
        <Suspense fallback={null}>
          <LazyKanjiHoverBox
            kanjiList={puzzle.symbols}
            onSelect={(num) => {
              actions.inputValue(num);
              setShowMobileKanjiBox(false);
            }}
            onClose={() => setShowMobileKanjiBox(false)}
            selectedCell={state.selectedCell}
            isNoteMode={state.isNoteMode}
            onNoteToggle={actions.toggleNoteMode}
            language={state.language}
          />
        </Suspense>
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
