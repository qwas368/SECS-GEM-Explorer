import * as vscode from 'vscode';
import { TextDocument } from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { DocumentPosition } from '../interface';
import { SecsMessage } from '../model/secsMessage';
import { parseSecsMessage } from '../extension';
import { cfg } from '../config';
import { Configuration, ParserKeyword } from '../model/configuration';
import * as R from 'ramda';
import { Guid } from 'guid-typescript';
import { CarrierInfo } from '../model/carrierInfo';
import { getCarrierInfo } from '../logic/secsLogic';
import { config } from 'rxjs';
import { Parent } from '../interface/parent';

export class SecsMessageProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
	private _onDidChangeTreeData: vscode.EventEmitter<MessageItem | undefined> = new vscode.EventEmitter<MessageItem | undefined>();
	readonly onDidChangeTreeData: vscode.Event<MessageItem | undefined> = this._onDidChangeTreeData.event;

	public treeItem: vscode.TreeItem[];

	constructor() {
		this.treeItem = [];
		this.currentEditTreeItem = undefined;
	}

	private _currentEditTreeItem: MessageOrGroup | undefined;
	get currentEditTreeItem(): MessageOrGroup | undefined {
		return this._currentEditTreeItem;
	}

	set currentEditTreeItem(value: MessageOrGroup | undefined) {
		this._currentEditTreeItem = value;
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	flush(): void {
		this.treeItem.forEach(x => x instanceof FileItem ? x.refresh() : 0);
	}

	getTreeItem(element: MessageItem): vscode.TreeItem {
		return element;
	}

	getChildren(element?: vscode.TreeItem): vscode.ProviderResult<vscode.TreeItem[]> {
		return element instanceof FileItem ? this.processItems(element.subTreeItems)
			: element instanceof GroupMessageItem ? this.processItems(element.subTreeItems)
			: this.treeItem;
	}

	getParent(element: vscode.TreeItem): vscode.ProviderResult<vscode.TreeItem> {
		let isParent = ((element: any): element is Parent => typeof element === "object");

		return isParent(element) ? element.parent : undefined;
	}

	public addTreeItem(treeItem: vscode.TreeItem) {
		let duplicateItem = this.treeItem
			.find(element => element.id === treeItem.id);
		if (duplicateItem && duplicateItem instanceof FileItem) {
			duplicateItem.refresh();
		} else {
			this.treeItem.push(treeItem);
		}
	}

	public deleteTreeItem(treeItem: vscode.TreeItem) {
		this.treeItem = this.treeItem.filter(item => item.id !== treeItem.id);
	}

	private pathExists(p: string): boolean {
		try {
			fs.accessSync(p);
		} catch (err) {
			return false;
		}

		return true;
	}

	private processItems(items: MessageOrGroup[]) : MessageOrGroup[] {

		let resultitems = items.filter(item => {
			// 清空labelPrefix
			item.labelPrefix(``); 

			// 過濾message
			if(item instanceof MessageItem) {
				return messageItemFilter(item, cfg());
			} else {
				return true;
			}
		});

		let currentEditItem = this.editMark(resultitems);
		this.currentEditTreeItem = currentEditItem ? currentEditItem : this.currentEditTreeItem;

		return resultitems;
	}

	private editMark(items: MessageOrGroup[]): MessageOrGroup | undefined {
		// 加上focus mark
		let te = vscode.window.activeTextEditor;
		if (te)
		{
			let isGroupMessage = (item : MessageOrGroup) =>  item instanceof GroupMessageItem;
			let isNotLastOfItems = (item : MessageOrGroup) => item !== R.last(items);
			let isLastOfItemsButInScope = (item : MessageOrGroup) => item === R.last(items) && underline(item.textDocument, te!.document, te!.selection.start, item.p2.line);

			let targetItem = R.last(items.filter(item => underline(item.textDocument, te!.document, item.p1, te!.selection.start.line)));
			if (targetItem && 
				(isGroupMessage(targetItem) ||
				 isNotLastOfItems(targetItem) ||
				 isLastOfItemsButInScope(targetItem))) {
				targetItem.labelPrefix(`✏️`);
				return targetItem;
			} else {
				return undefined;
			}
		}
	}
}

