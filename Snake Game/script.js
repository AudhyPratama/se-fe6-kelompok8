const CELL_SIZE = 20;
const CANVAS_SIZE = 600;
const REDRAW_INTERVAL = 50;
const WIDTH = CANVAS_SIZE / CELL_SIZE; // width = 30
const HEIGHT = CANVAS_SIZE / CELL_SIZE; // hight = 30
const DIRECTION = {
    LEFT: 0,
    RIGHT: 1,
    UP: 2,
    DOWN: 3,
}
const MOVE_INTERVAL = 120; // kecepatan ular

const DEFAULT_LIVES = 3;

let level = [];

const LEVELS = [
    0,
    4,
    9,
    14,
    19
];

// deklarasi obstacle sesuai level
const LEVEL_OBSTACLES = [
    { // level 1
        length: 0,
        x: 0,
        y: 0,
        mode: 'horizontal' // 'horizontal'/'vertical'/'diagonal'
    },
    { // level 2
        length: WIDTH/1.6,
        x: WIDTH/5.5,
        y: HEIGHT/3,
        mode: 'horizontal' // 'horizontal'/'vertical'/'diagonal'
    },
    { // level 3
        length: WIDTH/1.6,
        x: WIDTH/5.5,
        y: HEIGHT/3+5,
        mode: 'horizontal' // 'horizontal'/'vertical'/'diagonal'
    },
    { // level 4
        length: WIDTH/1.6,
        x: WIDTH/5.5,
        y: HEIGHT/3+10,
        mode: 'horizontal' // 'horizontal'/'vertical'/'diagonal'
    },
    { // level 5
        length: WIDTH/1.4,
        x: WIDTH/6+1,
        y: HEIGHT/9,
        mode: 'vertical', // 'horizontal'/'vertical'/'diagonal'
        multiplier: 2,
        gap: 15
    }
];

// definisikan posisi awal
function initPosition() {
    return {
        x: Math.floor(Math.random() * WIDTH),
        y: Math.floor(Math.random() * HEIGHT),
    }
}

function initHeadAndBody() {
    let head = initPosition();
    let body = [{x: head.x, y: head.y}];
    return {
        head: head,
        body: body,
    }
}

// inisialisasi arah awal dengan math random
function initDirection() {
    return Math.floor(Math.random() * 4);
}

function kill(snake) {
    snake.lives--;
    drawLives(snake);
    snake.head = initPosition()
    if(snake.lives < 1) {
        var audio = new Audio('./Asset/game-over.mp3');
        audio.play();

        alert("You Died");
        snake1 = initSnake("purple");
        initGame();
    } else {
        alert("You collided");
    }
}

// definisikan ular
function initSnake(color) {
    level.push(0);
    return {
        color: color,
        ...initHeadAndBody(),
        direction: initDirection(),
        score: 0,
        level: 1,
        lives: DEFAULT_LIVES
    }
}
let snake1 = initSnake("purple");
/*
let snake2 = initSnake("blue");
let snake3 = initSnake("black");
*/ 
// definisikan apel
let apples = [{ //apel 1
    color: "red",
    position: initPosition(),
},
{ // apel 2
    color: "green",
    position: initPosition(),
}]

