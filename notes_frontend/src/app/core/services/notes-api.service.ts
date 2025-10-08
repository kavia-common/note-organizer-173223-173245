import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Note, NoteQuery } from '../models/note.model';
import { Folder } from '../models/folder.model';
import { Tag } from '../models/tag.model';

/**
 * Simple in-memory store with localStorage persistence for Notes, Folders, and Tags.
 * Acts as a placeholder for a REST backend. Later, swap implementation with HttpClient.
 */
@Injectable({ providedIn: 'root' })
export class NotesApiService {
  private readonly STORAGE_KEY = 'notes_app_store_v1';

  private state$ = new BehaviorSubject<{
    notes: Note[];
    folders: Folder[];
    tags: Tag[];
  }>(this.loadInitial());

  private loadInitial(): { notes: Note[]; folders: Folder[]; tags: Tag[] } {
    try {
      const ls: any = (typeof globalThis !== 'undefined' && (globalThis as any).localStorage) ? (globalThis as any).localStorage : null;
      const raw = ls ? ls.getItem(this.STORAGE_KEY) : null;
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // ignore parse errors
    }
    const now = new Date().toISOString();
    // Seed minimal data
    const seedFolders: Folder[] = [
      { id: 'inbox', name: 'Inbox', createdAt: now, updatedAt: now },
      { id: 'work', name: 'Work', createdAt: now, updatedAt: now },
    ];
    const seedTags: Tag[] = [
      { id: 't1', name: 'Ideas', color: '#A78BFA', createdAt: now, updatedAt: now },
      { id: 't2', name: 'Todo', color: '#34D399', createdAt: now, updatedAt: now },
    ];
    const uuid = (() => {
      const g: any = typeof globalThis !== 'undefined' ? (globalThis as any) : {};
      if (g.crypto && typeof g.crypto.randomUUID === 'function') return g.crypto.randomUUID.bind(g.crypto);
      return () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    })();

    const seedNotes: Note[] = [
      {
        id: uuid(),
        title: 'Welcome to Ocean Notes',
        content: 'This is your first note. Use the + New button to create more!',
        folderId: 'inbox',
        tagIds: ['t1'],
        createdAt: now,
        updatedAt: now
      }
    ];
    const initial = { notes: seedNotes, folders: seedFolders, tags: seedTags };
    this.persist(initial);
    return initial;
  }

  private persist(state: { notes: Note[]; folders: Folder[]; tags: Tag[] }) {
    try {
      const ls: any = (typeof globalThis !== 'undefined' && (globalThis as any).localStorage) ? (globalThis as any).localStorage : null;
      if (ls) {
        ls.setItem(this.STORAGE_KEY, JSON.stringify(state));
      }
    } catch {
      // ignore, storage might be unavailable
    }
  }

  private nextState(mutator: (s: { notes: Note[]; folders: Folder[]; tags: Tag[] }) => void) {
    const copy = JSON.parse(JSON.stringify(this.state$.value));
    mutator(copy);
    this.persist(copy);
    this.state$.next(copy);
  }

  // PUBLIC_INTERFACE
  listNotes(query?: NoteQuery): Observable<Note[]> {
    /** Returns list of notes optionally filtered by search term, tag, or folder. */
    return this.state$.pipe(
      map(s => {
        let arr = [...s.notes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
        if (query?.search) {
          const q = query.search.toLowerCase();
          arr = arr.filter(n => n.title.toLowerCase().includes(q));
        }
        if (query?.tagId) {
          arr = arr.filter(n => n.tagIds?.includes(query.tagId!));
        }
        if (query?.folderId) {
          arr = arr.filter(n => n.folderId === query.folderId);
        }
        return arr;
      })
    );
  }

  // PUBLIC_INTERFACE
  getNote(id: string): Observable<Note | undefined> {
    /** Returns a note by id, or undefined if not found. */
    return this.state$.pipe(map(s => s.notes.find(n => n.id === id)));
  }

  // PUBLIC_INTERFACE
  createNote(partial: Pick<Note, 'title' | 'content' | 'folderId' | 'tagIds'>): Observable<Note> {
    /** Creates a new note in the store and returns it. */
    const now = new Date().toISOString();
    // Generate UUID using global crypto if available or fallback
    const g: any = typeof globalThis !== 'undefined' ? (globalThis as any) : {};
    const newId: string = g.crypto && typeof g.crypto.randomUUID === 'function'
      ? g.crypto.randomUUID()
      : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c: string) => {
          const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
    const note: Note = {
      id: newId,
      title: partial.title || 'Untitled',
      content: partial.content || '',
      folderId: partial.folderId ?? null,
      tagIds: partial.tagIds ?? [],
      createdAt: now,
      updatedAt: now
    };
    this.nextState(s => { s.notes.unshift(note); });
    return of(note);
  }

  // PUBLIC_INTERFACE
  updateNote(updated: Note): Observable<Note> {
    /** Updates an existing note and returns it. */
    const note = { ...updated, updatedAt: new Date().toISOString() };
    this.nextState(s => {
      const idx = s.notes.findIndex(n => n.id === note.id);
      if (idx !== -1) s.notes[idx] = note;
    });
    return of(note);
  }

  // PUBLIC_INTERFACE
  deleteNote(id: string): Observable<void> {
    /** Deletes a note by id. */
    this.nextState(s => { s.notes = s.notes.filter(n => n.id !== id); });
    return of(void 0);
  }

  // PUBLIC_INTERFACE
  listFolders(): Observable<Folder[]> {
    /** Lists all folders. */
    return this.state$.pipe(map(s => s.folders));
  }

  // PUBLIC_INTERFACE
  listTags(): Observable<Tag[]> {
    /** Lists all tags. */
    return this.state$.pipe(map(s => s.tags));
  }
}
