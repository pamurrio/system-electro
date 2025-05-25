import { Injectable } from '@angular/core';
import { Venta, VentaService } from './venta.service';
import { Reparacion, ReparacionService } from './reparacion.service';

export type CierreDiaItem = {
  id: number;
  fecha: Date;
  tipo: 'venta' | 'reparacion';
  total: number;
  tipoPago: 'efectivo' | 'mercado_pago';
  detalle: Venta | Reparacion;
};

@Injectable({
  providedIn: 'root'
})
export class CierreDiaService {

  constructor(private ventaService: VentaService,
    private reparacionService: ReparacionService) { }

  // Devuelve todos los ítems del cierre para una fecha y tipoPago opcional
  getCierreDia(fecha: Date, tipoPago?: 'efectivo' | 'mercado_pago' | ''): CierreDiaItem[] {
    const ventas = this.ventaService.getVentasPorFecha(fecha);
    const reparaciones = this.reparacionService.getReparacionesEntregadasPorFecha(fecha);

    let items: CierreDiaItem[] = [
      ...ventas.map(v => ({
        id: v.id,
        fecha: v.fecha,
        tipo: 'venta' as 'venta',
        total: v.total,
        tipoPago: v.tipoPago,
        detalle: v
      })),
      ...reparaciones.map(r => ({
        id: r.id,
        fecha: r.fechaEstimadaEntrega,
        tipo: 'reparacion' as 'reparacion',
        total: r.presupuesto,
        tipoPago: r.tipoPago!,
        detalle: r
      }))
    ];

    if (tipoPago) {
      items = items.filter(i => i.tipoPago === tipoPago);
    }
    return items;
  }

  // Totales por tipoPago y generales
  getTotales(items: CierreDiaItem[]) {
    const efectivo = items.filter(i => i.tipoPago === 'efectivo')
      .reduce((sum, i) => sum + i.total, 0);
    const mercadoPago = items.filter(i => i.tipoPago === 'mercado_pago')
      .reduce((sum, i) => sum + i.total, 0);
    const total = efectivo + mercadoPago;
    return { efectivo, mercadoPago, total };
  }
}
