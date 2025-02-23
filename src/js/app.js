// Game Configuration
const LEVEL_CONFIG = {
    getLevelGoal: (level) => Math.min(10 + Math.floor(level * 1.5), 30),
    getTimeLimit: (level) => Math.max(30 - Math.floor(level * 0.5), 15),
    getBallSpeed: (level) => Math.min(3 + level * 0.8, 12),
    getBallCount: (level) => Math.min(3 + Math.floor(level / 2), 8),
    getDangerBallInterval: (level) => Math.max(5000 - (level * 300), 2000)
};

// Game State Management
const gameState = {
    level: 1,
    score: 0,
    timeLeft: 30,
    isPlaying: false,
    balls: [],
    gameInterval: null,
    dangerInterval: null,
    highScores: {},
    unlockedLevels: 1,
    maxLevels: 30,
    currentGoal: 10,
    goalProgress: 0,
    globalStats: {
        totalScore: 0,
        totalBallsClicked: 0,
        totalTimePlayed: 0
    }
};

// Sound Effects
const sounds = {
    pop: new Audio('data:audio/wav;base64,UklGRn4AAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YVoAAAAAAA=='),
    bonus: new Audio('data:audio/wav;base64,UklGRn4AAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YVoAAAAAAA=='),
    penalty: new Audio('data:audio/wav;base64,UklGRn4AAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YVoAAAAAAA=='),
    gameOver: new Audio('data:audio/wav;base64,UklGRn4AAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YVoAAAAAAA==')
};

// Screen Management
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Navigation Functions
function showMainMenu() {
    clearInterval(gameState.gameInterval);
    clearInterval(gameState.dangerInterval);
    showScreen('mainMenuScreen');
}

function showLevelSelection() {
    const levelGrid = document.getElementById('levelGrid');
    levelGrid.innerHTML = '';
    
    for (let i = 1; i <= gameState.maxLevels; i++) {
        const button = document.createElement('button');
        button.className = `level-button ${i <= gameState.unlockedLevels ? 'unlocked' : 'locked'}`;
        if (i === gameState.unlockedLevels) button.className += ' current';
        button.textContent = i;
        
        if (i <= gameState.unlockedLevels) {
            button.onclick = () => startGame(i);
        }
        
        levelGrid.appendChild(button);
    }
    
    showScreen('levelSelectionScreen');
}

function showTutorial() {
    showScreen('tutorialScreen');
}

function showHighScores() {
    const container = document.getElementById('highScoresList');
    container.innerHTML = '';
    
    // Level-specific scores
    for (let level = 1; level <= gameState.maxLevels; level++) {
        const scoreItem = document.createElement('div');
        scoreItem.className = 'score-item';
        
        const levelSpan = document.createElement('span');
        levelSpan.className = 'score-item-level';
        levelSpan.textContent = `Level ${level}`;
        
        const scoreSpan = document.createElement('span');
        scoreSpan.className = 'score-item-value';
        
        if (gameState.highScores[level]) {
            scoreSpan.textContent = `${gameState.highScores[level].score} (${gameState.highScores[level].time}s left)`;
        } else {
            scoreSpan.textContent = 'Not played';
        }
        
        scoreItem.appendChild(levelSpan);
        scoreItem.appendChild(scoreSpan);
        container.appendChild(scoreItem);
    }
    
    // Global stats
    const globalStatsItem = document.createElement('div');
    globalStatsItem.className = 'score-item';
    globalStatsItem.innerHTML = `
        <div style="width: 100%; text-align: center; margin: 15px 0;">
            <div>Total Score: ${gameState.globalStats.totalScore}</div>
            <div>Balls Clicked: ${gameState.globalStats.totalBallsClicked}</div>
            <div>Play Time: ${Math.floor(gameState.globalStats.totalTimePlayed / 60)}m ${gameState.globalStats.totalTimePlayed % 60}s</div>
        </div>
    `;
    container.appendChild(globalStatsItem);
    
    showScreen('highScoresScreen');
}

function resetHighScores() {
    if (confirm('Are you sure you want to reset all high scores and statistics?')) {
        gameState.highScores = {};
        gameState.globalStats = {
            totalScore: 0,
            totalBallsClicked: 0,
            totalTimePlayed: 0
        };
        localStorage.removeItem('tapMasterHighScores');
        localStorage.removeItem('tapMasterGlobalStats');
        showHighScores();
    }
}

// Timer Management
function startTimer() {
    if (gameState.gameInterval) {
        clearInterval(gameState.gameInterval);
    }

    const timerDisplay = document.getElementById('timer');
    gameState.gameInterval = setInterval(() => {
        gameState.timeLeft--;
        timerDisplay.textContent = gameState.timeLeft;
        
        if (gameState.timeLeft <= 0) {
            gameOver();
        }
    }, 1000);
}

