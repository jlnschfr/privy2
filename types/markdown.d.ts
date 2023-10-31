declare interface Markdown {
  id: string;
  type: "markdown";
  data: MarkdownData;
}

declare interface MarkdownData {
  text: string;
}
