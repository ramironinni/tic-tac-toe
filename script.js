window.addEventListener("DOMContentLoaded", () => {
    const players = (() => {
        function player(symbol) {
            const startGame = () => {
                grid.div.addEventListener("click", players.current.makeMove);
            };

            const endGame = () => {
                grid.div.removeEventListener("click", players.current.makeMove);
            };

            const makeMove = (e) => {
                grid.db.save(e);
                grid.display.showMove(e);
                const { winner, winningMove } = grid.db.checkWinner();
                if (winner) {
                    gameOver(winner, winningMove);
                    return;
                }
                toggle();
            };

            function gameOver(winner, winningMove) {
                function displayWinningMove() {
                    grid.display.winningMove(winningMove);
                }

                function displayGameOver() {
                    endGame();
                    const winnerDiv = document.getElementById("winner");
                    winnerDiv.innerText = `Winner: ${winner.symbol}`;
                    const gameOver = document.getElementById("game-over");
                    gameOver.classList.remove("hidden");

                    const playAgainBtn = document.getElementById("play-again");
                    playAgainBtn.addEventListener("click", playAgain);
                }

                function playAgain() {
                    const gameOver = document.getElementById("game-over");
                    gameOver.classList.add("hidden");
                    grid.db.clear();
                    grid.display.clearMoves();
                    startGame();
                }

                displayGameOver();
                displayWinningMove();
            }

            const toggle = () => {
                players.current =
                    players.current === players.x ? players.o : players.x;
            };

            return { symbol, makeMove, startGame };
        }

        const x = player("X");
        const o = player("O");
        let current = x;

        return { x, o, current };
    })();

    const grid = (() => {
        const db = (() => {
            const storage = [];
            for (let i = 0; i < 9; i++) {
                storage.push(null);
            }

            const save = (e) => {
                const selectedPos = e.target.dataset.pos;
                const isTaken = grid.db.storage[selectedPos];

                if (isTaken) {
                    return;
                }

                grid.db.storage[selectedPos] = players.current.symbol;
                console.log(storage);
            };

            const clear = () => {
                for (let i = 0; i < 9; i++) {
                    storage[i] = null;
                }
            };

            const checkWinner = () => {
                console.table(storage);

                function getMoves(playerSymbol) {
                    const moves = storage.reduce((a, e, i) => {
                        if (e === playerSymbol) a.push(i);
                        return a;
                    }, []);
                    return moves;
                }

                const moves = (() => {
                    const x = getMoves(players.x.symbol);
                    const o = getMoves(players.o.symbol);
                    return { x, o };
                })();

                // console.log(xMoves);
                // console.log(oMoves);
                const gameOverResults = [
                    [0, 3, 6],
                    [1, 4, 7],
                    [2, 5, 8],
                    [0, 1, 2],
                    [3, 4, 5],
                    [6, 7, 8],
                    [0, 4, 8],
                    [2, 4, 6],
                ];

                function checkForWinner(moves, player, result) {
                    if (
                        moves.indexOf(result[0]) > -1 &&
                        moves.indexOf(result[1]) > -1 &&
                        moves.indexOf(result[2]) > -1
                    ) {
                        winner = player;
                        winningMove = result;
                    }
                }

                let winner = null;
                let winningMove = null;

                gameOverResults.forEach((result) => {
                    checkForWinner(moves.x, players.x, result);
                    checkForWinner(moves.o, players.o, result);
                });

                return { winner, winningMove };
            };

            return { storage, save, clear, checkWinner };
        })();

        const div = document.getElementById("grid");

        const display = (() => {
            const showMove = (e) => {
                const selectedPos = e.target;

                if (selectedPos.innerText) {
                    return;
                }

                selectedPos.innerText = players.current.symbol;
                selectedPos.classList.add("taken");

                const playerClass =
                    players.current.symbol === "X" ? "xs" : "os";
                selectedPos.classList.add(playerClass);
            };

            const clearMoves = () => {
                const positions = Array.from(div.children);
                positions.forEach((position) => {
                    position.innerText = "";
                    position.classList.remove("taken");
                    position.classList.remove("xs");
                    position.classList.remove("os");
                    position.classList.remove("winning-position");
                });
            };

            const winningMove = (winningPositions) => {
                const gridPositions = div.children;
                winningPositions.forEach((pos) => {
                    gridPositions[pos].classList.add("winning-position");
                });
            };

            return { showMove, clearMoves, winningMove };
        })();

        const show = () => {
            div.classList.remove("hidden");
        };
        // const hide = () => {
        //     div.classList.add("hidden");
        // };

        return { db, display, show, div };
    })();

    function newGame() {
        const formStartGame = document.getElementById("form-start-game");
        formStartGame.addEventListener("submit", setGameBoard);

        function setGameBoard(e) {
            e.preventDefault();

            formStartGame.classList.add("hidden");
            grid.show();
            players.current.startGame();
        }
    }

    newGame();
});
