import { Routes } from '@angular/router';
import { NotesPageComponent } from './pages/notes/notes.page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'notes' },
  { path: 'notes', component: NotesPageComponent },
  { path: 'notes/:id', component: NotesPageComponent },
  { path: '**', redirectTo: 'notes' },
];
