import { Injectable, ErrorHandler } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { createLogger } from '../../../util/logger';

export interface AppError {
    message: string;
    code?: string;
    details?: any;
    timestamp: number;
    userFriendly: boolean;
}

@Injectable({ providedIn: 'root' })
export class AppErrorHandlerService implements ErrorHandler {
    
    private readonly logger = createLogger('ERROR_HANDLER');
    private readonly userFriendlyMessages = new Map<string, string>([
        ['NETWORK_ERROR', 'Unable to connect to the server. Please check your connection.'],
        ['AUTH_ERROR', 'Authentication failed. Please log in again.'],
        ['PERMISSION_ERROR', 'You do not have permission to perform this action.'],
        ['VALIDATION_ERROR', 'The data provided is invalid. Please check your input.'],
        ['SERVER_ERROR', 'A server error occurred. Please try again later.'],
        ['NOT_FOUND', 'The requested resource was not found.'],
        ['TIMEOUT', 'The request timed out. Please try again.'],
    ]);

    public handleError(error: any): void {
        const appError = this.processError(error);
        this.logError(appError, error);
        
        // In development, also log to console for easier debugging
        if (!environment.production) {
            console.error('Application Error:', appError, error);
        }
        
        // TODO: Implement user notification system (toasts, modals, etc.)
        this.notifyUser(appError);
    }

    public handleHttpError(error: HttpErrorResponse): Observable<never> {
        const appError = this.processHttpError(error);
        this.logError(appError, error);
        
        // TODO: Implement user notification system
        this.notifyUser(appError);
        
        return throwError(appError);
    }

    public createError(message: string, code?: string, details?: any, userFriendly = true): AppError {
        return {
            message,
            code,
            details,
            timestamp: Date.now(),
            userFriendly,
        };
    }

    private processError(error: any): AppError {
        if (error instanceof HttpErrorResponse) {
            return this.processHttpError(error);
        }

        if (error instanceof Error) {
            return {
                message: error.message,
                code: error.name,
                details: { stack: error.stack },
                timestamp: Date.now(),
                userFriendly: false,
            };
        }

        if (typeof error === 'string') {
            return {
                message: error,
                timestamp: Date.now(),
                userFriendly: true,
            };
        }

        return {
            message: 'An unexpected error occurred',
            code: 'UNKNOWN_ERROR',
            details: error,
            timestamp: Date.now(),
            userFriendly: true,
        };
    }

    private processHttpError(error: HttpErrorResponse): AppError {
        let code = 'HTTP_ERROR';
        let message = 'An error occurred while communicating with the server';
        let userFriendly = true;

        switch (error.status) {
            case 0:
                code = 'NETWORK_ERROR';
                message = 'Unable to connect to the server';
                break;
            case 400:
                code = 'VALIDATION_ERROR';
                message = 'Invalid request data';
                break;
            case 401:
                code = 'AUTH_ERROR';
                message = 'Authentication required';
                break;
            case 403:
                code = 'PERMISSION_ERROR';
                message = 'Access denied';
                break;
            case 404:
                code = 'NOT_FOUND';
                message = 'Resource not found';
                break;
            case 408:
                code = 'TIMEOUT';
                message = 'Request timed out';
                break;
            case 500:
                code = 'SERVER_ERROR';
                message = 'Internal server error';
                break;
            case 502:
            case 503:
            case 504:
                code = 'SERVER_ERROR';
                message = 'Server temporarily unavailable';
                break;
            default:
                code = `HTTP_${error.status}`;
                message = error.message || `HTTP ${error.status} error`;
                userFriendly = false;
        }

        // Try to extract more specific error message from response
        if (error.error) {
            if (typeof error.error === 'string') {
                message = error.error;
            } else if (error.error.message) {
                message = error.error.message;
            } else if (error.error.error) {
                message = error.error.error;
            }
        }

        return {
            message,
            code,
            details: {
                status: error.status,
                statusText: error.statusText,
                url: error.url,
                body: error.error,
            },
            timestamp: Date.now(),
            userFriendly,
        };
    }

    private logError(appError: AppError, originalError: any): void {
        this.logger.error(
            `${appError.code ? `[${appError.code}] ` : ''}${appError.message}`,
            {
                error: appError,
                original: originalError,
                stack: originalError?.stack,
            }
        );
    }

    private notifyUser(error: AppError): void {
        // TODO: Implement proper user notification system
        // For now, just log a user-friendly message
        if (error.userFriendly) {
            const friendlyMessage = this.userFriendlyMessages.get(error.code || '') || error.message;
            this.logger.warn('User notification would be shown:', friendlyMessage);
        }
    }

    public getUserFriendlyMessage(error: AppError): string {
        if (!error.userFriendly) {
            return 'An unexpected error occurred. Please try again or contact support.';
        }

        return this.userFriendlyMessages.get(error.code || '') || error.message;
    }
} 