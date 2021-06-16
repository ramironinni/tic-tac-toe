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

        const x = player("A", "X"); // TODO ask name to player A
        const o = player("B", "O"); // TODO ask name to player B

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

        const gridDiv = document.getElementById("grid");
        gridDiv.addEventListener("click", processMove);

        function processMove(e) {
            saveMove(e);
            togglePlayer();
        }
    };

    playGame();
});
