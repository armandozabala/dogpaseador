import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PickUpPage } from './pick-up.page';

describe('PickUpPage', () => {
  let component: PickUpPage;
  let fixture: ComponentFixture<PickUpPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickUpPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PickUpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
