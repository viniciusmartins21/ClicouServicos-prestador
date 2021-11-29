import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddSchedulingPage } from './add-scheduling.page';

describe('AddSchedulingPage', () => {
  let component: AddSchedulingPage;
  let fixture: ComponentFixture<AddSchedulingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSchedulingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddSchedulingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
