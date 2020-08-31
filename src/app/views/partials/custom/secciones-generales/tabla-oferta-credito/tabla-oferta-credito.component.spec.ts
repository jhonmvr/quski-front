import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaOfertaCreditoComponent } from './tabla-oferta-credito.component';

describe('TablaOfertaCreditoComponent', () => {
  let component: TablaOfertaCreditoComponent;
  let fixture: ComponentFixture<TablaOfertaCreditoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaOfertaCreditoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaOfertaCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
