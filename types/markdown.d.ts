declare interface Markdown {
  id: string;
  type: "Markdown";
  data: MarkdownData;
}

declare interface MarkdownData {
  text: string;
}
