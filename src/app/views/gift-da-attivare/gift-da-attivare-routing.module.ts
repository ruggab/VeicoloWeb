import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGaurd } from 'src/app/shared/services/auth.gaurd';
import { GiftDaAttivareComponent } from './gift-da-attivare.component';

const routes: Routes = [
  {
    path: '',
    component: GiftDaAttivareComponent,
    canActivate: [AuthGaurd]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GiftDaAttivareRouting { }
