import { Component, ViewChild } from '@angular/core';
import { AlertController, IonSelect, IonSlides, ModalController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { MapPage } from '../map/map.page';
import { PhotoService } from 'src/app/services/photo.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  slideOptions = {
    direction: 'vertical',
  };

  @ViewChild('mySlider') slides: IonSlides;
  @ViewChild('departmentsSelect') departmentsSelect: IonSelect;

  todayDate: Date = new Date('2022-11-17T19:53:22.459+00:00');

  reportType = new FormControl('', [Validators.required]);
  description = new FormControl('', [Validators.required]);
  latitude = new FormControl(null, [Validators.required]);
  longitude = new FormControl(null, [Validators.required]);
  photo = '';
  servicePhones: any[] = [];
  departments: any[] = [];

  public reportForm = new FormGroup({
    reportType: this.reportType,
    description: this.description,
    latitude: this.latitude,
    longitude: this.longitude
  });

  constructor(
    private modalController: ModalController,
    public photoService: PhotoService,
    private reportService: ReportService,
    private alertController: AlertController,
  ) {

  }

  async ngOnInit() {
    this.reportService.getServicePhones().subscribe((servicePhones: any[]) => {
      console.log(servicePhones)
      this.servicePhones = servicePhones;
    });
    this.reportService.getDepartments().subscribe((data: any) => {
      console.log(data)
      this.departments = data;
      this.departmentsSelect.open();
    });
  }

  customPopoverOptions = {
    header: 'TIPO DE REPORTE',
    subHeader: 'Selecciona la opción que más se ajuste a tu reporte',
    message: '<ion-img src="assets/mascot/Hi.gif"></ion-img>',
  };

  async getLocation(inLocation: boolean) {
    if (inLocation) {
      let coordinates = await Geolocation.getCurrentPosition();
      this.reportForm.get('latitude').setValue(coordinates.coords.latitude);
      this.reportForm.get('longitude').setValue(coordinates.coords.longitude);
      this.slides.slideNext();
    } else {
      this.openMap();
    }
  }

  callServicePhone(phone) {
    window.open(`tel:${phone}`);
  }

  async openMap() {
    let coordinates = await Geolocation.getCurrentPosition();
    const modal = await this.modalController.create({
      component: MapPage,
      componentProps: {
        Latitude: coordinates.coords.latitude,
        Longitude: coordinates.coords.longitude,
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data.location) {
      this.reportForm.get('latitude').setValue(data.location.latitude);
      this.reportForm.get('longitude').setValue(data.location.longitude);
      this.reportService.confirmReport(data.location.latitude, data.location.longitude, this.reportForm.get('reportType').value)
        .subscribe((response: any) => {
          if (response) {
            this.existAlert(response._id);
          } else {
            this.slides.slideNext();
          }
        });
    }
  }

  async shootPhoto() {
    this.photo = await this.photoService.selectImage();
    this.slides.slideNext();
  }

  async sendReport() {
    let report = {
      department: this.reportForm.get('reportType').value,
      description: this.reportForm.get('description').value,
      status: 0,
      photo: this.photo,
      geolocation: {
        latitude: this.reportForm.get('latitude').value,
        longitude: this.reportForm.get('longitude').value,
      }
    }
    await this.phoneAlert(report);

  }

  async existAlert(idReport) {
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: `El reporte que intenta levantar ya existe, ¿le gustaría que le notifiquemos cuando quede resuelto?`,
      inputs: [
        {
          name: 'userphone',
          type: 'number',
          placeholder: 'Teléfono',
          min: 10,
          max: 10,
        }
      ],
      buttons: [
        {
          text: 'Si',
          role: 'confirm',
          handler: (alertData) => {
            this.increaseReport(idReport, alertData.userphone);
            this.finalAlert();
          },
        },
        {
          text: 'No',
          role: 'cancel',
          handler: (alertData) => {
            this.increaseReport(idReport, '');
            this.finalAlert();
          },
        },
      ],
    });

    await alert.present();
  }

  async phoneAlert(report: any) {
    this.reportService.saveReport(report).subscribe(async (response: any) => {
      console.log(response);
      const alert = await this.alertController.create({
        backdropDismiss: false,
        header: `Reporte ${response.folio} enviado, ¿le gustaría que le notifiquemos cuando quede resuelto?`,
        inputs: [
          {
            name: 'userphone',
            type: 'number',
            placeholder: 'Teléfono',
            min: 10,
            max: 10,
          }
        ],
        buttons: [
          {
            text: 'Si',
            role: 'confirm',
            handler: (alertData) => {
              this.increaseReport(response._id, alertData.userphone);
              this.finalAlert();
            },
          },
          {
            text: 'No',
            role: 'cancel',
            handler: () => {
              this.increaseReport(response._id, '');
              this.finalAlert();
            },
          },
        ],
      });

      await alert.present();
    });
  }

  async finalAlert() {
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: 'Gracias por notificarnos, le daremos solución lo más pronto posible, que tenga un exelente día',
    });
    await alert.present();

    setTimeout(() => {
      window.location.reload();
    }, 9000);

  }

  increaseReport(_id: string, userphone: string) {
    this.reportService.increaseReport(_id, userphone).subscribe((response) => {
      console.log(response)
    });
  }

}
