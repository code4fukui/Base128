const encode = (bin) => {
  const len = bin.length;
  const res = new Uint8Array(len * 8 / 7 + (len % 7 == 0 ? 0 : 1));
  let idx = 0;
  let bits = 0;
  let nbits = 6;
  for (let i = 0; i < len; i++) {
    const b = bin[i];
    for (let j = 7; j >= 0; j--) {
      bits |= ((b >> j) & 1) << nbits;
      if (nbits == 0) {
        res[idx++] = bits;
        bits = 0;
        nbits = 6;
      } else {
        nbits--;
      }
    }
  }
  res[idx++] = bits;
  return new TextDecoder().decode(res);
};

const encodeJS = (bin) => {
  const len = bin.length;
  const nlen = len * 8 / 7 + (len % 7 == 0 ? 0 : 1);
  const res = new Uint8Array(nlen * 2 + 2); // for worst-case
  let idx = 0;
  res[idx++] = 34;
  let bits = 0;
  let nbits = 6;
  for (let i = 0; i < len; i++) {
    const b = bin[i];
    for (let j = 7; j >= 0; j--) {
      bits |= ((b >> j) & 1) << nbits;
      if (nbits == 0) {
        if (bits == 13) { // \r
          res[idx++] = 92;
          res[idx++] = 114;
        } else if (bits == 10) { // \n
          res[idx++] = 92;
          res[idx++] = 110;
        } else if (bits == 92 || bits == 34) { // \"
          res[idx++] = 92;
          res[idx++] = bits;
        } else {
          res[idx++] = bits;
        }
        bits = 0;
        nbits = 6;
      } else {
        nbits--;
      }
    }
  }
  res[idx++] = bits;
  res[idx++] = 34;
  return new TextDecoder().decode(new Uint8Array(res.buffer, 0, idx));
  //return String.fromCharCode(...new Uint8Array(res.buffer, 0, idx));
};

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

export const Base128 = { encode, decode, encodeJS };
