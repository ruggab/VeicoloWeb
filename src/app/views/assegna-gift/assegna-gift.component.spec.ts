import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssegnaGiftComponent } from './assegna-gift.component';

describe('StatoGiftComponent', () => {
  let component: AssegnaGiftComponent;
  let fixture: ComponentFixture<AssegnaGiftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssegnaGiftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssegnaGiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
