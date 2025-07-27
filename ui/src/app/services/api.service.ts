import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ServerInfo {
  name: string;
  status: 'online' | 'offline' | 'starting' | 'stopping';
  players: {
    current: number;
    max: number;
  };
  uptime: string;
  version: string;
  map: string;
}

export interface Player {
  id: string;
  name: string;
  ip: string;
  playtime: string;
  ping: number;
  status: 'online' | 'offline';
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getServerInfo(): Observable<ServerInfo> {
    if (environment.mockMode) {
      return of({
        name: 'DayZ Server [MOCK]',
        status: 'online',
        players: {
          current: 25,
          max: 60
        },
        uptime: '2d 14h 32m',
        version: '1.21.158570',
        map: 'Chernarus+'
      });
    }
    
    return this.http.get<ServerInfo>(`${this.baseUrl}/server-info`);
  }

  getPlayers(): Observable<Player[]> {
    if (environment.mockMode) {
      return of([
        {
          id: '1',
          name: 'TestPlayer1',
          ip: '192.168.1.100',
          playtime: '2h 45m',
          ping: 45,
          status: 'online'
        },
        {
          id: '2',
          name: 'TestPlayer2',
          ip: '192.168.1.101',
          playtime: '1h 15m',
          ping: 78,
          status: 'online'
        }
      ]);
    }
    
    return this.http.get<Player[]>(`${this.baseUrl}/players`);
  }

  getLogs(limit: number = 100): Observable<string[]> {
    if (environment.mockMode) {
      return of([
        '[12:34:56] Player TestPlayer1 connected',
        '[12:33:45] Server started',
        '[12:32:10] Config loaded successfully',
        '[12:30:00] Server starting...'
      ]);
    }
    
    return this.http.get<string[]>(`${this.baseUrl}/logs?limit=${limit}`);
  }

  kickPlayer(playerId: string): Observable<any> {
    if (environment.mockMode) {
      return of({ success: true, message: 'Player kicked (mock)' });
    }
    
    return this.http.post(`${this.baseUrl}/players/${playerId}/kick`, {});
  }

  sendCommand(command: string): Observable<any> {
    if (environment.mockMode) {
      return of({ success: true, result: `Mock response for: ${command}` });
    }
    
    return this.http.post(`${this.baseUrl}/command`, { command });
  }
} 