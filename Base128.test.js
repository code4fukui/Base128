import * as t from "https://deno.land/std/testing/asserts.ts";
import { Base128 } from "./Base128.js";

const n = 10;
const create = (n) => {
  const b = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    b[i] = i;
  }
  return b;
};

Deno.test("simple", async () => {
  const b = create(n);
  const s = Base128.encode(b);
  //console.log(s);
  /*
  for (let i = 0; i < s.length; i++) {
    console.log(s[i], i)
  }
  */
  const b2 = Base128.decode(s);
  t.assertEquals(b2, b);
});

Deno.test("len 0 to 1023", async () => {
  for (let i = 0; i < 1024; i++) {
    const b = create(i);
    const s = Base128.encode(b);
    const b2 = Base128.decode(s);
    //console.log(i, s.length);
    t.assertEquals(b2, b);
  }
});

Deno.test("encodeJS", async () => { // encodeしてimportする
  const b = create(256);
  //console.log(b.length);
  const s = Base128.encodeJS(b);
  const src = "export default " + s;
  await Deno.writeTextFile("./Base128.test.str.js", src);
  //await sleep(100);
  const s2 = (await import("./Base128.test.str.js?" + Math.random())).default;
  const b2 = Base128.decode(s2);
  //t.assertEquals(s, s2);
  t.assertEquals(b2, b);
});

Deno.test("performance", () => {
  //const size = 1024 * 1024; // 600msec -> 83msec
  const size = 1024 * 1024 * 10; // 10sec -> 495msec
  // const size = 1024 * 1024 * 64;
  const test = new Uint8Array(size);
  for (let i = 0; i < test.length; i++) {
    test[i] = i;
  }
  const s = Base128.encode(test)
  //console.log(s)
  const b = Base128.decode(s);
  //console.log(b);
  t.assertEquals(b.length, test.length);
  for (let i = 0; i < b.length; i++) {
    t.assertEquals(b[i], test[i]);
  }
  //t.assertEquals(b, test); // why err!?
  //t.assertEquals(Base122.decode(Base122.encode(test)), test); // why err!?
});
