// Game State Management
const gameState = {
    currentScreen: 'start',
    gameRunning: false,
    gameTime: 0,
    gameTimeSeconds: 0,
    player: null,
    world: null,
    enemies: [],
    items: [],
    particles: [],
    beams: [],
    explosions: [],
    currentEnemy: null,
    inBattle: false,
    gameStarted: false,
    isMobile: false,
    isPortrait: false,
    settings: {
        volume: 70,
        graphics: 'medium',
        controlScheme: 'auto',
        autoTarget: true,
        particles: true
    },
    infiniteMode: true,
    waveNumber: 1,
    difficulty: 1.0,
    totalEnemiesSpawned: 0
};

// DOM Elements
const screens = {
    start: document.getElementById('start-screen'),
    howToPlay: document.getElementById('how-to-play-screen'),
    game: document.getElementById('game-screen'),
    gameOver: document.getElementById('game-over-screen'),
    loading: document.getElementById('loading-screen')
};

// Device Detection
function detectDevice() {
    gameState.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    gameState.isPortrait = window.innerHeight > window.innerWidth;
    
    // Set control scheme based on device
    if (gameState.isMobile) {
        gameState.settings.controlScheme = 'mobile';
        document.body.classList.add('mobile-device');
    } else {
        gameState.settings.controlScheme = 'desktop';
        document.body.classList.add('desktop-device');
    }
}

// Initialize Game
function initGame() {
    detectDevice();
    setupEventListeners();
    setupMobileControls();
    updatePreviewStats('saiyan');
    
    // Show start screen
    switchScreen('start');
    
    // Check orientation
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    
    // Start game loop for animations
    requestAnimationFrame(animationLoop);
}

// Setup Event Listeners
function setupEventListeners() {
    // Race selection
    const raceOptions = document.querySelectorAll('.race-option');
    raceOptions.forEach(option => {
        option.addEventListener('click', function() {
            raceOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            const race = this.dataset.race;
            updateTechniqueSelection(race);
            updatePreviewStats(race);
            updatePlayerAvatar(race);
        });
    });
    
    // Start game
    document.getElementById('start-game-btn').addEventListener('click', startGame);
    
    // How to play
    document.getElementById('how-to-play-btn').addEventListener('click', () => switchScreen('howToPlay'));
    document.getElementById('back-to-start-btn').addEventListener('click', () => switchScreen('start'));
    
    // Game controls
    document.getElementById('pause-btn').addEventListener('click', pauseGame);
    document.getElementById('resume-btn').addEventListener('click', resumeGame);
    document.getElementById('settings-menu-btn').addEventListener('click', () => switchScreen('settings'));
    document.getElementById('close-settings').addEventListener('click', () => document.getElementById('settings-menu').classList.add('hidden'));
    document.getElementById('save-settings').addEventListener('click', saveSettings);
    document.getElementById('main-menu-btn').addEventListener('click', () => {
        gameState.gameRunning = false;
        gameState.gameStarted = false;
        switchScreen('start');
    });
    
    // Game over
    document.getElementById('retry-btn').addEventListener('click', restartGame);
    document.getElementById('new-character-btn').addEventListener('click', () => {
        gameState.gameStarted = false;
        switchScreen('start');
    });
    document.getElementById('main-menu-gameover-btn').addEventListener('click', () => {
        gameState.gameStarted = false;
        switchScreen('start');
    });
    
    // Keyboard controls
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // Prevent context menu on right click
    document.addEventListener('contextmenu', e => e.preventDefault());
}

