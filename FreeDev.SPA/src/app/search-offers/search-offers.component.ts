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

  selectedPeriod!: string;

  selectedEntryLevel!: string;

  tags: Array<string> = [];

  periods: Array<{ name: string; label: string }> = [
    { name: 'ANY', label: 'Any' },
    { name: 'DAY', label: 'This day' },
    { name: 'WEEK', label: 'This week' },
    { name: 'MONTH', label: 'This month' },
    { name: 'YEAR', label: 'This year' },
    { name: 'EVER', label: 'Ever' },
  ];

  levels: Array<{ name: string; label: string }> = [
    { name: 'ANY', label: 'Any' },
    { name: 'ENTRY', label: 'Entry' },
    { name: 'JUNIOR', label: 'Junior' },
    { name: 'MID', label: 'Mid' },
    { name: 'SENIOR', label: 'Senior' },
    { name: 'EXPERT', label: 'Expert' },
  ];

  rangeValues: Array<number> = [20, 50];

  constructor() {}

  ngOnInit() {}

  checkIfCanBeAdded($event: Event): void {
    if (this.tags.length >= 5) {
      this.tags.splice(5);
    }
  }
}
