import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VercotizacionComponent } from './vercotizacion.component';

describe('VercotizacionComponent', () => {
  let component: VercotizacionComponent;
  let fixture: ComponentFixture<VercotizacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VercotizacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VercotizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
