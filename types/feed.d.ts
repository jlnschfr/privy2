declare interface Feed {
  id?: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  url: string;
  data?: FeedData;
  created_items?: string[];
}

declare interface FeedData {
  items: FeedDataItem[];
  publisher: string;
  source: string;
  title: string;
  description: string;
  pubDate: string;
  link: string;
  language: string;
  copyright: string;
  lastBuildDate: string;
  docs: string;
  ttl: string;
}

declare interface FeedDataItem {
  date: string;
  title: string;
  link: string;
  pubDate: string;
  "content:encoded": string;
  "content:encodedSnippet": string;
  "dc:date": string;
  content: string;
  contentSnippet: string;
  guid: string;
  id: string;
  isoDate: string;
}
