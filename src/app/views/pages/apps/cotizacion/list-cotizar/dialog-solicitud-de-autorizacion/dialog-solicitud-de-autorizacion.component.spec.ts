import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSolicitudDeAutorizacionComponent } from './dialog-solicitud-de-autorizacion.component';

describe('DialogSolicitudDeAutorizacionComponent', () => {
  let component: DialogSolicitudDeAutorizacionComponent;
  let fixture: ComponentFixture<DialogSolicitudDeAutorizacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogSolicitudDeAutorizacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSolicitudDeAutorizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
