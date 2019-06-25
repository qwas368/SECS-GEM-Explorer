import { Configuration, ParserKeyword } from "./model/configuration";
import * as vscode from 'vscode';

// getConfiguration's shorter
export function cfg(): Configuration {
    return getConfiguration();
}

export function getConfiguration(): Configuration {
    const config = vscode.workspace.getConfiguration("secs");
    const outConfig: Configuration = {
        messageSetting: {
            parserKeyword: new ParserKeyword()
        }
    };
    
    withConfigValue(config, outConfig, 'hideUnusedS6F11');
    withConfigValue(config, outConfig, 'hideUnusedS6F1');
    withConfigValue(config, outConfig, 'messageSetting');

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