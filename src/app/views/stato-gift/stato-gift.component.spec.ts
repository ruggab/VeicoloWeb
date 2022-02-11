import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatoGiftComponent } from './stato-gift.component';

describe('StatoGiftComponent', () => {
  let component: StatoGiftComponent;
  let fixture: ComponentFixture<StatoGiftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatoGiftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatoGiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
