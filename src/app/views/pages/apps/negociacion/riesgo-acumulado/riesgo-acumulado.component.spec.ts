import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiesgoAcumuladoComponent } from './riesgo-acumulado.component';

describe('RiesgoAcumuladoComponent', () => {
  let component: RiesgoAcumuladoComponent;
  let fixture: ComponentFixture<RiesgoAcumuladoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiesgoAcumuladoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiesgoAcumuladoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
