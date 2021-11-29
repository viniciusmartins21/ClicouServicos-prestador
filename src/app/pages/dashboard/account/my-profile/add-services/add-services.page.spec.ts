import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddServicesPage } from './add-services.page';

describe('AddServicesPage', () => {
  let component: AddServicesPage;
  let fixture: ComponentFixture<AddServicesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddServicesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddServicesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
