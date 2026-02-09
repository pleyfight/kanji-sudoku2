import { useMemo, useState } from 'react';
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
    title: 'Kudoku',
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
  const [solutionStatus, setSolutionStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');

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
      setSolutionStatus('idle');
    }
  };

  const handleCheckSolution = () => {
    const isCorrect = actions.checkSolution();
    setSolutionStatus(isCorrect ? 'correct' : 'incorrect');
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
  const shortcutKeys = useMemo(() => {
    return [
      { label: 'Input', key: '1-9' },
      { label: 'Notes', key: 'N' },
      { label: 'Hint', key: 'H' },
      { label: 'Clear', key: 'Del' },
    ];
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-black/10 dark:border-white/10 bg-[var(--bg-panel)] sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="font-serif text-2xl italic font-bold tracking-tight" style={{ color: 'var(--accent)' }}>
              Kudoku
            </h1>
            <nav className="flex items-center space-x-6 text-sm font-semibold h-full">
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
          <div className="flex items-center gap-6">
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

      <main className="flex-grow flex justify-center py-10 px-6">
        <div className="max-w-[1400px] w-full grid grid-cols-1 lg:grid-cols-[240px_1fr_260px] gap-10 items-start">
          <aside className="flex flex-col">
            <div className="sidebar-section">
              <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-4" style={{ color: 'var(--text-muted)' }}>
                How to Play
              </h3>
              <div className="text-xs leading-relaxed space-y-3" style={{ color: 'var(--text-secondary)' }}>
                <p>
                  Fill the 9x9 grid so that each row, column, and 3x3 box contains all Kanji from{' '}
                  <span className="font-bold" style={{ color: 'var(--accent)' }}>一</span> to{' '}
                  <span className="font-bold" style={{ color: 'var(--accent)' }}>九</span>.
                </p>
                <p>Click a cell to select it, then use the keypad or keyboard numbers 1-9 to input the Kanji.</p>
              </div>
            </div>
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
            {state.difficulty !== 'expert' && (
              <WordList
                foundWords={state.puzzle.vocabulary.map(w => ({
                  word: { word: w.word, reading: w.reading, meaning: w.meaning },
                  cells: [],
                  direction: 'row' as const,
                }))}
                language={state.language}
                variant="sidebar"
              />
            )}
          </aside>

          <div className="flex flex-col items-center gap-6">
            <div className="text-center">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                {labels.puzzle} #{state.puzzleId}
              </span>
              <div className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                ({state.puzzle.title})
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

            <div className="w-full max-w-[620px] flex items-center justify-between border-t pt-6" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="flex gap-4">
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
              <button
                onClick={() => actions.startNewGame()}
                className="action-btn"
                style={{ color: 'var(--accent)', borderColor: 'color-mix(in srgb, var(--accent) 35%, transparent)' }}
              >
                Restart Game
              </button>
            </div>
          </div>

          <aside className="flex flex-col">
            <div className="sidebar-section">
              <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-4" style={{ color: 'var(--text-muted)' }}>
                Kanji Keypad
              </h3>
              <div className="surface-muted rounded-sm p-2">
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
                  layout="sidebar"
                  showActions={false}
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
                  value={puzzleInput}
                  onChange={(e) => setPuzzleInput(e.target.value)}
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
      </main>

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
