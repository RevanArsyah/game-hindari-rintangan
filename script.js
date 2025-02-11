const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 300;
canvas.height = 400;

let player = { x: 135, y: 350, width: 30, height: 30, speed: 20 };
let obstacles = [];
let score = 0;
let gameRunning = true;

// Audio
const gameOverSound = document.getElementById("gameOverSound");

// Event Keyboard
document.addEventListener("keydown", movePlayer);

// Event Tombol Sentuh
document.getElementById("left").addEventListener("click", () => move("left"));
document.getElementById("right").addEventListener("click", () => move("right"));
document.getElementById("up").addEventListener("click", () => move("up"));
document.getElementById("down").addEventListener("click", () => move("down"));

// Restart Game
document.getElementById("restart").addEventListener("click", restartGame);

// Fungsi Pergerakan Pemain
function move(direction) {
    if (!gameRunning) return;
    if (direction === "left" && player.x > 0) player.x -= player.speed;
    if (direction === "right" && player.x < canvas.width - player.width) player.x += player.speed;
    if (direction === "up" && player.y > 0) player.y -= player.speed;
    if (direction === "down" && player.y < canvas.height - player.height) player.y += player.speed;
}

// Fungsi Pergerakan dengan Keyboard
function movePlayer(e) {
    if (e.key === "ArrowLeft") move("left");
    if (e.key === "ArrowRight") move("right");
    if (e.key === "ArrowUp") move("up");
    if (e.key === "ArrowDown") move("down");
}

// Fungsi Update Rintangan
function updateObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].y += obstacles[i].speed; 

        // Cek tabrakan
        if (
            player.x < obstacles[i].x + obstacles[i].width &&
            player.x + player.width > obstacles[i].x &&
            player.y < obstacles[i].y + obstacles[i].height &&
            player.y + player.height > obstacles[i].y
        ) {
            gameOver();
        }
    }

    // Hapus rintangan yang sudah dilewati & tambah skor
    for (let i = obstacles.length - 1; i >= 0; i--) {
        if (obstacles[i].y > canvas.height) {
            obstacles.splice(i, 1);
            score++; // Tambah skor hanya saat melewati rintangan
            document.getElementById("score").innerText = "Score: " + score;
        }
    }
}

// Fungsi Spawn Rintangan dengan Variasi
setInterval(() => {
    let obstacleX = Math.random() * (canvas.width - 40);
    let obstacleSize = Math.random() * (50 - 20) + 20;
    let obstacleSpeed = Math.random() * (3 - 1.5) + 1.5;

    obstacles.push({
        x: obstacleX,
        y: 0,
        width: obstacleSize,
        height: obstacleSize,
        speed: obstacleSpeed
    });
}, 2000);

// Fungsi Update Game
function updateGame() {
    if (!gameRunning) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Gambar pemain
    ctx.fillStyle = "cyan";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Gambar rintangan
    ctx.fillStyle = "red";
    obstacles.forEach(obs => ctx.fillRect(obs.x, obs.y, obs.width, obs.height));

    updateObstacles();
    requestAnimationFrame(updateGame);
}

// Fungsi Game Over
function gameOver() {
    gameRunning = false;
    gameOverSound.play();
    alert(`Game Over! Skor: ${score}`);
    document.getElementById("restart").style.display = "block";
}

// Fungsi Restart Game
function restartGame() {
    player.x = 135;
    player.y = 350;
    obstacles = [];
    score = 0;
    gameRunning = true;
    document.getElementById("score").innerText = "Score: 0";
    document.getElementById("restart").style.display = "none";
    updateGame();
}

// Mulai Game
updateGame();
