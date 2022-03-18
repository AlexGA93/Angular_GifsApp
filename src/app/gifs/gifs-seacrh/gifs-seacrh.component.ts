import { Component, ElementRef, ViewChild } from '@angular/core';
import { GifsService } from '../services/gifs.service';

@Component({
  selector: 'app-gifs-seacrh',
  templateUrl: './gifs-seacrh.component.html',
  styles: [
  ]
})
export class GifsSeacrhComponent {


  @ViewChild('txtSearch') txtSearch!:ElementRef<HTMLInputElement>; 
  // 'not null assertion operaor' to assert that txtSearch is non-null

  // including services and it methods
  constructor( private gifsService: GifsService ){}

  search() {
    const value = this.txtSearch.nativeElement.value;

    // insert search value in our service
    this.gifsService.searchGifs( value );
    
    // purge input element
    this.txtSearch.nativeElement.value = '';
  }
}
