import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillUploadComponent } from './bill-upload.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { ReactiveFormsModule } from '@angular/forms';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { TableEditRowModule } from 'src/app/child/table-edit-row/table-edit-row.module';
import { BillUploadRoutingModule } from './bill-upload-routing.module';



@NgModule({
  declarations: [BillUploadComponent],
  imports: [
    BillUploadRoutingModule,
    NzTableModule,
    NzButtonModule,
    CommonModule,
    NzModalModule,
    NzFormModule,
    NzDatePickerModule,
    NzRadioModule,
    ReactiveFormsModule,
    NzDividerModule,
    NzIconModule,
    NzInputModule,
    TableEditRowModule,
  ],
  exports:[BillUploadComponent]
})
export class BillUploadModule { }
