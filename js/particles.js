class Particle {
    constructor(x, y, color, size, speedX, speedY, life) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size;
        this.speedX = speedX;
        this.speedY = speedY;
        this.life = life;
        this.maxLife = life;
        this.alpha = 1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life--;
        this.alpha = this.life / this.maxLife;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    createExplosion(x, y, color, count = 20) {
        for (let i = 0; i < count; i++) {
            const size = Math.random() * 3 + 1;
            const speedX = (Math.random() - 0.5) * 6;
            const speedY = (Math.random() - 0.5) * 6;
            const life = Math.random() * 30 + 20;
            this.particles.push(new Particle(x, y, color, size, speedX, speedY, life));
        }
    }

    createTrail(x, y, color) {
        const size = Math.random() * 2 + 0.5;
        const speedX = (Math.random() - 0.5) * 1;
        const speedY = (Math.random() * 2) + 1; // Fall down slightly
        const life = Math.random() * 10 + 10;
        this.particles.push(new Particle(x, y, color, size, speedX, speedY, life));
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            if (this.particles[i].life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw(ctx) {
        this.particles.forEach(p => p.draw(ctx));
    }

    reset() {
        this.particles = [];
    }
}
