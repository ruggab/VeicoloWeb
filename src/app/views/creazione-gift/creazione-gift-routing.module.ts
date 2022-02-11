import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGaurd } from 'src/app/shared/services/auth.gaurd';
import { CreazioneGiftComponent } from './creazione-gift.component';

const routes: Routes = [
  {
    path: '',
    component: CreazioneGiftComponent,
    canActivate: [AuthGaurd]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreazioneGiftRouting { }
