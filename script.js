// ==================== 
// GAME STATE MANAGEMENT
// ====================
let gameState = {
    player1: { score: 0, answer: '', problem: {} },
    player2: { score: 0, answer: '', problem: {} },
    gameMode: '',
    level: 1,
    gameActive: false,
    ropePosition: 0,
    maxRopeMove: 200
};

// ==================== 
// DOM ELEMENTS CACHE
// ====================
const elements = {
    mainMenu: document.getElementById('main-menu'),
    levelMenu: document.getElementById('level-menu'),
    levelTitle: document.getElementById('level-title'),
    levelDescription: document.getElementById('level-description'),
    levelGrid: document.querySelector('.level-grid'),
    gameContainer: document.getElementById('game-container'),
    countdownOverlay: document.getElementById('countdown-overlay'),
    countdown: document.getElementById('countdown'),
    problemP1: document.getElementById('problem-p1'),
    problemP2: document.getElementById('problem-p2'),
    answerP1: document.getElementById('answer-p1'),
    answerP2: document.getElementById('answer-p2'),
    keypadP1: document.getElementById('keypad-p1'),
    keypadP2: document.getElementById('keypad-p2'),
    rope: document.getElementById('rope'),
    statusMessage: document.getElementById('status-message'),
    scoreP1: document.getElementById('score-p1'),
    scoreP2: document.getElementById('score-p2')
};

// ==================== 
// MODE CONFIGURATIONS
// ====================
const modeConfigs = {
    'addition': {
        title: 'Penjumlahan',
        description: 'Soal penjumlahan 2 bilangan'
    },
    'addition3': {
        title: 'Penjumlahan 3 Bilangan',
        description: 'Soal penjumlahan 3 bilangan'
    },
    'subtraction': {
        title: 'Pengurangan', 
        description: 'Soal pengurangan 2 bilangan'
    },
    'subtraction3': {
        title: 'Pengurangan 3 Bilangan',
        description: 'Soal pengurangan 3 bilangan'
    },
    'addition-subtraction': {
        title: 'Penjumlahan & Pengurangan',
        description: 'Kombinasi penjumlahan dan pengurangan'
    },
    'addition-subtraction3': {
        title: 'Penjumlahan & Pengurangan 3 Bil',
        description: 'Kombinasi penjumlahan dan pengurangan 3 bilangan'
    },
    'multiplication': {
        title: 'Perkalian',
        description: 'Soal perkalian 2 bilangan'
    },
    'division': {
        title: 'Pembagian',
        description: 'Soal pembagian 2 bilangan'
    },
    'multiplication-division': {
        title: 'Perkalian & Pembagian',
        description: 'Kombinasi perkalian dan pembagian'
    },
    'all-operations': {
        title: 'Semua Operasi',
        description: 'Kombinasi semua operasi matematika'
    }
};

// ==================== 
// LEVEL CONFIGURATIONS
// ====================
const levelConfigs = {
    1: { maxNumber: 10, difficulty: 'Mudah' },
    2: { maxNumber: 20, difficulty: 'Mudah' },
    3: { maxNumber: 50, difficulty: 'Sedang' },
    4: { maxNumber: 100, difficulty: 'Sedang' },
    5: { maxNumber: 200, difficulty: 'Sedang' },
    6: { maxNumber: 500, difficulty: 'Sulit' },
    7: { maxNumber: 1000, difficulty: 'Sulit' },
    8: { maxNumber: 2000, difficulty: 'Sulit' },
    9: { maxNumber: 5000, difficulty: 'Expert' },
    10: { maxNumber: 10000, difficulty: 'Expert' }
};

// ==================== 
// EVENT LISTENERS SETUP
// ====================
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
});

// FUNCTION: Initialize all event listeners
function initializeEventListeners() {
    // Mode selection cards
    document.querySelectorAll('.mode-card').forEach(card => {
        card.addEventListener('click', function() {
            const selectedMode = this.dataset.mode;
            showLevelSelection(selectedMode);
        });
    });
}

