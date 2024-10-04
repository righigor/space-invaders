// Variáveis
// Player
let playerX;
let playerY;
let playerWidth = 120;
let playerHeight = 100;
let playerSpeed = 7;
let naveImg;
let playerLives = 5;
let bullets = [];
let startTime;
let elapsedTime = 0;

// Inimigos
let enemies = [];
let fragments = [];

// Pontuação
let score = 0;

// Configs globais
let gameState = "login";
let playerName = "";
let highScores = [];
let audiowideFont;

// Carrega a imagem da nave antes de executar o código
function preload() {
  naveImg = loadImage(
    "https://cdn.pixabay.com/photo/2016/09/27/14/46/ufo-1698553_1280.png"
  );
}

// Função para carregar os high scores do localStorage
function loadHighScores() {
  const scores = JSON.parse(localStorage.getItem("highScores"));
  if (scores) {
    highScores = scores;
  }
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
  loadHighScores();

  const input = createInput(playerName);
  const inputY = height / 2;
  const inputX = width / 2 - input.width / 2;
  input.position(inputX + 60, inputY - 73);
  input.size(250);
  input.input(() => {
    playerName = input.value().trim();
  });
  input.addClass("name-input");

  const button = createButton("Jogar");
  button.size(input.width + 230);
  button.position(inputX - 165, inputY + input.height - 20);
  button.mousePressed(() => {
    if (playerName.trim() === "") {
      alert("Digite seu nome para jogar!");
      return;
    }
    gameState = "playing";
    input.hide();
    button.hide();
    startGame();
  });
  button.addClass("play-btn");
}

// Função que desenha os elementos na tela
function draw() {
  if (gameState === "login") {
    loginScreen();
  } else if (gameState === "playing") {
    updateGame();
  } else if (gameState === "gameOver") {
    gameOverScreen();
  }
}

// Função que começa o jogo
function startGame() {
  playerX = width / 2 - playerWidth / 2;
  playerY = height - playerHeight;

  startTime = millis();

  // Cria inimigos
  for (let i = 0; i < 5; i++) {
    enemies.push(new Enemy(random(0, width - 60), random(-200, -100), 10));
  }
}

// Função que atualiza o jogo
function updateGame() {
  background(0);

  elapsedTime = millis() - startTime;

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
        for (i = 0; i < 2; i++) {
          enemies.push(
            new Enemy(random(0, width - 60), random(-200, -100), 10)
          );
        }
      }
    }

    bullets.forEach((bullet, bulletIndex) => {
      if (
        bullet.x > enemy.x &&
        bullet.x < enemy.x + enemy.width &&
        bullet.y > enemy.y &&
        bullet.y < enemy.y + enemy.height
      ) {
        for (let i = 0; i < 10; i++) {
          fragments.push(
            new Fragment(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2)
          );
        }
        enemyHit(enemy.getPoints());
        enemies.splice(i, 1);
        bullets.splice(bulletIndex, 1);
        for (i = 0; i < Math.random(); i++) {
          enemies.push(
            new Enemy(random(0, width - 60), random(-200, -100), 10)
          );
        }
      }
    });
  });

  for (let i = fragments.length - 1; i >= 0; i--) {
    fragments[i].update();
    fragments[i].show();
    if (!fragments[i].isAlive()) {
      fragments.splice(i, 1); // Remove fragmento se não estiver mais vivo
    }
  }

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

  // Pontuação
  fill(255);
  textSize(32);
  textAlign(LEFT, TOP);
  text("Score: " + score, 25, 25);

  textSize(32);
  text("Tempo: " + formatTime(elapsedTime), 25, 65);
}

// Função para reiniciar o jogo
function restartButtonGame() {
  playerLives = 5;
  score = 0;
  enemies = [];
  fragments = [];
  bullets = [];
  gameState = "login";
}

// Função formatar o tempo
function formatTime(elapsedTime) {
  const totalSeconds = Math.floor(elapsedTime / 1000); // Total de segundos
  const min = Math.floor(totalSeconds / 60); // Calcula os minutos
  const sec = totalSeconds % 60; // Calcula os segundos restantes
  const ms = Math.floor((elapsedTime % 1000) / 10); // Calcula os milissegundos restantes
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}:${String(ms).padStart(3, '0')}`;
}

// Função para salvar a pontuação no localStorage
function saveScore() {
  const formattedTime = formatTime(elapsedTime);

  highScores.push({ name: playerName, score, time: formattedTime });
  highScores.sort((a, b) => b.score - a.score);
  highScores = highScores.slice(0, 5);
  localStorage.setItem("highScores", JSON.stringify(highScores));
}

// Função para atirar
function keyPressed() {
  if (key === " ") {
    bullets.push(new Bullet(playerX + playerWidth / 2, playerY));
  }
}

// Função para aumentar a pontuação
function enemyHit(points) {
  score += points;
}

// Função que encerra o jogo
function gameOver() {
  saveScore();
  gameState = "gameOver";
  redraw();
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
  constructor(x, y, points) {
    this.x = x;
    this.y = y;
    this.width = 60; // Largura do inimigo
    this.height = 40; // Altura do inimigo
    this.speed = 2; // Velocidade de movimento do inimigo
    this.points = points || 10;
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

  getPoints() {
    return this.points;
  }
}

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
