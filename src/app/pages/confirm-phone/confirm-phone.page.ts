import { Component, Input, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
import * as crypto from 'crypto-js'
import { ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-confirm-phone',
  templateUrl: './confirm-phone.page.html',
  styleUrls: ['./confirm-phone.page.scss'],
})
export class ConfirmPhonePage implements OnInit {

  @Input() phone: string = '';
  @Input() folio: string = '';
  @Input() id: string = '';

  code: {
    decrypted: string,
    confirm: boolean
  }

  time: {
    maxTime: number,
    loop: boolean
  }

  constructor(
    private reportService: ReportService,
    private modalController: ModalController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.code = {
      decrypted: '',
      confirm: false
    }

    this.time = {
      maxTime: 60,
      loop: false
    }
  }

  confirmCode(code, userPhone) {
    this.code.confirm = this.code.decrypted == code.value && this.code.decrypted != ''
    if (this.code.confirm) {
      this.presentToast("Teléfono verificado")
      this.reportService.addPhone(this.id, userPhone).subscribe()
      this.modalController.dismiss({ verified: true })
    } else {
      this.presentToast("Código incorrecto")
    }
  }

  changedPhone() {
    this.code = {
      decrypted: '',
      confirm: false
    }
    this.phone = ''
    console.log(this.code)

  }

  generateCode() {
    if (this.phone == '' || this.phone == null) this.presentToast("No hay ningún teléfono capturado")
    this.reportService.confirmPhone(this.phone, this.folio).subscribe((response: any) => {
      this.startTimer()
      this.code.decrypted = crypto.AES.decrypt(response, 'mayito').toString(crypto.enc.Utf8)
    })
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });

    await toast.present();
  }

  startTimer() {
    setTimeout(() => {
      if (this.time.maxTime > 0) {
        this.time.maxTime -= 1;
        this.startTimer();
      }

      if (this.time.maxTime == 0) {
        this.time.loop = false;
      } else {
        this.time.loop = true;
      }

    }, 1000);
  }

  dismiss() {
    this.modalController.dismiss({ verified: false });
  }
}
