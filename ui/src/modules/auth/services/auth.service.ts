import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserLevel } from '../../app-common/models';
import { MockDataService } from '../../app-common/services/mock-data.service';
import { environment } from '../../../environments/environment';
import { createLogger } from '../../../util/logger';

@Injectable({ providedIn: 'root' })
export class AuthService {

    private static readonly AUTH_STORAGE_KEY = 'server-manager-auth';
    private static readonly LEVEL_STORAGE_KEY = 'server-manager-level';

    private authHeader: string | null = null;
    private level: UserLevel | null = null;
    private readonly logger = createLogger('AUTH');

    public constructor(
        private httpClient: HttpClient,
        private router: Router,
        private mockService: MockDataService,
    ) {
        this.authHeader = localStorage.getItem(AuthService.AUTH_STORAGE_KEY);
        this.level = localStorage.getItem(AuthService.LEVEL_STORAGE_KEY) as UserLevel;

        if (this.authHeader) {
            this.validateLogin(this.authHeader).then(
                () => {
                    this.logger.info('Login validated successfully');
                    if (this.router.url.includes('login')) {
                        void this.router.navigate(['/dashboard']);
                    }
                },
                (err) => {
                    this.logger.error('Login validation failed', err);
                    void this.logout();
                },
            );
        }
    }

    public getAuth(): string | null {
        return this.authHeader;
    }

    public getLevel(): UserLevel | null {
        return this.level;
    }

    public async login(user: string, password: string, remember?: boolean): Promise<void> {
        const auth = `Basic ${btoa(`${user}:${password}`)}`;
        await this.validateLogin(auth, remember);
    }

    private async validateLogin(auth: string, remember?: boolean): Promise<void> {
        if (environment.enableMockMode) {
            try {
                // Extract username and password from Basic auth
                const decoded = atob(auth.replace('Basic ', ''));
                const [username, password] = decoded.split(':');
                
                const mockResp = await this.mockService.login(username, password).toPromise();
                this.authHeader = auth;
                this.level = mockResp?.level as UserLevel;
                
                if (remember) {
                    localStorage.setItem(AuthService.AUTH_STORAGE_KEY, auth);
                    localStorage.setItem(AuthService.LEVEL_STORAGE_KEY, this.level || '');
                }
                
                this.logger.info('Mock login successful', { username, level: this.level });
                return;
            } catch (error) {
                this.logger.error('Mock login failed', error);
                throw new Error('Login failed');
            }
        }

        try {
            const apiUrl = environment.apiBaseUrl ? `${environment.apiBaseUrl}/api/login` : `/api/login`;
            const resp = await this.httpClient.post(
                apiUrl,
                null,
                {
                    headers: {
                        Authorization: auth,
                    },
                    observe: 'response',
                    responseType: 'text',
                },
            ).toPromise();

            if (!resp?.ok) {
                throw new Error('Login failed');
            }

            this.authHeader = auth;
            this.level = resp.body as UserLevel;
            
            if (remember) {
                localStorage.setItem(AuthService.AUTH_STORAGE_KEY, auth);
                localStorage.setItem(AuthService.LEVEL_STORAGE_KEY, this.level || '');
            }
            
            this.logger.info('Login successful', { level: this.level });
        } catch (error) {
            this.logger.error('Login validation failed', error);
            throw new Error('Login failed');
        }
    }

    public async logout(): Promise<void> {
        this.logger.info('User logging out');
        this.authHeader = null;
        this.level = null;
        localStorage.removeItem(AuthService.AUTH_STORAGE_KEY);
        localStorage.removeItem(AuthService.LEVEL_STORAGE_KEY);
        void this.router.navigate(['/login']);
    }

    public getAuthHeaders(): { [k: string]: string } {
        if (!this.authHeader) {
            this.logger.warn('Attempting to get auth headers but no auth token available');
            return {};
        }
        
        return {
            Authorization: this.authHeader,
        };
    }

    public isAuthenticated(): boolean {
        return !!this.authHeader;
    }

    public hasLevel(requiredLevel: UserLevel): boolean {
        if (!this.level) {
            return false;
        }
        
        const levels: UserLevel[] = ['admin', 'manage', 'moderate', 'view'];
        const userLevelIndex = levels.indexOf(this.level);
        const requiredLevelIndex = levels.indexOf(requiredLevel);
        
        return userLevelIndex !== -1 && requiredLevelIndex !== -1 && userLevelIndex <= requiredLevelIndex;
    }
}
