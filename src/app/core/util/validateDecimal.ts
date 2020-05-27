
import { AbstractControl, Validators, FormBuilder } from '@angular/forms';
export function ValidateDecimal(control: AbstractControl) {
    if (control.value != null || typeof control.value === 'string' && control.value.length !== 0) {

        var regex = /([0-9]+[.]{1}[0-9]{2})$/;
        
        //var regex = /(?:\d*\.\d{1,2}|\d+)$/;
        if (regex.test(control.value)) {
            //console.log("pasa validacion");
            return null;
        } 
            //console.log("no vale")
            return { 'invalido': true };
       
    }
}