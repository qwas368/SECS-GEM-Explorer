import * as vscode from 'vscode';

export function getMatchStringArray(textDocument: vscode.TextDocument, re: RegExp): vscode.Range[] {
    let fullText = textDocument.getText();
    let regResult;
    let result: vscode.Range[] = [];
    while (null !== (regResult = re.exec(fullText))) {
        var p1 = textDocument.positionAt(re.lastIndex - regResult[0].length);
        var p2 = textDocument.positionAt(re.lastIndex);
        result.push(new vscode.Range(p1, p2));
    }
    return result;
}
