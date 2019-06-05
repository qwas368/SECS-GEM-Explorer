import * as vscode from 'vscode';
import {
	TextDocument
} from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { SecsMessage } from './model/secsMessage';

export class SecsMessageProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
	private _onDidChangeTreeData: vscode.EventEmitter<MessageItem | undefined> = new vscode.EventEmitter<MessageItem | undefined>();
	readonly onDidChangeTreeData: vscode.Event<MessageItem | undefined> = this._onDidChangeTreeData.event;

	public treeItem : vscode.TreeItem[];
	
	constructor(private doc: TextDocument) {
		this.treeItem = [];
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: MessageItem): vscode.TreeItem {
		return element;
	}

	getChildren(element?: vscode.TreeItem): vscode.ProviderResult<vscode.TreeItem[]> {
		var fullText = this.doc.getText();
		return this.treeItem;
	}
	
	private pathExists(p: string): boolean {
		try {
			fs.accessSync(p);
		} catch (err) {
			return false;
		}

		return true;
	}
}

export class MessageItem extends vscode.TreeItem {

	constructor(
		public readonly secsMessage: SecsMessage,
		public readonly line: number,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
		super(`${secsMessage.header}`, collapsibleState);
	}

	get tooltip(): string {
		return `${this.label}`;
	}

	get description(): string {
		return 'this is a description';
	}

	iconPath = {
		light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
		dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
	};

	contextValue = 'dependency';
}
