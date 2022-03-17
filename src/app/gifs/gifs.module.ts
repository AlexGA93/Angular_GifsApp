import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GifsPageComponent } from './gifs-page/gifs-page.component';
import { GifsSeacrhComponent } from './gifs-seacrh/gifs-seacrh.component';
import { GifsSearchResultsComponent } from './gifs-search-results/gifs-search-results.component';



@NgModule({
  declarations: [
    GifsPageComponent,
    GifsSeacrhComponent,
    GifsSearchResultsComponent
  ],
  exports:[
    GifsPageComponent
  ],
  imports: [
    CommonModule
  ]
})
export class GifsModule { }
