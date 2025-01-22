import { inject, Injectable } from '@angular/core'
import { color } from 'bun'
import { NgxSpinnerService } from 'ngx-spinner'

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  lodingRequestCount = 0;
  private spinner = inject(NgxSpinnerService);
  constructor() { }
  loading() {
    this.lodingRequestCount++
    this.spinner.show(undefined, {})
    type: "pacman"
    bdColor: "rgba(255, 0, 0, 0.8)"
    color: 'rgba(255, 255, 255, 0.8)'
    fullScreen: true
  }
  idle() {
    this.lodingRequestCount--
    if (this.lodingRequestCount <= 0) {
      this.lodingRequestCount = 0
      this.spinner.hide()
    }
  }
}
