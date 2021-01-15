import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DropOffPage } from './drop-off.page';

describe('DropOffPage', () => {
  let component: DropOffPage;
  let fixture: ComponentFixture<DropOffPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropOffPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DropOffPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
