import { CarrierInfo } from '../model/carrierInfo';
import { SecsMessage } from '../model/secsMessage';
import * as R from 'ramda';
import { stringify } from 'querystring';

type s3f17Content = {
    carrierId: string,
    contentMap: {
        lotId: string,
        waferId: string
    }[]
};

// [pure]
export function getCarrierInfo(secsMessages: SecsMessage[]): CarrierInfo {
    let foup: s3f17Content = {carrierId: "", contentMap: []};
    let carrierId: string = "";
    let ppids: string[] = [];
    let cancelCarrier: boolean = false;

    let isCancelCarrier = (c: s3f17Content) => c.contentMap.length === 0;

    for (var secsMessage of secsMessages) {
        if (secsMessage.command === 'S3F17') {
            let t = getS3F17Content(secsMessage);
            if (!isCancelCarrier(t)) {
                foup = t;
            } else {
                cancelCarrier = true;
            }
        } else if (secsMessage.command === 'S6F11' && secsMessage.ceidKeyword === "CarrierIDRead") {
            carrierId = getCarrierId(secsMessage);
        } else if (secsMessage.command === 'S16F11' || secsMessage.command === 'S16F15') {
            ppids = R.uniq(getPpid(secsMessage));
        }
    }

    return new CarrierInfo(
        carrierId !== "" ? carrierId : foup.carrierId,
        R.uniq(foup.contentMap.filter(x => x.waferId !== '').map(x => x.lotId)),
        foup.contentMap.filter(x => x.waferId !== '').length,
        ppids,
        cancelCarrier
    );
}

function getS3F17Content(secsMessage: SecsMessage): s3f17Content {
    let foup: s3f17Content = {carrierId: "", contentMap: []};

    // get carrierId 
    let reg = /'.*?'/gi;
    let matchArray = secsMessage.body.replace(/\s/g, '').match(reg);
    let stringArray = matchArray ? matchArray.map(value => value.replace(/'/g, '')) : [];
    let [command, carrierId,...tail] = stringArray;
    foup.carrierId = carrierId;

    // get contentMap
    let checkReg = /<L\[2\]<A\[10\]'ContentMap'><L\[25\](?<wafers>(<L\[2\]<A\[\d*\]'(.*?)'><A\[\d*\]'(.*?)'>>){25})\>\>/gi;
    let checkedResult = checkReg.exec(secsMessage.body.replace(/[\r\n ]|(\/\*.*?\*\/)/g, ''));
    if (checkedResult && checkedResult.groups) {
        let noWhiteSpaceBody = checkedResult.groups.wafers;
        let re = /(<L\[2\]<A\[\d*\]'(?<lotId>.*?)'><A\[\d*\]'(?<waferId>.*?)'>>)/gi;
        let waferInfo: RegExpExecArray | null;
        while (null !== (waferInfo = re.exec(noWhiteSpaceBody))) {
            if (waferInfo.groups) {
                foup.contentMap.push({ lotId: waferInfo.groups.lotId, waferId: waferInfo.groups.waferId });
            }
        }
    }
    return foup;
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
        let stringArray = matchArray ? matchArray.map(value => value.replace(/'/g, '')) : [];

        // recursive function, 取三個值將第三個值判定為ppid
        let ppids = (function extractPpid(array: string[]): string[] {
            if (array.length === 0) {
                return [];
            } else {
                let [pjId, carrierId, ppid, ...tail] = array;
                return [ppid, ...extractPpid(tail)];
            }
        })(stringArray);

        return ppids;
    } else {
        return [];
    }
}