/* style.css */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    user-select: none;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #0a0a2a, #1a1a40);
    color: white;
    height: 100vh;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
}

#game-container {
    width: 100%;
    max-width: 1000px;
    height: 90vh;
    position: relative;
    background: rgba(0, 0, 30, 0.9);
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 0 50px rgba(0, 150, 255, 0.5);
    border: 3px solid #00a8ff;
}

.screen {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.hidden {
    display: none !important;
}

/* Start Screen */
.title-container {
    text-align: center;
    margin-bottom: 30px;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

.game-title {
    font-size: 3.5em;
    color: #ffcc00;
    text-shadow: 0 0 20px #ff9900, 0 0 40px #ff5500;
    letter-spacing: 5px;
    margin-bottom: 5px;
    font-weight: 900;
}

.game-subtitle {
    font-size: 1.5em;
    color: #00ccff;
    text-shadow: 0 0 10px #0088cc;
    margin-bottom: 20px;
    font-weight: 300;
}

.logo {
    margin: 20px 0;
}

.db-logo {
    font-size: 4em;
    color: #ff3333;
    text-shadow: 0 0 15px #ff0000;
    animation: spin 10s linear infinite;
}

@keyframes spin {
    100% { transform: rotate(360deg); }
}

/* Character Creation */
#character-creation {
    width: 90%;
    max-width: 800px;
    background: rgba(0, 20, 40, 0.8);
    padding: 25px;
    border-radius: 15px;
    border: 2px solid #00a8ff;
}

.input-group {
    margin-bottom: 30px;
    text-align: center;
}

#player-name {
    width: 100%;
    max-width: 400px;
    padding: 15px;
    font-size: 1.2em;
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid #00ccff;
    border-radius: 10px;
    color: white;
    text-align: center;
    margin-bottom: 5px;
}

#player-name:focus {
    outline: none;
    box-shadow: 0 0 15px #00ccff;
}

.input-hint {
    font-size: 0.9em;
    color: #88ccff;
    margin-top: 5px;
}

.class-selection {
    margin-bottom: 30px;
}

.class-selection h3 {
    text-align: center;
    margin-bottom: 20px;
    color: #ffcc00;
    font-size: 1.5em;
}

.class-options {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
}

.class-option {
    flex: 1;
    min-width: 200px;
    max-width: 250px;
    background: rgba(30, 30, 60, 0.8);
    border: 2px solid #444488;
    border-radius: 10px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.3s;
    text-align: center;
}

.class-option:hover {
    transform: translateY(-5px);
    border-color: #00ccff;
    box-shadow: 0 5px 15px rgba(0, 200, 255, 0.3);
}

.class-option.selected {
    border-color: #ffcc00;
    background: rgba(50, 50, 30, 0.8);
    box-shadow: 0 0 20px rgba(255, 204, 0, 0.5);
}

.class-icon {
    font-size: 2.5em;
    color: #00ccff;
    margin-bottom: 10px;
}

.class-option h4 {
    color: #ffcc00;
    margin-bottom: 10px;
    font-size: 1.2em;
}

.class-option p {
    color: #aaccff;
    font-size: 0.9em;
    margin-bottom: 15px;
    min-height: 40px;
}

.stats {
    display: flex;
    flex-direction: column;
    gap: 5px;
    font-size: 0.8em;
    color: #88ff88;
}

.btn-start {
    display: block;
    margin: 20px auto;
    padding: 15px 40px;
    font-size: 1.2em;
    background: linear-gradient(135deg, #ff3300, #ff9900);
    color: white;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s;
    font-weight: bold;
    letter-spacing: 1px;
}

.btn-start:hover {
    transform: scale(1.05);
    box-shadow: 0 0 25px rgba(255, 102, 0, 0.7);
}

.controls-info {
    margin-top: 20px;
    text-align: center;
    font-size: 0.9em;
    color: #88ccff;
    background: rgba(0, 20, 40, 0.5);
    padding: 15px;
    border-radius: 10px;
    width: 90%;
    max-width: 800px;
}

/* Game Screen */
.canvas-container {
    position: relative;
    width: 100%;
    height: calc(100% - 150px);
}

#game-canvas {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #1a2a3a, #0a1a2a);
    border-radius: 10px;
    border: 2px solid #00a8ff;
}

