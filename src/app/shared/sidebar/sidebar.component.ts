import { Component, OnInit } from '@angular/core';
import { GifsService } from '../../gifs/services/gifs.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent{

  // service injection
  constructor(private gifsService: GifsService){}

  get history(){
    return this.gifsService.history;
  }

  search( searchElement: string ){
    // request
    this.gifsService.searchGifs(searchElement);
  }
}
