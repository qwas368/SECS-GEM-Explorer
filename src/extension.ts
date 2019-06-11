// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { SecsMessageProvider, MessageItem, FileItem } from './secsMessageProvider';
import { SecsMessage } from './model/secsMessage';
import { TextDecoder } from 'util';

var secsMessageProvider: SecsMessageProvider;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // init
    secsMessageProvider = new SecsMessageProvider();

    // register
    vscode.window.registerTreeDataProvider('secs-messages', secsMessageProvider);
    vscode.commands.registerCommand("extension.secs.explore.file", () => explore());
    vscode.commands.registerCommand("extension.secs.explore.folder", () => exploreFolder());
    vscode.commands.registerCommand('extension.revealLine', (p1: vscode.Position, p2: vscode.Position, t1: vscode.TextDocument) =>  {
        revealTextDocument(t1);
        revealPosition(p1, p2);
    });
    vscode.commands.registerCommand('extension.secs.setting', () =>  {
        vscode.window.showQuickPick(['1', '2', '3']).then(x => {
            vscode.window.showInformationMessage(x!);
        });
    });
}

// this method is called when your extension is deactivated
export function deactivate() {}

function explore() {
    if (vscode.window.activeTextEditor) {
        let fileItem = new FileItem(vscode.window.activeTextEditor.document, 
            vscode.TreeItemCollapsibleState.Collapsed);
        secsMessageProvider.addTreeItem(fileItem);
        secsMessageProvider.refresh();
    } else {
        vscode.window.showWarningMessage("No active text.");
    }
}

function exploreFolder() {
    if (vscode.workspace.workspaceFolders) {
        vscode.workspace.workspaceFolders.forEach((folder) => {
            vscode.workspace.findFiles(new vscode.RelativePattern(folder, '*'))
                .then((uris) => uris.map(uri => vscode.workspace.openTextDocument(uri)))
                .then(textDocuments => Promise.all(textDocuments))
                .then(textDocuments => {
                    textDocuments.forEach(textDocument => {
                        let fileItem = new FileItem(textDocument, 
                            vscode.TreeItemCollapsibleState.Collapsed);
                        secsMessageProvider.addTreeItem(fileItem);
                    });
                    secsMessageProvider.refresh();
                });
        });
    }
}

export function revealLine(line: number) {
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

export function revealTextDocument(textDocument : vscode.TextDocument) {
    vscode.window.showTextDocument(textDocument);
}

export function revealPosition(position1: vscode.Position, position2: vscode.Position) {

    if(!vscode.window.activeTextEditor) { 
        vscode.window.showWarningMessage("Reveal fail. Can't find any active text.");
    } else {
        let reviewType: vscode.TextEditorRevealType = vscode.TextEditorRevealType.InCenter;
        if (position1.line === vscode.window.activeTextEditor.selection.active.line) {
            reviewType = vscode.TextEditorRevealType.InCenterIfOutsideViewport;
        }
        const newSe = new vscode.Selection(position1, position2);
        vscode.window.activeTextEditor.selection = newSe;
        vscode.window.activeTextEditor.revealRange(newSe, reviewType);
    }
}

export function parseSecsMessage(textDocument : vscode.TextDocument) : [SecsMessage, vscode.Position, vscode.Position][] {
    let re = /(?<header>\S*):\s*(?<command>'[s,S]\d{1,2}[f,F]\d{1,2}')\s*(?<reply>W)?\s*(?<comment>\/\*[^(*\/)]*\*\/)+\s*(?<body>.*?\.(\n|\r|$))/gs;
    let fullText = textDocument.getText();
    let result;
    let secsMessages : [SecsMessage, vscode.Position, vscode.Position][]  = [];
    while(null !== (result=re.exec(fullText))) {
        if (result.groups)
        {
            let {header, body, command, comment} = result.groups;
            var position1 = textDocument.positionAt(re.lastIndex-result[0].length);
            var position2 = textDocument.positionAt(re.lastIndex);
            secsMessages.push([new SecsMessage(header, body, command, comment), position1, position2]);
        }
    }
    return secsMessages;
}