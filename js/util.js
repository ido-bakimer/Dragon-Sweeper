'use strict'
function buildBoard(SIZE) {
    var board = [];
    for (var i = 0; i < SIZE; i++) {
        board.push([]);
        for (var j = 0; j < SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    return board;
}

function renderBoard(mat, selector) {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var cell = (mat[i][j].isShown) ? mat[i][j].minesAroundCount : ' ';
            var className = `cell cell${i}-${j}`;
            strHTML += `<td class="${className}" onclick="cellClicked({i:${i}, j:${j}}, this)" oncontextmenu="cellMarked(event,{i:${i}, j:${j}}, this)">${cell}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}

function returnEmptyCell() {
    var emptyCells = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (!gBoard[i][j].isMine && !gBoard[i][j].isShown) emptyCells.push({ i: i, j: j })
        }
    }
    var emptyCell = emptyCells[getRandomInt(0, emptyCells.length - 1)];
    return emptyCell;
}

function countNegMines(I, J) {
    var negMineCount = 0;
    for (var i = I - 1; i <= I + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = J - 1; j <= J + 1; j++) {
            if (i === I && j === J) continue;
            if (j < 0 || j >= gBoard[i].length) continue;
            if (gBoard[i][j].isMine) negMineCount++;
        }
    }
    return negMineCount;
}

function renderCell(location, value) {
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.innerHTML = value;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getClassName(location) {
    var cellClass = 'cell' + location.i + '-' + location.j;
    return cellClass;
}

function showNegs(location) {
    var middleI = location.i ;
    var middleJ = location.j ;
    for (var i = middleI - 1; i <= middleI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = middleJ - 1; j <= middleJ + 1; j++) {
            if (i === middleI && j === middleJ) continue;
            if (j < 0 || j >= gBoard[i].length) continue;
            if (gBoard[i][j].isMine) neighborsCount++;
        }
    }
    return neighborsCount;
}

function openNegs(location) {
    var elCell = document.querySelector(`.${getClassName(location)}`)
    elCell.id = 'shown'
    if (countNegMines(location)!==0) return;
    if (location.isMine) return;
    for (var i = location.i - 1; i <= location.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = location.j - 1; j <= location.j + 1; j++) {
            if (i === location.i && j === location.j) continue;
            if (j < 0 || j >= gBoard[i].length) continue;
            if (!gBoard[i][j].isShown) {
                gBoard[i][j].isShown = true;
                if (gBoard[i][j].isMarked) {
                    gBoard[i][j].isMarked = false;
                    gGame.markedCount--
                }
                gGame.shownCount++
                var elCell = document.querySelector(`.${getClassName({ i: i, j: j })}`)
                elCell.id = 'shown'
                renderCell({ i: i, j: j }, (gBoard[i][j].minesAroundCount === 0) ? '' : gBoard[i][j].minesAroundCount)
                winGame()
                if (gBoard[i][j].minesAroundCount === 0) {
                    openNegs({ i: i, j: j })
                }
            }
            else continue;
        }
    }

}



function hintModeOn() {
    // console.log('expected hints left 3 truestate:',gGame.hintsLeft)
    // console.log('expected hintsmode is false. truestate:',gGame.hintMode)

    if (!gGame.isOn) return;   //make sure game is on, hint mode isnt already used, you have hints left, and time has passed since game start.
    if (gGame.hintMode) return;
    if (!gGame.hintsLeft) return;
    if (gGame.secsPassed === 0) return;


    gGame.hintsLeft--
    gGame.hintMode = true

    var elHintBtnTextStr;

    for (var i = 0; i < gGame.hints; i++) {
        elHintBtnTextStr += HINT + ' ';
    }
    var elHintBtnSpan = document.querySelector('.hint span');
    elHintBtnSpan.innerText = elHintBtnTextStr

    // console.log('expected hints left 2 truestate:',gGame.hintsLeft)
    // console.log('expected hintsmode is true. truestate:',gGame.hintMode)

}

function showHint(LOCATION) {
    var centerI = LOCATION.i
    var centerJ = LOCATION.j

    for (var i = centerI - 1; i <= centerI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = centerJ - 1; j <= centerJ + 1; j++) {
            if (i === centerI && j === centerJ) continue;
            if (j < 0 || j >= gBoard[i].length) continue;
            var currCell = gBoard[LOCATION.i][LOCATION.j]
            var elCell = document.querySelector(`.${getClassName({ i: i, j: j })}`)
            elCell.id = 'shown'
            renderCell({ i: i, j: j }, (gBoard[i][j].minesAroundCount === 0) ? '' : gBoard[i][j].minesAroundCount)
        }
    }
}