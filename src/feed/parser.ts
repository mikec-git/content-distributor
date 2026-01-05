import Parser from 'rss-parser';
import type { FeedConfig, BlogPost } from '../types.js';

interface JsonFeedItem {
  id: string;
  title: string;
  url: string;
  summary?: string;
  tags?: string[];
  date_published?: string;
}

interface JsonFeed {
  items: JsonFeedItem[];
}

export class FeedParser {
  private config: FeedConfig;
  private rssParser: Parser;

  constructor(config: FeedConfig) {
    this.config = config;
    this.rssParser = new Parser();
  }

  async fetch(): Promise<BlogPost[]> {
    if (this.config.type === 'json') {
      return this.fetchJson();
    }

    return this.fetchRss();
  }

  private async fetchJson(): Promise<BlogPost[]> {
    const response = await fetch(this.config.url);
    const feed: JsonFeed = await response.json();

    return feed.items.map((item) => ({
      id: item.id,
      title: item.title,
      url: item.url,
      summary: item.summary,
      tags: item.tags,
      publishedAt: new Date(item.date_published || Date.now()),
    }));
  }

  private async fetchRss(): Promise<BlogPost[]> {
    const feed = await this.rssParser.parseURL(this.config.url);

    return feed.items.map((item) => ({
      id: item.guid || item.link || item.title || '',
      title: item.title || '',
      url: item.link || '',
      summary: item.contentSnippet,
      tags: item.categories,
      publishedAt: new Date(item.pubDate || Date.now()),
    }));
  }
}
