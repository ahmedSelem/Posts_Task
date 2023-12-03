import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

import { postInterface } from '../../core/interfaces/posts-interface';
import { PostsService } from '../../core/services/posts.service';
import { commentInterface } from '../../core/interfaces/comment-interface';
import { SubDestroyService } from '../../core/services/sub-destroy-service';
import { SpinnerComponent } from '../../core/shared/components/spinner/spinner.component';
import { LoadingService } from '../../core/services/loading.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [RouterModule, SpinnerComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent implements OnInit {
  postId!: number;
  postDetails!: postInterface;
  postComments: commentInterface[] = [];
  isLoading!: boolean; 

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _postService: PostsService,
    private _destroy$: SubDestroyService,
    private _loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this._activatedRoute.params.subscribe((parms) => {
      this.postId = +parms['id'];
    });

    this.onFetchPostDetails();
    this.onFetchPostComments();
    this.onGetLoadingStatus();
  }

  onGetLoadingStatus() {
    this._loadingService.isLoading
      .pipe(takeUntil(this._destroy$))
      .subscribe((status) => {
        this.isLoading = status;
      });
  }

  onFetchPostDetails() {
    this._postService
      .fetchPostDetails(this.postId)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (response: any) => {
          this.postDetails = response;
        },
      });
  }

  onFetchPostComments() {
    this._postService
      .fetchPostComments(this.postId)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (response: any) => {
          this.postComments = response;
        },
      });
  }
}
