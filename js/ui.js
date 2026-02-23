class UIManager {
    constructor(game) {
        this.game = game;
        this.screens = {
            menu: document.getElementById('menu-screen'),
            gameover: document.getElementById('gameover-screen'),
            pause: document.getElementById('pause-screen'),
            hud: document.getElementById('hud')
        };
        
        this.elements = {
            menuHighscore: document.getElementById('menu-highscore'),
            menuGames: document.getElementById('menu-games'),
            finalScore: document.getElementById('final-score'),
            hudScore: document.getElementById('hud-score'),
            newRecord: document.getElementById('new-record')
        };

        this.bindEvents();
    }

    bindEvents() {
        // Menu
        document.getElementById('btn-start').addEventListener('click', () => {
            this.game.start();
        });

        // Game Over
        document.getElementById('btn-restart').addEventListener('click', () => {
            this.game.restart();
        });
        document.getElementById('btn-menu').addEventListener('click', () => {
            this.showScreen('menu');
        });

        // Pause
        document.getElementById('btn-resume').addEventListener('click', () => {
            this.game.resume();
        });
        document.getElementById('btn-quit').addEventListener('click', () => {
            this.game.quit();
        });
    }

    showScreen(screenName) {
        // Hide all screens
        Object.values(this.screens).forEach(screen => {
            if (screen) {
                screen.classList.remove('active');
                if (screen.id === 'hud') screen.style.display = 'none';
            }
        });

        // Show requested screen
        if (this.screens[screenName]) {
            if (screenName === 'hud') {
                this.screens[screenName].style.display = 'flex';
            } else {
                this.screens[screenName].classList.add('active');
            }
        }
    }

    updateHUD(score) {
        this.elements.hudScore.innerText = Math.floor(score);
    }

    updateMenuStats(highscore, gamesPlayed) {
        this.elements.menuHighscore.innerText = Math.floor(highscore);
        this.elements.menuGames.innerText = gamesPlayed;
    }

    showGameOver(score, isNewRecord) {
        this.elements.finalScore.innerText = Math.floor(score);
        this.elements.newRecord.style.display = isNewRecord ? 'block' : 'none';
        this.showScreen('gameover');
    }
}
