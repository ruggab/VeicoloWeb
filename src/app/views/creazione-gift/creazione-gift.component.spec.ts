import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreazioneGiftComponent } from './creazione-gift.component';

describe('CreazioneGiftComponent', () => {
  let component: CreazioneGiftComponent;
  let fixture: ComponentFixture<CreazioneGiftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreazioneGiftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreazioneGiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
