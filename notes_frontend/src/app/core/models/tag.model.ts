export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// PUBLIC_INTERFACE
export interface Tag extends BaseEntity {
  /** Display name for the tag. */
  name: string;
  /** Optional hex color for badge display. */
  color?: string;
}
