export default class Game {
    constructor(size) {
        this.size = size;
        this.board =  this.initBoard(this.size);
        this.score = 0;
        this.won = false;
        this.over = false;

        this.moveArray = [];
        this.winArray = [];
        this.loseArray = [];
        this.addRanNumber();
        this.addRanNumber();
    }    
    // methods here
    initBoard(size) {
        let newBoard = new Array(this.size);

        for (let i = 0; i < size; i++) {
            newBoard[i] = new Array(this.size);
            for (let j = 0; j < this.size; j++) {
                newBoard[i][j] = 0;
            }
        }
        return newBoard;
    }
    // setupNewGame(): resets the game back to a random starting position
    setupNewGame() {
        this.board = this.initBoard(this.size);
        this.score = 0;
        this.won = false;
        this.over = false;
        this.moveArray = [];
        this.winArray = [];
        this.loseArray = [];
        this.addRanNumber();
        this.addRanNumber();
    }

    addRanNumber() {
        let twoOrFour1 = (Math.random() <= 0.1) ? 4 : 2;
        // getting all of the available spots to generate a new board
        let zeroLocations = [];
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board.length; j++){
                if (this.board[i][j] == 0) {
                    zeroLocations.push([i, j]);
                }
            }
        }
        // choose a random spot and give the board 2 or 4
        if (zeroLocations.length > 0 && zeroLocations[0] != null) {
            let ranSpot1 = Math.floor(Math.random() * zeroLocations.length);
            // accessing 'tuples' individually in order to access the board tiles
            let [x1, y1] = zeroLocations[ranSpot1];
            this.board[x1][y1] = twoOrFour1;
        }
    }

    flattenArray() {
        let flatArr = [];
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board.length; j++) {
                flatArr.push(this.board[i][j]);
            }
        }
        return flatArr;
    }

    arrayTo2D(arr, size) {
        let new2D = [];
        let i;
        let k;
        for (i = 0, k = -1; i < arr.length; i++) {
            if (i % this.size === 0) {
                k++;
                new2D[k] = [];
            }
            new2D[k].push(arr[i]);
        }
        return new2D;
    }

    isGameOver() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.board[i][j] == 0) {
                    return false;
                }
                if (i !== this.size - 1 && this.board[i][j] === this.board[i + 1][j]) {
                    return false;
                }
                if (j !== this.size - 1 && this.board[i][j] === this.board[i][j + 1]) {
                    return false;
                }
            }
        }
        return true;
    }

    // loadGame(gameState): given a gameState object, it loads that position, score, etc...
    loadGame(gameState) {
        // turn flat array into 2d
        let new2DBoard = this.arrayTo2D(gameState.board, Math.sqrt(gameState.board.length));
        this.board = new2DBoard;
        this.score = gameState.score;
        this.won = gameState.won;
        this.over = gameState.over;
    }

    // move(direction) : given up, down, left, or right as string input, it makes the appropriate shifts and adds a random tile.
    move(direction) {
        switch (direction) {
            case 'left': // left
                let boardBefore = this.copyBoard(this.board);
                this.moveLeft();
                for (let i = 0; i < this.board.length; i++) {
                    this.combine(this.board[i]);
                }
                this.moveLeft();
                // checks on every case if anything actually moved. If it did then it'd add a random number
                if (this.hasChanged(boardBefore) == true) {
                    this.addRanNumber();
                }
                // making calls to the callbacks stored in the moveArray
                if (this.moveArray.length > 0) {
                    for (let i = 0; i < this.moveArray.length; i++) {
                        let call = this.moveArray[i];
                        call(this.getGameState());
                    }
                }
                break;

            case 'right': // moving right
                let boardBefore1 = this.copyBoard(this.board);
                this.moveRight();
                for (let i = 0; i < this.board.length; i++) {
                    this.combineDown(this.board[i]);
                }
                this.moveRight();
                if (this.hasChanged(boardBefore1) == true) {
                    this.addRanNumber();
                }
                if (this.moveArray.length > 0) {
                    for (let i = 0; i < this.moveArray.length; i++) {
                        let call = this.moveArray[i];
                        call(this.getGameState());
                    }
                }
                break;
            case 'up': // moving up
                let boardBefore2 = this.copyBoard(this.board);
                this.board = this.rotateBoard();
                this.moveLeft();
                for (let i = 0; i < this.board.length; i++) {
                   this.combine(this.board[i]);
                }
                this.moveLeft();
                this.board = this.rotateBoard();
                this.board = this.rotateBoard();
                this.board = this.rotateBoard();
                if (this.hasChanged(boardBefore2) == true) {
                    this.addRanNumber();
                }
                if (this.moveArray.length > 0) {
                    for (let i = 0; i < this.moveArray.length; i++) {
                        let call = this.moveArray[i];
                        call(this.getGameState());
                    }
                }
                break;
            case 'down': // moving down
                let boardBefore3 = this.copyBoard(this.board);
                this.board = this.rotateBoard();
                this.moveRight();
                for (let i = 0; i < this.board.length; i++) {
                    this.combineDown(this.board[i]);
                }
                this.moveRight();
                this.board = this.rotateBoard();
                this.board = this.rotateBoard();
                this.board = this.rotateBoard();
                if (this.hasChanged(boardBefore3) == true) {
                    this.addRanNumber();
                }
                if (this.moveArray.length > 0) {
                    for (let i = 0; i < this.moveArray.length; i++) {
                        let call = this.moveArray[i];
                        call(this.getGameState());
                    }
                }
                break;
        }
        // Checking to see if game is over
        if (this.isGameOver() == true) {
            this.over = true;
            // making calls to the callbacks stored in the loseArray
            if (this.loseArray.length > 0) {
                for (let i = 0; i < this.loseArray.length; i++) {
                    let call = this.loseArray[i];
                    call(this.getGameState());
                }
            }
        }
    }

    moveLeft() {
        let tempArr = [];
        let counter = 0;
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board.length; j++) {
                if (this.board[i][j] > 0) {
                    // adding new values to new array, which will then result to having the values shifted left
                    tempArr.push(this.board[i][j]);
                    counter += 1;
                }
            }
            tempArr.length = this.size;
            tempArr.fill(0, counter);
            counter = 0;
            this.board[i] = [...tempArr];
            tempArr = [];
        }
        return this.board;
    }
    moveRight() {
        let tempArr = [];
        let tempListOfNumbers = []; // using a secondary array to fill array with zeros and then add the values
        let counter = 0;
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board.length; j++) {
                if (this.board[i][j] > 0) {
                    // adding new values to new array, which will then result to having the values shifted right
                    tempListOfNumbers.push(this.board[i][j]);
                    counter += 1;
                }
            }
            // allocating spaces in the array where zeros will be, and then the numbers will follow
            tempArr.length = this.board.length - counter;
            tempArr.fill(0);
            // adding numbers to array. The result is an array of values 'right aligned'
            for (let j = 0; j < tempListOfNumbers.length; j++) {
                tempArr.push(tempListOfNumbers[j]);
            }
            this.board[i] = [...tempArr];
            counter = 0;
            tempArr = [];
            tempListOfNumbers = [];
        }
        return this.board;
    }

    rotateBoard() {
        let tempBoard = this.initBoard(this.size);

        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board.length; j++) {
                tempBoard[i][j] = this.board[j][i];
            }
        }
        // console.table(tempBoard);
        return tempBoard;
    }


    combine(row) {
        for (let i = 0; i < row.length - 1; i++) {
            let a = row[i];
            let b = row[i + 1];
            if (a == b) {
                row[i] = a + b;
                this.score += row[i];
                row[i + 1] = 0;
                if (a + b == 2048){
                    this.won = true;
                    if (this.winArray.length > 0) {
                        for (let i = 0; i < this.winArray.length; i++) {
                            let call = this.winArray[i];
                            call(this.getGameState());
                        }
                    }
                }
            }
        }
        return row;
    }
    combineDown(row) {
        for (let i = this.board.length - 1; i >= 1; i--) {
            let a = row[i];
            let b = row[i - 1];
            if (a == b) {
                row[i] = a + b;
                this.score += row[i];
                row[i - 1] = 0;
                if (a + b == 2048){
                    this.won = true;
                    if (this.winArray.length > 0) {
                        for (let i = 0; i < this.winArray.length; i++) {
                            let call = this.winArray[i];
                            call(this.getGameState());
                        }
                    }
                }
            }
        }
        return row;
    }

    copyBoard(board) {
        let copyBoard = this.initBoard(this.size);
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board.length; j++) {
                copyBoard[i][j] = board[i][j];
            }
        }
        return copyBoard;
    }

    hasChanged(board) {
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board.length; j++) {
                if (board[i][j] != this.board[i][j])
                    return true;
            }
        }
        return false;
    }

    // toString(): returns a string that is a text/ascii version of the game. See the this section above for an example. This will not be graded, but it useful for your testing purposes when you run the game in the console. (run_in_console.js trying to print the .toString() function after every move).
    toString() {
        console.table(this.board);
    }
    // onMove(callback): Takes a callback, when a move is made, every observer should be called with the games current gameState
    onMove(callback) {
        this.moveArray.push(callback);
    }
    // onWin(callback): Takes a callback, when the game is won, every observer should be called with the games current gameState.
    onWin(callback) {
        this.winArray.push(callback);
    }
    // onLose(callback): Takes a callback, when the game is lost, every observer should be called with the games current gameState.
    onLose(callback) {
        this.loseArray.push(callback);
    }
    // getGameState(): returns a accurate gameState object.
    getGameState() {
        // NEEDS TO BE FLATEN
        let myGameState = {
            board: this.flattenArray(),
            score: this.score,
            won: this.won,
            over: this.over 
        };
        return myGameState;
    }
}
