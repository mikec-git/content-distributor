import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

export class Storage {
  private filePath: string;
  private posted: Set<string>;

  constructor(filePath?: string) {
    this.filePath = filePath || join(process.cwd(), 'data', 'posted.json');
    this.posted = this.load();
  }

  private load(): Set<string> {
    if (!existsSync(this.filePath)) {
      return new Set();
    }

    const data = JSON.parse(readFileSync(this.filePath, 'utf-8'));
    return new Set(data.posted || []);
  }

  private save() {
    const dir = dirname(this.filePath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    writeFileSync(
      this.filePath,
      JSON.stringify({ posted: Array.from(this.posted) }, null, 2)
    );
  }

  hasPosted(id: string): boolean {
    return this.posted.has(id);
  }

  markPosted(id: string) {
    this.posted.add(id);
    this.save();
  }
}
