import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SesionCaducadaComponent } from './sesion-caducada.component';

describe('SesionCaducadaComponent', () => {
  let component: SesionCaducadaComponent;
  let fixture: ComponentFixture<SesionCaducadaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SesionCaducadaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SesionCaducadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