// Progress Updates
function updateGoalProgress() {
    document.getElementById('goal').textContent = 
        `${gameState.goalProgress}/${gameState.currentGoal}`;
    document.getElementById('goalBar').style.width = 
        `${(gameState.goalProgress / gameState.currentGoal) * 100}%`;
    document.getElementById('score').textContent = gameState.score;
}

// Game Over Management
function gameOver() {
    sounds.gameOver.play();
    clearInterval(gameState.gameInterval);
    clearInterval(gameState.dangerInterval);
    gameState.isPlaying = false;

    document.getElementById('finalScore').textContent = gameState.score;
    showScreen('gameOverScreen');

    // Update global stats
    gameState.globalStats.totalScore += gameState.score;
    gameState.globalStats.totalTimePlayed += LEVEL_CONFIG.getTimeLimit(gameState.level) - gameState.timeLeft;
    localStorage.setItem('tapMasterGlobalStats', JSON.stringify(gameState.globalStats));
}

// Level Management
function retryLevel() {
    startGame(gameState.level);
}

function nextLevel() {
    if (gameState.level < gameState.maxLevels) {
        startGame(gameState.level + 1);
    } else {
        showLevelSelection();
    }
}

// Level Completion
function levelComplete() {
    clearInterval(gameState.gameInterval);
    clearInterval(gameState.dangerInterval);
    gameState.isPlaying = false;
    
    if (gameState.level >= gameState.unlockedLevels) {
        gameState.unlockedLevels = Math.min(gameState.level + 1, gameState.maxLevels);
        localStorage.setItem('tapMasterUnlockedLevels', gameState.unlockedLevels);
    }

    // Update high scores
    const levelTime = LEVEL_CONFIG.getTimeLimit(gameState.level) - gameState.timeLeft;
    if (!gameState.highScores[gameState.level] || 
        gameState.score > gameState.highScores[gameState.level].score ||
        (gameState.score === gameState.highScores[gameState.level].score && 
         levelTime < gameState.highScores[gameState.level].time)) {
        gameState.highScores[gameState.level] = {
            score: gameState.score,
            time: levelTime
        };
        localStorage.setItem('tapMasterHighScores', JSON.stringify(gameState.highScores));
    }
    
    // Update global stats
    gameState.globalStats.totalScore += gameState.score;
    gameState.globalStats.totalTimePlayed += levelTime;
    localStorage.setItem('tapMasterGlobalStats', JSON.stringify(gameState.globalStats));

    document.getElementById('levelScore').textContent = gameState.score;
    document.getElementById('goalReached').textContent = 
        `${gameState.goalProgress}/${gameState.currentGoal}`;
    
    showScreen('levelCompleteScreen');
}

// Game Initialization
function initGame() {
    // Load saved data
    const savedHighScores = localStorage.getItem('tapMasterHighScores');
    const savedUnlockedLevels = localStorage.getItem('tapMasterUnlockedLevels');
    const savedGlobalStats = localStorage.getItem('tapMasterGlobalStats');
    
    if (savedHighScores) gameState.highScores = JSON.parse(savedHighScores);
    if (savedUnlockedLevels) gameState.unlockedLevels = parseInt(savedUnlockedLevels);
    if (savedGlobalStats) gameState.globalStats = JSON.parse(savedGlobalStats);

    // iOS touch handling
    document.addEventListener('touchstart', function(event) {
        if (event.target.classList.contains('ball')) {
            event.preventDefault();
        }
    }, { passive: false });

    document.body.addEventListener('touchmove', function(event) {
        event.preventDefault();
    }, { passive: false });

    showMainMenu();
}

// Ball Creation and Management
function createBall(type = 'normal') {
    if (!gameState.isPlaying) return null;

    const ball = document.createElement('div');
    const playArea = document.getElementById('playArea');
    const rect = playArea.getBoundingClientRect();
    const size = 60;

    ball.className = `ball ${type}`;
    
    switch(type) {
        case 'timeBonus':
            ball.innerHTML = '<span>+5s</span>';
            break;
        case 'timePenalty':
            ball.innerHTML = '<span>-3s</span>';
            break;
        case 'danger':
            ball.innerHTML = '<span>✕</span>';
            break;
        default:
            ball.innerHTML = '<span>+1</span>';
    }

    // Position with padding
    const maxX = rect.width - size;
    const maxY = rect.height - size;
    const padding = 20;

    let x = Math.random() * (maxX - 2 * padding) + padding;
    let y = Math.random() * (maxY - 2 * padding) + padding;

    ball.style.left = `${x}px`;
    ball.style.top = `${y}px`;
    ball.dataset.type = type;

    // Event listeners
    ball.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleBallClick(ball);
    }, { passive: false });
    
    ball.addEventListener('click', () => handleBallClick(ball));
    
    playArea.appendChild(ball);
    gameState.balls.push(ball);

    // Auto-remove danger balls
    if (type === 'danger') {
        setTimeout(() => {
            if (ball?.parentElement) {
                ball.remove();
                gameState.balls = gameState.balls.filter(b => b !== ball);
            }
        }, 2000);
    }

    moveBall(ball);
    return ball;
}

