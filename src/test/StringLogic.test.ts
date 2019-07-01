import * as assert from 'assert';
import * as vscode from 'vscode';
import * as stringLogic from '../logic/StringLogic';

suite("StringLogic Tests", function () {
    test('getMatchStringArray', async () => {
        let case1 = await vscode.workspace.openTextDocument({
            language: 'log',
            content: `error
            fatal
            exception
            .
            error`
        });

        assert.deepEqual(stringLogic.getMatchStringArray(case1, /FATAl/gi), [new vscode.Range(new vscode.Position(1, 12), new vscode.Position(1, 17))]);
        assert.deepEqual(stringLogic.getMatchStringArray(case1, /reere/gi), []);
        assert.deepEqual(stringLogic.getMatchStringArray(case1, /error/gi), [
            new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 5)),
            new vscode.Range(new vscode.Position(4, 12), new vscode.Position(4, 17)),
        ]);

    });
});