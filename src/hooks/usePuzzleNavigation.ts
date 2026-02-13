import { useCallback, useState } from 'react';
import { getDifficultyFromId } from '../data/puzzles/types';
import type { Difficulty } from '../lib/gameState';

interface PuzzleNavigationArgs {
  currentDifficulty: Difficulty;
  setDifficulty: (difficulty: Difficulty) => void;
  loadPuzzle: (id: number) => boolean;
  onPuzzleLoaded?: () => void;
}

export interface PuzzleNavigationState {
  puzzleInput: string;
  pendingPuzzleId: number | null;
  pendingDifficulty: Difficulty | null;
  showDifficultyConfirm: boolean;
  setPuzzleInput: (value: string) => void;
  handlePuzzleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePuzzleGo: () => void;
  handleConfirmDifficultySwitch: () => void;
  handleCancelDifficultySwitch: () => void;
}

export function usePuzzleNavigation({
  currentDifficulty,
  setDifficulty,
  loadPuzzle,
  onPuzzleLoaded,
}: PuzzleNavigationArgs): PuzzleNavigationState {
  const [puzzleInput, setPuzzleInput] = useState('');
  const [pendingPuzzleId, setPendingPuzzleId] = useState<number | null>(null);
  const [pendingDifficulty, setPendingDifficulty] = useState<Difficulty | null>(null);
  const [showDifficultyConfirm, setShowDifficultyConfirm] = useState(false);

  const handlePuzzleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 5);
    setPuzzleInput(value);
  }, []);

  const handlePuzzleGo = useCallback(() => {
    const id = parseInt(puzzleInput, 10);
    if (Number.isNaN(id)) return;

    const targetDifficulty = getDifficultyFromId(id);
    if (!targetDifficulty) {
      setPuzzleInput('');
      window.alert('Invalid puzzle ID. Valid range: 1001-41000');
      return;
    }

    if (targetDifficulty !== currentDifficulty) {
      setPendingPuzzleId(id);
      setPendingDifficulty(targetDifficulty);
      setShowDifficultyConfirm(true);
      return;
    }

    const loaded = loadPuzzle(id);
    if (loaded) {
      setPuzzleInput('');
      onPuzzleLoaded?.();
    }
  }, [currentDifficulty, loadPuzzle, onPuzzleLoaded, puzzleInput]);

  const handleConfirmDifficultySwitch = useCallback(() => {
    if (pendingPuzzleId && pendingDifficulty) {
      setDifficulty(pendingDifficulty);
      const loaded = loadPuzzle(pendingPuzzleId);
      if (loaded) {
        setPuzzleInput('');
        onPuzzleLoaded?.();
      }
    }
    setShowDifficultyConfirm(false);
    setPendingPuzzleId(null);
    setPendingDifficulty(null);
  }, [loadPuzzle, onPuzzleLoaded, pendingDifficulty, pendingPuzzleId, setDifficulty]);

  const handleCancelDifficultySwitch = useCallback(() => {
    setShowDifficultyConfirm(false);
    setPendingPuzzleId(null);
    setPendingDifficulty(null);
  }, []);

  return {
    puzzleInput,
    pendingPuzzleId,
    pendingDifficulty,
    showDifficultyConfirm,
    setPuzzleInput,
    handlePuzzleInputChange,
    handlePuzzleGo,
    handleConfirmDifficultySwitch,
    handleCancelDifficultySwitch,
  };
}
