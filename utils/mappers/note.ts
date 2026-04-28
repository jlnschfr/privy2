import type { Database } from "@/types/database.types";

type NoteRow = Database["public"]["Tables"]["notes"]["Row"];

function mapItems(raw: unknown): Item[] {
  if (!Array.isArray(raw)) {
    if (raw != null) {
      console.warn("[mapNoteRow] expected items to be an array, got:", typeof raw);
    }
    return [];
  }

  return raw.filter((entry): entry is Item => {
    if (
      entry !== null &&
      typeof entry === "object" &&
      (entry.type === "Markdown" || entry.type === "Task")
    ) {
      return true;
    }
    console.warn("[mapNoteRow] dropping item with unexpected shape:", entry);
    return false;
  });
}

function mapTags(raw: unknown): Tag[] {
  if (!Array.isArray(raw)) {
    if (raw != null) {
      console.warn("[mapNoteRow] expected tags to be an array, got:", typeof raw);
    }
    return [];
  }

  return raw.filter((entry): entry is Tag => {
    if (entry !== null && typeof entry === "object" && typeof entry.text === "string") {
      return true;
    }
    console.warn("[mapNoteRow] dropping tag with unexpected shape:", entry);
    return false;
  });
}

export function mapNoteRow(row: NoteRow): Note {
  return {
    id: row.id,
    created_at: row.created_at,
    edited_at: row.edited_at ?? row.created_at,
    title: row.title ?? "",
    favorite: row.favorite ?? false,
    user_id: row.user_id ?? "",
    items: mapItems(row.items),
    tags: mapTags(row.tags),
  };
}
