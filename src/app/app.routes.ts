import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    /*data: {
      title: $localize`HOME`
    },*/
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./views/dashboard/routes').then((m) => m.routes)
      },
      {
        path: 'page',
        loadChildren: () =>
          import('./views/page/routes').then((m) => m.routes)
      },
      {
        path: 'producto',
        loadChildren: () =>
          import('./views/producto/routes').then((m) => m.routes)
      },
      {
        path: 'reparacion',
        loadChildren: () =>
          import('./views/reparacion/routes').then((m) => m.routes)
      },
      {
        path: 'venta',
        loadChildren: () =>
          import('./views/venta/routes').then((m) => m.routes)
      },
      {
        path: 'cierre-del-dia',
        loadChildren: () =>
          import('./views/cierre-del-dia/routes').then((m) => m.routes)
      }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];

