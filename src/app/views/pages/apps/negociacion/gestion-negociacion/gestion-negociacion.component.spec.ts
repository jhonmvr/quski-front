import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionNegociacionComponent } from './gestion-negociacion.component';

describe('GestionNegociacionComponent', () => {
  let component: GestionNegociacionComponent;
  let fixture: ComponentFixture<GestionNegociacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionNegociacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionNegociacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
