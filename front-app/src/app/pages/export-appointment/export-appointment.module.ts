import { NgModule } from '@angular/core';

import { ExportAppointmentRoutingModule } from './export-appointment-routing.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ExportAppointmentComponent } from './export-appointment.component';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
@NgModule({
  imports: [
    ExportAppointmentRoutingModule,
    NzTableModule,
    NzButtonModule,
    CommonModule,
  ],
  declarations: [ExportAppointmentComponent],
  exports: [ExportAppointmentComponent],
})
export class ExportAppointmentModule {}
