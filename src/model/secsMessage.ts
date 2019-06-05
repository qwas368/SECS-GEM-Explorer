
export class SecsMessage {

	constructor(
		public readonly header: string,
        public readonly body: string,
        public readonly command: string,
        public readonly comment: string
	) {
    }
}
