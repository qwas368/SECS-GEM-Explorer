
export class CarrierInfo {
	constructor(
		public readonly carrierId: string,
        public readonly lotId: string[],
        public readonly waferCount: number,
        public readonly ppids: string[],
        public readonly cancelCarrier: boolean
	) {
    }
}
