import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SharedService } from '../../../../core/services/shared.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  isLoading: Subject<boolean> ;
  flat;

  constructor(private sharedService: SharedService) {
    this.isLoading =this.sharedService.isLoading;
    this.flat = this.isLoading.asObservable();
  }

  ngOnInit() {
  }

}
