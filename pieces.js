const PIECES = [
    [Z, 'red'],
    [S, 'green'],
    [T, 'yellow'],
    [O, 'blue'],
    [L, 'purple'],
    [I, 'cyan'],
    [J, 'orange'],
];

function randomPiece() {
    const random = Math.floor(Math.random() * PIECES.length);
    return new PIECES(PIECES[r][0], PIECES[r][1]);
}

let p = randomPiece();

function Piece(tetromino, color) {
    this.tetromino = tetromino;
    this.color = color;

    this.orientation = 0; //tetrominoN
    this.activeTetromino = this.tetromino[this.orientation];

    this.x = 3;
    this.y = -2;
}

Piece.prototype.fill = function(color) {
    for (r = 0; r < this.activeTetromino.length; r++) {
        for (c = 0; c < this.activeTetromino.length; c++) {
            if (this.activeTetromino[r][c]) {
                drawSquare(this.x + c, this.y + r, color);
            }
        }
    }
}

Piece.prototype.draw = function() {
    this.fill(this.color);
}

Piece.prototype.clear = function() {
    this.fill(VACANT);
}

Piece.prototype.moveDown = function() {
    if (!this.collision(0, 1, this.activeTetromino)) {
        this.clear();
        this.y++;
        this.draw();
    } else {
        this.lock();
        p = randomPiece();
    }
}

Piece.prototype.moveRight = function() {
    if (!this.collision(1, 0, this.activeTetromino)) {
        this.clear();
        this.x++;
        this.draw();
    }
}

Piece.prototype.moveLeft = function() {
    if (!this.collision(-1, 0, this.activeTetromino)) {
        this.clear();
        this.x--;
        this.draw();
    }
}

Piece.prototype.rotate = function() {
    let nextPattern = this.tetromino[(this.orientation + 1) % this.tetromino.length];
    let kick = 0;

    if (this.collision(0, 0, nextPattern)) {
        if (this.x > COLUMNS / 2) {
            kick = -1;
        } else {
            kick = 1;
        }
    }

    if (!this.collision(kick, 0, nextPattern)) {
        this.clear();
        this.x += kick;
        this.orientation = (this.orientation + 1) % this.tetromino.length;
        this.activeTetromino = this.tetromino[this.orientation];
        this.draw();
    }

    let score = 0;

    Piece.prototype.lock = function() {
        for (r = 0; r < this.activeTetromino.length; r++) {
            for (c = 0; c < this.activeTetromino.length; c++) {
                if (!this.activeTetromino[r][c]) {
                    continue;
                }
                if (this.y + r < 0) {
                    alert('Game over!');
                    gameOver = true;
                    break;
                }

                board[this.y + r][this.x + c] = this.color;
            }
        }

        for (r = 0; r < ROWS; r++) {
            let isRowFull = true;
            for (c = 0; c < COLUMNS; c++) {
                isRowFull = isRowFull && board[r][c] !== VACANT;
            }
            if (isRowFull) {
                for (y = r; y > 1; y--) {
                    for (c = 0; c < COLUMNS; c++) {
                        board[y][c] = board[y-1][c];
                    }
                }
                for (c = 0; c < COLUMNS; c++) {
                    board[0][c] = VACANT;
                }
                score += 10;
            }
        }

        drawBoard();
        scoreElement.innerHTML = score;
    }
}

Piece.prototype.collision = function(x, y, piece) {
    for (r = 0; r < piece.length; r++) {
        for (c = 0; c < piece.length; c++) {
            if (!piece[r][c]) {
                continue;
            }
            let newX = this.x + c + x;
            let newY = this.y + r + y;

            if (newX < 0 || newX >= COLUMNS || newY >= ROWS) {
                return true;
            }
            if (newY < 0) {
                continue;
            }
            if (board[newY][newX] !== VACANT) {
                return true;
            }
        }
    }
    return false;
}

document.addEventListener('keydown', CONTROL);

function CONTROL(event) {
    const { keyCode } = event;
    switch(keyCode) {
        case 37: 
            p.moveLeft();
            dropStart = Date.now();
            break;
        case 38:
            p.rotate();
            dropStart = Date.now();
            break;
        case 39:
            p.moveRight();
            dropStart = Date.now();
            break;
        case 40:
            p.moveDown();
            break;
        default:
            break;
    }
}

let dropStart = Date.now();
let gameOver = false;

function drop() {
    let now = Date.now();
    let delta = now - dropStart;
    if (delta > 1000) {
        p.moveDown();
        dropStart = Date.now();
    }
    if(!gameOver) {
        requestAnimationFrame(drop);
    }
}

drop();