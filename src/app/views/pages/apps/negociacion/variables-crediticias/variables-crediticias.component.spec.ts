import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VariablesCrediticiasComponent } from './variables-crediticias.component';

describe('VariablesCrediticiasComponent', () => {
  let component: VariablesCrediticiasComponent;
  let fixture: ComponentFixture<VariablesCrediticiasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VariablesCrediticiasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariablesCrediticiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