// Ball Movement
function moveBall(ball) {
    const speed = LEVEL_CONFIG.getBallSpeed(gameState.level);
    let dx = (Math.random() - 0.5) * speed;
    let dy = (Math.random() - 0.5) * speed;

    function animate() {
        if (!gameState.isPlaying || !ball.parentElement) return;

        const playArea = document.getElementById('playArea');
        const rect = playArea.getBoundingClientRect();
        const ballRect = ball.getBoundingClientRect();

        let x = ballRect.left - rect.left + dx;
        let y = ballRect.top - rect.top + dy;

        // Wall bouncing
        if (x <= 0 || x >= rect.width - ballRect.width) dx = -dx;
        if (y <= 0 || y >= rect.height - ballRect.height) dy = -dy;

        ball.style.left = `${Math.max(0, Math.min(x, rect.width - ballRect.width))}px`;
        ball.style.top = `${Math.max(0, Math.min(y, rect.height - ballRect.height))}px`;

        requestAnimationFrame(animate);
    }

    animate();
}

// Ball Interaction
function handleBallClick(ball) {
    if (!gameState.isPlaying) return;

    const type = ball.dataset.type;
    const rect = ball.getBoundingClientRect();

    switch(type) {
        case 'normal':
            gameState.score++;
            gameState.goalProgress++;
            updateGoalProgress();
            showPopup('+1', rect, 'score');
            sounds.pop.play();
            break;
        case 'timeBonus':
            gameState.timeLeft = Math.min(gameState.timeLeft + 5, LEVEL_CONFIG.getTimeLimit(gameState.level));
            showPopup('+5s', rect, 'time-bonus');
            sounds.bonus.play();
            break;
        case 'timePenalty':
            gameState.timeLeft = Math.max(gameState.timeLeft - 3, 0);
            showPopup('-3s', rect, 'time-penalty');
            sounds.penalty.play();
            break;
        case 'danger':
            gameOver();
            return;
    }

    // Update stats
    gameState.globalStats.totalBallsClicked++;
    
    // Remove ball
    ball.remove();
    gameState.balls = gameState.balls.filter(b => b !== ball);

    // Spawn new ball
    const randomValue = Math.random();
    let newType = 'normal';
    if (randomValue > 0.7) newType = Math.random() > 0.5 ? 'timeBonus' : 'timePenalty';
    createBall(newType);
    ensureMinimumBalls();

    // Check level completion
    if (gameState.goalProgress >= gameState.currentGoal) levelComplete();
}

// Popup Effects
function showPopup(text, rect, type) {
    const popup = document.createElement('div');
    popup.className = `popup ${type}`;
    popup.textContent = text;
    popup.style.left = `${rect.left}px`;
    popup.style.top = `${rect.top}px`;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 1000);
}

// Ball Management
function ensureMinimumBalls() {
    const normalBalls = gameState.balls.filter(ball => ball.dataset.type === 'normal');
    if (normalBalls.length === 0) createBall('normal');
}

// Game Start
function startGame(level) {
    // Reset state
    gameState.level = level;
    gameState.score = 0;
    gameState.timeLeft = LEVEL_CONFIG.getTimeLimit(level);
    gameState.isPlaying = true;
    gameState.balls = [];
    gameState.currentGoal = LEVEL_CONFIG.getLevelGoal(level);
    gameState.goalProgress = 0;

    // Update UI
    document.getElementById('score').textContent = '0';
    document.getElementById('level').textContent = level;
    document.getElementById('timer').textContent = gameState.timeLeft;
    updateGoalProgress();

    // Clear play area
    const playArea = document.getElementById('playArea');
    playArea.innerHTML = '';

    // Initial balls
    for (let i = 0; i < LEVEL_CONFIG.getBallCount(level); i++) {
        createBall('normal');
    }

    // Danger balls for higher levels
    if (level > 1) {
        gameState.dangerInterval = setInterval(() => {
            if (Math.random() < 0.7) createBall('danger');
        }, LEVEL_CONFIG.getDangerBallInterval(level));
    }

    startTimer();
    showScreen('gameScreen');
}

// Initialize game
window.onload = initGame;