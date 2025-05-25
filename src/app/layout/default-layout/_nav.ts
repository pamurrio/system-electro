import { INavData } from '@coreui/angular-pro';

export const navItems: INavData[] = [
  /*{
    name: $localize`Dashboard`,
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: $localize`NEW`
    }
  },*/
  {
    name: $localize`Productos`,
    url: '/producto',
    iconComponent: { name: 'cilTv' },
  },
  {
    name: $localize`Ventas`,
    url: '/venta',
    iconComponent: { name: 'cilTv' },
  },
  {
    name: $localize`Reparaciones`,
    url: '/reparacion',
    iconComponent: { name: 'cilTv' },
  },
  {
    name: $localize`Cierre del dia`,
    url: '/cierre-del-dia',
    iconComponent: { name: 'cilTv' },
  },
];
