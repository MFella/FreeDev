import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-offers',
  templateUrl: './search-offers.component.html',
  styleUrls: ['./search-offers.component.scss'],
})
export class SearchOffersComponent implements OnInit {
  // tutaj trzeba się zastanowić, jakie filtry będą

  // Filtry: Kiedy zapostowane: Ten dzien, ten tydzien, ten miesiac, ten rok, od zawsze
  //          Stawka: tutaj dać suwaczek
  //          Poziom wejcia: Entry, Mid, Expert

  rangeValues: Array<number> = [20, 50];

  constructor() {}

  ngOnInit() {}
}
