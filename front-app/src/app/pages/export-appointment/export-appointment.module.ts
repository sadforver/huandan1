import { NgModule } from '@angular/core';

import { ExportAppointmentRoutingModule } from './export-appointment-routing.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ExportAppointmentComponent } from './export-appointment.component';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FuzzySearchModule } from 'src/app/child/fuzzy-search/fuzzy-search.module';
import { NzModalModule } from 'ng-zorro-antd/modal';

import { ModalModule } from './modal/modal.module';

@NgModule({
  imports: [
    ExportAppointmentRoutingModule,
    NzTableModule,
    NzButtonModule,
    CommonModule,
    FuzzySearchModule,
    NzModalModule,
    ModalModule,

  ],
  declarations: [ExportAppointmentComponent],
  exports: [ExportAppointmentComponent],
})
export class ExportAppointmentModule {}
