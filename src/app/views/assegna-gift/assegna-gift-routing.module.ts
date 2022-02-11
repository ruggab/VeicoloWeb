import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGaurd } from 'src/app/shared/services/auth.gaurd';
import { AssegnaGiftComponent } from './assegna-gift.component';

const routes: Routes = [
  {
    path: '',
    component: AssegnaGiftComponent,
    canActivate: [AuthGaurd]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssegnaGiftRouting { }
