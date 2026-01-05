# Content Distributor

Automatically cross-post blog content to Twitter and Hacker News.

## Features

- Monitors your blog's RSS/JSON feed for new posts
- Automatically posts to Twitter (X) with customizable formatting
- Submits new project announcements to Hacker News
- Configurable posting rules and scheduling
- Duplicate detection to prevent re-posting

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and configure your API keys
4. Configure `config.json` with your blog feed URL and posting preferences
5. Run with `npm start`

## Configuration

See [DOCS.md](./DOCS.md) for detailed configuration options.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `TWITTER_API_KEY` | Twitter API key |
| `TWITTER_API_SECRET` | Twitter API secret |
| `TWITTER_ACCESS_TOKEN` | Twitter access token |
| `TWITTER_ACCESS_SECRET` | Twitter access token secret |
| `HN_USERNAME` | Hacker News username |
| `HN_PASSWORD` | Hacker News password |

## License

MIT
