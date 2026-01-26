// Medium Puzzles - JLPT N3-N2 Level
// Intermediate vocabulary with more complex kanji

import { type Puzzle, createCell } from './types';

export const MEDIUM_PUZZLES: Puzzle[] = [
    // Puzzle 2001: Weather & Seasons (天気・季節)
    {
        id: 2001,
        difficulty: 'medium',
        title: '天気・季節 - Weather & Seasons',
        symbols: ['春', '夏', '秋', '冬', '晴', '曇', '風', '雷', '霧'],
        grid: (() => {
            const template = [
                '春夏秋冬晴曇風雷霧',
                '冬晴曇風雷霧春夏秋',
                '風雷霧春夏秋冬晴曇',
                '夏秋冬晴曇風雷霧春',
                '晴曇風雷霧春夏秋冬',
                '雷霧春夏秋冬晴曇風',
                '秋冬晴曇風雷霧春夏',
                '曇風雷霧春夏秋冬晴',
                '霧春夏秋冬晴曇風雷',
            ];
            const revealed = [
                [true, false, true, false, false, true, false, true, false],
                [false, true, false, true, false, false, true, false, true],
                [false, false, true, false, true, false, true, false, false],
                [true, false, false, true, false, true, false, false, true],
                [false, true, false, false, true, false, false, true, false],
                [false, false, true, false, false, true, false, false, true],
                [true, false, false, true, false, false, true, false, false],
                [false, true, false, false, true, false, false, true, false],
                [false, false, true, false, false, true, false, false, true],
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
            { word: '春', reading: 'はる', meaning: 'spring', jlpt: 4 },
            { word: '夏', reading: 'なつ', meaning: 'summer', jlpt: 4 },
            { word: '秋', reading: 'あき', meaning: 'autumn', jlpt: 4 },
            { word: '冬', reading: 'ふゆ', meaning: 'winter', jlpt: 4 },
            { word: '晴れ', reading: 'はれ', meaning: 'sunny', jlpt: 3 },
            { word: '曇り', reading: 'くもり', meaning: 'cloudy', jlpt: 3 },
            { word: '風', reading: 'かぜ', meaning: 'wind', jlpt: 4 },
            { word: '雷', reading: 'かみなり', meaning: 'thunder', jlpt: 3 },
            { word: '霧', reading: 'きり', meaning: 'fog', jlpt: 2 },
        ],
    },

    // Puzzle 2002: Emotions (感情)
    {
        id: 2002,
        difficulty: 'medium',
        title: '感情 - Emotions',
        symbols: ['喜', '怒', '哀', '楽', '愛', '恐', '驚', '悲', '幸'],
        grid: (() => {
            const template = [
                '喜怒哀楽愛恐驚悲幸',
                '楽愛恐驚悲幸喜怒哀',
                '驚悲幸喜怒哀楽愛恐',
                '怒哀楽愛恐驚悲幸喜',
                '愛恐驚悲幸喜怒哀楽',
                '悲幸喜怒哀楽愛恐驚',
                '哀楽愛恐驚悲幸喜怒',
                '恐驚悲幸喜怒哀楽愛',
                '幸喜怒哀楽愛恐驚悲',
            ];
            const revealed = [
                [true, false, false, true, false, false, true, false, false],
                [false, true, false, false, true, false, false, true, false],
                [false, false, true, false, false, true, false, false, true],
                [true, false, false, true, false, false, true, false, false],
                [false, true, false, false, true, false, false, true, false],
                [false, false, true, false, false, true, false, false, true],
                [true, false, false, true, false, false, true, false, false],
                [false, true, false, false, true, false, false, true, false],
                [false, false, true, false, false, true, false, false, true],
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
            { word: '喜び', reading: 'よろこび', meaning: 'joy', jlpt: 3 },
            { word: '怒り', reading: 'いかり', meaning: 'anger', jlpt: 3 },
            { word: '哀しみ', reading: 'かなしみ', meaning: 'sorrow', jlpt: 2 },
            { word: '楽しい', reading: 'たのしい', meaning: 'fun/enjoyable', jlpt: 4 },
            { word: '愛', reading: 'あい', meaning: 'love', jlpt: 3 },
            { word: '恐怖', reading: 'きょうふ', meaning: 'fear', jlpt: 2 },
            { word: '驚き', reading: 'おどろき', meaning: 'surprise', jlpt: 3 },
            { word: '悲しい', reading: 'かなしい', meaning: 'sad', jlpt: 4 },
            { word: '幸せ', reading: 'しあわせ', meaning: 'happiness', jlpt: 3 },
        ],
    },

    // Puzzle 2003: Body Parts (体の部分)
    {
        id: 2003,
        difficulty: 'medium',
        title: '体 - Body Parts',
        symbols: ['頭', '顔', '首', '肩', '胸', '腹', '腕', '脚', '背'],
        grid: (() => {
            const template = [
                '頭顔首肩胸腹腕脚背',
                '肩胸腹腕脚背頭顔首',
                '腕脚背頭顔首肩胸腹',
                '顔首肩胸腹腕脚背頭',
                '胸腹腕脚背頭顔首肩',
                '脚背頭顔首肩胸腹腕',
                '首肩胸腹腕脚背頭顔',
                '腹腕脚背頭顔首肩胸',
                '背頭顔首肩胸腹腕脚',
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
            [2, 3, 4, 5, 6, 7, 8, 9, 1],
            [5, 6, 7, 8, 9, 1, 2, 3, 4],
            [8, 9, 1, 2, 3, 4, 5, 6, 7],
            [3, 4, 5, 6, 7, 8, 9, 1, 2],
            [6, 7, 8, 9, 1, 2, 3, 4, 5],
            [9, 1, 2, 3, 4, 5, 6, 7, 8],
        ],
        vocabulary: [
            { word: '頭', reading: 'あたま', meaning: 'head', jlpt: 4 },
            { word: '顔', reading: 'かお', meaning: 'face', jlpt: 4 },
            { word: '首', reading: 'くび', meaning: 'neck', jlpt: 3 },
            { word: '肩', reading: 'かた', meaning: 'shoulder', jlpt: 3 },
            { word: '胸', reading: 'むね', meaning: 'chest', jlpt: 3 },
            { word: '腹', reading: 'はら', meaning: 'stomach', jlpt: 3 },
            { word: '腕', reading: 'うで', meaning: 'arm', jlpt: 3 },
            { word: '脚', reading: 'あし', meaning: 'leg', jlpt: 3 },
            { word: '背', reading: 'せ', meaning: 'back', jlpt: 3 },
        ],
    },

    // Puzzle 2004: Actions (動詞)
    {
        id: 2004,
        difficulty: 'medium',
        title: '動詞 - Actions',
        symbols: ['走', '歩', '泳', '飛', '跳', '投', '打', '蹴', '持'],
        grid: (() => {
            const template = [
                '走歩泳飛跳投打蹴持',
                '飛跳投打蹴持走歩泳',
                '打蹴持走歩泳飛跳投',
                '歩泳飛跳投打蹴持走',
                '跳投打蹴持走歩泳飛',
                '蹴持走歩泳飛跳投打',
                '泳飛跳投打蹴持走歩',
                '投打蹴持走歩泳飛跳',
                '持走歩泳飛跳投打蹴',
            ];
            const revealed = [
                [true, false, false, true, false, false, true, false, false],
                [false, true, false, false, true, false, false, true, false],
                [false, false, true, false, false, true, false, false, true],
                [false, true, false, false, true, false, false, true, false],
                [true, false, false, true, false, false, true, false, false],
                [false, false, true, false, false, true, false, false, true],
                [false, true, false, false, true, false, false, true, false],
                [false, false, true, false, false, true, false, false, true],
                [true, false, false, true, false, false, true, false, false],
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
            { word: '走る', reading: 'はしる', meaning: 'to run', jlpt: 4 },
            { word: '歩く', reading: 'あるく', meaning: 'to walk', jlpt: 4 },
            { word: '泳ぐ', reading: 'およぐ', meaning: 'to swim', jlpt: 4 },
            { word: '飛ぶ', reading: 'とぶ', meaning: 'to fly', jlpt: 4 },
            { word: '跳ぶ', reading: 'とぶ', meaning: 'to jump', jlpt: 3 },
            { word: '投げる', reading: 'なげる', meaning: 'to throw', jlpt: 3 },
            { word: '打つ', reading: 'うつ', meaning: 'to hit', jlpt: 3 },
            { word: '蹴る', reading: 'ける', meaning: 'to kick', jlpt: 2 },
            { word: '持つ', reading: 'もつ', meaning: 'to hold', jlpt: 4 },
        ],
    },

    // Puzzle 2005: Places (場所)
    {
        id: 2005,
        difficulty: 'medium',
        title: '場所 - Places',
        symbols: ['店', '駅', '橋', '港', '塔', '城', '寺', '神', '社'],
        grid: (() => {
            const template = [
                '店駅橋港塔城寺神社',
                '港塔城寺神社店駅橋',
                '寺神社店駅橋港塔城',
                '駅橋港塔城寺神社店',
                '塔城寺神社店駅橋港',
                '神社店駅橋港塔城寺',
                '橋港塔城寺神社店駅',
                '城寺神社店駅橋港塔',
                '社店駅橋港塔城寺神',
            ];
            const revealed = [
                [true, true, false, false, true, false, false, true, false],
                [false, true, false, true, false, false, true, false, true],
                [false, false, true, false, true, false, false, true, false],
                [true, false, false, true, false, true, false, false, true],
                [false, true, false, false, true, false, true, false, false],
                [false, false, true, false, false, true, false, true, false],
                [true, false, false, true, false, false, true, false, true],
                [false, true, false, false, true, false, false, true, false],
                [false, false, true, false, false, true, false, false, true],
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
            { word: '店', reading: 'みせ', meaning: 'shop', jlpt: 4 },
            { word: '駅', reading: 'えき', meaning: 'station', jlpt: 5 },
            { word: '橋', reading: 'はし', meaning: 'bridge', jlpt: 3 },
            { word: '港', reading: 'みなと', meaning: 'harbor', jlpt: 3 },
            { word: '塔', reading: 'とう', meaning: 'tower', jlpt: 2 },
            { word: '城', reading: 'しろ', meaning: 'castle', jlpt: 3 },
            { word: '寺', reading: 'てら', meaning: 'temple', jlpt: 4 },
            { word: '神社', reading: 'じんじゃ', meaning: 'shrine', jlpt: 3 },
        ],
    },
];

export default MEDIUM_PUZZLES;
