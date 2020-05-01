import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargarFotoDialogComponent } from './cargar-foto-dialog.component';

describe('CargarFotoDialogComponent', () => {
  let component: CargarFotoDialogComponent;
  let fixture: ComponentFixture<CargarFotoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargarFotoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargarFotoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
