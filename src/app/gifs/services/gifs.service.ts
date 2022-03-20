import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { SearchGifsResponse, Gif } from '../interfaces/gifs.interfaces';

// angular root access
@Injectable({
  providedIn: 'root'
})
export class GifsService {
  //type check response
  public results: Gif[] = []; 

  // Giphy Developer's API Key
  private _apiKey: string = 'wPcwQtOXKFnQuFoz9LgAZ41rIlZ8gfxr';

  // search results array to storage
  private _history: string[] = [];

  // get method
  get history(){
    return [...this._history];
  }

  // Injection of http module
  constructor(private http:HttpClient){}

  // method to store search history
  searchGifs(query: string){

    // not lowercase distinction
    query = query.trim().toLowerCase();

    /* Sidebar History */
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
    
    /* HTTP Requests */
    // using observables instead of promises
    this.http.get<SearchGifsResponse>(`https://api.giphy.com/v1/gifs/search?api_key=${this._apiKey}&q=${query}&limit=10`)
    .subscribe(response => {
      this.results = response.data;
    })
  }
}
