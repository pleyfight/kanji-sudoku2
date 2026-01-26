// Hard Puzzles - JLPT N1 Level
// Advanced vocabulary requiring deep kanji knowledge

import { type Puzzle, createCell } from './types';

export const HARD_PUZZLES: Puzzle[] = [
    // Puzzle 3001: Philosophy (哲学)
    {
        id: 3001,
        difficulty: 'hard',
        title: '哲学 - Philosophy',
        symbols: ['真', '善', '美', '義', '理', '智', '勇', '仁', '礼'],
        grid: (() => {
            const template = [
                '真善美義理智勇仁礼',
                '義理智勇仁礼真善美',
                '勇仁礼真善美義理智',
                '善美義理智勇仁礼真',
                '理智勇仁礼真善美義',
                '仁礼真善美義理智勇',
                '美義理智勇仁礼真善',
                '智勇仁礼真善美義理',
                '礼真善美義理智勇仁',
            ];
            const revealed = [
                [true, false, false, false, true, false, false, false, true],
                [false, false, true, false, false, false, true, false, false],
                [false, true, false, false, false, true, false, false, false],
                [false, false, false, true, false, false, false, true, false],
                [true, false, false, false, true, false, false, false, true],
                [false, true, false, false, false, true, false, false, false],
                [false, false, true, false, false, false, true, false, false],
                [false, false, false, true, false, false, false, true, false],
                [true, false, false, false, true, false, false, false, true],
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
            { word: '真実', reading: 'しんじつ', meaning: 'truth', jlpt: 2 },
            { word: '善悪', reading: 'ぜんあく', meaning: 'good and evil', jlpt: 1 },
            { word: '美学', reading: 'びがく', meaning: 'aesthetics', jlpt: 1 },
            { word: '義理', reading: 'ぎり', meaning: 'duty/obligation', jlpt: 2 },
            { word: '理性', reading: 'りせい', meaning: 'reason/rationality', jlpt: 1 },
            { word: '智慧', reading: 'ちえ', meaning: 'wisdom', jlpt: 1 },
            { word: '勇気', reading: 'ゆうき', meaning: 'courage', jlpt: 3 },
            { word: '仁愛', reading: 'じんあい', meaning: 'benevolence', jlpt: 1 },
            { word: '礼儀', reading: 'れいぎ', meaning: 'etiquette', jlpt: 2 },
        ],
    },

    // Puzzle 3002: Governance (政治)
    {
        id: 3002,
        difficulty: 'hard',
        title: '政治 - Governance',
        symbols: ['政', '治', '法', '権', '民', '議', '制', '憲', '選'],
        grid: (() => {
            const template = [
                '政治法権民議制憲選',
                '権民議制憲選政治法',
                '制憲選政治法権民議',
                '治法権民議制憲選政',
                '民議制憲選政治法権',
                '憲選政治法権民議制',
                '法権民議制憲選政治',
                '議制憲選政治法権民',
                '選政治法権民議制憲',
            ];
            const revealed = [
                [true, false, false, false, false, true, false, false, false],
                [false, true, false, false, false, false, true, false, false],
                [false, false, true, false, false, false, false, true, false],
                [false, false, false, true, false, false, false, false, true],
                [true, false, false, false, true, false, false, false, false],
                [false, true, false, false, false, true, false, false, false],
                [false, false, true, false, false, false, true, false, false],
                [false, false, false, true, false, false, false, true, false],
                [false, false, false, false, true, false, false, false, true],
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
            { word: '政治', reading: 'せいじ', meaning: 'politics', jlpt: 2 },
            { word: '法律', reading: 'ほうりつ', meaning: 'law', jlpt: 2 },
            { word: '権利', reading: 'けんり', meaning: 'rights', jlpt: 2 },
            { word: '民主', reading: 'みんしゅ', meaning: 'democracy', jlpt: 2 },
            { word: '議会', reading: 'ぎかい', meaning: 'parliament', jlpt: 1 },
            { word: '制度', reading: 'せいど', meaning: 'system', jlpt: 2 },
            { word: '憲法', reading: 'けんぽう', meaning: 'constitution', jlpt: 1 },
            { word: '選挙', reading: 'せんきょ', meaning: 'election', jlpt: 2 },
        ],
    },

    // Puzzle 3003: Medicine (医学)
    {
        id: 3003,
        difficulty: 'hard',
        title: '医学 - Medicine',
        symbols: ['診', '療', '症', '患', '医', '薬', '治', '病', '健'],
        grid: (() => {
            const template = [
                '診療症患医薬治病健',
                '患医薬治病健診療症',
                '治病健診療症患医薬',
                '療症患医薬治病健診',
                '医薬治病健診療症患',
                '病健診療症患医薬治',
                '症患医薬治病健診療',
                '薬治病健診療症患医',
                '健診療症患医薬治病',
            ];
            const revealed = [
                [true, false, false, false, true, false, false, false, true],
                [false, false, true, false, false, false, true, false, false],
                [false, true, false, false, false, true, false, false, false],
                [false, false, false, true, false, false, false, true, false],
                [true, false, false, false, true, false, false, false, true],
                [false, false, true, false, false, false, true, false, false],
                [false, true, false, false, false, true, false, false, false],
                [false, false, false, true, false, false, false, true, false],
                [true, false, false, false, true, false, false, false, true],
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
            { word: '診断', reading: 'しんだん', meaning: 'diagnosis', jlpt: 1 },
            { word: '療養', reading: 'りょうよう', meaning: 'medical treatment', jlpt: 1 },
            { word: '症状', reading: 'しょうじょう', meaning: 'symptom', jlpt: 2 },
            { word: '患者', reading: 'かんじゃ', meaning: 'patient', jlpt: 2 },
            { word: '医師', reading: 'いし', meaning: 'doctor', jlpt: 2 },
            { word: '薬品', reading: 'やくひん', meaning: 'medicine', jlpt: 1 },
            { word: '治療', reading: 'ちりょう', meaning: 'treatment', jlpt: 2 },
            { word: '病院', reading: 'びょういん', meaning: 'hospital', jlpt: 4 },
            { word: '健康', reading: 'けんこう', meaning: 'health', jlpt: 3 },
        ],
    },

    // Puzzle 3004: Economics (経済)
    {
        id: 3004,
        difficulty: 'hard',
        title: '経済 - Economics',
        symbols: ['経', '済', '財', '貿', '易', '税', '株', '債', '融'],
        grid: (() => {
            const template = [
                '経済財貿易税株債融',
                '貿易税株債融経済財',
                '株債融経済財貿易税',
                '済財貿易税株債融経',
                '易税株債融経済財貿',
                '債融経済財貿易税株',
                '財貿易税株債融経済',
                '税株債融経済財貿易',
                '融経済財貿易税株債',
            ];
            const revealed = [
                [true, false, false, false, false, true, false, false, false],
                [false, false, true, false, false, false, true, false, false],
                [false, true, false, false, false, false, false, true, false],
                [false, false, false, true, false, false, false, false, true],
                [false, false, false, false, true, false, false, false, false],
                [true, false, false, false, false, true, false, false, false],
                [false, false, true, false, false, false, true, false, false],
                [false, true, false, false, false, false, false, true, false],
                [false, false, false, true, false, false, false, false, true],
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
            { word: '経済', reading: 'けいざい', meaning: 'economy', jlpt: 2 },
            { word: '財政', reading: 'ざいせい', meaning: 'finance', jlpt: 1 },
            { word: '貿易', reading: 'ぼうえき', meaning: 'trade', jlpt: 2 },
            { word: '税金', reading: 'ぜいきん', meaning: 'tax', jlpt: 2 },
            { word: '株式', reading: 'かぶしき', meaning: 'stock', jlpt: 1 },
            { word: '債券', reading: 'さいけん', meaning: 'bond', jlpt: 1 },
            { word: '融資', reading: 'ゆうし', meaning: 'financing', jlpt: 1 },
        ],
    },

    // Puzzle 3005: Psychology (心理)
    {
        id: 3005,
        difficulty: 'hard',
        title: '心理 - Psychology',
        symbols: ['心', '理', '意', '識', '感', '情', '記', '憶', '夢'],
        grid: (() => {
            const template = [
                '心理意識感情記憶夢',
                '識感情記憶夢心理意',
                '記憶夢心理意識感情',
                '理意識感情記憶夢心',
                '感情記憶夢心理意識',
                '憶夢心理意識感情記',
                '意識感情記憶夢心理',
                '情記憶夢心理意識感',
                '夢心理意識感情記憶',
            ];
            const revealed = [
                [true, false, false, false, true, false, false, false, true],
                [false, true, false, false, false, true, false, false, false],
                [false, false, true, false, false, false, true, false, false],
                [false, false, false, true, false, false, false, true, false],
                [true, false, false, false, true, false, false, false, true],
                [false, true, false, false, false, true, false, false, false],
                [false, false, true, false, false, false, true, false, false],
                [false, false, false, true, false, false, false, true, false],
                [true, false, false, false, true, false, false, false, true],
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
            { word: '心理', reading: 'しんり', meaning: 'psychology', jlpt: 2 },
            { word: '意識', reading: 'いしき', meaning: 'consciousness', jlpt: 2 },
            { word: '感情', reading: 'かんじょう', meaning: 'emotion', jlpt: 2 },
            { word: '記憶', reading: 'きおく', meaning: 'memory', jlpt: 2 },
            { word: '夢', reading: 'ゆめ', meaning: 'dream', jlpt: 4 },
        ],
    },
];

export default HARD_PUZZLES;
