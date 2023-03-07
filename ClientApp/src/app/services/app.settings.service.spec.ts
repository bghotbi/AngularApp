import { TestBed } from '@angular/core/testing';

import { AppSettingsService } from './app.settings.service';

describe('AppSettingServiceService', () => {
  let service: AppSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
