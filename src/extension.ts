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

    // register
    registerSecsActive(context);
}

// this method is called when your extension is deactivated
export function deactivate() {}

function registerSecsActive(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.secs.active', () => {
        revealLine(3);
      });
    
      context.subscriptions.push(disposable);
}

function revealLine(line: number) {
    let reviewType: vscode.TextEditorRevealType = vscode.TextEditorRevealType.InCenter;
    if (vscode.window.activeTextEditor) {
        if (line === vscode.window.activeTextEditor.selection.active.line) {
            reviewType = vscode.TextEditorRevealType.InCenterIfOutsideViewport;
        }
        const newSe = new vscode.Selection(line, 0, line, 0);
        vscode.window.activeTextEditor.selection = newSe;
        vscode.window.activeTextEditor.revealRange(newSe, reviewType);
    } else {
        vscode.window.showWarningMessage("Reveal fail. Can't find any active text.");
    }
}

function revealPosition(line: number, column: number) {

    if (isNaN(column)) {
        revealLine(line);
    } else if(!vscode.window.activeTextEditor) { 
        vscode.window.showWarningMessage("Reveal fail. Can't find any active text.");
    } else {
        let reviewType: vscode.TextEditorRevealType = vscode.TextEditorRevealType.InCenter;
        if (line === vscode.window.activeTextEditor.selection.active.line) {
            reviewType = vscode.TextEditorRevealType.InCenterIfOutsideViewport;
        }
        const newSe = new vscode.Selection(line, column, line, column);
        vscode.window.activeTextEditor.selection = newSe;
        vscode.window.activeTextEditor.revealRange(newSe, reviewType);
    }
}