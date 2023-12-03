import { takeUntil } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

import { postInterface } from '../../core/interfaces/posts-interface';
import { PostsService } from '../../core/services/posts.service';
import { SubDestroyService } from '../../core/services/sub-destroy-service';
import { LoadingService } from '../../core/services/loading.service';
import { PlaceholderComponent } from '../../core/shared/components/placeholder/placeholder.component';

@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [ReactiveFormsModule, PlaceholderComponent],
  templateUrl: './edit-post.component.html',
  styleUrl: './edit-post.component.scss',
})
export class EditPostComponent implements OnInit {
  editForm!: FormGroup;
  post!: postInterface;
  postIndex!: number;
  isLoading!: boolean;

  constructor(
    private _postService: PostsService,
    private _bsModalRef: BsModalService,
    private _destroy$: SubDestroyService,
    private _loadingService: LoadingService,
    private _toasterService: ToastrService
  ) {}

  ngOnInit(): void {
    this.editForm = new FormGroup({
      title: new FormControl(this.post.title, [Validators.required]),
      body: new FormControl(this.post.body, [Validators.required]),
    });
    this.onGetLoadingStatus();
  }

  onGetLoadingStatus() {
    this._loadingService.isLoading
      .pipe(takeUntil(this._destroy$))
      .subscribe((status) => {
        this.isLoading = status;
      });
  }

  onUpdatePost() {
    const postObj = {
      userId: this.post.userId,
      id: this.post.id,
      title: this.editForm.value.title,
      body: this.editForm.value.body,
    };

    this._postService
      .updatePost(postObj, this.postIndex)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (_) => {
          this._toasterService.success('Post Update Successfully!');
          this.onClose();
        },
      });
  }

  onClose() {
    this._bsModalRef.hide();
  }
}
