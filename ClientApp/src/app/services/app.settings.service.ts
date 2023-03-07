import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {

  private appSettings: any;

  constructor(private http: HttpClient) { }

  loadAppSettings() {
    return this.http.get('https://localhost:7088/appsetting').subscribe(data => {
      this.appSettings = data;
    });
  }

  get(key: string) {
    return this.appSettings[key];
  }
}
