import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';

import { environment } from '../../../environments/environments';
import { postInterface } from '../interfaces/posts-interface';
import { commentInterface } from '../interfaces/comment-interface';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  postListChanged = new BehaviorSubject<postInterface[]>([]);
  postList : postInterface[] = [];

  constructor(private _httpClient: HttpClient) {}

  fetchAllPosts(pageStart: number, pageLimit: number) {
    const params = new HttpParams()
      .set('_start', pageStart)
      .set('_limit', pageLimit);

    this._httpClient
      .get<postInterface[]>(`${environment.apiUrl}/posts`, { params })
      .subscribe({
        next: (response) => {
          this.postList = response;
          this.postListChanged.next(this.postList);
        },
      });
  }

  fetchPostDetails(postId: number): Observable<postInterface> {
    return this._httpClient.get<postInterface>(
      `${environment.apiUrl}/posts/${postId}`
    );
  }

  fetchPostComments(postId: number): Observable<commentInterface[]> {
    const params = new HttpParams().set('postId', postId);

    return this._httpClient.get<commentInterface[]>(
      `${environment.apiUrl}/comments`,
      { params }
    );
  }

  updatePost(postUpdated: any, postIndex: number) {
    return this._httpClient.put<any>(
      `${environment.apiUrl}/posts/${postUpdated.id}`,
      { postUpdated }
    ).pipe(map((response) => {
      this.postList[postIndex] = response.postUpdated;
      this.postListChanged.next(this.postList);
    }))
  }
}
