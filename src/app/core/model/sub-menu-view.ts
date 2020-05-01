import { ItemView } from './item-view';
import { ColumnView } from './column-view';

export class SubMenuView {
    title:string;
    tooltip:string;
    page:string;
    type:string;
    width:string;
    alignment:string;
    bullet:string;
    items:ItemView[];
    columns:ColumnView[]
}