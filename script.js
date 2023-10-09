//create a tic tac toe game

//create a board
const GameBoard = (function() {
    const rows = 3;
    const columns = 3;
    let board = [];
    const createBoard = () => {
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i][j] = Cell(null);
            }
        }
        return board;
    }
    createBoard();
    const getBoard = () => board;
    return {createBoard ,getBoard};
})();

//Cell factory function
function Cell (marker) {
    return {marker};
}

//create a player factory function
function Player (name, marker) {
    return {name, marker};
}

//create a game controller
const GameController = (function() {
    let player1 = Player('Player 1', 'X');
    let player2 = Player('Player 2', 'O');
    let currentPlayer = player1;
    let gameBoard = GameBoard.getBoard();
    let gameWon = false;
    let winner = '';
    const getGameBoard = () => gameBoard;
    const getCurrentPlayer = () => currentPlayer;
    const getGameWon = () => gameWon;
    const getWinner = () => winner;
    const placeMarker = (row, column) => {
        gameBoard[row][column] = Cell(currentPlayer.marker);
    }
    const changePlayer = () => {
        if(currentPlayer === player1) {
            currentPlayer = player2;
        } else {
            currentPlayer = player1;
        }
    }
    const checkWinner = () => {
        //check rows
        for(let i = 0; i < 3; i++) {
            if(gameBoard[i][0].marker === gameBoard[i][1].marker && gameBoard[i][1].marker === gameBoard[i][2].marker
                && gameBoard[i][0].marker !== null) {
                gameWon = true;
                winner = currentPlayer;
                return getGameWon(), getWinner();
            } else {
                continue;
            }
        }
        //check columns
        for(let i = 0; i < 3; i++) {
            if(gameBoard[0][i].marker === gameBoard[1][i].marker && gameBoard[1][i].marker === gameBoard[2][i].marker
                && gameBoard[0][i].marker !== null) {
                gameWon = true;
                winner = currentPlayer;
                return getGameWon(), getWinner();
            } else {
                continue;
            }
        }
        //check diagonals
        if(gameBoard[0][0].marker === gameBoard[1][1].marker && gameBoard[1][1].marker === gameBoard[2][2].marker
            && gameBoard[0][0].marker !== null) {
            gameWon = true;
            winner = currentPlayer;
            return getGameWon(), getWinner();
        }
        if(gameBoard[0][2].marker === gameBoard[1][1].marker && gameBoard[1][1].marker === gameBoard[2][0].marker
            && gameBoard[0][2].marker !== null) {
            gameWon = true;
            winner = currentPlayer;
            return getGameWon(), getWinner();
        }
    }
    const resetGame = () => {
        gameBoard = GameBoard.createBoard();
        currentPlayer = player1;
        gameWon = false;
        winner = '';
    }
    return {getGameBoard, getCurrentPlayer, placeMarker, getGameWon, getWinner, changePlayer, checkWinner, resetGame};
})();

//create a display controller
const DisplayController = (function() {
    const gameBoardDiv = document.querySelector('#game-board');
    const playerTurnDiv = document.querySelector('#player-turn');
    const winnerDiv = document.querySelector('#winner');
    const resetButton = document.querySelector('#reset');
    const render = () => {
        gameBoardDiv.innerHTML = '';
        for(let i = 0; i < GameController.getGameBoard().length; i++) {
            for(let j = 0; j < GameController.getGameBoard()[i].length; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.setAttribute('data-row', i);
                cell.setAttribute('data-column', j);
                cell.textContent = GameController.getGameBoard()[i][j].marker;
                gameBoardDiv.appendChild(cell);
            }
        }
        playerTurnDiv.textContent = `It's ${GameController.getCurrentPlayer().name}'s turn!`;
        if(GameController.getGameWon()) {
            winnerDiv.textContent = `${GameController.getWinner().name} won!`;
        } else {
            winnerDiv.textContent = '';
        }
    }
    const addCellListeners = () => {
        const gameBoardDiv = document.querySelector('#game-board');
        gameBoardDiv.addEventListener('click', (event) => {
            const cell = event.target;
            if (!GameController.getGameWon() && cell.classList.contains('cell') && cell.textContent === '') {
                GameController.placeMarker(cell.dataset.row, cell.dataset.column);
                GameController.checkWinner();
                if (GameController.getGameWon()) {
                    render();
                    return;
                }
                GameController.changePlayer();
                render();
            }
        });
    }    
    const addResetListener = () => {
        resetButton.addEventListener('click', () => {
            GameController.resetGame();
            render();
        })
    }
    return {render, addCellListeners, addResetListener};
})();

DisplayController.render();
DisplayController.addCellListeners();
DisplayController.addResetListener();