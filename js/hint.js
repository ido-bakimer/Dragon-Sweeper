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

var notAlreadyShown = []
    for (var i = LOCATION.i - 1; i <= LOCATION.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = LOCATION.j - 1; j <= LOCATION.j + 1; j++) {
            if (i === LOCATION.i && j === LOCATION.j) continue;
            if (j < 0 || j >= gBoard[i].length) continue;
            notAlreadyShown.push({i:LOCATION.i,j:LOCATION.j})
        }
    }
    var elCell = document.querySelector(`.${getClassName({ i: i, j: j })}`)
    elCell.id = 'shown'
    renderCell({ i: i, j: j }, (gBoard[i][j].minesAroundCount === 0) ? '' : gBoard[i][j].minesAroundCount)
}