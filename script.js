// import keypress from 'keypress';
import Game from "./engine/game.js";

// creating a new game object
let game = new Game(4);

function generateBoard() {
    let body = document.getElementById("board");
    let myboard = document.createElement('table');
    myboard.id = 'myTable';
    myboard.class = 'table';
    myboard.style.width = '55%';
    myboard.style.tableLayout = 'fixed';
    myboard.style.margin = 'auto';
    myboard.style.alignContent = 'center';
    myboard.style.height = '400px';
    myboard.style.border = '1px solid black';
    for (let i = 0; i < game.size; i++) {
        let row = myboard.insertRow();
        for (let j = 0; j < game.size; j++) {
            let box = row.insertCell();
            // td.appendChild(document.createTextNode('Cell'));
            if (game.board[i][j] != 0) {
                box.appendChild(document.createTextNode(game.board[i][j]));
                if(game.board[i][j] == 2)
                    // box.addClass('hero, is-warning');
                    box.style.background = '#FEDF40'; // yellow 
                if(game.board[i][j] == 4)
                    box.style.background = '#1FD661'; // green
                if(game.board[i][j] == 8)
                    box.style.background = '#F03C62'; // red
                if(game.board[i][j] == 16)
                    box.style.background = '#b19cd9 '; // purple pastel
                if(game.board[i][j] == 32)
                    box.style.background = '#00D1B2'; // turcouoise - NEED CHANGE
                if(game.board[i][j] == 64)
                    box.style.background = '#F7882F'; // Orange
                if(game.board[i][j] == 64)
                    box.style.background = '#F7882F'; // bluish - NEED TO CHANGE
                if(game.board[i][j] == 128)
                    box.style.background = '#09868b'; // green mountain - NEED TO CHANGE 
                if(game.board[i][j] == 256)
                    box.style.background = '#fea49f'; // Cool Pink  
                if(game.board[i][j] == 512)
                    box.style.background = '#DCC7AA'; // Coffe and Milk
                }
                else {
                    box.appendChild(document.createTextNode('.'));
                    
            }
            box.style.border = '2.5px solid white';
            box.style.textAlign = 'center';
            box.style.verticalAlign = 'center';
            box.style.padding = '15px';
            box.style.width = '100%';
            box.style.fontFamily = 'Iceland';
            box.style.fontSize = '50px';
            box.style.color = "#363636";
        }
    }
    body.appendChild(myboard);
}

document.onkeydown = function(e){
    // console.log(e.keyCode);
    switch(e.keyCode){
        case 37: // left
            game.move('left');
            updateBoard();
            break;
        case 39: // right
            game.move('right');
            updateBoard();
            break;
        case 38: // up
            game.move('up');
            updateBoard();
            break;
        case 40: // down
            game.move('down');
            updateBoard();
            break;
    }
    game.onWin(gameState => {
        let pos = document.getElementById("wonMessage");
        pos.innerText= 'You have WON!!!';
    });
    game.onLose(gameState => {
            let pos = document.getElementById("lostMessage");
            pos.innerText= 'You have LOST :(';
    });
}

function updateBoard(){
    $("#myTable").replaceWith(generateBoard());
    $('#scoreButton').text(game.score);
}
function newGame() {
    game.setupNewGame();
    updateBoard();
    document.getElementById("lostMessage").innerHTML = ' ';
    document.getElementById("wonMessage").innerText = ' ';
}

$(function () {
    $("#resetButton").on("click", newGame);
    generateBoard();
});