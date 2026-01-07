// Game State Management
const gameState = {
    currentScreen: 'start', // start, howToPlay, game, gameOver
    gameRunning: false,
    gameTime: 0,
    player: null,
    world: null,
    enemies: [],
    items: [],
    particles: [],
    beams: [],
    explosions: [],
    currentEnemy: null,
    inBattle: false,
    gameStarted: false
};

// DOM Elements
const screens = {
    start: document.getElementById('start-screen'),
    howToPlay: document.getElementById('how-to-play-screen'),
    game: document.getElementById('game-screen'),
    gameOver: document.getElementById('game-over-screen')
};

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const minimapCanvas = document.getElementById('minimapCanvas');
const minimapCtx = minimapCanvas.getContext('2d');

// Game Data
const races = {
    saiyan: {
        name: 'Saiyan',
        color: '#ff3300',
        icon: 'fas fa-fire',
        basePower: 1000,
        baseHealth: 100,
        baseKi: 100,
        baseSpeed: 5,
        abilities: ['Zenkai Boost', 'Super Saiyan'],
        transformations: ['Super Saiyan', 'Super Saiyan 2', 'Super Saiyan 3'],
        techniques: ['Kamehameha', 'Galick Gun', 'Final Flash', 'Spirit Bomb'],
        description: 'Warrior race with immense potential and ability to transform'
    },
    human: {
        name: 'Human',
        color: '#00ccff',
        icon: 'fas fa-user',
        basePower: 800,
        baseHealth: 90,
        baseKi: 120,
        baseSpeed: 6,
        abilities: ['Fast Learning', 'Spirit Bomb'],
        transformations: ['Potential Unlocked', 'Ultimate'],
        techniques: ['Kamehameha', 'Spirit Bomb', 'Solar Flare', 'Wolf Fang Fist'],
        description: 'Versatile and adaptable with strong techniques'
    },
    namekian: {
        name: 'Namekian',
        color: '#00cc66',
        icon: 'fas fa-leaf',
        basePower: 900,
        baseHealth: 120,
        baseKi: 90,
        baseSpeed: 4,
        abilities: ['Regeneration', 'Stretch Limbs'],
        transformations: ['Super Namekian', 'Fused'],
        techniques: ['Special Beam Cannon', 'Hellzone Grenade', 'Regeneration', 'Clothes Beam'],
        description: 'Regenerative abilities and unique techniques'
    },
    android: {
        name: 'Android',
        color: '#cccccc',
        icon: 'fas fa-robot',
        basePower: 950,
        baseHealth: 110,
        baseKi: 999, // Infinite energy
        baseSpeed: 5,
        abilities: ['Infinite Energy', 'Absorption'],
        transformations: ['Upgraded', 'Perfect'],
        techniques: ['Energy Absorption', 'Android Barrier', 'Hell Flash', 'Eye Laser'],
        description: 'Mechanical beings with infinite energy'
    },
    frieza: {
        name: 'Frieza Race',
        color: '#9900ff',
        icon: 'fas fa-skull-crossbones',
        basePower: 1100,
        baseHealth: 95,
        baseKi: 110,
        baseSpeed: 5,
        abilities: ['Natural Power', 'Space Survival'],
        transformations: ['Second Form', 'Third Form', 'Final Form', 'Golden'],
        techniques: ['Death Beam', 'Death Saucer', 'Nova Strike', 'Supernova'],
        description: 'Natural power and multiple transformation forms'
    }
};

const techniquesByRace = {
    saiyan: [
        { name: 'Kamehameha', power: 20, kiCost: 15, description: 'Classic energy wave attack' },
        { name: 'Galick Gun', power: 22, kiCost: 18, description: 'Vegeta\'s signature attack' },
        { name: 'Final Flash', power: 30, kiCost: 25, description: 'Massive energy blast' },
        { name: 'Spirit Bomb', power: 50, kiCost: 40, description: 'Gather energy from all living things' }
    ],
    human: [
        { name: 'Kamehameha', power: 18, kiCost: 15, description: 'Classic energy wave attack' },
        { name: 'Spirit Bomb', power: 45, kiCost: 35, description: 'Gather energy from all living things' },
        { name: 'Solar Flare', power: 0, kiCost: 10, description: 'Blind enemies temporarily' },
        { name: 'Wolf Fang Fist', power: 15, kiCost: 12, description: 'Rapid melee attack combo' }
    ],
    namekian: [
        { name: 'Special Beam Cannon', power: 35, kiCost: 30, description: 'Piercing energy drill attack' },
        { name: 'Hellzone Grenade', power: 28, kiCost: 25, description: 'Multiple homing energy orbs' },
        { name: 'Regeneration', power: 0, kiCost: 20, description: 'Heal significant health' },
        { name: 'Clothes Beam', power: 0, kiCost: 5, description: 'Create clothing out of thin air' }
    ],
    android: [
        { name: 'Energy Absorption', power: 0, kiCost: 0, description: 'Absorb enemy energy to heal' },
        { name: 'Android Barrier', power: 0, kiCost: 15, description: 'Create defensive energy barrier' },
        { name: 'Hell Flash', power: 25, kiCost: 0, description: 'Powerful energy blast' },
        { name: 'Eye Laser', power: 12, kiCost: 0, description: 'Rapid fire eye beams' }
    ],
    frieza: [
        { name: 'Death Beam', power: 20, kiCost: 15, description: 'Precise piercing energy beam' },
        { name: 'Death Saucer', power: 25, kiCost: 20, description: 'Razor-sharp energy disc' },
        { name: 'Nova Strike', power: 28, kiCost: 22, description: 'Rushing energy punch' },
        { name: 'Supernova', power: 40, kiCost: 35, description: 'Planet-destroying energy sphere' }
    ]
};

