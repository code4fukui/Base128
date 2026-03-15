# Base128
Base128は、Base64より約14%小さいサイズのデータ圧縮をする文字コード化の手法です。

## デモ
`test.html`でデモを実行できます。

## 機能
- Base128エンコーディングとデコーディングを提供
- Base64よりも約14%小さいサイズのデータ圧縮

## 使い方
Base128のエンコーディングとデコーディングを行うには以下のように使います。

```javascript
import { Base128 } from "https://code4fukui.github.io/Base128/Base128.js";
const n = new Uint8Array([0, 1, 2, 3]);
const s = Base128.encode(n);
console.log(s);
const m = Base128.decode(s);
console.log(m);
const s2 = `export default "${m}"`;
console.log(s2);
await Deno.writeTextFile("test_str.js", s);
```

文字列を書き出す場合は以下のように使えます。

```javascript
import { Base128 } from "https://code4fukui.github.io/Base128/Base128.js";
const n = new Uint8Array([0, 1, 2, 3]);
const s = `export default "${Base128.encode(n)}"`;
await Deno.writeTextFile("test_str.js", s);
```

## ライセンス
MITライセンス