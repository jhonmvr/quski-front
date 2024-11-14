import { Pipe, PipeTransform } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FORMAT_DATE } from "../../../../../app/core/util/pick-date-adapter";
import { environment } from "../../../../../environments/environment";


@Pipe({
  name: "rDate"
})
export class RelativeDatePipe implements PipeTransform {
  constructor(private datePipe: DatePipe) { }

  transform(value: Object, ...options: string[]) {

    try {
      let xx = localStorage.getItem(environment.prefix + 'RE011');
      let x = xx ? atob(xx) : '';
      let y = localStorage.getItem(environment.prefix + 'RE014')
      const formato = y ? atob(y).replace(x, '') : null;
      if (formato) {
        return this.datePipe.transform(value, formato, ...options);
      } else {
        return this.datePipe.transform(value, FORMAT_DATE, ...options);
      }
    } catch {
      //console.log("error al intentar parsear la fecha | rDate");
      return value;
    }
  }
}
