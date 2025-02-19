import { computed, inject, Injectable, signal, Signal } from '@angular/core'
import { User } from '../_models/user'
import { AccountService } from './account.service'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { Paginator, UserQueryPagination } from '../_models/pagination'
import { default_paginator } from '../_models/pagination'
import { cacheManager } from '../_helper/cache'
import { pareQuery } from '../_helper/helper'

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  user: Signal<User | undefined>
  following = signal<Paginator<UserQueryPagination, User>>(default_paginator)
  followers = signal<Paginator<UserQueryPagination, User>>(default_paginator)

  _http: HttpClient = inject(HttpClient)
  accountservice: AccountService = inject(AccountService)
  private baseurl = environment.baseUrl + 'api/like/'
  constructor() {
    this.user = computed(() => this.accountservice.data()?.user)
  }
  public IsfollowingMember(id: string): boolean {
    const user = this.user()
    if (!user) return false
    const following = (user.following as string[])
    return following.includes(id)
  }

  toggleLike(target_id: string): boolean {
    const user = this.user()
    if (!user) return false
    const url = this.baseurl
    this._http.put(url, { target_id }).subscribe()
    const following = (user.following as string[])
    const isfollowingtarget = following.includes(target_id)
    if (isfollowingtarget) {
      console.log(`unliking ${target_id}`)
      user.following = following.filter(id => id !== target_id)

    } else {
      console.log(`like ${target_id}`)
      following.push(target_id)
      user.following = following

    }
    this.accountservice._setuser(user)
    return user.following.includes(target_id)
  }

  getDetaFromApi(type: 'following' | 'follower') {
    const setSignal = (cacheData: Paginator<UserQueryPagination, User>) => {
      if (type === 'following')
        this.following.set(cacheData)
      else
        this.followers.set(cacheData)
      return
    }
    const pagination = type === 'following' ? this.following().pagination : this.followers().pagination
    const key = cacheManager.createKey(pagination)
    const cacheData = cacheManager.load(key, type)
    if (cacheData) {
      console.log('loading ${type} from CACHE😏')
      setSignal(cacheData)
    }
    console.log('loading ${type} from API😏')
    const url = this.baseurl + type + pareQuery(pagination)
    this._http.get<Paginator<UserQueryPagination, User>>(url).subscribe({
      next: respone => {
        const key = cacheManager.createKey(respone.pagination)
        cacheManager.save(key, respone, type)
        this.following.set(respone)
      }
    })
  }
  getFollowing() {
    this.getDetaFromApi('following')
  }
  getFollowers() {
    this.getDetaFromApi('follower')
  }
}