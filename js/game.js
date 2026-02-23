class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.state = 'menu'; // menu, playing, paused, gameover
        this.lastTime = 0;
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('highScore')) || 0;
        this.gamesPlayed = parseInt(localStorage.getItem('gamesPlayed')) || 0;
        this.gameSpeed = 2;
        this.baseSpeed = 2;
        this.speedIncreaseTimer = 0;
        
        // Components
        this.particleSystem = new ParticleSystem();
        this.ui = new UIManager(this);
        this.player = new Player(this);
        this.spawner = new Spawner(this);
        
        // Bind loop
        this.loop = this.loop.bind(this);
        
        // Input
        this.handleInput = this.handleInput.bind(this);
        window.addEventListener('keydown', (e) => this.handleInput(e));
        window.addEventListener('touchstart', (e) => this.handleInput(e), {passive: false});
        window.addEventListener('mousedown', (e) => this.handleInput(e));
        
        // Resize
        window.addEventListener('resize', () => this.resize());
        this.resize();

        // Initial UI Update
        this.ui.updateMenuStats(this.highScore, this.gamesPlayed);
    }

    resize() {
        const container = document.getElementById('game-container');
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        // Update player position relative if needed, but for now just reset if in menu
        if (this.state === 'menu') {
             this.player.reset();
        }
    }

    start() {
        this.state = 'playing';
        this.score = 0;
        this.gameSpeed = this.baseSpeed;
        this.speedIncreaseTimer = 0;
        this.player.reset();
        this.spawner.reset();
        this.particleSystem.reset();
        this.ui.showScreen('hud');
        this.lastTime = performance.now();
        requestAnimationFrame(this.loop);
    }

    restart() {
        this.start();
    }

    pause() {
        if (this.state === 'playing') {
            this.state = 'paused';
            this.ui.showScreen('pause');
        } else if (this.state === 'paused') {
            this.resume();
        }
    }

    resume() {
        if (this.state === 'paused') {
            this.state = 'playing';
            this.ui.showScreen('hud');
            this.lastTime = performance.now();
            requestAnimationFrame(this.loop);
        }
    }

    quit() {
        this.state = 'menu';
        this.ui.showScreen('menu');
        this.ui.updateMenuStats(this.highScore, this.gamesPlayed);
    }

    gameOver() {
        this.state = 'gameover';
        this.gamesPlayed++;
        let isNewRecord = false;
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            isNewRecord = true;
            localStorage.setItem('highScore', this.highScore);
        }
        localStorage.setItem('gamesPlayed', this.gamesPlayed);
        
        // Shake effect
        this.canvas.style.transform = 'translate(5px, 5px)';
        setTimeout(() => this.canvas.style.transform = 'translate(-5px, -5px)', 50);
        setTimeout(() => this.canvas.style.transform = 'translate(5px, -5px)', 100);
        setTimeout(() => this.canvas.style.transform = 'none', 150);

        this.particleSystem.createExplosion(this.player.x, this.player.y, '#ff0000', 50);
        
        this.ui.showGameOver(this.score, isNewRecord);
    }

    handleInput(e) {
        if (this.state === 'playing') {
            if (e.type === 'touchstart' || e.type === 'mousedown' || e.code === 'Space') {
                if (e.type === 'touchstart') e.preventDefault(); // Prevent scroll
                this.player.jump();
            }
            if (e.code === 'KeyP') {
                this.pause();
            }
        } else if (this.state === 'menu' && e.code === 'Space') {
             this.start();
        } else if (this.state === 'gameover' && e.code === 'Space') {
             this.restart();
        }
    }

    update(deltaTime) {
        this.player.update();
        this.spawner.update();
        this.particleSystem.update();
        
        // Score based on survival time (or distance traveled)
        // Here we increase score by deltaTime * factor
        this.score += (deltaTime / 1000) * 10; // 10 points per second
        this.ui.updateHUD(this.score);

        // Increase difficulty
        this.speedIncreaseTimer += deltaTime;
        if (this.speedIncreaseTimer > 5000) { // Every 5 seconds
            this.gameSpeed += 0.2;
            this.spawner.increaseDifficulty();
            this.speedIncreaseTimer = 0;
        }
    }

    draw() {
        // Clear
        this.ctx.fillStyle = '#050505';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Background grid effect (simple)
        this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        const gridSize = 50;
        const offset = (Date.now() / 50) % gridSize;
        
        // Vertical lines
        for (let x = 0; x < this.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
        }
        
        // Horizontal lines (moving down)
        for (let y = offset - gridSize; y < this.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }

        this.player.draw(this.ctx);
        this.spawner.draw(this.ctx);
        this.particleSystem.draw(this.ctx);
    }

    loop(timestamp) {
        if (this.state !== 'playing') return;

        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(deltaTime);
        this.draw();

        requestAnimationFrame(this.loop);
    }
}
