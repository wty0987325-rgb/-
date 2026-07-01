const menu = document.getElementById("menu");
const startBtn = document.getElementById("startBtn");
const game = document.getElementById("game");
const countdown = document.getElementById("countdown");

const playerCar = document.getElementById("playerCar");
const obstaclesContainer = document.getElementById("obstacles");

const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

const progressFill = document.getElementById("progressFill");
const livesBox = document.getElementById("lives");

const endScreen = document.getElementById("endScreen");
const endText = document.getElementById("endText");
const restartBtn = document.getElementById("restartBtn");

let playerX = 0;
let lives = 3;
let progress = 0;
let gameRunning = false;

let gameInterval;
let obstacleInterval;

/* =====================
   開始遊戲
===================== */

startBtn.onclick = () => {
    menu.style.display = "none";
    countdown.style.display = "flex";

    let count = 3;
    countdown.innerText = count;

    let cd = setInterval(() => {
        count--;

        if (count > 0) {
            countdown.innerText = count;
        } else if (count === 0) {
            countdown.innerText = "START!";
        } else {
            clearInterval(cd);
            countdown.style.display = "none";
            startGame();
        }
    }, 1000);
};

/* =====================
   遊戲開始
===================== */

function startGame() {
    game.style.display = "block";

    lives = 3;
    progress = 0;
    playerX = 0;
    gameRunning = true;

    updateLives();

    gameInterval = setInterval(() => {
        progress += 0.5;
        progressFill.style.width = progress + "%";

        if (progress >= 100) {
            winGame();
        }
    }, 100);

    obstacleInterval = setInterval(spawnObstacle, 1200);
}

/* =====================
   玩家控制
===================== */

leftBtn.addEventListener("click", () => {
    if (!gameRunning) return;
    playerX -= 20;
    updatePlayer();
});

rightBtn.addEventListener("click", () => {
    if (!gameRunning) return;
    playerX += 20;
    updatePlayer();
});

function updatePlayer() {
    playerCar.style.left = `calc(50% + ${playerX}px)`;
}

/* =====================
   障礙物
===================== */

function spawnObstacle() {
    if (!gameRunning) return;

    const obstacle = document.createElement("div");

    obstacle.style.position = "absolute";
    obstacle.style.width = "40px";
    obstacle.style.height = "70px";
    obstacle.style.background = "black";
    obstacle.style.border = "2px solid white";

    const lanes = [-80, -40, 0, 40, 80];
    const lane = lanes[Math.floor(Math.random() * lanes.length)];

    obstacle.style.left = `calc(50% + ${lane}px)`;
    obstacle.style.top = "-100px";

    game.appendChild(obstacle);

    let fall = setInterval(() => {
        let top = parseInt(obstacle.style.top);
        top += 6;
        obstacle.style.top = top + "px";

        if (checkCollision(obstacle)) {
            obstacle.remove();
            loseLife();
            clearInterval(fall);
        }

        if (top > window.innerHeight) {
            obstacle.remove();
            clearInterval(fall);
        }
    }, 20);
}

/* =====================
   碰撞
===================== */

function checkCollision(obstacle) {
    const p = playerCar.getBoundingClientRect();
    const o = obstacle.getBoundingClientRect();

    return !(
        p.top > o.bottom ||
        p.bottom < o.top ||
        p.left > o.right ||
        p.right < o.left
    );
}

/* =====================
   生命系統
===================== */

function loseLife() {
    lives--;
    updateLives();

    if (lives <= 0) {
        loseGame();
    }
}

function updateLives() {
    livesBox.innerText = "❤️ ".repeat(lives);
}

/* =====================
   Win / Lose
===================== */

function winGame() {
    endGame("WIN!");
}

function loseGame() {
    endGame("LOST");
}

function endGame(text) {
    gameRunning = false;

    clearInterval(gameInterval);
    clearInterval(obstacleInterval);

    endScreen.style.display = "flex";
    endText.innerText = text;
}

/* =====================
   重啟
===================== */

restartBtn.onclick = () => {
    location.reload();
};