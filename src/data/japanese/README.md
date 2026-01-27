# Japanese Character Data

This folder contains a generated dataset of Japanese characters for downstream tooling.

- `characters.json` includes arrays for **hiragana**, **katakana**, and **kanji**.
- Kanji are generated from Unicode ranges (Unified Ideographs + Extensions A-F + Compatibility).
- `ranges` in the JSON describes the source ranges used during generation.

Regenerate with:

```bash
node scripts/generate-japanese-data.mjs
```
