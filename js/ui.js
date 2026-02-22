// ═══════════════════════════════════════════════════════════════
// SKY NODE ESCAPE - UIManager Class
// This class manages the UI elements (menu, gameover, HUD)
// However, for this project, the UI is primarily controlled directly
// from main.js and game.js due to the request to avoid ES6 modules
// and keep it simple. This file will remain largely empty or contain
// placeholder logic for potential future expansion if it were a larger project.
// ═══════════════════════════════════════════════════════════════

function UIManager() {
    // In this pure Vanilla JS setup, UI management is handled more directly
    // by main.js through DOM manipulation. This class is included to fulfill
    // the architectural requirement but its methods will be largely illustrative.
}

UIManager.prototype.updateScore = function(score) {
    // This would typically update the score display in the HUD.
    // In this project, main.js directly updates #hud-score.
    const hudScoreElement = document.getElementById('hud-score');
    if (hudScoreElement) {
        hudScoreElement.textContent = Math.floor(score);
    }
};

UIManager.prototype.showMenu = function(highscore, gamesPlayed) {
    // This would display the main menu screen.
    // Handled by main.js showScreen(menuScreen) and loadStats().
    const menuScreen = document.getElementById('menu-screen');
    const menuHighscore = document.getElementById('menu-highscore');
    const menuGames = document.getElementById('menu-games');

    if (menuScreen) {
        document.getElementById('gameover-screen').classList.remove('active');
        document.getElementById('hud').style.display = 'none';
        menuScreen.classList.add('active');
    }
    if (menuHighscore) menuHighscore.textContent = highscore;
    if (menuGames) menuGames.textContent = gamesPlayed;
};

UIManager.prototype.showGameOver = function(score, isNewRecord, highscore, gamesPlayed) {
    // This would display the game over screen with final score and stats.
    // Handled by main.js via custom event listener.
    const gameoverScreen = document.getElementById('gameover-screen');
    const finalScoreElement = document.getElementById('final-score');
    const newRecordElement = document.getElementById('new-record');

    if (gameoverScreen) {
        document.getElementById('menu-screen').classList.remove('active');
        document.getElementById('hud').style.display = 'none';
        gameoverScreen.classList.add('active');
    }
    if (finalScoreElement) finalScoreElement.textContent = score;
    if (newRecordElement) newRecordElement.style.display = isNewRecord ? 'block' : 'none';

    // Update menu stats if they were visible, though usually they are on menu screen
    const menuHighscore = document.getElementById('menu-highscore');
    const menuGames = document.getElementById('menu-games');
    if (menuHighscore) menuHighscore.textContent = highscore;
    if (menuGames) menuGames.textContent = gamesPlayed;
};

UIManager.prototype.showPause = function() {
    // This would display the pause screen.
    // Handled by main.js showScreen(pauseScreen).
    const pauseScreen = document.getElementById('pause-screen');
    if (pauseScreen) {
        document.getElementById('hud').style.display = 'none';
        pauseScreen.classList.add('active');
    }
};

UIManager.prototype.hideAll = function() {
    // This would hide all UI screens and only show the HUD for playing state.
    // Handled by main.js hideAllScreens() and hud.style.display.
    document.getElementById('menu-screen').classList.remove('active');
    document.getElementById('gameover-screen').classList.remove('active');
    document.getElementById('pause-screen').classList.remove('active');
    document.getElementById('hud').style.display = 'flex';
};