// menggambar cell board
function drawCell(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function advancedDrawObstacle(ctx, snake, index, mode) {
    for(let j = 0; j < LEVEL_OBSTACLES[index].length; j++) {
        let x, y;
        if(LEVEL_OBSTACLES[index].mode === 'horizontal') {
            x = LEVEL_OBSTACLES[index].x+j;
            y = LEVEL_OBSTACLES[index].y;
            if(mode==='adv') y += LEVEL_OBSTACLES[index].gap;
        }
        else if(LEVEL_OBSTACLES[index].mode === 'vertical') {
            x = LEVEL_OBSTACLES[index].x;
            y = LEVEL_OBSTACLES[index].y+j;
            if(mode==='adv') x += LEVEL_OBSTACLES[index].gap;
        }
        else if(LEVEL_OBSTACLES[index].mode === 'diagonal') {
            x = LEVEL_OBSTACLES[index].x+j;
            y = LEVEL_OBSTACLES[index].y+j;
        }
        drawCell(ctx, x, y, '#000000');
        if(snake.head.x == Number.parseInt(x) && snake.head.y == Number.parseInt(y)) {
            kill(snake);
        }                
    }
}

// fungsi cek tabrakan dengan tembok
function drawAndEvaluateObstacle(ctx, snake) {
    if(snake.level < 5) {
        for(let i = 0; i < snake.level; i++) {
            advancedDrawObstacle(ctx, snake, i);
        }
    } else {
        advancedDrawObstacle(ctx, snake, 4)
        if(LEVEL_OBSTACLES[4].gap && LEVEL_OBSTACLES[4].multiplier) {
            advancedDrawObstacle(ctx, snake, 4, 'adv');
        }
    }
}

function drawLives(snake) {
    let img = document.querySelector("#hearts");
    let scoreCanvas;
    if (snake.color == snake1.color) {
        scoreCanvas = document.getElementById("livesBoard");
    /*
    } else if (snake.color == snake2.color) {
        scoreCanvas = document.getElementById("score2Board");
    } else {
        scoreCanvas = document.getElementById("score3Board");
    */
    }
    let scoreCtx = scoreCanvas.getContext("2d");

    // properti scoreboard
    scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    scoreCtx.font = "30px Arial";
    scoreCtx.fillStyle = snake.color
    scoreCtx.drawImage(img, 1, 10, 50, 50)
    scoreCtx.fillText("x"+snake.lives, 50, scoreCanvas.scrollHeight / 2);
}

// menggambar levelboard pada snake
function drawLevel(snake) {
    let scoreCanvas;
    if (snake.color == snake1.color) {
        scoreCanvas = document.getElementById("levelBoard");
    /*
    } else if (snake.color == snake2.color) {
        scoreCanvas = document.getElementById("score2Board");
    } else {
        scoreCanvas = document.getElementById("score3Board");
    */
    }
    let scoreCtx = scoreCanvas.getContext("2d");

    // properti scoreboard
    scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    scoreCtx.font = "30px Arial";
    scoreCtx.fillStyle = snake.color
    scoreCtx.fillText("Lv. "+snake.level, 10, scoreCanvas.scrollHeight / 2);
}

// menggambar scoreboard pada snake
function drawScore(snake) {
    let scoreCanvas;
    if (snake.color == snake1.color) {
        scoreCanvas = document.getElementById("score1Board");
    /*
    } else if (snake.color == snake2.color) {
        scoreCanvas = document.getElementById("score2Board");
    } else {
        scoreCanvas = document.getElementById("score3Board");
    */
    }
    let scoreCtx = scoreCanvas.getContext("2d");

    // properti scoreboard
    scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    scoreCtx.font = "30px Arial";
    scoreCtx.fillStyle = snake.color
    scoreCtx.fillText(snake.score, 10, scoreCanvas.scrollHeight / 2);
    drawLevel(snake)
}

// fungsi gambar
function draw() {
    setInterval(function() {
        let snakeCanvas = document.getElementById("snakeBoard");
        let ctx = snakeCanvas.getContext("2d");

        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        drawAndEvaluateObstacle(ctx, snake1);
        
        // gambar ular
        drawCell(ctx, snake1.head.x, snake1.head.y, snake1.color);
        for (let i = 1; i < snake1.body.length; i++) {
            drawCell(ctx, snake1.body[i].x, snake1.body[i].y, snake1.color);
        }

        /*
        drawCell(ctx, snake2.head.x, snake2.head.y, snake2.color);
        for (let i = 1; i < snake2.body.length; i++) {
            drawCell(ctx, snake2.body[i].x, snake2.body[i].y, snake2.color);
        }

        drawCell(ctx, snake3.head.x, snake3.head.y, snake3.color);
        for (let i = 1; i < snake3.body.length; i++) {
            drawCell(ctx, snake3.body[i].x, snake3.body[i].y, snake3.color);
        }
        */
        
        // gambar array apel
        for (let i = 0; i < apples.length; i++) {
            let apple = apples[i];

            var img = document.getElementById("apple");
            ctx.drawImage(img, apple.position.x * CELL_SIZE, apple.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
        /*
        var heartsImg = document.getElementById("hearts");
        ctx.drawImage(heartsImg, apple.position.x * CELL_SIZE, apple.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        */
        
        drawScore(snake1);
        drawLives(snake1);
        /*
        drawScore(snake2);
        drawScore(snake3);
        */
    }, REDRAW_INTERVAL);
}

// jika ular menyentuh ujung board
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

// fungsi makan apple
function eat(snake, apples) {
    for (let i = 0; i < apples.length; i++) {
        let apple = apples[i];
        if (snake.head.x == apple.position.x && snake.head.y == apple.position.y) {
            apple.position = initPosition();
            snake.score++;
            snake.body.push({x: snake.head.x, y: snake.head.y});

            let lv = 1;
            LEVELS.forEach((e, j) => {
                if(snake.score > e) {
                    return lv = j+1
                }
            })
            if(snake.level !== lv) {
                alert("Level "+ lv + "!");
            }
            snake.level = lv;
        }
    }
}

// perintah apa saja yang dilakukan ketika jalan ke kiri
function moveLeft(snake) {
    snake.head.x--;
    teleport(snake);
    eat(snake, apples);
}

// perintah apa saja yang dilakukan ketika jalan ke kanan
function moveRight(snake) {
    snake.head.x++;
    teleport(snake);
    eat(snake, apples);
}

// perintah apa saja yang dilakukan ketika jalan ke bawah
function moveDown(snake) {
    snake.head.y++;
    teleport(snake);
    eat(snake, apples);
}

// perintah apa saja yang dilakukan ketika jalan ke atas
function moveUp(snake) {
    snake.head.y--;
    teleport(snake);
    eat(snake, apples);
}

// cek tabrakan
function checkCollision(snakes) {
    let isCollide = false;
    let x;
    //tabrakan dengan badan ular
    for (let i = 0; i < snakes.length; i++) {
        for (let j = 0; j < snakes.length; j++) {
            for (let k = 1; k < snakes[j].body.length; k++) {
                if (snakes[i].head.x == snakes[j].body[k].x && snakes[i].head.y == snakes[j].body[k].y) {
                    isCollide = true;
                    x = i;
                }
            }
        }
    }
    // game over
    if (isCollide) {
        kill(snake1)
        // snake2 = initSnake("blue");
    }
    return isCollide;
}

// arah jalan ular
function move(snake) {
    switch (snake.direction) {
        case DIRECTION.LEFT: //kiri
            moveLeft(snake);
            break;
        case DIRECTION.RIGHT://kanan
            moveRight(snake);
            break;
        case DIRECTION.DOWN://bawah
            moveDown(snake);
            break;
        case DIRECTION.UP://atas
            moveUp(snake);
            break;
    }

    moveBody(snake);
    if (!checkCollision([snake1])) {
        setTimeout(function() {
            move(snake);
        }, MOVE_INTERVAL);
    } else {
        initGame();
    }
}

// badan ular mengikuti kepala ular
function moveBody(snake) {
    snake.body.unshift({ x: snake.head.x, y: snake.head.y });
    snake.body.pop();
}

// arah jalan ular
function turn(snake, direction) {
    const oppositeDirections = {
        [DIRECTION.LEFT]: DIRECTION.RIGHT,
        [DIRECTION.RIGHT]: DIRECTION.LEFT,
        [DIRECTION.DOWN]: DIRECTION.UP,
        [DIRECTION.UP]: DIRECTION.DOWN,
    }

    if (direction !== oppositeDirections[snake.direction]) {
        snake.direction = direction;
    }
}

//input keyboard untuk gerakan ular 1
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

    /*
    if (event.key === "a") {
        turn(snake2, DIRECTION.LEFT);
    } else if (event.key === "d") {
        turn(snake2, DIRECTION.RIGHT);
    } else if (event.key === "w") {
        turn(snake2, DIRECTION.UP);
    } else if (event.key === "s") {
        turn(snake2, DIRECTION.DOWN);
    }

    if (event.key === "j") {
        turn(snake3, DIRECTION.LEFT);
    } else if (event.key === "l") {
        turn(snake3, DIRECTION.RIGHT);
    } else if (event.key === "i") {
        turn(snake3, DIRECTION.UP);
    } else if (event.key === "k") {
        turn(snake3, DIRECTION.DOWN);
    }
    */
})

// mulai game
function initGame() {
    move(snake1);
    /*
    move(snake2);
    move(snake3);
    */
}

initGame();