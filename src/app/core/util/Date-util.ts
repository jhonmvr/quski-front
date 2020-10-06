
export class DateUtil{

    formatDateToString(date : Date) {
        let str : string;
        if( date !=null ) {
            let day = date.getDay().toString;
            let month : any = date.getMonth()+1;
            month = month.toString;
            let year : any = date.getFullYear()+1900;
            year = year.toString;
            let hour = date.getHours.toString;
            let minutes = date.getMinutes.toString;
            let seconds = date.getSeconds.toString;
            str =  day+'/'+month+"/"+year+' '+hour+':'+minutes+':'+seconds;
            return str;
        } else {
            return null;
        }
    }
}