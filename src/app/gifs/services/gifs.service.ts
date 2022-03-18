import { Injectable } from '@angular/core';

// angular root access
@Injectable({
  providedIn: 'root'
})
export class GifsService {

  // search results array to storage
  private _history: string[] = [];

  // get method
  get history(){
    return [...this._history];
  }

  // method to store search history
  searchGifs(query: string){
    this._history.unshift( query );
    // console.log(this._history);
  }
}
