// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { DepNodeProvider, Dependency } from './DepNodeProvider';
import { SecsMessageProvider, MessageItem } from './secsMessageProvider';
import { SecsMessage } from './model/secsMessage';

var secsMessageProvider: SecsMessageProvider;

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
            secsMessageProvider = new SecsMessageProvider(activeTextEditor.document);
            vscode.window.registerTreeDataProvider('secs-messages', secsMessageProvider);
        }
    }

    // register
    vscode.commands.registerCommand("extension.secs.active", () => active());
}

// this method is called when your extension is deactivated
export function deactivate() {}

function active() {
    if (vscode.window.activeTextEditor) {
        let re = /(?<header> \S*):\s*(?<command>'[s,S]\d{1,2}[f,F]\d{1,2}')\s*(?<reply>W)?\s*(?<comment>\/\*[^(*\/)]*\*\/)+\s*(?<body>.*?\.)(?<lineNumber>\d*)/gs;
        let fullText = addLineNumber(vscode.window.activeTextEditor.document.getText(), vscode.window.activeTextEditor.document.eol);
        let result;
        while(null != (result=re.exec(fullText))) {
            if (result.groups)
            {
                let {header, body, command, comment, lineNumber} = result.groups;            
                let secsMessage = new SecsMessage(header, body, command, comment);
                secsMessageProvider.treeItem.push(new MessageItem(secsMessage, +lineNumber, vscode.TreeItemCollapsibleState.None))
            }
        }
    }

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

// 在.後面加上line number
function addLineNumber(textDocument: string, eol: vscode.EndOfLine) : string {
    let splitPattern = eol == vscode.EndOfLine.CRLF ? "\r\n" : "\n";
    return textDocument.split(splitPattern).map((x, index) => {
        if(x === ".")
            return `${x}${index}`;
        else
            return x;
    }).join(splitPattern);
}