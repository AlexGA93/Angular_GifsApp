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
