import { Component, OnInit } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'kt-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClienteComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
