// UI-specific types that mirror backend types but are independent

export enum UserLevelEnum {
    admin = 'admin',
    manage = 'manage',
    moderate = 'moderate',
    view = 'view',
}

export type UserLevel = keyof typeof UserLevelEnum;

export enum DiscordChannelTypeEnum {
    admin = 'admin',
    audit = 'audit',
    direct = 'direct',
    global = 'global',
    group = 'group',
    vehicle = 'vehicle',
    megaphone = 'megaphone',
    publicAddress = 'publicAddress',
}

export type DiscordChannelType = keyof typeof DiscordChannelTypeEnum;

// Basic config interfaces for UI use
export interface Config {
    instanceId?: number;
    loglevel?: number;
    admins?: Array<{
        userId: string;
        userLevel: UserLevel;
        password?: string;
    }>;
    discordChannels?: Array<{
        mode: DiscordChannelType;
        channel: string;
    }>;
    steamApiKey?: string;
    serverCfg?: { [key: string]: any };
    serverDZ?: { [key: string]: any };
    rcon?: {
        password?: string;
        port?: number;
    };
    [key: string]: any; // Allow additional properties
} 