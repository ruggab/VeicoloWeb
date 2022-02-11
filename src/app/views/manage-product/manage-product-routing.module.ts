import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGaurd } from 'src/app/shared/services/auth.gaurd';
import { ManageProductComponent } from './manage-product.component';

const routes: Routes = [
  {
    path: '',
    component: ManageProductComponent,
    canActivate: [AuthGaurd]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageProductRouting { }
