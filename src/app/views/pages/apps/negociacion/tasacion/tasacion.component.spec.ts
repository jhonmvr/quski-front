import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TasacionComponent } from './tasacion.component';

describe('TasacionComponent', () => {
  let component: TasacionComponent;
  let fixture: ComponentFixture<TasacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TasacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TasacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
