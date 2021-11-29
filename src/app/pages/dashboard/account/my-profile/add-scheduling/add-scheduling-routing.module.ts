import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddSchedulingPage } from './add-scheduling.page';

const routes: Routes = [
  {
    path: '',
    component: AddSchedulingPage
  },
  {
    path: 'addresses',
    loadChildren: () => import('./addresses/addresses.module').then( m => m.AddressesPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddSchedulingPageRoutingModule {}
