import { computed, inject, Injectable, Signal } from '@angular/core'
import { AccountService } from './account.service'
import { User } from '../_models/user'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { sleep } from 'bun'

@Injectable({
  providedIn: 'root'
})
export class LikeService {

  user: Signal<User | undefined>
  http: HttpClient = inject(HttpClient)
  accountService: AccountService = inject(AccountService)
  private baseApiurl = environment.baseUrl + 'api/like/'

  constructor() {
    this.user = computed(() => this.accountService.data()?.user)
  }

  public IsFollowing(id: string): boolean {
    const user = this.user()
    if (!user) return false
    const following = (user.following as string[])
    return following.includes(id)
  }

  toggleLike(target_id: string) {
    const user = this.user()
    if (!user) return
    const url = this.baseApiurl
    this.http.put(url, { target_id }).subscribe()
    const following = (user.following as string[])
    const isFollowingTarget = following.includes(target_id)
    if (isFollowingTarget) {
      console.log('remov $ {target_id} from following')
      user.following = following.filter(id => id !== target_id)
    } else {
      console.log('add $ {target_id} to following')
      following.push(target_id)
      user.following = following
    }
    this.accountService.SetuUSer(user)
    return user.following.includes(target_id)
  }
}
