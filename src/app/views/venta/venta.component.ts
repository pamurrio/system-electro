import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: { finalY: number };
  }
}

import { Producto, ProductoService } from '../../services/producto.service';
interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

@Component({
  selector: 'app-venta',
  standalone: true,
  imports: [CommonModule, FormsModule,
    CardComponent,CardBodyComponent, CardHeaderComponent, TableDirective, ColComponent,
  ModalComponent,
  ModalHeaderComponent,
  ModalBodyComponent,
  ModalFooterComponent,
  ModalToggleDirective,
  ModalTitleDirective,
  ButtonDirective,
  ButtonCloseDirective
  ],
  templateUrl: './venta.component.html'
})
export class VentaComponent implements OnInit {
  productos: Producto[] = [];
  carrito: ItemCarrito[] = [];
  cantidades: { [id: number]: number } = {};

  filtro: string = '';
  paginaActual: number = 1;
  elementosPorPagina: number = 10;
  mostrarResumen: boolean = false;

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
   this.productos = this.productoService.getProductos();
  }

  agregarAlCarrito(producto: Producto): void {
    const cantidad = this.cantidades[producto.id] || 0;

    if (cantidad <= 0 || cantidad > producto.cantidad) {
      alert('Cantidad inválida');
      return;
    }

    const yaEnCarrito = this.carrito.find(item => item.producto.id === producto.id);
    if (yaEnCarrito) {
      yaEnCarrito.cantidad += cantidad;
    } else {
      this.carrito.push({ producto, cantidad });
    }

    this.cantidades[producto.id] = 0;
  }

  quitarDelCarrito(id: number): void {
    this.carrito = this.carrito.filter(item => item.producto.id !== id);
  }

  confirmarVenta(): void {
  this.mostrarResumen = true;
}

  finalizarVenta(): void {
    for (const item of this.carrito) {
      const ok = this.productoService.descontarStock(item.producto.id, item.cantidad);
      if (!ok) {
        alert(`No hay suficiente stock de ${item.producto.tipo}`);
        return;
      }
    }

    this.generarComprobantePDF();
    this.carrito = [];
    this.mostrarResumen = false;
    this.ngOnInit();
  }

  generarComprobantePDF(): void {
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text('Comprobante de Venta', 10, 10);

    const fecha = new Date().toLocaleString();
    doc.setFontSize(10);
    doc.text(`Fecha: ${fecha}`, 10, 18);

    autoTable(doc, {
      startY: 25,
      head: [['Producto', 'Cantidad', 'Precio Unitario', 'Subtotal']],
      body: this.carrito.map(item => [
        item.producto.tipo,
        item.cantidad.toString(),
        `$${item.producto.precio}`,
        `$${item.cantidad * item.producto.precio}`
      ])
    });

    const total = this.total();
    doc.text(`Total: $${total}`, 10, doc.lastAutoTable.finalY + 10);

    doc.save(`venta-${new Date().getTime()}.pdf`);
  }

  total(): number {
    return this.carrito.reduce((sum, item) => sum + item.cantidad * item.producto.precio, 0);
  }

  puedeVender(producto: Producto): boolean {
    const cantidadNueva = this.cantidades[producto.id] || 0;
    const enCarrito = this.carrito.find(item => item.producto.id === producto.id)?.cantidad || 0;
    const disponible = producto.cantidad;

    return disponible > 0 && cantidadNueva > 0 && (cantidadNueva + enCarrito) <= disponible;
  }

  productosFiltrados(): Producto[] {
    let filtrados = this.productos;

    if (this.filtro?.trim()) {
      const texto = this.filtro.toLowerCase();
      filtrados = filtrados.filter(p =>
        p.tipo.toLowerCase().includes(texto) || p.codigo.toLowerCase().includes(texto)
      );
    }

    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    return filtrados.slice(inicio, inicio + this.elementosPorPagina);
  }

   get totalPaginas(): number {
    const total = this.productos.filter(p =>
      p.tipo.toLowerCase().includes(this.filtro.toLowerCase())
    ).length;
    return Math.max(1, Math.ceil(total / this.elementosPorPagina));
  }

  onFiltroChange(): void {
    this.paginaActual = 1;
  }

  onCambiarElementosPorPagina(): void {
    this.paginaActual = 1;
  }

  cambiarPagina(pagina: number): void {
    this.paginaActual = pagina;
  }

  incrementarCantidad(producto: Producto): void {
    if (!this.cantidades[producto.id]) {
      this.cantidades[producto.id] = 1;
    } else if (this.cantidades[producto.id] < producto.cantidad) {
      this.cantidades[producto.id]++;
    }
  }

  decrementarCantidad(producto: Producto): void {
    if (this.cantidades[producto.id] > 0) {
      this.cantidades[producto.id]--;
    }
  }

}