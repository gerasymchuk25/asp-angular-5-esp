import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
// Components
import { FooterComponent } from './components/footer/footer.component';
// Services
import { AuthService } from './services/auth.service';
import { SessionStateService } from './services/session-state.service';
import { StorageService } from './services/storage.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    FooterComponent
  ],
  providers: [
    AuthService,
    SessionStateService,
    StorageService
  ]
})
export class CoreModule {
  constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }

}
