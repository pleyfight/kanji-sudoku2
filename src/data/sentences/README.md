# Sentence Pools

This folder contains large sentence pools for expert puzzle generation/hints.

- `rows.json`: 40,000 unique 9-character strings (row-direction pool).
- `columns.json`: 40,000 unique 9-character strings (column-direction pool).

Regenerate with:

```bash
node scripts/generate-sentences.mjs
```

Validate with:

```bash
node scripts/validate-sentences.mjs
```
