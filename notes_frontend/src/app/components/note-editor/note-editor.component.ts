import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Note } from '../../core/models/note.model';
import { Folder } from '../../core/models/folder.model';
import { Tag } from '../../core/models/tag.model';

@Component({
  selector: 'app-note-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './note-editor.component.html',
  styleUrl: './note-editor.component.scss'
})
export class NoteEditorComponent implements OnChanges {
  @Input() note?: Note | null;
  @Input() folders: Folder[] = [];
  @Input() tags: Tag[] = [];

  @Output() save = new EventEmitter<Note>();
  @Output() delete = new EventEmitter<string>();

  draft: Note | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['note']) {
      this.draft = this.note ? { ...this.note } : null;
    }
  }

  onSave() {
    if (this.draft) {
      this.save.emit({ ...this.draft });
    }
  }

  onDelete() {
    if (this.draft?.id) {
      this.delete.emit(this.draft.id);
    }
  }

  toggleTag(tagId: string) {
    if (!this.draft) return;
    const set = new Set(this.draft.tagIds ?? []);
    if (set.has(tagId)) set.delete(tagId); else set.add(tagId);
    this.draft.tagIds = Array.from(set);
  }

  isTagActive(tagId: string) {
    return !!this.draft?.tagIds?.includes(tagId);
  }
}
