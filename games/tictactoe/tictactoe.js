class TicTacToe {
    constructor() {
        this.board = document.getElementById('board');
        this.cells = document.querySelectorAll('[data-cell]');
        this.statusElement = document.getElementById('status');
        this.restartButton = document.getElementById('restart-btn');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.gameState = ['', '', '', '', '', '', '', '', ''];
        
        this.winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        this.init();
    }

    init() {
        this.cells.forEach(cell => {
            cell.addEventListener('click', (e) => this.handleCellClick(e), { once: true });
        });

        this.restartButton.addEventListener('click', () => this.restartGame());
    }

    handleCellClick(e) {
        const cell = e.target;
        const index = Array.from(this.cells).indexOf(cell);

        if (this.gameState[index] !== '' || !this.gameActive) {
            return;
        }

        this.gameState[index] = this.currentPlayer;
        cell.textContent = this.currentPlayer;
        cell.classList.add(this.currentPlayer.toLowerCase());

        if (this.checkWin()) {
            this.endGame(false);
        } else if (this.checkDraw()) {
            this.endGame(true);
        } else {
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            this.statusElement.textContent = `Spelare ${this.currentPlayer}'s tur`;
        }
    }

    checkWin() {
        return this.winningCombinations.some(combination => {
            const [a, b, c] = combination;
            if (
                this.gameState[a] &&
                this.gameState[a] === this.gameState[b] &&
                this.gameState[a] === this.gameState[c]
            ) {
                // Highlight winning combination
                this.cells[a].classList.add('winning');
                this.cells[b].classList.add('winning');
                this.cells[c].classList.add('winning');
                return true;
            }
            return false;
        });
    }

    checkDraw() {
        return this.gameState.every(cell => cell !== '');
    }

    endGame(draw) {
        this.gameActive = false;
        if (draw) {
            this.statusElement.textContent = 'Oavgjort!';
        } else {
            this.statusElement.textContent = `Spelare ${this.currentPlayer} vann! 🎉`;
        }
    }

    restartGame() {
        this.gameActive = true;
        this.currentPlayer = 'X';
        this.gameState = ['', '', '', '', '', '', '', '', ''];
        this.statusElement.textContent = `Spelare ${this.currentPlayer}'s tur`;
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winning');
        });

        // Re-add event listeners
        this.cells.forEach(cell => {
            cell.removeEventListener('click', (e) => this.handleCellClick(e));
            cell.addEventListener('click', (e) => this.handleCellClick(e), { once: true });
        });
    }
}

// Initialize the game
const game = new TicTacToe();
