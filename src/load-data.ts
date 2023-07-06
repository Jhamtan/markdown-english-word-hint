import * as vscode from 'vscode';

interface HintWord extends vscode.CompletionItem {}
interface Word {
  word: string,
  detail: string
}

export function getCompletionItem(): HintWord[] {
  let completionItems: Array<HintWord> = [];
  for (let i = 0; i < 11; i++) {
    const dictionary: Array<Word> = require(`./data/dictionary${i}.json`);
    dictionary.forEach(word => {
      let item = new vscode.CompletionItem(word.word, vscode.CompletionItemKind.Enum);
      item.filterText = word.word;
      item.detail = word.detail;
      completionItems.push(item);
    });
  }
  return completionItems;
}