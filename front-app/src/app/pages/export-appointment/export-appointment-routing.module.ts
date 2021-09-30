import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExportAppointmentComponent } from './export-appointment.component';

const routes: Routes = [
  { path: '', component: ExportAppointmentComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExportAppointmentRoutingModule { }
