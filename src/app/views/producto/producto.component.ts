import { Component } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common'; 
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

@Component({
  standalone: true,
  selector: 'app-producto',
  templateUrl: './producto.component.html', styleUrls: ['./producto.component.scss'],
  imports: [CardComponent,CardBodyComponent, 
    CardHeaderComponent, TableDirective, 
    ColComponent, NgForOf, ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent,ModalToggleDirective,
    ModalTitleDirective, NgIf, ButtonDirective, ButtonCloseDirective, FormsModule ],
})
export class ProductoComponent {
  filtro: string = '';
  productoSeleccionado: any = null;
  modoFormulario: boolean = false;
  paginaActual: number = 1;
  elementosPorPagina: number = 1;
  productos = [
    {
      id: 1,
      codigo: 'A001',
      tipo: 'Control remoto (Sony)',
      cantidad: 10,
      precio: 3500,
      foto: 'https://i0.wp.com/lyon-argentina.com.ar/wp-content/uploads/2021/11/167448998575b86630d1fe80299f55f5ece621955d.webp.jpg?fit=936%2C1024&ssl=1'
    },
    {
      id: 2,
      codigo: 'B023',
      tipo: 'Celular (Motorola)',
      cantidad: 5,
      precio: 85000,
      foto: 'https://tienda.claro.com.ar/staticContent/Claro/images/catalog/productos/200x310/70012688.webp'
    },
    {
      id: 3,
      codigo: 'C017',
      tipo: 'Parlante (JBL)',
      cantidad: 12,
      precio: 12000,
      foto: 'https://http2.mlstatic.com/D_605656-MLA82841885932_032025-O.jpg'
    }
  ];

  verDetalle(producto: any, modal: any) {
    this.modoFormulario = false;
    this.productoSeleccionado = producto;
  }
  nuevoProducto(): void {
    this.modoFormulario = true;
    this.productoSeleccionado = {
      id: this.productos.length + 1,
      codigo: '',
      tipo: '',
      cantidad: 0,
      precio: 0,
      foto: ''
    };
  }

  guardarProducto(): void {
    this.productos.push({ ...this.productoSeleccionado });
    this.productoSeleccionado = null;
    this.modoFormulario = false;
  }

  productosFiltrados(): any[] {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    return this.productosFiltradosSinPaginacion().slice(inicio, fin);
  }

  get totalPaginas(): number {
    return Math.ceil(this.productosFiltradosSinPaginacion().length / this.elementosPorPagina);
  }

  productosFiltradosSinPaginacion(): any[] {
    if (!this.filtro) return this.productos;
    const termino = this.filtro.toLowerCase();
    return this.productos.filter(p =>
      p.tipo.toLowerCase().includes(termino)
    );
  }

  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
    }
  }

  onFiltroChange() {
    this.paginaActual = 1; // Reiniciar a la primera página
  }

  onCambiarElementosPorPagina(): void {
    this.paginaActual = 1; // Siempre reinicia a la primera página al cambiar cantidad
  }
  
}
