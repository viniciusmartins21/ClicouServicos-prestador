import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewSchedulePage } from './new-schedule.page';

describe('NewSchedulePage', () => {
  let component: NewSchedulePage;
  let fixture: ComponentFixture<NewSchedulePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSchedulePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewSchedulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
