const CELL_SIZE = 20;

// Set canvas size menjadi 600
const CANVAS_SIZE = 600;

const REDRAW_INTERVAL = 50;
const WIDTH = CANVAS_SIZE / CELL_SIZE;
const HEIGHT = CANVAS_SIZE / CELL_SIZE;
const DIRECTION = {
  LEFT: 0,
  RIGHT: 1,
  UP: 2,
  DOWN: 3,
};

// Pengaturan Speed (semakin kecil semakin cepat) ubah dari 150 ke 120
const MOVE_INTERVAL = 120;

function initPosition() {
  return {
    x: Math.floor(Math.random() * WIDTH),
    y: Math.floor(Math.random() * HEIGHT),
  };
}

function initHeadAndBody() {
  let head = initPosition();
  let body = [{ x: head.x, y: head.y }];
  return {
    head: head,
    body: body,
  };
}

function initDirection() {
  return Math.floor(Math.random() * 4);
}

function initSnake(color) {
  return {
    color: color,
    ...initHeadAndBody(),
    direction: initDirection(),
    score: 0,
  };
}

let snake1 = initSnake("purple");

// Inisialisasi aple
let apples = [
  {
    color: "red",
    position: initPosition(),
  },
  {
    color: "green",
    position: initPosition(),
  },
];

function drawCell(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

// Scoreboard
function drawScore(snake) {
  let scoreCanvas;
  if (snake.color == snake1.color) {
    scoreCanvas = document.getElementById("score1Board");
  }

  let scoreCtx = scoreCanvas.getContext("2d");

  scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  scoreCtx.font = "30px Arial";
  scoreCtx.fillStyle = snake.color;
  scoreCtx.fillText(snake.score, 10, scoreCanvas.scrollHeight / 2);
}

function draw() {
  setInterval(function () {
    let snakeCanvas = document.getElementById("snakeBoard");
    let ctx = snakeCanvas.getContext("2d");

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    drawCell(ctx, snake1.head.x, snake1.head.y, snake1.color);
    for (let i = 1; i < snake1.body.length; i++) {
      drawCell(ctx, snake1.body[i].x, snake1.body[i].y, snake1.color);
    }

    for (let i = 0; i < apples.length; i++) {
      let apple = apples[i];

      // Gambar apple
      var img = document.getElementById("apple");
      ctx.drawImage(
        img,
        apple.position.x * CELL_SIZE,
        apple.position.y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE,
      );
    }

    drawScore(snake1);
  }, REDRAW_INTERVAL);
}

// Ular akan teleport ke sisi yang lain apabila menabrak tepi canvas
function teleport(snake) {
  if (snake.head.x < 0) {
    snake.head.x = CANVAS_SIZE / CELL_SIZE - 1;
  }
  if (snake.head.x >= WIDTH) {
    snake.head.x = 0;
  }
  if (snake.head.y < 0) {
    snake.head.y = CANVAS_SIZE / CELL_SIZE - 1;
  }
  if (snake.head.y >= HEIGHT) {
    snake.head.y = 0;
  }
}

// Soal no 4: Jadikan apples array
function eat(snake, apples) {
  for (let i = 0; i < apples.length; i++) {
    let apple = apples[i];
    if (snake.head.x == apple.position.x && snake.head.y == apple.position.y) {
      apple.position = initPosition();
      snake.score++;
      snake.body.push({ x: snake.head.x, y: snake.head.y });
    }
  }
}

// Arah gerakan ular
function moveLeft(snake) {
  snake.head.x--;
  teleport(snake);
  eat(snake, apples);
}

function moveRight(snake) {
  snake.head.x++;
  teleport(snake);
  eat(snake, apples);
}

function moveDown(snake) {
  snake.head.y++;
  teleport(snake);
  eat(snake, apples);
}

function moveUp(snake) {
  snake.head.y--;
  teleport(snake);
  eat(snake, apples);
}

// Cek ular bertabrakan atau tidak
function checkCollision(snakes) {
  let isCollide = false;
  for (let i = 0; i < snakes.length; i++) {
    for (let j = 0; j < snakes.length; j++) {
      for (let k = 1; k < snakes[j].body.length; k++) {
        if (
          snakes[i].head.x == snakes[j].body[k].x &&
          snakes[i].head.y == snakes[j].body[k].y
        ) {
          isCollide = true;
        }
      }
    }
  }
  if (isCollide) {
    // Menambahkan audio
    var audio = new Audio("game-over.mp3");
    audio.play();

    alert("Game over");
    snake1 = initSnake("purple");
  }
  return isCollide;
}

function move(snake) {
  switch (snake.direction) {
    case DIRECTION.LEFT:
      moveLeft(snake);
      break;
    case DIRECTION.RIGHT:
      moveRight(snake);
      break;
    case DIRECTION.DOWN:
      moveDown(snake);
      break;
    case DIRECTION.UP:
      moveUp(snake);
      break;
  }
  moveBody(snake);

  // Cek ular bertabrakan dengan diri sendiri
  // Tambahkan ular lain di array jika ingin cek bertabrakan dengan ular lain
  if (!checkCollision([snake1])) {
    setTimeout(function () {
      move(snake);
    }, MOVE_INTERVAL);
  } else {
    initGame();
  }
}

function moveBody(snake) {
  snake.body.unshift({ x: snake.head.x, y: snake.head.y });
  snake.body.pop();
}

function turn(snake, direction) {
  const oppositeDirections = {
    [DIRECTION.LEFT]: DIRECTION.RIGHT,
    [DIRECTION.RIGHT]: DIRECTION.LEFT,
    [DIRECTION.DOWN]: DIRECTION.UP,
    [DIRECTION.UP]: DIRECTION.DOWN,
  };

  if (direction !== oppositeDirections[snake.direction]) {
    snake.direction = direction;
  }
}

// Kontrol arah gerakan ular
document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowLeft") {
    turn(snake1, DIRECTION.LEFT);
  } else if (event.key === "ArrowRight") {
    turn(snake1, DIRECTION.RIGHT);
  } else if (event.key === "ArrowUp") {
    turn(snake1, DIRECTION.UP);
  } else if (event.key === "ArrowDown") {
    turn(snake1, DIRECTION.DOWN);
  }
});

function initGame() {
  move(snake1);
}

initGame();
