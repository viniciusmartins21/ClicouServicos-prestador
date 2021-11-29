import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddSchedulingPageRoutingModule } from './add-scheduling-routing.module';

import { AddSchedulingPage } from './add-scheduling.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddSchedulingPageRoutingModule
  ],
  declarations: [AddSchedulingPage]
})
export class AddSchedulingPageModule {}
