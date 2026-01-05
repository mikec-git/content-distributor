import { TwitterApi } from 'twitter-api-v2';
import type { Platform, BlogPost, TwitterConfig } from '../types.js';

export class TwitterPlatform implements Platform {
  name = 'Twitter';
  private client: TwitterApi;
  private config: TwitterConfig;

  constructor(config: TwitterConfig) {
    this.config = config;
    this.client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY!,
      appSecret: process.env.TWITTER_API_SECRET!,
      accessToken: process.env.TWITTER_ACCESS_TOKEN!,
      accessSecret: process.env.TWITTER_ACCESS_SECRET!,
    });
  }

  async post(blogPost: BlogPost): Promise<void> {
    const text = this.formatTweet(blogPost);
    await this.client.v2.tweet(text);
  }

  private formatTweet(post: BlogPost): string {
    let text = this.config.template
      .replace('{{title}}', post.title)
      .replace('{{url}}', post.url)
      .replace('{{summary}}', post.summary || '');

    if (this.config.hashtags.length > 0) {
      const hashtags = this.config.hashtags.map((tag) => `#${tag}`).join(' ');
      text = `${text} ${hashtags}`;
    }

    if (text.length > 280) {
      text = text.slice(0, 277) + '...';
    }

    return text;
  }
}
