import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  // PUBLIC_INTERFACE
  onSearch(query: string) {
    /** Relay search from navbar to interested pages via a CustomEvent. */
    const g: any = typeof globalThis !== 'undefined' ? (globalThis as any) : null;
    if (g && g.dispatchEvent && g.CustomEvent) {
      g.dispatchEvent(new g.CustomEvent('app-search', { detail: query }));
    }
  }

  // PUBLIC_INTERFACE
  onCreate() {
    /** Relay create from navbar to interested pages via a CustomEvent. */
    const g: any = typeof globalThis !== 'undefined' ? (globalThis as any) : null;
    if (g && g.dispatchEvent && g.CustomEvent) {
      g.dispatchEvent(new g.CustomEvent('app-create'));
    }
  }

  // Optional: accessibility shortcut (Ctrl+K opens create)
  @HostListener('document:keydown.control.k', ['$event'])
  handleCtrlK(e: any) {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    this.onCreate();
  }
}
