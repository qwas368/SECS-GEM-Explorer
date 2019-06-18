import * as assert from 'assert';
import * as vscode from 'vscode';
import { async } from 'rxjs/internal/scheduler/async';
import { carrierInfo } from '../logic/secsLogic';
import * as extension from '../extension';
import * as SecsMsgP from '../provider/secsMessageProvider';

suite("secsLogic Tests", function () {
    let document1 = vscode.workspace.openTextDocument({
        language: 'log',
        content: `SECS. S6F11: 'S6F11' W /* Name= SMSD=SMSD Header=[00 18 00 00] */
        <L [3]
          <U4 [1] 1834 > /* DATAID */
          <U4 [1] 87018 > /* Name=CEID Keyword=CarrierIDRead */
          <L [2]
            <L [2]
              <U4 [1] 13 > /* Name=RPTID Keyword=ReportID */
              <L [2]
                <A [16] '2019060206513481' > /* Name=VID Keyword=GemTime */
                <U1 [1] 5 > /* Name=VID Keyword=ControlState */
              >
            >
            <L [2]
              <U4 [1] 202 > /* Name=RPTID Keyword=ReportID */
              <L [3]
                <A [5] 'FIMS1' > /* Name=VID Keyword=LocationID */
                <U1 [1] 2 > /* Name=VID Keyword=PortNo */
                <A [8] 'WF116882' > /* Name=VID Keyword=CarrierID */
              >
            >
          >
        >
      .
      SECS. ProceedWithCarrier: 'S3F17' W /* Name=ProceedWithCarrier Dir=2 Header=[00 00 83 11 00 00 00 3B 12 C5] Rcvd=1 Time=07:25:31 TID=4805 */
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
            .
            SECS. PJ_S_CREATE: 'S16F15' W /* Name=PJ_MULTI_CREATE Dir=3 Header=[00 00 90 0F 00 00 00 3B 13 B0] Rcvd=1 Time=07:25:53 TID=5040 */
            <L [2]
                <U4 [1] 0 > /* Name=DATAID */
                <L [...]
                    <L [6]
                        <A [9] '691862300' > /* MappedValue=691862300 */
                        <B [1] 0x0D >
                        <L [1]
                            <L [2]
                                <A [8] 'WF112635' > /* MappedValue=WF112635 */
                                <L [25]
                                    <U1 [1] 1 >
                                    <U1 [1] 2 >
                                    <U1 [1] 3 >
                                    <U1 [1] 4 >
                                    <U1 [1] 5 >
                                    <U1 [1] 6 >
                                    <U1 [1] 7 >
                                    <U1 [1] 8 >
                                    <U1 [1] 9 >
                                    <U1 [1] 10 >
                                    <U1 [1] 11 >
                                    <U1 [1] 12 >
                                    <U1 [1] 13 >
                                    <U1 [1] 14 >
                                    <U1 [1] 15 >
                                    <U1 [1] 16 >
                                    <U1 [1] 17 >
                                    <U1 [1] 18 >
                                    <U1 [1] 19 >
                                    <U1 [1] 20 >
                                    <U1 [1] 21 >
                                    <U1 [1] 22 >
                                    <U1 [1] 23 >
                                    <U1 [1] 24 >
                                    <U1 [1] 25 >
                                >
                            >
                        >
                        <L [3]
                            <U1 [1] 1 >
                            <A [21] 'TR_P_UAA064_H46CTW_AB' > /* MappedValue=TR_P_UAA064_H46CTW_AB */
                            <L [0]
                            >
                        >
                        <BOOLEAN [1] True >
                        <L [0]
                        >
                    >
                >
            >
        .`
    });
    let document2 = vscode.workspace.openTextDocument({
        language: 'log',
        content: `PJ_MULTI_CREATE: 'S16F15' W /* Name=PJ_MULTI_CREATE Dir=3 Header=[00 00 90 0F 00 00 00 3B 13 B0] Rcvd=1 Time=07:25:53 TID=5040 */
        <L [2]
            <U4 [1] 0 > /* Name=DATAID */
            <L [...]
                <L [6]
                    <A [9] '691862300' > /* MappedValue=691862300 */
                    <B [1] 0x0D >
                    <L [1]
                        <L [2]
                            <A [8] 'WF112635' > /* MappedValue=WF112635 */
                            <L [25]
                                <U1 [1] 1 >
                                <U1 [1] 2 >
                                <U1 [1] 3 >
                                <U1 [1] 4 >
                                <U1 [1] 5 >
                                <U1 [1] 6 >
                                <U1 [1] 7 >
                                <U1 [1] 8 >
                                <U1 [1] 9 >
                                <U1 [1] 10 >
                                <U1 [1] 11 >
                                <U1 [1] 12 >
                                <U1 [1] 13 >
                                <U1 [1] 14 >
                                <U1 [1] 15 >
                                <U1 [1] 16 >
                                <U1 [1] 17 >
                                <U1 [1] 18 >
                                <U1 [1] 19 >
                                <U1 [1] 20 >
                                <U1 [1] 21 >
                                <U1 [1] 22 >
                                <U1 [1] 23 >
                                <U1 [1] 24 >
                                <U1 [1] 25 >
                             >
                         >
                     >
                    <L [3]
                        <U1 [1] 1 >
                        <A [21] 'TR_P_UAA064_H46CTW_AB/UAA064_H46CTW_AB/123546' > /* MappedValue=TR_P_UAA064_H46CTW_AB */
                        <L [0]
                         >
                     >
                    <BOOLEAN [1] True >
                    <L [0]
                     >
                 >
             >
         >
    .`
    });
    let document3 = vscode.workspace.openTextDocument({ language: 'log',
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
                        <A [9] '691862304' > /* MappedValue=691862300 */
                        <A [10] 'DB3MH147SE' > /* MappedValue=DB3MH147SE */
                    >
                    <L [2]
                        <A [9] '691862300' > /* MappedValue=691862300 */
                        <A [10] 'DB3MH148SE' > /* MappedValue=DB3MH148SE */
                    >
                    <L [2]
                        <A [9] '' > /* MappedValue=691862300 */
                        <A [10] '' > /* MappedValue=DB3MH149SE */
                    >
                    <L [2]
                        <A [9] '691862303' > /* MappedValue=691862300 */
                        <A [10] 'DB3MH150SE' > /* MappedValue=DB3MH150SE */
                    >
                    <L [2]
                        <A [9] '' > /* MappedValue=691862300 */
                        <A [10] '' > /* MappedValue=DB3MH151SE */
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
        let case1 = parseAndMapSecsMessage(await document1);

        var info1 = carrierInfo(case1);
        assert.equal(info1.carrierId, 'WF116882');
        assert.deepEqual(info1.lotId, ['691862300']);
        assert.deepEqual(info1.ppids, ['TR_P_UAA064_H46CTW_AB']);
        assert.equal(info1.waferCount, 25);

        let case2 = parseAndMapSecsMessage(await document2);
        var info2 = carrierInfo(case2);
        assert.equal(info2.carrierId, '');
        assert.deepEqual(info2.lotId, []);
        assert.deepEqual(info2.ppids, ['TR_P_UAA064_H46CTW_AB/UAA064_H46CTW_AB/123546']);
        assert.equal(info2.waferCount, 0);

        let case3 = parseAndMapSecsMessage(await document3);
        var info3 = carrierInfo(case3);
        assert.equal(info3.carrierId, '');
        assert.deepEqual(info3.lotId, ['691862300', '691862304', '691862303']);
        assert.deepEqual(info3.ppids, []);
        assert.equal(info3.waferCount, 23);
    });
});