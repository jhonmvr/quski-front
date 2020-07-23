import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardModule } from '../../dashboard/dashboard.module';

@Component({
  selector: 'kt-excepciones',
  templateUrl: './excepciones.component.html',
  styleUrls: ['./excepciones.component.scss']
})
export class ExcepcionesComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

}
