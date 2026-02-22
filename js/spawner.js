// ═══════════════════════════════════════════════════════════════
// SKY NODE ESCAPE - Spawner Class
// ═══════════════════════════════════════════════════════════════

function Spawner(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;

    this.lastSpawnTime = 0;
    this.spawnInterval = 2000; // Initial interval in milliseconds
    this.minSpawnInterval = 800; // Minimum interval
    this.intervalDecreaseRate = 50; // How much interval decreases per difficulty

    this.obstacleWidth = 60;
    this.minGapSize = 100; // Minimum vertical gap for player to pass
    this.maxGapSize = 250; // Maximum vertical gap
}

Spawner.prototype.update = function(dt, gameSpeed, difficulty) {
    const currentTime = performance.now();

    // Adjust spawn interval based on difficulty and game speed
    const adjustedSpawnInterval = Math.max(
        this.minSpawnInterval,
        this.spawnInterval - (difficulty * this.intervalDecreaseRate)
    );

    if (currentTime - this.lastSpawnTime > adjustedSpawnInterval) {
        this.lastSpawnTime = currentTime;
        return this.generateObstacle(difficulty);
    }
    return null;
};

Spawner.prototype.generateObstacle = function(difficulty) {
    // Vary gap size based on difficulty
    const currentMaxGapSize = Math.max(this.minGapSize + 20, this.maxGapSize - (difficulty * 10));
    const currentMinGapSize = Math.min(this.maxGapSize - 20, this.minGapSize + (difficulty * 5));
    
    const gapSize = Math.random() * (currentMaxGapSize - currentMinGapSize) + currentMinGapSize;
    
    // Random Y position for the gap
    // Ensure gap is not too close to top or bottom edges
    const minGapY = this.gameHeight * 0.2;
    const maxGapY = this.gameHeight * 0.8;
    const gapY = Math.random() * (maxGapY - minGapY) + minGapY;

    // Obstacle appears from the right edge
    const x = this.gameWidth;

    return new Obstacle(x, gapY, gapSize, this.obstacleWidth, this.gameWidth);
};

Spawner.prototype.getObstacle = function() {
    // This method is called by Game to retrieve a new obstacle if one was spawned.
    // The actual spawning logic is within update, which returns the obstacle.
    // This is just a placeholder to clarify the interaction.
    return null; // The update method handles returning the new obstacle directly
};
