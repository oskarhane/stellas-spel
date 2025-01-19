class JumperGame {
    constructor() {
        this.character = document.getElementById('character');
        this.obstaclesContainer = document.getElementById('obstacles');
        this.startBtn = document.getElementById('start-btn');
        this.currentScoreElement = document.getElementById('currentScore');
        this.highScoreElement = document.getElementById('highScore');
        
        this.isJumping = false;
        this.isGameOver = false;
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('jumperHighScore')) || 0;
        this.gameLoop = null;
        this.obstacleSpeed = 2; // Initial speed in seconds
        this.obstacles = ['🌵', '💩'];
        this.activeObstacles = [];
        this.obstacleInterval = null;
        
        this.init();
    }

    init() {
        this.highScoreElement.textContent = this.highScore;
        this.startBtn.addEventListener('click', () => this.startGame());
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault(); // Prevent page scrolling
                this.jump();
            }
        });
        document.addEventListener('touchstart', () => this.jump());
        document.addEventListener('click', () => this.jump());
    }

    createObstacle() {
        const obstacle = document.createElement('div');
        obstacle.className = 'obstacle';
        const randomObstacle = this.obstacles[Math.floor(Math.random() * this.obstacles.length)];
        obstacle.textContent = randomObstacle;
        obstacle.style.right = '-20px';
        this.obstaclesContainer.appendChild(obstacle);
        
        obstacle.classList.add('run-animation');
        
        // Track the obstacle
        this.activeObstacles.push(obstacle);
        
        // Remove obstacle when animation ends
        obstacle.addEventListener('animationend', () => {
            obstacle.remove();
            this.activeObstacles = this.activeObstacles.filter(o => o !== obstacle);
        });
    }

    startGame() {
        if (this.gameLoop) return;
        
        // Clear any existing obstacles
        this.obstaclesContainer.innerHTML = '';
        this.activeObstacles = [];
        
        this.isGameOver = false;
        this.score = 0;
        this.currentScoreElement.textContent = '0';
        this.character.classList.remove('game-over');
        this.startBtn.style.display = 'none';
        
        // Start creating obstacles
        this.createObstacle();
        this.obstacleInterval = setInterval(() => {
            if (!this.isGameOver && Math.random() < 0.5) {
                this.createObstacle();
            }
        }, 1500);
        
        // Start score counting and collision detection
        this.gameLoop = setInterval(() => {
            this.score++;
            this.currentScoreElement.textContent = this.score;
            
            // Check for collisions with all active obstacles
            if (this.checkCollisions()) {
                this.gameOver();
            }
            
            // Increase speed gradually
            if (this.score % 100 === 0) {
                this.increaseSpeed();
            }
        }, 100);
    }

    jump() {
        if (this.isJumping || this.isGameOver) return;
        
        this.isJumping = true;
        this.character.classList.add('jump');
        
        setTimeout(() => {
            this.character.classList.remove('jump');
            this.isJumping = false;
        }, 700);
    }

    checkCollisions() {
        const characterRect = this.character.getBoundingClientRect();
        
        return this.activeObstacles.some(obstacle => {
            const obstacleRect = obstacle.getBoundingClientRect();
            
            return !(
                characterRect.right < obstacleRect.left || 
                characterRect.left > obstacleRect.right || 
                characterRect.bottom < obstacleRect.top
            );
        });
    }

    increaseSpeed() {
        this.obstacleSpeed = Math.max(1, this.obstacleSpeed - 0.1);
        this.activeObstacles.forEach(obstacle => {
            obstacle.style.animationDuration = `${this.obstacleSpeed}s`;
        });
    }

    gameOver() {
        this.isGameOver = true;
        clearInterval(this.gameLoop);
        clearInterval(this.obstacleInterval);
        this.gameLoop = null;
        this.obstacleInterval = null;
        
        // Update high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.highScoreElement.textContent = this.highScore;
            localStorage.setItem('jumperHighScore', this.highScore);
        }
        
        // Visual feedback
        this.character.classList.add('game-over');
        this.activeObstacles.forEach(obstacle => {
            obstacle.style.animationPlayState = 'paused';
        });
        this.startBtn.style.display = 'inline-block';
        this.startBtn.textContent = 'Spela igen';
        
        // Reset speed
        this.obstacleSpeed = 2;
    }
}

// Initialize the game
const game = new JumperGame();
