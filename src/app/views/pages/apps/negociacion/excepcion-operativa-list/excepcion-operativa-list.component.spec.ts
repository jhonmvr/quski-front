import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcepcionOperativaListComponent } from './excepcion-operativa-list.component';

describe('ExcepcionOperativaListComponent', () => {
  let component: ExcepcionOperativaListComponent;
  let fixture: ComponentFixture<ExcepcionOperativaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExcepcionOperativaListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExcepcionOperativaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
