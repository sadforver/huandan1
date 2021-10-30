import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from './modal.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';


@NgModule({
  declarations: [ModalComponent],
  imports: [
    CommonModule,
    NzButtonModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    NzFormModule,
    NzIconModule,
  ],
  exports:[ModalComponent]
})
export class ModalModule { }
