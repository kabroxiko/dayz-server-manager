import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { 
    ServerInfo, 
    MetricWrapper, 
    SystemReport, 
    LogTypeEnum, 
    MetricTypeEnum, 
    UserLevelEnum,
    LogMessage
} from '../models';

export interface MockPlayerInfo {
    id: string;
    name: string;
    beguid: string;
    ip: string;
    country: string;
    online: boolean;
    playtime: number;
    kills: number;
    deaths: number;
    lastSeen: number;
}

@Injectable({ providedIn: 'root' })
export class MockDataService {

    private readonly mockServerInfo: ServerInfo = {
        name: 'Mock DayZ Server',
        port: 2302,
        worldName: 'chernarusplus',
        password: false,
        battleye: true,
        maxPlayers: 60,
    };

    private readonly mockSystemMetrics: MetricWrapper<SystemReport>[] = [
        {
            timestamp: Date.now() - 300000,
            value: new SystemReport(),
        },
        {
            timestamp: Date.now() - 240000,
            value: new SystemReport(),
        },
    ];

    private readonly mockPlayers: MockPlayerInfo[] = [
        {
            id: '1',
            name: 'TestPlayer1',
            beguid: '12345678901234567890',
            ip: '192.168.1.100',
            country: 'US',
            online: true,
            playtime: 7200000, // 2 hours
            kills: 5,
            deaths: 2,
            lastSeen: Date.now(),
        },
        {
            id: '2',
            name: 'TestPlayer2',
            beguid: '09876543210987654321',
            ip: '192.168.1.101',
            country: 'CA',
            online: true,
            playtime: 3600000, // 1 hour
            kills: 2,
            deaths: 1,
            lastSeen: Date.now() - 300000,
        },
    ];

    private readonly mockLogs: LogMessage[] = [
        {
            timestamp: Date.now() - 60000,
            message: 'Player TestPlayer1 connected',
        },
        {
            timestamp: Date.now() - 120000,
            message: 'Server started successfully',
        },
        {
            timestamp: Date.now() - 180000,
            message: 'Low disk space warning',
        },
    ];

    public getServerInfo(): Observable<ServerInfo> {
        if (!environment.enableMockMode) {
            return throwError('Mock mode is disabled');
        }
        
        return of(this.mockServerInfo).pipe(
            delay(environment.mockDelay)
        );
    }

    public getSystemMetrics(): Observable<MetricWrapper<SystemReport>[]> {
        if (!environment.enableMockMode) {
            return throwError('Mock mode is disabled');
        }
        
        return of(this.mockSystemMetrics).pipe(
            delay(environment.mockDelay)
        );
    }

    public getPlayers(): Observable<MockPlayerInfo[]> {
        if (!environment.enableMockMode) {
            return throwError('Mock mode is disabled');
        }
        
        return of(this.mockPlayers).pipe(
            delay(environment.mockDelay)
        );
    }

    public getLogs(type: LogTypeEnum, since?: number): Observable<LogMessage[]> {
        if (!environment.enableMockMode) {
            return throwError('Mock mode is disabled');
        }
        
        const filteredLogs = this.mockLogs.filter(log => 
            !since || log.timestamp > since
        );
        
        return of(filteredLogs).pipe(
            delay(environment.mockDelay)
        );
    }

    public login(username: string, password: string): Observable<{ level: string }> {
        if (!environment.enableMockMode) {
            return throwError('Mock mode is disabled');
        }
        
        // Mock successful login for demo purposes
        if (username === 'admin' && password === 'admin') {
            return of({ level: UserLevelEnum.admin }).pipe(
                delay(environment.mockDelay)
            );
        } else if (username === 'user' && password === 'user') {
            return of({ level: UserLevelEnum.moderate }).pipe(
                delay(environment.mockDelay)
            );
        } else {
            return throwError('Invalid credentials').pipe(
                delay(environment.mockDelay)
            );
        }
    }

    public executeCommand(command: string): Observable<string> {
        if (!environment.enableMockMode) {
            return throwError('Mock mode is disabled');
        }
        
        const mockResponse = `Mock response for command: ${command}`;
        return of(mockResponse).pipe(
            delay(environment.mockDelay)
        );
    }

    public saveFile(path: string, content: string): Observable<string> {
        if (!environment.enableMockMode) {
            return throwError('Mock mode is disabled');
        }
        
        return of('File saved successfully (mock)').pipe(
            delay(environment.mockDelay)
        );
    }

    public getFile(path: string): Observable<string> {
        if (!environment.enableMockMode) {
            return throwError('Mock mode is disabled');
        }
        
        const mockContent = `// Mock file content for: ${path}\n// This is generated mock data`;
        return of(mockContent).pipe(
            delay(environment.mockDelay)
        );
    }

    public kickPlayer(playerId: string): Observable<string> {
        if (!environment.enableMockMode) {
            return throwError('Mock mode is disabled');
        }
        
        return of(`Player ${playerId} kicked successfully (mock)`).pipe(
            delay(environment.mockDelay)
        );
    }

    public banPlayer(playerId: string, reason?: string): Observable<string> {
        if (!environment.enableMockMode) {
            return throwError('Mock mode is disabled');
        }
        
        return of(`Player ${playerId} banned successfully (mock)${reason ? ` - Reason: ${reason}` : ''}`).pipe(
            delay(environment.mockDelay)
        );
    }
} 