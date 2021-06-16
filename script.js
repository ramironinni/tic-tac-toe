window.addEventListener("DOMContentLoaded", () => {
    const grid = (() => {
        const db = [];
        for (let i = 0; i < 9; i++) {
            db.push(null);
        }

        const div = document.getElementById("grid");

        return { db, div };
    })();

    const players = (() => {
        const player = (symbol) => {
            return { symbol };
        };

        const x = player("X"); // TODO ask name to player A
        const o = player("O"); // TODO ask name to player B

        let current = x;

        return { x, o, current };
    })();

    const playGame = () => {
        function saveMove(e) {
            const position = e.target.dataset.pos;
            const selectedPosition = grid.db[position];

            if (selectedPosition) {
                return;
            }

            grid.db[position] = players.current.symbol;
            console.log(grid.db);
        }

        function checkWinner() {
            // console.table(grid.db);
            let winner = null;

            const xMoves = grid.db.reduce((a, e, i) => {
                if (e === "X") a.push(i);
                return a;
            }, []);

            const oMoves = grid.db.reduce((a, e, i) => {
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
        }

        function displayMove(e) {
            const currentPosition = e.target;

            if (currentPosition.innerText) {
                return;
            }

            currentPosition.innerText = players.current.symbol;
            currentPosition.classList.add("taken");

            const playerClass = players.current.symbol === "X" ? "xs" : "os";
            currentPosition.classList.add(playerClass);
        }

        function togglePlayer() {
            players.current =
                players.current === players.x ? players.o : players.x;
        }

        function endGame(winner) {
            // grid.div.classList.add("hidden");
            const winnerDiv = document.getElementById("winner");
            winnerDiv.innerText = `Winner: ${winner.symbol}`;
            // winnerDiv.classList.remove("hidden");
            console.log(winner);
        }

        function processMove(e) {
            saveMove(e);
            displayMove(e);

            const winner = checkWinner();
            if (winner) {
                endGame(winner);
                return;
            }

            togglePlayer();
        }

        const gridDiv = document.getElementById("grid");
        gridDiv.addEventListener("click", processMove);

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
    };

    function newGame() {
        const formStartGame = document.getElementById("form-start-game");
        formStartGame.addEventListener("submit", setGameBoard);

        function setGameBoard(e) {
            e.preventDefault();

            // const playerXAlias = document.getElementById("player-x-alias");
            // const playerOAlias = document.getElementById("player-o-alias");

            formStartGame.classList.add("hidden");

            grid.div.classList.remove("hidden");

            playGame();
        }
    }

    newGame();
});
