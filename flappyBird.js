const cvs = document.querySelector("canvas");
const ctx = cvs.getContext("2d");
ctx.fillText("Click to play", 200, 500, 200);

// load image
var bird = new Image();
var bg = new Image();
var fg = new Image();
var pipeNorth = new Image();
var pipeSouth = new Image();

bird.src = "./images/bird.png";
bg.src = "./images/bg.png";
fg.src = "./images/fg.png";
pipeNorth.src = "./images/pipeNorth.png";
pipeSouth.src = "./images/pipeSouth.png";

var flyAudio = new Audio();
var scoreAudio = new Audio();
flyAudio.src = "./sounds/fly.mp3";
scoreAudio.src = "./sounds/score.mp3";

// một vài biên
var score = 0;
var flb = {
  gap: 100,
  constant: 0,
  bX: 10,
  bY: 150,
  spaces: 50,
  gravity: 1.5,
};
document.addEventListener("keydown", (e) => moveUp(e.code));

function moveUp(e) {
  if (e == "Space") {
    birdEle.y -= 25;
    flyAudio.play();
  }
  if (e == "Enter") {
    birdEle.y -= 50;
    flyAudio.play();
  }
}

var birdEle = {
  x: 10,
  y: cvs.height / 2,
};

var pipe = [];

pipe[0] = {
  x: cvs.width,
  y: 0,
};

function draw() {
  ctx.drawImage(bg, 0, 0);
  ctx.drawImage(bird, birdEle.x, birdEle.y);
  for (var i = 0; i < pipe.length; i++) {
    flb.constant = pipeNorth.height + flb.gap + pipe[i].y;
    ctx.drawImage(pipeNorth, pipe[i].x, pipe[i].y);
    ctx.drawImage(pipeSouth, pipe[i].x, flb.constant);
    if (pipe[i].x === flb.spaces) {
      pipe.push({
        x: cvs.width,
        y: Math.floor(Math.random() * pipeNorth.height) - pipeNorth.height, //<=0
      });
    }

    pipe[i].x -= 1;
    if (
      birdEle.y + bird.height >= cvs.height - fg.height ||
      (birdEle.x + bird.width >= pipe[i].x &&
        birdEle.x <= pipe[i].x + pipeNorth.width &&
        (birdEle.y <= flb.constant - flb.gap ||
          birdEle.y + bird.height >= flb.constant))
    ) {
      flb.bX = 10;
      flb.bY = 150;
      if (confirm("You are looser!! Replay?")) {
        location.reload();
      } else {
        window.close();
      }
    }

    if (pipe[i].x + pipeNorth.width === 10) {
      score += 1;
      scoreAudio.play();
    }
  }

  birdEle.y += flb.gravity;
  ctx.font = "30px Arial";
  ctx.drawImage(fg, 0, cvs.height - fg.height);
  ctx.fillText("Score: " + score, 20, cvs.height - 50);
  setTimeout(draw, 1000 / 60);
}
draw();
