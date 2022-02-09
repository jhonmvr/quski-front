import { InjectionToken, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FabricaComponent } from './fabrica.component';
import { Routes, RouterModule } from '@angular/router';
import {LOCALE_ID} from '@angular/core';

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

import { PartialsModule } from '../../../partials/partials.module';
import { ErrorCargaInicialComponent } from '../../../partials/custom/popups/error-carga-inicial/error-carga-inicial.component';
import { PickDateAdapter, PICK_FORMATS } from '../../../../core/util/pick-date-adapter';
import { MatTableExporterModule } from 'mat-table-exporter';


const DEFAULT_CURRENCY_CODE: InjectionToken<string> = new InjectionToken<string>('USD');
const routes: Routes = [
  {
    path: '',
    component: FabricaComponent,
		canActivate: [ModuleGuard],

    children: [
      {
        path: '',
        redirectTo: 'aprobacion',
        pathMatch: 'full'
      },
      {
        path: 'aprobacion',
        component: FabricaComponent
      }

    ]
  }
];


@NgModule({
  imports: [
    CommonModule,MatTableExporterModule,
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
    {provide: DEFAULT_CURRENCY_CODE, useValue: 'USD '},
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
  ],
  entryComponents: [
    ErrorCargaInicialComponent,




  ]
})
export class FabricaModule { }
