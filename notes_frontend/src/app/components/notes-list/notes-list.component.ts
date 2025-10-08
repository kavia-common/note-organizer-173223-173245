import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Note } from '../../core/models/note.model';

@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notes-list.component.html',
  styleUrl: './notes-list.component.scss'
})
export class NotesListComponent {
  @Input() notes: Note[] = [];
  @Input() activeId: string | null = null;

  @Output() select = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();

  onSelect(id: string) {
    this.select.emit(id);
  }

  onDelete(id: string, ev: any) {
    ev.stopPropagation();
    this.delete.emit(id);
  }

  trackById(_i: number, n: Note) {
    return n.id;
  }
}
