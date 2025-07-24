const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const collisionsMap = [];
const mapWidth = 70;

for (let i = 0; i < collisions.length; i += mapWidth) {
  collisionsMap.push(collisions.slice(i, i + mapWidth));
}

const offset = {
  x: -420,
  y: -260
};

class Boundary {
  static width = 36;
  static height = 36;

  constructor({ position }) {
    this.position = position;
  }

  draw() {
    //ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
    //ctx.fillRect(this.position.x, this.position.y, Boundary.width, Boundary.height);
  }
}

const boundaries = [];

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025) {
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y
          }
        })
      );
    }
  });
});

const image = new Image();
image.src = './image/map.png';

const playerImage = new Image();
playerImage.src = './image/playerDown.png';

class Sprite {
  constructor({ position, image }) {
    this.position = position;
    this.image = image;
  }

 draw() {
    ctx.drawImage(this.image, this.position.x, this.position.y);
  }
}

class Player extends Sprite {
  constructor({ position, image }) {
    super({ position, image });
  }

  draw() {
    ctx.drawImage(
      this.image,
      0, 0,      // crop top-left corner
      48, 68,    // one frame size
      this.position.x,
      this.position.y,
      48, 68
    );
  }
}


const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y
  },
  image: image
});

const player = new Player({
  position: {
    x: canvas.width / 2 - 24,
    y: canvas.height / 2 - 34
  },
  image: playerImage
});



const keys = {
  w: { pressed: false },
  a: { pressed: false },
  s: { pressed: false },
  d: { pressed: false }
};

let lastKey = '';
const movables = [background, ...boundaries];

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + Boundary.width &&
    rectangle1.position.y <= rectangle2.position.y + Boundary.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  );
}

function animate() {
  window.requestAnimationFrame(animate);
  background.draw();
  boundaries.forEach((boundary) => boundary.draw());
  player.draw();

  let moving = true;

  if (keys.w.pressed && lastKey === 'w') {
    for (const boundary of boundaries) {
      if (
        rectangularCollision({
          rectangle1: {
            position: {
              x: player.position.x,
              y: player.position.y - 3
            },
            width: 48,
            height: 68
          },
          rectangle2: boundary
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving) movables.forEach((m) => (m.position.y += 3));
  }

  else if (keys.a.pressed && lastKey === 'a') {
    for (const boundary of boundaries) {
      if (
        rectangularCollision({
          rectangle1: {
            position: {
              x: player.position.x - 3,
              y: player.position.y
            },
            width: 48,
            height: 68
          },
          rectangle2: boundary
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving) movables.forEach((m) => (m.position.x += 3));
  }

  else if (keys.s.pressed && lastKey === 's') {
    for (const boundary of boundaries) {
      if (
        rectangularCollision({
          rectangle1: {
            position: {
              x: player.position.x,
              y: player.position.y + 3
            },
            width: 48,
            height: 68
          },
          rectangle2: boundary
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving) movables.forEach((m) => (m.position.y -= 3));
  }

  else if (keys.d.pressed && lastKey === 'd') {
    for (const boundary of boundaries) {
      if (
        rectangularCollision({
          rectangle1: {
            position: {
              x: player.position.x + 3,
              y: player.position.y
            },
            width: 48,
            height: 68
          },
          rectangle2: boundary
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving) movables.forEach((m) => (m.position.x -= 3));
  }
}

animate();

window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'w':
    case 'a':
    case 's':
    case 'd':
      keys[e.key].pressed = true;
      lastKey = e.key;
      break;
  }
});

window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'w':
    case 'a':
    case 's':
    case 'd':
      keys[e.key].pressed = false;
      break;
  }
});
