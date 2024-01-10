import * as vscode from 'vscode';

interface HintWord extends vscode.CompletionItem {}
interface Word {
  word: string,
  detail: string
}

export function getCompletionItem(): HintWord[] {
  let completionItems: Array<HintWord> = [];
  const dictionary: Array<Word> = require('./data/dictionary.json');
  dictionary.forEach(word => {
    let item = new vscode.CompletionItem(word.word, vscode.CompletionItemKind.Enum);
    item.filterText = word.word;
    item.detail = word.detail;
    completionItems.push(item);
  });
  return completionItems;
}