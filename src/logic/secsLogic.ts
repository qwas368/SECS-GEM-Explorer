import { CarrierInfo } from '../model/carrierInfo';
import { SecsMessage } from '../model/secsMessage';
import * as R from 'ramda';

// [pure]
export function carrierInfo(secsMessages: SecsMessage[]) : CarrierInfo {
    let contentMap : [string,string][] = [];
    let carrierId : string = "";
    
    for (var secsMessage of secsMessages) {   
        if (secsMessage.command === 'S3F17') {
            contentMap = getContentMap(secsMessage);
        } else if (secsMessage.command === 'S6F11' && secsMessage.ceidKeyword === "CarrierIDRead") {
            carrierId = getCarrierId(secsMessage);
        }
    }

    return new CarrierInfo(
        carrierId,
        '',
        contentMap.filter(x => x[1] !== '').length,
        R.uniq(contentMap.map(x => x[0]))
    );
}

function getContentMap(secsMessage: SecsMessage): [string,string][] {
    let contentMap : [string,string][] = [];
    let checkReg = /<L\[2\]<A\[10\]'ContentMap'><L\[25\](?<wafers>(<L\[2\]<A\[\d*\]'(.*?)'><A\[\d*\]'(.*?)'>>){25})\>\>/gi;
    let checkedResult = checkReg.exec(secsMessage.body.replace(/[\r\n ]|(\/\*.*?\*\/)/g, '' ));
    if (checkedResult && checkedResult.groups) {
        let noWhiteSpaceBody = checkedResult.groups.wafers;
        let re = /(<L\[2\]<A\[\d*\]'(?<lotId>.*?)'><A\[\d*\]'(?<waferId>.*?)'>>)/gi;
        let waferInfo : RegExpExecArray | null;
        while (null !== (waferInfo = re.exec(noWhiteSpaceBody))) {
            if (waferInfo.groups) {
                contentMap.push([waferInfo.groups.lotId, waferInfo.groups.waferId]);
            }
        }
    }
    return contentMap;
}

function getCarrierId(secsMessage: SecsMessage): string {
    if (secsMessage.ceidKeyword === "CarrierIDRead") {
        let reg = /'(?<carrierId>\w{8})'/gi;
        let result = reg.exec(secsMessage.body.replace(/\s/g, ''));
        if (result && result.groups) {
            return result.groups.carrierId;
        }
    }
    return 'unknown';
}