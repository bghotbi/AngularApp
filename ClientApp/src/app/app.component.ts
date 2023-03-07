import { Component } from '@angular/core';
import { AppSettingsService } from './services/app.settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'app';
  constructor(private appSettingsService: AppSettingsService) {
    this.appSettingsService.loadAppSettings();
  }
}
