// Angular
import { Component, HostBinding, OnInit, Input } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
// RxJS
import { filter } from 'rxjs/operators';
// Translate
import { TranslationService } from '../../../../../core/_base/layout';

interface LanguageFlag {
	lang: string;
	name: string;
	flag: string;
	active?: boolean;
}

@Component({
	selector: 'kt-language-selector',
	templateUrl: './language-selector.component.html',
})
export class LanguageSelectorComponent implements OnInit {
	// Public properties
	@HostBinding('class') classes = '';
	@Input() iconType: '' | 'brand';

	language: LanguageFlag;
	languages: LanguageFlag[] = [
		{
			lang: 'en',
			name: 'English',
			flag: './quski-front/assets/media/flags/260-united-kingdom.svg'
		},
		{
			lang: 'es',
			name: 'Spanish',
			flag: './quski-front/assets/media/flags/104-ecuador.svg'
		},
	];
	/*languages: LanguageFlag[] = [
		{
			lang: 'en',
			name: 'English',
			flag: './quski-front/assets/media/flags/260-united-kingdom.svg'
		},
		{
			lang: 'ch',
			name: 'Mandarin',
			flag: './quski-front/assets/media/flags/034-china.svg'
		},
		{
			lang: 'es',
			name: 'Spanish',
			flag: './quski-front/assets/media/flags/128-spain.svg'
		},
		{
			lang: 'jp',
			name: 'Japanese',
			flag: './quski-front/assets/media/flags/063-japan.svg'
		},
		{
			lang: 'de',
			name: 'German',
			flag: './quski-front/assets/media/flags/162-germany.svg'
		},
		{
			lang: 'fr',
			name: 'French',
			flag: './quski-front/assets/media/flags/195-france.svg'
		},
	];*/

	/**
	 * Component constructor
	 *
	 * @param translationService: TranslationService
	 * @param router: Router
	 */
	constructor(private translationService: TranslationService, private router: Router) {
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		this.setSelectedLanguage();
		this.router.events
			.pipe(filter(event => event instanceof NavigationStart))
			.subscribe(event => {
				this.setSelectedLanguage();
			});
	}

	/**
	 * Set language
	 *
	 * @param lang: any
	 */
	setLanguage(lang) {
		//console.log("=> labguage " + JSON.stringify(lang  ));
		this.languages.forEach((language: LanguageFlag) => {
			if (language.lang === lang) {
				language.active = true;
				this.language = language;
			} else {
				language.active = false;
			}
		});
		this.translationService.setLanguage(lang);
	}

	/**
	 * Set selected language
	 */
	setSelectedLanguage(): any {
		this.setLanguage(this.translationService.getSelectedLanguage());
	}
}
