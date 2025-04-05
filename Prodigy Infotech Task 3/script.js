let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = false;
let mode = 'player';

function startGame(selectedMode) {
    mode = selectedMode;
    gameActive = true;
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    document.getElementById('status').innerText = `Player ${currentPlayer}'s turn`;
    renderBoard();
}

function renderBoard() {
    const boardElement = document.getElementById('game-board');
    boardElement.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.dataset.index = i;
        cellElement.innerText = board[i];
        cellElement.onclick = () => handleMove(i);
        boardElement.appendChild(cellElement);
    }
    drawWinningLine();
}

function handleMove(index) {
    if (!gameActive || board[index] !== '') return;
    board[index] = currentPlayer;
    renderBoard();
    const winningPattern = checkWin();
    if (winningPattern) {
        document.getElementById('status').innerText = `${currentPlayer} Wins!`;
        drawWinningLine(winningPattern);
        gameActive = false;
        return;
    }
    if (!board.includes('')) {
        document.getElementById('status').innerText = "It's a Draw!";
        gameActive = false;
        return;
    }
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    document.getElementById('status').innerText = `Player ${currentPlayer}'s turn`;
    if (mode === 'ai' && currentPlayer === 'O') aiMove();
}

function aiMove() {
    let emptyCells = board.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
    let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    handleMove(randomIndex);
}

function checkWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return pattern;
        }
    }
    return null;
}

function drawWinningLine(pattern) {
    if (!pattern) return;
    const boardElement = document.getElementById('game-board');
    const line = document.createElement('div');
    line.classList.add('winning-line');
    boardElement.appendChild(line);

    const positions = pattern.map(index => document.querySelector(`.cell[data-index='${index}']`).getBoundingClientRect());
    const boardRect = boardElement.getBoundingClientRect();
    const x1 = positions[0].left + positions[0].width / 2 - boardRect.left;
    const y1 = positions[0].top + positions[0].height / 2 - boardRect.top;
    const x2 = positions[2].left + positions[2].width / 2 - boardRect.left;
    const y2 = positions[2].top + positions[2].height / 2 - boardRect.top;

    line.style.width = `${Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)}px`;
    line.style.transform = `rotate(${Math.atan2(y2 - y1, x2 - x1)}rad)`;
    line.style.left = `${x1}px`;
    line.style.top = `${y1}px`;
}

function resetGame() {
    startGame(mode);
}

window.onload = () => {
    document.getElementById('status').innerText = "Click a mode to start the game";
};
