import { Component } from '@angular/core';
import { GifsService } from '../services/gifs.service';

@Component({
  selector: 'app-gifs-search-results',
  templateUrl: './gifs-search-results.component.html',
  styles: [
  ]
})
export class GifsSearchResultsComponent {

  // getting results
  get results(){
    return this.gifsService.results;
  }

  // Injecting service to deal with search results
  constructor( private gifsService: GifsService ){}

  

}
