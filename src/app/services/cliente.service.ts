import { Injectable } from '@angular/core';

export interface Cliente {
  dni: string;
  nombre: string;
  telefono: string;
  email: string;
  direccion: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private clientes: Cliente[] = [
  {
    dni: '12345678',
    nombre: 'Juan Pérez',
    telefono: '1122334455',
    email: 'juan@example.com',
    direccion: 'Calle Falsa 123'
  },
  {
    dni: '87654321',
    nombre: 'María González',
    telefono: '1199887766',
    email: 'maria@example.com',
    direccion: 'Av. Siempre Viva 742'
  },
  {
    dni: '11112222',
    nombre: 'Carlos Gómez',
    telefono: '1166778899',
    email: 'carlos@example.com',
    direccion: 'Av. Libertador 555'
  },
  {
    dni: '33334444',
    nombre: 'Laura Martínez',
    telefono: '1144556677',
    email: 'laura@example.com',
    direccion: 'Calle San Martín 456'
  }
];



  getClientes(): Cliente[] {
    return this.clientes;
  }

  buscarPorDNI(dni: string): Cliente | null {
    const encontrado = this.clientes.find(c => c.dni === dni);
    return encontrado || null;
  }

  agregarCliente(cliente: Cliente): boolean {
    if (this.buscarPorDNI(cliente.dni)) return false;
    this.clientes.push({ ...cliente });
    return true;
  }
}
