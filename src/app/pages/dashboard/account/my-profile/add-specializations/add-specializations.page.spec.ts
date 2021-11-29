import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddSpecializationsPage } from './add-specializations.page';

describe('AddSpecializationsPage', () => {
  let component: AddSpecializationsPage;
  let fixture: ComponentFixture<AddSpecializationsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSpecializationsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddSpecializationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
