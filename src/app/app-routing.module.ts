// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { BaseComponent } from './views/theme/base/base.component';
import { ErrorPageComponent } from './views/theme/content/error-page/error-page.component';
// Auth
import { AuthGuard } from './core/auth';

const routes: Routes = [
	{ path: 'auth', loadChildren: () => import('../app/views/pages/auth/auth.module').then(m => m.AuthModule) },

	{
		path: '',
		component: BaseComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: 'dashboard',
				loadChildren: () => import('../app/views/pages/dashboard/dashboard.module').then(m => m.DashboardModule)
			},
			{
				path: 'asesor',
				loadChildren: () => import('../app/views/pages/apps/asesor/asesor.module').then(m => m.AsesorModule),
			},
			{
				path: 'cliente',
				loadChildren: () => import('../app/views/pages/apps/cliente/cliente.module').then(m => m.ClienteModule),
			}, {
				path: 'cotizacion',
				loadChildren: () => import('../app/views/pages/apps/cotizacion/cotizar.module').then(m => m.CotizarModule),
			}, {
				path: 'negociacion',
				loadChildren: () => import('../app/views/pages/apps/negociacion/negociacion.module').then(m => m.NegociacionModule),
			},
			{
				path: 'tracking',
				loadChildren: () => import('../app/views/pages/apps/tracking/tracking.module').then(m => m.TrackingModule),
			},
			{
				path: 'user-management',
				loadChildren: () => import('../app/views/pages/user-management/user-management.module').then(m => m.UserManagementModule)
			},
			{
				path: 'credito-nuevo',
				loadChildren: () => import('../app/views/pages/apps/credito-nuevo/credito-nuevo.module').then(m => m.CreditoNuevoModule)
			},
			{
				path: 'excepciones',
				loadChildren: () => import('../app/views/pages/apps/excepciones/excepciones.module').then(m => m.ExcepcionesModule)
			},
			{
				path: 'aprobador',
				loadChildren: () => import('../app/views/pages/apps/aprobador/aprobador.module').then(m => m.AprobadorModule)
			},
			{
				path: 'fabrica',
				loadChildren: () => import('../app/views/pages/apps/fabrica/fabrica.module').then(m => m.FabricaModule)
			},
			{
				path: 'builder',
				loadChildren: () => import('../app/views/theme/content/builder/builder.module').then(m => m.BuilderModule)
			},
			{
				path: 'error/403',
				component: ErrorPageComponent,
				data: {
					type: 'error-v6',
					code: 403,
					title: '403... Access forbidden',
					desc: 'Looks like you don\'t have permission to access for requested page.<br> Please, contact administrator'
				}
			},
			{ path: 'error/:type', component: ErrorPageComponent },
			{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
			{ path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
		]
	},

	{ path: '**', redirectTo: 'error/403', pathMatch: 'full' },
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes)
	],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
