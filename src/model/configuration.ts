
export class ParserKeyword {
    public readonly carrierIdRead: string[];
    constructor();
    constructor(carrierIdRead? : string[]
	) {
        this.carrierIdRead = carrierIdRead ? carrierIdRead : [];
    }
}

export interface Configuration {
    hideUnusedS6F11?: boolean;
    hideUnusedS6F1?: boolean;
    messageSetting: {
        parserKeyword: ParserKeyword
    };
}