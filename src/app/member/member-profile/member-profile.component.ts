import { Component, inject } from '@angular/core'
import { User } from '../../_models/user'
import { GalleryModule, GalleryItem } from 'ng-gallery'
import { MemberService } from '../../_services/member.service'
import { Photo } from '../../_models/photo'
import { ActivatedRoute, Router } from '@angular/router'
import { MatSidenavModule } from '@angular/material/sidenav'
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { RouterModule } from '@angular/router'

@Component({
  selector: 'app-member-profile',
  imports: [GalleryModule, MatSidenavModule, BrowserModule, RouterModule],
  templateUrl: './member-profile.component.html',
  styleUrls: ['./member-profile.component.scss']
})

export class MemberProfileComponent {
  member !: User
  images: GalleryItem[] = []
  memberService = inject(MemberService)
  activeRoute = inject(ActivatedRoute)
  router = inject(Router)


  private initGallreyItem(photos: Photo[]) {
    for (const photo of photos) {
      this.images.push({})
    }
  }

  async getMember() {
    const username = this.activeRoute.snapshot.paramMap.get('username')
    if (!username) return
    const member = await this.memberService.getMember(username)
    if (!member) {
      this.router.navigate(['404'])
    } else {
      this.member = member
      if (this.member.photos) {
        this.initGallreyItem(this.member.photos)
      }
    }
  }

  ngOnInit() {
    this.getMember()
  }
}
