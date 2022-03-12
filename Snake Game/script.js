const CELL_SIZE = 32.26;
// Soal no 1: Set canvas size menjadi 600
const CANVAS_SIZE = 612;
const REDRAW_INTERVAL = 50;
const WIDTH = CANVAS_SIZE / CELL_SIZE;
const HEIGHT = CANVAS_SIZE / CELL_SIZE;
const DIRECTION = {
  LEFT: 0,
  RIGHT: 1,
  UP: 2,
  DOWN: 3,
};

// Soal no 2: Pengaturan Speed (semakin kecil semakin cepat) ubah dari 150 ke 120

function initPosition() {
  return {
    x: Math.floor(Math.random() * Math.floor((CANVAS_SIZE / CELL_SIZE) - 1) + 1),
    y: Math.floor(Math.random() * Math.floor((CANVAS_SIZE / CELL_SIZE) - 3) + 3),

  };
}


function initHeadAndBody() {
  let head = initPosition();
  let body = [{
    x: head.x,
    y: head.y
  }];
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
    level: 1,
    speed: 220,
    speed1: 1,
    life: 3,
  };

}

function message() {
  var txt;
  if (confirm("Apakah Mencoba bermain kembali (Ok=Yes or Cancel=No) ?")) {
    txt = "ya";
    condition = true;
  } else {
    txt = "no";
    condition = false;
  }
  return condition;
}

let snake1 = initSnake('purple');

// Soal no 4: make apples array
let apples = [{
    color: 'red',
    position: initPosition(),
  },
  {
    color: 'orange',
    position: initPosition(),
  },
  {
    color: 'life',
    position: initPosition(),
  },
];
//console.log(apples[0].position,apples[1].position);

