export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// PUBLIC_INTERFACE
export interface Note extends BaseEntity {
  /** Title string of the note. Used for listing and search. */
  title: string;
  /** Markdown or plain text content. */
  content: string;
  /** Optional folder ID that groups the note. */
  folderId?: string | null;
  /** Optional tags IDs applied to the note. */
  tagIds?: string[];
}

// PUBLIC_INTERFACE
export interface NoteQuery {
  /** Optional search term to match against title. */
  search?: string;
  /** Optional tag ID filter. */
  tagId?: string;
  /** Optional folder ID filter. */
  folderId?: string;
}
