import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { AuthGaurd } from './shared/services/auth.gaurd';
import { BlankLayoutComponent } from './shared/components/layouts/blank-layout/blank-layout.component';
import { AdminLayoutSidebarLargeComponent } from './shared/components/layouts/admin-layout-sidebar-large/admin-layout-sidebar-large.component';

const adminRoutes: Routes = [
   
    {
      path: 'uikits',
      loadChildren: () => import('./views/ui-kits/ui-kits.module').then(m => m.UiKitsModule)
    },
    {
      path: 'forms',
      loadChildren: () => import('./views/forms/forms.module').then(m => m.AppFormsModule)
    },
    {
      path: 'invoice',
      loadChildren: () => import('./views/invoice/invoice.module').then(m => m.InvoiceModule)
    },
    {
      path: 'inbox',
      loadChildren: () => import('./views/inbox/inbox.module').then(m => m.InboxModule)
    },
    {
      path: 'calendar',
      loadChildren: () => import('./views/calendar/calendar.module').then(m => m.CalendarAppModule)
    },
    {
      path: 'chat',
      loadChildren: () => import('./views/chat/chat.module').then(m => m.ChatModule)
    },
    {
      path: 'contacts',
      loadChildren: () => import('./views/contacts/contacts.module').then(m => m.ContactsModule)
    },
    {
      path: 'tables',
      loadChildren: () => import('./views/data-tables/data-tables.module').then(m => m.DataTablesModule)
    },
    {
      path: 'pages',
      loadChildren: () => import('./views/pages/pages.module').then(m => m.PagesModule)
    },
    {
      path: 'icons',
      loadChildren: () => import('./views/icons/icons.module').then(m => m.IconsModule)
    },
    {
      path:'creazioneazienda',
      loadChildren: () => import('./views/creazione-azienda/creazione-azienda.module').then(m => m.CreazioneAziendaModule)
    },
    {
      path:'creazionegara',
      loadChildren: () => import('./views/creazione-gara/creazione-gara.module').then(m => m.CreazioneGaraModule)
    },
    {
      path:'creazioneveicolo',
      loadChildren: () => import('./views/creazione-veicolo/creazione-veicolo.module').then(m => m.CreazioneVeicoloModule)
    },
    {
      path:'adduser',
      loadChildren: () => import('./views/add-user/add-user.module').then(m => m.AddUserModule)
    },
    {
      path:'changepassword',
      loadChildren: () => import('./views/change-password/change-password.module').then(m => m.ChangePasswordModule)
    }
  ];

const routes: Routes = [
  {
    path: '',
    redirectTo: 'sessions/signin',
    //redirectTo: 'dashboard/v1',
    pathMatch: 'full'
  },
  
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'sessions',
        loadChildren: () => import('./views/sessions/sessions.module').then(m => m.SessionsModule)
      }
    ]
  },
  {
    path: '',
    component: BlankLayoutComponent,
    children: [
      {
        path: 'others',
        loadChildren: () => import('./views/others/others.module').then(m => m.OthersModule)
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutSidebarLargeComponent,
    canActivate: [AuthGaurd],
    children: adminRoutes
  },
  {
    path: '**',
    redirectTo: 'others/404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
