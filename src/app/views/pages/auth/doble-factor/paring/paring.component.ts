import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { BehaviorSubject } from "rxjs";
import { AuthNoticeService } from "../../../../../core/auth";
import { AutorizacionService } from "../../../../../core/services/autorizacion.service";

@Component({
  selector: "kt-paring",
  templateUrl: "./paring.component.html",
  styleUrls: ["./paring.component.scss"],
})
export class ParingComponent implements OnInit {
  qr: any;

  loadQrBS: BehaviorSubject<Boolean> = new BehaviorSubject(false);
  loadQr;

  loading: boolean = false;
  buttonNotClicked: boolean = true;
  user: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AutorizacionService,
    private authNoticeService: AuthNoticeService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.user = this.route.snapshot.queryParamMap.get("user");
    this.loadQr = this.loadQrBS.asObservable();
    this.loadQrBS.next(false);
    this.authNoticeService.setNotice(null);
    //console.log("@@@@@user ", this.user);
    this.auth.getUserQr(this.user).subscribe((image) => {
      //console.log("@@@@@image ", image);
      this.qr = image.base64Img;
      this.loadQrBS.next(true);
    });
  }

  registroQr() {
    this.loading = true;
    this.buttonNotClicked = false;
    this.auth.registerQr(this.user).subscribe(
      (res) => {
        this.loading = false;
        this.buttonNotClicked = false;
        console.log("@@@@@@@@@@ok ", res);
        this.authNoticeService.setNotice(
          this.translate.instant("REGENERAL.QR_PAGE.OK_REGISTRO"),
          "success"
        );
        this.auth.logout();
      },
      (error) => {
        this.buttonNotClicked = true;
        if (error.error) {
          this.authNoticeService.setNotice(
            this.translate.instant("REGENERAL.QR_PAGE.ERROR_REGISTRO") +
              " - " +
              error.error.codError +
              " - " +
              error.error.msgError,
            "danger"
          );
        } else {
          this.authNoticeService.setNotice(
            this.translate.instant("REGENERAL.QR_PAGE.ERROR_REGISTRO"),
            "danger"
          );
        }
      }
    );
  }
}
