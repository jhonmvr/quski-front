import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReMessageComponent } from './re-message.component';

describe('ReMessageComponent', () => {
  let component: ReMessageComponent;
  let fixture: ComponentFixture<ReMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
