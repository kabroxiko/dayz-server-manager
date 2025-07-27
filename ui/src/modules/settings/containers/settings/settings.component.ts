import { Component, OnInit } from '@angular/core';
import { Config, DiscordChannelType } from '../../../app-common/models';
import { AppCommonService } from '../../../app-common/services/app-common.service';
import { environment } from '../../../../environments/environment';
import { createLogger } from '../../../../util/logger';
import * as commentJson from 'comment-json';

// Import mock schema for development
import mockConfigSchema from '../../../../assets/mock-config-schema.json';

type ServerCfgKey = keyof typeof mockConfigSchema.definitions.ServerCfg.properties;

interface Property {
    name: string;
    description: string;
    enum?: (string | number)[];
    type: 'number' | 'string' | 'boolean';
    default: any;
    custom?: boolean;
}

@Component({
    selector: 'sb-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['settings.component.scss'],
})
export class SettingsComponent implements OnInit {

    private readonly logger = createLogger('SETTINGS');
    
    public config?: Config;
    public configString?: string;
    public readonly environment = environment;

    public constructor(
        private commonService: AppCommonService,
    ) {}

    public ngOnInit(): void {
        this.logger.info('Initializing settings component');
        
        if (environment.enableMockMode) {
            this.logger.info('Loading mock configuration data');
            this.loadMockConfig();
        } else {
            this.loadRealConfig();
        }
    }

    private loadMockConfig(): void {
        // Create a mock configuration for development
        const mockConfig = {
            admins: [{
                userId: 'mock-admin',
                userLevel: 'admin' as any,
                password: 'admin123'
            }],
            discordChannels: [
                {
                    mode: 'admin' as DiscordChannelType,
                    channel: '123456789',
                },
            ],
            steamApiKey: 'mock-steam-api-key',
            serverCfg: {
                hostname: 'Mock DayZ Server',
                maxPlayers: 60,
                passwordAdmin: 'mockadmin',
                verifySignatures: 2,
            },
            serverDZ: {
                mod: '',
                serverMod: '',
            },
            rcon: {
                password: 'mockrcon',
                port: 2302,
            },
        };

        this.config = mockConfig as unknown as Config;
        this.configString = JSON.stringify(mockConfig, null, 2);
    }

    private loadRealConfig(): void {
        this.commonService.fetchManagerConfig().subscribe(
            (configStr) => {
                if (configStr) {
                    try {
                        this.configString = configStr;
                        this.config = commentJson.parse(configStr) as unknown as Config;
                        this.logger.info('Configuration loaded successfully');
                    } catch (error) {
                        this.logger.error('Failed to parse configuration', error);
                    }
                }
            },
            (error) => {
                this.logger.error('Failed to fetch configuration', error);
            },
        );
    }

    public updateConfig(): void {
        if (!this.configString) {
            this.logger.warn('No configuration to update');
            return;
        }

        if (environment.enableMockMode) {
            this.logger.info('Mock mode: Configuration update simulated');
            try {
                this.config = commentJson.parse(this.configString) as unknown as Config;
                this.logger.info('Mock configuration updated successfully');
            } catch (error) {
                this.logger.error('Failed to parse mock configuration', error);
            }
            return;
        }

        this.commonService.updateManagerConfig(this.configString).subscribe(
            () => {
                this.logger.info('Configuration updated successfully');
                try {
                    this.config = commentJson.parse(this.configString!) as unknown as Config;
                } catch (error) {
                    this.logger.error('Failed to parse updated configuration', error);
                }
            },
            (error) => {
                this.logger.error('Failed to update configuration', error);
            },
        );
    }

    public get properties(): Property[] {
        const schema = mockConfigSchema.definitions.ServerCfg.properties;
        const known: Property[] = [];
        
        for (const key in schema) {
            if (schema.hasOwnProperty(key)) {
                const prop = schema[key as keyof typeof schema];
                known.push({
                    name: key,
                    description: prop.description || '',
                    enum: 'enum' in prop ? prop.enum as (string | number)[] : undefined,
                    type: prop.type as 'number' | 'string' | 'boolean',
                    default: prop.default,
                    custom: false,
                });
            }
        }

        // Add unknown properties from actual config
        const unknown: Property[] = [];
        if (this.config?.serverCfg) {
            for (const key in this.config.serverCfg) {
                if (this.config.serverCfg.hasOwnProperty(key) && !schema.hasOwnProperty(key)) {
                    const value = (this.config.serverCfg as any)[key];
                    unknown.push({
                        name: key,
                        description: 'Custom property',
                        type: typeof value === 'number' ? 'number' : 
                              typeof value === 'boolean' ? 'boolean' : 'string',
                        default: value,
                        custom: true,
                    });
                }
            }
        }

        return [...known, ...unknown];
    }

    public getChannelModes(): string[] {
        return ['admin', 'audit', 'direct', 'global', 'group', 'vehicle', 'megaphone', 'publicAddress'];
    }

    public trackByProperty(index: number, property: Property): string {
        return property.name;
    }

    public getServerCfgValue(propertyName: string): any {
        if (!this.config?.serverCfg) {
            return undefined;
        }
        return (this.config.serverCfg as any)[propertyName];
    }

    public updateServerCfgProperty(propertyName: string, value: any): void {
        if (!this.config?.serverCfg) {
            return;
        }
        
        (this.config.serverCfg as any)[propertyName] = value;
        this.logger.debug(`Updated server cfg property: ${propertyName} = ${value}`);
        
        // Update the config string as well
        if (this.config) {
            this.configString = JSON.stringify(this.config, null, 2);
        }
    }

    public addDiscordChannel(): void {
        if (!this.config?.discordChannels) {
            if (this.config) {
                this.config.discordChannels = [];
            }
            return;
        }
        
        this.config.discordChannels.push({
            channel: '',
            mode: 'admin' as DiscordChannelType,
        });
        this.logger.debug('Added new discord channel');
    }

    public removeDiscordChannel(index: number): void {
        if (!this.config?.discordChannels) {
            return;
        }
        
        this.config.discordChannels.splice(index, 1);
        this.logger.debug(`Removed discord channel at index ${index}`);
    }
}
