import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {
  logs: string[] = [];
  loading = true;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.loading = true;
    this.apiService.getLogs().subscribe({
      next: (logs) => {
        this.logs = logs;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading logs:', error);
        this.loading = false;
      }
    });
  }
} 