export type MessageOrGroup = MessageItem | GroupMessageItem;

export class MessageItem extends vscode.TreeItem implements DocumentPosition, Parent {

	public readonly ulabel: string;

	constructor(
		public readonly secsMessage: SecsMessage,
		public readonly p1: vscode.Position,
		public readonly p2: vscode.Position,
		public readonly textDocument : vscode.TextDocument,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly parent: vscode.TreeItem | undefined,
		public readonly command?: vscode.Command
	) {
		super('', collapsibleState);
		this.ulabel = this.messageFunctionLabel();
		super.label = this.messageFunctionLabel();
		this.id = Guid.create().toString();
		this.initIcon();
	}

	get tooltip(): string {
		return `line: ${this.p1.line}`;
	}

	// 從message body取的第一個string，假如沒有string，就取
	get description(): string {
		return '';
	}

	initIcon() {
		let iconPath = (iconFile: string) => {
			return {
				light: path.join(__filename, '..', '..', '..', 'resources', 'light', iconFile),
				dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', iconFile)
			};
		};

		this.iconPath = this.secsMessage.command === 'S5F1' ? iconPath('attention.svg')
			: this.secsMessage.command === 'S3F17' ? iconPath('proceed.svg')
			: this.secsMessage.command === 'S6F11' ? iconPath('flash.svg')
			: this.secsMessage.command === 'S2F41' ? iconPath('powershell.svg')
			: this.secsMessage.streamFunction[1] % 2 === 0 ? iconPath('reply.svg')
			: iconPath('c.png');
	}

	messageFunctionLabel() : string {
		// [S6F11] (ceidKeyword| alertKeyword | header)
		return `[S${this.secsMessage.streamFunction[0]}F${this.secsMessage.streamFunction[1]}] `
			+ (this.secsMessage.command === "S6F11" ? this.secsMessage.ceidKeyword
			: this.secsMessage.command === "S5F1" ? this.secsMessage.alertKeyword
			: this.secsMessage.header);
	}

	public labelPrefix(prefix: string) : string | undefined {
		super.label = prefix + this.ulabel;
		return this.label;
	}
}

export class GroupMessageItem extends vscode.TreeItem implements DocumentPosition, Parent  {

	private readonly ulabel: string;
	private readonly carrierInfo: CarrierInfo;
	constructor(
		public readonly messageItems: MessageItem[],
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly parent: vscode.TreeItem | undefined,
		public readonly command?: vscode.Command,
	) {
		super('unknown', collapsibleState);
		let messageSetting = cfg().messageSetting;
		this.carrierInfo = getCarrierInfo(messageItems.map(x => x.secsMessage), messageSetting ? messageSetting.parserKeyword : { carrierIdRead: [] });
		this.ulabel = this.carrierInfo.carrierId || "unknown" ;
		super.label = this.carrierInfo.carrierId || "unknown";
		this.id = Guid.create().toString();
		this.iconPath = this.groupMessageIcon();
		this.messageItems = this.messageItems.map(e => new MessageItem(e.secsMessage, e.p1, e.p2, e.textDocument, e.collapsibleState, this, e.command));
	}

	get subTreeItems(): MessageItem[] {
		return this.messageItems;
	}

	groupMessageIcon(): { light: string | vscode.Uri; dark: string | vscode.Uri } {
		let iconPath = (iconFile: string) => {
			return {
				light: path.join(__filename, '..', '..', '..', 'resources', 'light', iconFile),
				dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', iconFile)
			};
		};

		return this.carrierInfo.cancelCarrier === true ? iconPath('cancelPaket.png')
			: iconPath('paket.png');
	}

	// 從messageItems中的第一個取得carrierId，取不到時回傳unknown carrierId
	getCarrierId(): string {
		let [firstItem, ..._] = this.messageItems;
		if (firstItem && firstItem.secsMessage.ceidKeyword === "CarrierIDRead") {
			let reg = /'(?<carrierId>\w{8})'/gi;
			let result = reg.exec(firstItem.secsMessage.body.replace(/\s/g, ''));
			if (result && result.groups) {
				return result.groups.carrierId;
			}
		}
		return 'unknown';
	}

