// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { BaseComponent } from './views/theme/base/base.component';
import { ErrorPageComponent } from './views/theme/content/error-page/error-page.component';
// Auth
import { AuthGuard } from './core/auth';

const routes: Routes = [
	{
		 path: 'auth',
		  loadChildren: () => import('../app/views/pages/auth/auth.module').then(m => m.AuthModule) 
	},
	{
		path: 'visor',
		loadChildren: () => import('./views/pages/visor/visor.module').then(m => m.VisorModule)
	},

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
				path: 'devolucion',
				loadChildren: () => import('../app/views/pages/apps/devolucion/devolucion.module').then(m => m.DevolucionModule)
			},
			{
				path: 'aprobador',
				loadChildren: () => import('../app/views/pages/apps/aprobador/aprobador.module').then(m => m.AprobadorModule)
			},
			{
				path: 'fabrica',
				loadChildren: () => import('./views/pages/apps/fabrica/fabrica.module').then(m => m.FabricaModule)
			},			
			{
				path: 'novacion',
				loadChildren: () => import('../app/views/pages/apps/novacion/novacion.module').then(m => m.NovacionModule)
			},
			{
				path: 'builder',
				loadChildren: () => import('../app/views/theme/content/builder/builder.module').then(m => m.BuilderModule)
			},
			{
				path: 'tevcol',
				loadChildren: () => import('./views/pages/apps/tevcol/tevcol.module').then(m => m.TevcolModule)
			},
			{
				path: 'error/403',
				component: ErrorPageComponent,
				data: {
					type: 'error-v6',
					code: 403,
					title: '403... Acceso denegado',
					desc: 'Tu no tienes permisos para acceder a esta paguina.<br> Por favor, contactate con el administrador del sistema'
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
