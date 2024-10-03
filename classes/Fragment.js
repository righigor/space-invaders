class Fragment {
  constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = random(5, 15); // Tamanho aleatório do fragmento
      this.speed = random(2, 5); // Velocidade aleatória
      this.direction = random(TWO_PI); // Direção aleatória
      this.lifetime = 30; // Duração do fragmento antes de desaparecer
  }

  update() {
      this.x += cos(this.direction) * this.speed;
      this.y += sin(this.direction) * this.speed;
      this.lifetime--;
  }

  isAlive() {
      return this.lifetime > 0;
  }

  show() {
      fill(255, 25, 250);
      noStroke();
      rect(this.x, this.y, this.size, this.size);
  }
}