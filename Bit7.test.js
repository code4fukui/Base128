import * as t from "https://deno.land/std/testing/asserts.ts";
import { Bit7 } from "./Bit7.js";

Deno.test("1 byte", () => {
  for (let i = 0; i < 128; i++) {
    const b = new Bit7(1);
    b.put(i);
    const n = b.getBytes();
    t.assertEquals(n[0] >> 1, i);
  }
});

const bit8s = (n) => {
  const s = "0000000" + n.toString(2);
  return s.substring(s.length - 8);
};

Deno.test("simple 2 byte", () => {
  const b = new Bit7(3);
  b.put(0);
  b.put(0x7f);
  b.put(0);
  const n = b.getBytes();
  //console.log(bit8s(n[0]), bit8s(n[1]), bit8s(n[2]));
  const s = bit8s(n[0]) + " " + bit8s(n[1]) + " " + bit8s(n[2]);
  t.assertEquals(s, "00000001 11111100 00000000")
//    t.assertEquals(n[0] >> 1, i);
  //  t.assertEquals(((n[0] & 1) << 6) | (n[1] >> 2), i);
});

Deno.test("2 byte", () => {
  for (let i = 0; i < 128; i++) {
    const b = new Bit7(2);
    b.put(i);
    b.put(i);
    const n = b.getBytes();
    t.assertEquals(n[0] >> 1, i);
    t.assertEquals(((n[0] & 1) << 6) | (n[1] >> 2), i);
  }
});
