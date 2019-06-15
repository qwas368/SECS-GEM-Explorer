import { Position, TextDocument } from 'vscode';

export interface DocumentPosition {
    readonly p1: Position;
    readonly p2: Position;
    readonly textDocument : TextDocument;
}