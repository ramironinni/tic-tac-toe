window.addEventListener("DOMContentLoaded", () => {
    // *** PLAYERS ***

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

    // *** GRID ***

    const grid = (() => {
        const db = (() => {
            const storage = [];
            for (let i = 0; i < 9; i++) {
                storage.push(null);
            }

            const isTaken = (selectedPos) => {
                if (storage[selectedPos]) {
                    return true;
                }
                return false;
            };

            const save = (selectedPos) => {
                storage[selectedPos] = players.current.symbol;
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

                let winner = false;
                let winnerMoves = false;
                let isATie = false;

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
            const refresh = () => {
                db.storage.forEach((position, index) => {
                    if (position != null) {
                        const positionDiv = document.getElementById(
                            `position-${index}`
                        );
                        positionDiv.innerText = position;
                        positionDiv.classList.add("taken");

                        const playerClass = position === "X" ? "xs" : "os";
                        positionDiv.classList.add(playerClass);
                    }
                });
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

            const winnerMoves = (winningPositions) => {
                const gridPositions = div.children;
                winningPositions.forEach((pos) => {
                    gridPositions[pos].classList.add("winning-position");
                });
            };

            const hide = () => {
                div.classList.add("hidden");
            };

            return { refresh, clearMoves, winnerMoves, hide };
        })();

        const show = () => {
            div.classList.remove("hidden");
        };

        const reset = () => {
            db.clear();
            display.clearMoves();
            players.current = players.x;
        };

        return { db, display, show, div, reset };
    })();

    // *** GAME ***

    const game = (() => {
        let autoSecondPlayer = false;

        const processMove = (position) => {
            grid.db.save(position);
            grid.display.refresh();

            const { winner, winnerMoves, isATie } = grid.db.checkWinner();
            if (winner || isATie) {
                endGame(winner, winnerMoves, isATie);
                return;
            }

            players.current.toggle();
        };

        function getAutoMove() {
            const notTakenPositions = (() => {
                const pos = grid.db.storage.reduce((a, e, i) => {
                    if (e === null) a.push(i);
                    return a;
                }, []);
                return pos;
            })();

            const randomIndex = Math.floor(
                Math.random() * notTakenPositions.length
            );

            processMove(notTakenPositions[randomIndex]);
        }

        const getPlayerInput = (e) => {
            const selectedPos = e.target.dataset.pos;
            if (grid.db.isTaken(selectedPos)) {
                return;
            }
            processMove(selectedPos);

            const { winner } = grid.db.checkWinner();
            if (autoSecondPlayer && !winner) {
                getAutoMove();
            }
        };

        const allowMoves = () => {
            grid.div.addEventListener("click", getPlayerInput);
        };

        const formStartGame = document.getElementById("form-start-game");

        const showFormStart = () => {
            formStartGame.classList.remove("hidden");
        };
        const hideFormStart = () => {
            formStartGame.classList.add("hidden");
        };

        function endGame(winner, winnerMoves, isATie) {
            const gameOverDiv = document.getElementById("game-over");

            function gameOverControllsShow() {
                gameOverDiv.classList.remove("hidden");
            }

            function gameOverControllsHide() {
                gameOverDiv.classList.add("hidden");
            }

            function displayControlls() {
                function displayPlayAgainControll() {
                    const playAgainBtn = document.getElementById("play-again");
                    playAgainBtn.addEventListener("click", playAgain);
                    function playAgain() {
                        gameOverControllsHide();
                        grid.reset();
                        allowMoves();
                    }
                }

                function displayChangePlayersControll() {
                    const changePlayersBtn =
                        document.getElementById("change-players");
                    changePlayersBtn.addEventListener(
                        "click",
                        goBackToStartScreen
                    );

                    function goBackToStartScreen() {
                        grid.display.hide();
                        gameOverControllsHide();
                        autoSecondPlayer = false;
                        grid.reset();
                        showFormStart();
                        setNewOne();
                    }
                }

                gameOverControllsShow();
                displayChangePlayersControll();
                displayPlayAgainControll();
            }

            function displayWinner() {
                const winnerDiv = document.getElementById("winner");
                if (isATie) {
                    winnerDiv.innerText = "It's a tie";
                    return;
                }

                winnerDiv.innerText = `Winner: ${winner.symbol}`;
            }

            function displayWinnerMoves() {
                if (!isATie) {
                    grid.display.winnerMoves(winnerMoves);
                }
            }

            const stopFurtherMoves = () => {
                grid.div.removeEventListener("click", getPlayerInput);
            };

            stopFurtherMoves();
            displayWinner();
            displayWinnerMoves();
            displayControlls();
        }

        const setNewOne = () => {
            formStartGame.addEventListener("submit", setGameBoard);

            function setGameBoard(e) {
                e.preventDefault();

                const singlePlayer = e.target[0].checked;
                if (singlePlayer) {
                    autoSecondPlayer = true;
                }

                hideFormStart();
                grid.show();
                allowMoves();
            }
        };

        const askType = () => {
            const singlePlayer = document.getElementById("single-player-label");
            const twoPlayers = document.getElementById("two-players-label");

            const playersContainer = document.getElementById(
                "players-quantity-container"
            );

            playersContainer.addEventListener("click", displayType);

            function displayType(e) {
                if (e.currentTarget != e.target) {
                    const label = e.target;
                    if (label === singlePlayer) {
                        singlePlayer.classList.add("players-selected");
                        twoPlayers.classList.remove("players-selected");
                    }

                    if (label === twoPlayers) {
                        twoPlayers.classList.add("players-selected");
                        singlePlayer.classList.remove("players-selected");
                    }

                    const startBtn = document.getElementById(
                        "start-btn-container"
                    );
                    startBtn.classList.remove("hidden");
                }
            }
        };

        return { askType, setNewOne };
    })();

    game.askType();
    game.setNewOne();
});