// World Data
const worldLocations = [
    { name: 'West City', x: 400, y: 300, type: 'city', color: '#3366cc' },
    { name: 'Kame House', x: 600, y: 500, type: 'island', color: '#00cc99' },
    { name: 'Korin Tower', x: 300, y: 150, type: 'tower', color: '#ff9900' },
    { name: 'Wasteland', x: 700, y: 200, type: 'desert', color: '#cc9900' },
    { name: 'Mountains', x: 100, y: 400, type: 'mountain', color: '#666666' },
    { name: 'Namek Village', x: 800, y: 400, type: 'village', color: '#00cc66' },
    { name: 'Capsule Corp', x: 450, y: 450, type: 'city', color: '#0066cc' },
    { name: 'HFIL', x: 200, y: 600, type: 'hell', color: '#cc0000' }
];

const enemies = [
    { name: 'Saibaman', power: 500, health: 50, color: '#00cc66', speed: 3, exp: 10 },
    { name: 'Red Ribbon Soldier', power: 300, health: 40, color: '#cc0000', speed: 2, exp: 8 },
    { name: 'Frieza Soldier', power: 600, health: 60, color: '#9900ff', speed: 4, exp: 12 },
    { name: 'Cell Jr.', power: 800, health: 70, color: '#00cc99', speed: 5, exp: 15 },
    { name: 'Majin Minion', power: 700, health: 65, color: '#cc00cc', speed: 4, exp: 14 },
    { name: 'Great Ape', power: 1500, health: 150, color: '#996600', speed: 2, exp: 30 },
    { name: 'Android 19', power: 900, health: 80, color: '#cccccc', speed: 3, exp: 18 },
    { name: 'Babidi\'s Minion', power: 400, health: 45, color: '#6600cc', speed: 3, exp: 10 }
];

const quests = [
    { id: 1, name: 'Saibaman Invasion', description: 'Defeat 5 Saibamen', target: 'Saibaman', count: 5, reward: { exp: 100, power: 200 } },
    { id: 2, name: 'Red Ribbon Threat', description: 'Eliminate 3 Red Ribbon Soldiers', target: 'Red Ribbon Soldier', count: 3, reward: { exp: 80, power: 150 } },
    { id: 3, name: 'Frieza Force', description: 'Take down 4 Frieza Soldiers', target: 'Frieza Soldier', count: 4, reward: { exp: 120, power: 250 } },
    { id: 4, name: 'Cell Games Prep', description: 'Defeat 2 Cell Juniors', target: 'Cell Jr.', count: 2, reward: { exp: 150, power: 300 } }
];

// Player Class
class Player {
    constructor(name, race, technique) {
        this.name = name;
        this.race = race;
        this.technique = technique;
        this.level = 1;
        this.exp = 0;
        this.expToNextLevel = 100;
        
        // Stats based on race
        const raceData = races[race];
        this.powerLevel = raceData.basePower;
        this.health = raceData.baseHealth;
        this.maxHealth = raceData.baseHealth;
        this.ki = raceData.baseKi;
        this.maxKi = raceData.baseKi;
        this.speed = raceData.baseSpeed;
        this.color = raceData.color;
        
        // Position
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.width = 40;
        this.height = 60;
        
        // Battle state
        this.isCharging = false;
        this.isTransformed = false;
        this.transformationLevel = 0;
        this.lastAttack = 0;
        this.attackCooldown = 1000;
        
        // Abilities
        this.abilities = raceData.abilities;
        this.transformations = raceData.transformations;
        
        // Inventory
        this.inventory = [];
        this.dragonBalls = 0;
        this.maxDragonBalls = 7;
        
        // Stats tracking
        this.enemiesDefeated = 0;
        this.questsCompleted = 0;
        this.totalDamageDealt = 0;
        this.totalDamageTaken = 0;
        
        // Current quest
        this.currentQuest = quests[0];
        this.questProgress = 0;
        
        // Keys
        this.keys = {
            up: false,
            down: false,
            left: false,
            right: false,
            jump: false,
            charge: false,
            attack: false,
            special: false,
            transform: false
        };
    }
    
    gainExp(amount) {
        this.exp += amount;
        if (this.exp >= this.expToNextLevel) {
            this.levelUp();
        }
        updateUI();
    }
    
    levelUp() {
        this.level++;
        this.exp -= this.expToNextLevel;
        this.expToNextLevel = Math.floor(this.expToNextLevel * 1.5);
        
        // Increase stats
        this.maxHealth += 20;
        this.health = this.maxHealth;
        this.maxKi += 15;
        this.ki = this.maxKi;
        this.powerLevel += 500;
        this.speed += 0.5;
        
        // Add message
        addMessage(`Level Up! You are now level ${this.level}!`);
        addMessage(`Power Level: ${this.powerLevel.toLocaleString()}`);
    }
    
    chargeKi() {
        if (this.ki < this.maxKi) {
            this.isCharging = true;
            this.ki += 1;
            this.powerLevel += 5;
            
            // Create charging particles
            if (gameState.gameTime % 5 === 0) {
                createParticle(this.x, this.y, this.color);
            }
        } else {
            this.isCharging = false;
        }
    }
    
