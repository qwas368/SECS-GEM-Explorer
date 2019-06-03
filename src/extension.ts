// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { DepNodeProvider, Dependency } from './DepNodeProvider';
import { SecsMessageProvider } from './secsMessageProvider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    let rootPath = vscode.workspace.rootPath;
    if (rootPath) {
        const nodeDependenciesProvider = new DepNodeProvider(rootPath);
	    vscode.window.registerTreeDataProvider('secs-messages', nodeDependenciesProvider);
    } else {
        let activeTextEditor = vscode.window.activeTextEditor;
        if (activeTextEditor) {
            vscode.window.registerTreeDataProvider('secs-messages', new SecsMessageProvider(activeTextEditor.document));
        }
    }
}

// this method is called when your extension is deactivated
export function deactivate() {}
