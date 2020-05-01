import { SubMenuView } from './sub-menu-view';
import { BadgeView } from './badge-view';
import { AsideView } from './aside-view';

export class ItemView {
    section:string;
    title:string;
    desc:string;
    bullet:string;
    root:string;
    page:string;
    tooltip:string;
    icon:string;
    toggle:string;
    translate:string;
    submenu:SubMenuView[];
    badge:BadgeView[]
    aside:AsideView[];
}