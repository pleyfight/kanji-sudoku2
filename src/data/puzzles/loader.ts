// Puzzle Loader — Async fetch from public/data/puzzles/
// Replaces the previous import.meta.glob({ eager: true }) approach that bundled ~162MB of JSON.

import { createCell } from './types';
import type { Puzzle, PuzzleDefinition, Difficulty } from './types';

const DIFFICULTY_FILES: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];

let cachedPuzzles: Puzzle[] | null = null;

function toPuzzle(definition: PuzzleDefinition): Puzzle {
    const grid = definition.template.map((row, r) => {
        const chars = Array.from(row);
        return chars.map((char, c) => createCell(char, Boolean(definition.revealed?.[r]?.[c]), {
            treatKanaAsEditable: definition.difficulty === 'expert',
        }));
    });

    return {
        id: definition.id,
        difficulty: definition.difficulty,
        title: definition.title,
        symbols: definition.symbols,
        grid,
        solution: definition.solution,
        vocabulary: definition.vocabulary,
        description: definition.description,
        sentenceHints: definition.sentenceHints,
    };
}

/**
 * Load all puzzles asynchronously by fetching JSON from public/data/puzzles/.
 * Results are cached — subsequent calls return the cached array immediately.
 */
export async function loadPuzzlesAsync(): Promise<Puzzle[]> {
    if (cachedPuzzles) {
        return cachedPuzzles;
    }

    const responses = await Promise.all(
        DIFFICULTY_FILES.map(async (diff) => {
            const url = `${import.meta.env.BASE_URL}data/puzzles/${diff}.json`;
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error(`Failed to fetch ${diff} puzzles: ${res.status} ${res.statusText}`);
            }
            const data: PuzzleDefinition[] | PuzzleDefinition = await res.json();
            return Array.isArray(data) ? data : [data];
        })
    );

    const definitions = responses.flat();

    if (definitions.length === 0) {
        throw new Error('No puzzle definitions found in public/data/puzzles/.');
    }

    cachedPuzzles = definitions.map(toPuzzle).sort((a, b) => a.id - b.id);
    return cachedPuzzles;
}
