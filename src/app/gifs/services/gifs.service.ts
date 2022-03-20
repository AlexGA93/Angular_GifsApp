import { Injectable } from '@angular/core';

// angular root access
@Injectable({
  providedIn: 'root'
})
export class GifsService {

  // Giphy Developer's API Key
  private _apiKey: string = 'wPcwQtOXKFnQuFoz9LgAZ41rIlZ8gfxr';

  // search results array to storage
  private _history: string[] = [];

  // get method
  get history(){
    return [...this._history];
  }

  // method to store search history
  searchGifs(query: string){

    // not lowercase distinction
    query = query.trim().toLowerCase();

    // check for empty string value
    if( query.trim().length !== 0 ){ 
      // check for cuplicates
      if ( !this._history.includes( query ) ) {
        // add to the first position
        this._history.unshift( query );

        // Limite to 10 history results
        this._history = this._history.splice(0,10);
      }
    }
  }
}
