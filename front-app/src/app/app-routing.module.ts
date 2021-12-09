import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/welcome' },
  {
    path: 'welcome',
    loadChildren: () =>
      import('./pages/welcome/welcome.module').then((m) => m.WelcomeModule),
  },
  {
    path: 'export-appointment',
    loadChildren: () =>
      import('./pages/export-appointment/export-appointment.module').then(
        (m) => m.ExportAppointmentModule
      ),
  },
  {
    path: 'bill-upload',
    loadChildren: () =>
      import('./pages/bill-upload/bill-upload.module').then(
        (m) => m.BillUploadModule
      ),
  },
  {
    path: 'bill-verify',
    loadChildren: () =>
      import('./pages/bill-verify/bill-verify.module').then(
        (m) => m.BillVerifyModule
      ),
  },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
