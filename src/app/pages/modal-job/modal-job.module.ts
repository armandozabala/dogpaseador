import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalJobPageRoutingModule } from './modal-job-routing.module';

import { ModalJobPage } from './modal-job.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalJobPageRoutingModule
  ],
  declarations: [ModalJobPage]
})
export class ModalJobPageModule {}