    attack() {
        if (this.ki >= 15 && Date.now() - this.lastAttack > this.attackCooldown) {
            const beam = {
                x: this.x,
                y: this.y,
                width: 10,
                height: 5,
                speed: 10,
                color: this.color,
                damage: 10 + (this.isTransformed ? this.transformationLevel * 5 : 0),
                owner: 'player'
            };
            
            gameState.beams.push(beam);
            this.ki -= 15;
            this.lastAttack = Date.now();
            
            addMessage(`${this.name} used Energy Blast!`);
        }
    }
    
    useSpecial() {
        const techniqueData = techniquesByRace[this.race].find(t => t.name === this.technique);
        if (techniqueData && this.ki >= techniqueData.kiCost) {
            const beam = {
                x: this.x,
                y: this.y,
                width: 15,
                height: 8,
                speed: 12,
                color: this.color,
                damage: techniqueData.power + (this.isTransformed ? this.transformationLevel * 8 : 0),
                owner: 'player',
                special: true
            };
            
            gameState.beams.push(beam);
            this.ki -= techniqueData.kiCost;
            this.lastAttack = Date.now();
            
            addMessage(`${this.name} used ${techniqueData.name}!`);
        }
    }
    
    transform() {
        if (!this.isTransformed && this.ki >= 50 && this.transformationLevel < this.transformations.length) {
            this.isTransformed = true;
            this.transformationLevel++;
            this.ki -= 50;
            
            // Increase stats
            this.powerLevel *= (1 + this.transformationLevel * 0.5);
            this.speed += 2;
            this.attackCooldown = Math.max(500, this.attackCooldown - 200);
            
            const formName = this.transformations[this.transformationLevel - 1];
            addMessage(`${this.name} transformed into ${formName}!`);
            addMessage(`Power Level: ${this.powerLevel.toLocaleString()}!`);
            
            // Transformation effect
            for (let i = 0; i < 30; i++) {
                setTimeout(() => {
                    createParticle(this.x, this.y, '#ffcc00');
                }, i * 30);
            }
        }
    }
    
    takeDamage(damage) {
        this.health -= damage;
        this.totalDamageTaken += damage;
        
        if (this.health <= 0) {
            this.health = 0;
            gameOver();
        }
    }
    
    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
    }
    
    update() {
        // Movement
        if (this.keys.up && this.y > this.height/2 + 50) this.y -= this.speed;
        if (this.keys.down && this.y < canvas.height - this.height/2 - 50) this.y += this.speed;
        if (this.keys.left && this.x > this.width/2) this.x -= this.speed;
        if (this.keys.right && this.x < canvas.width - this.width/2) this.x += this.speed;
        if (this.keys.jump && this.y > this.height/2 + 20) this.y -= this.speed * 1.5;
        
        // Charging
        if (this.keys.charge) {
            this.chargeKi();
        } else {
            this.isCharging = false;
        }
        
        // Attacks
        if (this.keys.attack) {
            this.attack();
            this.keys.attack = false;
        }
        
        if (this.keys.special) {
            this.useSpecial();
            this.keys.special = false;
        }
        
        if (this.keys.transform) {
            this.transform();
            this.keys.transform = false;
        }
        
        // Regenerate ki slowly
        if (!this.isCharging && this.ki < this.maxKi) {
            this.ki += 0.1;
        }
    }
    
    draw() {
        // Draw aura if charging or transformed
        if (this.isCharging || this.isTransformed) {
            const auraColor = this.isTransformed ? '#ffcc00' : this.color;
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.width + 15, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(
                this.x, this.y, this.width,
                this.x, this.y, this.width + 15
            );
            gradient.addColorStop(0, auraColor + 'ff');
            gradient.addColorStop(1, auraColor + '00');
            ctx.fillStyle = gradient;
            ctx.fill();
        }
        
        // Draw player body
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
        
        // Draw player details
        ctx.fillStyle = '#222';
        ctx.fillRect(this.x - this.width/2 + 5, this.y - this.height/2 + 10, this.width - 10, 15);
        
        // Draw player face/head
        ctx.fillStyle = '#ffcc99';
        ctx.beginPath();
        ctx.arc(this.x, this.y - this.height/2 - 10, 15, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw hair based on race
        ctx.fillStyle = this.getHairColor();
        
        // Spiky hair
        for (let i = 0; i < 5; i++) {
            const angle = -Math.PI/2 + (i * Math.PI/6);
            const spikeX = this.x + Math.cos(angle) * 20;
            const spikeY = this.y - this.height/2 - 10 + Math.sin(angle) * 20;
            
            ctx.beginPath();
            ctx.moveTo(this.x, this.y - this.height/2 - 10);
            ctx.lineTo(spikeX, spikeY);
            ctx.lineTo(this.x + Math.cos(angle + 0.2) * 15, this.y - this.height/2 - 10 + Math.sin(angle + 0.2) * 15);
            ctx.closePath();
            ctx.fill();
        }
        
        // Draw name
        ctx.font = '16px Orbitron';
        ctx.fillStyle = this.color;
        ctx.textAlign = 'center';
        ctx.fillText(this.name, this.x, this.y - this.height/2 - 30);
    }
    
    getHairColor() {
        switch(this.race) {
            case 'saiyan': return this.isTransformed ? '#ffcc00' : '#000000';
            case 'namekian': return '#00cc66';
            case 'frieza': return '#9900ff';
            default: return '#000000';
        }
    }
}

