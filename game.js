// Game State
let gameState = {
    screen: 'start',
    gameRunning: false,
    player: null,
    enemies: [],
    beams: [],
    particles: [],
    currentEnemy: null,
    gameTime: 0,
    isMobile: false
};

// Game Data
const races = {
    saiyan: { 
        name: 'Saiyan', 
        color: '#ff3300',
        power: 1000,
        health: 100,
        ki: 100,
        speed: 5,
        techniques: ['Kamehameha', 'Galick Gun', 'Final Flash']
    },
    human: { 
        name: 'Human', 
        color: '#0066ff',
        power: 800,
        health: 90,
        ki: 120,
        speed: 6,
        techniques: ['Kamehameha', 'Spirit Bomb', 'Solar Flare']
    },
    namekian: { 
        name: 'Namekian', 
        color: '#00cc66',
        power: 900,
        health: 120,
        ki: 90,
        speed: 4,
        techniques: ['Special Beam Cannon', 'Hellzone Grenade', 'Regeneration']
    },
    android: { 
        name: 'Android', 
        color: '#666666',
        power: 950,
        health: 110,
        ki: 999,
        speed: 5,
        techniques: ['Energy Absorption', 'Android Barrier', 'Hell Flash']
    },
    frieza: { 
        name: 'Frieza Race', 
        color: '#9900ff',
        power: 1100,
        health: 95,
        ki: 110,
        speed: 5,
        techniques: ['Death Beam', 'Death Saucer', 'Supernova']
    }
};

const techniques = {
    'Kamehameha': { power: 20, ki: 15, color: '#00aaff' },
    'Galick Gun': { power: 22, ki: 18, color: '#9900ff' },
    'Final Flash': { power: 30, ki: 25, color: '#ff9900' },
    'Spirit Bomb': { power: 50, ki: 40, color: '#ffffff' },
    'Solar Flare': { power: 0, ki: 10, color: '#ffff00' },
    'Special Beam Cannon': { power: 35, ki: 30, color: '#00ffaa' },
    'Hellzone Grenade': { power: 28, ki: 25, color: '#ff5500' },
    'Regeneration': { power: 0, ki: 20, color: '#00cc66' },
    'Energy Absorption': { power: 0, ki: 0, color: '#666666' },
    'Android Barrier': { power: 0, ki: 15, color: '#cccccc' },
    'Hell Flash': { power: 25, ki: 0, color: '#ff3300' },
    'Death Beam': { power: 20, ki: 15, color: '#9900ff' },
    'Death Saucer': { power: 25, ki: 20, color: '#ff00ff' },
    'Supernova': { power: 40, ki: 35, color: '#ff5500' }
};

// DOM Elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const screens = {
    start: document.getElementById('start-screen'),
    game: document.getElementById('game-screen'),
    gameOver: document.getElementById('game-over-screen')
};

// Initialize Game
function init() {
    detectMobile();
    setupEventListeners();
    setupCanvas();
    showScreen('start');
    updateTechGrid('saiyan');
    
    // Game loop
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

function detectMobile() {
    gameState.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (gameState.isMobile) {
        document.querySelector('.mobile-controls').style.display = 'flex';
    }
}

function showScreen(screenName) {
    gameState.screen = screenName;
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
    });
    screens[screenName].classList.add('active');
}

