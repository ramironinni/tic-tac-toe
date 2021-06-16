window.addEventListener("DOMContentLoaded", () => {
    const grid = (() => {
        const db = [];
        for (let i = 0; i < 9; i++) {
            db.push(null);
        }
        return { db };
    })();

    const players = (() => {
        const player = (alias, symbol) => {
            return { alias, symbol };
        };

        const x = player("X", "X"); // TODO ask name to player A
        const o = player("O", "O"); // TODO ask name to player B

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

            grid.db[position] = players.current;
            displayMove(e);

            console.log(grid.db);
        }

        function displayMove(e) {
            const currentPosition = e.target;
            currentPosition.innerText = players.current.symbol;
            currentPosition.classList.add("taken");

            const userClass = players.current.symbol === "X" ? "xs" : "os";
            currentPosition.classList.add(userClass);
        }

        function togglePlayer() {
            players.current =
                players.current === players.x ? players.o : players.x;
        }

        function processMove(e) {
            saveMove(e);
            togglePlayer();
        }

        const gridDiv = document.getElementById("grid");
        gridDiv.addEventListener("click", processMove);
    };

    function newGame() {
        const formStartGame = document.getElementById("form-start-game");
        formStartGame.addEventListener("submit", setGameBoard);

        function setGameBoard(e) {
            e.preventDefault();

            // const playerXAlias = document.getElementById("player-x-alias");
            // const playerOAlias = document.getElementById("player-o-alias");

            const form = e.currentTarget;
            form.classList.add("hidden");

            const gridDiv = document.getElementById("grid");
            gridDiv.classList.remove("hidden");

            playGame();
        }
    }

    newGame();
});