// Enemy Class
class Enemy {
    constructor(type, x, y) {
        const enemyData = enemies.find(e => e.name === type) || enemies[0];
        this.name = enemyData.name;
        this.power = enemyData.power;
        this.health = enemyData.health;
        this.maxHealth = enemyData.health;
        this.color = enemyData.color;
        this.speed = enemyData.speed;
        this.exp = enemyData.exp;
        
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 60;
        
        this.lastAttack = 0;
        this.attackCooldown = 2000;
        this.isAggressive = false;
        this.targetX = x;
        this.targetY = y;
        this.moveTimer = 0;
    }
    
    update() {
        // Simple AI - move randomly
        this.moveTimer--;
        if (this.moveTimer <= 0) {
            this.targetX = this.x + (Math.random() - 0.5) * 200;
            this.targetY = this.y + (Math.random() - 0.5) * 200;
            this.moveTimer = 60 + Math.random() * 120;
        }
        
        // Move towards target
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        if (dist > 10) {
            this.x += (dx / dist) * this.speed;
            this.y += (dy / dist) * this.speed;
        }
        
        // Boundary check
        this.x = Math.max(this.width/2, Math.min(canvas.width - this.width/2, this.x));
        this.y = Math.max(this.height/2 + 50, Math.min(canvas.height - this.height/2 - 50, this.y));
        
        // Check if player is nearby
        if (gameState.player) {
            const player = gameState.player;
            const pdx = player.x - this.x;
            const pdy = player.y - this.y;
            const pdist = Math.sqrt(pdx*pdx + pdy*pdy);
            
            if (pdist < 200) {
                // Aggressive mode - chase player
                this.isAggressive = true;
                this.targetX = player.x;
                this.targetY = player.y;
                
                // Attack if close enough
                if (pdist < 100 && Date.now() - this.lastAttack > this.attackCooldown) {
                    this.attack();
                    this.lastAttack = Date.now();
                }
            } else {
                this.isAggressive = false;
            }
        }
    }
    
    attack() {
        if (gameState.player && !gameState.inBattle) {
            // Start battle with player
            gameState.currentEnemy = this;
            gameState.inBattle = true;
            addMessage(`A wild ${this.name} appears! Power Level: ${this.power.toLocaleString()}`);
            
            // Show enemy HUD
            document.getElementById('enemy-hud').classList.remove('hidden');
            updateEnemyHUD();
        }
    }
    
    takeDamage(damage) {
        this.health -= damage;
        updateEnemyHUD();
        
        if (this.health <= 0) {
            this.health = 0;
            this.defeat();
            return true;
        }
        return false;
    }
    
    defeat() {
        if (gameState.player) {
            gameState.player.gainExp(this.exp);
            gameState.player.enemiesDefeated++;
            
            // Check quest progress
            if (gameState.player.currentQuest && 
                gameState.player.currentQuest.target === this.name) {
                gameState.player.questProgress++;
                
                if (gameState.player.questProgress >= gameState.player.currentQuest.count) {
                    // Quest complete
                    const reward = gameState.player.currentQuest.reward;
                    gameState.player.gainExp(reward.exp);
                    gameState.player.powerLevel += reward.power;
                    gameState.player.questsCompleted++;
                    
                    addMessage(`Quest Complete: ${gameState.player.currentQuest.name}!`);
                    addMessage(`Reward: ${reward.exp} EXP, +${reward.power} Power Level`);
                    
                    // Assign new quest
                    const nextQuest = quests.find(q => q.id === gameState.player.currentQuest.id + 1);
                    if (nextQuest) {
                        gameState.player.currentQuest = nextQuest;
                        gameState.player.questProgress = 0;
                        addMessage(`New Quest: ${nextQuest.name}`);
                    }
                }
            }
            
            addMessage(`${this.name} defeated! +${this.exp} EXP`);
            
            // Chance to drop dragon ball
            if (Math.random() < 0.1 && gameState.player.dragonBalls < gameState.player.maxDragonBalls) {
                gameState.player.dragonBalls++;
                addMessage(`You found a Dragon Ball! (${gameState.player.dragonBalls}/7)`);
                updateDragonBalls();
            }
            
            // Remove enemy
            const index = gameState.enemies.indexOf(this);
            if (index > -1) {
                gameState.enemies.splice(index, 1);
            }
            
            // End battle
            gameState.inBattle = false;
            gameState.currentEnemy = null;
            document.getElementById('enemy-hud').classList.add('hidden');
            
            // Create explosion
            createExplosion(this.x, this.y);
        }
    }
    
    draw() {
        // Draw enemy
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
        
        // Draw enemy details
        ctx.fillStyle = '#111';
        ctx.fillRect(this.x - this.width/2 + 5, this.y - this.height/2 + 10, this.width - 10, 15);
        
        // Draw enemy face
        ctx.fillStyle = this.getFaceColor();
        ctx.beginPath();
        ctx.arc(this.x, this.y - this.height/2 - 10, 15, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw enemy name
        ctx.font = '14px Orbitron';
        ctx.fillStyle = this.color;
        ctx.textAlign = 'center';
        ctx.fillText(this.name, this.x, this.y - this.height/2 - 30);
    }
    
    getFaceColor() {
        switch(this.name) {
            case 'Saibaman': return '#00cc66';
            case 'Red Ribbon Soldier': return '#ff9999';
            case 'Frieza Soldier': return '#cc99ff';
            case 'Cell Jr.': return '#99ffcc';
            default: return '#cccccc';
        }
    }
}

// World Class
class World {
    constructor() {
        this.locations = worldLocations;
        this.tiles = [];
        this.generateTerrain();
        this.spawnEnemies();
        this.spawnItems();
    }
    
