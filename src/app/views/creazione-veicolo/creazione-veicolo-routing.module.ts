import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGaurd } from 'src/app/shared/services/auth.gaurd';
import { CreazioneVeicoloComponent } from './creazione-veicolo.component';

const routes: Routes = [
  {
    path: '',
    component: CreazioneVeicoloComponent,
    canActivate: [AuthGaurd]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreazioneVeicoloRouting { }
