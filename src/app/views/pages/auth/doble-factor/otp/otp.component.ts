import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { AuthNoticeService, Login, Logout } from "../../../../../core/auth";
import { UsuarioAuth } from "../../../../../core/model/usuario-auth";
import { AppState } from "../../../../../core/reducers";
import { AutorizacionService } from "../../../../../core/services/autorizacion.service";
import { WebsocketUtilService } from "../../../../../core/services/websocket-util.service";
import { environment } from "../../../../../../environments/environment";
import * as uuid from "uuid";
import { map } from "lodash";
import { fromEvent } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

@Component({
  selector: "kt-otp",
  templateUrl: "./otp.component.html",
  styleUrls: ["./otp.component.scss"],
})
export class OtpComponent implements OnInit, AfterViewInit {
  userAuth: UsuarioAuth;
  user: string;
  otp: string;
  retries: number;

  txtUno: FormControl = new FormControl("", []);
  txDos: FormControl = new FormControl("", []);
  txtTres: FormControl = new FormControl("", []);
  txtCuatro: FormControl = new FormControl("", []);
  txtCinco: FormControl = new FormControl("", []);
  txtSeis: FormControl = new FormControl("", []);

  formOTP: FormGroup = new FormGroup({});

  @ViewChild("txtUnoVc", { static: true }) txtUnoVc: ElementRef;
  @ViewChild("txtDosVc", { static: true }) txtDosVc: ElementRef;
  @ViewChild("txtTresVc", { static: true }) txtTresVc: ElementRef;
  @ViewChild("txtCuatroVc", { static: true }) txtCuatroVc: ElementRef;
  @ViewChild("txtCincoVc", { static: true }) txtCincoVc: ElementRef;
  @ViewChild("txtSeisVc", { static: true }) txtSeisVc: ElementRef;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AutorizacionService,
    private authNoticeService: AuthNoticeService,
    private translate: TranslateService,
    private ws: WebsocketUtilService
  ) {
    this.retries = 0;
    this.userAuth = JSON.parse(
      atob(this.route.snapshot.queryParamMap.get("data"))
    );
    //console.log("!!!!!!!!!!timestamp : ", this.userAuth.timestamp - Date.now());
    if (Date.now() - this.userAuth.timestamp > 5000) {
      this.authNoticeService.setNotice("ERROR, OPCION INVALIDA", "danger");
      this.router.navigate(["/"]);
    }
    this.user = this.route.snapshot.queryParamMap.get("user");
    //console.log("!!!!!!!!!!user: ", this.userAuth);
  }

  ngOnInit() {
    this.formOTP.addControl("txtUno", this.txtUno);
    this.formOTP.addControl("txDos", this.txDos);
    this.formOTP.addControl("txtTres", this.txtTres);
    this.formOTP.addControl("txtCuatro", this.txtCuatro);
    this.formOTP.addControl("txtCinco", this.txtCinco);
    this.formOTP.addControl("txtSeis", this.txtSeis);
  }

  ngAfterViewInit(): void {}

  onKeyUp(e, item: number) {
    setTimeout(() => {
      //console.log("onkeyup event ", e, e.target.value, item, this.txtUno.value);
      if (e.target.value === "") {
        return;
      }
      switch (item) {
        case 1:
          this.otp = "";
          this.otp = this.otp + this.txtUno.value;
          this.txtDosVc.nativeElement.focus();
          break;
        case 2:
          if (this.otp.length >= 6) {
            this.otp = "";
            this.txtUnoVc.nativeElement.focus();
          } else {
            this.otp = this.otp + this.txDos.value;
            this.txtTresVc.nativeElement.focus();
          }
          break;
        case 3:
          if (this.otp.length >= 6) {
            this.otp = "";
            this.txtUnoVc.nativeElement.focus();
          } else {
            this.otp = this.otp + this.txtTres.value;
            this.txtCuatroVc.nativeElement.focus();
          }
          break;
        case 4:
          if (this.otp.length >= 6) {
            this.otp = "";
            this.txtUnoVc.nativeElement.focus();
          } else {
            this.otp = this.otp + this.txtCuatro.value;
            this.txtCincoVc.nativeElement.focus();
          }
          break;
        case 5:
          if (this.otp.length >= 6) {
            this.otp = "";
            this.txtUnoVc.nativeElement.focus();
          } else {
            this.otp = this.otp + this.txtCinco.value;
            this.txtSeisVc.nativeElement.focus();
          }
          break;
        case 6:
          if (this.otp.length >= 6) {
            this.otp = "";
            this.txtUnoVc.nativeElement.focus();
          } else {
            this.otp = this.otp + this.txtSeis.value;
            this.validateOTP();
          }
          break;
        //default:
        //this.txtUnoVc.nativeElement.focus();
      }
    }, 10);
  }

  validateOTP() {
    this.auth.validateQr(this.user, this.otp).subscribe(
      (res: any) => {
        //console.log("@@@@@@@@@@ok ", res);
        if (res.login2fa) {
          localStorage.setItem(environment.userKey, btoa(this.user));
          localStorage.setItem(
            environment.authKey,
            btoa("" + this.userAuth.id)
          );
          localStorage.setItem(environment.hashWebSocketKey, uuid.v4());
          let fecha = new Date();
          fecha.getDay();
          localStorage.setItem(
            "date",
            fecha.getFullYear() + "-" + fecha.getMonth() + "-" + fecha.getDay()
          );
          this.store.dispatch(
            new Login({ authToken: this.userAuth.accessToken })
          );
          console.log(
            "=socket ruta " +
              this.ws.appWebSocketUrl +
              localStorage.getItem(environment.hashWebSocketKey) +
              "?dummy=1"
          );
          this.ws.setParameter();
          this.ws.connect(
            this.ws.appWebSocketUrl +
              localStorage.getItem(environment.hashWebSocketKey) +
              "?dummy=1"
          );
          this.ws.messages.subscribe((msg) => {
            console.log("Response from websocket: ", msg);
          });

          this.authNoticeService.setNotice(
            this.translate.instant("REGENERAL.QR_PAGE.OK_REGISTRO"),
            "success"
          );
          this.router.navigate(["/"]);
        } else {
          this.retries = this.retries + 1;
          this.authNoticeService.setNotice(
            "Codigo OTP incorrecto, ingrese nuevamente",
            "danger"
          );
          this.otp = "";
          this.txtUno.reset();
          this.txDos.reset();
          this.txtTres.reset();
          this.txtCuatro.reset();
          this.txtCinco.reset();
          this.txtSeis.reset();
          this.txtUnoVc.nativeElement.focus();
        }
      },
      (error) => {
        this.retries = this.retries + 1;
        this.otp = "";
        this.txtUno.setValue("");
        this.txDos.setValue("");
        this.txtTres.setValue("");
        this.txtCuatro.setValue("");
        this.txtCinco.setValue("");
        this.txtSeis.setValue("");
        this.txtUnoVc.nativeElement.focus();
        if (error.error) {
          this.authNoticeService.setNotice(
            this.translate.instant("REGENERAL.QR_PAGE.ERROR_VALIDACION") +
              " - " +
              error.error.codError +
              " - " +
              error.error.msgError,
            "danger"
          );
        } else {
          this.authNoticeService.setNotice(
            this.translate.instant("REGENERAL.QR_PAGE.ERROR_VALIDACION"),
            "danger"
          );
        }
        if (this.retries >= 3) {
          this.store.dispatch(new Logout());
          this.auth.logout();
        }
      }
    );
  }
}
