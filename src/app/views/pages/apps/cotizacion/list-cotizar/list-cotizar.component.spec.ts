import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCotizarComponent } from './list-cotizar.component';

describe('ListCotizarComponent', () => {
  let component: ListCotizarComponent;
  let fixture: ComponentFixture<ListCotizarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCotizarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCotizarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
