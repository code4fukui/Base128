const decode = (s) => {
  const bin = new TextEncoder().encode(s);
  const len = bin.length;
  const res = new Uint8Array(len / 8 * 7);
  let idx = 0;
  let bits = 0;
  let nbits = 7;
  for (let i = 0; i < len; i++) {
    const b = bin[i];
    for (let j = 6; j >= 0; j--) {
      bits |= ((b >> j) & 1) << nbits;
      if (nbits == 0) {
        res[idx++] = bits;
        bits = 0;
        nbits = 7;
      } else {
        nbits--;
      }
    }
  }
  return res;
};
