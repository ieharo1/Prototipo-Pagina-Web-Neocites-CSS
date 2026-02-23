class Player {
    constructor(game) {
        this.game = game;
        this.width = 30;
        this.height = 30;
        this.x = game.width / 2 - this.width / 2;
        this.y = game.height / 2;
        this.velocity = 0;
        this.gravity = 0.6;
        this.jumpStrength = -10;
        this.color = '#00ffff';
        this.trailTimer = 0;
    }

    update() {
        // Vertical Physics
        this.velocity += this.gravity;
        this.y += this.velocity;

        // Horizontal Movement (Follow Mouse/Touch suavemente)
        const targetX = this.game.mouseX - this.width / 2;
        this.x += (targetX - this.x) * 0.15; // Suavizado

        // Keyboard Override (si hay teclas pulsadas)
        if (this.game.keys['ArrowLeft'] || this.game.keys['KeyA']) {
            this.x -= 8;
        }
        if (this.game.keys['ArrowRight'] || this.game.keys['KeyD']) {
            this.x += 8;
        }

        // Screen bounds (Horizontal)
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > this.game.width) this.x = this.game.width - this.width;

        // Floor collision
        if (this.y + this.height > this.game.height) {
            this.y = this.game.height - this.height;
            this.velocity = 0;
            this.game.gameOver();
        }

        // Ceiling collision
        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }

        // Particle trail
        this.trailTimer++;
        if (this.trailTimer > 5) {
            this.game.particleSystem.createTrail(
                this.x + this.width / 2, 
                this.y + this.height / 2, 
                this.color
            );
            this.trailTimer = 0;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        
        // Draw diamond shape
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y); // Top
        ctx.lineTo(this.x + this.width, this.y + this.height / 2); // Right
        ctx.lineTo(this.x + this.width / 2, this.y + this.height); // Bottom
        ctx.lineTo(this.x, this.y + this.height / 2); // Left
        ctx.closePath();
        ctx.fill();

        // Inner core
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }

    jump() {
        this.velocity = this.jumpStrength;
        this.game.particleSystem.createExplosion(
            this.x + this.width / 2, 
            this.y + this.height, 
            '#ffffff', 
            5
        );
    }

    reset() {
        this.x = this.game.width / 2 - this.width / 2;
        this.y = this.game.height / 2;
        this.velocity = 0;
    }

    getBounds() {
        return {
            x: this.x + 5, // Hitbox slightly smaller than visual
            y: this.y + 5,
            width: this.width - 10,
            height: this.height - 10
        };
    }
}
