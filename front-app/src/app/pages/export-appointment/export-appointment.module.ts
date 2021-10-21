import { NgModule } from '@angular/core';

import { ExportAppointmentRoutingModule } from './export-appointment-routing.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ExportAppointmentComponent } from './export-appointment.component';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FuzzySearchModule } from 'src/app/child/fuzzy-search/fuzzy-search.module';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { ModalComponent } from './modal/modal.component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    ExportAppointmentRoutingModule,
    NzTableModule,
    NzButtonModule,
    CommonModule,
    FuzzySearchModule,
    NzModalModule,
    NzFormModule,
    NzDatePickerModule,
    NzRadioModule,
    ReactiveFormsModule,
  ],
  declarations: [ExportAppointmentComponent, ModalComponent],
  exports: [ExportAppointmentComponent],
})
export class ExportAppointmentModule {}
