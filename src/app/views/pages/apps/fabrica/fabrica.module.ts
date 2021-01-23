import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FabricaComponent } from './fabrica.component';
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

import { AprobacionCreditoNuevoComponent } from './aprobacion-credito-nuevo/aprobacion-credito-nuevo.component';
import { PartialsModule } from '../../../partials/partials.module';
import { ErrorCargaInicialComponent } from '../../../partials/custom/popups/error-carga-inicial/error-carga-inicial.component';
import { AprobacionNovacionComponent } from './aprobacion-novacion/aprobacion-novacion.component';
import { PickDateAdapter, PICK_FORMATS } from '../../../../../app/core/util/pick-date-adapter';




const routes: Routes = [
  {
    path: '',
    component: FabricaComponent,

    children: [
      {
        path: '',
        redirectTo: 'aprobacion',
        pathMatch: 'full'
      },
      {
        path: 'aprobacion',
        component: FabricaComponent
      },
      {
        path: 'aprobacion-credito-nuevo/:id',
        component: AprobacionCreditoNuevoComponent
      },
      {
        path: 'aprobacion-novacion/:idNegociacion',
        component: AprobacionNovacionComponent
      }

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
    
    {provide: DateAdapter, useClass: PickDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS},
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
    FabricaComponent,
    AprobacionCreditoNuevoComponent,
    AprobacionNovacionComponent
  ],
  entryComponents: [
    ErrorCargaInicialComponent,




  ]
})
export class FabricaModule { }
