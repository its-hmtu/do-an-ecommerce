const canvas = document.getElementById('snowflakes');
const ctx = canvas.getContext('2d');


const snowflakes = []

class Snowflakes {
    constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.radius = Math.random() * 3 + 2;
        this.speedY = Math.random() * 1 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random();
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.y > canvas.height) {
            this.y -= this.radius;
            this.x = Math.random() * canvas.width;
        }

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
        ctx.closePath();
    }
}

function createSnowFlakes(count) {
    for (let i = 0; i < count; i++) {
        snowflakes.push(new Snowflakes());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const snowflake of snowflakes) {
        snowflake.update();
        snowflake.draw();
    }

    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

createSnowFlakes(100);
animate();