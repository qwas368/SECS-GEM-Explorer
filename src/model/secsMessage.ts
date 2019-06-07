import * as vscode from 'vscode';

export class SecsMessage {
    public readonly streamFunction: [number, number];
	constructor(
		public readonly header: string,
        public readonly body: string,
        public readonly command: string,
        public readonly comment: string
	) {
        this.command = this.command.replace(/\'/g, '');
        this.streamFunction = this.toStreamFunction(command);
    }

    toStreamFunction(command:string) : [number, number] {
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
            let reg = /\/\*\s*Name=(?<name>CEID)\s*Keyword=(?<keyword>\w*)\s*\*\//gi;
            let result = reg.exec(this.body);
            if (result) {
                if (result.groups) {
                    this._ceidKeyword = result.groups.keyword;
                }
            } else {
                this._ceidKeyword = '';
            }
        }
        return this._ceidKeyword!;
    }
}

