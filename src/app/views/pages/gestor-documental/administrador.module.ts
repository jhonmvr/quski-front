import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministradorComponent } from './administrador.component';
import { RouterModule, Routes } from '@angular/router';
import { GestionUsuarioComponent } from './gestion-usuario/gestion-usuario.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PartialsModule } from '../../partials/partials.module';
import { StoreModule } from '@ngrx/store';
import { UserEffects, usersReducer } from '../../../../app/core/auth';
import { EffectsModule } from '@ngrx/effects';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatAutocompleteModule, MatButtonModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatDialogModule, MatExpansionModule, MatIconModule, MatInputModule, MatMenuModule, MatNativeDateModule, MatPaginatorModule, MatProgressBarModule, MatProgressSpinnerModule, MatRadioModule, MatSelectModule, MatSnackBarModule, MatSortModule, MatTableModule, MatTabsModule, MatTooltipModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material';
import { InterceptService, HttpUtilsService, TypesUtilsService, LayoutUtilsService } from '../../../../app/core/_base/crud';
import { ExploradorDocumentoComponent } from './explorador-documento/explorador-documento.component';

const routes: Routes = [
	{
		path: '',
		component: AdministradorComponent,
		children: [
			{
				path: 'usuario',
				component: GestionUsuarioComponent
			},
			{
				path: 'documento',
				component: ExploradorDocumentoComponent
			}
		]
	}
];


@NgModule({
  declarations: [AdministradorComponent, GestionUsuarioComponent, ExploradorDocumentoComponent],
  imports: [
	CommonModule,
	HttpClientModule,
	PartialsModule,
	RouterModule.forChild(routes),
	StoreModule.forFeature('users', usersReducer),
	EffectsModule.forFeature([UserEffects]),
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
	MatSelectModule,
	MatNativeDateModule,
	MatProgressBarModule,
	MatDatepickerModule,
	MatCardModule,
	MatPaginatorModule,
	MatSortModule,
	MatCheckboxModule,
	MatProgressSpinnerModule,
	MatSnackBarModule,
	MatExpansionModule,
	MatTabsModule,
	MatTooltipModule,
	MatDialogModule
],
providers: [
	InterceptService,
	{
		provide: HTTP_INTERCEPTORS,
			useClass: InterceptService,
		multi: true
	},
	{
		provide: MAT_DIALOG_DEFAULT_OPTIONS,
		useValue: {
			hasBackdrop: true,
			panelClass: 'kt-mat-dialog-container__wrapper',
			height: 'auto',
			width: '900px'
		}
	},
	HttpUtilsService,
	TypesUtilsService,
	LayoutUtilsService
],
})
export class AdministradorModule { }
