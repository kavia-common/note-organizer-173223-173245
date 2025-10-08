export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// PUBLIC_INTERFACE
export interface Folder extends BaseEntity {
  /** Human readable folder name. */
  name: string;
}
