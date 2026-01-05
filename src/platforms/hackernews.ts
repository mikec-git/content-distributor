import type { Platform, BlogPost, HackerNewsConfig } from '../types.js';

export class HackerNewsPlatform implements Platform {
  name = 'Hacker News';
  private config: HackerNewsConfig;

  constructor(config: HackerNewsConfig) {
    this.config = config;
  }

  async post(blogPost: BlogPost): Promise<void> {
    if (this.config.onlyProjects && !this.isProject(blogPost)) {
      console.log(`Skipping non-project post for HN: ${blogPost.title}`);
      return;
    }

    await this.submit(blogPost);
  }

  private isProject(post: BlogPost): boolean {
    const projectTags = ['project', 'launch', 'show-hn', 'release'];
    return post.tags?.some((tag) => projectTags.includes(tag.toLowerCase())) || false;
  }

  private async submit(post: BlogPost): Promise<void> {
    const username = process.env.HN_USERNAME;
    const password = process.env.HN_PASSWORD;

    if (!username || !password) {
      throw new Error('HN credentials not configured');
    }

    // Login to HN
    const loginResponse = await fetch('https://news.ycombinator.com/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        acct: username,
        pw: password,
        goto: 'submit',
      }),
      redirect: 'manual',
    });

    const cookies = loginResponse.headers.get('set-cookie');
    if (!cookies) {
      throw new Error('Failed to login to HN');
    }

    // Get submit page for FNID token
    const submitPageResponse = await fetch('https://news.ycombinator.com/submit', {
      headers: { Cookie: cookies },
    });
    const submitPage = await submitPageResponse.text();

    const fnidMatch = submitPage.match(/name="fnid" value="([^"]+)"/);
    if (!fnidMatch) {
      throw new Error('Could not find FNID token');
    }

    // Submit the post
    await fetch('https://news.ycombinator.com/r', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: cookies,
      },
      body: new URLSearchParams({
        fnid: fnidMatch[1],
        fnop: 'submit-page',
        title: post.title,
        url: post.url,
      }),
    });
  }
}
