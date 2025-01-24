import { HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { AccountService } from '../_services/account.service'

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const accountService = inject(AccountService)
  const token = accountService.data()?.token
  if (token) {
    req = req.clone({
      setHeaders: {
        authorization: `Bearer ` + accountService.data()?.token
      }
    })
  }
  return next(req)
}
