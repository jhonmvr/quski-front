// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


// Translate Module
import { TranslateModule } from '@ngx-translate/core';
// Auth


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
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPermissionsModule } from 'ngx-permissions';


// Component
import { CreditoNuevoComponent } from './credito-nuevo.component';


import { PartialsModule } from '../../partials/partials.module';
import { GenerarCreditoComponent } from './generar-credito/generar-credito.component';



const routes: Routes = [
	{
		path: '',
		component: CreditoNuevoComponent,
		// canActivate: [ModuleGuard],
		// data: { moduleName: 'ecommerce' },
		children: [
			{
				path: '',
				redirectTo: 'generar-credito',
				pathMatch: 'full'
			},
			{
				path: 'generar-credito',
				component: GenerarCreditoComponent
			},

		]
	}
];
@NgModule({
  declarations: [CreditoNuevoComponent, GenerarCreditoComponent],
  
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
providers:[

],
})
export class CreditoNuevoModule { }
