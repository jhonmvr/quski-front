import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFechaComponent } from './add-fecha.component';

describe('AddFechaComponent', () => {
  let component: AddFechaComponent;
  let fixture: ComponentFixture<AddFechaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFechaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFechaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
