// Compound Words - Multi-kanji words that can be formed in the game
// These are the valid words players discover when playing

export interface CompoundWord {
    word: string;           // Kanji compound
    reading: string;        // Hiragana reading
    meaning: string;        // English meaning
    category: string;       // Category for game hints
}

// Common 2-kanji compounds (most common in game)
export const COMPOUND_WORDS_2: CompoundWord[] = [
    // Time & Calendar
    { word: '日月', reading: 'じつげつ', meaning: 'sun and moon', category: 'nature' },
    { word: '月日', reading: 'つきひ', meaning: 'time passing', category: 'time' },
    { word: '土日', reading: 'どにち', meaning: 'weekend', category: 'time' },
    { word: '今日', reading: 'きょう', meaning: 'today', category: 'time' },
    { word: '明日', reading: 'あした', meaning: 'tomorrow', category: 'time' },
    { word: '昨日', reading: 'きのう', meaning: 'yesterday', category: 'time' },
    { word: '毎日', reading: 'まいにち', meaning: 'every day', category: 'time' },
    { word: '今年', reading: 'ことし', meaning: 'this year', category: 'time' },
    { word: '今月', reading: 'こんげつ', meaning: 'this month', category: 'time' },
    { word: '今週', reading: 'こんしゅう', meaning: 'this week', category: 'time' },
    { word: '来年', reading: 'らいねん', meaning: 'next year', category: 'time' },
    { word: '来月', reading: 'らいげつ', meaning: 'next month', category: 'time' },
    { word: '来週', reading: 'らいしゅう', meaning: 'next week', category: 'time' },
    { word: '先週', reading: 'せんしゅう', meaning: 'last week', category: 'time' },
    { word: '先月', reading: 'せんげつ', meaning: 'last month', category: 'time' },
    { word: '午前', reading: 'ごぜん', meaning: 'morning/AM', category: 'time' },
    { word: '午後', reading: 'ごご', meaning: 'afternoon/PM', category: 'time' },
    { word: '時間', reading: 'じかん', meaning: 'time/hour', category: 'time' },
    { word: '年間', reading: 'ねんかん', meaning: 'year period', category: 'time' },
    { word: '朝日', reading: 'あさひ', meaning: 'morning sun', category: 'nature' },
    { word: '夕日', reading: 'ゆうひ', meaning: 'setting sun', category: 'nature' },

    // Nature
    { word: '天気', reading: 'てんき', meaning: 'weather', category: 'nature' },
    { word: '天国', reading: 'てんごく', meaning: 'heaven', category: 'nature' },
    { word: '天人', reading: 'てんにん', meaning: 'celestial being', category: 'nature' },
    { word: '水火', reading: 'すいか', meaning: 'water and fire', category: 'nature' },
    { word: '山川', reading: 'やまかわ', meaning: 'mountains and rivers', category: 'nature' },
    { word: '山火', reading: 'やまび', meaning: 'mountain fire', category: 'nature' },
    { word: '海山', reading: 'うみやま', meaning: 'sea and mountains', category: 'nature' },
    { word: '火山', reading: 'かざん', meaning: 'volcano', category: 'nature' },
    { word: '花火', reading: 'はなび', meaning: 'fireworks', category: 'nature' },
    { word: '大雨', reading: 'おおあめ', meaning: 'heavy rain', category: 'nature' },
    { word: '大雪', reading: 'おおゆき', meaning: 'heavy snow', category: 'nature' },
    { word: '大風', reading: 'おおかぜ', meaning: 'strong wind', category: 'nature' },
    { word: '青空', reading: 'あおぞら', meaning: 'blue sky', category: 'nature' },
    { word: '星空', reading: 'ほしぞら', meaning: 'starry sky', category: 'nature' },
    { word: '夜空', reading: 'よぞら', meaning: 'night sky', category: 'nature' },
    { word: '月光', reading: 'げっこう', meaning: 'moonlight', category: 'nature' },
    { word: '日光', reading: 'にっこう', meaning: 'sunlight', category: 'nature' },
    { word: '水木', reading: 'すいもく', meaning: 'Wed-Thu', category: 'time' },
    { word: '金土', reading: 'きんど', meaning: 'Fri-Sat', category: 'time' },

    // People & Family
    { word: '人間', reading: 'にんげん', meaning: 'human being', category: 'people' },
    { word: '大人', reading: 'おとな', meaning: 'adult', category: 'people' },
    { word: '子供', reading: 'こども', meaning: 'child', category: 'people' },
    { word: '男子', reading: 'だんし', meaning: 'boy/male', category: 'people' },
    { word: '女子', reading: 'じょし', meaning: 'girl/female', category: 'people' },
    { word: '父母', reading: 'ふぼ', meaning: 'parents', category: 'family' },
    { word: '父子', reading: 'ふし', meaning: 'father and child', category: 'family' },
    { word: '母子', reading: 'ぼし', meaning: 'mother and child', category: 'family' },
    { word: '友人', reading: 'ゆうじん', meaning: 'friend', category: 'people' },
    { word: '先生', reading: 'せんせい', meaning: 'teacher', category: 'people' },
    { word: '学生', reading: 'がくせい', meaning: 'student', category: 'people' },

    // Body
    { word: '目口', reading: 'めくち', meaning: 'eyes and mouth', category: 'body' },
    { word: '耳目', reading: 'じもく', meaning: 'ears and eyes', category: 'body' },
    { word: '手足', reading: 'てあし', meaning: 'hands and feet', category: 'body' },
    { word: '心身', reading: 'しんしん', meaning: 'mind and body', category: 'body' },
    { word: '全身', reading: 'ぜんしん', meaning: 'whole body', category: 'body' },

    // Places
    { word: '国内', reading: 'こくない', meaning: 'domestic', category: 'place' },
    { word: '国外', reading: 'こくがい', meaning: 'overseas', category: 'place' },
    { word: '山中', reading: 'さんちゅう', meaning: 'in the mountains', category: 'place' },
    { word: '海外', reading: 'かいがい', meaning: 'abroad', category: 'place' },
    { word: '町中', reading: 'まちなか', meaning: 'downtown', category: 'place' },
    { word: '家中', reading: 'いえじゅう', meaning: 'whole house', category: 'place' },
    { word: '店内', reading: 'てんない', meaning: 'inside store', category: 'place' },
    { word: '駅前', reading: 'えきまえ', meaning: 'front of station', category: 'place' },

    // Direction
    { word: '上下', reading: 'じょうげ', meaning: 'up and down', category: 'direction' },
    { word: '左右', reading: 'さゆう', meaning: 'left and right', category: 'direction' },
    { word: '前後', reading: 'ぜんご', meaning: 'front and back', category: 'direction' },
    { word: '内外', reading: 'ないがい', meaning: 'inside and outside', category: 'direction' },
    { word: '東西', reading: 'とうざい', meaning: 'east and west', category: 'direction' },
    { word: '南北', reading: 'なんぼく', meaning: 'north and south', category: 'direction' },
    { word: '北東', reading: 'ほくとう', meaning: 'northeast', category: 'direction' },
    { word: '南西', reading: 'なんせい', meaning: 'southwest', category: 'direction' },

    // Opposites
    { word: '大小', reading: 'だいしょう', meaning: 'big and small', category: 'concept' },
    { word: '長短', reading: 'ちょうたん', meaning: 'long and short', category: 'concept' },
    { word: '高低', reading: 'こうてい', meaning: 'high and low', category: 'concept' },
    { word: '強弱', reading: 'きょうじゃく', meaning: 'strong and weak', category: 'concept' },
    { word: '新旧', reading: 'しんきゅう', meaning: 'new and old', category: 'concept' },
    { word: '多少', reading: 'たしょう', meaning: 'more or less', category: 'concept' },
    { word: '明暗', reading: 'めいあん', meaning: 'light and dark', category: 'concept' },
    { word: '白黒', reading: 'しろくろ', meaning: 'black and white', category: 'concept' },
    { word: '善悪', reading: 'ぜんあく', meaning: 'good and evil', category: 'concept' },
    { word: '生死', reading: 'せいし', meaning: 'life and death', category: 'concept' },

    // Actions
    { word: '入口', reading: 'いりぐち', meaning: 'entrance', category: 'place' },
    { word: '出口', reading: 'でぐち', meaning: 'exit', category: 'place' },
    { word: '入出', reading: 'にゅうしゅつ', meaning: 'in and out', category: 'action' },
    { word: '行来', reading: 'ゆきき', meaning: 'coming and going', category: 'action' },
    { word: '開始', reading: 'かいし', meaning: 'start/beginning', category: 'action' },
    { word: '終了', reading: 'しゅうりょう', meaning: 'end/finish', category: 'action' },
    { word: '読書', reading: 'どくしょ', meaning: 'reading', category: 'action' },
    { word: '売買', reading: 'ばいばい', meaning: 'buying and selling', category: 'action' },

    // Education
    { word: '学校', reading: 'がっこう', meaning: 'school', category: 'education' },
    { word: '大学', reading: 'だいがく', meaning: 'university', category: 'education' },
    { word: '中学', reading: 'ちゅうがく', meaning: 'middle school', category: 'education' },
    { word: '小学', reading: 'しょうがく', meaning: 'elementary school', category: 'education' },
    { word: '教室', reading: 'きょうしつ', meaning: 'classroom', category: 'education' },
    { word: '学習', reading: 'がくしゅう', meaning: 'learning', category: 'education' },

    // Work
    { word: '会社', reading: 'かいしゃ', meaning: 'company', category: 'work' },
    { word: '仕事', reading: 'しごと', meaning: 'job/work', category: 'work' },
    { word: '社会', reading: 'しゃかい', meaning: 'society', category: 'work' },
    { word: '会場', reading: 'かいじょう', meaning: 'venue', category: 'place' },

    // Objects
    { word: '本物', reading: 'ほんもの', meaning: 'genuine article', category: 'object' },
    { word: '食物', reading: 'しょくもつ', meaning: 'food', category: 'object' },
    { word: '飲物', reading: 'のみもの', meaning: 'drink', category: 'object' },
    { word: '電車', reading: 'でんしゃ', meaning: 'train', category: 'object' },
    { word: '電話', reading: 'でんわ', meaning: 'telephone', category: 'object' },

    // Abstract
    { word: '意味', reading: 'いみ', meaning: 'meaning', category: 'concept' },
    { word: '気持', reading: 'きもち', meaning: 'feeling', category: 'concept' },
    { word: '気力', reading: 'きりょく', meaning: 'energy/willpower', category: 'concept' },
    { word: '力量', reading: 'りきりょう', meaning: 'ability', category: 'concept' },
    { word: '人気', reading: 'にんき', meaning: 'popularity', category: 'concept' },
    { word: '天才', reading: 'てんさい', meaning: 'genius', category: 'concept' },
    { word: '本当', reading: 'ほんとう', meaning: 'truth/really', category: 'concept' },
    { word: '世界', reading: 'せかい', meaning: 'world', category: 'concept' },
    { word: '人生', reading: 'じんせい', meaning: 'life (human)', category: 'concept' },
];

