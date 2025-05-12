import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cliente, ClienteService } from '../../services/cliente.service';
import { ReparacionService, Reparacion } from '../../services/reparacion.service'

import { CardComponent,CardBodyComponent, CardHeaderComponent, TableDirective, ColComponent,
  ModalComponent,
  ModalHeaderComponent,
  ModalBodyComponent,
  ModalFooterComponent,
  ModalToggleDirective,
  ModalTitleDirective,
  ButtonDirective,
  ButtonCloseDirective
} from '@coreui/angular-pro';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reparacion',
  templateUrl: './reparacion.component.html',
  imports: [CardComponent,CardBodyComponent, 
      CardHeaderComponent, TableDirective, 
      ColComponent, NgForOf, ModalComponent,
      ModalHeaderComponent,
      ModalBodyComponent,
      ModalFooterComponent,ModalToggleDirective,
      ModalTitleDirective, NgIf, ButtonDirective, ButtonCloseDirective, FormsModule, CommonModule ],
})
export class ReperacionComponent {

  dniBusqueda: string = '';
  clienteSeleccionado: Cliente | null = null;
  clienteNoEncontrado: boolean = false;
  reparaciones: Reparacion[] = [];

  nuevoCliente: Cliente = {
    dni: '',
    nombre: '',
    email: '',
    telefono: '',
    direccion: ''
  };

  equipo = {
    marca: '',
    modelo: '',
    serie: '',
    descripcion: ''
  };

  presupuesto: number = 0;
  garantiaDias: number = 0;

  constructor(private clienteService: ClienteService, private reparacionService: ReparacionService) {
    this.reparaciones = this.reparacionService.getReparaciones();
  }

  buscarCliente(): void {
    const encontrado = this.clienteService.buscarPorDNI(this.dniBusqueda);
    this.clienteNoEncontrado = !encontrado;
    this.clienteSeleccionado = encontrado;
  }

  guardarNuevoCliente(): void {
    const agregado = this.clienteService.agregarCliente(this.nuevoCliente);
    if (agregado) {
      this.clienteSeleccionado = { ...this.nuevoCliente };
      this.dniBusqueda = this.nuevoCliente.dni;
      this.clienteNoEncontrado = false;
    }
    this.nuevoCliente = { dni: '', nombre: '', email: '', telefono: '', direccion: '' };
  }


guardarReparacion(): void {
  if (!this.clienteSeleccionado) {
    alert('Debes seleccionar un cliente');
    return;
  }

  const reparacion = {
    id: 0, // se asigna en el servicio
    cliente: this.clienteSeleccionado,
    equipo: { ...this.equipo },
    presupuesto: this.presupuesto,
    garantiaDias: this.garantiaDias,
    fechaIngreso: new Date(),
    estado: 'Pendiente' as const
  };

  this.reparacionService.agregarReparacion(reparacion);
  this.reparaciones = this.reparacionService.getReparaciones();

  alert('Reparación guardada con éxito');

    // Reset de campos
    this.clienteSeleccionado = null;
    this.equipo = { marca: '', modelo: '', serie: '', descripcion: '' };
    this.presupuesto = 0;
    this.garantiaDias = 0;
    this.dniBusqueda = '';
  }
  getReparacionesPorEstado(estado: string): Reparacion[] {
    return this.reparaciones.filter(r => r.estado === estado);
  }
}
