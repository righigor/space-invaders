// Variáveis
// Player
let playerX;
let playerY;
let playerWidth = 120;
let playerHeight = 100;
let playerSpeed = 5;
let naveImg;
let playerLives = 5;
let bullets = [];

// Inimigos
let enemies = [];

// Carrega a imagem da nave antes de executar o código
function preload() {
  naveImg = loadImage(
    "https://cdn.pixabay.com/photo/2016/09/27/14/46/ufo-1698553_1280.png"
  );
}

// Função que desenha corações na tela que representam as vidas do jogador
function drawHeart(x, y, filled) {
  fill(filled ? "red" : "gray"); // Cor do coração dependendo da vida
  noStroke();
  beginShape();
  for (let i = 0; i < 360; i++) {
    let xoff = 16 * sin(i) * sin(i) * sin(i);
    let yoff =
      -1 * (13 * cos(i) - 5 * cos(2 * i) - 2 * cos(3 * i) - cos(4 * i));
    vertex(x + xoff, y + yoff);
  }
  endShape(CLOSE);
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
      playerLives--;

      if (playerLives === 0) {
        gameOver();
      } else {
        enemies.push(new Enemy(random(0, width - 60), random(-200, -100)));
      }
    }

    bullets.forEach((bullet, bulletIndex) => {
      if (bullet.x > enemy.x && bullet.x < enemy.x + enemy.width && bullet.y > enemy.y && bullet.y < enemy.y + enemy.height) {
          // Se colidirem
          enemies.splice(i, 1); // Remove o inimigo
          bullets.splice(bulletIndex, 1); // Remove o tiro
      }
  });
  });

  // Player
  image(naveImg, playerX, playerY, playerWidth, playerHeight);

  // Vidas
  for (let i = 0; i < playerLives; i++) {
    drawHeart(width - 160 + i * 35, 25, i < playerLives);
  }

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

function gameOver() {
  noLoop();
  fill(255);
  textSize(64);
  textAlign(CENTER, CENTER);
  text("Game Over", width / 2, height / 2);
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
    fill(255, 25, 250);
    noStroke();
    rect(this.x, this.y, this.width, this.height); // Desenhar retângulo como inimigo
  }

  offScreen() {
    return this.y > height; // Retorna true se o inimigo sair da tela
  }
}
