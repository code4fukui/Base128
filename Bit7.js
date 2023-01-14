export class Bit7 {
  constructor(bytelen) {
    this.b = new Uint8Array(bytelen);
    this.idx = 0;
    this.remain = 8;
  }
  put(n) {
    if (this.remain == 8) {
      this.b[this.idx] |= n << 1;
      this.remain = 1;
    } else if (this.remain == 7) {
      this.b[this.idx++] |= n;
      this.remain = 8;
    } else {
      this.b[this.idx++] |= n >> (7 - this.remain);
      this.b[this.idx] |= n << (1 + this.remain);
      this.remain = 1 + this.remain;
    }
  }
  getBytes() {
    return this.b;
  }
}
