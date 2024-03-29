
export class SecsMessage {
	constructor(
		public readonly header: string,
        public readonly body: string,
        public readonly command: string,
        public readonly comment: string
	) {
        this.command = this.command.replace(/\'/g, '');
        this.streamFunction = this.parseCommand(command);
    }

    public readonly streamFunction: [number, number];
    parseCommand(command:string) : [number, number] {
        let reg = /S(?<stream>\d*)F(?<function>\d*)/gi;
        let result = reg.exec(command.replace(/\'/g, ''));
        if (result) {
            if (result.groups) {
                return [+result.groups.stream, +result.groups.function];
            }
        }
        return [0, 0];
    }

    private _ceidKeyword? : string = undefined;
    get ceidKeyword() : string {
        if (!this._ceidKeyword)
        {
            let reg = /\/\*\s*Name=(?<name>CEID)\s*Keyword=(?<keyword>\w*)\s*(MappedValue=(?<mappedValue>\w*))?.*?\*\//gi;
            let result = reg.exec(this.body);
            if (result) {
                if (result.groups) {
                    // MappedValue沒有就選Keyword
                    this._ceidKeyword = result.groups.mappedValue 
                        ? result.groups.mappedValue
                        : result.groups.keyword;
                }
            } else {
                this._ceidKeyword = '';
            }
        }
        return this._ceidKeyword!;
    }

    private _alertKeyword? : string = undefined;
    get alertKeyword() : string {
        if (!this._alertKeyword)
        {
            let reg = /'(?<keyword>.*?)'/gi;
            let result = reg.exec(this.body);
            if (result) {
                if (result.groups) {
                    this._alertKeyword = result.groups.keyword;
                }
            } else {
                this._alertKeyword = '';
            }
        }
        return this._alertKeyword!;
    }
}