function drawCell(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

// Soal no 6: Pada fungsi drawScore, tambahkan scoreBoard:
function drawScore(snake) {
  let scoreCanvas;
  if (snake.color == snake1.color) {
    scoreCanvas = document.getElementById('scoreBoard');
  }
  let scoreCtx = scoreCanvas.getContext('2d');

  scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  scoreCtx.font = '20px Arial';
  scoreCtx.fillStyle = "yellow";
  scoreCtx.fillText(snake.score, 10, 20);
}

function drawLevel(snake) {
  let levelCanvas;
  if (snake.color == snake1.color) {
    levelCanvas = document.getElementById('levelBoard');
  }
  let levelCtx = levelCanvas.getContext('2d');

  levelCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  levelCtx.font = '20px Arial';
  levelCtx.fillStyle = "yellow";
  levelCtx.fillText(snake.level, 10, 20);
}

function drawSpeed(snake) {
  let SpeedCanvas;
  if (snake.color == snake1.color) {
    SpeedCanvas = document.getElementById('speedBoard');
  }
  let speedCtx = SpeedCanvas.getContext('2d');

  speedCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  speedCtx.font = '20px Arial';
  speedCtx.fillStyle = "yellow";
  speedCtx.fillText(snake.speed1 + "x", 10, SpeedCanvas.scrollHeight / 2);
}

function drawLife(snake) {
  let LifeCanvas;
  if (snake.color == snake1.color) {
    LifeCanvas = document.getElementById('lifeBoard');
  }
  let lifeCtx = LifeCanvas.getContext('2d');

  lifeCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  lifeCtx.font = '20px Arial';
  lifeCtx.fillStyle = "white";
  lifeCtx.fillText(snake.life, 10, 20);
}

function draw() {
  setInterval(function () {
    let snakeCanvas = document.getElementById('snakeBoard');
    let ctx = snakeCanvas.getContext('2d');
    const bg = new Image();
    bg.src = './assets/img/background1.png';

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.drawImage(bg, 0, 0, CANVAS_SIZE, CANVAS_SIZE);

    drawCell(ctx, snake1.head.x, snake1.head.y, snake1.color);
    for (let i = 1; i < snake1.body.length; i++) {
      drawCell(ctx, snake1.body[i].x, snake1.body[i].y, snake1.color);
    }

    for (let i = 0; i < apples.length; i++) {
      let apple = apples[i];
      //console.log(apple);
      // Soal no 3: DrawImage apple dan gunakan image id:
      if (i == 0) {
        var img = document.getElementById('apple');
        ctx.drawImage(
          img,
          apple.position.x * CELL_SIZE,
          apple.position.y * CELL_SIZE,
          CELL_SIZE,
          CELL_SIZE
        );
      } else if (i == 1) {
        var img = document.getElementById('apple2');
        ctx.drawImage(
          img,
          apple.position.x * CELL_SIZE,
          apple.position.y * CELL_SIZE,
          CELL_SIZE,
          CELL_SIZE
        );
      } else {
        const isPrime = num => {
          for (let i = 2, s = Math.sqrt(num); i <= s; i++)
            if (num % i === 0) return false;
          return num > 1;
        }
        if (isPrime(snake1.level) && snake1.score == 0) {
          var img = document.getElementById('life');
          ctx.drawImage(
            img,
            apple.position.x * CELL_SIZE - 2,
            apple.position.y * CELL_SIZE - 2,
            CELL_SIZE + 4,
            CELL_SIZE);
        }
      }

    }

    drawScore(snake1);
    drawLevel(snake1);
    drawSpeed(snake1);
    drawLife(snake1);

  }, REDRAW_INTERVAL);
}

function teleport(snake) {
  //console.log(snake.head.x);
  if (snake.head.x < 1) {
    snake.head.x = Math.floor(CANVAS_SIZE / CELL_SIZE - 1);
  }
  if (snake.head.x >= WIDTH - 1) {
    snake.head.x = 1;
  }
  if (snake.head.y < 3) {
    snake.head.y = Math.floor(CANVAS_SIZE / CELL_SIZE - 1);
  }
  if (snake.head.y >= HEIGHT - 1) {
    snake.head.y = 3;
  }
}

// Soal no 4: Jadikan apples array
function eat(snake, apples) {
  for (let i = 0; i < apples.length; i++) {
    let apple = apples[i];
    //console.log(snake.head.y,apple.position.y);
    if (snake.head.x == apple.position.x && snake.head.y == apple.position.y) {
      var audio = new Audio('./assets/audio/eat.mp3');
      audio.play();
      apple.position = initPosition();
      if (snake.score < 5) {
        snake.score++;
      } else {
        var audio = new Audio('./assets/audio/uplevel.wav');
        audio.play();
        snake.score = 0;
        snake.speed -= 30;
        snake.speed1++;
        snake.level++;
        if (snake.level == 6) {
          alert('winner');
          var audio = new Audio('./assets/audio/winner.wav');
          audio.play();
          let Message1 = message();
          if (Message1) {
            snake.score = 0;
            snake.speed = 220;
            snake.speed1 = 1;
            snake.level = 1;
            snake.body.splice(0, snake.body.length);
            snake.life = 3;
          } else {
            snake.body.splice(1, snake.body.length);
            //sengaja buat error
            snake.head.splice(0, 1);
          }
        }
      }
      if (apple.color == "life" && snake.life < 3) {
        snake.life++;
      }
      snake.body.push({
        x: snake.head.x,
        y: snake.head.y
      });
    }
  }
}

function moveLeft(snake) {
  console.log(snake.head);
  snake.head.x--;
  teleport(snake);
  eat(snake, apples);
}

function moveRight(snake) {
  console.log(snake.head);
  snake.head.x++;
  teleport(snake);
  eat(snake, apples);
}

function moveDown(snake) {
  console.log(snake.head);
  snake.head.y++;
  teleport(snake);
  eat(snake, apples);
}

function moveUp(snake) {
  console.log(snake.head);
  snake.head.y--;
  teleport(snake);
  eat(snake, apples);
}

function checkCollision(snakes) {
  let isCollide = false;
  //this
  //bug 
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
    //saat kondisi menabrak tetapi nyawa masih ada
    if (snakes[0].life > 1) {
      var audio = new Audio('./assets/audio/dead.mp3');
      audio.play();
      snakes[0].life--;
    } else {
      var audio = new Audio('./assets/audio/game-over.mp3');
      audio.play();
      alert('Game over');
      let Message2 = message();
      if (Message2) {
        snakes[0].score = 0;
        snakes[0].speed = 220;
        snakes[0].speed1 = 1;
        snakes[0].level = 1;
        snakes[0].body.splice(1, snakes[0].body.length);
        snakes[0].life = 3;
      } else {
        snakes[0].body.splice(1, snakes[0].body.length);
        //sengaja buat error
        snakes[0].head.splice(0, 1);
      }

    }
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
  // Soal no 6: Check collision dengan snake3
  if (!checkCollision([snake1])) {
    setTimeout(function () {
      move(snake);
    }, snake.speed), 100;
  } else {
    initGame();
  }
}

function moveBody(snake) {
  snake.body.unshift({
    x: snake.head.x,
    y: snake.head.y
  });
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

document.addEventListener('keydown', function (event) {
  if (event.key === 'ArrowLeft') {
    var audio = new Audio('./assets/audio/left.mp3');
    audio.play();
    turn(snake1, DIRECTION.LEFT);
  } else if (event.key === 'ArrowRight') {
    var audio = new Audio('./assets/audio/right.mp3');
    audio.play();
    turn(snake1, DIRECTION.RIGHT);
  } else if (event.key === 'ArrowUp') {
    var audio = new Audio('./assets/audio/up.mp3');
    audio.play();
    turn(snake1, DIRECTION.UP);
  } else if (event.key === 'ArrowDown') {
    var audio = new Audio('./assets/audio/down.mp3');
    audio.play();
    turn(snake1, DIRECTION.DOWN);
  }

});

function initGame() {
  move(snake1);
}

initGame();