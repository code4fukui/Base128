# Base128 encoding (UTF-8 space efficiency 8/7)

A space efficient UTF-8 binary-to-text encoding created as an alternative to Base64. Base128 is ~14% smaller than equivalent Base64 encoded data. Details of motivation and implementation can be found on [this article](https://fukuno.jig.jp/).

## Usage

Base128 encoding produces UTF-8 characters, but encodes more bits per byte than Base64.
```javascript
import { Base128 } from "https://code4fukui.github.io/Base128/Base128.js";
const n = new Uint8Array([0, 1, 2, 3]);
const s = Base128.encode(n);
console.log(s);
const m = Base128.decode(s);
console.log(m);
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
console.log("Original size = " + inputData.length); // Original size = 1429
console.log("Base64 size = " + base64Encoded.length); // Base64 size = 1908
console.log("Base122 size = " + base122Encoded.length); // Base122 size = 1634
console.log("Base128 size = " + base128Encoded.length); // Base128 size = 1634
console.log("Saved " + (base64Encoded.length - base128Encoded.length) + " bytes") // Saved 274 bytes
```

## Build

```
npm i -g uglify-js-harmony
uglifyjs decode.js -c -m --screw-ie8 --lint -o decode.min.js
```