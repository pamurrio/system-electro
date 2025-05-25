import { Routes } from '@angular/router';
import { CierreDelDiaComponent } from './cierre-del-dia.component';

export const routes: Routes = [
  {
    path: '',
    component: CierreDelDiaComponent,
    data: {
      title: $localize`Cierre del dia`
    }
  }
];

