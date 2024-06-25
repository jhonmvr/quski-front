import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParingComponent } from './paring.component';

describe('ParingComponent', () => {
  let component: ParingComponent;
  let fixture: ComponentFixture<ParingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
