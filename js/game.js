// ═══════════════════════════════════════════════════════════════
// SKY NODE ESCAPE - Game Class
// ═══════════════════════════════════════════════════════════════

function Game(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;

    // Game states
    this.STATES = {
        MENU: 'menu',
        PLAYING: 'playing',
        GAMEOVER: 'gameover',
        PAUSED: 'paused'
    };

    this.state = this.STATES.MENU;

    // Game objects
    this.player = null;
    this.obstacles = [];
    this.spawner = null;
    this.particles = null;
    this.ui = null;

    // Game variables
    this.score = 0;
    this.highscore = parseInt(localStorage.getItem('skyNodeHighscore')) || 0;
    this.gamesPlayed = parseInt(localStorage.getItem('skyNodeGames')) || 0;
    this.difficulty = 1;
    this.gameSpeed = 3;
    this.baseSpeed = 3;
    this.maxSpeed = 8;
    this.speedIncrement = 0.001;
    this.scoreIncrement = 0.1;
    this.shakeAmount = 0;
    this.lastTime = 0;
    this.isRunning = false;

    // Background stars
    this.stars = [];
    this.initStars();
}

Game.prototype.initStars = function() {
    this.stars = [];
    const numStars = 100;
    for (let i = 0; i < numStars; i++) {
        this.stars.push({
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            size: Math.random() * 2 + 0.5,
            speed: Math.random() * 0.5 + 0.2,
            brightness: Math.random() * 0.5 + 0.5
        });
    }
};

Game.prototype.resize = function(width, height) {
    this.width = width;
    this.height = height;
    this.initStars();
    if (this.player) {
        this.player.y = this.height * 0.4;
    }
};

Game.prototype.start = function() {
    this.isRunning = true;
    this.lastTime = performance.now();
    this.gameLoop();
};

Game.prototype.stop = function() {
    this.isRunning = false;
};

Game.prototype.reset = function() {
    this.score = 0;
    this.difficulty = 1;
    this.gameSpeed = this.baseSpeed;
    this.shakeAmount = 0;
    this.obstacles = [];
    
    // Create player
    this.player = new Player(this.width * 0.3, this.height * 0.4, this.width, this.height);
    
    // Create spawner
    this.spawner = new Spawner(this.width, this.height, this.gameSpeed);
    
    // Create particle system
    this.particles = new ParticleSystem(this.width, this.height);
    
    // Update HUD
    document.getElementById('hud-score').textContent = '0';
};

Game.prototype.setState = function(newState) {
    this.state = newState;
    
    if (newState === this.STATES.PLAYING && !this.player) {
        this.reset();
    }
    
    if (newState === this.STATES.MENU) {
        this.player = null;
        this.obstacles = [];
    }
};

Game.prototype.gameLoop = function(timestamp) {
    if (!this.isRunning) return;

    const deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;

    // Cap delta time to prevent huge jumps
    const dt = Math.min(deltaTime, 32);

    // Update
    this.update(dt);

    // Render
    this.render();

    // Continue loop
    requestAnimationFrame(this.gameLoop.bind(this));
};

Game.prototype.update = function(dt) {
    // Update shake effect
    if (this.shakeAmount > 0) {
        this.shakeAmount *= 0.9;
        if (this.shakeAmount < 0.1) this.shakeAmount = 0;
    }

    // Update background stars
    this.updateStars();

    // State-specific updates
    switch (this.state) {
        case this.STATES.MENU:
            this.updateMenu();
            break;
        case this.STATES.PLAYING:
            this.updatePlaying(dt);
            break;
        case this.STATES.GAMEOVER:
            this.updateGameover();
            break;
    }
};

Game.prototype.updateMenu = function() {
    // Animate stars in menu
    for (let i = 0; i < this.stars.length; i++) {
        this.stars[i].y += this.stars[i].speed;
        if (this.stars[i].y > this.height) {
            this.stars[i].y = 0;
            this.stars[i].x = Math.random() * this.width;
        }
    }
};

Game.prototype.updatePlaying = function(dt) {
    // Update game speed (progressive difficulty)
    if (this.gameSpeed < this.maxSpeed) {
        this.gameSpeed += this.speedIncrement;
    }

    // Update difficulty
    this.difficulty = 1 + (this.gameSpeed - this.baseSpeed) * 0.5;

    // Update score
    this.score += this.scoreIncrement;
    document.getElementById('hud-score').textContent = Math.floor(this.score);

    // Update player
    if (this.player) {
        this.player.update(dt, this.gameSpeed);
        
        // Add trail particles
        if (Math.random() < 0.3) {
            this.particles.emitTrail(
                this.player.x - this.player.radius,
                this.player.y,
                '#00f0ff'
            );
        }
    }

    // Update spawner
    if (this.spawner) {
        this.spawner.update(dt, this.gameSpeed, this.difficulty);
        
        // Spawn new obstacles
        const newObstacle = this.spawner.getObstacle();
        if (newObstacle) {
            this.obstacles.push(newObstacle);
        }
    }

    // Update obstacles
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
        const obs = this.obstacles[i];
        obs.update(dt, this.gameSpeed);
        
        // Remove off-screen obstacles
        if (obs.isOffScreen()) {
            this.obstacles.splice(i, 1);
            continue;
        }

        // Check collision with player
        if (this.player && this.player.checkCollision(obs)) {
            this.gameOver();
            return;
        }
    }

    // Update particles
    this.particles.update(dt);
};

