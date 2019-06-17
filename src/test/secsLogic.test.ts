import * as assert from 'assert';
import * as vscode from 'vscode';
import { async } from 'rxjs/internal/scheduler/async';
import { carrierInfo } from '../logic/secsLogic';
import * as extension from '../extension';
import * as SecsMsgP from '../provider/secsMessageProvider';

suite("secsLogic Tests", function () {
    let textDocument = vscode.workspace.openTextDocument({
        language: 'log',
        content: `SECS. ProceedWithCarrier: 'S3F17' W /* Name=ProceedWithCarrier Dir=2 Header=[00 00 83 11 00 00 00 3B 12 C5] Rcvd=1 Time=07:25:31 TID=4805 */
            <L [5]
                <U4 [1] 1 > /* DATAID */
                <A [18] 'ProceedWithCarrier' > /* CARRIERACTION MappedValue=ProceedWithCarrier */
                <A [8] 'WF112635' > /* CARRIERSPEC MappedValue=WF112635 */
                <U1 [1] 3 > /* PTN */
                <L [5]
                    <L [2]
                        <A [5] 'Usage' > /* MappedValue=Usage */
                        <A [7] 'PRODUCT' > /* MappedValue=PRODUCT */
                    >
                    <L [2]
                        <A [10] 'ContentMap' > /* MappedValue=ContentMap */
                        <L [25]
                            <L [2]
                                <A [9] '691862300' > /* MappedValue=691862300 */
                                <A [10] 'DB3MH127SE' > /* MappedValue=DB3MH127SE */
                            >
                            <L [2]
                                <A [9] '691862300' > /* MappedValue=691862300 */
                                <A [10] 'DB3MH128SE' > /* MappedValue=DB3MH128SE */
                            >
                            <L [2]
                                <A [9] '691862300' > /* MappedValue=691862300 */
                                <A [10] 'DB3MH129SE' > /* MappedValue=DB3MH129SE */
                            >
                            <L [2]
                                <A [9] '691862300' > /* MappedValue=691862300 */
                                <A [10] 'DB3MH130SE' > /* MappedValue=DB3MH130SE */
                            >
                            <L [2]
                                <A [9] '691862300' > /* MappedValue=691862300 */
                                <A [10] 'DB3MH131SE' > /* MappedValue=DB3MH131SE */
                            >
                            <L [2]
                                <A [9] '691862300' > /* MappedValue=691862300 */
                                <A [10] 'DB3MH132SE' > /* MappedValue=DB3MH132SE */
                            >
                            <L [2]
                                <A [9] '691862300' > /* MappedValue=691862300 */
                                <A [10] 'DB3MH133SE' > /* MappedValue=DB3MH133SE */
                            >
                            <L [2]
                                <A [9] '691862300' > /* MappedValue=691862300 */
                                <A [10] 'DB3MH134SE' > /* MappedValue=DB3MH134SE */
                            >
                            <L [2]
                                <A [9] '691862300' > /* MappedValue=691862300 */
                                <A [10] 'DB3MH135SE' > /* MappedValue=DB3MH135SE */
                            >
                            <L [2]
                                <A [9] '691862300' > /* MappedValue=691862300 */
                                <A [10] 'DB3MH136SE' > /* MappedValue=DB3MH136SE */
                            >
                            <L [2]
                                <A [9] '691862300' > /* MappedValue=691862300 */
                                <A [10] 'DB3MH137SE' > /* MappedValue=DB3MH137SE */
                            >
                            <L [2]
                                <A [9] '691862300' > /* MappedValue=691862300 */
                                <A [10] 'DB3MH138SE' > /* MappedValue=DB3MH138SE */
                            >
                            <L [2]
                                <A [9] '691862300' > /* MappedValue=691862300 */
                                <A [10] 'DB3MH139SE' > /* MappedValue=DB3MH139SE */
                            >
                            <L [2]
                                <A [9] '691862300' > /* MappedValue=691862300 */
                                <A [10] 'DB3MH140SE' > /* MappedValue=DB3MH140SE */
                            >
                            <L [2]
                                <A [9] '691862300' > /* MappedValue=691862300 */
                                <A [10] 'DB3MH141SE' > /* MappedValue=DB3MH141SE */
                            >
                            <L [2]
                                <A [9] '691862300' > /* MappedValue=691862300 */
                                <A [10] 'DB3MH142SE' > /* MappedValue=DB3MH142SE */
                            >
                            <L [2]
                                <A [9] '691862300' > /* MappedValue=691862300 */
                                <A [10] 'DB3MH143SE' > /* MappedValue=DB3MH143SE */
                            >
                            <L [2]
                                <A [9] '691862300' > /* MappedValue=691862300 */
                                <A [10] 'DB3MH144SE' > /* MappedValue=DB3MH144SE */
                            >
                            <L [2]
                                <A [9] '691862300' > /* MappedValue=691862300 */
                                <A [10] 'DB3MH145SE' > /* MappedValue=DB3MH145SE */
                            >
                            <L [2]
                                <A [9] '691862300' > /* MappedValue=691862300 */
                                <A [10] 'DB3MH146SE' > /* MappedValue=DB3MH146SE */
                            >
                            <L [2]
                                <A [9] '691862300' > /* MappedValue=691862300 */
                                <A [10] 'DB3MH147SE' > /* MappedValue=DB3MH147SE */
                            >
                            <L [2]
                                <A [9] '691862300' > /* MappedValue=691862300 */
                                <A [10] 'DB3MH148SE' > /* MappedValue=DB3MH148SE */
                            >
                            <L [2]
                                <A [9] '691862300' > /* MappedValue=691862300 */
                                <A [10] 'DB3MH149SE' > /* MappedValue=DB3MH149SE */
                            >
                            <L [2]
                                <A [9] '691862300' > /* MappedValue=691862300 */
                                <A [10] 'DB3MH150SE' > /* MappedValue=DB3MH150SE */
                            >
                            <L [2]
                                <A [9] '691862300' > /* MappedValue=691862300 */
                                <A [10] 'DB3MH151SE' > /* MappedValue=DB3MH151SE */
                            >
                        >
                    >
                    <L [2]
                        <A [7] 'SlotMap' > /* MappedValue=SlotMap */
                        <L [25]
                            <U1 [1] 3 >
                            <U1 [1] 3 >
                            <U1 [1] 3 >
                            <U1 [1] 3 >
                            <U1 [1] 3 >
                            <U1 [1] 3 >
                            <U1 [1] 3 >
                            <U1 [1] 3 >
                            <U1 [1] 3 >
                            <U1 [1] 3 >
                            <U1 [1] 3 >
                            <U1 [1] 3 >
                            <U1 [1] 3 >
                            <U1 [1] 3 >
                            <U1 [1] 3 >
                            <U1 [1] 3 >
                            <U1 [1] 3 >
                            <U1 [1] 3 >
                            <U1 [1] 3 >
                            <U1 [1] 3 >
                            <U1 [1] 3 >
                            <U1 [1] 3 >
                            <U1 [1] 3 >
                            <U1 [1] 3 >
                            <U1 [1] 3 >
                        >
                    >
                    <L [2]
                        <A [8] 'Capacity' > /* MappedValue=Capacity */
                        <U1 [1] 25 >
                    >
                    <L [2]
                        <A [14] 'SubstrateCount' > /* MappedValue=SubstrateCount */
                        <U1 [1] 25 >
                    >
                >
            >
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

    let parseAndMapSecsMessage = (doc: vscode.TextDocument) => {
        return extension.parseSecsMessage(doc)
            .map(element => {
                let [secsMessage, position1, position2] = element;
                return secsMessage;
            });
    };

    test("carrierInfo", async function() {
        let td = await textDocument;
        let case1 = parseAndMapSecsMessage(td);

        carrierInfo(case1);
    });
});