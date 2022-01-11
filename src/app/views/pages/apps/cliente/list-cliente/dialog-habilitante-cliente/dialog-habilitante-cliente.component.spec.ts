import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogHabilitanteClienteComponent } from './dialog-habilitante-cliente.component';

describe('DialogHabilitanteClienteComponent', () => {
  let component: DialogHabilitanteClienteComponent;
  let fixture: ComponentFixture<DialogHabilitanteClienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogHabilitanteClienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogHabilitanteClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