    generateTerrain() {
        // Create a simple terrain grid
        for (let x = 0; x < canvas.width; x += 50) {
            for (let y = 0; y < canvas.height; y += 50) {
                this.tiles.push({
                    x, y,
                    type: this.getTileType(x, y),
                    color: this.getTileColor(x, y)
                });
            }
        }
    }
    
    getTileType(x, y) {
        // Determine tile type based on position
        let type = 'grass';
        
        // Check locations
        for (const loc of this.locations) {
            const dist = Math.sqrt(Math.pow(x - loc.x, 2) + Math.pow(y - loc.y, 2));
            if (dist < 100) {
                return loc.type;
            }
        }
        
        // Random terrain features
        if (y > 500) type = 'water';
        else if (y > 400) type = 'sand';
        else if (x < 200 || x > 700) type = 'mountain';
        else if (Math.random() < 0.1) type = 'rock';
        
        return type;
    }
    
    getTileColor(x, y) {
        const type = this.getTileType(x, y);
        switch(type) {
            case 'grass': return '#336633';
            case 'water': return '#0066cc';
            case 'sand': return '#cc9900';
            case 'mountain': return '#666666';
            case 'rock': return '#888888';
            case 'city': return '#444444';
            case 'island': return '#00cc99';
            case 'tower': return '#ff9900';
            case 'desert': return '#cc9900';
            case 'village': return '#00cc66';
            case 'hell': return '#cc0000';
            default: return '#336633';
        }
    }
    
    spawnEnemies() {
        for (let i = 0; i < 15; i++) {
            const x = 100 + Math.random() * (canvas.width - 200);
            const y = 100 + Math.random() * (canvas.height - 200);
            const enemyType = enemies[Math.floor(Math.random() * enemies.length)].name;
            
            gameState.enemies.push(new Enemy(enemyType, x, y));
        }
    }
    
    spawnItems() {
        // Place some items in the world
        const items = [
            { name: 'Senzu Bean', type: 'heal', value: 50, color: '#00cc66', x: 300, y: 200 },
            { name: 'Power Capsule', type: 'power', value: 200, color: '#ffcc00', x: 500, y: 400 },
            { name: 'Ki Booster', type: 'ki', value: 30, color: '#0066ff', x: 200, y: 500 },
            { name: 'Dragon Radar', type: 'special', value: 0, color: '#ff3300', x: 600, y: 300 },
            { name: 'Armor', type: 'armor', value: 10, color: '#cccccc', x: 400, y: 100 }
        ];
        
        gameState.items = items;
    }
    
