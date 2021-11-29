import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewSchedulePageRoutingModule } from './new-schedule-routing.module';

import { NewSchedulePage } from './new-schedule.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewSchedulePageRoutingModule
  ]
})
export class NewSchedulePageModule {}
