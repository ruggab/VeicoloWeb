import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGaurd } from 'src/app/shared/services/auth.gaurd';
import { CreazioneGaraComponent } from './creazione-gara.component';

const routes: Routes = [
  {
    path: '',
    component: CreazioneGaraComponent,
    canActivate: [AuthGaurd]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreazioneGaraRouting { }
