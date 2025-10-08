import { TestBed } from '@angular/core/testing';
import { NotesListComponent } from './notes-list.component';

describe('NotesListComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotesListComponent]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(NotesListComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
