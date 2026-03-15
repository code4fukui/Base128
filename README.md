# Base128 encoding (UTF-8 space efficiency 8/7)

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

A space efficient UTF-8 binary-to-text encoding for HTML/XML/JavaScript created as an alternative to Base64. Base128 is ~14% smaller than equivalent Base64 encoded data.

## Usage

Base128 encoding produces UTF-8 characters, but encodes more bits per byte than Base64.
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

to write String
```javascript
import { Base128 } from "https://code4fukui.github.io/Base128/Base128.js";
const n = new Uint8Array([0, 1, 2, 3]);
const s = `export default "${Base128.encode(n)}"`;
await Deno.writeTextFile("test_str.js", s);
```

## Test

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

## License

MIT License