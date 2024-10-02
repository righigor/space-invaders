// import { Bullet } from "./classes/Bullet.js";

let playerX;
let playerY;
let playerWidth = 120;
let playerHeight = 100;
let playerSpeed = 5;
let bullets = [];
let naveImg;
let enemies = [];

// Carrega a imagem da nave antes de executar o código
function preload() {
  naveImg = loadImage(
    "https://cdn.pixabay.com/photo/2016/09/27/14/46/ufo-1698553_1280.png"
  );
}

// Configuração inicial, cria o canvas e define a posição inicial do jogador
function setup() {
  createCanvas(windowWidth, windowHeight);

  playerX = width / 2 - playerWidth / 2;
  playerY = height - playerHeight;

  // Cria inimigos
  for (let i = 0; i < 5; i++) {
    enemies.push(new Enemy(random(0, width - 60), random(-200, -100)));
  }
}

function draw() {
  background(0);

  // Inimigos
  enemies.forEach((enemy, i) => {
    enemy.update();
    enemy.show();
    if (enemy.offScreen()) {
      enemies.splice(i, 1);
    }
  });

  // Player
  image(naveImg, playerX, playerY, playerWidth, playerHeight);

  // Movimento do jogador
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    playerX -= playerSpeed;
  }
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    playerX += playerSpeed;
  }

  playerX = constrain(playerX, 0, width - playerWidth);

  bullets.forEach((buller, i) => {
    buller.move();
    buller.show();
    if (buller.offScreen()) {
      bullets.splice(i, 1);
    }
  });
}

// Função para atirar
function keyPressed() {
  if (key === " ") {
    bullets.push(new Bullet(playerX + playerWidth / 2, playerY));
  }
}


// CLASSES
class Bullet {
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

class Enemy {
  constructor(x, y) {
      this.x = x;
      this.y = y;
      this.width = 60; // Largura do inimigo
      this.height = 40; // Altura do inimigo
      this.speed = 2; // Velocidade de movimento do inimigo
  }

  update() {
      this.y += this.speed; // O inimigo desce na tela
  }

  show() {
      fill(255, 0, 0); // Cor do inimigo (vermelho)
      noStroke();
      rect(this.x, this.y, this.width, this.height); // Desenhar retângulo como inimigo
  }

  offScreen() {
      return this.y > height; // Retorna true se o inimigo sair da tela
  }
}