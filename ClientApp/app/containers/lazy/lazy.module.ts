import { NgModule, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LazyComponent } from './lazy.component';
import { LazyService } from './lazy.service';

@NgModule({
  declarations: [LazyComponent],
  imports: [
    RouterModule.forChild([
      { path: '', component: LazyComponent, pathMatch: 'full' }
    ])
  ],
  providers: [
    LazyService
  ]
})
export class LazyModule {

}
