export type KanjiSet = {
  id: string;
  name: string;
  description: string;
  items: string[]; // Must be exactly 9 characters
};

export const KANJI_SETS: KanjiSet[] = [
  {
    id: 'numbers',
    name: 'Numbers',
    description: 'Standard Japanese numerals.',
    items: ['一', '二', '三', '四', '五', '六', '七', '八', '九'],
  },
  {
    id: 'elements',
    name: 'Elements',
    description: 'Nature, elements, and humanity.',
    items: ['日', '月', '火', '水', '木', '金', '土', '天', '人'],
    // Sun, Moon, Fire, Water, Wood, Gold, Earth, Heaven, Person
  },
];

// Words that can be formed using the 'elements' set.
// This is a small subset for the prototype.
export const DICTIONARY: Record<string, string> = {
  '日月': 'Sun and Moon / Days and Months',
  '山水': 'Landscape (Mountain & Water)', // Wait, Mountain (山) isn't in set.
  '水木': 'Water and Wood / Wed & Thu',
  '土日': 'Weekend (Sat & Sun)',
  '天人': 'Heavenly Being / Celestial',
  '金土': 'Fri & Sat',
  '木造': 'Wooden', // No 'Make'
  '人工': 'Artificial', // No 'Craft'
  '人文': 'Humanities', // No 'Writing'
  '水火': 'Water and Fire',
  '月日': 'Time / Days',
  '天天': 'Every day',
  '人々': 'People',
};

// We need to ensure our dictionary only contains words formable by the set.
// '山' is not in elements. '人々' (People) requires repeating char, valid in Sudoku? 
// No, Sudoku rows have unique chars. So 'People' (Hitobito) is impossible in a single row/col.
// Filtered Dictionary for unique-char words:
export const VALID_WORDS = {
  '日月': 'Sun and Moon',
  '水火': 'Water and Fire',
  '土日': 'Weekend',
  '天人': 'Celestial Being',
  '月日': 'Time passing',
  '金土': 'Money and Earth', // A bit of a stretch, but literally Gold & Earth
  '水金': 'Water and Gold',
};
