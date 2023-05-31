import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfirmPhonePage } from './confirm-phone.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmPhonePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfirmPhonePageRoutingModule {}
