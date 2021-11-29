import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewSchedulePage } from './new-schedule.page';

const routes: Routes = [
  {
    path: '',
    component: NewSchedulePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewSchedulePageRoutingModule {}
