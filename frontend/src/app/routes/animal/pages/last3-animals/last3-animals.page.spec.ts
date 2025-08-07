import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Last3AnimalsPage } from './last3-animals.page';

describe('Last3AnimalsPage', () => {
  let component: Last3AnimalsPage;
  let fixture: ComponentFixture<Last3AnimalsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [Last3AnimalsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(Last3AnimalsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
