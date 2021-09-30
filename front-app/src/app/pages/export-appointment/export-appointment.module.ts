import { NgModule } from '@angular/core';

import { ExportAppointmentRoutingModule } from './export-appointment-routing.module';

import { ExportAppointmentComponent } from './export-appointment.component';


@NgModule({
  imports: [ExportAppointmentRoutingModule],
  declarations: [ExportAppointmentComponent],
  exports: [ExportAppointmentComponent]
})
export class ExportAppointmentModule { }
