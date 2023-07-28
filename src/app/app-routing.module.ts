import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './component/customer/customer.component';
import { CustomersComponent } from './component/customers/customers.component';
import { HomeComponent } from './component/home/home.component';
import { InvoiceComponent } from './component/invoice/invoice.component';
import { InvoicesComponent } from './component/invoices/invoices.component';
import { LoginComponent } from './component/login/login.component';
import { NewcustomerComponent } from './component/newcustomer/newcustomer.component';
import { NewinvoiceComponent } from './component/newinvoice/newinvoice.component';
import { ProfileComponent } from './component/profile/profile.component';
import { RegisterComponent } from './component/register/register.component';
import { ResetpasswordComponent } from './component/resetpassword/resetpassword.component';
import { VerifyComponent } from './component/verify/verify.component';
import { AuthenticationGuard } from './guard/authentication.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'resetpassword', component: ResetpasswordComponent },
  { path: 'user/verify/account/:key', component: VerifyComponent },
  { path: 'user/verify/password/:key', component: VerifyComponent },
  {
    path: 'customers',
    component: CustomersComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'customers',
    component: CustomersComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'customers/new',
    component: NewcustomerComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'invoices/new',
    component: NewinvoiceComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'invoices',
    component: InvoicesComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'customer/:id',
    component: CustomerComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'invoices/:id/:invoiceNumber',
    component: InvoiceComponent,
    canActivate: [AuthenticationGuard],
  },
  { path: '', component: HomeComponent, canActivate: [AuthenticationGuard] },
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
