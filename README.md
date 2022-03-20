# Angular_GifsApp

We're going to develop a gifs searcher that it wil connect to the **GIPHY Developers API** to visualize our images.

## Image Sample
![sample image](https://github.com/AlexGA93/Angular_GifsApp/blob/9/Local_Storage/src/assets/imgs/gifsApp.png)

## Bootstrap
We need to including a Bootstrap implementation with the singletag line copied from the [original site](https://getbootstrap.com/):
```
<!-- CSS only -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">

```

Tis instruction will be pasted in the **html index** file located at **/src/app/index.html**
```
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>GifsApp</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  
  <!-- CSS only -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">

</head>
<body>
  <app-root></app-root>
</body>
</html>

```
Or installing the official dependencies
```
npm i bootstrap
```

## Defining Modules and Components

- Create a module called 'shared'

```
ng g m shared
```
It will generate a folder named like we wrote before with the typscript file.

- Create a component for the Sidebar
```
ng g c shared/sidebar --skipTests -is
```
NOTE: '--skipTests' flag will prevent Angular to don't create tests files. '-is' means 'inline styles', so Angular won't generate any style file with the component.

- Configure shared.module.ts to export the module to the entire app
```
@NgModule({
  declarations: [
    SidebarComponent
  ],


  // we want to use the sidebar component out of this module too
  exports:[
    SidebarComponent
  ],


  imports: [
    CommonModule
  ]
})
export class SharedModule { }
```
- Import shared module in the app.module.ts file
```
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SharedModule // <--
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```
At this point we should have been created a simpel structure in our project with the following schema:
```
app/
|
|- gifs/
    |- gifs-page/
        |- gifs-page.component.html
        |- gifs-page.component.ts
    |- gifs-search/
        |- gifs-search.component.html
        |- gifs-search.component.ts
    |- gifs-search-results/
        |- gifs-search-results.component.html
        |- gifs-search-results.component.ts
    |- gifs.module.ts
|- shared/
    |- sidebar/
        |- sidebar.component.html
        |- sidebar.component.ts
    |- shared.module.ts
```
## @ViewChild

We'll use this Angular directive to obtain HTML objects references or obtain the input's info wrote by user.

- gifs-search.component.html
```
<div class="col">
    <h5>Search:</h5>

    <!-- INput tag with local reference to link a function when enter key is pressed -->
    <input 
    type="text" 
    class="form-control" 
    placeholder="Search Gifs"

    (keyup.enter)="search()"
    #txtSearch 
    >
</div>
```
Notice that we have wrote a order to link a method to a key action to our 'enter' key when it has been pressed. In addition we declare a local reference ('#txtSearch ') to link that value with typescript.

- gifs-search.component.ts
```
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
```

## Service
We need to create a service because we want to store a search history and use it for find the gif we want.

We can create our service manually or we can use the same mechanic that we have used with the components and modules.

```
ng g s gifs/services/gifs --skipTests
```
We can define our service script as a class where we define a copuple of variables and metods:
  - Search results array
  - get history method
  - Search method to add the search input value to the array
  ```
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

  ```
At the sime time we can to use the service data to inject them into our sidebar and render as many buttons as history has elements.

  - sidebar.component.ts
  ```
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
  }

  ```

  - sidebar.component.html
  ```
  <div class="bg-dark border-right p-3" id="sidebar">
    <h3 class="text-light">
      Gifs-App
    </h3>

    <hr class="text-light">

    <div class="list-group list-reset">
      <a 
      *ngFor="let element of history"
      href="#"
      class="list-group-item list-group-item-action"
      >
        {{element}}
      </a>
    </div>
  </div>
  ```

  ## Control Duplicates & Max. Number of Searches
  We're going to modify our service to make a couple of changes to refine our search system:

  - We don't want to make lowercase distinction
  - We want to check for empty string value
  - We want to check for duplicates
  - We want to limit our number of sidebar's history to 10

  For this implementations we have modified the search method at the service script:
  ```
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
  ```

## API Key for 'Giphy Developers'

In this case we want to use the API from Giphy Developers to access to the current site's content. To do this we need to [log in and create a new app](https://developers.giphy.com/dashboard/). It should create an API Key for our Angular project.

The next step is going to the documentation and check for [API Search Endpoints](https://developers.giphy.com/docs/api/endpoint#search).

To check our API Key we must use our favorite API client( In this case we'll use [Insomnia](https://insomnia.rest/products/insomnia)) for our first request:
```
https://api.giphy.com/v1/gifs/search?api_key=apiKey&q=Vegeta&limit=10
```
Where:
- **apiKey** : Our api key generated in the Dashboard's site.
- **q** : The query that we want to search 
- **limit** : The limit of results that we want to be returned.

## HTTP Requests

In pure javascript we can make requests using a couple of methods:
- async/await
```
// HTTP REQUEST
const res = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${this._apiKey}&q={this._query}&limit=10`);
const data = await res.json();
console.log(data);
```
- Promises
```
fetch(`https://api.giphy.com/v1/gifs/search?api_key=${this._apiKey}&q=Vegeta&limit=10`)
    .then( resp => {
      resp.json().then(data=> console.log(data))
    });
```
- Angular module
In this case we'll import this module in opur app.module.ts because we eant a global access, but it can be imported in any single module if we want it.

  - app.module.ts
  ```
  // Angular modules
  import { NgModule } from '@angular/core';
  import { BrowserModule } from '@angular/platform-browser';
  import { HttpClientModule } from '@angular/common/http';
  // Custom Modules
  import { AppComponent } from './app.component';
  import { SharedModule } from './shared/shared.module';
  import { GifsModule } from './gifs/gifs.module';

  @NgModule({
    declarations: [
      AppComponent
    ],
    imports: [
      BrowserModule, // Angular module
      HttpClientModule, // Angular module
      SharedModule, // Custom Module
      GifsModule, // Custom Module
    ],
    providers: [],
    bootstrap: [AppComponent]
  })
  export class AppModule { }

  ```
    - gifs.service.ts
  ```
  import { HttpClient } from '@angular/common/http';
  import { Injectable } from '@angular/core';

  // angular root access
  @Injectable({
    providedIn: 'root'
  })
  export class GifsService {
    //type check response
    public results: any = []; 

    // Giphy Developer's API Key
    private _apiKey: string = 'wPcwQtOXKFnQuFoz9LgAZ41rIlZ8gfxr';

    // search results array to storage
    private _history: string[] = [];

    ...

    // Injection of http module
    constructor(private http:HttpClient){}

    ...
      
    // http requests using observables instead of promises

    this.http.get(`https://api.giphy.com/v1/gifs/search?api_key=${this._apiKey}&q=${query}&limit=10`)
    .subscribe((response: any) => {
      this.results = response.data;
    })
  }
  }

  ```

## Rendering Search Inputs

Using Bootstrap we only want to render the correct request's information. For this we need to make a number o modifications i nour code:

- Inject Gif's service (**gif-search-results.component.ts**)
```
export class GifsSearchResultsComponent {

  // getting results
  get results(){
    return this.gifsService.results;
  }

  // Injecting service to deal with search results
  constructor( private gifsService: GifsService ){}

}
```
- Apply Boostrap classes to our html code
```
<div class="row">
    <div
    *ngFor="let element of results"
    class="col-md-4 col-sm-6">
        <div class="card">
            <img
            class="card-img-top" 
            [src]="element.images.downsized_medium.url" 
            [alt]="element.title">
            <div class="card-body">
                <div class="card-text">
                    {{element.title}}
                </div>
            </div>
        </div>
    </div>
</div>
```
  - NOTE: To refer a logic in a html tag's property, angular allows to aim at the property that we want using "[  ]" in the property's name.

## Typing HTTP Requests

Previosuly we declared our http request as any because we can see that the response is an object with many properties. To make a correct typing of this, we have been use [This site's services](https://app.quicktype.io/) to create our interface named 'SearchGifsResponse'.

With this site, we only have to paste or request's response (an object) and specify the language as typescript. This will generate the correct interface wit hevery object's element to use in our code.

For use it we only have to crate or interface's folder and ts script and paste the generated code.

Once we've exported our typescript's interfaces we only have to modify our service to make a correct syntax:

From this:
```
export class GifsService {
  //type check response
  public results: any = []; 
  ...

  /* HTTP Requests */
  // using observables instead of promises
  this.http.get(`https://api.giphy.com/v1/gifs/search?api_key=${this._apiKey}&q=${query}&limit=10`)
  .subscribe(response => {
    this.results = response.data;
  })
}
```
To this: 

```
export class GifsService {
  //type check response
  public results: Gif[] = []; 
  ...

  /* HTTP Requests */
  // using observables instead of promises
  this.http.get<SearchGifsResponse>(`https://api.giphy.com/v1/gifs/search?api_key=${this._apiKey}&q=${query}&limit=10`)
  .subscribe(response => {
    this.results = response.data;
  })
}
```

## Local Storage
To save data in Local Storage and allow to save history when the web browser refresh connection. We need to save the search data in our local history and load those when this component create a new instance. For that we must definde the load order in the class constructor.
 - Save data history in the local storage
```
export class GifsService {
 ...
  // method to store search history
  searchGifs(query: string){

    // not lowercase distinction
    query = query.trim().toLowerCase();
    
    if( query.trim().length !== 0 ){ 
      if ( !this._history.includes( query ) ) {
        this._history.unshift( query );
        this._history = this._history.splice(0,10);

        // Save data in Local Storage
        localStorage.setItem('history', JSON.stringify(this._history))
      }
    }
    /* HTTP Requests */

    const params = new HttpParams()
    .set('api_key', this._apiKey)
    .set('limit', 10)
    .set('q', query);

    // using observables instead of promises
    this.http.get<SearchGifsResponse>(`${this._urlService}/search`, {params})
    .subscribe(response => {
      this.results = response.data;
      // Save data in Local Storage
      localStorage.setItem('historyImages', JSON.stringify(this.results));
    })
  }
```
 - Load local storage at new instance's cration
```
// Injection of http module
  constructor(private http:HttpClient) {

  // access to localstorage to render hsitory
  this._history = JSON.parse(localStorage.getItem('history')!) || [];
  this.results = JSON.parse(localStorage.getItem('historyImages')!) || [];

  }
```

## Obtain images form the Sidebar
We want to define a click element to load the same search funcionallity:
```
<div class="bg-dark border-right p-3" id="sidebar">
  <h3 class="text-light">
    Gifs-App
  </h3>

  <hr class="text-light">

  <div class="list-group list-reset">
    <a
    *ngFor="let element of history"
    (click)="search( element )"
    href="#"
    class="list-group-item list-group-item-action"
    >
      {{element | titlecase}}
    </a>
  </div>
</div>
```
In second place we need to define the search method that will make the http request:
```
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
```
