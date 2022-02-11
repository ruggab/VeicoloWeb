import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGaurd } from 'src/app/shared/services/auth.gaurd';
import { StatoGiftComponent } from './stato-gift.component';

const routes: Routes = [
  {
    path: '',
    component: StatoGiftComponent,
    canActivate: [AuthGaurd]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatoGiftRouting { }
