import { NavigationExtras, Router } from '@angular/router'
import { inject, Injectable } from '@angular/core'
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar'
import { throwError } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  private router = inject(Router)
  private snackBar = inject(MatSnackBar)
  private snackBarConfig: MatSnackBarConfig = {
    verticalPosition: 'top',
    horizontalPosition: 'center'
  }
  constructor() { }

  handleError(err: any) {
    if (err) {
      switch (err.status) {
        case 400:
          this.snackBar.open('ฉันคืออัลเฟน็อค', 'OK', this.snackBarConfig)
          break
        case 404:
          this.router.navigate(['/404'])
          break

        case 500:
        case 501:
        case 502:
        case 503:
        case 504:
        case 505:
        case 506:
        case 507:
        case 508:
        case 509:
        case 510:
        case 511:
          if (err.error.message === 'Token has expired') {
            this.router.navigate(['/'])
          }
          const navExtra: NavigationExtras = {
            state: {
              message: err.error,
              code: err.status
            }
          }
          this.router.navigate(['/server-error'], navExtra)
          break
        default:
          this.snackBar.open('something went wrong dont try again', 'close', this.snackBarConfig)
          break
      }
    }
    return throwError(() => err)
  }
}