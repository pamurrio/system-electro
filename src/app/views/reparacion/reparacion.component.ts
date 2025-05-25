import { Component, ViewChild } from '@angular/core';
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
  ButtonCloseDirective, Tabs2Module 
} from '@coreui/angular-pro';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: { finalY: number };
  }
}

@Component({
  selector: 'app-reparacion',
  templateUrl: './reparacion.component.html',
  imports: [CardComponent,CardBodyComponent, 
      CardHeaderComponent, TableDirective, 
      ColComponent, NgForOf, ModalComponent,
      ModalHeaderComponent,
      ModalBodyComponent,
      ModalFooterComponent,ModalToggleDirective,
      ModalTitleDirective, NgIf, ButtonDirective, ButtonCloseDirective, FormsModule, CommonModule,
    Tabs2Module ],
})
export class ReperacionComponent {
  activeTab: string = 'alta';
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
  fechaEstimadaEntrega: Date = new Date();
  presupuesto: number = 0;
  garantiaDias: number = 0;
  reparacionSeleccionada: Reparacion | null = null;
  nuevoEstado: Reparacion['estado'] = 'Pendiente';
  nuevaObservacion: string = '';
  tipoPagoSeleccionado: 'efectivo' | 'mercado_pago' | '' = '';

  @ViewChild('modalEditarReparacion') modalEditarReparacion!: ModalComponent;

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
    estado: 'Pendiente' as const,
    fechaEstimadaEntrega: this.fechaEstimadaEntrega,
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
    this.fechaEstimadaEntrega = new Date(); // reset también este campo
    this.activeTab = 'listado';
  }

  getReparacionesPorEstado(estado: string): Reparacion[] {
    return this.reparaciones.filter(r => r.estado === estado);
  }

  getEstadoReparacion(r: Reparacion): 'vencido' | 'por-vencer' | 'vigente' | null {
    if (r.estado !== 'Pendiente' || !r.fechaEstimadaEntrega) return null;

    const hoy = new Date();
    const estimada = new Date(r.fechaEstimadaEntrega);
    const diasRestantes = Math.ceil((estimada.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));

    if (diasRestantes < 0) return 'vencido';
    if (diasRestantes <= 2) return 'por-vencer';
    return 'vigente';
  }

  seleccionarReparacion(r: Reparacion): void {
    this.reparacionSeleccionada = { ...r };
    this.nuevoEstado = r.estado;
    this.tipoPagoSeleccionado = r.tipoPago as 'efectivo' | 'mercado_pago' ;
    this.nuevaObservacion = '';
  }

  guardarEdicion(): void {
    if (!this.reparacionSeleccionada) return;

    if (this.nuevoEstado === 'Entregado') {
      if (!this.tipoPagoSeleccionado) {
        alert('Se solicita seleccionar el tipo de pago');
        return;
      }
      this.reparacionSeleccionada.tipoPago = this.tipoPagoSeleccionado as 'efectivo' | 'mercado_pago';
    } else {
      delete this.reparacionSeleccionada.tipoPago; // Eliminalo si cambia a otro estado
    }

    // Buscar y actualizar reparación en el arreglo
    const index = this.reparaciones.findIndex(r => r.id === this.reparacionSeleccionada!.id);
    if (index !== -1) {
      this.reparaciones[index].presupuesto = this.reparacionSeleccionada.presupuesto;
      this.reparaciones[index].estado = this.nuevoEstado;

      if (!this.reparaciones[index].historial) {
        this.reparaciones[index].historial = [];
      }

      if (this.nuevaObservacion.trim()) {
        this.reparaciones[index].historial!.push({
          fecha: new Date(),
          mensaje: this.nuevaObservacion.trim()
        });
      }
    }

    this.modalEditarReparacion.visible=false;

    // Cerrar modal y reset
    this.reparacionSeleccionada = null;
    this.nuevoEstado = 'Pendiente';
    this.nuevaObservacion = '';
  }

  onEstadoChange() {
    if (this.nuevoEstado !== 'Entregado') {
      this.tipoPagoSeleccionado = '';
    }
  }

  generarRemito(r: Reparacion): void {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Remito de Reparación', 14, 20);

    doc.setFontSize(11);
    doc.text(`N° Reparación: ${r.id}`, 14, 30);
    doc.text(`Cliente: ${r.cliente.nombre} - DNI: ${r.cliente.dni}`, 14, 38);
    doc.text(`Fecha ingreso: ${new Date(r.fechaIngreso).toLocaleDateString()}`, 14, 46);
    if (r.fechaEstimadaEntrega) {
      doc.text(`Fecha estimada de entrega: ${new Date(r.fechaEstimadaEntrega).toLocaleDateString()}`, 14, 54);
    }

    doc.text(`Equipo: ${r.equipo.marca} ${r.equipo.modelo}`, 14, 64);
    doc.text(`Serie: ${r.equipo.serie}`, 14, 72);
    doc.text(`Descripción: ${r.equipo.descripcion}`, 14, 80);

    doc.text(`Presupuesto: $${r.presupuesto}`, 14, 90);

    // Agregar historial si hay
    if (r.historial && r.historial.length > 0) {
      doc.setFontSize(12);
      doc.text('Observaciones:', 14, 100);

      autoTable(doc, {
        startY: 105,
        head: [['Fecha', 'Detalle']],
        body: r.historial.map(h => [
          new Date(h.fecha).toLocaleDateString() + ' ' + new Date(h.fecha).toLocaleTimeString(),
          h.mensaje
        ]),
        styles: { fontSize: 10 }
      });
    }

    // Espacio para firma
    const yFinal = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 20 : 120;
    doc.text('_________________________', 14, yFinal + 10);
    doc.text('Firma del cliente', 14, yFinal + 16);
     
    const blob = doc.output('blob');
    const blobUrl = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
    window.open(blobUrl, '_blank');

  }

  handleChange($event: string | number | undefined) {
    console.log('handleChange', $event);
  }

}
