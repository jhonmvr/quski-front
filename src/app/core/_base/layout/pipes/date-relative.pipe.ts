import { Pipe, PipeTransform } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FORMAT_DATE } from "../../../../../app/core/util/pick-date-adapter";


@Pipe({
  name: "rDate"
})
export class RelativeDatePipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}

  transform(value: Object, ...options: string[]) {
    return this.datePipe.transform(value,'yyyy-MM-dd' , ...options);
  }
}
