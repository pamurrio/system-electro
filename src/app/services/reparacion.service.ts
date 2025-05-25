import { Injectable } from '@angular/core';
import { Cliente } from './cliente.service';

export type EstadoReparacion =
  | 'Ingresado'              // equipo recién recibido
  | 'En diagnostico'         // se está evaluando la falla
  | 'Pendiente aprobación'   // esperando OK del cliente para reparar
  | 'En reparación'          // el técnico ya lo está arreglando
  | 'Listo para entregar'    // ya reparado, esperando retiro
  | 'Entregado'              // cliente lo retiró
  | 'NJR';                   // no se repara

export interface Reparacion {
  id: number;
  cliente: Cliente;
  equipo: {
    marca: string;
    modelo: string;
    serie: string;
    descripcion: string;
  };
  presupuesto: number;
  garantiaDias: number;
  fechaIngreso: Date;
  fechaEstimadaEntrega: Date;
  estado: 'Pendiente' | 'Entregado' | 'NJR';
  tipoPago?: 'efectivo' | 'mercado_pago';
  historial?: {
    fecha: Date;
    mensaje: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class ReparacionService {
  private reparaciones: Reparacion[] = [
  {
    id: 1,
    cliente: {
      dni: '12345678',
      nombre: 'Juan Pérez',
      telefono: '1122334455',
      email: 'juan@example.com',
      direccion: 'Calle Falsa 123'
    },
    equipo: {
      marca: 'Samsung',
      modelo: 'Galaxy A52',
      serie: 'A52-XYZ',
      descripcion: 'Pantalla rota'
    },
    presupuesto: 18000,
    garantiaDias: 30,
    fechaIngreso: new Date(new Date().setDate(new Date().getDate() - 5)),
    fechaEstimadaEntrega: new Date(new Date().setDate(new Date().getDate() + 2)), // por vencer
    estado: 'Pendiente'
  },
  {
    id: 2,
    cliente: {
      dni: '87654321',
      nombre: 'María González',
      telefono: '1199887766',
      email: 'maria@example.com',
      direccion: 'Av. Siempre Viva 742'
    },
    equipo: {
      marca: 'LG',
      modelo: 'Smart TV 50"',
      serie: 'LG50-ABC',
      descripcion: 'No enciende'
    },
    presupuesto: 35000,
    garantiaDias: 60,
    fechaIngreso: new Date(new Date().setDate(new Date().getDate() - 40)),
    fechaEstimadaEntrega: new Date(new Date().setDate(new Date().getDate() - 20)),
    estado: 'Entregado',
    tipoPago: 'mercado_pago'
  },
  {
    id: 3,
    cliente: {
      dni: '11112222',
      nombre: 'Carlos Gómez',
      telefono: '1166778899',
      email: 'carlos@example.com',
      direccion: 'Av. Libertador 555'
    },
    equipo: {
      marca: 'Sony',
      modelo: 'Xperia Z3',
      serie: 'XZ3-123',
      descripcion: 'No prende y no conviene reparar'
    },
    presupuesto: 0,
    garantiaDias: 0,
    fechaIngreso: new Date(new Date().setDate(new Date().getDate() - 10)),
    fechaEstimadaEntrega: new Date(new Date().setDate(new Date().getDate() - 5)),
    estado: 'NJR'
  },
  {
    id: 4,
    cliente: {
      dni: '33334444',
      nombre: 'Laura Martínez',
      telefono: '1144556677',
      email: 'laura@example.com',
      direccion: 'Calle San Martín 456'
    },
    equipo: {
      marca: 'Philips',
      modelo: 'Plancha 3000',
      serie: 'PH3000X',
      descripcion: 'No calienta'
    },
    presupuesto: 6000,
    garantiaDias: 15,
    fechaIngreso: new Date(new Date().setDate(new Date().getDate() - 13)),
    fechaEstimadaEntrega: new Date(new Date().setDate(new Date().getDate() + 1)), // por vencer
    estado: 'Pendiente'
  },
  {
    id: 5,
    cliente: {
      dni: '12345678',
      nombre: 'Juan Pérez',
      telefono: '1122334455',
      email: 'juan@example.com',
      direccion: 'Calle Falsa 123'
    },
    equipo: {
      marca: 'Motorola',
      modelo: 'G9 Plus',
      serie: 'MG9P-987',
      descripcion: 'Problemas de carga'
    },
    presupuesto: 12000,
    garantiaDias: 10,
    fechaIngreso: new Date(new Date().setDate(new Date().getDate() - 20)),
    fechaEstimadaEntrega: new Date(new Date().setDate(new Date().getDate() - 1)), // vencido
    estado: 'Pendiente'
  },
  {
    id: 6,
    cliente: {
      dni: '55556666',
      nombre: 'Romina Duarte',
      telefono: '1177889900',
      email: 'romina@example.com',
      direccion: 'Mitre 1234'
    },
    equipo: {
      marca: 'Lenovo',
      modelo: 'Notebook IdeaPad 3',
      serie: 'LN123ABC',
      descripcion: 'No arranca el sistema operativo'
    },
    presupuesto: 25000,
    garantiaDias: 20,
    fechaIngreso: new Date(new Date().setDate(new Date().getDate() - 1)),
    fechaEstimadaEntrega: new Date(new Date().setDate(new Date().getDate() + 5)), // dentro de 5 días = vigente
    estado: 'Pendiente'
  },
  // NUEVAS REPARACIONES ENTREGADAS HOY
  {
    id: 7,
    cliente: {
      dni: '65432198',
      nombre: 'Lucía Torres',
      telefono: '1133445566',
      email: 'lucia@example.com',
      direccion: 'Av. Corrientes 789'
    },
    equipo: {
      marca: 'LG',
      modelo: 'Smart TV 55"',
      serie: 'LG55-QWERTY',
      descripcion: 'Sin señal HDMI'
    },
    presupuesto: 41000,
    garantiaDias: 30,
    fechaIngreso: new Date(new Date().setDate(new Date().getDate() - 10)),
    fechaEstimadaEntrega: new Date(), // hoy
    estado: 'Entregado',
    tipoPago: 'efectivo'
  },
  {
    id: 8,
    cliente: {
      dni: '87651234',
      nombre: 'Eduardo Martínez',
      telefono: '1144223366',
      email: 'eduardo@example.com',
      direccion: 'Mendoza 445'
    },
    equipo: {
      marca: 'Samsung',
      modelo: 'Galaxy S22',
      serie: 'GS22-POI',
      descripcion: 'Cambio de batería'
    },
    presupuesto: 19500,
    garantiaDias: 15,
    fechaIngreso: new Date(new Date().setDate(new Date().getDate() - 5)),
    fechaEstimadaEntrega: new Date(), // hoy
    estado: 'Entregado',
    tipoPago: 'mercado_pago'
  },
  {
    id: 9,
    cliente: {
      dni: '44556677',
      nombre: 'Soledad Ramírez',
      telefono: '1199887765',
      email: 'soledad@example.com',
      direccion: 'Italia 355'
    },
    equipo: {
      marca: 'Philips',
      modelo: 'Plancha 3100',
      serie: 'PH3100Y',
      descripcion: 'Problema en el termostato'
    },
    presupuesto: 8500,
    garantiaDias: 10,
    fechaIngreso: new Date(new Date().setDate(new Date().getDate() - 8)),
    fechaEstimadaEntrega: new Date(), // hoy
    estado: 'Entregado',
    tipoPago: 'efectivo'
  },
  {
    id: 10,
    cliente: {
      dni: '99887766',
      nombre: 'Marcos Vidal',
      telefono: '1166554433',
      email: 'marcos@example.com',
      direccion: 'Belgrano 2200'
    },
    equipo: {
      marca: 'Sony',
      modelo: 'Xperia 10',
      serie: 'X10-PLUS',
      descripcion: 'Reemplazo de display'
    },
    presupuesto: 23700,
    garantiaDias: 25,
    fechaIngreso: new Date(new Date().setDate(new Date().getDate() - 7)),
    fechaEstimadaEntrega: new Date(), // hoy
    estado: 'Entregado',
    tipoPago: 'mercado_pago'
  },

];




  getReparaciones(): Reparacion[] {
    return this.reparaciones;
  }

  agregarReparacion(reparacion: Reparacion): void {
    reparacion.id = this.generarId();
    this.reparaciones.push({ ...reparacion });
  }

  private generarId(): number {
    return this.reparaciones.length > 0
      ? Math.max(...this.reparaciones.map(r => r.id)) + 1
      : 1;
  }

  getReparacionesEntregadasPorFecha(fecha: Date): Reparacion[] {
    return this.reparaciones.filter(r =>
      r.estado === 'Entregado' &&
      !!r.tipoPago &&
      this.mismaFecha(r.fechaEstimadaEntrega, fecha)
    );
  }

  private mismaFecha(fecha1: Date, fecha2: Date): boolean {
    return (
      fecha1.getFullYear() === fecha2.getFullYear() &&
      fecha1.getMonth() === fecha2.getMonth() &&
      fecha1.getDate() === fecha2.getDate()
    );
  }

}
