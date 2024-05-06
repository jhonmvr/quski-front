import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AprobadorExcepcionOperativaComponent } from './aprobador-excepcion-operativa.component';

describe('AprobadorExcepcionOperativaComponent', () => {
  let component: AprobadorExcepcionOperativaComponent;
  let fixture: ComponentFixture<AprobadorExcepcionOperativaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AprobadorExcepcionOperativaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AprobadorExcepcionOperativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
