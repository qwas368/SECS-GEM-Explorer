import { Configuration } from "./model/configuration";
import * as vscode from 'vscode';

// getConfiguration's shorter
export function cfg(): Configuration {
    return getConfiguration();
}

export function getConfiguration(): Configuration {
    const config = vscode.workspace.getConfiguration("secs");
    const outConfig: Configuration = {};
    
    withConfigValue(config, outConfig, 'hideUnusedS6F11');
    withConfigValue(config, outConfig, 'hideUnusedS6F1');

    return outConfig;
}

function withConfigValue<C, K extends Extract<keyof C, string>>(
    config: vscode.WorkspaceConfiguration,
    outConfig: C,
    key: K,
): void {
    const configSetting = config.inspect<C[K]>(key);
    if (!configSetting) {
        return;
    }

    const value = config.get<C[K] | undefined>(key, undefined);
    if (typeof value !== 'undefined') {
        outConfig[key] = value;
    }
}