function setupEventListeners() {
    // Race selection
    document.querySelectorAll('.race-card').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('.race-card').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            const race = this.dataset.race;
            updatePreviewStats(race);
            updateTechGrid(race);
        });
    });
    
    // Start game
    document.getElementById('start-game').addEventListener('click', startGame);
    
    // Restart game
    document.getElementById('restart-btn').addEventListener('click', () => {
        startGame();
    });
    
    // Action buttons
    document.getElementById('charge-btn').addEventListener('click', () => {
        if (gameState.player) gameState.player.isCharging = true;
    });
    
    document.getElementById('attack-btn').addEventListener('click', () => {
        if (gameState.player) gameState.player.attack();
    });
    
    document.getElementById('transform-btn').addEventListener('click', () => {
        if (gameState.player) gameState.player.transform();
    });
    
    // Mobile controls
    ['up', 'down', 'left', 'right'].forEach(dir => {
        const btn = document.getElementById(`mobile-${dir}`);
        if (btn) {
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (gameState.player) gameState.player[`keys${dir.toUpperCase()}`] = true;
            });
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                if (gameState.player) gameState.player[`keys${dir.toUpperCase()}`] = false;
            });
        }
    });
    
    ['charge', 'attack', 'transform'].forEach(action => {
        const btn = document.getElementById(`mobile-${action}`);
        if (btn) {
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (action === 'charge') {
                    if (gameState.player) gameState.player.isCharging = true;
                } else if (action === 'attack') {
                    if (gameState.player) gameState.player.attack();
                } else if (action === 'transform') {
                    if (gameState.player) gameState.player.transform();
                }
            });
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                if (action === 'charge' && gameState.player) {
                    gameState.player.isCharging = false;
                }
            });
        }
    });
    
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (!gameState.player || !gameState.gameRunning) return;
        
        const key = e.key.toLowerCase();
        
        // Movement
        if (key === 'w' || key === 'arrowup') gameState.player.keysUP = true;
        if (key === 's' || key === 'arrowdown') gameState.player.keysDOWN = true;
        if (key === 'a' || key === 'arrowleft') gameState.player.keysLEFT = true;
        if (key === 'd' || key === 'arrowright') gameState.player.keysRIGHT = true;
        
        // Actions
        if (key === 'q' || key === 'p') gameState.player.isCharging = true;
        if (key === 'e' || key === 'o') gameState.player.attack();
        if (key === 'f' || key === 'g') gameState.player.transform();
    });
    
    document.addEventListener('keyup', (e) => {
        if (!gameState.player) return;
        
        const key = e.key.toLowerCase();
        if (key === 'q' || key === 'p') gameState.player.isCharging = false;
        if (key === 'w' || key === 'arrowup') gameState.player.keysUP = false;
        if (key === 's' || key === 'arrowdown') gameState.player.keysDOWN = false;
        if (key === 'a' || key === 'arrowleft') gameState.player.keysLEFT = false;
        if (key === 'd' || key === 'arrowright') gameState.player.keysRIGHT = false;
    });
}

