import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { NotesListComponent } from '../../components/notes-list/notes-list.component';
import { NoteEditorComponent } from '../../components/note-editor/note-editor.component';
import { NotesApiService } from '../../core/services/notes-api.service';
import { NotesStateService } from '../../core/services/notes-state.service';
import { Note } from '../../core/models/note.model';
import { Folder } from '../../core/models/folder.model';
import { Tag } from '../../core/models/tag.model';
import { Subscription, combineLatest } from 'rxjs';

@Component({
  selector: 'app-notes-page',
  standalone: true,
  imports: [CommonModule, SidebarComponent, NotesListComponent, NoteEditorComponent],
  templateUrl: './notes.page.html',
  styleUrl: './notes.page.scss'
})
export class NotesPageComponent implements OnInit, OnDestroy {
  folders: Folder[] = [];
  tags: Tag[] = [];
  notes: Note[] = [];
  selectedNote: Note | null = null;

  activeFolderId?: string;
  activeTagId?: string;

  private sub = new Subscription();

  constructor(
    private api: NotesApiService,
    private state: NotesStateService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Listen to global search/create events from navbar (browser only)
    const g: any = typeof globalThis !== 'undefined' ? (globalThis as any) : null;
    if (g && g.addEventListener && g.removeEventListener) {
      const onSearch = (e: any) => this.onSearch(e?.detail || '');
      const onCreate = (_e?: any) => this.onCreate();

      g.addEventListener('app-search' as any, onSearch as any);
      g.addEventListener('app-create' as any, onCreate as any);

      this.sub.add({
        unsubscribe() {
          g.removeEventListener('app-search' as any, onSearch as any);
          g.removeEventListener('app-create' as any, onCreate as any);
        }
      } as any);
    }
    this.sub.add(this.api.listFolders().subscribe(f => this.folders = f));
    this.sub.add(this.api.listTags().subscribe(t => this.tags = t));

    this.sub.add(this.state.getFilteredNotes().subscribe(arr => {
      this.notes = arr;
      // maintain selected note if filtered out, clear selection
      if (this.selectedNote && !arr.find(n => n.id === this.selectedNote!.id)) {
        this.selectedNote = null;
      }
    }));

    // Sync selection with route
    this.sub.add(
      combineLatest([this.route.paramMap, this.api.listNotes()]).subscribe(([params, all]) => {
        const id = params.get('id');
        if (id) {
          this.state.selectNote(id);
          this.selectedNote = all.find(n => n.id === id) ?? null;
        } else {
          this.state.selectNote(null);
          this.selectedNote = null;
        }
      })
    );
  }

  onSearch(q: string) {
    this.state.setSearch(q);
  }

  async onCreate() {
    const created = await this.api.createNote({
      title: 'Untitled',
      content: '',
      folderId: this.activeFolderId ?? null,
      tagIds: this.activeTagId ? [this.activeTagId] : []
    }).toPromise();
    if (created) {
      this.router.navigate(['/notes', created.id]);
    }
  }

  onSelectNote(id: string) {
    this.router.navigate(['/notes', id]);
  }

  onDeleteNote(id: string) {
    this.api.deleteNote(id).subscribe(() => {
      if (this.selectedNote?.id === id) {
        this.router.navigate(['/notes']);
      }
    });
  }

  onSaveNote(note: Note) {
    this.api.updateNote(note).subscribe(saved => {
      this.selectedNote = saved;
    });
  }

  onFolderSelected(folderId?: string) {
    this.activeFolderId = folderId;
    this.state.setFolder(folderId);
  }

  onTagSelected(tagId?: string) {
    this.activeTagId = tagId;
    this.state.setTag(tagId);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
