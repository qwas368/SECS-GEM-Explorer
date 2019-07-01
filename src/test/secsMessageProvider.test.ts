// The module 'assert' provides assertion methods from node
import { Configuration, ParserKeyword } from '../model/configuration';
import * as assert from 'assert';
import * as SecsMsgP from '../provider/secsMessageProvider';
import * as extension from '../extension';
import * as vscode from 'vscode';

// Defines a Mocha test suite to group tests of similar kind together
suite("GroupMessageItem Tests", function () {
    test('getCarrierId', async () => {
        let case1 = await vscode.workspace.openTextDocument({
            language: 'log',
            content: `2019-06-08 18:25:25,514 INFO  [345] - SECS. S6F11: 'S6F11' W /* Name= SMSD=SMSD Header=[5B D3 01 00] */
            <L [3]
              <U4 [1] 12531 > /* DATAID */
              <U4 [1] 11 > /* Name=CEID Keyword=ToolStatusChange */
              <L [1]
                <L [2]
                  <U4 [1] 1 > /* Name=RPTID Keyword=ReportID */
                  <L [1]
                    <U1 [1] 3 > /* Name=VID Keyword=SystemState */
                  >
                >
              >
            >
          .
          
          2019-06-08 18:25:25,514 INFO  [348] - SECSConnection.EventHandler EventHandler@SESConnection : header : 119643 : 5B D3 01 00 
          2019-06-08 18:25:25,514 INFO  [347] - SECS. ERA: 'S6F12' /* Name=ERA SMSD=SMSD Header=[5B D3 01 00] */
            <B [1] 00 >
          .`
        })
        .then(doc => {
            let messageItems = extension.parseSecsMessage(doc)
                .map(element => {
                    let [secsMessage, position1, position2] = element;
                    return new SecsMsgP.MessageItem(secsMessage, position1, position2, doc, vscode.TreeItemCollapsibleState.None, undefined);
                });
            return new SecsMsgP.GroupMessageItem(messageItems, vscode.TreeItemCollapsibleState.Collapsed, undefined);
        });

        assert.equal(case1.label, 'unknown');
    });

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
                    return new SecsMsgP.MessageItem(secsMessage, position1, position2, doc, vscode.TreeItemCollapsibleState.None, undefined);
                });
            return new SecsMsgP.GroupMessageItem(messageItems, vscode.TreeItemCollapsibleState.Collapsed, undefined);
        });

        assert.equal(case1.getCarrierId(), 'WF115524');
        assert.equal(case1.label, 'WF115524');
    });
});

suite("SecsMessageProvider Tests", async function () {
    let textDocument = vscode.workspace.openTextDocument({
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
    });

    let parseAndMapMessageItem = (doc: vscode.TextDocument) => {
        return extension.parseSecsMessage(doc)
            .map(element => {
                let [secsMessage, position1, position2] = element;
                return new SecsMsgP.MessageItem(secsMessage, position1, position2, doc, vscode.TreeItemCollapsibleState.None, undefined);
            });
    };

    test('messageItemFilter', async () => {
        let case1 = await textDocument
            .then(doc => {
                return extension.parseSecsMessage(doc)
                    .map(element => {
                        let [secsMessage, position1, position2] = element;
                        return new SecsMsgP.MessageItem(secsMessage, position1, position2, doc, vscode.TreeItemCollapsibleState.None, undefined);
                    });
            });

        const cfg : Configuration = {
            hideUnusedS6F11: true,
            hideUnusedS6F1: true,
            messageSetting: {
                parserKeyword: new ParserKeyword()
            }
        };
        assert.equal(case1.filter(m => SecsMsgP.messageItemFilter(m, cfg)).length, 2);

        const cfg2 = {
            ...cfg,
            hideUnusedS6F1: false
        };
        assert.equal(case1.filter(m => SecsMsgP.messageItemFilter(m, cfg2)).length, 3);

        const cfg3 = {
            ...cfg,
            hideUnusedS6F11: false
        };
        assert.equal(case1.filter(m => SecsMsgP.messageItemFilter(m, cfg3)).length, 4);
    });

    test('overline', async () => {
        let td = await textDocument;
        let case1 = parseAndMapMessageItem(td);

        assert.equal(SecsMsgP.overline(case1[0], td, 5), false);
        assert.equal(SecsMsgP.overline(case1[2], td, 1), true);
    });

    test('underline', async () => {
        let td = await textDocument;
        let case1 = parseAndMapMessageItem(td);

        assert.equal(SecsMsgP.underline(case1[0].textDocument, td, case1[0].p1, 1), true);
        assert.equal(SecsMsgP.underline(case1[2].textDocument, td, case1[2].p1, 1), false);
        assert.equal(SecsMsgP.underline(case1[3].textDocument, td, case1[3].p2, 2), false);
    });

    test('MessageItem labelSuffix', async () => {
        let td = await textDocument;
        let case1 = parseAndMapMessageItem(td);

        let origianlLabel = case1[0].label;
        let prefix = ' this is a Suffix';

        case1[0].labelPrefix(prefix);
        assert.equal(case1[0].label, prefix + origianlLabel);
        let prefix2 = ' this is a ✏️';
        assert.equal(case1[0].labelPrefix(prefix2), prefix2 + origianlLabel);
        let prefix3 = '';
        case1[0].labelPrefix(prefix3);
        assert.equal(case1[0].label, origianlLabel);
    });
});
