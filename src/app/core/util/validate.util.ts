import { AbstractControl } from '@angular/forms';


export function ValidateCedula(control: AbstractControl) {
    if (control.value != null || typeof control.value === 'string' && control.value.length !== 0) {

        let cedula: string = control.value;
        if (cedula.length > 10 && cedula.length < 14) {
            cedula = cedula.substring(0, 10);
        }

        if (cedula.length == 10) {
            const digito_region = cedula.substring(0, 2);
            if (Number.parseInt(digito_region) >= 1 && Number.parseInt(digito_region) <= 24) {
                const ultimo_digito = cedula.substring(9, 10);
                let total = 0;
                for (let i = 0; i < 9; i++) {
                    if (i % 2 == 0) {
                        let aux = Number.parseInt(cedula.charAt(i)) * 2;
                        if (aux > 9) { aux -= 9; }
                        total += aux;
                    } else {
                        total += parseInt(cedula.charAt(i));
                    }
                }
                const primer_digito_suma = String(total).substring(0, 1);
                const decena = (parseInt(primer_digito_suma) + 1) * 10;
                let digito_validador = decena - total;
                if (digito_validador == 10) {
                    digito_validador = 0;
                }

                if (digito_validador == Number.parseInt(ultimo_digito)) {
                    return null;

                } else {
                    return { 'cedulaIncorecta': true };
                }

            }


        } else {
            return { 'cedulaIncorecta': true };
        }

    } else {
        return { 'cedulaIncorecta': true };
    }


}

export function ValidateCedulaNumber(value: number) {
    if (value != null) {
        let cedula: string = value.toString();
        if (cedula.length < 10 || cedula.length > 10) {
            return { 'cedulaIncorecta': true };
        }
        cedula = cedula.substring(0, 10);
        if (cedula.length == 10) {
            const digito_region = parseInt(cedula.substring(0, 2));
            if (digito_region >= 1 && digito_region <= 24) {
                const ultimo_digito = cedula.substring(9, 10);
                let total = 0;
                for (let i = 0; i < 9; i++) {
                    if (i % 2 == 0) {
                        let aux = Number.parseInt(cedula.charAt(i)) * 2;
                        if (aux > 9) { aux -= 9; }
                        total += aux;
                    } else {
                        total += parseInt(cedula.charAt(i));
                    }
                }
                const primer_digito_suma = String(total).substring(0, 1);
                const decena = (parseInt(primer_digito_suma) + 1) * 10;
                let digito_validador = decena - total;
                if (digito_validador == 10) {
                    digito_validador = 0;
                }
                if (digito_validador == Number.parseInt(ultimo_digito)) {
                    return { 'cedulaIncorecta': false };
                }
            }
        }
    }
    return { 'cedulaIncorecta': true };
}

export function ValidarRucNumber(value) {
    if (value) {
        const number = value;
        const dto = value.length;
        let valor;
        let acu = 0;
        if (number == '') {
            return { 'cedulaIncorecta': true };
        } else {
            for (let i = 0; i < dto; i++) {
                valor = number.substring(i, i + 1);
                if (valor == 0 || valor == 1 || valor == 2 || valor == 3
                    || valor == 4 || valor == 5 || valor == 6 || valor == 7
                    || valor == 8 || valor == 9) {
                    acu = acu + 1;
                }
            }
            if (acu == dto) {
                while (number.substring(10, 13) != '001') {
                    return { 'cedulaIncorecta': true };
                }
                while (number.substring(0, 2) > 24) {
                    return { 'cedulaIncorecta': true };
                }
                const porcion1 = number.substring(2, 3);
                const residuo = ResiduoCedula(number.substring(0, 10));
                if (porcion1 < 6 && residuo < 6 && residuo != 0) {
                    return { 'cedulaIncorecta': true };
                } else {
                    if (porcion1 == 6) {
                        return { 'cedulaIncorecta': false };
                    } else {
                        if (porcion1 == 9) {
                            return { 'cedulaIncorecta': false };
                        }
                    }
                }
            } else {
                return { 'cedulaIncorecta': true };
            }
        }
    } else {
        return { 'cedulaIncorecta': true };
    }
}

export function ResiduoCedula(value) {
    if (value && value.length == 10) {
        let total = 0;
        for (let i = 0; i < 9; i++) {
            if (i % 2 == 0) {
                let aux = Number.parseInt(value.charAt(i)) * 2;
                if (aux > 9) { aux -= 9; }
                total += aux;
            } else {
                total += parseInt(value.charAt(i));
            }
        }
        const primer_digito_suma = String(total).substring(0, 1);
        const decena = (parseInt(primer_digito_suma) + 1) * 10;
        let digito_validador = decena - total;
        if (digito_validador == 10) {
            digito_validador = 0;
        }
        return digito_validador;
    }
    return null;
}

export function calcularEdad(birthday) { 

    birthday=new Date(birthday.split('/').reverse().join('-'));
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); 
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}
