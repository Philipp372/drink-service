import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfDrinksComponent } from './list-of-drinks.component';

describe('ListOfDrinksComponent', () => {
  let component: ListOfDrinksComponent;
  let fixture: ComponentFixture<ListOfDrinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOfDrinksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOfDrinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
