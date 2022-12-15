import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { PhotoInterface } from '../interfaces/photo-interface';


@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public photo: PhotoInterface;

  constructor() { }

  async selectImage() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
      quality: 100,
    });

    this.photo = {
      filepath: "soon...",
      webviewPath: capturedPhoto.webPath
    };

    // Save the picture and add it to photo collection
    return await this.readAsBase64(capturedPhoto);  
  }

  private async readAsBase64(photo: Photo) {
    // Fetch the photo, read as a blob, then convert to base64 format
    const response = await fetch(photo.webPath);
    const blob = await response.blob();
  
    return await this.convertBlobToBase64(blob) as string;
  }
  
  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });


}
