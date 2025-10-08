import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  query = '';
  @Output() search = new EventEmitter<string>();
  @Output() create = new EventEmitter<void>();

  onSearch() {
    this.search.emit(this.query.trim());
  }

  onCreate() {
    this.create.emit();
  }
}
