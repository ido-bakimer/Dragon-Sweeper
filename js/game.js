'use strict'
//important:
//start game is set to a low num for testing, remember to change it for actual play!
//add multi select

 // all const will be changed to images
const DEFAULTEMOTE = '🤖'
const DEAD = '💀'
const WIN = '🤴'
const MINE = '🐉'
const FLAG = '⚔️'
const HINT = '☀️' 
const SAFE = '🧙'
const HEARTS = '❤️'
var gBoard;
var gLevel;
var gGame;
var gIntreval;
var gMinesLocations;
var gMusic = new Audio('sounds/vordtOfBoreal.mp3');

function initGame() {
    gLevel = startGame()
}

function startGame(size = 2, mines = 2) { //change after testing!
    gMusic.play();
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        isFirstClick: true,
        hearts: 3,
        savesLeft: 3,
        hintsLeft: 3,
        hintMode: false,
        sevenMode: false
    }
    gLevel = {
        size: size,
        mines: mines,
        minesAdded: mines
    }
    clearInterval(gIntreval);
    resetCSS()
    gMinesLocations = []
    gBoard = buildBoard(gLevel.size);
    renderBoard(gBoard, '.board-container')
    return gLevel
}



function cellClicked(location, elCell) {
    if (gGame.hintmode){
        showHint(location)
        gGame.hintMode = false
        return
    }
    if (!gGame.isOn) return; //when game is off, dont click
    if (gBoard[location.i][location.j].isMarked) return; //when cell is marked, dont click
    if (gBoard[location.i][location.j].isShown) return; //when cell is shown, dont click

    var currCell = gBoard[location.i][location.j]
    gGame.shownCount += (currCell.isShown) ? 0 : 1;
    currCell.isShown = true;
    // console.log(location);
    // fist click sets the mines. happens after the first cell is shown so it doesnt proc placeMines
    if (gGame.isFirstClick) {
        runTimer();
        placeMines(gLevel.mines)
        setMinesAroundCount(gBoard)
        renderBoard(gBoard, '.board-container')
        gGame.isFirstClick = false;
        elCell = document.querySelector(`.${getClassName(location)}`)
    }
    else if (currCell.isMine) {
        var elKnight = document.querySelector('.knight');
        elKnight.innerText = DEFAULTEMOTE;
        if (gGame.hearts === 0) {
            var elHearts = document.querySelector('.hearts')
            elHearts.innerText = 'DEAD'
            loseGame()
        }
        else {
            gGame.hearts--
            var elHeartsSpan = document.querySelector('.hearts span')
            var heartsStr = ''
            for (var i = 0; i < gGame.hearts; i++) {
                heartsStr += HEARTS + ' '
            }
            var audio = new Audio('sounds/hurt.mp3');
            audio.play();
            elHeartsSpan.innerText = heartsStr
            elKnight.innerText = DEAD
            setTimeout(function () {
                if (gGame.isOn) elKnight.innerText = DEFAULTEMOTE;
            }, 1300)
        }
    }

    if (gGame.markedCount + gGame.shownCount === gLevel.size ** 2) {
        winGame()
    }
    // showNegs(location)
    showNegsRecurs(location)
    elCell.id = 'shown'
    renderCell(location, (currCell.minesAroundCount === 0) ? '' : currCell.minesAroundCount);
    console.log(gGame.shownCount)
}

function cellMarked(event, location, elcell) {
    event.preventDefault()
    if (event.which == 3) {
        if (gBoard[location.i][location.j].isShown) return; //dont mark shown cells
        if (!gGame.isOn) return //dont mark when game isnt on
        if (!gBoard[location.i][location.j].isMarked) {   //if isnt marked, mark
            gBoard[location.i][location.j].isMarked = true;
            renderCell(location, FLAG)
            gGame.markedCount++
            elcell.id = 'flaged'
            if (gGame.markedCount + gGame.shownCount === gLevel.size ** 2) winGame() //if marks and shown equal to the cell count, win.
        }
        else { //remove mark when everything else doesnt proc return
            gBoard[location.i][location.j].isMarked = false;
            renderCell(location, '')
            gGame.markedCount--
            elcell.removeAttribute('id')
        }
    }
}


function reset() {
    startGame(gLevel.size, gLevel.mines)
}

function loseGame() {
    gGame.isOn = false;
    clearInterval(gIntreval);
    for (var i = 0; i < gMinesLocations.length; i++) {
        var currMineLocation = gMinesLocations[i];
        var elCell = document.querySelector(`.${getClassName(currMineLocation)}`)
        elCell.id = 'shown'
        gBoard[currMineLocation.i][currMineLocation.j].isShown = true;
        renderCell(currMineLocation, MINE)
    }
    gMusic.pause();
    gMusic.currentTime=0;
    var elLooser = document.querySelector('h3')
    elLooser.style.display = 'block'
    var elKnight = document.querySelector('.knight')
    elKnight.innerText = DEAD;
    var audio = new Audio('sounds/lose.mp3');
    audio.play();
}

function winGame() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var currCell = gBoard[i][j]
            if (!currCell.isMine && !currCell.isShown) return
            if (currCell.isMine) {
                if (!currCell.isShown && !currCell.isMarked) return;
            }
        }
    }
    gMusic.pause();
    gMusic.currentTime=0;
    clearInterval(gIntreval);
    gGame.isOn = false;
    var elWinner = document.querySelector('h2')
    elWinner.style.display = 'block'
    var elKnight = document.querySelector('.knight')
    elKnight.innerText = WIN;
    var audio = new Audio('sounds/victory.mp3');
    audio.play();
}

function runTimer() {
    var elTimer = document.querySelector('.timer');
    elTimer.style.display = 'block';
    gIntreval = setInterval(function () { 
        gGame.secsPassed += 0.0035  //for some reason, time isnt counted as it supposed to
        elTimer.innerText = gGame.secsPassed.toFixed(3);
    }, 1);
}


function resetCSS() { //when implementing new features, make sure they reset each time!
    var elLooser = document.querySelector('h3');
    elLooser.style.display = 'none';
    var elWinner = document.querySelector('h2');
    elWinner.style.display = 'none';
    var elTimer = document.querySelector('.timer');
    elTimer.style.display = 'none';
    var elLives = document.querySelector('.hearts');
    elLives.innerHTML = `<span>${HEARTS} ${HEARTS} ${HEARTS}</span>`;
    var elKnight = document.querySelector('.knight');
    elKnight.innerText = DEFAULTEMOTE; 
    var elSafeBtnSpan = document.querySelector('.safe span')
    elSafeBtnSpan.innerText = `${SAFE} ${SAFE} ${SAFE}`;

}