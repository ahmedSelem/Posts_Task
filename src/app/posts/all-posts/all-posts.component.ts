import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';

import { postInterface } from '../../core/interfaces/posts-interface';
import { PostsService } from '../../core/services/posts.service';
import { SubDestroyService } from '../../core/services/sub-destroy-service';
import { EditPostComponent } from '../edit-post/edit-post.component';
import { LoadingService } from '../../core/services/loading.service';
import { SpinnerComponent } from '../../core/shared/components/spinner/spinner.component';

@Component({
  selector: 'app-all-posts',
  standalone: true,
  imports: [CommonModule, RouterModule, SpinnerComponent],
  templateUrl: './all-posts.component.html',
  styleUrl: './all-posts.component.scss',
})
export class AllPostsComponent implements OnInit {
  postsList: postInterface[] = [];
  paginationNum: any[] = [];
  currentNumPage: number = 0;
  isLoading!: boolean;

  constructor(
    private _postService: PostsService,
    private _destroy$: SubDestroyService,
    private _bsModalService: BsModalService,
    private _loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.paginationNum = new Array(5).fill(' ').map((index, num) => num + 1);
    
    this.onFetchPosts();

    this.onGetLoadingStatus();
  }

  onGetLoadingStatus() {
    this._loadingService.isLoading
      .pipe(takeUntil(this._destroy$))
      .subscribe((status) => {
        this.isLoading = status;
      });
  }

  onFetchPosts(pageStart: number = 0, pageLimit: number = 5) {
    this._postService.fetchAllPosts(pageStart, pageLimit);

    this._postService.postListChanged
      .pipe(takeUntil(this._destroy$))
      .subscribe((response) => {
        this.postsList = response;
        this.currentNumPage = pageStart
      });
  }

  openModal(postItem: postInterface, postIndex: number) {
    const initialState = { post: postItem, postIndex : postIndex };
    this._bsModalService.show(EditPostComponent, {
      class: 'modal-md',
      initialState,
    });
  }

  onNextPage() {
    if (this.currentNumPage < 4) {
      this.onFetchPosts(++this.currentNumPage);
    }
  }

  onPrevPage() {
    if (this.currentNumPage >= 1) {
      this.onFetchPosts(--this.currentNumPage);
    }
  }
}
