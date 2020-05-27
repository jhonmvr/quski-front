

export class RelativeDateAdapter {


    format(date: Date, displayFormat: string): string {
        if (displayFormat == "input") {
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();
            return this._to2digit(day) + '/' + this._to2digit(month) + '/' + year;
        } else {
            return date.toDateString();
        }
    }

    formatBack(date: Date, displayFormat: string): string {
        if(!date){
            return '';
        }
        if (displayFormat == "input") {
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();
            return year + '-' + this._to2digit(month) + '-' + this._to2digit(day);
        } else {
            return date.toDateString();
        }
    }

    addDias(date: Date, dias: number): string {
        if (date && dias) {
            let days = dias * 24 * 60 * 60 * 1000;
            let getDate = new Date(date.getTime() + days);
            let day = getDate.getDate();
            let month = getDate.getMonth() + 1;
            let year = getDate.getFullYear();
            return this._to2digit(day) + '/' + this._to2digit(month) + '/' + year;
        } else {
            return "";
        }
    }

    addDiasDate(date: Date, dias: number): Date {
        if (date && dias) {
            let days = dias * 24 * 60 * 60 * 1000;
            let getDate = new Date(date.getTime() + days);
            return getDate;

        } else {
            return new Date();
        }
    }

    private _to2digit(n: number) {
        return ('00' + n).slice(-2);
    }
}