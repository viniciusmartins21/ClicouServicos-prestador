import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BankAccountPageRoutingModule } from './bank-account-routing.module';

import { BankAccountPage } from './bank-account.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BankAccountPageRoutingModule
  ],
  declarations: [BankAccountPage]
})
export class BankAccountPageModule {}
