import { Injectable } from '@angular/core';
import { Cliente } from './cliente.service';

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
  estado: 'Pendiente' | 'Entregado' | 'NJR';
}

@Injectable({
  providedIn: 'root'
})
export class ReparacionService {
  private reparaciones: Reparacion[] = [];

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
}
