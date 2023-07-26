import { Injectable } from '@angular/core';
declare let Swal: any;

@Injectable({
  providedIn: 'root',
})
export class Message {
  success(message: string): any {
    return Swal.fire({
      icon: 'success',
      title: 'Success',
      text: message,
      showConfirmButton: false,
      timer: 1500,
    });
  }

  error(message: string): any {
    return Swal.fire({
      icon: 'error',
      title: 'Fail',
      text: message,
    });
  }
}
