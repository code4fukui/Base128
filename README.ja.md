# Base128エンコーディング（UTF-8空間効率 8/7）

HTML/XML/JavaScript向けにBase64の代替として作成された、空間効率の高いUTF-8のバイナリ・テキスト変換エンコーディングです。Base128は、同等のBase64エンコードデータよりも約14%小さくなります。

## 使い方

Base128エンコーディングはUTF-8文字を生成しますが、Base64よりも1バイトあたり多くのビットをエンコードします。
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

文字列として書き込む場合
```javascript
import { Base128 } from "https://code4fukui.github.io/Base128/Base128.js";
const n = new Uint8Array([0, 1, 2, 3]);
const s = `export default "${Base128.encode(n)}"`;
await Deno.writeTextFile("test_str.js", s);
```

## テスト

```javascript
import { Base128 } from "https://code4fukui.github.io/Base128/Base128.js";
import { Base122 } from "https://code4fukui.github.io/Base122/Base122.js";
import { Base64 } from "https://code4fukui.github.io/Base64/Base64.js";
const inputData = await Deno.readFile("test/example.jpg");
const e = (s) => new TextEncoder().encode(s);
const base64Encoded = e(Base64.encode(inputData));
const base122Encoded = e(Base122.encode(inputData));
const base128Encoded = e(Base128.encode(inputData));
console.log(base122Encoded.length, inputData.length)
console.log("Original size = " + inputData.length); 
console.log("Base64 size = " + base64Encoded.length);
console.log("Base122 size = " + base122Encoded.length);
console.log("Base128 size = " + base128Encoded.length);
console.log("Saved " + (base64Encoded.length - base128Encoded.length) + " bytes")
```

## ライセンス

MIT License — 詳細は [LICENSE](LICENSE) を参照してください。
