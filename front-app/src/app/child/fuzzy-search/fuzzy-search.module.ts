import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuzzySearchComponent } from './fuzzy-search.component';
import { NzInputModule } from 'ng-zorro-antd/input';


import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [FuzzySearchComponent],
  imports: [
    CommonModule,
    NzInputModule,
    FormsModule
  ],
  exports:[FuzzySearchComponent]

})
export class FuzzySearchModule { }
