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
  private clientes: Cliente[] = [];

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
