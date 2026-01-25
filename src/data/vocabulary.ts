// Vocabulary Database - Types and Core Structure
// This file defines the vocabulary system for Kanji Sudoku

export interface Word {
  kanji: string;      // Kanji form
  reading: string;    // Hiragana reading
  meaning: string;    // English meaning
  pos: PartOfSpeech;  // Part of speech
  jlpt: number;       // JLPT level (5=easiest, 1=hardest)
}

export type PartOfSpeech = 
  | 'noun' | 'verb' | 'adjective' | 'adverb' 
  | 'particle' | 'counter' | 'expression';

export interface Particle {
  kana: string;
  meaning: string;
  usage: string;
}

// Common Japanese particles
export const PARTICLES: Particle[] = [
  { kana: 'は', meaning: 'topic marker', usage: 'marks the topic of sentence' },
  { kana: 'が', meaning: 'subject marker', usage: 'marks the subject' },
  { kana: 'を', meaning: 'object marker', usage: 'marks direct object' },
  { kana: 'に', meaning: 'to/at/in', usage: 'direction, location, time' },
  { kana: 'で', meaning: 'at/by/with', usage: 'location of action, means' },
  { kana: 'と', meaning: 'and/with', usage: 'listing, together with' },
  { kana: 'も', meaning: 'also/too', usage: 'inclusion' },
  { kana: 'の', meaning: 'of/possessive', usage: 'possession, connection' },
  { kana: 'から', meaning: 'from', usage: 'starting point' },
  { kana: 'まで', meaning: 'until/to', usage: 'ending point' },
];

