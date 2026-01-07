// Game State
let gameState = {
    screen: 'start',
    gameRunning: false,
    player: null,
    enemies: [],
    beams: [],
    particles: [],
    gameTime: 0,
    isMobile: false
};

// Class Data
const classes = {
    saiyan: {
        name: 'SAIYAN',
        color: '#ff3300',
        power: 1000,
        health: 100,
        ki: 100,
        speed: 5,
        description: 'Warrior race with incredible power growth. Can transform into Super Saiyan forms.'
    },
    human: {
        name: 'HUMAN',
        color: '#0066ff',
        power: 800,
        health: 90,
        ki: 120,
        speed: 6,
        description: 'Adaptable fighters with strong techniques and rapid learning ability.'
    },
    namekian: {
        name: 'NAMEKIAN',
        color: '#00cc66',
        power: 900,
        health: 120,
        ki: 90,
        speed: 4,
        description: 'Regenerative abilities and stretchy limbs. Can create objects and heal.'
    },
    android: {
        name: 'ANDROID',
        color: '#666666',
        power: 950,
        health: 110,
        ki: 999,
        speed: 5,
        description: 'Infinite energy, no Ki drain. Can absorb energy and has high durability.'
    },
    frieza: {
        name: 'FRIEZA',
        color: '#9900ff',
        power: 1100,
        health: 95,
        ki: 110,
        speed: 5,
        description: 'Natural power and multiple transformation forms. Can survive in space.'
    }
};

// DOM Elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const screens = {
    start: document.getElementById('start-screen'),
    game: document.getElementById('game-screen'),
    gameover: document.getElementById('gameover-screen')
};

// Initialize Game
function init() {
    setupCanvas();
    setupEventListeners();
    updateClassInfo('saiyan');
    
    // Check if mobile
    gameState.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (gameState.isMobile) {
        document.querySelector('.mobile-controls').classList.remove('hidden');
        setupMobileControls();
    }
    
    // Start game loop
    requestAnimationFrame(gameLoop);
}

function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

function setupEventListeners() {
    // Class selection
    document.querySelectorAll('.class-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.class-option').forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            const selectedClass = this.dataset.class;
            updateClassInfo(selectedClass);
        });
    });
    
    // Start game button
    document.getElementById('start-button').addEventListener('click', startGame);
    
    // Restart button
    document.getElementById('restart-btn').addEventListener('click', startGame);
    
    // Pause button
    document.getElementById('pause-btn').addEventListener('click', togglePause);
    
    // Keyboard controls
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
}

function setupMobileControls() {
    // Movement buttons
    ['up', 'down', 'left', 'right'].forEach(dir => {
        const btn = document.getElementById(`btn-${dir}`);
        if (btn) {
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (gameState.player) {
                    gameState.player[`move${dir.charAt(0).toUpperCase() + dir.slice(1)}`] = true;
                }
            });
            
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                if (gameState.player) {
                    gameState.player[`move${dir.charAt(0).toUpperCase() + dir.slice(1)}`] = false;
                }
            });
        }
    });
    
    // Action buttons
    document.getElementById('btn-charge').addEventListener('touchstart', () => {
        if (gameState.player) gameState.player.isCharging = true;
    });
    
    document.getElementById('btn-charge').addEventListener('touchend', () => {
        if (gameState.player) gameState.player.isCharging = false;
    });
    
    document.getElementById('btn-attack').addEventListener('touchstart', () => {
        if (gameState.player) gameState.player.attack();
    });
    
    document.getElementById('btn-transform').addEventListener('touchstart', () => {
        if (gameState.player) gameState.player.transform();
    });
}

function updateClassInfo(className) {
    const classData = classes[className];
    document.getElementById('class-title').textContent = classData.name;
    document.getElementById('class-desc').textContent = classData.description;
    document.getElementById('stat-power').textContent = classData.power.toLocaleString();
    document.getElementById('stat-health').textContent = classData.health;
    document.getElementById('stat-ki').textContent = classData.ki === 999 ? '∞' : classData.ki;
}

function showScreen(screenName) {
    gameState.screen = screenName;
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
    });
    screens[screenName].classList.add('active');
}

// Start Game
function startGame() {
    const playerName = document.getElementById('player-name').value.trim() || 'WARRIOR';
    const selectedClass = document.querySelector('.class-option.active').dataset.class;
    
    // Create player
    gameState.player = new Player(playerName, selectedClass);
    gameState.enemies = [];
    gameState.beams = [];
    gameState.particles = [];
    gameState.gameRunning = true;
    gameState.gameTime = 0;
    
    // Update HUD
    document.getElementById('hud-player-name').textContent = gameState.player.name;
    document.getElementById('hud-player-class').textContent = classes[selectedClass].name;
    updateHUD();
    
    // Spawn initial enemies
    spawnEnemy();
    spawnEnemy();
    
    showScreen('game');
}

