import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditormdComponent } from './editormd.component';

describe('EditormdComponent', () => {
  let component: EditormdComponent;
  let fixture: ComponentFixture<EditormdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditormdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditormdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
