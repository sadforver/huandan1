import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableEditRowComponent } from './table-edit-row.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';


@NgModule({
  declarations: [TableEditRowComponent],
  imports: [
    CommonModule,
    NzFormModule,
    FormsModule,
    NzTableModule,
    NzPaginationModule,
    ReactiveFormsModule,
  ],
  exports:[TableEditRowComponent]
})
export class TableEditRowModule { }
