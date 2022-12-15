import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient) { }

  getMyReports(IdUser: string) {
    return this.http.get(`${environment.api}/my-reports/${IdUser}`);
  }

  saveReport(report: any) {
    console.log(report)
    return this.http.post(`${environment.api}/my-reports/save-report`, report);
  }

  increaseReport(_id: string, userphone: string) {
    const request = {
      _id: _id,
      userphone: userphone,
    }

    return this.http.post(`${environment.api}/my-reports/increase-report`, request);
  }

  confirmReport(currentLat, currentLong, department){
    const request = {
      currentLat: currentLat,
      currentLong: currentLong,
      department: department
    }

    return this.http.post(`${environment.api}/my-reports/confirm-report`, request);
  }

  getServicePhones(){
    return this.http.get(`${environment.api}/config/service-phones`);
  }
}
