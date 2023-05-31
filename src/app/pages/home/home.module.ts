import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';

import { MapPage } from '../map/map.page';
import { MapPageModule } from '../map/map.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmPhonePage } from '../confirm-phone/confirm-phone.page';
import { ConfirmPhonePageModule } from '../confirm-phone/confirm-phone.module';


@NgModule({
  entryComponents: [
    MapPage,
    ConfirmPhonePage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    MapPageModule,
    FormsModule, ReactiveFormsModule,
    ConfirmPhonePageModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [HomePage]
})
export class HomePageModule {}
