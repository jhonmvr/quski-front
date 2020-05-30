import { Component, OnInit } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'kt-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrackingComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
