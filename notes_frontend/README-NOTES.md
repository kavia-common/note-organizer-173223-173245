# Ocean Notes - Angular Frontend

This is a modern, responsive notes application UI built with Angular 19. It includes:
- Top navbar with app title, global search, and "New Note"
- Sidebar with Folders and Tags
- Notes list and an editor pane for viewing/editing a note
- CRUD using an in-memory store persisted to localStorage
- Theme: Ocean Professional (blue primary, amber accent, rounded corners, subtle shadows)

## Run locally

- Install dependencies and start dev server:
  npm install
  npm start

The app runs at http://localhost:3000 (as configured in angular.json).

## Project structure (key files)

- src/app/core/models/*: TypeScript interfaces (Note, Folder, Tag)
- src/app/core/services/notes-api.service.ts: REST-like abstraction using localStorage. Swap with HttpClient later.
- src/app/core/services/notes-state.service.ts: Coordinates filters and selected note with RxJS.
- src/app/components/*: Navbar, Sidebar, NotesList, NoteEditor
- src/app/pages/notes/*: Page composing the layout and wiring services
- src/app/app.routes.ts: Routes for /notes and /notes/:id
- src/styles.css: Global theme variables and utility styles

## Environment variables

None required. If a backend base URL is later introduced, use environment.ts and default to the local mock when empty.

## Swap to a real backend

Replace methods in NotesApiService with HttpClient REST calls. Keep the same method signatures:
- listNotes(query?)
- getNote(id)
- createNote(note)
- updateNote(note)
- deleteNote(id)
- listFolders()
- listTags()

Configure base URL via environment if provided, and keep a fallback to the in-memory store for development.

## Testing

Test stubs can be added under src/**/*.spec.ts for components and services.
