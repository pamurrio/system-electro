import { Component, OnInit } from '@angular/core';
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
import { Producto, ProductoService } from '../../services/producto.service';

@Component({
  standalone: true,
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  imports: [CardComponent,CardBodyComponent, 
    CardHeaderComponent, TableDirective, 
    ColComponent, NgForOf, ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent,ModalToggleDirective,
    ModalTitleDirective, NgIf, ButtonDirective, ButtonCloseDirective, FormsModule ],
})
export class ProductoComponent implements OnInit{
  filtro: string = '';
  productoSeleccionado: any = null;
  modoFormulario: boolean = false;
  paginaActual: number = 1;
  elementosPorPagina: number = 1;
  productos: Producto[] = [];

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.productos = this.productoService.getProductos();
  }

  verDetalle(producto: any): void {
    this.modoFormulario = false;
    this.productoSeleccionado = { ...producto };
  }

  editarProducto(producto: any): void {
    this.modoFormulario = true;
    this.productoSeleccionado = { ...producto };
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

  cerrarModal(): void {
    this.modoFormulario = false;
    this.productoSeleccionado = null;
  }

  guardarProducto(): void {
    const index = this.productos.findIndex(p => p.id === this.productoSeleccionado.id);

    if (index !== -1) {
      // Actualiza producto existente
      this.productoService.actualizarProductoActualizado(this.productoSeleccionado);
    } else {
      // Alta de producto nuevo
      const nuevoId = Math.max(0, ...this.productos.map(p => p.id)) + 1;
      this.productoSeleccionado.id = nuevoId;
      this.productos.push({ ...this.productoSeleccionado });
      this.productoService.setProductos(this.productos);
    }
    this.productos = this.productoService.getProductos();
    this.productoSeleccionado = null;
    this.modoFormulario = false;
    this.cerrarModal();
  }
  
}
