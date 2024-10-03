export class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 5;
    this.speed = 7;
  }

  move() {
    this.y -= this.speed;
  }

  show() {
    fill(255, 0, 0);
    noStroke();
    ellipse(this.x, this.y, this.r * 2);
  }

  offScreen() {
    return this.y < 0;
  }
}

export default Bullet;