import { EventEmitter } from 'events';
import { FeedParser } from './parser.js';
import { Storage } from '../utils/storage.js';
import type { FeedConfig, BlogPost } from '../types.js';

export class FeedWatcher extends EventEmitter {
  private parser: FeedParser;
  private storage: Storage;
  private config: FeedConfig;
  private interval: NodeJS.Timeout | null = null;

  constructor(config: FeedConfig) {
    super();
    this.config = config;
    this.parser = new FeedParser(config);
    this.storage = new Storage();
  }

  start() {
    this.check();
    this.interval = setInterval(() => this.check(), this.config.pollInterval);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  private async check() {
    try {
      const posts = await this.parser.fetch();

      for (const post of posts) {
        if (!this.storage.hasPosted(post.id)) {
          this.emit('newPost', post);
          this.storage.markPosted(post.id);
        }
      }
    } catch (error) {
      console.error('Failed to check feed:', error);
    }
  }
}

declare module 'events' {
  interface EventEmitter {
    on(event: 'newPost', listener: (post: BlogPost) => void): this;
    emit(event: 'newPost', post: BlogPost): boolean;
  }
}
