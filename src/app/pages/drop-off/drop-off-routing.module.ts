import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DropOffPage } from './drop-off.page';

const routes: Routes = [
  {
    path: '',
    component: DropOffPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DropOffPageRoutingModule {}
