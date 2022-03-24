function safeClick() {
    if(gGame.secsPassed === 0) return;
    if (!gGame.isOn) return;
    if (!gGame.savesLeft) return;
    else{
    gGame.savesLeft--
    var savesStr = ''
    for (var i = 0; i < gGame.savesLeft; i++) {
    savesStr += SAFE + ' '}
    var elSavesSpan = document.querySelector('.safe span')
    elSavesSpan.innerText = savesStr;
    console.log(savesStr)
    console.log(elSavesSpan)

    var location = returnEmptyCell();
    console.log(location)
    console.log(gBoard[location.i][location.j])
    renderCell(location,SAFE)
    gBoard[location.i][location.j].isShown = true;
    console.log(gBoard[location.i][location.j])
    setTimeout(function () {
        renderCell(location,'')
        gBoard[location.i][location.j].isShown = false;
    }, 200)
    }
} 
