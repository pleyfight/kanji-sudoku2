# Sentence Pools

This folder contains large sentence pools for expert puzzle generation/hints.

- `rows.json`: 40,000 unique 9-character sentences (row-direction pool).
- `columns.json`: 40,000 unique 9-character sentences (column-direction pool).
- Compressed copies are written to `public/data/sentences/*.json.gz` for offline use.

Regenerate with:

```bash
node scripts/generate-sentences.mjs
```

Validate with:

```bash
node scripts/validate-sentences.mjs
```

Download prebuilt compressed pools (optional):

```bash
POOL_BASE_URL=https://your-host/data npm run download:pools
```
