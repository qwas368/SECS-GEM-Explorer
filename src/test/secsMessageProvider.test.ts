//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';
import { GroupMessageItem, MessageItem } from '../secsMessageProvider';
import * as extension from '../extension';
import * as vscode from 'vscode';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// import * as vscode from 'vscode';
// import * as myExtension from '../extension';

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
                    return new MessageItem(secsMessage, position1, position2, vscode.TreeItemCollapsibleState.None);
                });
            return new GroupMessageItem(messageItems, vscode.TreeItemCollapsibleState.Collapsed);
        });

        test("case 1", function() {
            assert.equal(case1.getCarrierId(), 'WF115524');
        });
    });
});
