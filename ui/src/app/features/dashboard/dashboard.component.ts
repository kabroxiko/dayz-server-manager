import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  serverInfo: any = null;
  loading = true;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadServerInfo();
  }

  loadServerInfo(): void {
    this.loading = true;
    this.apiService.getServerInfo().subscribe({
      next: (info) => {
        this.serverInfo = info;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading server info:', error);
        this.loading = false;
      }
    });
  }
} 