    draw() {
        // Draw terrain tiles
        for (const tile of this.tiles) {
            ctx.fillStyle = tile.color;
            ctx.fillRect(tile.x, tile.y, 50, 50);
            
            // Add some texture
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.strokeRect(tile.x, tile.y, 50, 50);
        }
        
        // Draw location markers
        for (const loc of this.locations) {
            ctx.fillStyle = loc.color;
            ctx.beginPath();
            ctx.arc(loc.x, loc.y, 15, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.font = '14px Orbitron';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.fillText(loc.name, loc.x, loc.y + 30);
        }
        
        // Draw items
        for (const item of gameState.items) {
            ctx.fillStyle = item.color;
            ctx.beginPath();
            ctx.arc(item.x, item.y, 10, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }
    
    drawMinimap() {
        // Clear minimap
        minimapCtx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        minimapCtx.fillRect(0, 0, minimapCanvas.width, minimapCanvas.height);
        
        // Draw terrain
        const scale = 0.2;
        for (const tile of this.tiles) {
            minimapCtx.fillStyle = this.getTileColor(tile.x, tile.y);
            minimapCtx.fillRect(tile.x * scale, tile.y * scale, 50 * scale, 50 * scale);
        }
        
        // Draw locations
        for (const loc of this.locations) {
            minimapCtx.fillStyle = loc.color;
            minimapCtx.beginPath();
            minimapCtx.arc(loc.x * scale, loc.y * scale, 5, 0, Math.PI * 2);
            minimapCtx.fill();
        }
        
        // Draw player
        if (gameState.player) {
            minimapCtx.fillStyle = gameState.player.color;
            minimapCtx.beginPath();
            minimapCtx.arc(gameState.player.x * scale, gameState.player.y * scale, 4, 0, Math.PI * 2);
            minimapCtx.fill();
        }
        
        // Draw enemies
        minimapCtx.fillStyle = '#ff0000';
        for (const enemy of gameState.enemies) {
            minimapCtx.beginPath();
            minimapCtx.arc(enemy.x * scale, enemy.y * scale, 3, 0, Math.PI * 2);
            minimapCtx.fill();
        }
    }
}

// Game Functions
function switchScreen(screenName) {
    // Hide all screens
    for (const screen of Object.values(screens)) {
        screen.classList.add('hidden');
    }
    
    // Show requested screen
    screens[screenName].classList.remove('hidden');
    gameState.currentScreen = screenName;
    
    // Initialize game if switching to game screen
    if (screenName === 'game' && !gameState.gameStarted) {
        initGame();
    }
}

function initGame() {
    // Get player data from start screen
    const playerName = document.getElementById('player-name').value.trim() || 'Warrior';
    const selectedRace = document.querySelector('.race-option.selected')?.dataset.race || 'saiyan';
    const selectedTechnique = document.querySelector('.technique-option.selected')?.dataset.technique || 'Kamehameha';
    
    // Create player
    gameState.player = new Player(playerName, selectedRace, selectedTechnique);
    gameState.world = new World();
    gameState.gameRunning = true;
    gameState.gameStarted = true;
    gameState.gameTime = 0;
    
    // Update UI with player info
    document.getElementById('player-name-display').textContent = gameState.player.name;
    document.getElementById('player-race-display').textContent = races[selectedRace].name;
    updateUI();
    updateDragonBalls();
    
    // Add welcome message
    addMessage(`Welcome, ${gameState.player.name} the ${races[selectedRace].name}!`);
    addMessage(`Your adventure begins. Power Level: ${gameState.player.powerLevel.toLocaleString()}`);
    addMessage(`Current Quest: ${gameState.player.currentQuest.name}`);
    
    // Start game loop
    requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp) {
    if (!gameState.gameRunning) return;
    
    gameState.gameTime++;
    
    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw world
    if (gameState.world) {
        gameState.world.draw();
    }
    
    // Update and draw player
    if (gameState.player) {
        gameState.player.update();
        gameState.player.draw();
    }
    
    // Update and draw enemies
    for (const enemy of gameState.enemies) {
        enemy.update();
        enemy.draw();
    }
    
    // Update and draw beams
    updateBeams();
    drawBeams();
    
    // Update and draw explosions
    updateExplosions();
    drawExplosions();
    
    // Update and draw particles
    updateParticles();
    drawParticles();
    
    // Update minimap
    if (gameState.world) {
        gameState.world.drawMinimap();
    }
    
    // Update UI
    updateUI();
    
    // Check for item pickup
    checkItemPickup();
    
    // Continue game loop
    requestAnimationFrame(gameLoop);
}

function updateBeams() {
    for (let i = gameState.beams.length - 1; i >= 0; i--) {
        const beam = gameState.beams[i];
        beam.x += beam.speed;
        
        // Check collision with enemies
        if (beam.owner === 'player') {
            for (const enemy of gameState.enemies) {
                if (checkCollision(beam, enemy)) {
                    const defeated = enemy.takeDamage(beam.damage);
                    gameState.beams.splice(i, 1);
                    
                    if (!defeated) {
                        addMessage(`${enemy.name} took ${beam.damage} damage!`);
                    }
                    break;
                }
            }
        }
        
        // Remove beam if out of bounds
        if (beam.x < -50 || beam.x > canvas.width + 50) {
            gameState.beams.splice(i, 1);
        }
    }
}

function drawBeams() {
    for (const beam of gameState.beams) {
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
    }
}

function createParticle(x, y, color) {
    gameState.particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
        radius: Math.random() * 3 + 1,
        color: color,
        life: 1.0
    });
}

function updateParticles() {
    for (let i = gameState.particles.length - 1; i >= 0; i--) {
        const particle = gameState.particles[i];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.02;
        
        if (particle.life <= 0) {
            gameState.particles.splice(i, 1);
        }
    }
}

function drawParticles() {
    for (const particle of gameState.particles) {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.life;
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }
}

function createExplosion(x, y) {
    gameState.explosions.push({
        x, y,
        radius: 5,
        maxRadius: 30,
        color: '#ffcc00',
        life: 1.0
    });
    
    // Create particles
    for (let i = 0; i < 20; i++) {
        createParticle(x, y, '#ff9900');
    }
}

function updateExplosions() {
    for (let i = gameState.explosions.length - 1; i >= 0; i--) {
        const explosion = gameState.explosions[i];
        explosion.radius += 1;
        explosion.life -= 0.03;
        
        if (explosion.life <= 0 || explosion.radius > explosion.maxRadius) {
            gameState.explosions.splice(i, 1);
        }
    }
}

function drawExplosions() {
    for (const explosion of gameState.explosions) {
        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
            explosion.x, explosion.y, 0,
            explosion.x, explosion.y, explosion.radius
        );
        gradient.addColorStop(0, explosion.color + 'ff');
        gradient.addColorStop(1, explosion.color + '00');
        ctx.fillStyle = gradient;
        ctx.globalAlpha = explosion.life;
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }
}

function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width/2 &&
           obj1.x > obj2.x - obj2.width/2 &&
           obj1.y < obj2.y + obj2.height/2 &&
           obj1.y > obj2.y - obj2.height/2;
}

function checkItemPickup() {
    if (!gameState.player) return;
    
    for (let i = gameState.items.length - 1; i >= 0; i--) {
        const item = gameState.items[i];
        const dx = item.x - gameState.player.x;
        const dy = item.y - gameState.player.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        if (dist < 30) {
            // Pick up item
            pickupItem(item);
            gameState.items.splice(i, 1);
        }
    }
}

