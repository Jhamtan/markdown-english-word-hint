// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { items } from './load-data';

const wordCompletionItems = items;
let DOCUMENT_SELECTOR: Array<string> = ['markdown'];

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {

	const provide = vscode.languages.registerCompletionItemProvider(DOCUMENT_SELECTOR, {
		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
			let text = document.getText(new vscode.Range(new vscode.Position(position.line, 0), position));
			let pattern = /^.*?\b(\w*)$/;
			let prefix = (text.match(pattern) || ['', ''])[1];
			if (!prefix) { return null; }
			return wordCompletionItems.filter(item => item.filterText?.startsWith(prefix));
		},
		resolveCompletionItem(item: vscode.CompletionItem) {
			return item;
		}
	});

	context.subscriptions.push(provide);
}

// This method is called when your extension is deactivated
export function deactivate() {}
