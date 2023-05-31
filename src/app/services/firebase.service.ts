import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  public uploadPercent: Observable<number>

  constructor(
    private storage: AngularFireStorage,
    private loadingService: LoadingService
  ) { }

  uploadImage(path: string, data: string, name: string) {
    return new Promise(resolve => {

      this.loadingService.showLoading()
      const filepath = `${path}/${name}`
      const ref = this.storage.ref(filepath)
      const task = ref.put(data)
      this.uploadPercent = task.percentageChanges();

      task.snapshotChanges().pipe(
        finalize(() => {
          ref.getDownloadURL().subscribe(res => {
            const downloadURL = res
            this.loadingService.dismissLoading()
            resolve(downloadURL)
          })
        }
        )).subscribe();

    })
  }
}
