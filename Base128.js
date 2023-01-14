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

const encode = (bin) => {
  const len = bin.length;
  const res = new Uint8Array(((len / 7 * 8) >> 0) * 2 + 1);
  let idx = 0;
  let bits = 0;
  let nbits = 6;
  let state = 0;
  for (let i = 0; i < len; i++) {
    const b = bin[i];
    for (let j = 7; j >= 0; j--) {
      bits |= ((b >> j) & 1) << nbits;
      if (nbits == 0) {
        if (state == 0) {
          const n = escapechr.indexOf(bits);
          if (n >= 0) {
            res[idx++] = 0xc0 | ((n + 1) << 1);
            state = 1;
          } else {
            res[idx++] = bits;
          }
        } else {
          res[idx - 1] |= bits >> 6;
          res[idx++] = 0x80 | (bits & 0x3f);
          state = 0;
        }
        bits = 0;
        nbits = 6;
      } else {
        nbits--;
      }
    }
  }
  if (nbits != 6) {
    if (state == 0) {
      const n = escapechr.indexOf(bits);
      if (n >= 0) {
        res[idx++] = 0xc0 | (10 << 1) | (bits >> 6);
        res[idx++] = 0x80 | (bits & 0x3f);
      } else {
        res[idx++] = bits;
      }
    } else {
      res[idx - 1] |= bits >> 6;
      res[idx++] |= 0x80 | (bits & 0x3f);
    }
  } else {
    if (state == 1) {
      res[idx - 1] |= bits >> 6;
      res[idx++] |= 0x80 | (bits & 0x3f);
    }
  }
  return new TextDecoder().decode(new Uint8Array(res.buffer, 0, idx));
};

const decode = (s) => {
  const len = s.length;
  let elen = len;
  for (let i = 0; i < len - 1; i++) {
    if (s.charCodeAt(i) >= 0x80) {
      elen++;
    }
  }
  const len2 = ((elen * 7 / 8) >> 0) + (elen % 8 == 0 ? 0 : 1);
  const res = new Uint8Array(len2);
  let idx = 0;
  let bits = 0;
  let nbits = 7;
  let state = 0;
  for (let i = 0; i < len; i++) {
    let b = s.charCodeAt(i);
    if (state == 0) {
      if (b >= 0x80) {
        const type = b >> 7;
        if (type == 10) { // shortend
          b &= 0x7f;
        } else {
          b = escapechr[type - 1];
          i--;
          state = 1;
        }
      }
    } else {
      b &= 0x7f;
      state = 0;
    }
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
    if (idx == res.length) {
      break;
    }
  }
  if (res.length != idx) {
    return new Uint8Array(res.buffer, 0, idx);
  }
  return res;
};

export const Base128 = { encode, decode };
