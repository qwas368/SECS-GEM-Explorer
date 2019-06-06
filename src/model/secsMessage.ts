import * as vscode from 'vscode';

export class SecsMessage {
    public readonly streamFunction: [number, number];
	constructor(
		public readonly header: string,
        public readonly body: string,
        private readonly command: string,
        public readonly comment: string,
        public readonly position1: vscode.Position,
        public readonly position2: vscode.Position
	) {
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
}

