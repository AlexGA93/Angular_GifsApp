import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';



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
