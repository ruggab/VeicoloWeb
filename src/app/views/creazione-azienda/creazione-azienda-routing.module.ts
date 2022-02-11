import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGaurd } from 'src/app/shared/services/auth.gaurd';
import { CreazioneAziendaComponent } from './creazione-azienda.component';

const routes: Routes = [
  {
    path: '',
    component: CreazioneAziendaComponent,
    canActivate: [AuthGaurd]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreazioneAziendaRouting { }
