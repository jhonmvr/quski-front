import { Pipe, PipeTransform } from "@angular/core";
import { DatePipe, DecimalPipe, formatNumber } from "@angular/common";
import { FORMAT_DATE } from "../../../util/pick-date-adapter";
import { environment } from "../../../../../environments/environment";


@Pipe({
  name: "rNumber"
})
export class RelativeNumberPipe implements PipeTransform {

  transform(value: any, digits?: string): string {
    if (value) {
      try {
        let x = new DecimalPipe('en_US');
        return x.transform(value, "1.0-2")
      } catch (e) {
        return value;
      }

    }
    return value;
  }
}