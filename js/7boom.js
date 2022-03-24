function sevenBoom(elBoomBtn) {
    if (gGame.secsPassed) return;
    if (gGame.isManual) return;
    if (gGame.isSeven) return;
    elBoomBtn.innerText = '7BOOM is on!'
    gGame.sevenMode = true
}