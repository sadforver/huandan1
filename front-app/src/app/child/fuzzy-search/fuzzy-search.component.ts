import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-fuzzy-search',
  templateUrl: './fuzzy-search.component.html',
  styleUrls: ['./fuzzy-search.component.scss']
})
export class FuzzySearchComponent implements OnInit {
  public searchTerm!: string;
  @Output() onSend: EventEmitter<string> = new EventEmitter<string>();
  constructor() {}

  ngOnInit(): void {}
  searchSend() {
    this.onSend.emit(this.searchTerm);
  }

}