/* Mobile Controls */
#mobile-controls {
    position: absolute;
    bottom: 20px;
    left: 20px;
    right: 20px;
    display: none;
    justify-content: space-between;
    align-items: flex-end;
}

.d-pad {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 5px;
    width: 150px;
    height: 150px;
}

.d-pad div {
    background: rgba(255, 255, 255, 0.2);
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5em;
    color: white;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
}

.d-pad-top { grid-column: 2; grid-row: 1; }
.d-pad-left { grid-column: 1; grid-row: 2; }
.d-pad-center { grid-column: 2; grid-row: 2; background: transparent !important; border: none !important; }
.d-pad-right { grid-column: 3; grid-row: 2; }
.d-pad-bottom { grid-column: 2; grid-row: 3; }

.action-buttons {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.action-btn {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background: rgba(255, 100, 0, 0.8);
    border: 3px solid rgba(255, 200, 0, 0.9);
    color: white;
    font-size: 1.8em;
    cursor: pointer;
    transition: all 0.2s;
}

.action-btn:active {
    transform: scale(0.9);
    background: rgba(255, 150, 0, 0.9);
}

/* HUD */
#hud {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    pointer-events: none;
}

.hud-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(0, 0, 0, 0.7);
    padding: 10px 15px;
    border-radius: 10px;
    border: 2px solid #00a8ff;
}

.player-info {
    display: flex;
    flex-direction: column;
}

.player-name-display {
    font-size: 1.3em;
    font-weight: bold;
    color: #ffcc00;
}

.player-class-display {
    font-size: 0.9em;
    color: #00ccff;
}

.power-level {
    text-align: right;
}

.power-label {
    color: #ff6666;
    font-size: 0.9em;
}

.power-value {
    font-size: 1.4em;
    color: #ffcc00;
    font-weight: bold;
    text-shadow: 0 0 10px #ff9900;
}

.hud-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
}

.health-bar-container, .ki-bar-container {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(0, 0, 0, 0.7);
    padding: 8px 15px;
    border-radius: 10px;
    border: 2px solid #ff3333;
}

.ki-bar-container {
    border-color: #00ccff;
}

.bar-label {
    font-weight: bold;
    color: white;
    min-width: 30px;
}

.health-bar, .ki-bar {
    flex: 1;
    height: 20px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    overflow: hidden;
}