function updateTechGrid(race) {
    const grid = document.getElementById('tech-grid');
    grid.innerHTML = '';
    
    const raceData = races[race];
    raceData.techniques.forEach(techName => {
        const tech = techniques[techName];
        const div = document.createElement('div');
        div.className = 'tech-option';
        if (raceData.techniques.indexOf(techName) === 0) div.classList.add('active');
        div.innerHTML = `
            <div class="tech-name">${techName}</div>
            <div class="tech-desc">Power: ${tech.power} | Ki: ${tech.ki}</div>
        `;
        div.addEventListener('click', function() {
            document.querySelectorAll('.tech-option').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
        grid.appendChild(div);
    });
}

function updatePreviewStats(race) {
    const raceData = races[race];
    document.getElementById('preview-power').textContent = raceData.power.toLocaleString();
    document.getElementById('preview-health').textContent = raceData.health;
    document.getElementById('preview-ki').textContent = raceData.ki === 999 ? '∞' : raceData.ki;
}

// Player Class
class Player {
    constructor(name, race, technique) {
        this.name = name;
        this.race = race;
        this.technique = technique;
        this.color = races[race].color;
        
        // Stats
        this.power = races[race].power;
        this.maxHealth = races[race].health;
        this.health = this.maxHealth;
        this.maxKi = races[race].ki;
        this.ki = this.maxKi;
        this.speed = races[race].speed;
        this.level = 1;
        this.exp = 0;
        
        // Position
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.width = 40;
        this.height = 60;
        
        // State
        this.isCharging = false;
        this.isTransformed = false;
        this.keysUP = false;
        this.keysDOWN = false;
        this.keysLEFT = false;
        this.keysRIGHT = false;
        
        // Combat
        this.attackCooldown = 0;
        this.enemiesDefeated = 0;
    }
    
    update() {
        // Movement
        if (this.keysUP && this.y > 50) this.y -= this.speed;
        if (this.keysDOWN && this.y < canvas.height - 50) this.y += this.speed;
        if (this.keysLEFT && this.x > 50) this.x -= this.speed;
        if (this.keysRIGHT && this.x < canvas.width - 50) this.x += this.speed;
        
        // Charging
        if (this.isCharging && this.ki < this.maxKi) {
            this.ki += 0.5;
            this.power += 1;
            createParticles(this.x, this.y, 2, this.color);
        }
        
        // Regenerate ki slowly
        if (!this.isCharging && this.ki < this.maxKi && this.race !== 'android') {
            this.ki += 0.1;
        }
        
        // Attack cooldown
        if (this.attackCooldown > 0) {
            this.attackCooldown--;
        }
    }
    
    attack() {
        if (this.attackCooldown === 0 && this.ki >= 15) {
            const beam = {
                x: this.x,
                y: this.y,
                vx: 10,
                vy: 0,
                width: 10,
                height: 5,
                damage: 10 + (this.isTransformed ? 5 : 0),
                color: this.color,
                owner: 'player'
            };
            gameState.beams.push(beam);
            this.ki -= 15;
            this.attackCooldown = 30;
            
            // Auto-target nearest enemy
            let nearestEnemy = null;
            let nearestDist = Infinity;
            gameState.enemies.forEach(enemy => {
                const dx = enemy.x - this.x;
                const dy = enemy.y - this.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < nearestDist && dist < 300) {
                    nearestDist = dist;
                    nearestEnemy = enemy;
                }
            });
            
            if (nearestEnemy) {
                const dx = nearestEnemy.x - this.x;
                const dy = nearestEnemy.y - this.y;
                const angle = Math.atan2(dy, dx);
                beam.vx = Math.cos(angle) * 10;
                beam.vy = Math.sin(angle) * 10;
            }
        }
    }
    
    transform() {
        if (!this.isTransformed && this.ki >= 50) {
            this.isTransformed = true;
            this.ki -= 50;
            this.power *= 2;
            this.speed *= 1.5;
            createParticles(this.x, this.y, 20, '#ffcc00');
        }
    }
    
    draw() {
        // Draw aura if charging or transformed
        if (this.isCharging || this.isTransformed) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.width + 10, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(
                this.x, this.y, this.width,
                this.x, this.y, this.width + 10
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
    
    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            gameOver();
        }
        updateHealthBar();
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
        this.health = 50;
        this.maxHealth = 50;
        this.speed = 2;
        this.power = 500;
        this.attackCooldown = 0;
        
        // AI
        this.targetX = x;
        this.targetY = y;
        this.moveTimer = 0;
    }
    
    update() {
        // Simple AI movement
        this.moveTimer--;
        if (this.moveTimer <= 0) {
            this.targetX = Math.random() * canvas.width;
            this.targetY = Math.random() * canvas.height;
            this.moveTimer = 60 + Math.random() * 60;
        }
        
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        if (dist > 10) {
            this.x += (dx / dist) * this.speed;
            this.y += (dy / dist) * this.speed;
        }
        
        // Attack player if close
        if (gameState.player) {
            const pdx = gameState.player.x - this.x;
            const pdy = gameState.player.y - this.y;
            const pdist = Math.sqrt(pdx*pdx + pdy*pdy);
            
            if (pdist < 100 && this.attackCooldown === 0) {
                this.attack();
                this.attackCooldown = 60;
            }
        }
        
        if (this.attackCooldown > 0) {
            this.attackCooldown--;
        }
    }
    
    attack() {
        if (gameState.player) {
            const beam = {
                x: this.x,
                y: this.y,
                vx: -5,
                vy: 0,
                width: 8,
                height: 4,
                damage: 5,
                color: this.color,
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
    }
    
    takeDamage(damage) {
        this.health -= damage;
        createParticles(this.x, this.y, 5, '#ff9900');
        
        if (this.health <= 0) {
            this.health = 0;
            if (gameState.player) {
                gameState.player.enemiesDefeated++;
                gameState.player.exp += 10;
                gameState.player.power += 50;
                
                // Check level up
                if (gameState.player.exp >= gameState.player.level * 100) {
                    gameState.player.level++;
                    gameState.player.exp = 0;
                    gameState.player.maxHealth += 20;
                    gameState.player.health = gameState.player.maxHealth;
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
            
            // Update enemy HUD
            document.getElementById('enemy-hud').classList.add('hidden');
            gameState.currentEnemy = null;
            
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
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(this.x - 25, this.y - this.height/2 - 25, 50, 5);
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(this.x - 25, this.y - this.height/2 - 25, 50 * healthPercent, 5);
    }
}

// Game Functions
function startGame() {
    const name = document.getElementById('player-name').value.trim() || 'Warrior';
    const race = document.querySelector('.race-card.active').dataset.race;
    const technique = document.querySelector('.tech-option.active .tech-name').textContent;
    
    // Create player
    gameState.player = new Player(name, race, technique);
    gameState.enemies = [];
    gameState.beams = [];
    gameState.particles = [];
    gameState.gameRunning = true;
    gameState.gameTime = 0;
    
    // Spawn initial enemies
    for (let i = 0; i < 5; i++) {
        spawnEnemy();
    }
    
    // Update HUD
    document.getElementById('hud-name').textContent = gameState.player.name;
    document.getElementById('hud-race').textContent = races[race].name;
    updateHealthBar();
    updateKiBar();
    updatePowerLevel();
    
    showScreen('game');
}

function spawnEnemy() {
    const x = Math.random() < 0.5 ? -50 : canvas.width + 50;
    const y = Math.random() * canvas.height;
    gameState.enemies.push(new Enemy(x, y));
}

function createParticles(x, y, count, color) {
    for (let i = 0; i < count; i++) {
        gameState.particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 5,
            vy: (Math.random() - 0.5) * 5,
            life: 1.0,
            color: color
        });
    }
}

function createExplosion(x, y) {
    for (let i = 0; i < 20; i++) {
        gameState.particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            life: 1.0,
            color: '#ff9900'
        });
    }
}

function updateHealthBar() {
    if (!gameState.player) return;
    const percent = (gameState.player.health / gameState.player.maxHealth) * 100;
    document.getElementById('health-bar').style.width = `${percent}%`;
    document.getElementById('health-text').textContent = 
        `${Math.floor(gameState.player.health)}/${gameState.player.maxHealth}`;
}

function updateKiBar() {
    if (!gameState.player) return;
    const percent = (gameState.player.ki / gameState.player.maxKi) * 100;
    document.getElementById('ki-bar').style.width = `${percent}%`;
    const kiText = gameState.player.race === 'android' ? '∞' : Math.floor(gameState.player.ki);
    document.getElementById('ki-text').textContent = 
        `${kiText}/${gameState.player.ki === 999 ? '∞' : gameState.player.maxKi}`;
}

function updatePowerLevel() {
    if (!gameState.player) return;
    document.getElementById('power-text').textContent = gameState.player.power.toLocaleString();
}

function updateEnemyHUD(enemy) {
    document.getElementById('enemy-name').textContent = 'Enemy';
    document.getElementById('enemy-power').textContent = enemy.power.toLocaleString();
    const percent = (enemy.health / enemy.maxHealth) * 100;
    document.getElementById('enemy-health').style.width = `${percent}%`;
    document.getElementById('enemy-hud').classList.remove('hidden');
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
    
    showScreen('gameOver');
}

function gameLoop() {
    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw stars
    ctx.fillStyle = 'white';
    for (let i = 0; i < 100; i++) {
        const x = (i * 17) % canvas.width;
        const y = (i * 23) % canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
    }
    
    if (gameState.gameRunning) {
        gameState.gameTime++;
        
        // Update and draw player
        if (gameState.player) {
            gameState.player.update();
            gameState.player.draw();
            
            // Update UI
            updateHealthBar();
            updateKiBar();
            updatePowerLevel();
            
            // Spawn enemies over time
            if (gameState.gameTime % 300 === 0 && gameState.enemies.length < 15) {
                spawnEnemy();
            }
            
            // Check for nearby enemies
            let closestEnemy = null;
            let closestDist = Infinity;
            gameState.enemies.forEach(enemy => {
                const dx = enemy.x - gameState.player.x;
                const dy = enemy.y - gameState.player.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < closestDist && dist < 200) {
                    closestDist = dist;
                    closestEnemy = enemy;
                }
            });
            
            if (closestEnemy) {
                gameState.currentEnemy = closestEnemy;
                updateEnemyHUD(closestEnemy);
            }
        }
        
        // Update and draw enemies
        gameState.enemies.forEach(enemy => {
            enemy.update();
            enemy.draw();
        });
        
        // Update and draw beams
        for (let i = gameState.beams.length - 1; i >= 0; i--) {
            const beam = gameState.beams[i];
            beam.x += beam.vx;
            beam.y += beam.vy;
            
            // Check collision
            if (beam.owner === 'player') {
                for (let j = gameState.enemies.length - 1; j >= 0; j--) {
                    const enemy = gameState.enemies[j];
                    if (Math.abs(beam.x - enemy.x) < 30 && Math.abs(beam.y - enemy.y) < 30) {
                        const defeated = enemy.takeDamage(beam.damage);
                        gameState.beams.splice(i, 1);
                        break;
                    }
                }
            } else if (beam.owner === 'enemy' && gameState.player) {
                if (Math.abs(beam.x - gameState.player.x) < 30 && Math.abs(beam.y - gameState.player.y) < 30) {
                    gameState.player.takeDamage(beam.damage);
                    gameState.beams.splice(i, 1);
                }
            }
            
            // Remove out of bounds beams
            if (beam.x < -100 || beam.x > canvas.width + 100 || beam.y < -100 || beam.y > canvas.height + 100) {
                gameState.beams.splice(i, 1);
            }
        }
        
        // Draw beams
        gameState.beams.forEach(beam => {
            ctx.fillStyle = beam.color;
            ctx.fillRect(beam.x - beam.width/2, beam.y - beam.height/2, beam.width, beam.height);
            
            // Glow effect
            ctx.beginPath();
            ctx.arc(beam.x, beam.y, beam.width, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(
                beam.x, beam.y, 0,
                beam.x, beam.y, beam.width
            );
            gradient.addColorStop(0, beam.color + 'ff');
            gradient.addColorStop(1, beam.color + '00');
            ctx.fillStyle = gradient;
            ctx.fill();
        });
        
        // Update and draw particles
        for (let i = gameState.particles.length - 1; i >= 0; i--) {
            const p = gameState.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.02;
            
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
    }
    
    requestAnimationFrame(gameLoop);
}

// Start the game
window.addEventListener('load', init);