function pickupItem(item) {
    if (!gameState.player) return;
    
    switch(item.type) {
        case 'heal':
            gameState.player.heal(item.value);
            addMessage(`Picked up ${item.name}! Healed ${item.value} HP.`);
            break;
        case 'power':
            gameState.player.powerLevel += item.value;
            addMessage(`Picked up ${item.name}! Power Level +${item.value}.`);
            break;
        case 'ki':
            gameState.player.ki = Math.min(gameState.player.maxKi, gameState.player.ki + item.value);
            addMessage(`Picked up ${item.name}! Ki +${item.value}.`);
            break;
        case 'armor':
            addMessage(`Picked up ${item.name}! Defense increased.`);
            // Add to inventory
            gameState.player.inventory.push(item);
            break;
        case 'special':
            addMessage(`Picked up ${item.name}! Dragon Ball detection active.`);
            break;
    }
}

function updateUI() {
    if (!gameState.player) return;
    
    // Update health
    const healthPercent = (gameState.player.health / gameState.player.maxHealth) * 100;
    document.getElementById('health-bar').style.width = `${healthPercent}%`;
    document.getElementById('health-value').textContent = 
        `${Math.floor(gameState.player.health)}/${gameState.player.maxHealth}`;
    
    // Update ki
    const kiPercent = (gameState.player.ki / gameState.player.maxKi) * 100;
    document.getElementById('ki-bar').style.width = `${kiPercent}%`;
    document.getElementById('ki-value').textContent = 
        `${Math.floor(gameState.player.ki)}/${gameState.player.maxKi}`;
    
    // Update power level (capped at 100% for display)
    const powerPercent = Math.min(100, gameState.player.powerLevel / 10000 * 100);
    document.getElementById('power-bar').style.width = `${powerPercent}%`;
    document.getElementById('power-level').textContent = gameState.player.powerLevel.toLocaleString();
    
    // Update experience
    const expPercent = (gameState.player.exp / gameState.player.expToNextLevel) * 100;
    document.getElementById('exp-bar').style.width = `${expPercent}%`;
    document.getElementById('exp-value').textContent = 
        `${gameState.player.exp}/${gameState.player.expToNextLevel}`;
    
    // Update level
    document.getElementById('player-level').textContent = gameState.player.level;
    
    // Update stats
    document.getElementById('enemies-defeated').textContent = gameState.player.enemiesDefeated;
    document.getElementById('quests-done').textContent = gameState.player.questsCompleted;
    
    // Update quest
    document.getElementById('current-quest').textContent = gameState.player.currentQuest.description;
    document.getElementById('quest-progress').textContent = 
        `${gameState.player.questProgress}/${gameState.player.currentQuest.count}`;
    
    const questPercent = (gameState.player.questProgress / gameState.player.currentQuest.count) * 100;
    document.getElementById('quest-bar').style.width = `${questPercent}%`;
    
    // Update time played
    const minutes = Math.floor(gameState.gameTime / 3600);
    const seconds = Math.floor((gameState.gameTime % 3600) / 60);
    document.getElementById('time-played').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function updateEnemyHUD() {
    if (!gameState.currentEnemy) return;
    
    document.getElementById('enemy-name').textContent = gameState.currentEnemy.name;
    document.getElementById('enemy-power').textContent = gameState.currentEnemy.power.toLocaleString();
    
    const healthPercent = (gameState.currentEnemy.health / gameState.currentEnemy.maxHealth) * 100;
    document.getElementById('enemy-health').style.width = `${healthPercent}%`;
}

function updateDragonBalls() {
    if (!gameState.player) return;
    
    const container = document.getElementById('dragonballs');
    container.innerHTML = '';
    
    for (let i = 1; i <= 7; i++) {
        const ball = document.createElement('div');
        ball.className = `db-icon ${i <= gameState.player.dragonBalls ? '' : 'missing'}`;
        ball.textContent = i;
        container.appendChild(ball);
    }
}

function addMessage(text) {
    const log = document.getElementById('battle-log');
    const message = document.createElement('div');
    message.className = 'message';
    message.textContent = text;
    
    log.appendChild(message);
    
    // Scroll to bottom
    log.scrollTop = log.scrollHeight;
    
    // Limit messages
    if (log.children.length > 20) {
        log.removeChild(log.firstChild);
    }
}

function gameOver() {
    gameState.gameRunning = false;
    
    // Update final stats
    document.getElementById('final-power').textContent = gameState.player.powerLevel.toLocaleString();
    document.getElementById('final-enemies').textContent = gameState.player.enemiesDefeated;
    document.getElementById('final-quests').textContent = gameState.player.questsCompleted;
    
    const minutes = Math.floor(gameState.gameTime / 3600);
    const seconds = Math.floor((gameState.gameTime % 3600) / 60);
    document.getElementById('final-time').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Switch to game over screen
    switchScreen('gameOver');
}

// Event Listeners for Start Screen
document.addEventListener('DOMContentLoaded', function() {
    // Race selection
    const raceOptions = document.querySelectorAll('.race-option');
    raceOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            raceOptions.forEach(opt => opt.classList.remove('selected'));
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Update technique selection based on race
            updateTechniqueSelection(this.dataset.race);
            
            // Update preview stats
            updatePreviewStats(this.dataset.race);
        });
    });
    
    // Default select Saiyan
    document.querySelector('.race-option[data-race="saiyan"]').classList.add('selected');
    updateTechniqueSelection('saiyan');
    updatePreviewStats('saiyan');
    
    // Start game button
    document.getElementById('start-game-btn').addEventListener('click', function() {
        const playerName = document.getElementById('player-name').value.trim();
        if (!playerName) {
            alert('Please enter a warrior name!');
            document.getElementById('player-name').focus();
            return;
        }
        
        switchScreen('game');
    });
    
    // How to play button
    document.getElementById('how-to-play-btn').addEventListener('click', function() {
        switchScreen('howToPlay');
    });
    
    // Back to start from how to play
    document.getElementById('back-to-start-btn').addEventListener('click', function() {
        switchScreen('start');
    });
    
    // Game screen buttons
    document.getElementById('pause-btn').addEventListener('click', function() {
        document.getElementById('pause-menu').classList.remove('hidden');
        gameState.gameRunning = false;
    });
    
    document.getElementById('resume-btn').addEventListener('click', function() {
        document.getElementById('pause-menu').classList.add('hidden');
        gameState.gameRunning = true;
        requestAnimationFrame(gameLoop);
    });
    
    document.getElementById('main-menu-btn').addEventListener('click', function() {
        switchScreen('start');
        gameState.gameStarted = false;
    });
    
    document.getElementById('quit-btn').addEventListener('click', function() {
        gameOver();
    });
    
    document.getElementById('inventory-btn').addEventListener('click', function() {
        document.getElementById('inventory-screen').classList.remove('hidden');
    });
    
    document.getElementById('close-inventory').addEventListener('click', function() {
        document.getElementById('inventory-screen').classList.add('hidden');
    });
    
    // Game over screen buttons
    document.getElementById('retry-btn').addEventListener('click', function() {
        gameState.gameStarted = false;
        switchScreen('game');
    });
    
    document.getElementById('new-character-btn').addEventListener('click', function() {
        gameState.gameStarted = false;
        switchScreen('start');
    });
    
    document.getElementById('main-menu-gameover-btn').addEventListener('click', function() {
        gameState.gameStarted = false;
        switchScreen('start');
    });
    
    // Keyboard controls
    document.addEventListener('keydown', function(e) {
        if (!gameState.player || !gameState.gameRunning) return;
        
        const key = e.key.toLowerCase();
        
        // Movement
        if (key === 'w' || key === 'arrowup') gameState.player.keys.up = true;
        if (key === 's' || key === 'arrowdown') gameState.player.keys.down = true;
        if (key === 'a' || key === 'arrowleft') gameState.player.keys.left = true;
        if (key === 'd' || key === 'arrowright') gameState.player.keys.right = true;
        if (key === ' ') gameState.player.keys.jump = true;
        
        // Actions
        if (key === 'q') gameState.player.keys.charge = true;
        if (key === 'e') gameState.player.keys.attack = true;
        if (key === 'r') gameState.player.keys.special = true;
        if (key === 'f') gameState.player.keys.transform = true;
        
        // Toggle minimap
        if (key === 'm') {
            const minimap = document.getElementById('minimap');
            minimap.style.display = minimap.style.display === 'none' ? 'block' : 'none';
        }
        
        // Pause menu
        if (key === 'escape') {
            const pauseMenu = document.getElementById('pause-menu');
            if (pauseMenu.classList.contains('hidden')) {
                pauseMenu.classList.remove('hidden');
                gameState.gameRunning = false;
            } else {
                pauseMenu.classList.add('hidden');
                gameState.gameRunning = true;
                requestAnimationFrame(gameLoop);
            }
        }
    });
    
    document.addEventListener('keyup', function(e) {
        if (!gameState.player) return;
        
        const key = e.key.toLowerCase();
        
        // Movement
        if (key === 'w' || key === 'arrowup') gameState.player.keys.up = false;
        if (key === 's' || key === 'arrowdown') gameState.player.keys.down = false;
        if (key === 'a' || key === 'arrowleft') gameState.player.keys.left = false;
        if (key === 'd' || key === 'arrowright') gameState.player.keys.right = false;
        if (key === ' ') gameState.player.keys.jump = false;
        
        // Actions
        if (key === 'q') gameState.player.keys.charge = false;
    });
});

