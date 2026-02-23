class Obstacle {
    constructor(game, y) {
        this.game = game;
        this.y = y;
        this.height = 30; // Height of the obstacle bar
        this.gapWidth = 100; // Width of the safe zone (reducido de 150 a 100)
        this.gapX = Math.random() * (game.width - this.gapWidth); // Random x position of gap
        this.speed = game.gameSpeed;
        this.color = '#ff00ff';
        this.markedForDeletion = false;
        this.passed = false; // To score points
    }

    update() {
        this.y += this.speed;
        this.speed = this.game.gameSpeed; // Sync speed

        if (this.y > this.game.height) {
            this.markedForDeletion = true;
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;

        // Draw left part
        ctx.fillRect(0, this.y, this.gapX, this.height);

        // Draw right part
        ctx.fillRect(this.gapX + this.gapWidth, this.y, this.game.width - (this.gapX + this.gapWidth), this.height);
        
        ctx.shadowBlur = 0;
    }

    checkCollision(player) {
        const playerBounds = player.getBounds();
        
        // Check vertical overlap
        if (playerBounds.y + playerBounds.height > this.y && 
            playerBounds.y < this.y + this.height) {
            
            // Check horizontal overlap (collision with left or right block)
            if (playerBounds.x < this.gapX || 
                playerBounds.x + playerBounds.width > this.gapX + this.gapWidth) {
                return true;
            }
        }
        return false;
    }
}
