const fetch = require('node-fetch');
import { injectable, singleton } from 'tsyringe';

export interface DayzopsConfig {
    baseUrl: string; // e.g. http://localhost:8000
}

@singleton()
@injectable()
export class DayzopsClient {
    private cfg: DayzopsConfig;

    public constructor() {
        // default; override by setting in DI if desired
        this.cfg = { baseUrl: process.env.DAYZOPS_URL || 'http://localhost:8000' };
    }

    public setConfig(cfg: DayzopsConfig) {
        this.cfg = cfg;
    }

    private async post(path: string, body: any) {
        const url = `${this.cfg.baseUrl}${path}`;
        const resp = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        if (!resp.ok) {
            const text = await resp.text();
            throw new Error(`dayzops API error: ${resp.status} ${text}`);
        }
        return resp.json();
    }

    public async update(configPath: string) {
        return this.post('/update', { path: configPath });
    }

    public async apply(configPath: string) {
        return this.post('/apply', { path: configPath });
    }

    public async rollback(configPath: string) {
        return this.post('/rollback', { path: configPath });
    }

    public async prune(configPath: string) {
        return this.post('/prune', { path: configPath });
    }
    public async backup(configPath: string) {
        return this.post('/backup', { path: configPath });
    }

    public async listBackups(configPath: string) {
        const url = `${this.cfg.baseUrl}/backups?path=${encodeURIComponent(configPath)}`;
        const resp = await fetch(url);
        if (!resp.ok) {
            const text = await resp.text();
            throw new Error(`dayzops API error: ${resp.status} ${text}`);
        }
        return resp.json();
    }
}
