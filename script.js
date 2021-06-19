window.addEventListener("DOMContentLoaded", () => {
    const players = (() => {
        function player(symbol) {
            const toggle = () => {
                players.current =
                    players.current === players.x ? players.o : players.x;
            };

            return { symbol, toggle };
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

            const isTaken = (selectedPos) => {
                if (grid.db.storage[selectedPos]) {
                    return true;
                }
                return false;
            };

            const save = (e) => {
                const selectedPos = e.target.dataset.pos;
                grid.db.storage[selectedPos] = players.current.symbol;
            };

            const clear = () => {
                for (let i = 0; i < 9; i++) {
                    storage[i] = null;
                }
            };

            const checkWinner = () => {
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

                const gameOverWinningMoves = [
                    [0, 3, 6],
                    [1, 4, 7],
                    [2, 5, 8],
                    [0, 1, 2],
                    [3, 4, 5],
                    [6, 7, 8],
                    [0, 4, 8],
                    [2, 4, 6],
                ];

                function checkForWinner(moves, player, winningMoves) {
                    if (
                        moves.indexOf(winningMoves[0]) > -1 &&
                        moves.indexOf(winningMoves[1]) > -1 &&
                        moves.indexOf(winningMoves[2]) > -1
                    ) {
                        winner = player;
                        winnerMoves = winningMoves;
                    }
                }

                let winner = null;
                let winnerMoves = null;
                let isATie = null;

                gameOverWinningMoves.forEach((winningMoves) => {
                    checkForWinner(moves.x, players.x, winningMoves);
                    checkForWinner(moves.o, players.o, winningMoves);
                });

                if (!storage.some((position) => position === null) && !winner) {
                    isATie = true;
                }

                return { winner, winnerMoves, isATie };
            };

            return { storage, isTaken, save, clear, checkWinner };
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

            const showWinnerMoves = (winningPositions) => {
                const gridPositions = div.children;
                winningPositions.forEach((pos) => {
                    gridPositions[pos].classList.add("winning-position");
                });
            };

            return { showMove, clearMoves, showWinnerMoves };
        })();

        const show = () => {
            div.classList.remove("hidden");
        };

        return { db, display, show, div };
    })();

    const game = (() => {
        const newOne = () => {
            const formStartGame = document.getElementById("form-start-game");
            formStartGame.addEventListener("submit", setGameBoard);

            function setGameBoard(e) {
                e.preventDefault();

                formStartGame.classList.add("hidden");
                grid.show();
                start();
            }
        };

        const start = () => {
            grid.div.addEventListener("click", processMove);
        };

        const processMove = (e) => {
            const selectedPos = e.target.dataset.pos;
            if (grid.db.isTaken(selectedPos)) {
                return;
            }

            grid.db.save(e);
            grid.display.showMove(e);
            const { winner, winnerMoves, isATie } = grid.db.checkWinner();
            if (winner) {
                over(winner, winnerMoves);
                return;
            }
            if (isATie) {
                over(winner, winnerMoves, isATie);
            }
            players.current.toggle();
        };

        const end = () => {
            grid.div.removeEventListener("click", processMove);
        };

        function over(winner, winnerMoves, isATie) {
            function displayWinningMove() {
                if (!isATie) {
                    grid.display.showWinnerMoves(winnerMoves);
                }
            }

            function displayGameOver() {
                end();
                const winnerDiv = document.getElementById("winner");
                const gameOver = document.getElementById("game-over");
                gameOver.classList.remove("hidden");
                const playAgainBtn = document.getElementById("play-again");
                playAgainBtn.addEventListener("click", playAgain);

                if (isATie) {
                    winnerDiv.innerText = "It's a tie";
                    return;
                }

                winnerDiv.innerText = `Winner: ${winner.symbol}`;
            }

            function playAgain() {
                const gameOver = document.getElementById("game-over");
                gameOver.classList.add("hidden");
                grid.db.clear();
                grid.display.clearMoves();
                players.current = players.x;
                start();
            }

            displayGameOver();
            displayWinningMove();
        }

        return { newOne };
    })();

    game.newOne();
});
