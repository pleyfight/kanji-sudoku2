import { createCell } from './types';
import type { Puzzle, PuzzleDefinition } from './types';

type PuzzleModule = { default: PuzzleDefinition[] | PuzzleDefinition };

const puzzleModules = import.meta.glob('../../puzzle-data/*.json', { eager: true }) as Record<
    string,
    PuzzleModule
>;

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

export function loadPuzzles(): Puzzle[] {
    if (cachedPuzzles) {
        return cachedPuzzles;
    }

    const definitions: PuzzleDefinition[] = Object.values(puzzleModules).flatMap((module) => {
        const data = module.default;
        return Array.isArray(data) ? data : [data];
    });

    if (definitions.length === 0) {
        throw new Error('No puzzle definitions found in src/puzzle-data.');
    }

    cachedPuzzles = definitions.map(toPuzzle).sort((a, b) => a.id - b.id);
    return cachedPuzzles;
}
