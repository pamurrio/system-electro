import { Injectable } from '@angular/core';

export interface Producto {
  id: number;
  codigo: string;
  tipo: string;
  cantidad: number;
  precio: number;
  foto: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private productos: Producto[] = [
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
      cantidad: 0,
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

  getProductos(): Producto[] {
    return this.productos;
  }

  setProductos(productos: Producto[]): void {
    this.productos = productos;
  }

  actualizarProductoActualizado(p: Producto): void {
    const index = this.productos.findIndex(prod => prod.id === p.id);
    if (index !== -1) this.productos[index] = { ...p };
  }

  descontarStock(id: number, cantidad: number): boolean {
    const producto = this.productos.find(p => p.id === id);
    if (producto && producto.cantidad >= cantidad) {
      producto.cantidad -= cantidad;
      return true;
    }
    return false;
  }
}