// Player Class
class Player {
    constructor(name, playerClass) {
        this.name = name;
        this.playerClass = playerClass;
        const classData = classes[playerClass];
        
        // Stats
        this.power = classData.power;
        this.maxHealth = classData.health;
        this.health = this.maxHealth;
        this.maxKi = classData.ki;
        this.ki = this.maxKi;
        this.speed = classData.speed;
        this.color = classData.color;
        this.level = 1;
        
        // Position
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.width = 40;
        this.height = 60;
        
        // State
        this.isCharging = false;
        this.isTransformed = false;
        this.moveUp = false;
        this.moveDown = false;
        this.moveLeft = false;
        this.moveRight = false;
        
        // Combat
        this.attackCooldown = 0;
        this.enemiesDefeated = 0;
    }
    
    update() {
        // Movement
        if (this.moveUp && this.y > 50) this.y -= this.speed;
        if (this.moveDown && this.y < canvas.height - 50) this.y += this.speed;
        if (this.moveLeft && this.x > 50) this.x -= this.speed;
        if (this.moveRight && this.x < canvas.width - 50) this.x += this.speed;
        
        // Charging
        if (this.isCharging && this.ki < this.maxKi) {
            this.ki += 0.5;
            this.power += 5;
            createParticles(this.x, this.y, 2, this.color);
        }
        
        // Regenerate ki (except for Android)
        if (!this.isCharging && this.ki < this.maxKi && this.playerClass !== 'android') {
            this.ki += 0.1;
        }
        
        // Attack cooldown
        if (this.attackCooldown > 0) {
            this.attackCooldown--;
        }
        
        // Update HUD
        updateHUD();
    }
    
    attack() {
        if (this.attackCooldown === 0 && this.ki >= 10) {
            const beam = {
                x: this.x,
                y: this.y,
                vx: 8,
                vy: 0,
                width: 12,
                height: 6,
                damage: 15 + (this.isTransformed ? 10 : 0),
                color: this.color,
                owner: 'player'
            };
            
            gameState.beams.push(beam);
            this.ki -= 10;
            this.attackCooldown = 20;
            
            // Auto-target nearest enemy
            let targetEnemy = null;
            let minDistance = 300;
            
            gameState.enemies.forEach(enemy => {
                const dx = enemy.x - this.x;
                const dy = enemy.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < minDistance) {
                    minDistance = distance;
                    targetEnemy = enemy;
                }
            });
            
            // Aim at enemy if found
            if (targetEnemy) {
                const dx = targetEnemy.x - this.x;
                const dy = targetEnemy.y - this.y;
                const angle = Math.atan2(dy, dx);
                beam.vx = Math.cos(angle) * 8;
                beam.vy = Math.sin(angle) * 8;
            }
        }
    }
    
    transform() {
        if (!this.isTransformed && this.ki >= 40) {
            this.isTransformed = true;
            this.ki -= 40;
            this.power *= 2;
            this.speed *= 1.5;
            createParticles(this.x, this.y, 20, '#ffcc00');
        }
    }
    
    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            gameOver();
        }
        updateHUD();
    }
    
    draw() {
        // Draw aura if charging or transformed
        if (this.isCharging || this.isTransformed) {
            const auraSize = this.isTransformed ? 25 : 15;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.width + auraSize, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(
                this.x, this.y, this.width,
                this.x, this.y, this.width + auraSize
            );
            gradient.addColorStop(0, this.color + 'ff');
            gradient.addColorStop(1, this.color + '00');
            ctx.fillStyle = gradient;
            ctx.fill();
        }
        
        // Draw body
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
        
        // Draw face
        ctx.fillStyle = '#ffcc99';
        ctx.beginPath();
        ctx.arc(this.x, this.y - this.height/2 - 10, 15, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw name
        ctx.font = '16px Orbitron';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(this.name, this.x, this.y - this.height/2 - 30);
    }
}

