import * as t from "https://deno.land/std/testing/asserts.ts";
import { Base128 } from "./Base128.js";
import { Bit7 } from "./Bit7.js";

const n = 256;
const create = (n) => {
  const b = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    b[i] = i;
  }
  return b;
};

Deno.test("len14", async () => {
  const b = create(14);
  const s = Base128.encode(b);
  //console.log(new TextEncoder().encode(s))
  const b2 = Base128.decode(s);
  //console.log(s.length);
  //console.log(b, b2)
  t.assertEquals(b2, b);
});

Deno.test("simple", async () => {
  const b = create(n);
  const s = Base128.encode(b);
  const b2 = Base128.decode(s);
  t.assertEquals(b2, b);
});

Deno.test("series", async () => {
  const bit7 = new Bit7(1280)
  for (let i = 0; i < 1280; i++) {
    bit7.put(i & 0x7f);
  }
  const b = bit7.getBytes();
  //console.log("idx", idx)
  //const b = create(n);
  const s = Base128.encode(b);
  await Deno.writeTextFile("Base128.test.str.series.txt", s);
  //console.log(b);
  const b2 = Base128.decode(s);
  t.assertEquals(b2, b);
});

Deno.test("all pattern", async () => {
  const len = 128 * 128 * 2;
  const bit7 = new Bit7(len)
  for (let i = 0; i < 128; i++) {
    for (let j = 0; j < 128; j++) {
      bit7.put(i);
      bit7.put(j);
    }
  }
  const b = bit7.getBytes();
  //console.log("idx", idx)
  //const b = create(n);
  const s = Base128.encode(b);
  const bb = new TextEncoder().encode(s);
  t.assertEquals(bb.length, len * 8 / 7 + 1 | 0); // 1/7 = 14.29%だけ増加
  await Deno.writeTextFile("Base128.test.str.txt", s);
  //console.log(b);
  const b2 = Base128.decode(s);
  t.assertEquals(b2, b);
});


Deno.test("escape pattern", async () => {
  const escapechr = [
    0, // null -> 1
    9, // tab -> 2
    10, // enter -> 3
    13, // enter -> 4
    34, // double quote - 5
    0, // skip
    38, // ampersand - 7
    92, // back slash - 8
    // shortend for 10
  ];
  const bit7 = new Bit7(escapechr.length * 128 * 2)
  for (let i = 0; i < escapechr.length; i++) {
    for (let j = 0; j < 128; j++) {
      bit7.put(escapechr[i]);
      bit7.put(j);
    }
  }
  const b = bit7.getBytes();
  //console.log("idx", idx)
  //const b = create(n);
  const s = Base128.encode(b);
  await Deno.writeTextFile("Base128.test.escstr.txt", s);
  //console.log(b);
  const b2 = Base128.decode(s);
  t.assertEquals(b2, b);
});

Deno.test("len 0 to 1023", async () => {
  for (let i = 0; i < 1024; i++) {
    const b = create(i);
    const s = Base128.encode(b);
    const b2 = Base128.decode(s);
    //console.log(i, s.length);
    //console.log(b, b2)
    t.assertEquals(b2, b);
  }
});

Deno.test("encode simple", async () => { // encodeしてimportする
  //const b = create(1);
  //const b = new Uint8Array([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]); // ok
  //const b = new Uint8Array([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0, 0xff, 0xff]); // ok
  //const b = new Uint8Array([]); // ok
  //const b = new Uint8Array([50, 50]); // ok
  //const b = new Uint8Array([0, 0]); // ok
  //const b = new Uint8Array([0]); // ok
  const b = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 9, 0, 0xff, 0x60, ]); // ok
  const s = Base128.encode(b);
  //console.log(s, s.length);
  //for (let i = 0; i < s.length; i++) {
  //  console.log(i, s.charCodeAt(i));
  //}
  //const b3 = new TextEncoder().encode(s);
  const b2 = Base128.decode(s);
  //console.log("b2", b2);
  t.assertEquals(b2, b);
});

Deno.test("write in JS", async () => {
  const n = new Uint8Array([0, 1, 2, 3]);
  const s = `export default "${Base128.encode(n)}"`;
  await Deno.writeTextFile("test_str.js", s);  
});
Deno.test("encodeJS", async () => { // encodeしてimportする
  const b = create(256);
  //console.log(b.length);
  const s = Base128.encode(b);
  const src = `export default "${s}"`;
  await Deno.writeTextFile("./Base128.test.str.js", src);
  //await sleep(100);
  const s2 = (await import("./Base128.test.str.js?" + Math.random())).default;
  const b2 = Base128.decode(s2);
  //t.assertEquals(s, s2);
  t.assertEquals(b2, b);
});

Deno.test("performance", () => {
  //const size = 1024 * 1024; // 600msec -> 83msec
  const size = 1024 * 1024 * 10; // 10sec -> 217msec
  //const size = 1024 * 1024 * 64; // 1sec
  const test = new Uint8Array(size);
  for (let i = 0; i < test.length; i++) {
    test[i] = i;
  }
  const s = Base128.encode(test)
  //console.log(s)
  const b = Base128.decode(s);
  //console.log(b);
  //t.assertEquals(b.length, test.length);
  //for (let i = 0; i < b.length; i++) {
  //    t.assertEquals(b[i], test[i]);
  //}
  //t.assertEquals(b, test); // why err!?
  //t.assertEquals(Base122.decode(Base122.encode(test)), test); // why err!?
});
