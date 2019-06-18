import { CarrierInfo } from '../model/carrierInfo';
import { SecsMessage } from '../model/secsMessage';
import * as R from 'ramda';
import { stringify } from 'querystring';

// [pure]
export function carrierInfo(secsMessages: SecsMessage[]): CarrierInfo {
    let contentMap: {lotId: string, waferId: string}[] = [];
    let carrierId: string = "";
    let ppids: string[] = [];

    for (var secsMessage of secsMessages) {
        if (secsMessage.command === 'S3F17') {
            contentMap = getContentMap(secsMessage);
        } else if (secsMessage.command === 'S6F11' && secsMessage.ceidKeyword === "CarrierIDRead") {
            carrierId = getCarrierId(secsMessage);
        } else if (secsMessage.command === 'S16F11' || secsMessage.command === 'S16F15') {
            ppids = R.uniq(getPpid(secsMessage));
        }
    }

    return new CarrierInfo(
        carrierId,
        R.uniq(contentMap.filter(x => x.waferId !== '').map(x => x.lotId)),
        contentMap.filter(x => x.waferId !== '').length, 
        ppids
    );
}

function getContentMap(secsMessage: SecsMessage): {lotId: string, waferId: string}[] {
    let contentMap: {lotId: string, waferId: string}[] = [];
    let checkReg = /<L\[2\]<A\[10\]'ContentMap'><L\[25\](?<wafers>(<L\[2\]<A\[\d*\]'(.*?)'><A\[\d*\]'(.*?)'>>){25})\>\>/gi;
    let checkedResult = checkReg.exec(secsMessage.body.replace(/[\r\n ]|(\/\*.*?\*\/)/g, ''));
    if (checkedResult && checkedResult.groups) {
        let noWhiteSpaceBody = checkedResult.groups.wafers;
        let re = /(<L\[2\]<A\[\d*\]'(?<lotId>.*?)'><A\[\d*\]'(?<waferId>.*?)'>>)/gi;
        let waferInfo: RegExpExecArray | null;
        while (null !== (waferInfo = re.exec(noWhiteSpaceBody))) {
            if (waferInfo.groups) {
                contentMap.push({lotId: waferInfo.groups.lotId, waferId: waferInfo.groups.waferId});
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

function getPpid(secsMessage: SecsMessage): string[] {
    if (secsMessage.command === 'S16F11' || secsMessage.command === 'S16F15') {
        let reg = /'.*?'/gi;
        let matchArray = secsMessage.body.replace(/\s/g, '').match(reg);
        let jobArray = matchArray ? matchArray.map(value => value.replace(/'/g, '')) : [];

        // recursive function, 取三個值將第三個值判定為ppid
        let ppids = (function extractPpid(jobArray: string[]): string[] {
            if (jobArray.length === 0) {
                return [];
            } else {
                let [pjId, carrierId, ppid, ...rest] = jobArray;
                return [ppid, ...extractPpid(rest)];
            }
        })(jobArray);

        return ppids;
    } else {
        return [];
    }
}