// ==================== 
// MENU NAVIGATION
// ====================

// FUNCTION: Show level selection for chosen mode
function showLevelSelection(mode) {
    gameState.gameMode = mode;
    
    // Update level selection UI
    elements.levelTitle.textContent = `Level ${modeConfigs[mode].title}`;
    elements.levelDescription.textContent = modeConfigs[mode].description;
    
    // Generate level cards
    generateLevelCards();
    
    // Show level menu
    elements.mainMenu.style.display = 'none';
    elements.levelMenu.style.display = 'flex';
}

// FUNCTION: Generate level selection cards
function generateLevelCards() {
    elements.levelGrid.innerHTML = '';
    
    for (let level = 1; level <= 10; level++) {
        const levelCard = document.createElement('div');
        levelCard.className = `level-card ${getDifficultyClass(level)}`;
        levelCard.innerHTML = `
            <div class="level-number">${level}</div>
            <div class="level-difficulty">${levelConfigs[level].difficulty}</div>
            <div class="level-range">1-${levelConfigs[level].maxNumber}</div>
        `;
        
        levelCard.addEventListener('click', () => startGameWithLevel(level));
        elements.levelGrid.appendChild(levelCard);
    }
}

// FUNCTION: Get CSS class for difficulty level
function getDifficultyClass(level) {
    if (level <= 2) return 'easy';
    if (level <= 5) return 'medium';
    return 'hard';
}

// FUNCTION: Show main menu
function showMainMenu() {
    elements.levelMenu.style.display = 'none';
    elements.gameContainer.style.display = 'none';
    elements.mainMenu.style.display = 'flex';
}

// ==================== 
// GAME FLOW FUNCTIONS
// ====================

// FUNCTION: Start game with selected level
function startGameWithLevel(level) {
    gameState.level = level;
    elements.levelMenu.style.display = 'none';
    startCountdown();
}

// FUNCTION: Countdown before game starts
function startCountdown() {
    elements.countdownOverlay.style.display = 'flex';
    let count = 3;
    
    const countdownInterval = setInterval(() => {
        elements.countdown.textContent = count > 0 ? count : 'MULAI!';
        
        if (count === -1) {
            clearInterval(countdownInterval);
            elements.countdownOverlay.style.display = 'none';
            initializeGame();
        }
        count--;
    }, 1000);
}

// FUNCTION: Initialize game state and UI
function initializeGame() {
    elements.gameContainer.style.display = 'block';
    gameState.gameActive = true;
    resetGameState();
    
    createKeypads();
    generateNewProblems();
    
    updateStatusMessage('Jawab soal untuk menarik tali!', '#2c3e50');
    updateScores();
}

// FUNCTION: Reset game state to initial values
function resetGameState() {
    gameState.player1.score = 0;
    gameState.player2.score = 0;
    gameState.ropePosition = 0;
    updateRopePosition();
    updateScores();
}

// ==================== 
// KEYPAD MANAGEMENT
// ====================

// FUNCTION: Create keypads for both players
function createKeypads() {
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'GO'];
    
    [elements.keypadP1, elements.keypadP2].forEach((keypad, index) => {
        keypad.innerHTML = '';
        keys.forEach(key => {
            const button = createKeypadButton(key, index + 1);
            keypad.appendChild(button);
        });
    });
}

// FUNCTION: Create individual keypad button
function createKeypadButton(key, player) {
    const button = document.createElement('button');
    button.textContent = key;
    
    // Set button classes based on function
    if (key === 'GO') button.classList.add('action');
    if (key === 'C') button.classList.add('clear');
    
    // Add event listeners
    button.addEventListener('click', () => handleKeyPress(player, key));
    
    return button;
}

// ==================== 
// INPUT HANDLING
// ====================

