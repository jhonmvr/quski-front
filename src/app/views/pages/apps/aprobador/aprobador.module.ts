
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




const routes: Routes = [
  {
    path: '',
    component: AprobadorComponent,

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


    ]
  }
];


@NgModule({
  imports: [
    CommonModule,
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
    BandejaAprobadorComponent
  ],
  entryComponents: [
    ErrorCargaInicialComponent,
    ConfirmarAccionComponent



  ]
})
export class AprobadorModule { }
