# Ocean Notes - Angular Frontend

This Angular app implements a notes UI with CRUD using an in-memory store (localStorage persisted) and follows the Ocean Professional theme.

Key features:
- Top navbar: app title, global search, New Note button
- Sidebar: Folders and Tags
- Main area: Notes list and Editor
- Routes: /notes, /notes/:id (default redirect to /notes)
- Responsive, accessible, modern styling

Getting started:
1) Install dependencies:
   npm install

2) Start dev server:
   npm start
   Open http://localhost:3000

3) Build for production:
   npm run build

Structure overview:
- src/app/core/models/*: Interfaces (Note, Folder, Tag)
- src/app/core/services/notes-api.service.ts: REST abstraction (in-memory/localStorage)
- src/app/core/services/notes-state.service.ts: Search/filter/selection coordination with RxJS
- src/app/components/*: Navbar, Sidebar, NotesList, NoteEditor
- src/app/pages/notes/*: Page composition and routing
- src/app/app.routes.ts: Route definitions
- src/styles.css: Global theme variables (Ocean Professional)

Swapping to a real backend:
- Replace NotesApiService methods with HttpClient calls to your REST API.
- Keep method signatures identical for easy replacement.
- Optionally use environment.ts for a BASE_URL. If not provided, default to in-memory store.

Tests:
- Basic spec stubs for services are included. Run:
  npm test
