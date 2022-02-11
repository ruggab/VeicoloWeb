import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { AuthGaurd } from './shared/services/auth.gaurd';
import { BlankLayoutComponent } from './shared/components/layouts/blank-layout/blank-layout.component';
import { AdminLayoutSidebarLargeComponent } from './shared/components/layouts/admin-layout-sidebar-large/admin-layout-sidebar-large.component';

const adminRoutes: Routes = [
    {
      path: 'dashboard',
      loadChildren: () => import('./views/dashboard/dashboard.module').then(a => a.DashboardModule)
    },
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
      path:'statogift',
      loadChildren: () => import('./views/stato-gift/stato-gift.module').then(m => m.StatoGiftModule)
    },
    {
      path:'assegnagift',
      loadChildren: () => import('./views/assegna-gift/assegna-gift.module').then(m => m.AssegnaGiftModule)
    },
    {
      path:'giftdaattivare',
      loadChildren: () => import('./views/gift-da-attivare/gift-da-attivare.module').then(m => m.GiftDaAttivareModule)
    },
    {
      path:'creazionegift',
      loadChildren: () => import('./views/creazione-gift/creazione-gift.module').then(m => m.CreazioneGiftModule)
    },
    {
      path:'creazioneazienda',
      loadChildren: () => import('./views/creazione-azienda/creazione-azienda.module').then(m => m.CreazioneAziendaModule)
    },
    {
      path:'manageProduct',
      loadChildren: () => import('./views/manage-product/manage-product.module').then(m => m.ManageProductModule)
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
