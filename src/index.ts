import 'dotenv/config';
import { loadConfig } from './config.js';
import { FeedWatcher } from './feed/watcher.js';
import { TwitterPlatform } from './platforms/twitter.js';
import { HackerNewsPlatform } from './platforms/hackernews.js';
import type { Platform, BlogPost } from './types.js';

async function main() {
  const config = loadConfig();
  const platforms: Platform[] = [];

  if (config.twitter.enabled) {
    platforms.push(new TwitterPlatform(config.twitter));
  }

  if (config.hackernews.enabled) {
    platforms.push(new HackerNewsPlatform(config.hackernews));
  }

  const watcher = new FeedWatcher(config.feed);

  watcher.on('newPost', async (post: BlogPost) => {
    console.log(`New post detected: ${post.title}`);

    for (const platform of platforms) {
      try {
        await platform.post(post);
        console.log(`Posted to ${platform.name}: ${post.title}`);
      } catch (error) {
        console.error(`Failed to post to ${platform.name}:`, error);
      }
    }
  });

  console.log('Content Distributor started');
  console.log(`Watching feed: ${config.feed.url}`);
  console.log(`Active platforms: ${platforms.map((p) => p.name).join(', ')}`);

  watcher.start();
}

main().catch(console.error);
