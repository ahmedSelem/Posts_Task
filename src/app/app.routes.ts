import { Routes } from '@angular/router';

import { PostsComponent } from './posts/posts.component';
import { DetailsComponent } from './posts/details/details.component';
import { AllPostsComponent } from './posts/all-posts/all-posts.component';

export const routes: Routes = [
  { path: '', redirectTo: 'posts', pathMatch: 'full' },
  {
    path: 'posts',
    component: PostsComponent,
    title: 'Posts',
    children: [
      { path: '', component: AllPostsComponent, title: 'Posts' },
      {
        path: 'details/:id',
        component: DetailsComponent,
        title: 'Post Details',
      },
    ],
  },
];
