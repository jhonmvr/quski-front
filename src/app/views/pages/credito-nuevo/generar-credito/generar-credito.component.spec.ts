import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarCreditoComponent } from './generar-credito.component';

describe('GenerarCreditoComponent', () => {
  let component: GenerarCreditoComponent;
  let fixture: ComponentFixture<GenerarCreditoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerarCreditoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerarCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
