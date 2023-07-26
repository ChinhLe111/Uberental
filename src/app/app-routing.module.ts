import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { environment } from '@src/environments/environment';
import { LanguageGuard } from '@src/app/language.guard';

const routes: Routes = [
  {
    path: ':lang',
    canActivate: [LanguageGuard],
    children: [
      {
        path: 'auth',
        loadChildren: () => import('./module/auth/auth.module').then((m) => m.AuthModule),
      },
      {
        path: '',
        canActivate: [AuthGuard],
        loadChildren: () => import('./module/admin/admin.module').then((m) => m.AdminModule),
      },
    ],
  },
  { path: '**', redirectTo: localStorage.getItem('ng-language') || environment.language + '', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
