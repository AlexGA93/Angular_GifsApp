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

