import { Component, inject, Inject, input, OnInit } from '@angular/core'
import { User } from '../../_models/user'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { LikeService } from '../../_services/like.service'
import { cacheManager } from '../../_helper/cache'

@Component({
  selector: 'app-member-card',
  imports: [MatButtonModule, MatCardModule],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.scss'
})

export class MemberCardComponent implements OnInit {
  likeService = inject(LikeService)
  member = input.required<User>()
  isFollowing: boolean = false
  profiel: any

  ngOnInit(): void {
    const member = this.member()
    if (!member || !member.id) return
    this.isFollowing = this.likeService.IsFollowing(member.id)
    cacheManager.clear('all')
  }

  toggleLike() {
    const member = this.member()
    if (!member || !member.id) return
    this.isFollowing = this.likeService.IsFollowing(member.id)
    this.likeService.toggleLike(member.id)
  }

}
