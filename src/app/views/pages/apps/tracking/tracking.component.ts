import { Component, OnInit } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { SubheaderService } from './../../../../core/_base/layout';

@Component({
  selector: 'kt-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrackingComponent implements OnInit {
 

  constructor(
    
    private subheaderService: SubheaderService,
  ) { }

  ngOnInit() {
    this.subheaderService.setTitle("GESTION TRACKING");
  }

}
