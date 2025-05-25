import { NgForOf, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonCloseDirective, ButtonDirective, CardBodyComponent, CardComponent, CardFooterComponent, CardHeaderComponent, ColComponent, DatePickerComponent, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective, ModalToggleDirective, TableDirective } from '@coreui/angular-pro';
import { CierreDiaItem, CierreDiaService } from 'src/app/services/cierre-dia.service';

@Component({
  selector: 'app-cierre-del-dia',
  imports: [CardComponent,CardBodyComponent, 
    CardHeaderComponent, CardFooterComponent, TableDirective, 
    ColComponent, NgForOf, ModalComponent,
    ModalHeaderComponent, DatePickerComponent,
    ModalBodyComponent, CommonModule,
    ModalFooterComponent,ModalToggleDirective,
    ModalTitleDirective, NgIf, ButtonDirective, ButtonCloseDirective, FormsModule],
  templateUrl: './cierre-del-dia.component.html',
  styleUrl: './cierre-del-dia.component.scss'
})
export class CierreDelDiaComponent {

  accordionIndex: number | null = null;
  cierreItems: CierreDiaItem[] = [];
  cierreFiltrado: CierreDiaItem[] = [];
  // Filtros
  tipoPagoFiltro: '' | 'efectivo' | 'mercado_pago' = '';
  fechaFiltro: Date = new Date();

  // Paginación
  paginaActual: number = 1;
  elementosPorPagina: number = 10;
  totalPaginas: number = 1;

  constructor(private cierreDiaService: CierreDiaService) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cierreItems = this.cierreDiaService.getCierreDia(this.fechaFiltro, this.tipoPagoFiltro);
    //this.calcularPaginacion();
    this.filtrarYPaginar();
    //this.cerrarAccordion();
  }

   // Filtros y paginación
  onTipoPagoChange(value: string) {
    this.tipoPagoFiltro = value as '' | 'efectivo' | 'mercado_pago';
    this.cargarDatos();
  }

  onFechaChange(fecha: Date) {
    this.fechaFiltro = fecha;
    this.cargarDatos();
  }

  filtrarYPaginar() {
    // Filtrado
    let items = this.cierreItems;
    // (Filtrado ya lo hace el service, pero si quisieras un filtrado adicional, hacelo acá)
    // Paginación
    this.totalPaginas = Math.ceil(items.length / this.elementosPorPagina);
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    this.cierreFiltrado = items.slice(inicio, fin);
  }

  cambiarPagina(pagina: number) {
    this.paginaActual = pagina;
    this.filtrarYPaginar();
    this.cerrarAccordion();
  }

  calcularPaginacion() {
    this.totalPaginas = Math.max(1, Math.ceil(this.cierreItems.length / this.elementosPorPagina));
    if (this.paginaActual > this.totalPaginas) {
      this.paginaActual = this.totalPaginas;
    }
  }

  // Accordion
  abrirAccordion(index: number) {
    this.accordionIndex = this.accordionIndex === index ? null : index;
  }
  cerrarAccordion() {
    this.accordionIndex = null;
  }

  imprimirCierreDia(){

  }

  get totalDia(): number {
    return this.cierreItems.reduce((sum, item) => sum + (item.total ?? 0), 0);
  }

  get totalEfectivo(): number {
    return this.cierreItems.filter(i => i.tipoPago === 'efectivo').reduce((sum, i) => sum + (i.total ?? 0), 0);
  }
  get totalMercadoPago(): number {
    return this.cierreItems.filter(i => i.tipoPago === 'mercado_pago').reduce((sum, i) => sum + (i.total ?? 0), 0);
  }

}
