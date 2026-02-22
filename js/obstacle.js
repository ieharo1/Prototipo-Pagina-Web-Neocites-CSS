// ═══════════════════════════════════════════════════════════════
// SKY NODE ESCAPE - Obstacle Class
// ═══════════════════════════════════════════════════════════════

function Obstacle(x, gapY, gapSize, obstacleWidth, gameWidth) {
    this.x = x;
    this.gapY = gapY; // Y position of the center of the gap
    this.gapSize = gapSize; // Size of the gap
    this.width = obstacleWidth;
    this.gameWidth = gameWidth;

    this.color = '#ff00aa';

    // Calculate the two rectangular parts of the obstacle
    this.parts = [];

    // Top part
    this.parts.push({
        x: this.x,
        y: 0,
        width: this.width,
        height: this.gapY - (this.gapSize / 2)
    });

    // Bottom part
    this.parts.push({
        x: this.x,
        y: this.gapY + (this.gapSize / 2),
        width: this.width,
        height: this.gameWidth * 2 // Make it long enough to cover to bottom
    });
}

Obstacle.prototype.update = function(dt, gameSpeed) {
    this.x -= gameSpeed;
    // Update parts positions
    for (let i = 0; i < this.parts.length; i++) {
        this.parts[i].x = this.x;
    }
};

Obstacle.prototype.render = function(ctx) {
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ff00aa';

    for (let i = 0; i < this.parts.length; i++) {
        const part = this.parts[i];
        ctx.fillRect(part.x, part.y, part.width, part.height);

        // Add some inner detail/glow
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(part.x + 2, part.y + 2, part.width - 4, part.height - 4);
        ctx.fillStyle = this.color; // Reset fill style for next part
    }
    ctx.shadowBlur = 0;
};

Obstacle.prototype.isOffScreen = function() {
    return this.x + this.width < 0;
};