// FUNCTION: Handle keypad button presses
function handleKeyPress(player, key) {
    if (!gameState.gameActive) return;
    
    const playerState = getPlayerState(player);
    const answerElement = getAnswerElement(player);
    
    switch (key) {
        case 'C':
            clearAnswer(playerState, answerElement);
            break;
        case 'GO':
            checkAnswer(player);
            break;
        default:
            appendDigit(playerState, answerElement, key);
    }
}

// FUNCTION: Get player state object
function getPlayerState(player) {
    return player === 1 ? gameState.player1 : gameState.player2;
}

// FUNCTION: Get answer display element
function getAnswerElement(player) {
    return player === 1 ? elements.answerP1 : elements.answerP2;
}

// FUNCTION: Clear player's answer
function clearAnswer(playerState, answerElement) {
    playerState.answer = '';
    answerElement.textContent = '';
    resetAnswerStyle(answerElement);
}

// FUNCTION: Append digit to player's answer
function appendDigit(playerState, answerElement, digit) {
    if (playerState.answer.length < 5) { // Increased for larger numbers
        playerState.answer += digit;
        answerElement.textContent = playerState.answer;
    }
}

// FUNCTION: Reset answer display styling
function resetAnswerStyle(answerElement) {
    answerElement.style.background = '#ecf0f1';
    answerElement.style.borderColor = '#bdc3c7';
}

// ==================== 
// PROBLEM GENERATION
// ====================

// FUNCTION: Generate new problems for both players
function generateNewProblems() {
    gameState.player1.problem = generateProblem();
    gameState.player2.problem = generateProblem();
    
    elements.problemP1.textContent = gameState.player1.problem.question;
    elements.problemP2.textContent = gameState.player2.problem.question;
    
    // Reset answers
    gameState.player1.answer = '';
    gameState.player2.answer = '';
    elements.answerP1.textContent = '';
    elements.answerP2.textContent = '';
}

