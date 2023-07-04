import * as vscode from 'vscode';

interface HintWord extends vscode.CompletionItem {}

interface DictionaryItem {
  [propName: string]: string
}

const dictionaryData: DictionaryItem = {};

function loadData(): void {
  let arr = [];
  for (let i = 0; i < 11; i++) {
    const dictionary = require(`./data/dictionary${i}`).dictionary;
    arr.push(dictionary);
  }
  arr.forEach(item => {
    for (let key in item) {
      dictionaryData[key] = item[key];
    }
  });
}

const exchange = require('./data/exchange').exchange;

function replaceChange(change: string): string | void {
  if (!change) {return;}
  let d = change.replace(/d/, '过去分词 ');
  let p = d.replace(/p/, '过去式 ');
  let i = p.replace(/i/, '现在分词 ');
  let r = i.replace(/r/, '形容词比较级 ');
  let t = r.replace(/t/, '形容词最高级 ');
  let s = t.replace(/s/, '名词复数形式 ');
  return s;
}

function parseExchange(exchange: string): string | void {
  if (!exchange) {return;}
  let string = exchange;
  let pattern = /(?<=\/)1:.+(?=\/)|(?<=\/)1:.+\b|1:.+(?=\/)/;
  let change = (exchange.match(pattern) || [''])[0];
  if (change) {
    let str = replaceChange(change);
    string = exchange.replace(pattern, str as string);
  }
  let replaceD = string.replace(/d(?=:)/g, '过去分词');
  let replaceP = replaceD.replace(/p(?=:)/g, '过去式');
  let replaceI = replaceP.replace(/i(?=:)/g, '现在分词');
  let replace3 = replaceI.replace(/3/g, '第三人称单数');
  let replaceR = replace3.replace(/r(?=:)/g, '形容词比较级');
  let replaceT = replaceR.replace(/t(?=:)/g, '形容词最高级');
  let replaceS = replaceT.replace(/s(?=:)/g, '名词复数形式');
  let replace0 = replaceS.replace(/0/g, '原型');
  let replace1 = replace0.replace(/1/g, '原型变换形式');
  let replace = replace1.replace(/\//g, '; ');
  let result = replace + ';';
  return result;
}

function getCompletionItem(): HintWord[] {
  loadData();
  let completionItems: Array<HintWord> = [];
  for (let key in dictionaryData) {
    let item = new vscode.CompletionItem(key, vscode.CompletionItemKind.Enum);
    item.filterText = key;
    if (exchange[key]) {
      item.detail = dictionaryData[key]  + ' ' + parseExchange(exchange[key]);
    } else {
      item.detail = dictionaryData[key];
    }
    completionItems.push(item);
  }
  return completionItems;
}

export const items = getCompletionItem();