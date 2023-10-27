import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidacionDocumentoComponent } from './validacion-documento.component';

describe('ValidacionDocumentoComponent', () => {
  let component: ValidacionDocumentoComponent;
  let fixture: ComponentFixture<ValidacionDocumentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidacionDocumentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidacionDocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
