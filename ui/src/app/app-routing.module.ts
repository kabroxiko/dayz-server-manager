import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { 
    path: 'dashboard', 
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  { 
    path: 'players', 
    loadChildren: () => import('./features/players/players.module').then(m => m.PlayersModule)
  },
  { 
    path: 'logs', 
    loadChildren: () => import('./features/logs/logs.module').then(m => m.LogsModule)
  },
  { 
    path: 'settings', 
    loadChildren: () => import('./features/settings/settings.module').then(m => m.SettingsModule)
  },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
