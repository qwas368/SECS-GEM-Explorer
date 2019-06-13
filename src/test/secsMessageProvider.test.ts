// The module 'assert' provides assertion methods from node
import { Configuration } from '../model/configuration';
import * as assert from 'assert';
import * as SecsMsgP from '../secsMessageProvider';
import * as extension from '../extension';
import * as vscode from 'vscode';
import * as Immutable from 'immutable';

// Defines a Mocha test suite to group tests of similar kind together
suite("GroupMessageItem Tests", function () {
    test('getCarrierId', async () => {
        let case1 = await vscode.workspace.openTextDocument({
            language: 'log',
            content: `2019-06-08 15:14:37,402 INFO  [85] - SECS. S6F11: 'S6F11' W /* Name= SMSD=SMSD Header=[99 CF 01 00] */
                <L [3]
                <U4 [1] 12396 > /* DATAID */
                <U4 [1] 1012 > /* Name=CEID Keyword=CarrierIDRead */
                <L [2]
                    <L [2]
                    <U4 [1] 204 > /* Name=RPTID Keyword=ReportID */
                    <L [3]
                        <U1 [1] 1 > /* Name=VID Keyword=PortNo */
                        <I2 [1] 1 > /* Name=VID Keyword=PortNo1 */
                        <A [16] 'WF115524        ' > /* Name=VID Keyword=CarrierID */
                    >
                    >
                    <L [2]
                    <U4 [1] 15 > /* Name=RPTID Keyword=ReportID */
                    <L [1]
                        <A [20] 'BMAA059B08          ' > /* Name=VID Keyword=ProberCard */
                    >
                    >
                >
                >
            .`
        })
        .then(doc => {
            let messageItems = extension.parseSecsMessage(doc)
                .map(element => {
                    let [secsMessage, position1, position2] = element;
                    return new SecsMsgP.MessageItem(secsMessage, position1, position2, vscode.TreeItemCollapsibleState.None);
                });
            return new SecsMsgP.GroupMessageItem(messageItems, vscode.TreeItemCollapsibleState.Collapsed);
        });

        assert.equal(case1.getCarrierId(), 'WF115524');
    });
});

suite("SecsMessageProvider Tests", function () {
    test('messageItemFilter', async () => {
        let case1 = await vscode.workspace.openTextDocument({
            language: 'log',
            content: `SECS. S3F17: 'S3F17' W /* Name= SMSD=SMSD Header=[99 CF 01 00] */
            .
            SECS. S6F11: 'S6F11' W /* Name= SMSD=SMSD Header=[99 CF 01 00] */
            .
            SECS. S6F11: 'S6F11' W /* Name= SMSD=SMSD Header=[99 CF 01 00] */
            <L [3]
                <U4 [1] 4993480 > /* DATAID */
                <U4 [1] 8003 > /* Name=CEID Keyword=CollectionEventID */
            >
            .
            SECS. S6F1: 'S6F1' W /* Name= SMSD=SMSD Header=[99 CF 01 00] */
            .
            SECS. S1F1: 'S1F1' W /* Name= SMSD=SMSD Header=[99 CF 01 00] */
            .
            SECS. S6F12: 'S6F12' W /* Name= SMSD=SMSD Header=[99 CF 01 00] */
            .`
        })
        .then(doc => {
            return extension.parseSecsMessage(doc)
                .map(element => {
                    let [secsMessage, position1, position2] = element;
                    return new SecsMsgP.MessageItem(secsMessage, position1, position2, vscode.TreeItemCollapsibleState.None);
                });
        });

        const cfg : Configuration = {
            hideUnusedS6F11: true,
            hideUnusedS6F1: true
        };
        assert.equal(SecsMsgP.messageItemFilter(case1, cfg).length, 2);

        const cfg2 = {
            ...cfg,
            hideUnusedS6F1: false
        };
        assert.equal(SecsMsgP.messageItemFilter(case1, cfg2).length, 3);

        const cfg3 = {
            ...cfg,
            hideUnusedS6F11: false
        };
        assert.equal(SecsMsgP.messageItemFilter(case1, cfg3).length, 4);
    });
});