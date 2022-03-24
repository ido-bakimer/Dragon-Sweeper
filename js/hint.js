function hintModeOn() {
    if (!gGame.isOn) return;   //make sure game is on, hint mode isnt already used, you have hints left, and time has passed since game start.
    if (gGame.hintMode) return;
    if (!gGame.hintsLeft) return;
    if (gGame.secsPassed === 0) return;
    gGame.hintsLeft--
    gGame.hintMode = true
    // console.log(gGame.hintMode)
    var elHintBtnTextStr;
    for (var i = 0; i < gGame.hintsLeft; i++) {
        elHintBtnTextStr += HINT + ' ';}
    var elHintBtnSpan = document.querySelector('.hint span');
    elHintBtnSpan.innerText = elHintBtnTextStr;

}

function showHint(LOCATION) {
    var notAlreadyShown = []
    notAlreadyShown.push({ i: LOCATION.i, j: LOCATION.j })
    for (var I = LOCATION.i - 1; I <= LOCATION.i + 1; I++) {
        if (I < 0 || I >= gBoard.length) continue;
        for (var J = LOCATION.j - 1; J <= LOCATION.j + 1; J++) {
            if (J < 0 || J >= gBoard.length) continue;
            if (!gBoard[I][J].isShown){
            notAlreadyShown.push({ i: I, j: J })}
        }
    }
    // console.log(notAlreadyShown)

    for (var k = 0 ;k<notAlreadyShown.length; k++){
    curCell = notAlreadyShown[k];
    // console.log(curCell);
    var elCell = document.querySelector(`.${getClassName({ i: curCell.i, j: curCell.j })}`)
    elCell.id = 'shown'
    renderCell({ i: curCell.i, j: curCell.j }, (gBoard[curCell.i][curCell.j].minesAroundCount === 0) ? '' : gBoard[curCell.i][curCell.j].minesAroundCount)
    }
    setTimeout(function () {
        for (var k = 0 ;k<notAlreadyShown.length; k++) {
            var currCell = notAlreadyShown[k]
            // console.log(currCell)
            document.querySelector(`.${getClassName({ i: currCell.i, j: currCell.j })}`).removeAttribute('id')
            // var elCell = document.querySelector(`.${getClassName({ i: curCell.i, j: curCell.j })}`)
            // console.log(elCell)
            // elCell.removeAttribute('id')
            gBoard[currCell.i][currCell.j].isShown = false
            renderCell({ i: currCell.i, j: currCell.j },(gBoard[currCell.i][currCell.j].isMarked) ? FLAG : '')
        }
    }, 500)
    // setTimeout(function () {for (var k = 0 ;k<notAlreadyShown.length; k++){
    //     curCell = notAlreadyShown[k];
    //     console.log(curCell);
    //     var elCell = document.querySelector(`.${getClassName({ i: curCell.i, j: curCell.j })}`)
    //     elCell.id = 'shown'
    //     renderCell({ i: curCell.i, j: curCell.j }, (gBoard[curCell.i][curCell.j].minesAroundCount === 0) ? '' : gBoard[curCell.i][curCell.j].minesAroundCount)
    //     }}
    //     , 
    //     ) 
    
}