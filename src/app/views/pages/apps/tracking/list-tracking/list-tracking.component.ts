import { Component, OnInit } from '@angular/core';
import { SubheaderService } from '../../../../../core/_base/layout';

@Component({
  selector: 'kt-list-tracking',
  templateUrl: './list-tracking.component.html',
  styleUrls: ['./list-tracking.component.scss']
})
export class ListTrackingComponent implements OnInit {

  
  
  constructor(
    private subheaderService: SubheaderService,
		) { }

  ngOnInit() {
    // Set title to page breadCrumbs
    this.subheaderService.setTitle('Gestion Tracking');
  }
  

}
