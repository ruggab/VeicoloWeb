import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GiftDaAttivareComponent } from './gift-da-attivare.component';

describe('GiftDaAttivareComponent', () => {
  let component: GiftDaAttivareComponent;
  let fixture: ComponentFixture<GiftDaAttivareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiftDaAttivareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftDaAttivareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
