import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddSpecializationsPage } from './add-specializations.page';

const routes: Routes = [
  {
    path: '',
    component: AddSpecializationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddSpecializationsPageRoutingModule {}
