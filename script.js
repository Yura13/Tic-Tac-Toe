(function () {
    "use strict";

    var board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];

    document.addEventListener("DOMContentLoaded", initBoardGame);

    // Create game board with button New Game
    function initBoardGame() {
        var tictactoe = document.getElementById("tictactoe");

        var newGameButton = document.createElement("button");
        newGameButton.innerHTML = "New Game";
        newGameButton.addEventListener("click", newGame);
        tictactoe.appendChild(newGameButton);

        var table = document.createElement("table");
        for (var i = 0; i < 3; i++) {
            var row = document.createElement("tr");
            table.appendChild(row);
            for (var j = 0; j < 3; j++) {
                var cell = document.createElement("td");
                cell.setAttribute("id", "c" + i + j);
                cell.addEventListener("click", moveHuman);
                row.appendChild(cell);
            }
        }
        tictactoe.appendChild(table);
        newGame();
    }

    // Human moves
    function moveHuman() {
        var cellId = this.getAttribute("id");
        var row = parseInt(cellId[1]);
        var col = parseInt(cellId[2]);
        if (board[row][col] === null) {
            board[row][col] = false;
            updateBoard();
            moveAI();
        }
    }

    // New game
    function newGame() {
        board = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];
        updateBoard();
    }

    // Update game board
    function updateBoard() {
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                var marker;
                if (board[i][j] === false) {
                    marker = "X";
                } else if (board[i][j] === true) {
                    marker = "O";
                } else {
                    marker = "";
                }
                document.getElementById("c" + i + j).innerHTML = marker;
            }
        }

        var winner = checkWinner();
        if (winner === 1) {
            alert("You Lose!");
            newGame();
        } else if (winner === 0) {
            alert("You Won!");
            newGame();
        } else if (winner === -1) {
            alert("Draw!");
            newGame();
        }
    }

    // Check winner's conditions
    function checkWinner() {
        var players = [true, false];
        var allNotNull = true;
        for (var n = 0; n < players.length; n++) {
            var player = players[n];
            var diagonalLineLeft = true;
            var diagonalLineRight = true;
            for (var i = 0; i < 3; i++) {
                if (board[i][i] != player) {
                    diagonalLineLeft = false;
                }
                if (board[2 - i][i] != player) {
                    diagonalLineRight = false;
                }
                var rowLine = true;
                var colLine = true;
                for (var j = 0; j < 3; j++) {
                    if (board[i][j] != player) {
                        rowLine = false;
                    }
                    if (board[j][i] != player) {
                        colLine = false;
                    }
                    if (board[i][j] === null) {
                        allNotNull = false;
                    }
                }
                if (rowLine || colLine) {
                    return player ? 1 : 0;
                }
            }
            if (diagonalLineLeft || diagonalLineRight) {
                return player ? 1 : 0;
            }
        }
        if (allNotNull) {
            return -1;
        }
        return null;
    }

    // AI moves
    function moveAI() {
        board = miniMax(board, true)[1];
        updateBoard();
    }

    // MiniMax
    function miniMax(board, player) {
        var winner = checkWinner();
        if (winner != null) {
            switch(winner) {
                case 1:
                    // AI wins
                    return [1, board];
                case 0:
                    // Human wins
                    return [-1, board];
                case -1:
                    // Draw
                    return [0, board];
            }
        } else {
            var nextQuantity = null;
            var nextBoard = null;

            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    if (board[i][j] === null) {
                        board[i][j] = player;
                        var quantity = miniMax(board, !player)[0];
                        if ((player && (nextQuantity === null || quantity > nextQuantity))
                            || (!player && (nextQuantity === null || quantity < nextQuantity))) {
                            nextBoard = board.map(function(arr) {
                                return arr.slice();
                            });
                            nextQuantity = quantity;
                        }
                        board[i][j] = null;
                    }
                }
            }
            return [nextQuantity, nextBoard];
        }
    }
})();