// 3-kanji compounds (rarer but powerful)
export const COMPOUND_WORDS_3: CompoundWord[] = [
    { word: '日本人', reading: 'にほんじん', meaning: 'Japanese person', category: 'people' },
    { word: '大人気', reading: 'だいにんき', meaning: 'very popular', category: 'concept' },
    { word: '外国人', reading: 'がいこくじん', meaning: 'foreigner', category: 'people' },
    { word: '入学式', reading: 'にゅうがくしき', meaning: 'entrance ceremony', category: 'event' },
    { word: '卒業式', reading: 'そつぎょうしき', meaning: 'graduation', category: 'event' },
    { word: '天気予', reading: 'てんきよ', meaning: 'weather forecast', category: 'nature' },
    { word: '小学生', reading: 'しょうがくせい', meaning: 'elementary student', category: 'people' },
    { word: '中学生', reading: 'ちゅうがくせい', meaning: 'middle schooler', category: 'people' },
    { word: '大学生', reading: 'だいがくせい', meaning: 'university student', category: 'people' },
];

// All compound words combined for easy lookup
export const ALL_COMPOUND_WORDS = [...COMPOUND_WORDS_2, ...COMPOUND_WORDS_3];

// Create a quick lookup map
export const COMPOUND_WORD_MAP = new Map<string, CompoundWord>(
    ALL_COMPOUND_WORDS.map(w => [w.word, w])
);

// Get all unique kanji used in compound words
export function getUniqueKanji(): string[] {
    const kanjiSet = new Set<string>();
    ALL_COMPOUND_WORDS.forEach(w => {
        for (const char of w.word) {
            kanjiSet.add(char);
        }
    });
    return Array.from(kanjiSet);
}
