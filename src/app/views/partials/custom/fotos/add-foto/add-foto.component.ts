import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { Subject, Observable } from 'rxjs';
import { MatDialogRef } from '@angular/material';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';

export interface DialogData {
  fileBase64: string;
}

@Component({
  selector: 'm-add-foto',
  templateUrl: './add-foto.component.html',
  styleUrls: ['./add-foto.component.scss']
})
export class AddFotoComponent implements OnInit {

  
  @Output()
  public pictureTaken = new EventEmitter<WebcamImage>();
  public webcamImage: WebcamImage = null;
  
  // toggle webcam on/off
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  private imageBase64:string;

  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();

  constructor( public dialogRef: MatDialogRef<AddFotoComponent>,@Inject(MAT_DIALOG_DATA) public data: DialogData) { 

  }

  public ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean|string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    //console.info('received webcam image', webcamImage);
    
    this.webcamImage = webcamImage; 
    this.imageBase64=this.webcamImage.imageAsBase64;
  }

  public cameraWasSwitched(deviceId: string): void {
    //console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
  }

  guardar(): void{
    //console.log("guardar " +this.imageBase64 );
    this.pictureTaken.emit(this.webcamImage);
    console.log("guardar " +this.imageBase64 );
    this.data.fileBase64=this.imageBase64;
    this.dialogRef.close( this.data );
  }
  cancelar(){
    this.dialogRef.close(this.data);
  }
}