// Mobile Controls Setup
function setupMobileControls() {
    if (!gameState.isMobile) return;
    
    const joystickBase = document.getElementById('joystick-base');
    const joystickHandle = document.getElementById('joystick-handle');
    let isJoystickActive = false;
    
    // Touch events for joystick
    joystickBase.addEventListener('touchstart', startJoystick);
    joystickBase.addEventListener('touchmove', moveJoystick);
    joystickBase.addEventListener('touchend', endJoystick);
    
    // Action buttons
    document.getElementById('mobile-charge').addEventListener('touchstart', () => gameState.player.keys.charge = true);
    document.getElementById('mobile-charge').addEventListener('touchend', () => gameState.player.keys.charge = false);
    
    document.getElementById('mobile-attack').addEventListener('touchstart', () => gameState.player.keys.attack = true);
    document.getElementById('mobile-attack').addEventListener('touchend', () => gameState.player.keys.attack = false);
    
    document.getElementById('mobile-special').addEventListener('touchstart', () => gameState.player.keys.special = true);
    document.getElementById('mobile-special').addEventListener('touchend', () => gameState.player.keys.special = false);
    
    document.getElementById('mobile-transform').addEventListener('touchstart', () => gameState.player.keys.transform = true);
    document.getElementById('mobile-transform').addEventListener('touchend', () => gameState.player.keys.transform = false);
    
    document.getElementById('mobile-jump').addEventListener('touchstart', () => gameState.player.keys.jump = true);
    document.getElementById('mobile-jump').addEventListener('touchend', () => gameState.player.keys.jump = false);
    
    // Quick menu
    document.getElementById('mobile-pause').addEventListener('click', pauseGame);
    
    function startJoystick(e) {
        e.preventDefault();
        isJoystickActive = true;
        updateJoystick(e);
    }
    
    function moveJoystick(e) {
        if (!isJoystickActive) return;
        e.preventDefault();
        updateJoystick(e);
    }
    
    function endJoystick() {
        isJoystickActive = false;
        joystickHandle.style.transform = 'translate(0, 0)';
        gameState.player.keys.up = false;
        gameState.player.keys.down = false;
        gameState.player.keys.left = false;
        gameState.player.keys.right = false;
    }
    
    function updateJoystick(e) {
        const touch = e.touches[0];
        const rect = joystickBase.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = touch.clientX - centerX;
        const deltaY = touch.clientY - centerY;
        
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDistance = rect.width / 2 - joystickHandle.offsetWidth / 2;
        
        const angle = Math.atan2(deltaY, deltaX);
        const limitedDistance = Math.min(distance, maxDistance);
        
        const moveX = Math.cos(angle) * limitedDistance;
        const moveY = Math.sin(angle) * limitedDistance;
        
        joystickHandle.style.transform = `translate(${moveX}px, ${moveY}px)`;
        
        // Update movement keys
        const deadzone = 20;
        gameState.player.keys.up = deltaY < -deadzone;
        gameState.player.keys.down = deltaY > deadzone;
        gameState.player.keys.left = deltaX < -deadzone;
        gameState.player.keys.right = deltaX > deadzone;
    }
}

// Start Game
function startGame() {
    showLoadingScreen();
    
    setTimeout(() => {
        const playerName = document.getElementById('player-name').value.trim() || 'WARRIOR';
        const selectedRace = document.querySelector('.race-option.active')?.dataset.race || 'saiyan';
        const selectedTechnique = document.querySelector('.technique-option.active')?.dataset.technique || 'Kamehameha';
        
        // Create player
        gameState.player = new Player(playerName, selectedRace, selectedTechnique);
        gameState.world = new World();
        
        // Initialize game state
        gameState.gameRunning = true;
        gameState.gameStarted = true;
        gameState.gameTime = 0;
        gameState.gameTimeSeconds = 0;
        gameState.waveNumber = 1;
        gameState.difficulty = 1.0;
        gameState.totalEnemiesSpawned = 0;
        
        // Update UI
        updateUI();
        updateDragonBalls();
        updatePlayerAvatar(selectedRace);
        
        // Hide loading screen
        hideLoadingScreen();
        
        // Switch to game screen
        switchScreen('game');
        
        // Start game loop
        requestAnimationFrame(gameLoop);
        
        // Add welcome message
        addMessage(`Welcome, ${gameState.player.name}! Your journey begins...`);
        addMessage(`Power Level: ${gameState.player.powerLevel.toLocaleString()}`);
        addMessage(`Race: ${races[selectedRace].name}`);
        addMessage(`Technique: ${selectedTechnique}`);
    }, 1500);
}

