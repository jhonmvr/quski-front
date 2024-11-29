
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Translate Module
import { TranslateModule } from '@ngx-translate/core';
// Auth
import { ModuleGuard } from '../../../../core/auth';

// Material
import {
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatSelectModule,
  MatMenuModule,
  MatProgressBarModule,
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatTabsModule,
  MatNativeDateModule,
  MatCardModule,
  MatRadioModule,
  MatIconModule,
  MatDatepickerModule,
  MatAutocompleteModule,
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatSnackBarModule,
  MatTooltipModule,
  MatStepperModule,
  MatDialogRef,
  MatButtonToggleGroup,
  DateAdapter,
  MAT_DATE_FORMATS,
} from '@angular/material';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPermissionsModule } from 'ngx-permissions';

import { BandejaExcepcionesComponent } from './bandeja-excepciones/bandeja-excepciones.component';
import { PartialsModule } from '../../../partials/partials.module';
import { AprobadorComponent } from './aprobador.component';
import { ErrorCargaInicialComponent } from '../../../partials/custom/popups/error-carga-inicial/error-carga-inicial.component';
import { BandejaAprobadorComponent } from './bandeja-aprobador/bandeja-aprobador.component';
import { ConfirmarAccionComponent } from '../../../partials/custom/popups/confirmar-accion/confirmar-accion.component';
import { PickDateAdapter, PICK_FORMATS } from '../../../../../app/core/util/pick-date-adapter';
import { MatTableExporterModule } from 'mat-table-exporter';
import { AprobacionNovacionComponent } from './aprobacion-novacion/aprobacion-novacion.component';
import { ExcepcionesClienteComponent } from './excepciones-cliente/excepciones-cliente.component';
import { ExcepcionesCoberturaComponent } from './excepciones-cobertura/excepciones-cobertura.component';
import { ExcepcionesRiesgoComponent } from './excepciones-riesgo/excepciones-riesgo.component';
import { AprobacionCreditoNuevoComponent } from './aprobacion-credito-nuevo/aprobacion-credito-nuevo.component';
import { AprobarBloqueoFondosComponent } from './aprobar-bloqueo-fondos/aprobar-bloqueo-fondos.component';
import { AprobarPagosComponent } from './aprobar-pagos/aprobar-pagos.component';
import { AprobacionCompromisoPagoComponent } from './aprobacion-compromiso-pago/aprobacion-compromiso-pago.component';




const routes: Routes = [
  {
    path: '',
    component: AprobadorComponent,
		canActivate: [ModuleGuard],

    children: [
      {
        path: '',
        redirectTo: 'bandeja-aprobador',
        pathMatch: 'full'
      },
      {
        path: 'bandeja-excepciones',
        component: BandejaExcepcionesComponent
      },
      {
        path: 'bandeja-aprobador',
        component: BandejaAprobadorComponent
      },
      {
        path: 'aprobacion-credito-nuevo/:id',
        component: AprobacionCreditoNuevoComponent
      },
      {
        path: 'aprobacion-novacion/:idNegociacion',
        component: AprobacionNovacionComponent
      },
			{
				path: 'excepcion-cliente/:id',
				component: ExcepcionesClienteComponent
			},
			{
				path: 'excepcion-cobertura/:id',
				component: ExcepcionesCoberturaComponent
			},
			{
				path: 'excepcion-riesgo/:id',
				component: ExcepcionesRiesgoComponent
			},
			{
				path: 'gestion-credito/aprobar-bloqueo-fondos/:id',
				component: AprobarBloqueoFondosComponent
			},
			{
				path: 'gestion-credito/aprobar-pagos/:id',
				component: AprobarPagosComponent
			},
			{
				path: 'compromiso-pago/:proceso/:tipo/:numeroOperacion',
				component: AprobacionCompromisoPagoComponent
			},

    ]
  }
];


@NgModule({
  imports: [
    CommonModule,
    MatTableExporterModule,
    RouterModule.forChild(routes),
    MatDialogModule,
    CommonModule,
    NgxPermissionsModule.forChild(),
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    MatButtonModule,
    MatMenuModule,
    MatSelectModule,
    MatInputModule,
    MatTableModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatIconModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTooltipModule,
    MatButtonToggleModule,
    NgbProgressbarModule,
    MatStepperModule,
    PartialsModule
  ],
  providers: [
    ModuleGuard,
    { provide: MatDialogRef, useValue: {} },
    {provide: DateAdapter, useClass: PickDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS},
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
    
      useValue: {
        hasBackdrop: true,
        panelClass: 'kt-mat-dialog-container__wrapper',
        height: 'auto',
        width: '900px'
      }
    },
  ],
  declarations: [
    AprobadorComponent,
    BandejaExcepcionesComponent,
    BandejaAprobadorComponent,
    AprobacionCreditoNuevoComponent,
    AprobacionNovacionComponent,
    ExcepcionesClienteComponent,
    ExcepcionesCoberturaComponent,
    ExcepcionesRiesgoComponent,
    AprobarBloqueoFondosComponent,
    AprobarPagosComponent,
    AprobacionCompromisoPagoComponent

  ],
  entryComponents: [
    ErrorCargaInicialComponent,
    ConfirmarAccionComponent



  ]
})
export class AprobadorModule { }
