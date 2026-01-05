import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import type { Config } from './types.js';

const defaultConfig: Config = {
  feed: {
    url: process.env.BLOG_FEED_URL || '',
    type: 'json',
    pollInterval: 300000,
  },
  twitter: {
    enabled: true,
    template: '{{title}} {{url}}',
    hashtags: [],
  },
  hackernews: {
    enabled: true,
    onlyProjects: true,
  },
};

export function loadConfig(): Config {
  const configPath = join(process.cwd(), 'config.json');

  if (!existsSync(configPath)) {
    return defaultConfig;
  }

  const fileConfig = JSON.parse(readFileSync(configPath, 'utf-8'));

  return {
    feed: { ...defaultConfig.feed, ...fileConfig.feed },
    twitter: { ...defaultConfig.twitter, ...fileConfig.twitter },
    hackernews: { ...defaultConfig.hackernews, ...fileConfig.hackernews },
  };
}
