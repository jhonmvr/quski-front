
import { NativeDateAdapter } from '@angular/material';
import { formatDate } from '@angular/common';
export const PICK_FORMATS = {
  parse: {dateInput: {month: 'numeric', year: 'numeric', day: 'numeric'}},
  display: {
      dateInput: 'input',
      monthYearLabel: {year: 'numeric', month: 'short'},
      dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
      monthYearA11yLabel: {year: 'numeric', month: 'long'}
  }
};
export const FORMAT_DATE='yyyy-MM-dd';

export class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
      if (displayFormat === 'input') {
          return formatDate(date,FORMAT_DATE,this.locale);
      } else {
          return date.toDateString();
      }
  }
}

/* import { Pipe, PipeTransform } from '@angular/core';
   import { DatePipe } from '@angular/common';
   
   @Pipe({
     name: 'relativeDate'
   })
   export class CustomDatePipe implements PipeTransform {
     transform(value: any, args?: any): any {
       return formatDate(value,FORMAT_DATE);
     }
   } */