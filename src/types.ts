export interface BlogPost {
  id: string;
  title: string;
  url: string;
  summary?: string;
  tags?: string[];
  publishedAt: Date;
}

export interface Platform {
  name: string;
  post(post: BlogPost): Promise<void>;
}

export interface FeedConfig {
  url: string;
  type: 'rss' | 'atom' | 'json';
  pollInterval: number;
}

export interface TwitterConfig {
  enabled: boolean;
  template: string;
  hashtags: string[];
}

export interface HackerNewsConfig {
  enabled: boolean;
  onlyProjects: boolean;
}

export interface Config {
  feed: FeedConfig;
  twitter: TwitterConfig;
  hackernews: HackerNewsConfig;
}
