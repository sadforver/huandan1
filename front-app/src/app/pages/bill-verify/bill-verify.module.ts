import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BillVerifyRoutingModule } from './bill-verify-routing.module';
import { BillVerifyComponent } from './bill-verify.component';
import { NzTableModule } from 'ng-zorro-antd/table';


@NgModule({
  declarations: [
    BillVerifyComponent
  ],
  imports: [
    CommonModule,
    BillVerifyRoutingModule,
    NzTableModule,
  ],
  exports:[BillVerifyComponent]
})
export class BillVerifyModule { }