// Enemy Class
class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 60;
        this.color = '#00cc66';
        this.health = 60;
        this.maxHealth = 60;
        this.speed = 2;
        this.power = 500;
        this.attackCooldown = 0;
        
        // AI
        this.targetX = x;
        this.targetY = y;
        this.moveTimer = 0;
    }
    
    update() {
        // Movement
        this.moveTimer--;
        if (this.moveTimer <= 0) {
            this.targetX = Math.random() * canvas.width;
            this.targetY = Math.random() * canvas.height;
            this.moveTimer = 60 + Math.random() * 60;
        }
        
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 10) {
            this.x += (dx / dist) * this.speed;
            this.y += (dy / dist) * this.speed;
        }
        
        // Attack player if close
        if (gameState.player) {
            const pdx = gameState.player.x - this.x;
            const pdy = gameState.player.y - this.y;
            const pdist = Math.sqrt(pdx * pdx + pdy * pdy);
            
            if (pdist < 150 && this.attackCooldown === 0) {
                this.attack();
                this.attackCooldown = 80;
            }
        }
        
        if (this.attackCooldown > 0) {
            this.attackCooldown--;
        }
    }
    
    attack() {
        if (!gameState.player) return;
        
        const beam = {
            x: this.x,
            y: this.y,
            vx: -5,
            vy: 0,
            width: 10,
            height: 5,
            damage: 8,
            color: '#ff5500',
            owner: 'enemy'
        };
        
        gameState.beams.push(beam);
        
        // Aim at player
        const dx = gameState.player.x - this.x;
        const dy = gameState.player.y - this.y;
        const angle = Math.atan2(dy, dx);
        beam.vx = Math.cos(angle) * 5;
        beam.vy = Math.sin(angle) * 5;
    }
    
    takeDamage(damage) {
        this.health -= damage;
        createParticles(this.x, this.y, 5, '#ff9900');
        
        if (this.health <= 0) {
            this.health = 0;
            
            if (gameState.player) {
                gameState.player.enemiesDefeated++;
                gameState.player.power += 100;
                
                // Level up every 5 enemies
                if (gameState.player.enemiesDefeated % 5 === 0) {
                    gameState.player.level++;
                    gameState.player.maxHealth += 20;
                    gameState.player.health = Math.min(gameState.player.maxHealth, gameState.player.health + 20);
                    createParticles(gameState.player.x, gameState.player.y, 10, '#ffcc00');
                }
            }
            
            // Remove enemy
            const index = gameState.enemies.indexOf(this);
            if (index > -1) {
                gameState.enemies.splice(index, 1);
            }
            
            // Create explosion
            createExplosion(this.x, this.y);
            
            return true;
        }
        return false;
    }
    
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
        
        // Draw face
        ctx.fillStyle = '#99ff99';
        ctx.beginPath();
        ctx.arc(this.x, this.y - this.height/2 - 10, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw health bar
        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = '#660000';
        ctx.fillRect(this.x - 25, this.y - this.height/2 - 25, 50, 5);
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(this.x - 25, this.y - this.height/2 - 25, 50 * healthPercent, 5);
    }
}

// Game Functions
function spawnEnemy() {
    const side = Math.random() > 0.5 ? -50 : canvas.width + 50;
    const enemy = new Enemy(side, Math.random() * canvas.height);
    gameState.enemies.push(enemy);
    
    // Show enemy HUD
    document.getElementById('enemy-hud').classList.remove('hidden');
    document.getElementById('enemy-name').textContent = 'ENEMY';
    document.getElementById('enemy-health').style.width = '100%';
}

function createParticles(x, y, count, color) {
    for (let i = 0; i < count; i++) {
        gameState.particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            life: 1.0,
            color: color
        });
    }
}

function createExplosion(x, y) {
    for (let i = 0; i < 15; i++) {
        gameState.particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            life: 1.0,
            color: '#ff9900'
        });
    }
}

function updateHUD() {
    if (!gameState.player) return;
    
    const player = gameState.player;
    
    // Health
    const healthPercent = (player.health / player.maxHealth) * 100;
    document.getElementById('health-fill').style.width = `${healthPercent}%`;
    document.getElementById('health-text').textContent = `${Math.floor(player.health)}/${player.maxHealth}`;
    
    // Ki
    const kiPercent = (player.ki / player.maxKi) * 100;
    document.getElementById('ki-fill').style.width = `${kiPercent}%`;
    const kiText = player.playerClass === 'android' ? '∞' : Math.floor(player.ki);
    document.getElementById('ki-text').textContent = `${kiText}/${player.ki === 999 ? '∞' : player.maxKi}`;
    
    // Power level
    document.getElementById('power-level').textContent = player.power.toLocaleString();
    document.getElementById('hud-level').textContent = player.level;
}

function updateEnemyHUD(enemy) {
    if (!enemy) return;
    
    const healthPercent = (enemy.health / enemy.maxHealth) * 100;
    document.getElementById('enemy-health').style.width = `${healthPercent}%`;
}

