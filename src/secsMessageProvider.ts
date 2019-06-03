import * as vscode from 'vscode';
import {
	TextDocument
} from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class SecsMessageProvider implements vscode.TreeDataProvider<SecsMessage> {
	private _onDidChangeTreeData: vscode.EventEmitter<SecsMessage | undefined> = new vscode.EventEmitter<SecsMessage | undefined>();
	readonly onDidChangeTreeData: vscode.Event<SecsMessage | undefined> = this._onDidChangeTreeData.event;

	constructor(private doc: TextDocument) {

	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: SecsMessage): vscode.TreeItem {
		return element;
	}

	getChildren(element?: SecsMessage): vscode.ProviderResult<SecsMessage[]> {
		var fullText = this.doc.getText();
		return fullText.split(' ', 3).map(x => new SecsMessage(x, "1.2.1", vscode.TreeItemCollapsibleState.None));
		// if (element && element.collapsibleState == vscode.TreeItemCollapsibleState.Expanded) {
		// 	return Promise.resolve([]);
		// } else {
		// 	return Promise.resolve([
		// 		new SecsMessage("test", "1.1.1", vscode.TreeItemCollapsibleState.Expanded),
		// 		new SecsMessage("test", "1.2.1", vscode.TreeItemCollapsibleState.None)
		// 	]
		// );
		// }
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

export class SecsMessage extends vscode.TreeItem {

	constructor(
		public readonly label: string,
		private version: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
		super(label, collapsibleState);
	}

	get tooltip(): string {
		return `${this.label}-${this.version}`;
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
