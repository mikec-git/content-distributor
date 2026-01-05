# Content Distributor - Documentation

## Architecture

```
src/
  index.ts          # Entry point
  config.ts         # Configuration loader
  feed/
    parser.ts       # RSS/JSON feed parser
    watcher.ts      # Feed polling/watching logic
  platforms/
    twitter.ts      # Twitter API integration
    hackernews.ts   # Hacker News submission
  utils/
    formatter.ts    # Content formatting utilities
    storage.ts      # Track posted content
```

## Flow

1. **Feed Watching**: The watcher polls your blog feed at configured intervals
2. **New Post Detection**: Compares feed items against stored history
3. **Content Formatting**: Transforms blog post into platform-specific formats
4. **Distribution**: Posts to configured platforms with rate limiting
5. **Storage**: Records posted items to prevent duplicates

## Configuration Options

### config.json

```json
{
  "feed": {
    "url": "https://yourblog.com/feed.json",
    "type": "json",
    "pollInterval": 300000
  },
  "twitter": {
    "enabled": true,
    "template": "{{title}} - {{url}}",
    "hashtags": ["tech", "blog"]
  },
  "hackernews": {
    "enabled": true,
    "onlyProjects": true
  }
}
```

### Feed Types

- `rss` - Standard RSS 2.0 feed
- `atom` - Atom feed format
- `json` - JSON Feed format (recommended for static sites)

## Platform-Specific Notes

### Twitter

- Uses Twitter API v2
- Requires Elevated access for posting
- Respects rate limits automatically

### Hacker News

- Submits via web scraping (no official API)
- Only submits posts tagged as "project" or "launch"
- Includes basic duplicate detection on HN side

## Extending

To add a new platform:

1. Create a new file in `src/platforms/`
2. Implement the `Platform` interface
3. Register in `src/platforms/index.ts`
4. Add configuration options to schema