// FUNCTION: Generate a math problem based on current mode and level
function generateProblem() {
    const maxNumber = levelConfigs[gameState.level].maxNumber;
    let question, answer;

    switch (gameState.gameMode) {
        // ====================
        // PENJUMLAHAN (2 bilangan)
        // ====================
        case 'addition':
            const num1 = getRandomInt(1, maxNumber);
            const num2 = getRandomInt(1, maxNumber);
            question = `${num1} + ${num2} = ?`;
            answer = num1 + num2;
            break;

        // ====================
        // PENJUMLAHAN 3 BILANGAN
        // ====================
        case 'addition3':
            const add1 = getRandomInt(1, maxNumber / 3);
            const add2 = getRandomInt(1, maxNumber / 3);
            const add3 = getRandomInt(1, maxNumber / 3);
            question = `${add1} + ${add2} + ${add3} = ?`;
            answer = add1 + add2 + add3;
            break;

        // ====================
        // PENGURANGAN (2 bilangan)
        // ====================
        case 'subtraction':
            const sub1 = getRandomInt(maxNumber / 2, maxNumber);
            const sub2 = getRandomInt(1, sub1 - 1);
            question = `${sub1} - ${sub2} = ?`;
            answer = sub1 - sub2;
            break;

        // ====================
        // PENGURANGAN 3 BILANGAN
        // ====================
        case 'subtraction3':
            const subA = getRandomInt(maxNumber / 2, maxNumber);
            const subB = getRandomInt(1, subA / 2);
            const subC = getRandomInt(1, (subA - subB));
            question = `${subA} - ${subB} - ${subC} = ?`;
            answer = subA - subB - subC;
            break;

        // ====================
        // PENJUMLAHAN & PENGURANGAN
        // ====================
        case 'addition-subtraction':
            const as1 = getRandomInt(1, maxNumber);
            const as2 = getRandomInt(1, maxNumber);
            const as3 = getRandomInt(1, as1 + as2 - 1);
            question = `${as1} + ${as2} - ${as3} = ?`;
            answer = as1 + as2 - as3;
            break;

        // ====================
        // PENJUMLAHAN & PENGURANGAN 3 BIL
        // ====================
        case 'addition-subtraction3':
            const asa = getRandomInt(1, maxNumber / 2);
            const asb = getRandomInt(1, maxNumber / 2);
            const asc = getRandomInt(1, maxNumber / 2);
            const asd = getRandomInt(1, (asa + asb + asc) - 1);
            question = `${asa} + ${asb} + ${asc} - ${asd} = ?`;
            answer = asa + asb + asc - asd;
            break;

        // ====================
        // PERKALIAN
        // ====================
        case 'multiplication':
            const mult1 = getRandomInt(1, Math.min(12, Math.sqrt(maxNumber)));
            const mult2 = getRandomInt(1, Math.min(12, Math.floor(maxNumber / mult1)));
            question = `${mult1} × ${mult2} = ?`;
            answer = mult1 * mult2;
            break;

        // ====================
        // PEMBAGIAN
        // ====================
        case 'division':
            const divisor = getRandomInt(2, 12);
            const quotient = getRandomInt(1, Math.floor(maxNumber / divisor));
            const dividend = divisor * quotient;
            question = `${dividend} ÷ ${divisor} = ?`;
            answer = quotient;
            break;

        // ====================
        // PERKALIAN & PEMBAGIAN
        // ====================
        case 'multiplication-division':
            const md1 = getRandomInt(2, 8);
            const md2 = getRandomInt(2, 8);
            const md3 = getRandomInt(2, 8);
            question = `${md1} × ${md2} ÷ ${md3} = ?`;
            answer = Math.floor((md1 * md2) / md3);
            break;

        // ====================
        // SEMUA OPERASI
        // ====================
        case 'all-operations':
            const operations = [
                () => { // Addition
                    const a = getRandomInt(1, maxNumber / 2);
                    const b = getRandomInt(1, maxNumber / 2);
                    return { q: `${a} + ${b} = ?`, a: a + b };
                },
                () => { // Subtraction
                    const a = getRandomInt(maxNumber / 2, maxNumber);
                    const b = getRandomInt(1, a - 1);
                    return { q: `${a} - ${b} = ?`, a: a - b };
                },
                () => { // Multiplication
                    const a = getRandomInt(2, 8);
                    const b = getRandomInt(2, 8);
                    return { q: `${a} × ${b} = ?`, a: a * b };
                },
                () => { // Division
                    const b = getRandomInt(2, 8);
                    const a = b * getRandomInt(2, 8);
                    return { q: `${a} ÷ ${b} = ?`, a: a / b };
                }
            ];
            const selectedOp = operations[getRandomInt(0, operations.length - 1)];
            const result = selectedOp();
            question = result.q;
            answer = result.a;
            break;

        default:
            // Default fallback
            const def1 = getRandomInt(1, 10);
            const def2 = getRandomInt(1, 10);
            question = `${def1} + ${def2} = ?`;
            answer = def1 + def2;
    }

    return { question, answer };
}

// ==================== 
// ANSWER CHECKING
// ====================

// FUNCTION: Check if player's answer is correct
function checkAnswer(player) {
    if (!gameState.gameActive) return;
    
    const playerState = getPlayerState(player);
    const answerElement = getAnswerElement(player);
    
    if (parseInt(playerState.answer) === playerState.problem.answer) {
        handleCorrectAnswer(player, playerState, answerElement);
    } else {
        handleWrongAnswer(playerState, answerElement);
    }
}

// FUNCTION: Handle correct answer
function handleCorrectAnswer(player, playerState, answerElement) {
    playerState.score++;
    updateRopePosition(player);
    showCorrectAnswerFeedback(answerElement);
    updateScores();
    
    setTimeout(() => {
        if (gameState.gameActive) {
            generateNewProblemForPlayer(player);
            resetAnswerDisplay(playerState, answerElement);
        }
    }, 500);
    
    checkGameEnd();
}