// Game Loop
function gameLoop(timestamp) {
    if (!gameState.gameRunning) return;
    
    gameState.gameTime++;
    if (gameState.gameTime % 60 === 0) {
        gameState.gameTimeSeconds++;
        updateGameTime();
    }
    
    // Update difficulty based on time
    if (gameState.gameTime % 1800 === 0) { // Every 30 seconds
        gameState.waveNumber++;
        gameState.difficulty = 1 + (gameState.waveNumber * 0.1);
        addMessage(`Wave ${gameState.waveNumber}! Difficulty increased!`);
    }
    
    // Spawn enemies infinitely
    if (gameState.enemies.length < 10 + gameState.waveNumber && Math.random() < 0.02) {
        spawnEnemy();
    }
    
    // Update game objects
    updateGame();
    
    // Draw everything
    drawGame();
    
    // Continue loop
    requestAnimationFrame(gameLoop);
}

// Animation Loop (for menus)
function animationLoop() {
    // Update loading screen
    updateLoadingScreen();
    
    requestAnimationFrame(animationLoop);
}

// Update Game Objects
function updateGame() {
    if (!gameState.player || !gameState.world) return;
    
    // Update player
    gameState.player.update();
    
    // Update enemies
    gameState.enemies.forEach(enemy => {
        enemy.update();
        
        // Check for enemy attacks
        if (gameState.inBattle && enemy === gameState.currentEnemy) {
            enemy.attack();
        }
    });
    
    // Update beams
    updateBeams();
    
    // Update particles
    updateParticles();
    
    // Update explosions
    updateExplosions();
    
    // Check collisions
    checkCollisions();
    
    // Update UI
    updateUI();
    
    // Check for game over
    if (gameState.player.health <= 0) {
        gameOver();
    }
}

// Draw Game
function drawGame() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw world
    gameState.world.draw();
    
    // Draw player
    gameState.player.draw();
    
    // Draw enemies
    gameState.enemies.forEach(enemy => enemy.draw());
    
    // Draw beams
    drawBeams();
    
    // Draw particles
    drawParticles();
    
    // Draw explosions
    drawExplosions();
    
    // Draw minimap
    if (gameState.world) {
        gameState.world.drawMinimap();
    }
}

// Spawn Enemy (Endless Mode)
function spawnEnemy() {
    const canvas = document.getElementById('gameCanvas');
    const enemyTypes = [
        'Saibaman', 'Red Ribbon Soldier', 'Frieza Soldier', 
        'Cell Jr.', 'Majin Minion', 'Android 19'
    ];
    
    // Increase enemy power based on wave and player level
    const basePower = 500 * gameState.difficulty;
    const powerVariance = 200 * gameState.difficulty;
    
    const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    const x = Math.random() < 0.5 ? -50 : canvas.width + 50;
    const y = Math.random() * canvas.height;
    
    const enemy = new Enemy(enemyType, x, y);
    
    // Scale enemy stats
    enemy.power = Math.floor(basePower + Math.random() * powerVariance);
    enemy.maxHealth = Math.floor(enemy.maxHealth * gameState.difficulty);
    enemy.health = enemy.maxHealth;
    enemy.exp = Math.floor(enemy.exp * gameState.difficulty);
    
    gameState.enemies.push(enemy);
    gameState.totalEnemiesSpawned++;
}

