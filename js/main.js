// ═══════════════════════════════════════════════════════════════
// SKY NODE ESCAPE - Main Entry Point
// ═══════════════════════════════════════════════════════════════

(function() {
    'use strict';

    // Game instance
    let game = null;

    // DOM Elements
    const canvas = document.getElementById('game-canvas');
    const menuScreen = document.getElementById('menu-screen');
    const gameoverScreen = document.getElementById('gameover-screen');
    const pauseScreen = document.getElementById('pause-screen');
    const hud = document.getElementById('hud');
    const menuHighscore = document.getElementById('menu-highscore');
    const menuGames = document.getElementById('menu-games');
    const hudScore = document.getElementById('hud-score');
    const finalScore = document.getElementById('final-score');
    const newRecord = document.getElementById('new-record');

    // Buttons
    const btnStart = document.getElementById('btn-start');
    const btnRestart = document.getElementById('btn-restart');
    const btnMenu = document.getElementById('btn-menu');
    const btnResume = document.getElementById('btn-resume');
    const btnQuit = document.getElementById('btn-quit');

    // Initialize game on load
    function init() {
        // Initialize game
        game = new Game(canvas);

        // Load stats from localStorage
        loadStats();

        // Setup event listeners
        setupEventListeners();

        // Resize canvas
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Start game loop (will show menu first)
        game.start();
    }

    function loadStats() {
        const highscore = parseInt(localStorage.getItem('skyNodeHighscore')) || 0;
        const games = parseInt(localStorage.getItem('skyNodeGames')) || 0;
        menuHighscore.textContent = highscore;
        menuGames.textContent = games;
    }

    function setupEventListeners() {
        // Button events
        btnStart.addEventListener('click', function() {
            game.setState('playing');
            hideAllScreens();
            hud.style.display = 'flex';
        });

        btnRestart.addEventListener('click', function() {
            game.reset();
            game.setState('playing');
            hideAllScreens();
            hud.style.display = 'flex';
        });

        btnMenu.addEventListener('click', function() {
            game.setState('menu');
            hideAllScreens();
            menuScreen.classList.add('active');
            hud.style.display = 'none';
            loadStats();
        });

        btnResume.addEventListener('click', function() {
            game.setState('playing');
            hideAllScreens();
            hud.style.display = 'flex';
        });

        btnQuit.addEventListener('click', function() {
            game.setState('menu');
            hideAllScreens();
            menuScreen.classList.add('active');
            hud.style.display = 'none';
            loadStats();
        });

        // Keyboard events
        document.addEventListener('keydown', function(e) {
            if (e.code === 'Space') {
                e.preventDefault();
                if (game.state === 'menu') {
                    game.setState('playing');
                    hideAllScreens();
                    hud.style.display = 'flex';
                } else if (game.state === 'playing') {
                    game.player.flap();
                }
            }
            if (e.code === 'KeyP') {
                if (game.state === 'playing') {
                    game.setState('paused');
                    showScreen(pauseScreen);
                } else if (game.state === 'paused') {
                    game.setState('playing');
                    hideAllScreens();
                    hud.style.display = 'flex';
                }
            }
        });

        // Mouse/Touch events
        canvas.addEventListener('mousedown', function(e) {
            e.preventDefault();
            if (game.state === 'playing') {
                game.player.flap();
            }
        });

        canvas.addEventListener('touchstart', function(e) {
            e.preventDefault();
            if (game.state === 'playing') {
                game.player.flap();
            }
        }, { passive: false });
    }

    function hideAllScreens() {
        menuScreen.classList.remove('active');
        gameoverScreen.classList.remove('active');
        pauseScreen.classList.remove('active');
    }

    function showScreen(screen) {
        hideAllScreens();
        screen.classList.add('active');
    }

    function resizeCanvas() {
        const container = document.getElementById('game-container');
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        
        if (game) {
            game.resize(canvas.width, canvas.height);
        }
    }

    // Game state change handler
    window.addEventListener('message', function(e) {
        if (e.data.type === 'gameover') {
            showScreen(gameoverScreen);
            hud.style.display = 'none';
            finalScore.textContent = e.data.score;
            newRecord.style.display = e.data.isNewRecord ? 'block' : 'none';
            loadStats();
        }
    });

    // Polyfill for custom events in older browsers
    if (!window.CustomEvent) {
        window.CustomEvent = function(event, params) {
            params = params || { bubbles: false, cancelable: false, detail: null };
            var evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return evt;
        };
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