	get tooltip(): string {
		return `CarrierId: ${this.carrierInfo.carrierId}\nLotId: ${this.carrierInfo.lotId}\nWafter Count: ${this.carrierInfo.waferCount}\nPPID: ${this.carrierInfo.ppids}`;
	}

	get p1(): vscode.Position {
		return this.messageItems[0].p1;
	}

	get p2(): vscode.Position {
		return this.messageItems[0].p2;
	}

	get textDocument(): vscode.TextDocument {
		return this.messageItems[0].textDocument;
	}

	public labelPrefix(prefix: string) : string | undefined {
		super.label = prefix + this.ulabel;
		return this.label;
	}
}

export class FileItem extends vscode.TreeItem implements Parent {

	contextValue = 'FileItem';

	public readonly parent: vscode.TreeItem | undefined = undefined;

	constructor(
		public readonly textDocument: TextDocument,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
		// 從path取出真的file name
		super(textDocument.fileName.replace(/^.*[\\\/]/, ''), collapsibleState);
		this.id = textDocument.fileName;
	}

	get tooltip(): string {
		return `${this.textDocument.fileName}`;
	}
		
	private _subTreeItems?: GroupMessageItem[] = undefined;
	get subTreeItems(): GroupMessageItem[] {
		if (!this._subTreeItems) {
			var [group, groups] = parseSecsMessage(this.textDocument)
				.reduce<[MessageItem[], MessageItem[][]]>((acc, element) => {
					let [group, groups] = acc;
					let [secsMessage, position1, position2] = element;
					let messageItem = new MessageItem(
						secsMessage, 
						position1, 
						position2,
						this.textDocument,
						vscode.TreeItemCollapsibleState.None,
						undefined,
						{
							command: 'extension.revealLine',
							title: 'Go To SECS Message.',
							arguments: [position1, position2, this.textDocument]
						}
					);
					
					var carrierIdReadKeyword = cfg().messageSetting.parserKeyword.carrierIdRead;
					if (carrierIdReadKeyword.includes(messageItem.secsMessage.ceidKeyword) && group.length === 0) {
						group.push(messageItem);
					} else if (carrierIdReadKeyword.includes(messageItem.secsMessage.ceidKeyword)) {
						groups.push(group);
						group = [];
						group.push(messageItem);
					} else {
						group.push(messageItem);
					}
					return [group, groups];
				}, [[], []]);


			this._subTreeItems = [...groups, group].map(group => new GroupMessageItem(group, vscode.TreeItemCollapsibleState.Collapsed, this));
		}
		return this._subTreeItems;
	}

	public refresh() {
		this._subTreeItems = undefined;
	}
}

/**
 * [pure]
 * @param messageItem 
 * @param cfg 
 */
export function messageItemFilter(messageItem: MessageItem, cfg : Configuration): boolean {
	if (cfg.hideUnusedS6F11 && messageItem.secsMessage.command === "S6F11" && messageItem.secsMessage.ceidKeyword === "CollectionEventID") {
		return false;
	} else if (cfg.hideUnusedS6F11 && messageItem.secsMessage.command === "S6F12") {
		return false;
	} else if (cfg.hideUnusedS6F1 && messageItem.secsMessage.command === "S6F1") {
		return false;
	} else if (messageItem.secsMessage.command === "S1F1" || messageItem.secsMessage.command === "S1F2") {
		return false;
	} else {
		return true;
	}
}

/**
 * [pure] message Item是否超過當前行數
 * @param messageItem 
 * @param textDocument 
 * @param ln 
 */
export function overline (
	messageItem: MessageItem | GroupMessageItem, 
	textDocument: vscode.TextDocument,
	ln: number
	) : boolean {
	if (messageItem.textDocument === textDocument && messageItem.p1.line > ln) {
		return true;
	} else {
		return false;
	}
}


/**
 * [pure]
 * @param document 
 * @param currentDocument 
 * @param position 
 * @param ln 
 */
export function underline (
	document: vscode.TextDocument, 
	currentDocument: vscode.TextDocument,
	position: vscode.Position,
	ln: number
	) : boolean {
	if (document === currentDocument && position.line <= ln) {
		return true;
	} else {
		return false;
	}
}