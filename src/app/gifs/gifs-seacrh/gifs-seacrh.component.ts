import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-gifs-seacrh',
  templateUrl: './gifs-seacrh.component.html',
  styles: [
  ]
})
export class GifsSeacrhComponent {


  @ViewChild('txtSearch') txtSearch!:ElementRef<HTMLInputElement>; 
  // 'not null assertion operaor' to assert that txtSearch is non-null

  search() {
    const value = this.txtSearch.nativeElement.value;
    // console.log(value);

    // purge input element
    this.txtSearch.nativeElement.value = '';
  }
}
