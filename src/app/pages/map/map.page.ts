import { Component, Input, OnInit } from '@angular/core';
import { IonicSafeString, ModalController, ToastController } from '@ionic/angular';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  @Input() Latitude;
  @Input() Longitude;

  constructor(
    public MapService: MapService,
    private ModalController: ModalController,
    private toastController: ToastController,
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.showMap();
    }, 100);
    this.presentToast();
  }

  async presentToast(){
    const toast = await this.toastController.create({
      message: new IonicSafeString('Arrastre el marcador <ion-icon name="location-sharp" slot="icon-only"></ion-icon> al lugar donde se ubica el reporte. Use el menú <ion-icon name="chevron-down-circle" slot="icon-only"></ion-icon> para continuar'),
      color: 'primary',
    });
    toast.present();
  }

  showMap() {
    this.MapService.initOSM(this.Latitude, this.Longitude, 'map');
  }

  dismiss() {
    this.toastController.dismiss()
    this.ModalController.dismiss({
      location: null,
    });
  }

  sendLocation() {
    this.toastController.dismiss()
    this.ModalController.dismiss({
      location: {
        latitude: this.MapService.markerLatitude,
        longitude: this.MapService.markerLongitude
      }
    });
  }

}
