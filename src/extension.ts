// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { getCompletionItem } from './load-data';

const wordCompletionItems = getCompletionItem();
let DOCUMENT_SELECTOR: Array<string> = ['markdown'];

function changeDocumentSelector() {
	// get user settings
	let settingObject = vscode.workspace.getConfiguration().get('MarkdownEnglishWordHint.activation');
	for (let [key, value] of Object.entries(settingObject as object)) {
		if (value) {
			DOCUMENT_SELECTOR.push(key.toLocaleLowerCase());
		}
	}
}

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {

	changeDocumentSelector();

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

	// show message
	vscode.workspace.onDidChangeConfiguration(configChangeEvent => {
		if (configChangeEvent.affectsConfiguration('MarkdownEnglishWordHint.activation')) {
			const actions = ['Reload now', 'Later'];

			vscode.window
				.showInformationMessage('The VSCode window needs to reload for the changes to take effect. Would you like to reload the window now?', ...actions)
				.then(action => {
					if (action === actions[0]) {
						vscode.commands.executeCommand('workbench.action.reloadWindow');
					}
				});
		}
	});
}

// This method is called when your extension is deactivated
export function deactivate() {}
