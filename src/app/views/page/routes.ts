import { Routes } from '@angular/router';
import { PageComponent } from './page.component';

export const routes: Routes = [
  {
    path: '',
    component: PageComponent,
    data: {
      title: $localize`Page`
    }
  }
];