.health-fill {
    height: 100%;
    width: 100%;
    background: linear-gradient(90deg, #ff0000, #ff9900);
    border-radius: 10px;
    transition: width 0.3s;
}

.ki-fill {
    height: 100%;
    width: 100%;
    background: linear-gradient(90deg, #0066ff, #00ccff);
    border-radius: 10px;
    transition: width 0.3s;
}

.health-text, .ki-text {
    min-width: 70px;
    text-align: right;
    font-weight: bold;
}

.health-text {
    color: #ff9999;
}

.ki-text {
    color: #88ccff;
}

.hud-right {
    display: flex;
    align-items: center;
    gap: 15px;
}

.dragon-balls {
    background: rgba(0, 0, 0, 0.7);
    padding: 8px 15px;
    border-radius: 10px;
    border: 2px solid #ffcc00;
}

.db-hint {
    font-size: 0.9em;
    color: #ffcc00;
    margin-bottom: 5px;
}

.db-icons {
    display: flex;
    gap: 5px;
}

.db-icon {
    width: 20px;
    height: 20px;
    background: rgba(255, 255, 0, 0.3);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.8em;
}

.hud-btn {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: rgba(0, 100, 200, 0.8);
    border: 2px solid #00a8ff;
    color: white;
    font-size: 1.2em;
    cursor: pointer;
    pointer-events: auto;
    transition: all 0.3s;
}

.hud-btn:hover {
    background: rgba(0, 150, 255, 0.9);
    transform: scale(1.1);
}

/* Combat Log */
#combat-log {
    position: absolute;
    bottom: 10px;
    right: 10px;
    width: 300px;
    height: 150px;
    background: rgba(0, 0, 0, 0.85);
    border-radius: 10px;
    border: 2px solid #ff9900;
    overflow: hidden;
    pointer-events: none;
}

.log-header {
    background: rgba(255, 102, 0, 0.9);
    color: white;
    padding: 5px 10px;
    font-weight: bold;
    text-align: center;
}

.log-content {
    height: calc(100% - 30px);
    padding: 10px;
    overflow-y: auto;
    font-size: 0.85em;
    color: #ccccff;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.log-content div {
    animation: fadeIn 0.5s;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Menu Screens */
.menu-container {
    background: linear-gradient(135deg, #0a1a2a, #1a2a4a);
    padding: 30px;
    border-radius: 15px;
    border: 3px solid #00a8ff;
    max-width: 600px;
    width: 90%;
    text-align: center;
    box-shadow: 0 0 40px rgba(0, 100, 255, 0.5);
}

.menu-container h2 {
    color: #ffcc00;
    margin-bottom: 25px;
    font-size: 2.2em;
    text-shadow: 0 0 10px rgba(255, 204, 0, 0.5);
}

.menu-player-info {
    background: rgba(0, 30, 60, 0.7);
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 25px;
    text-align: left;
    display: inline-block;
}

.menu-player-info div {
    margin-bottom: 8px;
    font-size: 1.1em;
}

.menu-options {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 25px;
}

.menu-btn {
    padding: 15px 25px;
    background: linear-gradient(135deg, #0066cc, #00a8ff);
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 1.1em;
    cursor: pointer;
    transition: all 0.3s;
    text-align: left;
    display: flex;
    align-items: center;
    gap: 15px;
}

.menu-btn:hover {
    transform: translateX(10px);
    background: linear-gradient(135deg, #0088ff, #00ccff);
    box-shadow: 0 5px 15px rgba(0, 200, 255, 0.4);
}

.menu-btn i {
    width: 25px;
    text-align: center;
}

.exit-btn {
    background: linear-gradient(135deg, #cc3300, #ff6600) !important;
}

.exit-btn:hover {
    background: linear-gradient(135deg, #ff5500, #ff8800) !important;
}

.back-btn {
    background: linear-gradient(135deg, #666666, #999999) !important;
}

.controls-list {
    background: rgba(0, 30, 60, 0.7);
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 25px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.control-item {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 5px;
}

.control-key {
    color: #ffcc00;
    font-weight: bold;
    font-family: monospace;
    background: rgba(0, 0, 0, 0.5);
    padding: 5px 10px;
    border-radius: 5px;
}

.control-desc {
    color: #ccccff;
}

.about-content {
    background: rgba(0, 30, 60, 0.7);
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 25px;
    text-align: left;
}

.about-content h3 {
    color: #ffcc00;
    margin-bottom: 15px;
    text-align: center;
}

.about-content p {
    margin-bottom: 15px;
    line-height: 1.5;
}

.about-content ul {
    margin-left: 20px;
    margin-bottom: 15px;
}

.about-content li {
    margin-bottom: 8px;
    color: #88ccff;
}

.github-note {
    background: rgba(255, 255, 255, 0.1);
    padding: 15px;
    border-radius: 10px;
    text-align: center;
    font-weight: bold;
    color: #ffcc00;
    border: 2px solid #ffcc00;
}

/* Responsive Design */
@media (max-width: 768px) {
    #game-container {
        height: 100vh;
        border-radius: 0;
        border: none;
    }
    
    .game-title {
        font-size: 2.5em;
    }
    
    .class-options {
        flex-direction: column;
        align-items: center;
    }
    
    .class-option {
        max-width: 300px;
        min-width: 250px;
    }
    
    #mobile-controls {
        display: flex;
    }
    
    #combat-log {
        width: 200px;
        height: 120px;
        font-size: 0.8em;
    }
    
    .hud-bottom {
        flex-wrap: wrap;
    }
    
    .dragon-balls {
        order: -1;
        width: 100%;
        margin-bottom: 10px;
    }
    
    .hud-right {
        width: 100%;
        justify-content: space-between;
    }
}

@media (max-width: 480px) {
    .game-title {
        font-size: 2em;
    }
    
    .class-option {
        min-width: 200px;
        padding: 15px;
    }
    
    .d-pad {
        width: 120px;
        height: 120px;
    }
    
    .action-btn {
        width: 60px;
        height: 60px;
    }
    
    #combat-log {
        display: none;
    }
}
