import { NgModule } from '@angular/core';

import { ExportAppointmentRoutingModule } from './export-appointment-routing.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ExportAppointmentComponent } from './export-appointment.component';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';


@NgModule({
  imports: [ExportAppointmentRoutingModule,NzTableModule],
  declarations: [ExportAppointmentComponent],
  exports: [ExportAppointmentComponent]
})
export class ExportAppointmentModule { }
