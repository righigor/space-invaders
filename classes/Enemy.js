class Enemy {
  constructor(x, y) {
      this.x = x;
      this.y = y;
      this.width = 60;
      this.height = 40;
      this.speed = 1;
  }

  update() {
      this.y += this.speed;
  }

  show() {
      fill(255, 0, 0);
      noStroke();
      rect(this.x, this.y, this.width, this.height);
  }

  offScreen() {
      return this.y > height;
  }
}