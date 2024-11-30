document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('sudoku-grid');
    const solveButton = document.getElementById('solve-button');
    const undoButton = document.getElementById('undo-button');
    const clearButton = document.getElementById('clear-button');
    const gridButtons = document.querySelectorAll('.grid-button');
    let SIZE = 9;  // Default size is 9x9

    // Event listener for grid buttons
    gridButtons.forEach(button => {
        button.addEventListener('click', () => {
            SIZE = parseInt(button.getAttribute('data-size'));
            createGrid(SIZE);
        });
    });

    // Create a grid by default (9x9)
    createGrid(SIZE);

    solveButton.addEventListener('click', () => {
        const board = getBoard();
        if (solveSudoku(board)) {
            updateBoard(board);
        } else {
            alert('No solution exists!');
        }
    });

    undoButton.addEventListener('click', () => {
        const cells = grid.querySelectorAll('input');
        cells.forEach(cell => {
            if (cell.classList.contains('user-input')) {
                cell.value = '';
                cell.classList.remove('user-input');
            }
        });
    });

    clearButton.addEventListener('click', () => {
        const cells = grid.querySelectorAll('input');
        cells.forEach(cell => {
            cell.value = '';
            cell.classList.remove('user-input');
            cell.classList.remove('solved');
            cell.classList.remove('invalid');
        });
    });

    function createGrid(size) {
        grid.innerHTML = '';  // Clear existing grid
        grid.style.gridTemplateColumns = `repeat(${size}, 40px)`;  // Update the columns

        for (let i = 0; i < size * size; i++) {
            const cell = document.createElement('input');
            cell.type = 'number';
            cell.min = 1;
            cell.max = size;
            cell.addEventListener('input', () => {
                cell.classList.add('user-input');
            });
            grid.appendChild(cell);
        }
    }

    function getBoard() {
        const cells = grid.querySelectorAll('input');
        const board = [];
        for (let i = 0; i < SIZE; i++) {
            const row = [];
            for (let j = 0; j < SIZE; j++) {
                const value = cells[i * SIZE + j].value;
                row.push(value === '' ? 0 : parseInt(value));
            }
            board.push(row);
        }
        return board;
    }

    function updateBoard(board) {
        const cells = grid.querySelectorAll('input');
        for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE; j++) {
                const cell = cells[i * SIZE + j];
                if (!cell.classList.contains('user-input')) {
                    cell.value = board[i][j];
                    cell.classList.add('solved');
                }
            }
        }
    }

    function isSafe(board, row, col, num) {
        for (let x = 0; x < SIZE; x++) {
            if (board[row][x] === num || board[x][col] === num) {
                return false;
            }
        }
        return true;
    }

    function solveSudoku(board) {
        for (let row = 0; row < SIZE; row++) {
            for (let col = 0; col < SIZE; col++) {
                if (board[row][col] === 0) {
                    for (let num = 1; num <= SIZE; num++) {
                        if (isSafe(board, row, col, num)) {
                            board[row][col] = num;
                            if (solveSudoku(board)) return true;
                            board[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }
});
