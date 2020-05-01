import { Component, OnInit, Output } from '@angular/core';
import { ReNoticeService } from '../../../../core/services/re-notice.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { ReNotice } from '../../../../core/interfaces/re-notice';

@Component({
  selector: 'm-re-message',
  templateUrl: './re-message.component.html',
  styleUrls: ['./re-message.component.scss']
})
export class ReMessageComponent implements OnInit {

  @Output() type: any;
  @Output() message: any = '';

  constructor(public reNoticeService:ReNoticeService,private snackBar: MatSnackBar) {}


  ngOnInit() {
    this.reNoticeService.onNoticeChanged$.subscribe(
      (notice: ReNotice) => {

          if(notice){
              this.message = notice.message;
              this.type = notice.type;
              if(this.message){
                let config = new MatSnackBarConfig();
                config.verticalPosition = 'top';
                config.horizontalPosition = 'center';
                
                if(notice.type=='success'){
                    config.panelClass =  ['success-snackbar'] ;
                    config.duration = 5000;
                }                    
                else if(notice.type=='error'){                        
                    config.panelClass =  ['error-snackbar'] ;
                }
                else if(notice.type=='info'){                        
                    config.panelClass =  ['info-snackbar'] ;
                    config.duration = 5000;
                }
                else if(notice.type=='warning'){                        
                    config.panelClass =  ['warning-snackbar'] ;
                    config.duration = 5000;
                }
                this.snackBar.open(this.message,"cerrar",config);
              }
          } else {
              this.message =null;
          }
      }
  );
  }

}
