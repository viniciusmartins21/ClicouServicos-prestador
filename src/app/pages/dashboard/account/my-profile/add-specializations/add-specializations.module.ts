import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
	
import { IonicModule } from '@ionic/angular';

import { AddSpecializationsPageRoutingModule } from './add-specializations-routing.module';

import { AddSpecializationsPage } from './add-specializations.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddSpecializationsPageRoutingModule
  ],
  declarations: [AddSpecializationsPage]
})
export class AddSpecializationsPageModule {}
