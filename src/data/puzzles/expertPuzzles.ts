// Expert Puzzles - Academic/Archaic Japanese
// Old kanji, literary Japanese, rarely used characters
// Hints show meaning only, never the kanji

import { type Puzzle, createCell } from './types';

export const EXPERT_PUZZLES: Puzzle[] = [
    // Puzzle 4001: Classical Virtues (古典の徳)
    {
        id: 4001,
        difficulty: 'expert',
        title: '古典の徳 - Classical Virtues',
        symbols: ['忠', '孝', '悌', '節', '廉', '恥', '信', '勤', '倹'],
        grid: (() => {
            const template = [
                '忠孝悌節廉恥信勤倹',
                '節廉恥信勤倹忠孝悌',
                '信勤倹忠孝悌節廉恥',
                '孝悌節廉恥信勤倹忠',
                '廉恥信勤倹忠孝悌節',
                '勤倹忠孝悌節廉恥信',
                '悌節廉恥信勤倹忠孝',
                '恥信勤倹忠孝悌節廉',
                '倹忠孝悌節廉恥信勤',
            ];
            const revealed = [
                [true, false, false, false, false, false, false, false, true],
                [false, false, false, true, false, false, false, false, false],
                [false, false, true, false, false, false, false, true, false],
                [false, false, false, false, false, true, false, false, false],
                [false, true, false, false, true, false, false, false, false],
                [false, false, false, false, false, false, true, false, false],
                [false, false, false, true, false, false, false, false, false],
                [false, false, true, false, false, false, false, false, true],
                [true, false, false, false, false, false, false, true, false],
            ];
            return template.map((row, r) =>
                row.split('').map((char, c) => createCell(char, revealed[r][c]))
            );
        })(),
        solution: [
            [1, 2, 3, 4, 5, 6, 7, 8, 9],
            [4, 5, 6, 7, 8, 9, 1, 2, 3],
            [7, 8, 9, 1, 2, 3, 4, 5, 6],
            [2, 3, 4, 5, 6, 7, 8, 9, 1],
            [5, 6, 7, 8, 9, 1, 2, 3, 4],
            [8, 9, 1, 2, 3, 4, 5, 6, 7],
            [3, 4, 5, 6, 7, 8, 9, 1, 2],
            [6, 7, 8, 9, 1, 2, 3, 4, 5],
            [9, 1, 2, 3, 4, 5, 6, 7, 8],
        ],
        vocabulary: [
            { word: '忠', reading: 'ちゅう', meaning: 'loyalty (to sovereign)', jlpt: 0 },
            { word: '孝', reading: 'こう', meaning: 'filial piety', jlpt: 0 },
            { word: '悌', reading: 'てい', meaning: 'respect for elders', jlpt: 0 },
            { word: '節', reading: 'せつ', meaning: 'integrity/moderation', jlpt: 0 },
            { word: '廉', reading: 'れん', meaning: 'honesty/incorruptibility', jlpt: 0 },
            { word: '恥', reading: 'ち', meaning: 'sense of shame', jlpt: 0 },
            { word: '信', reading: 'しん', meaning: 'faithfulness', jlpt: 0 },
            { word: '勤', reading: 'きん', meaning: 'diligence', jlpt: 0 },
            { word: '倹', reading: 'けん', meaning: 'frugality', jlpt: 0 },
        ],
        description: 'Based on Confucian virtues from classical Chinese philosophy adopted in Japan.',
    },

    // Puzzle 4002: Literary Terms (文学用語)
    {
        id: 4002,
        difficulty: 'expert',
        title: '文学用語 - Literary Terms',
        symbols: ['詩', '賦', '韻', '律', '雅', '俗', '諷', '諧', '謔'],
        grid: (() => {
            const template = [
                '詩賦韻律雅俗諷諧謔',
                '律雅俗諷諧謔詩賦韻',
                '諷諧謔詩賦韻律雅俗',
                '賦韻律雅俗諷諧謔詩',
                '雅俗諷諧謔詩賦韻律',
                '諧謔詩賦韻律雅俗諷',
                '韻律雅俗諷諧謔詩賦',
                '俗諷諧謔詩賦韻律雅',
                '謔詩賦韻律雅俗諷諧',
            ];
            const revealed = [
                [true, false, false, false, false, false, false, false, false],
                [false, false, false, false, true, false, false, false, false],
                [false, false, true, false, false, false, false, false, false],
                [false, false, false, false, false, false, true, false, false],
                [false, true, false, false, false, false, false, false, false],
                [false, false, false, false, false, true, false, false, false],
                [false, false, false, true, false, false, false, false, false],
                [false, false, false, false, false, false, false, true, false],
                [false, false, false, false, false, false, false, false, true],
            ];
            return template.map((row, r) =>
                row.split('').map((char, c) => createCell(char, revealed[r][c]))
            );
        })(),
        solution: [
            [1, 2, 3, 4, 5, 6, 7, 8, 9],
            [4, 5, 6, 7, 8, 9, 1, 2, 3],
            [7, 8, 9, 1, 2, 3, 4, 5, 6],
            [2, 3, 4, 5, 6, 7, 8, 9, 1],
            [5, 6, 7, 8, 9, 1, 2, 3, 4],
            [8, 9, 1, 2, 3, 4, 5, 6, 7],
            [3, 4, 5, 6, 7, 8, 9, 1, 2],
            [6, 7, 8, 9, 1, 2, 3, 4, 5],
            [9, 1, 2, 3, 4, 5, 6, 7, 8],
        ],
        vocabulary: [
            { word: '詩', reading: 'し', meaning: 'poetry/verse', jlpt: 0 },
            { word: '賦', reading: 'ふ', meaning: 'poetic prose/rhapsody', jlpt: 0 },
            { word: '韻', reading: 'いん', meaning: 'rhyme', jlpt: 0 },
            { word: '律', reading: 'りつ', meaning: 'meter/rhythm', jlpt: 0 },
            { word: '雅', reading: 'が', meaning: 'elegance/refinement', jlpt: 0 },
            { word: '俗', reading: 'ぞく', meaning: 'vulgarity/common', jlpt: 0 },
            { word: '諷', reading: 'ふう', meaning: 'satire/allegory', jlpt: 0 },
            { word: '諧', reading: 'かい', meaning: 'harmony/humor', jlpt: 0 },
            { word: '謔', reading: 'ぎゃく', meaning: 'jest/banter', jlpt: 0 },
        ],
        description: 'Classical Chinese literary terminology used in Japanese academic writing.',
    },

    // Puzzle 4003: Ancient Calendar (暦法)
    {
        id: 4003,
        difficulty: 'expert',
        title: '暦法 - Ancient Calendar',
        symbols: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬'],
        grid: (() => {
            const template = [
                '甲乙丙丁戊己庚辛壬',
                '丁戊己庚辛壬甲乙丙',
                '庚辛壬甲乙丙丁戊己',
                '乙丙丁戊己庚辛壬甲',
                '戊己庚辛壬甲乙丙丁',
                '辛壬甲乙丙丁戊己庚',
                '丙丁戊己庚辛壬甲乙',
                '己庚辛壬甲乙丙丁戊',
                '壬甲乙丙丁戊己庚辛',
            ];
            const revealed = [
                [true, false, false, false, false, false, false, false, true],
                [false, false, false, false, true, false, false, false, false],
                [false, false, true, false, false, false, true, false, false],
                [false, false, false, false, false, true, false, false, false],
                [false, true, false, false, false, false, false, true, false],
                [false, false, false, true, false, false, false, false, false],
                [false, false, false, false, true, false, false, false, false],
                [true, false, false, false, false, false, false, false, true],
                [false, false, false, false, false, true, false, false, false],
            ];
            return template.map((row, r) =>
                row.split('').map((char, c) => createCell(char, revealed[r][c]))
            );
        })(),
        solution: [
            [1, 2, 3, 4, 5, 6, 7, 8, 9],
            [4, 5, 6, 7, 8, 9, 1, 2, 3],
            [7, 8, 9, 1, 2, 3, 4, 5, 6],
            [2, 3, 4, 5, 6, 7, 8, 9, 1],
            [5, 6, 7, 8, 9, 1, 2, 3, 4],
            [8, 9, 1, 2, 3, 4, 5, 6, 7],
            [3, 4, 5, 6, 7, 8, 9, 1, 2],
            [6, 7, 8, 9, 1, 2, 3, 4, 5],
            [9, 1, 2, 3, 4, 5, 6, 7, 8],
        ],
        vocabulary: [
            { word: '甲', reading: 'こう/きのえ', meaning: '1st heavenly stem (wood+)', jlpt: 0 },
            { word: '乙', reading: 'おつ/きのと', meaning: '2nd heavenly stem (wood-)', jlpt: 0 },
            { word: '丙', reading: 'へい/ひのえ', meaning: '3rd heavenly stem (fire+)', jlpt: 0 },
            { word: '丁', reading: 'てい/ひのと', meaning: '4th heavenly stem (fire-)', jlpt: 0 },
            { word: '戊', reading: 'ぼ/つちのえ', meaning: '5th heavenly stem (earth+)', jlpt: 0 },
            { word: '己', reading: 'き/つちのと', meaning: '6th heavenly stem (earth-)', jlpt: 0 },
            { word: '庚', reading: 'こう/かのえ', meaning: '7th heavenly stem (metal+)', jlpt: 0 },
            { word: '辛', reading: 'しん/かのと', meaning: '8th heavenly stem (metal-)', jlpt: 0 },
            { word: '壬', reading: 'じん/みずのえ', meaning: '9th heavenly stem (water+)', jlpt: 0 },
        ],
        description: 'The Ten Heavenly Stems (天干) used in traditional East Asian calendars.',
    },
];

export default EXPERT_PUZZLES;
