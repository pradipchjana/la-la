export default class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  add(vec) {
    this.x += vec.x;
    this.y += vec.y;
    return this;
  }
  copy() {
    return new Vector(this.x, this.y);
  }
  scale(scale) {
    this.x *= scale;
    this.y *= scale;
  }
}