// Vocabulary organized by category - Part 1: Common Words (JLPT N5-N4)
export const VOCABULARY_BASIC: Word[] = [
  // Time
  { kanji: '日', reading: 'ひ', meaning: 'day/sun', pos: 'noun', jlpt: 5 },
  { kanji: '月', reading: 'つき', meaning: 'moon/month', pos: 'noun', jlpt: 5 },
  { kanji: '火', reading: 'ひ', meaning: 'fire', pos: 'noun', jlpt: 5 },
  { kanji: '水', reading: 'みず', meaning: 'water', pos: 'noun', jlpt: 5 },
  { kanji: '木', reading: 'き', meaning: 'tree/wood', pos: 'noun', jlpt: 5 },
  { kanji: '金', reading: 'かね', meaning: 'money/gold', pos: 'noun', jlpt: 5 },
  { kanji: '土', reading: 'つち', meaning: 'earth/soil', pos: 'noun', jlpt: 5 },
  { kanji: '天', reading: 'てん', meaning: 'heaven/sky', pos: 'noun', jlpt: 4 },
  { kanji: '人', reading: 'ひと', meaning: 'person', pos: 'noun', jlpt: 5 },
  { kanji: '年', reading: 'とし', meaning: 'year', pos: 'noun', jlpt: 5 },
  { kanji: '時', reading: 'とき', meaning: 'time', pos: 'noun', jlpt: 5 },
  { kanji: '今', reading: 'いま', meaning: 'now', pos: 'noun', jlpt: 5 },
  { kanji: '前', reading: 'まえ', meaning: 'before/front', pos: 'noun', jlpt: 5 },
  { kanji: '後', reading: 'あと', meaning: 'after/behind', pos: 'noun', jlpt: 5 },
  { kanji: '間', reading: 'あいだ', meaning: 'between/interval', pos: 'noun', jlpt: 5 },
  { kanji: '朝', reading: 'あさ', meaning: 'morning', pos: 'noun', jlpt: 5 },
  { kanji: '昼', reading: 'ひる', meaning: 'noon/daytime', pos: 'noun', jlpt: 5 },
  { kanji: '夜', reading: 'よる', meaning: 'night', pos: 'noun', jlpt: 5 },
  { kanji: '週', reading: 'しゅう', meaning: 'week', pos: 'noun', jlpt: 5 },
  
  // Numbers
  { kanji: '一', reading: 'いち', meaning: 'one', pos: 'noun', jlpt: 5 },
  { kanji: '二', reading: 'に', meaning: 'two', pos: 'noun', jlpt: 5 },
  { kanji: '三', reading: 'さん', meaning: 'three', pos: 'noun', jlpt: 5 },
  { kanji: '四', reading: 'よん', meaning: 'four', pos: 'noun', jlpt: 5 },
  { kanji: '五', reading: 'ご', meaning: 'five', pos: 'noun', jlpt: 5 },
  { kanji: '六', reading: 'ろく', meaning: 'six', pos: 'noun', jlpt: 5 },
  { kanji: '七', reading: 'なな', meaning: 'seven', pos: 'noun', jlpt: 5 },
  { kanji: '八', reading: 'はち', meaning: 'eight', pos: 'noun', jlpt: 5 },
  { kanji: '九', reading: 'きゅう', meaning: 'nine', pos: 'noun', jlpt: 5 },
  { kanji: '十', reading: 'じゅう', meaning: 'ten', pos: 'noun', jlpt: 5 },
  { kanji: '百', reading: 'ひゃく', meaning: 'hundred', pos: 'noun', jlpt: 5 },
  { kanji: '千', reading: 'せん', meaning: 'thousand', pos: 'noun', jlpt: 5 },
  { kanji: '万', reading: 'まん', meaning: 'ten thousand', pos: 'noun', jlpt: 5 },
  
  // People & Body
  { kanji: '男', reading: 'おとこ', meaning: 'man', pos: 'noun', jlpt: 5 },
  { kanji: '女', reading: 'おんな', meaning: 'woman', pos: 'noun', jlpt: 5 },
  { kanji: '子', reading: 'こ', meaning: 'child', pos: 'noun', jlpt: 5 },
  { kanji: '父', reading: 'ちち', meaning: 'father', pos: 'noun', jlpt: 5 },
  { kanji: '母', reading: 'はは', meaning: 'mother', pos: 'noun', jlpt: 5 },
  { kanji: '友', reading: 'とも', meaning: 'friend', pos: 'noun', jlpt: 5 },
  { kanji: '先', reading: 'さき', meaning: 'ahead/previous', pos: 'noun', jlpt: 5 },
  { kanji: '生', reading: 'せい', meaning: 'life/birth', pos: 'noun', jlpt: 5 },
  { kanji: '目', reading: 'め', meaning: 'eye', pos: 'noun', jlpt: 5 },
  { kanji: '耳', reading: 'みみ', meaning: 'ear', pos: 'noun', jlpt: 5 },
  { kanji: '口', reading: 'くち', meaning: 'mouth', pos: 'noun', jlpt: 5 },
  { kanji: '手', reading: 'て', meaning: 'hand', pos: 'noun', jlpt: 5 },
  { kanji: '足', reading: 'あし', meaning: 'foot/leg', pos: 'noun', jlpt: 5 },
  { kanji: '心', reading: 'こころ', meaning: 'heart/mind', pos: 'noun', jlpt: 4 },
  { kanji: '体', reading: 'からだ', meaning: 'body', pos: 'noun', jlpt: 4 },
  { kanji: '頭', reading: 'あたま', meaning: 'head', pos: 'noun', jlpt: 4 },
  
  // Nature
  { kanji: '山', reading: 'やま', meaning: 'mountain', pos: 'noun', jlpt: 5 },
  { kanji: '川', reading: 'かわ', meaning: 'river', pos: 'noun', jlpt: 5 },
  { kanji: '海', reading: 'うみ', meaning: 'sea', pos: 'noun', jlpt: 5 },
  { kanji: '空', reading: 'そら', meaning: 'sky', pos: 'noun', jlpt: 5 },
  { kanji: '雨', reading: 'あめ', meaning: 'rain', pos: 'noun', jlpt: 5 },
  { kanji: '風', reading: 'かぜ', meaning: 'wind', pos: 'noun', jlpt: 5 },
  { kanji: '雪', reading: 'ゆき', meaning: 'snow', pos: 'noun', jlpt: 5 },
  { kanji: '花', reading: 'はな', meaning: 'flower', pos: 'noun', jlpt: 5 },
  { kanji: '草', reading: 'くさ', meaning: 'grass', pos: 'noun', jlpt: 4 },
  { kanji: '森', reading: 'もり', meaning: 'forest', pos: 'noun', jlpt: 4 },
  { kanji: '林', reading: 'はやし', meaning: 'grove', pos: 'noun', jlpt: 4 },
  { kanji: '石', reading: 'いし', meaning: 'stone', pos: 'noun', jlpt: 4 },
  { kanji: '光', reading: 'ひかり', meaning: 'light', pos: 'noun', jlpt: 4 },
  { kanji: '星', reading: 'ほし', meaning: 'star', pos: 'noun', jlpt: 4 },
  
  // Places
  { kanji: '国', reading: 'くに', meaning: 'country', pos: 'noun', jlpt: 5 },
  { kanji: '町', reading: 'まち', meaning: 'town', pos: 'noun', jlpt: 5 },
  { kanji: '村', reading: 'むら', meaning: 'village', pos: 'noun', jlpt: 4 },
  { kanji: '家', reading: 'いえ', meaning: 'house', pos: 'noun', jlpt: 5 },
  { kanji: '店', reading: 'みせ', meaning: 'shop', pos: 'noun', jlpt: 5 },
  { kanji: '駅', reading: 'えき', meaning: 'station', pos: 'noun', jlpt: 5 },
  { kanji: '道', reading: 'みち', meaning: 'road/way', pos: 'noun', jlpt: 5 },
  { kanji: '門', reading: 'もん', meaning: 'gate', pos: 'noun', jlpt: 4 },
  { kanji: '室', reading: 'しつ', meaning: 'room', pos: 'noun', jlpt: 4 },
  { kanji: '部', reading: 'ぶ', meaning: 'section/club', pos: 'noun', jlpt: 4 },
  { kanji: '場', reading: 'ば', meaning: 'place', pos: 'noun', jlpt: 4 },
  { kanji: '所', reading: 'ところ', meaning: 'place/spot', pos: 'noun', jlpt: 5 },
  
  // Objects
  { kanji: '本', reading: 'ほん', meaning: 'book', pos: 'noun', jlpt: 5 },
  { kanji: '車', reading: 'くるま', meaning: 'car', pos: 'noun', jlpt: 5 },
  { kanji: '電', reading: 'でん', meaning: 'electricity', pos: 'noun', jlpt: 5 },
  { kanji: '話', reading: 'はなし', meaning: 'talk/story', pos: 'noun', jlpt: 5 },
  { kanji: '物', reading: 'もの', meaning: 'thing', pos: 'noun', jlpt: 5 },
  { kanji: '食', reading: 'しょく', meaning: 'food/eating', pos: 'noun', jlpt: 5 },
  { kanji: '飲', reading: 'いん', meaning: 'drink', pos: 'noun', jlpt: 5 },
  { kanji: '紙', reading: 'かみ', meaning: 'paper', pos: 'noun', jlpt: 4 },
  { kanji: '刀', reading: 'かたな', meaning: 'sword', pos: 'noun', jlpt: 3 },
  { kanji: '船', reading: 'ふね', meaning: 'ship', pos: 'noun', jlpt: 4 },
  
  // Actions (Verbs)
  { kanji: '行', reading: 'い', meaning: 'go', pos: 'verb', jlpt: 5 },
  { kanji: '来', reading: 'く', meaning: 'come', pos: 'verb', jlpt: 5 },
  { kanji: '見', reading: 'み', meaning: 'see/look', pos: 'verb', jlpt: 5 },
  { kanji: '聞', reading: 'き', meaning: 'hear/ask', pos: 'verb', jlpt: 5 },
  { kanji: '読', reading: 'よ', meaning: 'read', pos: 'verb', jlpt: 5 },
  { kanji: '書', reading: 'か', meaning: 'write', pos: 'verb', jlpt: 5 },
  { kanji: '言', reading: 'い', meaning: 'say', pos: 'verb', jlpt: 5 },
  { kanji: '思', reading: 'おも', meaning: 'think', pos: 'verb', jlpt: 4 },
  { kanji: '知', reading: 'し', meaning: 'know', pos: 'verb', jlpt: 4 },
  { kanji: '作', reading: 'つく', meaning: 'make', pos: 'verb', jlpt: 4 },
  { kanji: '使', reading: 'つか', meaning: 'use', pos: 'verb', jlpt: 4 },
  { kanji: '持', reading: 'も', meaning: 'hold/have', pos: 'verb', jlpt: 4 },
  { kanji: '待', reading: 'ま', meaning: 'wait', pos: 'verb', jlpt: 4 },
  { kanji: '買', reading: 'か', meaning: 'buy', pos: 'verb', jlpt: 5 },
  { kanji: '売', reading: 'う', meaning: 'sell', pos: 'verb', jlpt: 4 },
  { kanji: '立', reading: 'た', meaning: 'stand', pos: 'verb', jlpt: 4 },
  { kanji: '座', reading: 'すわ', meaning: 'sit', pos: 'verb', jlpt: 4 },
  { kanji: '走', reading: 'はし', meaning: 'run', pos: 'verb', jlpt: 4 },
  { kanji: '歩', reading: 'あゆ', meaning: 'walk', pos: 'verb', jlpt: 4 },
  { kanji: '入', reading: 'はい', meaning: 'enter', pos: 'verb', jlpt: 5 },
  { kanji: '出', reading: 'で', meaning: 'exit/leave', pos: 'verb', jlpt: 5 },
  { kanji: '開', reading: 'あ', meaning: 'open', pos: 'verb', jlpt: 4 },
  { kanji: '閉', reading: 'し', meaning: 'close', pos: 'verb', jlpt: 4 },
  { kanji: '始', reading: 'はじ', meaning: 'begin', pos: 'verb', jlpt: 4 },
  { kanji: '終', reading: 'お', meaning: 'end', pos: 'verb', jlpt: 4 },
  
  // Adjectives
  { kanji: '大', reading: 'おお', meaning: 'big', pos: 'adjective', jlpt: 5 },
  { kanji: '小', reading: 'ちい', meaning: 'small', pos: 'adjective', jlpt: 5 },
  { kanji: '長', reading: 'なが', meaning: 'long', pos: 'adjective', jlpt: 5 },
  { kanji: '短', reading: 'みじか', meaning: 'short', pos: 'adjective', jlpt: 4 },
  { kanji: '高', reading: 'たか', meaning: 'high/tall', pos: 'adjective', jlpt: 5 },
  { kanji: '低', reading: 'ひく', meaning: 'low', pos: 'adjective', jlpt: 4 },
  { kanji: '新', reading: 'あたら', meaning: 'new', pos: 'adjective', jlpt: 5 },
  { kanji: '古', reading: 'ふる', meaning: 'old', pos: 'adjective', jlpt: 5 },
  { kanji: '多', reading: 'おお', meaning: 'many', pos: 'adjective', jlpt: 5 },
  { kanji: '少', reading: 'すく', meaning: 'few', pos: 'adjective', jlpt: 5 },
  { kanji: '強', reading: 'つよ', meaning: 'strong', pos: 'adjective', jlpt: 4 },
  { kanji: '弱', reading: 'よわ', meaning: 'weak', pos: 'adjective', jlpt: 4 },
  { kanji: '早', reading: 'はや', meaning: 'early/fast', pos: 'adjective', jlpt: 5 },
  { kanji: '遅', reading: 'おそ', meaning: 'late/slow', pos: 'adjective', jlpt: 4 },
  { kanji: '明', reading: 'あか', meaning: 'bright', pos: 'adjective', jlpt: 4 },
  { kanji: '暗', reading: 'くら', meaning: 'dark', pos: 'adjective', jlpt: 4 },
  { kanji: '白', reading: 'しろ', meaning: 'white', pos: 'adjective', jlpt: 5 },
  { kanji: '黒', reading: 'くろ', meaning: 'black', pos: 'adjective', jlpt: 5 },
  { kanji: '赤', reading: 'あか', meaning: 'red', pos: 'adjective', jlpt: 5 },
  { kanji: '青', reading: 'あお', meaning: 'blue', pos: 'adjective', jlpt: 5 },
  { kanji: '良', reading: 'よ', meaning: 'good', pos: 'adjective', jlpt: 4 },
  { kanji: '悪', reading: 'わる', meaning: 'bad', pos: 'adjective', jlpt: 4 },
  { kanji: '熱', reading: 'あつ', meaning: 'hot', pos: 'adjective', jlpt: 4 },
  { kanji: '冷', reading: 'つめ', meaning: 'cold', pos: 'adjective', jlpt: 4 },
  { kanji: '楽', reading: 'たの', meaning: 'fun/easy', pos: 'adjective', jlpt: 4 },
  { kanji: '難', reading: 'むずか', meaning: 'difficult', pos: 'adjective', jlpt: 3 },
  { kanji: '美', reading: 'うつく', meaning: 'beautiful', pos: 'adjective', jlpt: 3 },
  { kanji: '若', reading: 'わか', meaning: 'young', pos: 'adjective', jlpt: 4 },
  
  // Direction/Position
  { kanji: '上', reading: 'うえ', meaning: 'up/above', pos: 'noun', jlpt: 5 },
  { kanji: '下', reading: 'した', meaning: 'down/below', pos: 'noun', jlpt: 5 },
  { kanji: '左', reading: 'ひだり', meaning: 'left', pos: 'noun', jlpt: 5 },
  { kanji: '右', reading: 'みぎ', meaning: 'right', pos: 'noun', jlpt: 5 },
  { kanji: '中', reading: 'なか', meaning: 'inside/middle', pos: 'noun', jlpt: 5 },
  { kanji: '外', reading: 'そと', meaning: 'outside', pos: 'noun', jlpt: 5 },
  { kanji: '北', reading: 'きた', meaning: 'north', pos: 'noun', jlpt: 5 },
  { kanji: '南', reading: 'みなみ', meaning: 'south', pos: 'noun', jlpt: 5 },
  { kanji: '東', reading: 'ひがし', meaning: 'east', pos: 'noun', jlpt: 5 },
  { kanji: '西', reading: 'にし', meaning: 'west', pos: 'noun', jlpt: 5 },
  
  // Education/Work
  { kanji: '学', reading: 'がく', meaning: 'study', pos: 'noun', jlpt: 5 },
  { kanji: '校', reading: 'こう', meaning: 'school', pos: 'noun', jlpt: 5 },
  { kanji: '教', reading: 'おし', meaning: 'teach', pos: 'verb', jlpt: 4 },
  { kanji: '習', reading: 'なら', meaning: 'learn', pos: 'verb', jlpt: 4 },
  { kanji: '会', reading: 'かい', meaning: 'meeting', pos: 'noun', jlpt: 5 },
  { kanji: '社', reading: 'しゃ', meaning: 'company', pos: 'noun', jlpt: 4 },
  { kanji: '仕', reading: 'し', meaning: 'serve', pos: 'noun', jlpt: 4 },
  { kanji: '事', reading: 'こと', meaning: 'thing/matter', pos: 'noun', jlpt: 5 },
  { kanji: '業', reading: 'ぎょう', meaning: 'business', pos: 'noun', jlpt: 3 },
  { kanji: '働', reading: 'はたら', meaning: 'work', pos: 'verb', jlpt: 4 },
];
