import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MapService {


  public markerLatitude: number;
  public markerLongitude: number;

  constructor(
    public http: HttpClient,
    public Platform: Platform,
  ) { }

  async initOSM(latitude: number, longitude: number, target: string) {
    let map: L.Map;

    this.markerLatitude = latitude;
    this.markerLongitude = longitude;
    map = L.map(target).setView([latitude, longitude], 14);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const marker = L.marker([latitude, longitude], {
      draggable: true,
    }).addTo(map)

    marker.on('dragend', () => {
      this.markerLatitude = marker.getLatLng().lat;
      this.markerLongitude = marker.getLatLng().lng;
    });
  }

  async initOSMWithDescription(latitude: number, longitude: number, target: string, img: string) {
    let map: L.Map;

    const popuphtml = `<img width='100%' height='100%' src='${img}' />`;

    map = L.map(target).setView([latitude, longitude], 14);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([latitude, longitude]).addTo(map)
      .bindPopup(popuphtml)
      .openPopup();
  }

}

