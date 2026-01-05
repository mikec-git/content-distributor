# Content Distributor

RSS feed monitoring and cross-posting automation tool.

## Tech Stack

- TypeScript 5.3+ with strict mode
- Node.js (ES2022 target)
- Vitest for testing
- rss-parser for feed parsing
- twitter-api-v2 for Twitter integration

## Commands

```bash
npm run build    # Compile TypeScript
npm run start    # Run compiled app
npm run dev      # Watch mode with hot reload
npm run test     # Run tests
```

## Architecture

**Plugin-based platform system** - Abstract `Platform` interface with concrete implementations (Twitter, HackerNews). Add new platforms by implementing the interface.

**Event-driven** - `FeedWatcher` extends EventEmitter, emits `newPost` events for distribution.

**Configuration-driven** - Merges environment variables + config.json + defaults.

## Key Files

| File | Purpose |
|------|---------|
| `src/index.ts` | Entry point; initializes config, platforms, watcher |
| `src/types.ts` | Central type definitions (BlogPost, Platform, Config) |
| `src/config.ts` | Config loader with defaults |
| `src/feed/parser.ts` | RSS/Atom/JSON feed parsing |
| `src/feed/watcher.ts` | Polling and change detection |
| `src/platforms/` | Platform implementations |
| `src/utils/storage.ts` | Duplicate tracking (JSON file) |

## Code Style

- **Classes**: PascalCase (`FeedWatcher`, `TwitterPlatform`)
- **Methods**: camelCase (`formatTweet`, `hasPosted`)
- **Private methods**: underscore prefix (`_formatTweet`)
- One class per file
- Explicit type annotations on class properties
- Early returns for guard clauses
- Minimal inline comments - code should be self-documenting

## Error Handling

- Try-catch with console.error for async operations
- Non-blocking - one platform failure doesn't stop others
- Descriptive error messages

## Environment Variables

Required secrets (never commit):
- `TWITTER_API_KEY`, `TWITTER_API_SECRET`
- `TWITTER_ACCESS_TOKEN`, `TWITTER_ACCESS_SECRET`
- `HN_USERNAME`, `HN_PASSWORD`
- `BLOG_FEED_URL`

## Git Conventions

- Commit format: `[Type] Description`
- Types: Feature, Bugfix, Chore, Docs, Refactor
- Run tests before committing