function gameOver() {
    gameState.gameRunning = false;
    
    // Update final stats
    if (gameState.player) {
        document.getElementById('final-power').textContent = gameState.player.power.toLocaleString();
        document.getElementById('final-enemies').textContent = gameState.player.enemiesDefeated;
        
        const minutes = Math.floor(gameState.gameTime / 3600);
        const seconds = Math.floor((gameState.gameTime % 3600) / 60);
        document.getElementById('final-time').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    showScreen('gameover');
}

function togglePause() {
    gameState.gameRunning = !gameState.gameRunning;
    if (gameState.gameRunning) {
        requestAnimationFrame(gameLoop);
    }
}

function handleKeyDown(e) {
    if (!gameState.player || !gameState.gameRunning) return;
    
    const key = e.key.toLowerCase();
    
    // Movement
    if (key === 'w') gameState.player.moveUp = true;
    if (key === 's') gameState.player.moveDown = true;
    if (key === 'a') gameState.player.moveLeft = true;
    if (key === 'd') gameState.player.moveRight = true;
    
    // Actions
    if (key === 'q') gameState.player.isCharging = true;
    if (key === 'e') gameState.player.attack();
    if (key === 'f') gameState.player.transform();
    
    // Pause with space
    if (key === ' ') togglePause();
}

function handleKeyUp(e) {
    if (!gameState.player) return;
    
    const key = e.key.toLowerCase();
    if (key === 'w') gameState.player.moveUp = false;
    if (key === 's') gameState.player.moveDown = false;
    if (key === 'a') gameState.player.moveLeft = false;
    if (key === 'd') gameState.player.moveRight = false;
    if (key === 'q') gameState.player.isCharging = false;
}

// Main Game Loop
function gameLoop() {
    if (!gameState.gameRunning) return;
    
    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw stars
    ctx.fillStyle = 'white';
    for (let i = 0; i < 50; i++) {
        const x = (i * 37) % canvas.width;
        const y = (i * 29) % canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
    }
    
    gameState.gameTime++;
    
    // Spawn enemies occasionally
    if (gameState.gameTime % 300 === 0 && gameState.enemies.length < 8) {
        spawnEnemy();
    }
    
    // Update and draw player
    if (gameState.player) {
        gameState.player.update();
        gameState.player.draw();
    }
    
    // Update and draw enemies
    let nearestEnemy = null;
    let nearestDist = Infinity;
    
    gameState.enemies.forEach(enemy => {
        enemy.update();
        enemy.draw();
        
        // Find nearest enemy for HUD
        if (gameState.player) {
            const dx = enemy.x - gameState.player.x;
            const dy = enemy.y - gameState.player.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < nearestDist && dist < 300) {
                nearestDist = dist;
                nearestEnemy = enemy;
            }
        }
    });
    
    // Update enemy HUD
    updateEnemyHUD(nearestEnemy);
    
    // Update and draw beams
    for (let i = gameState.beams.length - 1; i >= 0; i--) {
        const beam = gameState.beams[i];
        beam.x += beam.vx;
        beam.y += beam.vy;
        
        // Check collisions
        if (beam.owner === 'player') {
            // Collision with enemies
            for (let j = gameState.enemies.length - 1; j >= 0; j--) {
                const enemy = gameState.enemies[j];
                const dx = beam.x - enemy.x;
                const dy = beam.y - enemy.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 30) {
                    const defeated = enemy.takeDamage(beam.damage);
                    gameState.beams.splice(i, 1);
                    break;
                }
            }
        } else if (beam.owner === 'enemy' && gameState.player) {
            // Collision with player
            const dx = beam.x - gameState.player.x;
            const dy = beam.y - gameState.player.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 30) {
                gameState.player.takeDamage(beam.damage);
                gameState.beams.splice(i, 1);
            }
        }
        
        // Remove out of bounds beams
        if (beam.x < -100 || beam.x > canvas.width + 100 || 
            beam.y < -100 || beam.y > canvas.height + 100) {
            gameState.beams.splice(i, 1);
        }
    }
    
    // Draw beams
    gameState.beams.forEach(beam => {
        // Beam glow
        ctx.beginPath();
        ctx.arc(beam.x, beam.y, beam.width + 3, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
            beam.x, beam.y, 0,
            beam.x, beam.y, beam.width + 3
        );
        gradient.addColorStop(0, beam.color + 'ff');
        gradient.addColorStop(1, beam.color + '00');
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Beam core
        ctx.fillStyle = beam.color;
        ctx.fillRect(beam.x - beam.width/2, beam.y - beam.height/2, beam.width, beam.height);
    });
    
    // Update and draw particles
    for (let i = gameState.particles.length - 1; i >= 0; i--) {
        const p = gameState.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.03;
        
        if (p.life <= 0) {
            gameState.particles.splice(i, 1);
        }
    }
    
    gameState.particles.forEach(p => {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    });
    
    requestAnimationFrame(gameLoop);
}

// Initialize game when page loads
window.addEventListener('load', init);
