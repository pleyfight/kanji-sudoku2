# 漢字数独 (Kanji Sudoku)

A modern Japanese Kanji-based Sudoku puzzle game built with React, TypeScript, and Vite.

![Kanji Sudoku Game](./screenshot.png)

## Features

### 🎮 Core Gameplay
- **9×9 Sudoku Grid** with Japanese Kanji instead of numbers
- **Multiple Kanji Sets** based on themes (Nature, Time, People, Directions, etc.)
- **Word Detection** - Form valid Japanese compound words horizontally or vertically
- **Reading Direction Support** - Words detected in rows (left-to-right) and columns (top-to-bottom)

### 📊 Game Mechanics
- **Timer** with pause/resume functionality
- **Scoring System**:
  - Points for correct cell placement
  - Bonus points for forming compound words
  - Time-based bonuses
  - Difficulty multipliers
- **Four Difficulty Levels**:
  - **Easy**: 30 cells removed, button input only, 10 hints
  - **Medium**: 45 cells removed, 5 hints
  - **Hard**: 55 cells removed, button input only, 3 hints
  - **Expert**: 9?9 word-square mode, keyboard input, limited reveals

### 💡 Hint System (Meaning-Based)
- Hints show the **meaning** of the expected word, not the answer
- Displays English definition and Japanese reading
- Limited hints per game (based on difficulty)
- Using hints reduces your score

### 🌐 Bilingual Support
- Toggle between **English** and **Japanese** UI
- All labels, messages, and hints available in both languages

### ⌨️ Input Methods
- **Button Input**: Click Kanji buttons to input values
- **Keyboard Input** (Expert mode): Type Japanese characters directly using your keyboard/IME
- **Keyboard Shortcuts**:
  - `1-9`: Input value at selected cell
  - `Delete/Backspace`: Clear selected cell
  - `N`: Toggle note mode
  - `H`: Request hint

### 📝 Note Mode
- Toggle note mode to add multiple candidates to empty cells
- Notes display as small Kanji in a 3×3 grid within the cell

### 🏆 Victory Screen
- Celebration modal when puzzle is completed
- Final score display
- Time elapsed
- Words found count
- Option to start a new game

## Vocabulary

The game includes **150+ Japanese compound words** organized by category:
- **Time**: 今日 (today), 土日 (weekend), 朝日 (morning sun)
- **Nature**: 火山 (volcano), 花火 (fireworks), 青空 (blue sky)
- **People**: 大人 (adult), 友人 (friend), 先生 (teacher)
- **Directions**: 上下 (up/down), 東西 (east/west)
- **Concepts**: 人生 (life), 世界 (world), 意味 (meaning)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd japanese-sudoku

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview  # Preview production build
```

### Data pools (compressed)

```bash
# Package local puzzle + sentence pools into gzip files
npm run package:pools

# Download prebuilt pools from a hosted base URL
POOL_BASE_URL=https://your-host/data npm run download:pools
```

Compressed pools are written to `public/data/puzzles/*.json.gz` and
`public/data/sentences/*.json.gz`.

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Custom Fonts**: Zen Old Mincho (serif), Zen Kaku Gothic New (sans-serif)

## Project Structure

```
src/
├── components/
│   ├── Cell.tsx           # Individual Sudoku cell
│   ├── Controls.tsx       # Input buttons and controls
│   ├── HintModal.tsx      # Hint display modal
│   ├── LanguageToggle.tsx # EN/JP language switch
│   ├── ScoreBoard.tsx     # Score and stats display
│   ├── Timer.tsx          # Game timer
│   ├── VictoryModal.tsx   # Win celebration modal
│   └── WordList.tsx       # Found words panel
├── data/
│   ├── compoundWords.ts   # 150+ compound words database
│   ├── vocabulary.ts      # Base vocabulary (~200 words)
│   └── vocabularyExtended.ts # Extended vocabulary
├── lib/
│   ├── boardGenerator.ts  # Board generation with word constraints
│   └── gameState.ts       # Game state management hook
├── App.tsx                # Main application
└── main.tsx              # Entry point
```

## How to Play

1. **Select Difficulty** - Choose Easy, Medium, or Hard
2. **Click a Cell** - Select an empty cell on the board
3. **Input a Kanji** - Click a Kanji button or use keyboard (Hard mode)
4. **Form Words** - Try to form valid compound words in rows or columns
5. **Use Hints Wisely** - Hints show meanings, not answers
6. **Complete the Board** - Fill all cells correctly to win!

## Game Rules

1. Each row must contain all 9 unique Kanji exactly once
2. Each column must contain all 9 unique Kanji exactly once
3. Each 3×3 box must contain all 9 unique Kanji exactly once
4. The same Kanji cannot appear twice in the same row, column, or box
5. Expert mode is a word-square: rows and columns are full 9-character sentences (Sudoku uniqueness rules do not apply).

## Scoring

| Action | Points |
|--------|--------|
| Correct cell (Easy) | 10 |
| Correct cell (Medium) | 20 |
| Correct cell (Hard) | 30 |
| 2-kanji word bonus | 50 |
| 3-kanji word bonus | 100 |
| 4+ kanji word bonus | 200 |
| Using a hint | -25 |
| Time bonus (under threshold) | +100 to +500 |

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
