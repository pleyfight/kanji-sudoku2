import { Controls } from './Controls';
import { ScoreBoard } from './ScoreBoard';
import type { Puzzle } from '../data/puzzles';
import type { GameActions, GameState } from '../lib/gameState';
import type { AppLabels } from '../lib/labels';

interface GameControlSidebarProps {
    puzzle: Puzzle;
    state: GameState;
    actions: GameActions;
    labels: AppLabels;
    isMobile: boolean;
    puzzleInput: string;
    solutionStatus: 'idle' | 'correct' | 'incorrect';
    onPuzzleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onPuzzleGo: () => void;
    onHintRequest: () => void;
    onCheckSolution: () => void;
    onHideMobileKanjiBox: () => void;
}

export function GameControlSidebar({
    puzzle,
    state,
    actions,
    labels,
    isMobile,
    puzzleInput,
    solutionStatus,
    onPuzzleInputChange,
    onPuzzleGo,
    onHintRequest,
    onCheckSolution,
    onHideMobileKanjiBox,
}: GameControlSidebarProps) {
    return (
        <aside className="flex flex-col">
            <div className="sidebar-section">
                <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-4" style={{ color: 'var(--text-muted)' }}>
                    {labels.kanjiKeypad}
                </h3>
                <div className="surface-muted rounded-sm p-2">
                    <Controls
                        kanjiList={puzzle.symbols}
                        onInput={(num) => {
                            actions.inputValue(num);
                            if (isMobile) onHideMobileKanjiBox();
                        }}
                        onInputSymbol={actions.inputSymbol}
                        onDelete={() => {
                            actions.deleteValue();
                            if (isMobile) onHideMobileKanjiBox();
                        }}
                        onNoteToggle={actions.toggleNoteMode}
                        onHint={onHintRequest}
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
                        onChange={onPuzzleInputChange}
                        placeholder="#"
                        className="w-16 px-2 py-2 text-center rounded-sm border"
                        style={{ color: 'var(--text-primary)', borderColor: 'var(--border-subtle)', background: 'var(--bg-panel)' }}
                        onKeyDown={(event) => event.key === 'Enter' && onPuzzleGo()}
                    />
                    <button
                        onClick={onPuzzleGo}
                        className="flex-1 px-3 py-2 rounded-sm border text-[11px] font-semibold"
                        style={{ color: 'var(--text-secondary)', borderColor: 'var(--border-subtle)', background: 'var(--bg-secondary)' }}
                    >
                        {labels.goToPuzzle}
                    </button>
                </div>
            </div>

            <div className="sidebar-section">
                <button
                    onClick={onCheckSolution}
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
    );
}
