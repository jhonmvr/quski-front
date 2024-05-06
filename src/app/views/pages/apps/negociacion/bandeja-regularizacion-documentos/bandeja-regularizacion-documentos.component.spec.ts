import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejaRegularizacionDocumentosComponent } from './bandeja-regularizacion-documentos.component';

describe('BandejaRegularizacionDocumentosComponent', () => {
  let component: BandejaRegularizacionDocumentosComponent;
  let fixture: ComponentFixture<BandejaRegularizacionDocumentosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BandejaRegularizacionDocumentosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BandejaRegularizacionDocumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
