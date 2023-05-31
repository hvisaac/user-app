import { Component, ViewChild } from '@angular/core';
import { AlertController, IonicSafeString, IonSelect, IonSlides, ModalController, ToastController } from '@ionic/angular';
import { Geolocation, Position } from '@capacitor/geolocation';
import { MapPage } from '../map/map.page';
import { PhotoService } from 'src/app/services/photo.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReportService } from 'src/app/services/report.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { LoadingService } from 'src/app/services/loading.service';
import { environment } from 'src/environments/environment';
import { ConfirmPhonePage } from '../confirm-phone/confirm-phone.page';

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
  photo: any;
  servicePhones: any[] = [];
  departments: any[] = [];
  verificatedPhone: boolean = false;
  userPhone: string = '';

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
    private firebaseService: FirebaseService,
    private loadingService: LoadingService,
    private toastController: ToastController
  ) {

  }

  async ngOnInit() {
    this.reportService.getServicePhones().subscribe((servicePhones: any[]) => {
      for (let servicePhone of servicePhones) {
        if (servicePhone.available) {
          this.servicePhones.push(servicePhone)
        }
      }
    });
    this.reportService.getDepartments().subscribe((data: any) => {
      for (let department of data) {
        department.secretariat = JSON.parse(department.secretariat)[0];
        if (department.available && department.secretariat.available && department.name != "Spam") {
          this.departments.push(department)
        }
      }
      this.departmentsSelect.open();
    });
  }

  customPopoverOptions = {
    header: 'TIPO DE REPORTE',
    subHeader: 'Selecciona la opción que más se ajuste a tu reporte',
    message: '<ion-img src="assets/mascot/Hi.gif"></ion-img>',
  }

  async getLocation(inLocation: boolean) {
    if (inLocation) {
      let coordinates = await Geolocation.getCurrentPosition();
      const position: Position = coordinates;

      this.reportForm.get('latitude').setValue(position.coords.latitude);
      this.reportForm.get('longitude').setValue(position.coords.longitude);
      this.slides.slideNext();
    } else {
      this.openMap();
    }
  }

  callServicePhone(phone) {
    window.open(`tel:${phone}`);
  }

  async openMap() {
    this.loadingService.showLoading()
    let coordinates = await Geolocation.getCurrentPosition();
    const modal = await this.modalController.create({
      component: MapPage,
      componentProps: {
        Latitude: coordinates.coords.latitude,
        Longitude: coordinates.coords.longitude,
      }
    });

    await modal.present().then(() => this.loadingService.dismissLoading());

    const { data } = await modal.onDidDismiss();

    if (data.location) {
      this.reportForm.get('latitude').setValue(data.location.latitude);
      this.reportForm.get('longitude').setValue(data.location.longitude);
      this.reportService.confirmReport(data.location.latitude, data.location.longitude, this.reportForm.get('reportType').value)
        .subscribe((response: any) => {
          if (response) {
            this.existAlert(response._id, response.folio);
          } else {
            this.slides.slideNext();
          }
        });
    }
  }

  async confirmPhone(folio, id) {
    this.loadingService.showLoading()
    const modal = await this.modalController.create({
      component: ConfirmPhonePage,
      componentProps: {
        folio: folio,
        id: id
      }
    });

    await modal.present().then(() => this.loadingService.dismissLoading());

    const { data } = await modal.onDidDismiss();

    if (data.verified) this.finalAlert()
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
      photo: '',
      geolocation: {
        latitude: this.reportForm.get('latitude').value,
        longitude: this.reportForm.get('longitude').value,
      }
    }
    await this.phoneAlert(report);

  }

  async existAlert(idReport, folio) {
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: `El reporte que intenta levantar ya existe con el folio #${folio}, ¿le gustaría que le notifiquemos cuando quede resuelto?`,
      buttons: [
        {
          text: 'Confirmar teléfono',
          handler: () => {
            this.confirmPhone(folio, idReport)
            return false
          },
        },
        {
          text: 'Continuar sin suscribirse',
          handler: () => {
            this.increaseReport(idReport, '');
            this.finalAlert()
          }
        },
      ],
    });

    await alert.present();
  }

  async phoneAlert(report: any) {
    this.reportService.saveReport(report).subscribe(async (response: any) => {
      this.reportService.addPhotoToReport(response._id, await this.addPhotoToReport(response.folio, this.photo, "reported")).subscribe()
      const alert = await this.alertController.create({
        backdropDismiss: false,
        header: `Reporte #${response.folio} enviado. Para recibir avances confirma tu teléfono y suscríbete`,
        buttons: [
          {
            text: 'Confirmar teléfono',
            handler: () => {
              this.confirmPhone(response.folio, response._id)
              return false
            },
          },
          {
            text: 'Continuar sin suscribirse',
            handler: () => {
              this.finalAlert()
            }
          },
        ],
      });

      await alert.present();
    });
  }

  async finalAlert() {
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: 'Gracias por notificarnos, te daremos solución lo más pronto posible, que tengas un excelente día',
    });
    await alert.present();

    setTimeout(() => {
      window.location.reload();
    }, 9000);

  }

  increaseReport(_id: string, userphone: string) {
    this.reportService.increaseReport(_id, userphone).subscribe();
  }

  async addPhotoToReport(folio, photo, name) {
    const date = new Date();
    return await this.firebaseService.uploadImage(`${environment.firebasePath}/${date.getFullYear()}/${date.getMonth() + 1}/${folio}`, photo, name);
  }


  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });

    await toast.present();
  }
}
