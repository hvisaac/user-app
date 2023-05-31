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
    return this.http.post(`${environment.api}/my-reports/save-report`, report);
  }

  increaseReport(report: string, userphone: string) {
    const request = {
      _id: report,
      userphone: userphone,
    }

    return this.http.post(`${environment.api}/my-reports/increase-report`, request);
  }

  addPhotoToReport(_id, photo) {
    const request = {
      "media.reportedImage": photo
    }

    return this.http.put(`${environment.api}/my-reports/${_id}/report`, request);
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

  getDepartments() {
    return this.http.get(`${environment.api}/config/departments`);
  }

  addPhone(_id, phone) {
    const request = {
      "$push": {
        users: phone
      }
    }
    return this.http.put(`${environment.api}/my-reports/${_id}/report`, request);

  }

  confirmPhone(phone, folio) {
    const request = {
      phone: phone,
      folio: folio
    }

    return this.http.post(`${environment.api}/config/confirm-phone`, request);
  }

}
