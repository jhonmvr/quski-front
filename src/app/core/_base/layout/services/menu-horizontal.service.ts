// Angular
import { Injectable } from '@angular/core';
// RxJS
import { BehaviorSubject, pipe } from 'rxjs';
// Object path
import * as objectPath from 'object-path';
// Services
import { MenuConfigService } from './menu-config.service';
import { AutorizacionService } from '../../../services/autorizacion.service';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

@Injectable()
export class MenuHorizontalService {
	// Public properties
	menuList$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

	/**
	 * Service constructor
	 *
	 * @param menuConfigService: MenuConfigService
	 */
	constructor(private menuConfigService: MenuConfigService, private authRelative:AutorizacionService) {
		//authRelative.setParameter();
		this.loadMenu();
	}

	/**
	 * Load menu list
	 */
	loadMenu() {
		// get menu list
		this.authRelative.athorizate(environment.aplicacion).subscribe(menues=>{
			
				let localMenu={header: {
					self: {},
					items: menues
				},
				aside: {
					self: {},
					items: menues
				}
			};
			const menuItems: any[] = objectPath.get(localMenu, 'header.items');
			
			this.menuList$.next(menuItems);
		});
		//const menuItems: any[] = objectPath.get(this.menuConfigService.getMenus(), 'header.items');
		//this.menuList$.next(menuItems);
	}
}
