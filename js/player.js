// ═══════════════════════════════════════════════════════════════
// SKY NODE ESCAPE - Player Class
// ═══════════════════════════════════════════════════════════════

function Player(x, y, gameWidth, gameHeight) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    this.radius = 20;
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;

    this.velocityY = 0;
    this.gravity = 0.4;
    this.jumpStrength = -7;
    this.maxVelocity = 10;
    this.minY = this.height / 2;
    this.maxY = this.gameHeight - this.height / 2;

    this.color = '#00f0ff';
    this.trailColor = '#00f0ff';
}

Player.prototype.update = function(dt) {
    // Apply gravity
    this.velocityY += this.gravity;

    // Cap velocity
    if (this.velocityY > this.maxVelocity) this.velocityY = this.maxVelocity;
    if (this.velocityY < -this.maxVelocity) this.velocityY = -this.maxVelocity;

    // Update position
    this.y += this.velocityY;

    // Keep player within vertical bounds
    if (this.y < this.minY) {
        this.y = this.minY;
        this.velocityY = 0;
    } else if (this.y > this.maxY) {
        this.y = this.maxY;
        this.velocityY = 0;
    }
};

Player.prototype.render = function(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    
    // Draw main core
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw inner glow/detail
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.arc(0, 0, this.radius * 0.6, 0, Math.PI * 2);
    ctx.fill();

    // Draw outer glow
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00f0ff';
    ctx.beginPath();
    ctx.arc(0, 0, this.radius + 5, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
};

Player.prototype.flap = function() {
    this.velocityY = this.jumpStrength;
};

Player.prototype.checkCollision = function(obstacle) {
    // Bounding box collision for simplicity with the core/obstacle structure
    // Player is a circle, obstacle is a rectangle. Simplistic for now.
    // We'll treat the player as a square for collision with the rect obstacles.
    
    const playerLeft = this.x - this.radius;
    const playerRight = this.x + this.radius;
    const playerTop = this.y - this.radius;
    const playerBottom = this.y + this.radius;

    for (let i = 0; i < obstacle.parts.length; i++) {
        const part = obstacle.parts[i];

        // Collision check with each part of the obstacle
        const obsLeft = part.x;
        const obsRight = part.x + part.width;
        const obsTop = part.y;
        const obsBottom = part.y + part.height;

        if (playerRight > obsLeft && 
            playerLeft < obsRight && 
            playerBottom > obsTop && 
            playerTop < obsBottom) {
            return true; // Collision detected
        }
    }
    return false;
};
