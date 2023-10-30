declare interface NoteItem {
  id: string;
  type: "task" | "markdown";
  data: Task | Markdown;
}
