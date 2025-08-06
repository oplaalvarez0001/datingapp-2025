import { Routes } from '@angular/router';
import { MemberDetailed } from '../features/members/member-detailed/member-detailed';
import { MemberList } from '../features/members/member-list/member-list';
import { Home } from '../features/home/home';
import { Lists } from '../features/lists/lists';
import { Messages } from '../features/messages/messages';
import { authGuard } from '../core/guards/auth-guard';

export const routes: Routes = [
  { path: '', component: Home, pathMatch: 'full' },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      {
        path: 'members',
        component: MemberList,
        canActivate: [authGuard],
        pathMatch: 'full',
      },
      { path: 'members/:id', component: MemberDetailed, pathMatch: 'full' },
      { path: 'lists', component: Lists, pathMatch: 'full' },
      { path: 'messages', component: Messages, pathMatch: 'full' },
    ],
  },
  { path: '**', component: Home, pathMatch: 'full' },
];