// FUNCTION: Handle wrong answer
function handleWrongAnswer(playerState, answerElement) {
    showWrongAnswerFeedback(answerElement);
    playerState.answer = '';
    setTimeout(() => {
        answerElement.textContent = '';
        resetAnswerStyle(answerElement);
    }, 1000);
}

// FUNCTION: Generate new problem for specific player
function generateNewProblemForPlayer(player) {
    const playerState = getPlayerState(player);
    const problemElement = getProblemElement(player);
    
    playerState.problem = generateProblem();
    problemElement.textContent = playerState.problem.question;
}

// FUNCTION: Get problem display element
function getProblemElement(player) {
    return player === 1 ? elements.problemP1 : elements.problemP2;
}

// ==================== 
// VISUAL FEEDBACK
// ====================

// FUNCTION: Show correct answer feedback
function showCorrectAnswerFeedback(answerElement) {
    answerElement.style.background = '#d4edda';
    answerElement.style.borderColor = '#28a745';
}

// FUNCTION: Show wrong answer feedback
function showWrongAnswerFeedback(answerElement) {
    answerElement.style.background = '#f8d7da';
    answerElement.style.borderColor = '#dc3545';
}

// FUNCTION: Update rope position based on game state
function updateRopePosition(player) {
    if (player === 1) {
        gameState.ropePosition = Math.max(gameState.ropePosition - 40, -gameState.maxRopeMove);
    } else {
        gameState.ropePosition = Math.min(gameState.ropePosition + 40, gameState.maxRopeMove);
    }
    elements.rope.style.transform = `translate(calc(-50% + ${gameState.ropePosition}px), -50%)`;
}

// FUNCTION: Update status message
function updateStatusMessage(message, color = '#2c3e50') {
    elements.statusMessage.textContent = message;
    elements.statusMessage.style.color = color;
}

// FUNCTION: Update score display
function updateScores() {
    elements.scoreP1.textContent = gameState.player1.score;
    elements.scoreP2.textContent = gameState.player2.score;
}

// ==================== 
// GAME END CONDITIONS
// ====================

// FUNCTION: Check if game should end
function checkGameEnd() {
    const scoreDiff = Math.abs(gameState.player1.score - gameState.player2.score);
    
    if (scoreDiff >= 5) {
        endGame();
    }
}

// FUNCTION: End game and show winner
function endGame() {
    gameState.gameActive = false;
    const winner = gameState.player1.score > gameState.player2.score ? 1 : 2;
    
    showWinnerCelebration(winner);
}

// FUNCTION: Show winner celebration
function showWinnerCelebration(winner) {
    updateStatusMessage(`Player ${winner} Menang! 🎉`, winner === 1 ? '#3498db' : '#e74c3c');
    
    // Celebration effect
    document.body.style.background = winner === 1 ? 
        'linear-gradient(135deg, #3498db, #2980b9)' : 
        'linear-gradient(135deg, #e74c3c, #c0392b)';
    
    setTimeout(() => {
        document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }, 2000);
}

// ==================== 
// UTILITY FUNCTIONS
// ====================

// FUNCTION: Get random integer
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// FUNCTION: Reset answer display for player
function resetAnswerDisplay(playerState, answerElement) {
    playerState.answer = '';
    answerElement.textContent = '';
    resetAnswerStyle(answerElement);
}

// ==================== 
// GAME CONTROL FUNCTIONS
// ====================

// FUNCTION: Reset game
function resetGame() {
    gameState.gameActive = false;
    setTimeout(() => {
        initializeGame();
    }, 500);
}

// FUNCTION: Share game
function shareGame() {
    if (navigator.share) {
        navigator.share({
            title: 'Tarik Tambang Matematika',
            text: 'Main game matematika seru ini!',
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(window.location.href);
        alert('Link game disalin ke clipboard!');
    }
}