function updateTechniqueSelection(race) {
    const container = document.getElementById('technique-selection');
    container.innerHTML = '';
    
    const techniques = techniquesByRace[race] || techniquesByRace.saiyan;
    
    techniques.forEach(tech => {
        const option = document.createElement('div');
        option.className = 'technique-option';
        option.dataset.technique = tech.name;
        option.innerHTML = `
            <div class="technique-name">${tech.name}</div>
            <div class="technique-desc">${tech.description}</div>
            <div class="technique-stats">Power: ${tech.power} | Ki Cost: ${tech.kiCost}</div>
        `;
        
        option.addEventListener('click', function() {
            // Remove selected class from all options
            document.querySelectorAll('.technique-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            // Add selected class to clicked option
            this.classList.add('selected');
        });
        
        container.appendChild(option);
    });
    
    // Select first technique by default
    container.firstChild?.classList.add('selected');
}

function updatePreviewStats(race) {
    const raceData = races[race];
    document.getElementById('preview-power').textContent = raceData.basePower.toLocaleString();
    document.getElementById('preview-health').textContent = raceData.baseHealth;
    document.getElementById('preview-ki').textContent = raceData.baseKi;
    document.getElementById('preview-speed').textContent = raceData.baseSpeed;
}

// Initialize with start screen
switchScreen('start');
