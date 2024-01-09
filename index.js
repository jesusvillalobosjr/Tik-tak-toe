function player(name,marker,nameContainer,markerContainer,playerContainer){
    const horizontalWins = [[],[],[]];
    const verticalWins = [[],[],[]];
    const diagonalWins = [[],[],[]];
    const active = false;
    nameContainer.textContent = name;
    markerContainer.textContent = marker;

    const changeGreen = () => {
        playerContainer.style.color = "green";
    }

    const changeBlack = () => {
        playerContainer.style.color = "black";
    }

    const changeStatus = () => {
        if(active) active = false;
        else active = true;
    }

    const getStatus = () => active;

    const addPosition = (position) => {
        horizontalWins[position[0]].push(position);
        verticalWins[position[1]].push(position);
        if(position[0] === position[1]){
            diagonalWins[0].push(position);
        }
        if(position[0] + position[1] === 2){
            diagonalWins[1].push(position);
        }
    };

    const getPositions = () => {
        return {horizontalWins,verticalWins,diagonalWins};
    }

    return { name , marker,addPosition,getPositions, getStatus, changeStatus, changeGreen, changeGrey: changeBlack};
}

function game(player1,player2){
    const board = gameBoard();
    let turns = 0;
    let currentMove = (player1.getStatus() ? player1 : player2);
    let nextMove = (currentMove == player1 ? player2 : player1);
    currentMove.changeGreen();

    const makeMove = (e) => {
        if(!validQuadrant(e,currentMove.marker)) return;

        const position = board[e.target.id];
        currentMove.addPosition(position);
        turns++;

        if(draw()){
            displayResult();
            return;
        }else if(gameCheck.checkForWin(currentMove)){
            displayResult(currentMove);
            return;
        }
        swapPlayers();
    }

    const validQuadrant = (quadrant,marker) => {
        if(quadrant.target.textContent == ""){
            quadrant.target.textContent = marker;
            return true;
        }
        console.log(quadrant);
        return false;
    }

    const swapPlayers = () => {
        nextMove.changeGreen();
        currentMove.changeGrey();
        let temp = nextMove;
        nextMove = currentMove;
        currentMove = temp;
    }

    const draw = () => {
        if(turns >= 7) return true;

        return false;
    }

    const displayResult = (player) => {
        if(player == undefined){
            resultText.textContent = `Draw!`;
        }else{
            resultText.textContent = `${player.name} is the winner!`;
        }
        gameResult.style.display = "flex";
    }

    return {makeMove};
}

const gameCheck = (function(){
    const checkForWin = (player) => {
        const positions = player.getPositions();
        for(position in positions){
            const winPossibility = positions[position];
            for(possibility of winPossibility){
                if(possibility.length === 3) return true;
            }
        }
        return false;
    }

    return{checkForWin};
}());

function gameBoard(){
    const board = {};
    let count = 0;
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            const quad = document.createElement("div");
            const number = count++ + 1;
            quad.classList.add("quadrant",`quadrant-${number}`);
            quad.id = `quadrant-${number}`;
            gameContainer.appendChild(quad);
            board[quad.id] = [i,j];
        }
    }

    return board;
}

function startGame(e){
    e.preventDefault();
    const player1 = player(player1NameInput.value,'X',player1Name,player1Marker,player1Container);
    const player2 = player(player2NameInput.value,'O',player2Name,player2Marker,player2Container);
    gameStart = game(player1,player2);
    modalContainer.style.display = "none";
    mainContainer.style.display = "flex";

    const quadrants = document.querySelectorAll(".quadrant");
    quadrants.forEach(quadrant => quadrant.addEventListener("click",gameStart.makeMove));
}

function resetGame(){
    resetResult();
    resetPlayerForm();
    resetBoard();
}

function resetBoard(){
    gameContainer.innerHTML = "";
    mainContainer.style.display = "none";
}

function resetResult(){
    gameResult.style.display = "none";
}

function resetPlayerForm(){
    modalContainer.style.display = "flex";
    player1NameInput.value = "";
    player2NameInput.value = "";
}

const gameContainer = document.querySelector(".game-board");

const player1Container = document.querySelector(".player-1-container");
const player2Container = document.querySelector(".player-2-container");
const player1Name = document.querySelector(".player-1-name");
const player1Marker = document.querySelector(".player-1-marker");
const player2Name = document.querySelector(".player-2-name");
const player2Marker = document.querySelector(".player-2-marker");

const modalContainer = document.querySelector(".modal-container");
const mainContainer = document.querySelector(".game");

const player1NameInput = document.querySelector(".player-1-name-input");
const player2NameInput = document.querySelector(".player-2-name-input");
const playButton = document.querySelector(".play-button");
playButton.addEventListener("click",startGame);

let gameStart;

const gameResult = document.querySelector(".game-end");
const resultText = document.querySelector(".game-result");
const playAgain = document.querySelector(".play-again");
playAgain.addEventListener("click",resetGame);