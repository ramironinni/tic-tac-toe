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
                const winner = grid.db.checkWinner();
                if (winner) {
                    gameOver(winner);
                    return;
                }
                toggle();
            };

            function gameOver(winner) {
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

                console.table(storage);
                let winner = null;

                const xMoves = storage.reduce((a, e, i) => {
                    if (e === "X") a.push(i);
                    return a;
                }, []);

                const oMoves = storage.reduce((a, e, i) => {
                    if (e === "O") a.push(i);
                    return a;
                }, []);

                // console.log(xMoves);
                // console.log(oMoves);

                gameOverResults.forEach((result) => {
                    if (
                        xMoves.indexOf(result[0]) > -1 &&
                        xMoves.indexOf(result[1]) > -1 &&
                        xMoves.indexOf(result[2]) > -1
                    ) {
                        winner = players.x;
                    }

                    if (
                        oMoves.indexOf(result[0]) > -1 &&
                        oMoves.indexOf(result[1]) > -1 &&
                        oMoves.indexOf(result[2]) > -1
                    ) {
                        winner = players.o;
                    }
                });

                return winner;
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
                });
            };
            return { showMove, clearMoves };
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
