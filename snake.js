const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const CELL_SIZE = 20;
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

let snake = [{ x: 100, y: 100 }, { x: 80, y: 100 }, { x: 60, y: 100 }];
let food = getRandomFoodPosition();
let direction = "RIGHT";
let score = 0;
let gameOver = false;

document.addEventListener("keydown", changeDirection);
document.addEventListener("keydown", handleRestartOrQuit);

function drawCell(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
}

function drawSnake() {
    snake.forEach(segment => drawCell(segment.x, segment.y, "green"));
}

function drawFood() {
    drawCell(food.x, food.y, "red");
}

function moveSnake() {
    const head = { x: snake[0].x, y: snake[0].y };
    if (direction === "UP") head.y -= CELL_SIZE;
    if (direction === "DOWN") head.y += CELL_SIZE;
    if (direction === "LEFT") head.x -= CELL_SIZE;
    if (direction === "RIGHT") head.x += CELL_SIZE;

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        food = getRandomFoodPosition();
    } else {
        snake.pop();
    }
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const goingUp = direction === "UP";
    const goingDown = direction === "DOWN";
    const goingLeft = direction === "LEFT";
    const goingRight = direction === "RIGHT";

    if (keyPressed === 37 && !goingRight) direction = "LEFT";
    if (keyPressed === 38 && !goingDown) direction = "UP";
    if (keyPressed === 39 && !goingLeft) direction = "RIGHT";
    if (keyPressed === 40 && !goingUp) direction = "DOWN";
}

function handleRestartOrQuit(event) {
    if (gameOver) {
        if (event.keyCode === 82) {  // 'R' key
            resetGame();
            gameLoop();
        } else if (event.keyCode === 81) {  // 'Q' key
            // We can't close the window in a web context, but we can reload the page or navigate away
            window.location.reload();
        }
    }
}

function getRandomFoodPosition() {
    let x = Math.floor(Math.random() * (CANVAS_WIDTH / CELL_SIZE)) * CELL_SIZE;
    let y = Math.floor(Math.random() * (CANVAS_HEIGHT / CELL_SIZE)) * CELL_SIZE;
    return { x, y };
}

function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= CANVAS_WIDTH || head.y < 0 || head.y >= CANVAS_HEIGHT) return true;
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) return true;
    }
    return false;
}

function gameLoop() {
    if (gameOver) {
        showGameOverScreen();
        return;
    }

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    moveSnake();
    drawSnake();
    drawFood();

    if (checkCollision()) {
        gameOver = true;
    }

    showScore();

    setTimeout(gameLoop, 100);
}

function showScore() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(`Score: ${score}`, 10, 20);
}

function showGameOverScreen() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.font = "50px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("Game Over", CANVAS_WIDTH / 4, CANVAS_HEIGHT / 2);

    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Press R to Restart or Q to Quit", CANVAS_WIDTH / 4 - 20, CANVAS_HEIGHT / 2 + 40);
}

function resetGame() {
    snake = [{ x: 100, y: 100 }, { x: 80, y: 100 }, { x: 60, y: 100 }];
    food = getRandomFoodPosition();
    direction = "RIGHT";
    score = 0;
    gameOver = false;
}

gameLoop();
