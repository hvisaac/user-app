import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmPhonePageRoutingModule } from './confirm-phone-routing.module';

import { ConfirmPhonePage } from './confirm-phone.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmPhonePageRoutingModule
  ],
  declarations: [ConfirmPhonePage]
})
export class ConfirmPhonePageModule {}
