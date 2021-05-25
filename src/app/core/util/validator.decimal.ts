import { AbstractControl } from "@angular/forms";

/**
 * CONTROL PARA DOS DECIMALES NO OBLIGATORIOS
 * @param control 
 * @returns  return { 'invalido': true };
 */
export function ValidateDecimal(control: AbstractControl) {
    if (control.value == ""){
        return null;
    }
    if (control.value != "" ||control.value != null || typeof control.value === 'string' && control.value.length != 0) {

        var regex = /(^-?[0-9]+(\.\d{1,2})?)$/;
        // var regex = new RegExp("^-?\d{1,9}(\.\d{1,2})?$");
        //var regex = /(?:\d*\.\d{1,2}|\d+)$/;
        if (String(control.value).match(regex)) {
            return null;
        } 
        return { 'invalido': true };
       
    }
}