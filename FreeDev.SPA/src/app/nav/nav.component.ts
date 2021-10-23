import { Component, OnInit } from '@angular/core';
import { faHome, faPlusCircle, faUserEdit, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  icons: Array<IconDefinition> = [faHome, faUserEdit, faPlusCircle];

  constructor() { }

  ngOnInit(): void {
  }
}
