const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const survivalTimeElement = document.getElementById('time');

const gameWidth = 1280;
const gameHeight = 600;
const groundHeight = 50;

let gameSpeed = 5;
let survivalTime = 0;
let gingerbreadManImage = new Image();
gingerbreadManImage.src = 'gingerbread.png';
let gingerbreadMan = { x: 50, y: gameHeight - groundHeight - 200, width: 100, height: 100, dy: 0, jumping: false, sliding: false };
let obstacles = [];
let gameInterval;
let lastObstacleTime = 0;

let obstacleUpImage = new Image();
obstacleUpImage.src = 'obstacle_up.png';

let obstacleDownImage = new Image();
obstacleDownImage.src = 'obstacle_down.png';

window.alert("Press any key to start game");
document.addEventListener('keydown', startGame);

function startGame() {
    document.removeEventListener('keydown', startGame);
    gameInterval = setInterval(updateGame, 20);
    setInterval(() => { survivalTime++; survivalTimeElement.textContent = survivalTime; }, 1000);
}

function updateGame() {
    ctx.clearRect(0, 0, gameWidth, gameHeight);
    drawGingerbreadMan();
    handleObstacles();
    moveGingerbreadMan();
    detectCollisions();
    gameSpeed += 0.01;
}

function drawGingerbreadMan() {
    ctx.drawImage(gingerbreadManImage, gingerbreadMan.x, gingerbreadMan.y, gingerbreadMan.width, gingerbreadMan.height);
}

/*
function drawGingerbreadMan() {
    ctx.fillStyle = 'green';
    ctx.fillRect(gingerbreadMan.x, gingerbreadMan.y, gingerbreadMan.width, gingerbreadMan.height);
}
*/

/*
function handleObstacles() {
    if (Date.now() - lastObstacleTime > 1500) {
        createObstacle();
        lastObstacleTime = Date.now();
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= gameSpeed;
        ctx.fillStyle = 'red';
        ctx.fillRect(obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);
        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
        }
    }
}
*/

function handleObstacles() {
    if (Date.now() - lastObstacleTime > 2000) {
        createObstacle();
        lastObstacleTime = Date.now();
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= gameSpeed;
        if (obstacles[i].type === 'up') {
            ctx.drawImage(obstacleUpImage, obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);		
        } else {
            ctx.drawImage(obstacleDownImage, obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);
        }
        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
        }
    }
}


function createObstacle() {
    const type = Math.random() < 0.5 ? 'up' : 'down';
    const obstacle = {
        x: gameWidth,
        y: type === 'up' ? gameHeight - groundHeight - 200 : 0,
        width: 120,
        height: 200,
		type: type
    };
    obstacles.push(obstacle);
}

function moveGingerbreadMan() {
    if (gingerbreadMan.jumping) {
        gingerbreadMan.dy += 1;
        gingerbreadMan.y += gingerbreadMan.dy;
        if (gingerbreadMan.y > gameHeight - groundHeight - gingerbreadMan.height) {
            gingerbreadMan.y = gameHeight - groundHeight - gingerbreadMan.height;
            gingerbreadMan.jumping = false;
            gingerbreadMan.dy = 0;
        }
    } else if (gingerbreadMan.sliding) {
        gingerbreadMan.height = 100;
    } else {
        gingerbreadMan.height = 100;
    }
}

function detectCollisions() {
	//偵測碰撞
    for (const obstacle of obstacles) {
        if (gingerbreadMan.x < obstacle.x + obstacle.width &&
            gingerbreadMan.x + gingerbreadMan.width > obstacle.x &&
            gingerbreadMan.y < obstacle.y + obstacle.height &&
            gingerbreadMan.height + gingerbreadMan.y > obstacle.y) {
            clearInterval(gameInterval);
			window.alert('Game Over!!');
            //document.addEventListener('keydown', 
        }
    }
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowUp' && !gingerbreadMan.jumping && !gingerbreadMan.sliding) {
        gingerbreadMan.jumping = true;
        gingerbreadMan.dy = -30;
    }
    //if (e.code === 'ArrowDown' && !gingerbreadMan.jumping) {
    if (e.code === 'ArrowDown' ) {
        gingerbreadMan.sliding = true;
        //gingerbreadMan.height = 100;
		gingerbreadMan.dy = 20;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowDown') {
        gingerbreadMan.sliding = false;
    }
});
