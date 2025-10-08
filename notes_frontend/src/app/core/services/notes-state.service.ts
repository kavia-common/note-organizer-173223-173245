import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { Note, NoteQuery } from '../models/note.model';
import { NotesApiService } from './notes-api.service';

/**
 * State manager for the Notes page: search, filters, and selected note id.
 */
@Injectable({ providedIn: 'root' })
export class NotesStateService {
  private search$ = new BehaviorSubject<string>('');
  private folderId$ = new BehaviorSubject<string | undefined>(undefined);
  private tagId$ = new BehaviorSubject<string | undefined>(undefined);
  private selectedId$ = new BehaviorSubject<string | null>(null);

  constructor(private api: NotesApiService) {}

  // PUBLIC_INTERFACE
  setSearch(q: string) {
    /** Set the current search filter. */
    this.search$.next(q);
  }

  // PUBLIC_INTERFACE
  setFolder(folderId?: string) {
    /** Set the current folder filter. */
    this.folderId$.next(folderId);
  }

  // PUBLIC_INTERFACE
  setTag(tagId?: string) {
    /** Set the current tag filter. */
    this.tagId$.next(tagId);
  }

  // PUBLIC_INTERFACE
  selectNote(id: string | null) {
    /** Set the currently selected note id. */
    this.selectedId$.next(id);
  }

  // PUBLIC_INTERFACE
  getSelectedId(): Observable<string | null> {
    /** Observe the currently selected note id. */
    return this.selectedId$.asObservable();
  }

  // PUBLIC_INTERFACE
  getFilteredNotes(): Observable<Note[]> {
    /** Observe notes filtered by the current query state. */
    return combineLatest([this.search$, this.folderId$, this.tagId$]).pipe(
      switchMap(([search, folderId, tagId]) => {
        const query: NoteQuery = { search: search || undefined, folderId, tagId };
        return this.api.listNotes(query);
      })
    );
  }
}
