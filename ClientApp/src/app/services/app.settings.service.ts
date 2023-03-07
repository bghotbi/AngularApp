import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {

  private appSettings: any;

  constructor(private http: HttpClient) { }

  loadAppSettings() {
    var url = environment.production ? "/appsetting" : "https://localhost:7088/appsetting";
    return this.http.get(url).subscribe(data => {
      this.appSettings = data;
    });
  }

  get(key: string) {
    return this.appSettings[key];
  }
}
