import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalJobPage } from './modal-job.page';

describe('ModalJobPage', () => {
  let component: ModalJobPage;
  let fixture: ComponentFixture<ModalJobPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalJobPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalJobPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
