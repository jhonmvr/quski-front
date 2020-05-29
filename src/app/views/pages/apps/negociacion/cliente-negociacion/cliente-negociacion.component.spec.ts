import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteNegociacionComponent } from './cliente-negociacion.component';

describe('ClienteNegociacionComponent', () => {
  let component: ClienteNegociacionComponent;
  let fixture: ComponentFixture<ClienteNegociacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClienteNegociacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClienteNegociacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