// Update UI
function updateUI() {
    if (!gameState.player) return;
    
    const player = gameState.player;
    
    // Update health
    const healthPercent = (player.health / player.maxHealth) * 100;
    document.getElementById('health-bar').style.width = `${healthPercent}%`;
    document.getElementById('health-value').textContent = `${Math.floor(player.health)}/${player.maxHealth}`;
    
    // Update ki
    const kiPercent = (player.ki / player.maxKi) * 100;
    document.getElementById('ki-bar').style.width = `${kiPercent}%`;
    document.getElementById('ki-value').textContent = `${Math.floor(player.ki)}/${player.maxKi}`;
    
    // Update power level
    const powerPercent = Math.min(100, player.powerLevel / 1000000 * 100);
    document.getElementById('power-bar').style.width = `${powerPercent}%`;
    document.getElementById('power-level').textContent = player.powerLevel.toLocaleString();
    
    // Update experience
    const expPercent = (player.exp / player.expToNextLevel) * 100;
    document.getElementById('exp-bar').style.width = `${expPercent}%`;
    document.getElementById('exp-value').textContent = `${player.exp}/${player.expToNextLevel}`;
    
    // Update level
    document.getElementById('player-level').textContent = player.level;
    document.getElementById('player-name-display').textContent = player.name;
    document.getElementById('player-race-display').textContent = races[player.race].name.toUpperCase();
    
    // Update quest
    if (player.currentQuest) {
        document.getElementById('current-quest').textContent = player.currentQuest.description;
        document.getElementById('quest-progress').textContent = `${player.questProgress}/${player.currentQuest.count}`;
        const questPercent = (player.questProgress / player.currentQuest.count) * 100;
        document.getElementById('quest-bar').style.width = `${questPercent}%`;
    }
    
    // Update statistics
    document.getElementById('enemies-defeated').textContent = player.enemiesDefeated;
    document.getElementById('quests-done').textContent = player.questsCompleted;
    document.getElementById('damage-dealt').textContent = Math.floor(player.totalDamageDealt);
    
    // Mobile UI updates
    if (gameState.isMobile) {
        document.getElementById('mobile-health-bar').style.width = `${healthPercent}%`;
        document.getElementById('mobile-health-value').textContent = Math.floor(player.health);
        document.getElementById('mobile-ki-bar').style.width = `${kiPercent}%`;
        document.getElementById('mobile-ki-value').textContent = Math.floor(player.ki);
        document.getElementById('mobile-level').textContent = player.level;
        document.getElementById('mobile-name-display').textContent = player.name;
        document.getElementById('mobile-race-display').textContent = races[player.race].name.toUpperCase();
    }
}

// Update Game Time
function updateGameTime() {
    const minutes = Math.floor(gameState.gameTimeSeconds / 60);
    const seconds = gameState.gameTimeSeconds % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    document.getElementById('game-time').textContent = timeString;
    document.getElementById('time-played').textContent = timeString;
    
    if (gameState.isMobile) {
        document.getElementById('mobile-time').textContent = timeString;
    }
}

// Add Message to Log
function addMessage(text) {
    const log = document.querySelector('.log-content');
    const message = document.createElement('div');
    message.className = 'log-message';
    message.textContent = `[${getCurrentTime()}] ${text}`;
    
    log.appendChild(message);
    log.scrollTop = log.scrollHeight;
    
    // Limit messages
    if (log.children.length > 20) {
        log.removeChild(log.firstChild);
    }
}

function getCurrentTime() {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
}

// Switch Screen
function switchScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.add('hidden'));
    screens[screenName].classList.remove('hidden');
    gameState.currentScreen = screenName;
}

// Loading Screen
function showLoadingScreen() {
    switchScreen('loading');
    document.getElementById('loading-progress').style.width = '0%';
}

function hideLoadingScreen() {
    screens.loading.classList.add('hidden');
}

function updateLoadingScreen() {
    if (gameState.currentScreen !== 'loading') return;
    
    const progressBar = document.getElementById('loading-progress');
    const currentWidth = parseInt(progressBar.style.width) || 0;
    
    if (currentWidth < 100) {
        progressBar.style.width = `${currentWidth + 1}%`;
    }
}

// Pause/Resume Game
function pauseGame() {
    gameState.gameRunning = false;
    document.getElementById('pause-menu').classList.remove('hidden');
    
    // Update pause menu stats
    document.getElementById('pause-power').textContent = gameState.player?.powerLevel.toLocaleString() || '0';
    document.getElementById('pause-time').textContent = document.getElementById('time-played').textContent;
    document.getElementById('pause-enemies').textContent = gameState.player?.enemiesDefeated || '0';
    document.getElementById('pause-dragonballs').textContent = `${gameState.player?.dragonBalls || 0}/7`;
}

function resumeGame() {
    document.getElementById('pause-menu').classList.add('hidden');
    gameState.gameRunning = true;
    requestAnimationFrame(gameLoop);
}

// Game Over
function gameOver() {
    gameState.gameRunning = false;
    
    // Update final stats
    if (gameState.player) {
        document.getElementById('final-power').textContent = gameState.player.powerLevel.toLocaleString();
        document.getElementById('final-enemies').textContent = gameState.player.enemiesDefeated;
        document.getElementById('final-quests').textContent = gameState.player.questsCompleted;
        document.getElementById('final-time').textContent = document.getElementById('time-played').textContent;
    }
    
    switchScreen('gameOver');
}

