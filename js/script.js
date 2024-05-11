const rows = 40; //Número de filas
const cols = 40; //Número de columnas
let board = []; // Tablero. Array bidimensional
let intervalId = null; // Id del intervalo de tiempo

document.addEventListener('DOMContentLoaded', function () {
    let gameBoard = document.getElementById('gameBoard');

    gameBoard.style.gridTemplateColumns = `repeat(${cols}, 15px)`;
    gameBoard.style.gridTemplateRows = `repeat(${rows}, 15px)`;
});

document.addEventListener('DOMContentLoaded', createBoard);


function createBoard() {
    const gameBoard = document.getElementById('gameBoard');

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement('div'); // Crea un div en cada iteración 
            cell.className = 'cell'; // Le asigna al div la clase cell
            cell.onclick = () => toggleCell(i, j);
            gameBoard.appendChild(cell); //Ageraga el div de la celda como hijo de gameBoard
            board[i][j] = cell;
        }
    }
}

// Agrega la clase live a la celda especifica
function toggleCell(i, j) {
    board[i][j].classList.toggle(`live`);
}

function startGame() {
    if (intervalId) return;
    intervalId = setInterval(updateBoard, 200);
}

function stopGame() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
}

function clearBoard() {
    board.forEach(row => row.forEach(cell => cell.classList.remove('live')));
}

function updateBoard() {
    let changes = []; // Almacenar los cambios para aplicarlos despues de calcular todos los estados.

    changes = calculateBoardStatus(changes);
    // Aplicar todos los cambios despues de calcular el nuevo estado del tablero
    changes.forEach(change => {
        if (change.live) {
            board[change.i][change.j].classList.add('live');
        } else {
            board[change.i][change.j].classList.remove('live');
        }
    });
}

function calculateBoardStatus(changes) {
    console.log("entre calculateBoardStatus")
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let liveCount = countLiveNeighbors(i, j);

            let isLive = board[i][j].classList.contains(`live`);
            console.log("entre for")

            if (isLive && (liveCount < 2 || liveCount > 3)) { // 1. Regla // Muere por soledad o sobre poblacion 
                changes.push({ i, j, live: false });
                console.log("muerta")
            } else if (!isLive && liveCount === 3) { // 2. Regla // Nace una nueva celula
                changes.push({ i, j, live: true });
                console.log("viva")
            }
        }
    }
    return changes;
}

function countLiveNeighbors(row, col) {
    let count = 0;

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;

            let x = row + i;
            let y = col + j;

            if (x >= 0 && x < rows && y >= 0 && y < cols && board[x][y].classList.contains(`live`)) {
                count++;   
            }
        }
    }
    return count;
}

// ---------- Este código sirve para probar la función countLiveNeighbors -----------
let show = document.getElementById('show');

show.addEventListener("click", function () {
    count = showLiveNeighbors(1, 1);

    let styles = `
    background:linear-gradient(#884ced, #ec1cce);
    color:#fff;
    padding: 5px 10px;
`;

    console.log(`%cCantidad de vecinas vivas: ${count}`, styles);
});

function showLiveNeighbors(row, col) {
    let count = 0;
    let cells = ``;
    let iterators = ``;

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) {
                cells += `(${row},${col})  `;
                iterators += `(${i},${j})  `;
                continue;
            }

            let x = row + i;
            let y = col + j;

            iterators += `(${i},${j})  `;

            if (x >= 0 && x < rows && y >= 0 && y < cols) {
                if (board[x][y].classList.contains('live')) {
                    count++;
                    cells += `(${x},${y} | viva)  `;
                } else {
                    cells += `(${x},${y} | muerta)  `;
                }
            } else {
                cells += `(${x},${y} | fuera)  `;
            }
        }

        cells += `\n`;
        iterators += `\n`;
    }

    let styles1 = `
        background-color:#41ABE0;
        color:#fff;
        padding: 5px 10px;
    `;

    let styles2 = `
        background-color:#E13143;
        color:#fff;
        padding: 5px 10px;
    `;

    console.log('%cValores de i y j', styles1);
    console.log(`%c${iterators}`, styles1);

    console.log('%cCeldas analizadas', styles2);
    console.log(`%c${cells}`, styles2);

    return count;
}