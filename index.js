var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

function paddle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speedModification = 0;
    this.crashedWithPaddle = function(ball) {
        var paddleLeftSide = this.x;
        var paddleRightSide = this.x + this.width;
        var paddleUpperSide = this.y;
        var paddleUnderSide = this.y + this.height;
        if(ball.x > paddleLeftSide 
            && ball.x < paddleRightSide
            && ball.y > paddleUpperSide
            && ball.y < paddleUnderSide) {
                return true;
        }
        return false;
    };
    this.moving = function(keyCode) {
        var nextY = this.y;
        if(keyCode == 40) {
            nextY += 5;
            this.speedModification = 1.5;
        } else if(keyCode == 38) {
            nextY += -5;
            this.speedModification = 1.5;
        } else{
            this.speedModification = 0;
        }
        nextY = nextY < 0 ? 0 : nextY;
        nextY = nextY + this.height > 480 ? 480 - this.height : nextY;
        this.y = nextY;
    };
}

var player = new paddle(5, 195, 25, 100);
var computer = new paddle(610, 195, 25, 100);
var ball = { x: 320, y: 240, radius: 3, xSpeed: 2, ySpeed:0,
reverseX: function() {
    this.xSpeed *= -1;
},
reverseY: function() {
    this.ySpeed *= -1;
},
restart: function() {
    this.x = 320;
    this.y = 240;
    this.xSpeed = 2;
    this.ySpeed = 0;
},
bouncing: function() {
    return ball.ySpeed != 0;
},
xSpeedModification: function(modification) {
    modification = this.xSpeed < 0 ? modification * -1 : modification;
    var nextValue = this.xSpeed + modification;
    nextValue = Math.abs(nextValue) > 9 ? 9 : nextValue;
    this.xSpeed = nextValue;
},
ySpeedModification: function(modification) {
    modification = this.ySpeed < 0 ? modification * -1 : modification;
    this.ySpeed += modification;
}
};

function tick() {
    gameUpdate();
    draw();
    window.setTimeout("tick()", 1000/60);
}

function gameUpdate() {
    ball.x += ball.xSpeed;
    ball.y += ball.ySpeed;
    if(ball.x < 0 || ball.x > 640) {
        ball.restart();
    }
    if(ball.y <= 0 || ball.y >= 480) {
        ball.reverseY();
    }
    var withPlayerCrashed = player.crashedWithPaddle(ball);
    var withComputerCrashed = computer.crashedWithPaddle(ball);
    if(withPlayerCrashed || withComputerCrashed) {
        ball.reverseX();
        ball.xSpeedModification(0.25);
        var speedUp = withPlayerCrashed ? player.speedModification : computer.speedModification;
        ball.ySpeedModification(speedUp);    
    }
    for(var keyCode in pushedKey) {
        player.moving(keyCode);
    }
    var computerMiddle = computer.y + (computer.height / 2);
    if(computerMiddle < ball.y) {
        computer.moving(40);
    }
    if(computerMiddle > ball.y) {
        computer.moving(38);
    }
}

function draw() {
    ctx.fillStyle = "violet";
    ctx.fillRect(0, 0, 640, 480);
    paddleDisplay(player);
    paddleDisplay(computer);
    ballDisplay(ball);
}
function paddleDisplay(paddle) {
    ctx.fillStyle = "white";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}
function ballDisplay(ball) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = "white";
    ctx.fill();
}

var pushedKey = {};
window.addEventListener("keydown", function(keyInfo)
    {pushedKey [Event.keyCode] = true; }, false);
window.addEventListener("keyup", function(keyInfo)
    {delete pushedKey [Event.keyCode]; }, false);


tick();