// Restart Game
function restartGame() {
    gameState.gameStarted = false;
    startGame();
}

// Settings
function saveSettings() {
    gameState.settings.volume = document.getElementById('volume-slider').value;
    gameState.settings.graphics = document.getElementById('graphics-quality').value;
    gameState.settings.controlScheme = document.getElementById('control-scheme').value;
    gameState.settings.autoTarget = document.getElementById('auto-target').checked;
    gameState.settings.particles = document.getElementById('particles-enabled').checked;
    
    // Apply settings
    if (gameState.isMobile && gameState.settings.controlScheme === 'desktop') {
        alert('Desktop controls are not recommended for mobile devices.');
    }
    
    document.getElementById('settings-menu').classList.add('hidden');
}

// Orientation Check
function checkOrientation() {
    gameState.isPortrait = window.innerHeight > window.innerWidth;
    
    if (gameState.isMobile && gameState.isPortrait) {
        showOrientationWarning();
    } else {
        hideOrientationWarning();
    }
}

function showOrientationWarning() {
    let warning = document.querySelector('.orientation-warning');
    if (!warning) {
        warning = document.createElement('div');
        warning.className = 'orientation-warning';
        warning.innerHTML = `
            <div>
                <i class="fas fa-sync-alt"></i>
                <h2>PLEASE ROTATE YOUR DEVICE</h2>
                <p>This game is best experienced in landscape mode.</p>
                <p>Please rotate your device to continue.</p>
            </div>
        `;
        document.body.appendChild(warning);
    }
    warning.style.display = 'flex';
}

function hideOrientationWarning() {
    const warning = document.querySelector('.orientation-warning');
    if (warning) {
        warning.style.display = 'none';
    }
}

// Update Preview Stats
function updatePreviewStats(race) {
    const raceData = races[race];
    document.getElementById('preview-power').textContent = raceData.basePower.toLocaleString();
    document.getElementById('preview-health').textContent = raceData.baseHealth;
    document.getElementById('preview-ki').textContent = raceData.baseKi;
    document.getElementById('preview-speed').textContent = raceData.baseSpeed;
}

// Update Technique Selection
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
            document.querySelectorAll('.technique-option').forEach(opt => {
                opt.classList.remove('active');
            });
            this.classList.add('active');
        });
        
        container.appendChild(option);
    });
    
    // Select first technique by default
    container.firstChild?.classList.add('active');
}

// Update Player Avatar
function updatePlayerAvatar(race) {
    const iconMap = {
        saiyan: 'fas fa-fire',
        human: 'fas fa-user',
        namekian: 'fas fa-leaf',
        android: 'fas fa-robot',
        frieza: 'fas fa-skull-crossbones'
    };
    
    const icon = iconMap[race] || 'fas fa-user';
    document.getElementById('player-avatar-icon').className = icon;
    
    // Update avatar glow color
    const colorMap = {
        saiyan: '#ff3300',
        human: '#00ccff',
        namekian: '#00cc66',
        android: '#cccccc',
        frieza: '#9900ff'
    };
    
    const avatarGlow = document.getElementById('avatar-glow');
    avatarGlow.style.background = `radial-gradient(circle, ${colorMap[race]}30 0%, transparent 70%)`;
}

// Keyboard Controls
function handleKeyDown(e) {
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
        if (document.getElementById('pause-menu').classList.contains('hidden')) {
            pauseGame();
        } else {
            resumeGame();
        }
    }
}

function handleKeyUp(e) {
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
}

// Update Dragon Balls Display
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

// ===== GAME OBJECT CLASSES =====
// (Keep all the Player, Enemy, World classes from the previous implementation)
// (These would be the same as in the previous game.js, just without the name examples code)

// Initialize the game when the page loads
window.addEventListener('load', initGame);
window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', checkOrientation);

// Prevent scrolling on mobile
document.addEventListener('touchmove', function(e) {
    if (gameState.currentScreen === 'game') {
        e.preventDefault();
    }
}, { passive: false });

// The rest of the game classes (Player, Enemy, World, etc.) would be included here
// They remain exactly the same as in the previous implementation
