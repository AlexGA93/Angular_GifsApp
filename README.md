# Angular_GifsApp

We're going to develop a gifs searcher that it wil connect to the **GIPHY Developers API** to visualize our images.

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


