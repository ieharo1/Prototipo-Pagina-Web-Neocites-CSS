class Spawner {
    constructor(game) {
        this.game = game;
        this.obstacles = [];
        this.spawnTimer = 0;
        this.spawnInterval = 100; // frames (approx 1.6s at 60fps)
        this.lastTime = 0;
        this.difficultyLevel = 1;
    }

    update() {
        // Spawn obstacles
        if (this.spawnTimer > this.spawnInterval) {
            this.obstacles.push(new Obstacle(this.game, -50)); // Start above screen
            this.spawnTimer = 0;
            this.spawnInterval = Math.max(40, 100 - (this.difficultyLevel * 5)); // Decrease spawn interval
        } else {
            this.spawnTimer++;
        }

        // Update obstacles
        this.obstacles.forEach((obstacle, index) => {
            obstacle.update();
            if (obstacle.markedForDeletion) {
                this.obstacles.splice(index, 1);
            }

            // Check collision
            if (obstacle.checkCollision(this.game.player)) {
                this.game.gameOver();
            }
        });
    }

    draw(ctx) {
        this.obstacles.forEach(obstacle => obstacle.draw(ctx));
    }

    reset() {
        this.obstacles = [];
        this.spawnTimer = 0;
        this.spawnInterval = 100;
        this.difficultyLevel = 1;
    }

    increaseDifficulty() {
        this.difficultyLevel++;
    }
}