Game.prototype.updateGameover = function() {
    // Continue animating background
    this.updateStars();
};

Game.prototype.updateStars = function() {
    const speedMultiplier = this.state === this.STATES.PLAYING ? this.gameSpeed : 1;
    
    for (let i = 0; i < this.stars.length; i++) {
        this.stars[i].y += this.stars[i].speed * speedMultiplier;
        if (this.stars[i].y > this.height) {
            this.stars[i].y = 0;
            this.stars[i].x = Math.random() * this.width;
        }
    }
};

Game.prototype.render = function() {
    const ctx = this.ctx;
    
    // Apply shake effect
    ctx.save();
    if (this.shakeAmount > 0) {
        const shakeX = (Math.random() - 0.5) * this.shakeAmount * 10;
        const shakeY = (Math.random() - 0.5) * this.shakeAmount * 10;
        ctx.translate(shakeX, shakeY);
    }

    // Clear canvas
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, this.width, this.height);

    // Render stars
    this.renderStars();

    // Render game objects based on state
    switch (this.state) {
        case this.STATES.MENU:
            this.renderMenu();
            break;
        case this.STATES.PLAYING:
        case this.STATES.PAUSED:
            this.renderPlaying();
            break;
        case this.STATES.GAMEOVER:
            this.renderGameover();
            break;
    }

    ctx.restore();
};

Game.prototype.renderStars = function() {
    const ctx = this.ctx;
    
    for (let i = 0; i < this.stars.length; i++) {
        const star = this.stars[i];
        const alpha = star.brightness * (0.5 + 0.5 * Math.sin(performance.now() * 0.002 + i));
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    }
};

Game.prototype.renderMenu = function() {
    // Render some floating obstacles for decoration
    if (this.spawner) {
        const demoObs = new Obstacle(this.width + 50, this.height * 0.3, 80, this.height * 0.35, this.width);
        const demoObs2 = new Obstacle(this.width + 200, this.height * 0.7, 80, this.height * 0.25, this.width);
        demoObs.update(16, 2);
        demoObs2.update(16, 2);
        demoObs.render(this.ctx);
        demoObs2.render(this.ctx);
    }
};

Game.prototype.renderPlaying = function() {
    const ctx = this.ctx;

    // Render obstacles
    for (let i = 0; i < this.obstacles.length; i++) {
        this.obstacles[i].render(ctx);
    }

    // Render player
    if (this.player) {
        this.player.render(ctx);
    }

    // Render particles
    this.particles.render(ctx);
};

Game.prototype.renderGameover = function() {
    const ctx = this.ctx;

    // Render obstacles (frozen)
    for (let i = 0; i < this.obstacles.length; i++) {
        this.obstacles[i].render(ctx);
    }

    // Render player (exploded)
    if (this.player) {
        // Render explosion particles
        this.particles.render(ctx);
    }
};

Game.prototype.gameOver = function() {
    this.state = this.STATES.GAMEOVER;
    this.shakeAmount = 1;
    
    // Create explosion effect
    if (this.player) {
        this.particles.emitExplosion(
            this.player.x,
            this.player.y,
            '#00f0ff',
            30
        );
        this.particles.emitExplosion(
            this.player.x,
            this.player.y,
            '#ff00aa',
            20
        );
    }

    // Update stats
    this.gamesPlayed++;
    localStorage.setItem('skyNodeGames', this.gamesPlayed);

    const finalScore = Math.floor(this.score);
    let isNewRecord = false;

    if (finalScore > this.highscore) {
        this.highscore = finalScore;
        localStorage.setItem('skyNodeHighscore', this.highscore);
        isNewRecord = true;
    }

    // Notify UI
    const event = new CustomEvent('gameover', {
        detail: {
            score: finalScore,
            isNewRecord: isNewRecord
        }
    });
    window.dispatchEvent(event);

    // Update game over screen after short delay
    setTimeout(function() {
        document.getElementById('gameover-screen').classList.add('active');
        document.getElementById('hud').style.display = 'none';
        document.getElementById('final-score').textContent = finalScore;
        document.getElementById('new-record').style.display = isNewRecord ? 'block' : 'none';
    }, 500);
};
