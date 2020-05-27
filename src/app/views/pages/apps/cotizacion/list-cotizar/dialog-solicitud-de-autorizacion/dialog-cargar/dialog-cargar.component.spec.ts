import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCargarComponent } from './dialog-cargar.component';

describe('DialogCargarComponent', () => {
  let component: DialogCargarComponent;
  let fixture: ComponentFixture<DialogCargarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogCargarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCargarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
