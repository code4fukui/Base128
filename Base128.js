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
const encodeJS = (bin) => {
  const len = bin.length;
  //const res = new Uint16Array(((len / 7 * 8) >> 0) + (len % 7 == 0 ? 0 : 1) + 2);
  const res = new Uint16Array(((len / 7 * 8) >> 0) + 3);
  let idx = 0;
  res[idx++] = 34;
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
            res[idx] = (n + 1) << 7;
            state = 1;
          } else {
            res[idx++] = bits;
          }
        } else {
          res[idx++] |= bits;
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
        res[idx++] = (10 << 7) | bits;
      } else {
        res[idx++] = bits;
      }
    } else {
      res[idx - 1] |= bits;
    }
  }
  res[idx++] = 34;
  return String.fromCharCode(...new Uint16Array(res.buffer, 0, idx));
};

const decode = (s) => {
  //const bin = new TextEncoder().encode(s);
  //const len = bin.length;
  const len = s.length;
  let elen = len;
  for (let i = 0; i < len - 1; i++) {
    if (s.charCodeAt(i) >= 0x80) {
      elen++;
    }
  }
  const shortend = s.charCodeAt(len - 1) >= 0x80;
  if (shortend) {
    //elen--;
  }
  //const res = new Uint8Array(((elen * 7 / 8) >> 0) + (elen % 8 == 0 ? 0 : shortend ? 0 : 1));
  //const res = new Uint8Array(((elen * 7 / 8) >> 0) - (elen % 8 == 0 ? 1 : 0) - (shortend ? 1 : 0));
  const len2 = ((elen * 7 / 8) >> 0) + (elen % 8 == 0 ? 0 : 1);
  const res = new Uint8Array(len2);
  //const res = new Uint8Array(((elen * 7 / 8) >> 0) - (shortend ? 1 : 0));
  //const res = new Uint8Array(((elen * 7 / 8) >> 0) - (shortend ? 1 : 0));
  //const res = new Uint8Array((len * 7 / 8) >> 0);
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

export const Base128 = { encode, decode, encodeJS };
