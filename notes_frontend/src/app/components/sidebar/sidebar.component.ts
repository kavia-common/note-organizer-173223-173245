import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Folder } from '../../core/models/folder.model';
import { Tag } from '../../core/models/tag.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() folders: Folder[] = [];
  @Input() tags: Tag[] = [];
  @Input() activeFolderId?: string;
  @Input() activeTagId?: string;

  @Output() folderSelected = new EventEmitter<string | undefined>();
  @Output() tagSelected = new EventEmitter<string | undefined>();

  selectFolder(id?: string) {
    this.folderSelected.emit(id);
  }

  selectTag(id?: string) {
    this.tagSelected.emit(id);
  }
}
