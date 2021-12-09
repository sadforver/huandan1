import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillVerifyComponent } from './bill-verify.component';

const routes: Routes = [
  {path:'',component:BillVerifyComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillVerifyRoutingModule { }
