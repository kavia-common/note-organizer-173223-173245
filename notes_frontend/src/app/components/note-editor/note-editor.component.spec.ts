import { TestBed } from '@angular/core/testing';
import { NoteEditorComponent } from './note-editor.component';

describe('NoteEditorComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteEditorComponent]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(NoteEditorComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
