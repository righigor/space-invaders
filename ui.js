function loginScreen() {
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(64);
  textFont("audiowide");
  text("SPACE INVADERS", width / 2, height / 2 - 180);
  
  textSize(24);
  textAlign(RIGHT, CENTER);
  text("Digite seu nome:", width / 2 - 40, height / 2 - 50);
  
  textSize(24);
  textAlign(CENTER, CENTER);
  text("Melhores pontuações:", width / 2, height / 2 + 100);
  generateHighScores();
}

// Função que desenha a tela de game over
function gameOverScreen() {
  background(0);
  fill(255);
  textSize(64);
  textAlign(CENTER, CENTER);
  text("GAME OVER", width / 2, height / 2 - 200);

  textSize(48);
  text(`${playerName}, sua pontuação: ${score}`, width / 2, height / 2 - 100);

  const isNewRecord = highScores.length > 0 && score >= highScores[0].score;
  if (isNewRecord) {
    textSize(32);
    text("Parabéns!! Novo recorde!", width / 2, height / 2);
  }

  textSize(24);
  fill(255);
  text("High Scores:", width / 2, height / 2 + 100);
  generateHighScores();

  const restartButton = createButton("Jogar novamente");
  restartButton.position(width / 2 - 110, height / 2);
  restartButton.mousePressed(() => {
    gameState = "login";
    restartButton.hide();
    restartButtonGame();
  });
  restartButton.addClass("play-btn");
}


// Função para gerar os High Scores
function generateHighScores() {
  return highScores.forEach((scoreEntry, i) => {
    text(
      `${i + 1}. ${scoreEntry.name} - ${scoreEntry.score}`,
      width / 2,
      height / 2 + 140 + i * 40
    );
  });
}