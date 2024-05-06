import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AprobacionFabricaComponent } from './aprobacion-fabrica.component';

describe('AprobacionFabricaComponent', () => {
  let component: AprobacionFabricaComponent;
  let fixture: ComponentFixture<AprobacionFabricaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AprobacionFabricaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AprobacionFabricaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
