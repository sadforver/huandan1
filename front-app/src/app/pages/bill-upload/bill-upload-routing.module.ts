import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillUploadComponent } from './bill-upload.component';


const routes: Routes = [
  { path: '', component: BillUploadComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillUploadRoutingModule { }
