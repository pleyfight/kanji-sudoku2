// Easy Puzzles - JLPT N5-N4 Level
// Features hiragana and katakana cells that are fixed, user fills kanji only

import { type Puzzle, createCell } from './types';

export const EASY_PUZZLES: Puzzle[] = [
    // Puzzle 1001: Days of the Week (曜日)
    {
        id: 1001,
        difficulty: 'easy',
        title: '曜日 - Days of the Week',
        symbols: ['日', '月', '火', '水', '木', '金', '土', 'よ', 'う'],
        grid: (() => {
            const template = [
                '日月火水木金土よう',
                '水木金土よう日月火',
                '土よう日月火水木金',
                '月火水木金土よう日',
                '金土よう日月火水木',
                'よう日月火水木金土',
                '火水木金土よう日月',
                '木金土よう日月火水',
                'う日月火水木金土よ',
            ];
            // true = revealed, false = user must fill
            const revealed = [
                [true, false, true, false, true, false, true, true, true],
                [false, true, false, true, true, true, false, true, false],
                [true, true, true, false, false, true, false, false, true],
                [false, true, false, true, false, true, true, true, false],
                [true, false, true, true, true, false, true, false, true],
                [true, true, false, true, false, true, false, true, false],
                [false, false, true, false, true, true, true, false, true],
                [true, false, true, true, true, false, true, false, false],
                [true, true, false, true, false, false, true, true, true],
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
            [6, 7, 8, 9, 1, 2, 3, 4, 5],
            [8, 9, 1, 2, 3, 4, 5, 6, 7],
            [3, 4, 5, 6, 7, 8, 9, 1, 2],
            [5, 6, 7, 8, 9, 1, 2, 3, 4],
            [9, 1, 2, 3, 4, 5, 6, 7, 8],
        ],
        vocabulary: [
            { word: '日曜日', reading: 'にちようび', meaning: 'Sunday', jlpt: 5 },
            { word: '月曜日', reading: 'げつようび', meaning: 'Monday', jlpt: 5 },
            { word: '火曜日', reading: 'かようび', meaning: 'Tuesday', jlpt: 5 },
            { word: '水曜日', reading: 'すいようび', meaning: 'Wednesday', jlpt: 5 },
            { word: '木曜日', reading: 'もくようび', meaning: 'Thursday', jlpt: 5 },
            { word: '金曜日', reading: 'きんようび', meaning: 'Friday', jlpt: 5 },
            { word: '土曜日', reading: 'どようび', meaning: 'Saturday', jlpt: 5 },
        ],
    },

    // Puzzle 1002: Time Words (時間)
    {
        id: 1002,
        difficulty: 'easy',
        title: '時間 - Time',
        symbols: ['今', '日', '明', 'あ', 'し', 'た', '昨', 'き', 'の'],
        grid: (() => {
            const template = [
                '今日明あしたきのき',
                'あしたきの今日明し',
                'きの今日明あした昨',
                '日明あしたきの今昨',
                'したきの今日明あし',
                'の今日明あしたきの',
                '明あしたきの今日明',
                'たきの今日明あした',
                'きの昨今日明あした',
            ];
            const revealed = [
                [true, true, false, true, true, true, false, true, false],
                [true, true, false, false, true, false, true, false, true],
                [false, true, true, false, false, true, true, true, false],
                [true, false, true, true, false, true, false, true, true],
                [true, true, false, true, true, false, true, false, true],
                [false, true, true, false, true, true, false, true, false],
                [true, false, true, true, false, true, true, false, true],
                [false, true, false, true, true, false, true, true, false],
                [true, false, true, false, true, true, false, true, true],
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
            { word: '今日', reading: 'きょう', meaning: 'today', jlpt: 5 },
            { word: '明日', reading: 'あした', meaning: 'tomorrow', jlpt: 5 },
            { word: '昨日', reading: 'きのう', meaning: 'yesterday', jlpt: 5 },
        ],
    },

    // Puzzle 1003: Numbers (数字)
    {
        id: 1003,
        difficulty: 'easy',
        title: '数字 - Numbers',
        symbols: ['一', '二', '三', '四', '五', '六', '七', '八', '九'],
        grid: (() => {
            const template = [
                '一二三四五六七八九',
                '四五六七八九一二三',
                '七八九一二三四五六',
                '二三一五六四八九七',
                '五六四八九七二三一',
                '八九七二三一五六四',
                '三一二六四五九七八',
                '六四五九七八三一二',
                '九七八三一二六四五',
            ];
            const revealed = [
                [true, false, true, false, true, false, true, false, true],
                [false, true, false, true, false, true, false, true, false],
                [true, false, true, false, true, false, true, false, true],
                [false, true, false, true, false, true, false, true, false],
                [true, false, true, false, true, false, true, false, true],
                [false, true, false, true, false, true, false, true, false],
                [true, false, true, false, true, false, true, false, true],
                [false, true, false, true, false, true, false, true, false],
                [true, false, true, false, true, false, true, false, true],
            ];
            return template.map((row, r) =>
                row.split('').map((char, c) => createCell(char, revealed[r][c]))
            );
        })(),
        solution: [
            [1, 2, 3, 4, 5, 6, 7, 8, 9],
            [4, 5, 6, 7, 8, 9, 1, 2, 3],
            [7, 8, 9, 1, 2, 3, 4, 5, 6],
            [2, 3, 1, 5, 6, 4, 8, 9, 7],
            [5, 6, 4, 8, 9, 7, 2, 3, 1],
            [8, 9, 7, 2, 3, 1, 5, 6, 4],
            [3, 1, 2, 6, 4, 5, 9, 7, 8],
            [6, 4, 5, 9, 7, 8, 3, 1, 2],
            [9, 7, 8, 3, 1, 2, 6, 4, 5],
        ],
        vocabulary: [
            { word: '一', reading: 'いち', meaning: 'one', jlpt: 5 },
            { word: '二', reading: 'に', meaning: 'two', jlpt: 5 },
            { word: '三', reading: 'さん', meaning: 'three', jlpt: 5 },
            { word: '四', reading: 'よん/し', meaning: 'four', jlpt: 5 },
            { word: '五', reading: 'ご', meaning: 'five', jlpt: 5 },
            { word: '六', reading: 'ろく', meaning: 'six', jlpt: 5 },
            { word: '七', reading: 'なな/しち', meaning: 'seven', jlpt: 5 },
            { word: '八', reading: 'はち', meaning: 'eight', jlpt: 5 },
            { word: '九', reading: 'きゅう/く', meaning: 'nine', jlpt: 5 },
        ],
    },

    // Puzzle 1004: Family (家族)
    {
        id: 1004,
        difficulty: 'easy',
        title: '家族 - Family',
        symbols: ['父', '母', '兄', '姉', '弟', '妹', 'ち', 'は', 'あ'],
        grid: (() => {
            const template = [
                '父母兄姉弟妹ちはあ',
                '姉弟妹ちはあ父母兄',
                'ちはあ父母兄姉弟妹',
                '母兄姉弟妹ちはあ父',
                '弟妹ちはあ父母兄姉',
                'はあ父母兄姉弟妹ち',
                '兄姉弟妹ちはあ父母',
                '妹ちはあ父母兄姉弟',
                'あ父母兄姉弟妹ちは',
            ];
            const revealed = [
                [true, true, false, true, false, true, true, true, true],
                [true, false, true, true, true, true, false, true, false],
                [true, true, true, false, true, false, true, false, true],
                [true, false, true, false, true, true, true, true, false],
                [false, true, true, true, true, false, true, false, true],
                [true, true, false, true, false, true, false, true, true],
                [false, true, false, true, true, true, true, false, true],
                [true, true, true, true, false, true, false, true, false],
                [true, false, true, false, true, false, true, true, true],
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
            { word: '父', reading: 'ちち', meaning: 'father', jlpt: 5 },
            { word: '母', reading: 'はは', meaning: 'mother', jlpt: 5 },
            { word: '兄', reading: 'あに', meaning: 'older brother', jlpt: 5 },
            { word: '姉', reading: 'あね', meaning: 'older sister', jlpt: 5 },
            { word: '弟', reading: 'おとうと', meaning: 'younger brother', jlpt: 5 },
            { word: '妹', reading: 'いもうと', meaning: 'younger sister', jlpt: 5 },
        ],
    },

    // Puzzle 1005: Nature (自然)
    {
        id: 1005,
        difficulty: 'easy',
        title: '自然 - Nature',
        symbols: ['山', '川', '海', '空', '雨', '雪', 'や', 'ま', 'か'],
        grid: (() => {
            const template = [
                '山川海空雨雪やまか',
                '空雨雪やまか山川海',
                'やまか山川海空雨雪',
                '川海空雨雪やまか山',
                '雨雪やまか山川海空',
                'まか山川海空雨雪や',
                '海空雨雪やまか山川',
                '雪やまか山川海空雨',
                'か山川海空雨雪やま',
            ];
            const revealed = [
                [true, true, true, false, true, false, true, true, true],
                [false, true, false, true, true, true, false, true, true],
                [true, true, true, true, false, true, false, false, true],
                [true, true, false, true, false, true, true, true, false],
                [true, false, true, true, true, false, true, true, false],
                [true, true, false, true, true, false, true, false, true],
                [true, false, true, false, true, true, true, true, true],
                [false, true, true, true, false, true, true, false, true],
                [true, true, true, true, false, true, false, true, true],
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
            { word: '山', reading: 'やま', meaning: 'mountain', jlpt: 5 },
            { word: '川', reading: 'かわ', meaning: 'river', jlpt: 5 },
            { word: '海', reading: 'うみ', meaning: 'sea', jlpt: 5 },
            { word: '空', reading: 'そら', meaning: 'sky', jlpt: 5 },
            { word: '雨', reading: 'あめ', meaning: 'rain', jlpt: 5 },
            { word: '雪', reading: 'ゆき', meaning: 'snow', jlpt: 5 },
        ],
    },
];

export default EASY_PUZZLES;
