
export class CarrierInfo {
	constructor(
		public readonly carrierId: string,
        public readonly ppid: string,
        public readonly waferCount: number,
        public readonly lotId: string[]
	) {
    }
}
