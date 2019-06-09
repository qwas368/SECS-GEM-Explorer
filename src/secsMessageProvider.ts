import * as vscode from 'vscode';
import {
	TextDocument
} from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { SecsMessage } from './model/secsMessage';
import { revealLine, parseSecsMessage } from './extension';

export class SecsMessageProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
	private _onDidChangeTreeData: vscode.EventEmitter<MessageItem | undefined> = new vscode.EventEmitter<MessageItem | undefined>();
	readonly onDidChangeTreeData: vscode.Event<MessageItem | undefined> = this._onDidChangeTreeData.event;

	public treeItem : vscode.TreeItem[];
	public hideUnknownS6F11 : boolean = true;
	public hideS6F12 : boolean = true;
	public hideS1F1andS1F2 : boolean = true;
	
	constructor() {
		this.treeItem = [];
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: MessageItem): vscode.TreeItem {
		return element;
	}

	getChildren(element?: vscode.TreeItem): vscode.ProviderResult<vscode.TreeItem[]> {
		return element instanceof FileItem ? element.subTreeItems
			:  element instanceof GroupMessageItem ? this.messageItemFilter(element.subTreeItems)
			:  this.treeItem;
	}

	public addTreeItem(treeItem: vscode.TreeItem) {
		let duplicateItem = this.treeItem
			.find(element => element.id === treeItem.id);
		if (duplicateItem && duplicateItem instanceof FileItem)
			duplicateItem.refresh();
		else
			this.treeItem.push(treeItem);
	}

	private pathExists(p: string): boolean {
		try {
			fs.accessSync(p);
		} catch (err) {
			return false;
		}

		return true;
	}

	private messageItemFilter(messageItems: MessageItem[]) : MessageItem[] {
		return messageItems.filter(e => {
			if (this.hideUnknownS6F11 && e.secsMessage.command === "S6F11" && e.secsMessage.ceidKeyword === "CollectionEventID")
				return false;
			else if (this.hideS6F12 && e.secsMessage.command === "S6F12")
				return false;
			else if (this.hideS1F1andS1F2 && (e.secsMessage.command === "S1F1" || e.secsMessage.command === "S1F2"))
				return false;
			else
				return true;
		});
	}
}

export class MessageItem extends vscode.TreeItem {

	constructor(
		public readonly secsMessage: SecsMessage,
		public readonly p1: vscode.Position,
		public readonly p2: vscode.Position,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
		super('', collapsibleState);

		this.initlabel();
		this.initIcon();
	}

	get tooltip(): string {
		return `line: ${this.p1.line}`;
	}

	// 從message body取的第一個string，假如沒有string，就取
	get description(): string {
		return '';
	}

	labelDisplay(secsMessage : SecsMessage) : string {
		this.label
		if (secsMessage.streamFunction === [6, 11]) {
			return secsMessage.ceidKeyword;
		} else {
			return secsMessage.header;
		}
	}

	initIcon() {
		let iconPath = (iconFile : string) => {
			return {
				light: path.join(__filename, '..', '..', 'resources', 'light', iconFile),
				dark: path.join(__filename, '..', '..', 'resources', 'dark', iconFile)
			};
		}

		this.iconPath = this.secsMessage.command === 'S5F1' ? iconPath('attention.svg')
					  : this.secsMessage.command === 'S3F17' ? iconPath('proceed.svg')
					  : this.secsMessage.command === 'S6F11' ? iconPath('flash.svg')
					  : this.secsMessage.streamFunction[1]%2 === 0 ? iconPath('reply.svg')
					  : iconPath('c.png');
	}

	initlabel() {
		// [S6F11] (ceidKeyword| alertKeyword | header)
		this.label = `[S${this.secsMessage.streamFunction[0]}F${this.secsMessage.streamFunction[1]}] `;
		this.label += this.secsMessage.command === "S6F11" ? this.secsMessage.ceidKeyword 
					: this.secsMessage.command === "S5F1" ? this.secsMessage.alertKeyword 
					: this.secsMessage.header;
	}
}

export class GroupMessageItem extends vscode.TreeItem {
	constructor(
		public readonly messageItems: MessageItem[],
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
		super('unknown', collapsibleState);
		this.label = this.getCarrierId();
	}

	get subTreeItems(): MessageItem[] {
		return this.messageItems;
	}

	iconPath = {
		light: path.join(__filename, '..', '..', 'resources', 'light', 'paket.png'),
		dark: path.join(__filename, '..', '..', 'resources', 'dark', 'paket.png')
	};

	// 從messageItems中的第一個取得carrierId，取不到時回傳unknown carrierId
	getCarrierId() : string {
		let [firstItem, ..._] = this.messageItems;
		if (firstItem) {
			let reg = /'(?<carrierId>\w{8})'/gi;
			let result = reg.exec(firstItem.secsMessage.body);
			if (result && result.groups)
				return result.groups.carrierId;
		}
		return 'unknown';
	}
}

export class FileItem extends vscode.TreeItem {
	
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
				.reduce((acc : [MessageItem[], MessageItem[][]], element) => {
					let [group, groups] = acc;
					let [secsMessage, position1, position2] = element;
					let messageItem = new MessageItem(secsMessage, position1, position2, vscode.TreeItemCollapsibleState.None, {
						command: 'extension.revealLine',
						title: 'Go To SECS Message.',
						arguments: [position1, position2, this.textDocument]
					});

					if (messageItem.secsMessage.ceidKeyword === "CarrierIDRead" && group.length === 0) {
						group.push(messageItem);
					} else if (messageItem.secsMessage.ceidKeyword === "CarrierIDRead") {
						groups.push(group);
						group = [];
						group.push(messageItem);
					} else {
						group.push(messageItem);
					}
					return [group, groups];
				}, [[], []]);
				

				this._subTreeItems = [...groups, group].map(group => new GroupMessageItem(group, vscode.TreeItemCollapsibleState.Collapsed));
		}
		return this._subTreeItems;
	}

	public refresh() {
		this._subTreeItems = undefined;
	}
}
