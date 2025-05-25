import { Injectable } from '@angular/core';

export interface Venta {
  id: number;
  fecha: Date;
  productos: Array<{
    producto: any; // Definí bien este tipo según tu modelo de producto
    cantidad: number;
    subtotal: number;
  }>;
  total: number;
  tipoPago: 'efectivo' | 'mercado_pago';
}

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private ventas: Venta[] = [
    {
      id: 1,
      fecha: new Date(), // hoy
      total: 2000,
      tipoPago: 'efectivo',
      productos: [
        { producto: { id: 10, tipo: 'Control Remoto', precio: 1000 }, cantidad: 2, subtotal: 2000 }
      ]
    },
    {
      id: 2,
      fecha: new Date(), // hoy
      total: 3500,
      tipoPago: 'mercado_pago',
      productos: [
        { producto: { id: 11, tipo: 'TV 32"', precio: 3500 }, cantidad: 1, subtotal: 3500 }
      ]
    },
    {
      id: 3,
      fecha: new Date(), // hoy
      total: 1000,
      tipoPago: 'efectivo',
      productos: [
        { producto: { id: 12, tipo: 'Funda', precio: 500 }, cantidad: 2, subtotal: 1000 }
      ]
    },
    // ejemplo de venta de ayer, para control:
    {
      id: 4,
      fecha: new Date(new Date().setDate(new Date().getDate() - 1)),
      total: 5000,
      tipoPago: 'mercado_pago',
      productos: [
        { producto: { id: 13, tipo: 'Celular', precio: 5000 }, cantidad: 1, subtotal: 5000 }
      ]
    }
  ];
  private contadorId = 1;

  guardarVenta(venta: Omit<Venta, 'id' | 'fecha'>) {
    const ventaConId: Venta = {
      ...venta,
      id: this.contadorId++,
      fecha: new Date()
    };
    this.ventas.push(ventaConId);
    return ventaConId;
  }

  obtenerVentas() {
    // Las más recientes primero
    return this.ventas.slice().sort((a, b) => b.id - a.id);
  }

  obtenerVentaPorId(id: number) {
    return this.ventas.find(v => v.id === id);
  }

  getVentas(): Venta[] {
    return this.ventas;
  }

  getVentasPorFecha(fecha: Date): Venta[] {
    return this.ventas.filter(v => this.mismaFecha(v.fecha, fecha));
  }

  private mismaFecha(fecha1: Date, fecha2: Date): boolean {
    return (
      fecha1.getFullYear() === fecha2.getFullYear() &&
      fecha1.getMonth() === fecha2.getMonth() &&
      fecha1.getDate() === fecha2.getDate()
    );
  }

}
